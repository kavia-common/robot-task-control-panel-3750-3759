import React, { useMemo } from "react";

/**
 * ResultsPieCard
 * Displays run status summary with a centered pie placeholder and a legend.
 * This is intentionally chart-library-free for now (mock-friendly).
 */

const STATUS_CONFIG = {
  passed: { label: "Passed", color: "rgba(34, 197, 94, 0.9)" },
  failed: { label: "Failed", color: "rgba(239, 68, 68, 0.9)" },
  running: { label: "Running", color: "rgba(37, 99, 235, 0.9)" },
  queued: { label: "Queued", color: "rgba(107, 114, 128, 0.85)" },
};

// PUBLIC_INTERFACE
export default function ResultsPieCard({
  title = "Run Status",
  subtitle,
  summary = { passed: 0, failed: 0, running: 0, queued: 0 },
  isLoading = false,
  onLegendItemClick,
}) {
  /** Render a pie-chart styled placeholder with a status legend and totals. */

  const rows = useMemo(() => {
    const keys = Object.keys(STATUS_CONFIG);
    return keys.map((key) => ({
      key,
      label: STATUS_CONFIG[key].label,
      color: STATUS_CONFIG[key].color,
      value: Number(summary?.[key] ?? 0),
    }));
  }, [summary]);

  const total = useMemo(() => rows.reduce((acc, r) => acc + r.value, 0), [rows]);

  return (
    <article className="surface card resultsPieCard" aria-label="Run status card">
      <div className="cardHeader">
        <div>
          <h2 className="h2">{title}</h2>
          {subtitle ? <div className="muted" style={{ marginTop: 4 }}>{subtitle}</div> : null}
        </div>
        <span className="chip" aria-label="Total runs">
          Total: <strong>{total}</strong>
        </span>
      </div>

      <div className="cardBody resultsPieBody">
        {isLoading ? (
          <div className="placeholderChart skeleton" aria-label="Loading chart" />
        ) : (
          <div className="pieWrap" aria-label="Pie chart placeholder">
            <div className="pieRing" aria-hidden="true" />
            <div className="pieCenterLabel" aria-label="Total runs in center">
              <div className="pieCenterNumber">{total}</div>
              <div className="muted" style={{ fontSize: 12 }}>
                runs
              </div>
            </div>
          </div>
        )}

        <div className="legend" aria-label="Run status legend">
          {rows.map((r) => (
            <button
              key={r.key}
              type="button"
              className="legendRow"
              onClick={() => onLegendItemClick?.(r.key)}
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
