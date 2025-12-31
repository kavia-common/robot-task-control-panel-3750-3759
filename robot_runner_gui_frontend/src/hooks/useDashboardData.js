import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  buildLogsUrl,
  fetchLatestSummary,
  fetchProjects,
  fetchRuns,
  startTest,
} from "../api/client";

/**
 * Small helper to safely read error messages.
 */
function toErrorMessage(err) {
  if (!err) return "Unknown error";
  if (typeof err === "string") return err;
  return err.message || "Unknown error";
}

/**
 * Build an optimistic placeholder run row for immediate UI feedback.
 */
function buildOptimisticRun(projectId) {
  const nowIso = new Date().toISOString();
  return {
    id: `optimistic-${Date.now()}`,
    projectId,
    suite: "default/suite",
    status: "queued",
    startedAt: nowIso,
    durationSeconds: null,
    triggeredBy: "ui",
    _optimistic: true,
  };
}

/**
 * Apply a created run into the current runs list (dedupe by id, insert on top).
 */
function mergeRunToTop(existing, newRun) {
  const safeExisting = Array.isArray(existing) ? existing : [];
  const filtered = safeExisting.filter((r) => r?.id !== newRun?.id);
  return [newRun, ...filtered];
}

// PUBLIC_INTERFACE
export function useDashboardData(projectId) {
  /**
   * Load projects list, manage active project selection, fetch latest summary and runs,
   * and provide a Start Test handler that performs an optimistic insert and then refreshes.
   *
   * Params:
   * - projectId: optional externally controlled project id. If undefined, the hook manages selection.
   *
   * Returns:
   * - projects, selectedProjectId, selectedProject
   * - summary, runs
   * - isLoadingProjects, isLoadingSummary, isLoadingRuns, isStarting
   * - error (string|null)
   * - handlers: selectProject(id), startTestRun(), refresh(), openLogs(run)
   */
  const [projects, setProjects] = useState([]);
  const [internalSelectedProjectId, setInternalSelectedProjectId] = useState(null);

  const [summary, setSummary] = useState({
    passed: 0,
    failed: 0,
    running: 0,
    queued: 0,
  });
  const [runs, setRuns] = useState([]);

  const [isLoadingProjects, setIsLoadingProjects] = useState(false);
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);
  const [isLoadingRuns, setIsLoadingRuns] = useState(false);
  const [isStarting, setIsStarting] = useState(false);

  const [error, setError] = useState(null);

  // Prefer external projectId if supplied; otherwise use internal state.
  const selectedProjectId = projectId ?? internalSelectedProjectId;

  const selectedProject = useMemo(() => {
    if (!selectedProjectId) return null;
    return projects.find((p) => p.id === selectedProjectId) ?? null;
  }, [projects, selectedProjectId]);

  // Prevent state updates after unmount + allow ignoring stale async responses.
  const isMountedRef = useRef(true);
  const requestSeq = useRef(0);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const safeSetError = useCallback((value) => {
    if (!isMountedRef.current) return;
    setError(value);
  }, []);

  const loadProjects = useCallback(async () => {
    setIsLoadingProjects(true);
    safeSetError(null);

    const seq = ++requestSeq.current;
    try {
      const list = await fetchProjects();
      if (!isMountedRef.current || seq !== requestSeq.current) return;

      const normalized = Array.isArray(list) ? list : [];
      setProjects(normalized);

      // If hook is managing selection, choose a default project once we have data.
      if (projectId == null) {
        setInternalSelectedProjectId((prev) => {
          if (prev) return prev;
          return normalized[0]?.id ?? null;
        });
      }
    } catch (e) {
      if (!isMountedRef.current || seq !== requestSeq.current) return;
      safeSetError(toErrorMessage(e));
      setProjects([]);
      if (projectId == null) setInternalSelectedProjectId(null);
    } finally {
      if (!isMountedRef.current || seq !== requestSeq.current) return;
      setIsLoadingProjects(false);
    }
  }, [projectId, safeSetError]);

  const loadSummaryAndRuns = useCallback(
    async (pid) => {
      if (!pid) {
        setSummary({ passed: 0, failed: 0, running: 0, queued: 0 });
        setRuns([]);
        return;
      }

      const seq = ++requestSeq.current;
      safeSetError(null);

      setIsLoadingSummary(true);
      setIsLoadingRuns(true);

      try {
        const [nextSummary, nextRuns] = await Promise.all([
          fetchLatestSummary(pid),
          fetchRuns(pid),
        ]);

        if (!isMountedRef.current || seq !== requestSeq.current) return;

        setSummary(
          nextSummary ?? { passed: 0, failed: 0, running: 0, queued: 0 }
        );
        setRuns(Array.isArray(nextRuns) ? nextRuns : []);
      } catch (e) {
        if (!isMountedRef.current || seq !== requestSeq.current) return;
        safeSetError(toErrorMessage(e));
        setSummary({ passed: 0, failed: 0, running: 0, queued: 0 });
        setRuns([]);
      } finally {
        if (!isMountedRef.current || seq !== requestSeq.current) return;
        setIsLoadingSummary(false);
        setIsLoadingRuns(false);
      }
    },
    [safeSetError]
  );

  const refresh = useCallback(async () => {
    // Refresh project list (in case lastRunAt changed) and then refresh the current project data.
    await loadProjects();
    await loadSummaryAndRuns(selectedProjectId);
  }, [loadProjects, loadSummaryAndRuns, selectedProjectId]);

  useEffect(() => {
    // Initial boot: fetch projects.
    loadProjects();
  }, [loadProjects]);

  useEffect(() => {
    // When selection changes (external or internal), fetch data for that project.
    loadSummaryAndRuns(selectedProjectId);
  }, [loadSummaryAndRuns, selectedProjectId]);

  const selectProject = useCallback(
    (nextId) => {
      if (projectId != null) {
        // External control mode: we do not mutate selection.
        return;
      }
      setInternalSelectedProjectId(nextId);
    },
    [projectId]
  );

  const startTestRun = useCallback(async () => {
    if (!selectedProjectId || isStarting) return;

    setIsStarting(true);
    safeSetError(null);

    // Optimistic UX: insert a queued run immediately, then replace/refresh.
    const optimistic = buildOptimisticRun(selectedProjectId);
    setRuns((prev) => mergeRunToTop(prev, optimistic));

    try {
      const created = await startTest(selectedProjectId);

      // Replace optimistic row with actual run if possible.
      if (created?.id) {
        setRuns((prev) => {
          const withoutOptimistic = (prev ?? []).filter(
            (r) => r?.id !== optimistic.id
          );
          return mergeRunToTop(withoutOptimistic, created);
        });
      }

      // Always refresh to pick up mock progression + updated summary counts.
      await loadProjects();
      await loadSummaryAndRuns(selectedProjectId);
    } catch (e) {
      // Roll back optimistic insert on error.
      setRuns((prev) => (prev ?? []).filter((r) => r?.id !== optimistic.id));
      safeSetError(toErrorMessage(e));
    } finally {
      setIsStarting(false);
    }
  }, [
    isStarting,
    loadProjects,
    loadSummaryAndRuns,
    safeSetError,
    selectedProjectId,
  ]);

  const openLogs = useCallback((run) => {
    const url = buildLogsUrl(run);
    if (!url) return;
    window.open(url, "_blank", "noopener,noreferrer");
  }, []);

  return {
    projects,
    selectedProjectId,
    selectedProject,

    summary,
    runs,

    isLoadingProjects,
    isLoadingSummary,
    isLoadingRuns,
    isStarting,

    error,

    selectProject,
    startTestRun,
    refresh,
    openLogs,
  };
}

export default useDashboardData;
