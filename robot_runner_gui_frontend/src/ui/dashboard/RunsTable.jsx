import React, { useMemo } from "react";

/**
 * RunsTable
 * A presentational, sortable-ready table (sorting can be added later).
 * Takes rows via props and emits row click events.
 */

function formatDuration(seconds) {
  if (seconds == null || Number.isNaN(Number(seconds))) return "—";
  const s = Math.max(0, Number(seconds));
  const mins = Math.floor(s / 60);
  const rem = Math.floor(s % 60);
  return mins > 0 ? `${mins}m ${rem}s` : `${rem}s`;
}

function formatDate(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString();
}

function statusBadge(status) {
  const normalized = String(status ?? "").toLowerCase();
  switch (normalized) {
    case "passed":
      return { label: "Passed", className: "badge badgeSuccess" };
    case "failed":
      return { label: "Failed", className: "badge badgeError" };
    case "running":
      return { label: "Running", className: "badge badgePrimary" };
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
  emptyStateLabel = "No runs found.",
  onRowClick,
}) {
  /** Render the bottom runs table section with loading and empty states. */

  const prepared = useMemo(
    () =>
      rows.map((row) => ({
        ...row,
        _status: statusBadge(row.status),
      })),
    [rows]
  );

  return (
    <article className="surface card" aria-label="Recent runs">
      <div className="cardHeader">
        <div>
          <h2 className="h2">{title}</h2>
          {subtitle ? <div className="muted" style={{ marginTop: 4 }}>{subtitle}</div> : null}
        </div>
        <span className="chip" aria-label="Run count">
          Runs: <strong>{rows.length}</strong>
        </span>
      </div>

      <div className="cardBody">
        {isLoading ? (
          <div className="placeholderTable skeleton" aria-label="Loading table" />
        ) : rows.length === 0 ? (
          <div className="muted">{emptyStateLabel}</div>
        ) : (
          <div className="tableWrap" role="region" aria-label="Runs table region" tabIndex={0}>
            <table className="runsTable">
              <thead>
                <tr>
                  <th scope="col">Run ID</th>
                  <th scope="col">Suite</th>
                  <th scope="col">Status</th>
                  <th scope="col">Started</th>
                  <th scope="col">Duration</th>
                  <th scope="col">Triggered by</th>
                </tr>
              </thead>
              <tbody>
                {prepared.map((row) => (
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
                    aria-label={`Run ${row.id}`}
                  >
                    <td className="mono">{row.id}</td>
                    <td>{row.suite}</td>
                    <td>
                      <span className={row._status.className}>{row._status.label}</span>
                    </td>
                    <td>{formatDate(row.startedAt)}</td>
                    <td>{formatDuration(row.durationSeconds)}</td>
                    <td>{row.triggeredBy ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </article>
  );
}
