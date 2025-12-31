import React, { useMemo } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

/**
 * ResultsPieCard
 * Displays run status summary using Recharts PieChart and a clickable legend.
 *
 * Notes:
 * - "Passed" uses the app primary blue.
 * - "Failed" uses the app error red.
 * - Other statuses use muted palette consistent with the Ocean Professional theme.
 */

const STATUS_CONFIG = {
  passed: { label: "Passed", color: "rgba(37, 99, 235, 0.95)" }, // primary blue
  failed: { label: "Failed", color: "rgba(239, 68, 68, 0.95)" }, // error red
  running: { label: "Running", color: "rgba(245, 158, 11, 0.92)" }, // secondary amber
  queued: { label: "Queued", color: "rgba(107, 114, 128, 0.80)" }, // muted gray
};

function normalizeSummary(summary) {
  const safe = summary ?? {};
  return {
    passed: Number(safe.passed ?? 0),
    failed: Number(safe.failed ?? 0),
    running: Number(safe.running ?? 0),
    queued: Number(safe.queued ?? 0),
  };
}

// PUBLIC_INTERFACE
export default function ResultsPieCard({
  title = "Run Status",
  subtitle,
  summary = { passed: 0, failed: 0, running: 0, queued: 0 },
  isLoading = false,
  error = null,
  onRetry,
  onLegendItemClick,
}) {
  /** Render a donut pie chart with a status legend and totals. */

  const normalized = useMemo(() => normalizeSummary(summary), [summary]);

  const rows = useMemo(() => {
    const keys = Object.keys(STATUS_CONFIG);
    return keys.map((key) => ({
      key,
      name: STATUS_CONFIG[key].label,
      label: STATUS_CONFIG[key].label,
      color: STATUS_CONFIG[key].color,
      value: Number(normalized?.[key] ?? 0),
    }));
  }, [normalized]);

  const total = useMemo(() => rows.reduce((acc, r) => acc + r.value, 0), [rows]);
  const isEmpty = total <= 0;

  const titleId = "run-status-title";
  const descId = "run-status-desc";

  return (
    <article className="surface card resultsPieCard" aria-label="Run status card">
      <div className="cardHeader">
        <div>
          <h2 className="h2" id={titleId}>
            {title}
          </h2>
          {subtitle ? (
            <div className="muted" style={{ marginTop: 4 }} id={descId}>
              {subtitle}
            </div>
          ) : (
            <div className="srOnly" id={descId}>
              Run status chart and legend
            </div>
          )}
        </div>

        <span className="chip" aria-label="Total runs">
          Total: <strong>{total}</strong>
        </span>
      </div>

      <div className="cardBody resultsPieBody" aria-busy={isLoading ? "true" : "false"}>
        {isLoading ? (
          <div className="placeholderChart skeleton" aria-label="Loading chart" />
        ) : error ? (
          <div className="emptyState" role="alert" aria-label="Run status error">
            <div className="emptyStateTitle">Unable to load status</div>
            <div className="muted">{String(error)}</div>
            <div className="emptyStateActions">
              <button type="button" className="btn btn-secondary" onClick={onRetry}>
                Retry
              </button>
            </div>
          </div>
        ) : (
          <div
            className="pieWrap"
            role="group"
            aria-labelledby={titleId}
            aria-describedby={descId}
          >
            {isEmpty ? (
              <div className="emptyState" role="status" aria-label="No status data">
                <div className="emptyStateTitle">No run data</div>
                <div className="muted">Run a test to see results summarized here.</div>
                <div className="emptyStateActions">
                  <button type="button" className="btn btn-secondary" onClick={onRetry}>
                    Refresh
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Chart container: we provide a textual alternative via aria-describedby. */}
                <div className="pieChartFrame" aria-label="Run status donut chart">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={rows}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius="62%"
                        outerRadius="92%"
                        paddingAngle={2}
                        isAnimationActive={false}
                        stroke="rgba(255,255,255,0.92)"
                        strokeWidth={3}
                      >
                        {rows.map((entry) => (
                          <Cell key={entry.key} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="pieCenterLabel" aria-label="Total runs in center">
                  <div className="pieCenterNumber">{total}</div>
                  <div className="muted" style={{ fontSize: 12 }}>
                    runs
                  </div>
                </div>

                <div className="srOnly" aria-label="Run status breakdown">
                  {rows.map((r) => `${r.label}: ${r.value}`).join(", ")}
                </div>
              </>
            )}
          </div>
        )}

        <div className="legend" aria-label="Run status legend">
          {rows.map((r) => (
            <button
              key={r.key}
              type="button"
              className="legendRow"
              onClick={() => onLegendItemClick?.(r.key)}
              disabled={isLoading || !!error || (isEmpty && r.value === 0)}
              aria-label={`${r.label}: ${r.value}`}
            >
              <span
                className="legendSwatch"
                style={{ background: r.color }}
                aria-hidden="true"
              />
              <span className="legendLabel">{r.label}</span>
              <span className="legendValue">{r.value}</span>
            </button>
          ))}
        </div>
      </div>
    </article>
  );
}
