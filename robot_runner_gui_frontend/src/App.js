import React, { useMemo } from "react";
import { NavLink, Route, Routes } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";
import "./App.css";

/**
 * Sidebar navigation items.
 * We keep other routes as placeholders for now; only "/" is implemented in this step.
 */
const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", to: "/" },
  { id: "runs", label: "Test Runs", to: "/runs" },
  { id: "suites", label: "Suites", to: "/suites" },
  { id: "settings", label: "Settings", to: "/settings" },
];

// PUBLIC_INTERFACE
function App() {
  const activeLabel = useMemo(() => "Dashboard", []);

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
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.id}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                `navItem ${isActive ? "navItemActive" : ""}`
              }
              aria-label={item.label}
            >
              <span className="navItemLabel">
                <span className="navDot" aria-hidden="true" />
                {item.label}
              </span>
              <span className="chip" aria-hidden="true">
                Link
              </span>
            </NavLink>
          ))}
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

        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route
            path="*"
            element={
              <section className="surface card" aria-label="Placeholder route">
                <div className="cardHeader">
                  <h2 className="h2">Coming soon</h2>
                  <span className="muted">Placeholder</span>
                </div>
                <div className="cardBody">
                  <div className="muted">
                    This route is not implemented yet. Use the Dashboard for now.
                  </div>
                </div>
              </section>
            }
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;
