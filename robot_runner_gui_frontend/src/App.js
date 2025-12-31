import React, { useMemo, useState } from "react";
import "./App.css";

/**
 * Mock navigation for the left sidebar. We keep this local for Step 1
 * and will expand it in later steps as routes/pages are introduced.
 */
const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard" },
  { id: "runs", label: "Test Runs" },
  { id: "suites", label: "Suites" },
  { id: "settings", label: "Settings" },
];

// PUBLIC_INTERFACE
function App() {
  /** Selected sidebar tab (mock state for now). */
  const [activeNav, setActiveNav] = useState("dashboard");

  const activeLabel = useMemo(() => {
    const item = NAV_ITEMS.find((n) => n.id === activeNav);
    return item ? item.label : "Dashboard";
  }, [activeNav]);

  return (
    <div className="appShell">
      <aside className="sidebar" aria-label="Primary navigation">
        <div className="brand" aria-label="Application brand">
          <div className="brandMark" aria-hidden="true" />
          <div className="brandTitle">
            <strong>Robot Runner</strong>
            <span>Test Automation</span>
          </div>
        </div>

        <div className="navSectionTitle">Navigation</div>

        <nav className="nav">
          {NAV_ITEMS.map((item) => {
            const isActive = item.id === activeNav;
            return (
              <button
                key={item.id}
                type="button"
                className={`navItem ${isActive ? "navItemActive" : ""}`}
                onClick={() => setActiveNav(item.id)}
                aria-current={isActive ? "page" : undefined}
              >
                <span className="navItemLabel">
                  <span className="navDot" aria-hidden="true" />
                  {item.label}
                </span>

                {isActive && <span className="chip">Active</span>}
              </button>
            );
          })}
        </nav>

        <div className="navSectionTitle">Status</div>
        <div className="chip" role="status" aria-label="Backend connection status">
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: 999,
              background: "rgba(107, 114, 128, 0.7)",
              display: "inline-block",
            }}
            aria-hidden="true"
          />
          Mock mode (no backend)
        </div>
      </aside>

      <main className="main">
        <header className="header">
          <div className="headerLeft">
            <h1 className="h1">Test Automation Dashboard</h1>
            <div className="muted">
              Viewing: <strong>{activeLabel}</strong>
            </div>
          </div>

          <div className="headerRight">
            <button type="button" className="btn btn-secondary">
              Filters (placeholder)
            </button>
            <button type="button" className="btn btn-primary">
              Start Test (placeholder)
            </button>
          </div>
        </header>

        <section className="contentGrid" aria-label="Dashboard content">
          <article className="surface card" aria-label="Run status chart">
            <div className="cardHeader">
              <h2 className="h2">Run Status</h2>
              <span className="muted">Last 7 days (mock)</span>
            </div>
            <div className="cardBody">
              <div className="placeholderChart skeleton" aria-hidden="true" />
              <div className="muted">
                Placeholder for pie chart (implemented in next step).
              </div>
            </div>
          </article>

          <article className="surface card" aria-label="Quick actions">
            <div className="cardHeader">
              <h2 className="h2">Quick Actions</h2>
              <span className="muted">Mock</span>
            </div>
            <div className="cardBody">
              <div className="muted">
                This area will hold run controls and summary stats.
              </div>
              <div className="chip">Selected suite: (placeholder)</div>
              <div className="chip">Environment: (placeholder)</div>
            </div>
          </article>

          <article
            className="surface card"
            style={{ gridColumn: "1 / -1" }}
            aria-label="Recent history"
          >
            <div className="cardHeader">
              <h2 className="h2">Recent Test History</h2>
              <span className="muted">Mock table</span>
            </div>
            <div className="cardBody">
              <div className="placeholderTable skeleton" aria-hidden="true" />
              <div className="muted">
                Placeholder for history table (implemented in next step).
              </div>
            </div>
          </article>
        </section>
      </main>
    </div>
  );
}

export default App;
