import React, { useMemo } from "react";
import { buildLogsUrl } from "../../api/client";

/**
 * RunsTable
 * A presentational table for recent runs.
 * - Handles loading + empty states.
 * - Formats timestamps and duration.
 * - Shows status badges with requested colors:
 *   - Passed: primary blue
 *   - Failed: error red
 * - Provides a per-row Logs link.
 */

function pad2(n) {
  return String(n).padStart(2, "0");
}

function formatDurationMmSs(seconds) {
  if (seconds == null || Number.isNaN(Number(seconds))) return "—";
  const s = Math.max(0, Math.floor(Number(seconds)));
  const mins = Math.floor(s / 60);
  const rem = s % 60;
  return `${pad2(mins)}:${pad2(rem)}`;
}

function formatTimestampLocal(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function statusBadge(status) {
  const normalized = String(status ?? "").toLowerCase();
  switch (normalized) {
    case "passed":
      // Requirement: primary blue for Pass
      return { label: "Passed", className: "badge badgePrimary" };
    case "failed":
      // Requirement: error red for Fail
      return { label: "Failed", className: "badge badgeError" };
    case "running":
      return { label: "Running", className: "badge badgeMuted" };
    case "queued":
      return { label: "Queued", className: "badge badgeMuted" };
    default:
      return { label: normalized || "Unknown", className: "badge badgeMuted" };
  }
}

// PUBLIC_INTERFACE
export default function RunsTable({
  title = "Recent Test History",
  subtitle,
  rows = [],
  isLoading = false,
  error = null,
  onRetry,
  emptyStateLabel = "No runs found.",
  onRowClick,
}) {
  /** Render the runs table with proper formatting and a Logs link per row. */

  const prepared = useMemo(
    () =>
      (Array.isArray(rows) ? rows : []).map((row) => {
        const logsUrl = buildLogsUrl(row);
        return {
          ...row,
          _status: statusBadge(row.status),
          _logsUrl: logsUrl,
        };
      }),
    [rows]
  );

  const tableTitleId = "runs-table-title";
  const tableDescId = "runs-table-desc";

  return (
    <article className="surface card" aria-label="Recent runs">
      <div className="cardHeader">
        <div>
          <h2 className="h2" id={tableTitleId}>
            {title}
          </h2>
          {subtitle ? (
            <div className="muted" style={{ marginTop: 4 }} id={tableDescId}>
              {subtitle}
            </div>
          ) : (
            <div className="srOnly" id={tableDescId}>
              Recent runs table
            </div>
          )}
        </div>
        <span className="chip" aria-label="Run count">
          Runs: <strong>{Array.isArray(rows) ? rows.length : 0}</strong>
        </span>
      </div>

      <div className="cardBody" aria-busy={isLoading ? "true" : "false"}>
        {isLoading ? (
          <div className="placeholderTable skeleton" aria-label="Loading table" />
        ) : error ? (
          <div className="emptyState" role="alert" aria-label="Runs table error">
            <div className="emptyStateTitle">Unable to load runs</div>
            <div className="muted">{String(error)}</div>
            <div className="emptyStateActions">
              <button type="button" className="btn btn-secondary" onClick={onRetry}>
                Retry
              </button>
            </div>
          </div>
        ) : !Array.isArray(rows) || rows.length === 0 ? (
          <div className="emptyState" role="status" aria-label="No runs">
            <div className="emptyStateTitle">No runs</div>
            <div className="muted">{emptyStateLabel}</div>
            <div className="emptyStateActions">
              <button type="button" className="btn btn-secondary" onClick={onRetry}>
                Refresh
              </button>
            </div>
          </div>
        ) : (
          <div
            className="tableWrap"
            role="region"
            aria-labelledby={tableTitleId}
            aria-describedby={tableDescId}
            tabIndex={0}
          >
            <table className="runsTable">
              <thead>
                <tr>
                  <th scope="col">Run ID</th>
                  <th scope="col">Suite</th>
                  <th scope="col">Status</th>
                  <th scope="col">Started</th>
                  <th scope="col">Duration</th>
                  <th scope="col">Triggered by</th>
                  <th scope="col">Logs</th>
                </tr>
              </thead>
              <tbody>
                {prepared.map((row) => {
                  const isOptimistic = Boolean(row._optimistic);
                  const rowLabel = isOptimistic
                    ? `Run ${row.id}, queued (optimistic)`
                    : `Run ${row.id}`;

                  return (
                    <tr
                      key={row.id}
                      className="runsRow"
                      onClick={() => onRowClick?.(row)}
                      tabIndex={0}
                      role="button"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          onRowClick?.(row);
                        }
                      }}
                      aria-label={rowLabel}
                      aria-disabled={isOptimistic ? "true" : "false"}
                    >
                      <td className="mono">{row.id}</td>
                      <td>{row.suite ?? "—"}</td>
                      <td>
                        <span className={row._status.className}>{row._status.label}</span>
                        {isOptimistic ? (
                          <span className="srOnly">Optimistic pending row</span>
                        ) : null}
                      </td>
                      <td>{formatTimestampLocal(row.startedAt)}</td>
                      <td className="mono">{formatDurationMmSs(row.durationSeconds)}</td>
                      <td>{row.triggeredBy ?? "—"}</td>
                      <td>
                        {row._logsUrl ? (
                          <a
                            className="logsLink"
                            href={row._logsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`View logs for run ${row.id}`}
                            onClick={(e) => {
                              // Don't trigger row click when user explicitly clicks Logs.
                              e.stopPropagation();
                            }}
                            onKeyDown={(e) => e.stopPropagation()}
                          >
                            View logs
                          </a>
                        ) : (
                          <span className="muted">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <div className="tableLegend" aria-label="Status legend">
              <span className="tableLegendItem">
                <span className="tableLegendSwatch tableLegendSwatchPass" aria-hidden="true" />
                Pass
              </span>
              <span className="tableLegendItem">
                <span className="tableLegendSwatch tableLegendSwatchFail" aria-hidden="true" />
                Fail
              </span>
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
