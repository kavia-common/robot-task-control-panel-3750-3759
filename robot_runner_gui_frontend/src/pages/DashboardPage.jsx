import React from "react";

/**
 * DashboardPage (scaffold)
 * This page intentionally uses placeholders only; data wiring and real components
 * will be added in later steps.
 */

// PUBLIC_INTERFACE
export default function DashboardPage() {
  /** Dashboard route "/" scaffold. */
  return (
    <section aria-label="Dashboard page">
      <div className="contentGrid" aria-label="Dashboard layout">
        <article className="surface card" aria-label="Projects list (sidebar placeholder)">
          <div className="cardHeader">
            <h2 className="h2">Projects</h2>
            <span className="muted">Placeholder</span>
          </div>
          <div className="cardBody">
            <div className="muted">
              Placeholder for sidebar projects list (will become interactive).
            </div>
            <div className="chip">Selected project: (placeholder)</div>
          </div>
        </article>

        <article className="surface card" aria-label="Run status pie chart">
          <div className="cardHeader">
            <h2 className="h2">Run Status</h2>
            <span className="muted">Pie chart placeholder</span>
          </div>
          <div className="cardBody">
            <div className="placeholderChart skeleton" aria-hidden="true" />
            <div className="muted">Placeholder for pie chart (next step).</div>
            <button type="button" className="btn btn-primary" style={{ width: "fit-content" }}>
              Start Test (placeholder)
            </button>
          </div>
        </article>

        <article
          className="surface card"
          style={{ gridColumn: "1 / -1" }}
          aria-label="Recent test history table"
        >
          <div className="cardHeader">
            <h2 className="h2">Recent Test History</h2>
            <span className="muted">Table placeholder</span>
          </div>
          <div className="cardBody">
            <div className="placeholderTable skeleton" aria-hidden="true" />
            <div className="muted">
              Placeholder for bottom table (runs, suite, status, timestamp, duration).
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
