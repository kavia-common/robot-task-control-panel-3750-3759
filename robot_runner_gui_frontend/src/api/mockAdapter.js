/**
 * Mock API adapter (in-memory).
 * Provides the same function signatures as the real API client so the UI can swap seamlessly.
 */

/** Simulated latency helper. */
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Random-ish latency to make UI feel realistic. */
function jitter(min = 180, max = 520) {
  return Math.floor(min + Math.random() * (max - min + 1));
}

/** ISO helper */
function toIso(d) {
  return d.toISOString();
}

/**
 * In-memory store.
 * Note: This is module-scoped so it persists for the lifetime of the page session.
 */
const store = (() => {
  const now = Date.now();

  const projects = [
    {
      id: "proj-1",
      name: "Warehouse Regression",
      description: "Nightly E2E suite",
      lastRunAt: toIso(new Date(now - 2 * 60 * 60 * 1000)),
    },
    {
      id: "proj-2",
      name: "Robot Arm Calibration",
      description: "Calibration validations",
      lastRunAt: toIso(new Date(now - 6 * 60 * 60 * 1000)),
    },
    {
      id: "proj-3",
      name: "Navigation Smoke",
      description: "Quick smoke checks",
      lastRunAt: toIso(new Date(now - 28 * 60 * 60 * 1000)),
    },
  ];

  /** Runs indexed by projectId */
  const runsByProject = {
    "proj-1": [
      {
        id: "run-1024",
        projectId: "proj-1",
        suite: "e2e/warehouse",
        status: "passed",
        startedAt: toIso(new Date(now - 2 * 60 * 60 * 1000)),
        durationSeconds: 562,
        triggeredBy: "scheduler",
        logsPath: "/mock/logs/run-1024",
      },
      {
        id: "run-1023",
        projectId: "proj-1",
        suite: "e2e/warehouse",
        status: "failed",
        startedAt: toIso(new Date(now - 5 * 60 * 60 * 1000)),
        durationSeconds: 611,
        triggeredBy: "alex",
        logsPath: "/mock/logs/run-1023",
      },
      {
        id: "run-1018",
        projectId: "proj-1",
        suite: "e2e/warehouse",
        status: "passed",
        startedAt: toIso(new Date(now - 27 * 60 * 60 * 1000)),
        durationSeconds: 534,
        triggeredBy: "api",
        logsPath: "/mock/logs/run-1018",
      },
    ],
    "proj-2": [
      {
        id: "run-2042",
        projectId: "proj-2",
        suite: "calibration/arm",
        status: "passed",
        startedAt: toIso(new Date(now - 6 * 60 * 60 * 1000)),
        durationSeconds: 312,
        triggeredBy: "sam",
        logsPath: "/mock/logs/run-2042",
      },
      {
        id: "run-2041",
        projectId: "proj-2",
        suite: "calibration/arm",
        status: "queued",
        startedAt: toIso(new Date(now - 6.2 * 60 * 60 * 1000)),
        durationSeconds: null,
        triggeredBy: "scheduler",
        logsPath: "/mock/logs/run-2041",
      },
    ],
    "proj-3": [
      {
        id: "run-3007",
        projectId: "proj-3",
        suite: "smoke/navigation",
        status: "running",
        startedAt: toIso(new Date(now - 25 * 60 * 1000)),
        durationSeconds: 190,
        triggeredBy: "api",
        logsPath: "/mock/logs/run-3007",
      },
      {
        id: "run-3006",
        projectId: "proj-3",
        suite: "smoke/navigation",
        status: "passed",
        startedAt: toIso(new Date(now - 29 * 60 * 60 * 1000)),
        durationSeconds: 144,
        triggeredBy: "scheduler",
        logsPath: "/mock/logs/run-3006",
      },
    ],
  };

  function listProjects() {
    // Return stable ordering: most recently run first.
    const copy = [...projects];
    copy.sort((a, b) => {
      const aTs = a?.lastRunAt ? new Date(a.lastRunAt).getTime() : 0;
      const bTs = b?.lastRunAt ? new Date(b.lastRunAt).getTime() : 0;
      return bTs - aTs;
    });
    return copy;
  }

  function listRuns(projectId) {
    const rows = runsByProject[projectId] ? [...runsByProject[projectId]] : [];
    rows.sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime());
    return rows;
  }

  function computeSummary(projectId) {
    const runs = listRuns(projectId);
    const summary = { passed: 0, failed: 0, running: 0, queued: 0 };

    runs.forEach((r) => {
      const key = String(r.status ?? "").toLowerCase();
      if (Object.prototype.hasOwnProperty.call(summary, key)) {
        summary[key] += 1;
      }
    });

    return summary;
  }

  function startRun(projectId) {
    const projectRuns = runsByProject[projectId] ?? [];
    runsByProject[projectId] = projectRuns;

    const idSuffix = Math.floor(1000 + Math.random() * 9000);
    const runId = `run-${Date.now()}-${idSuffix}`;

    const newRun = {
      id: runId,
      projectId,
      suite: "default/suite",
      status: "queued",
      startedAt: toIso(new Date()),
      durationSeconds: null,
      triggeredBy: "ui",
      logsPath: `/mock/logs/${runId}`,
    };

    // Insert at top.
    projectRuns.unshift(newRun);

    // Update project's last run time.
    const project = projects.find((p) => p.id === projectId);
    if (project) project.lastRunAt = newRun.startedAt;

    // Simulate progression: queued -> running -> passed/failed.
    // This is intentionally simple, but good enough for UI interactions.
    setTimeout(() => {
      newRun.status = "running";
      newRun.durationSeconds = Math.floor(15 + Math.random() * 80);
    }, 900);

    setTimeout(() => {
      newRun.status = Math.random() < 0.18 ? "failed" : "passed";
      // settle duration to something plausible
      newRun.durationSeconds = Math.floor(90 + Math.random() * 600);
    }, 3800);

    return newRun;
  }

  return {
    listProjects,
    listRuns,
    computeSummary,
    startRun,
  };
})();

// PUBLIC_INTERFACE
export async function fetchProjects() {
  /** Returns a list of available projects. */
  await sleep(jitter());
  return store.listProjects();
}

// PUBLIC_INTERFACE
export async function fetchLatestSummary(projectId) {
  /** Returns the latest status summary for a project. */
  await sleep(jitter());
  if (!projectId) {
    return { passed: 0, failed: 0, running: 0, queued: 0 };
  }
  return store.computeSummary(projectId);
}

// PUBLIC_INTERFACE
export async function fetchRuns(projectId) {
  /** Returns recent runs for a project. */
  await sleep(jitter());
  if (!projectId) return [];
  return store.listRuns(projectId);
}

// PUBLIC_INTERFACE
export async function startTest(projectId) {
  /** Starts a new test run for the given project and returns the created run. */
  await sleep(jitter(260, 720));
  if (!projectId) {
    const err = new Error("projectId is required to start a test");
    err.code = "VALIDATION_ERROR";
    throw err;
  }
  return store.startRun(projectId);
}

// PUBLIC_INTERFACE
export function buildLogsUrl(run) {
  /** Builds a URL to view logs for a run (mock URL). */
  const id = run?.id ?? "";
  // Use a predictable URL for now (the UI can open this in a new tab).
  return run?.logsUrl ?? `${window.location.origin}${run?.logsPath ?? `/mock/logs/${id}`}`;
}
