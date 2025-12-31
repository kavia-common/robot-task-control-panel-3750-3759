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

  return (
    <article className="surface card resultsPieCard" aria-label="Run status card">
      <div className="cardHeader">
        <div>
          <h2 className="h2">{title}</h2>
          {subtitle ? (
            <div className="muted" style={{ marginTop: 4 }}>
              {subtitle}
            </div>
          ) : null}
        </div>

        <span className="chip" aria-label="Total runs">
          Total: <strong>{total}</strong>
        </span>
      </div>

      <div className="cardBody resultsPieBody">
        {isLoading ? (
          <div className="placeholderChart skeleton" aria-label="Loading chart" />
        ) : (
          <div className="pieWrap" aria-label="Run status pie chart">
            {isEmpty ? (
              <div className="muted" style={{ textAlign: "center", padding: 12 }}>
                No run data yet.
              </div>
            ) : (
              <div className="pieChartFrame" aria-label="Donut chart">
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
            )}

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
              disabled={isLoading || (isEmpty && r.value === 0)}
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
