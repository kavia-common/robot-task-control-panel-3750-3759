import React from "react";
import { useLocation } from "react-router-dom";
import { useAppState } from "../state/AppState";

function titleForPath(pathname) {
  if (pathname === "/") return { title: "Dashboard", subtitle: "Overview of tasks, runners, and active runs." };
  if (pathname.startsWith("/tasks")) return { title: "Task Library", subtitle: "Browse and inspect available tasks." };
  if (pathname.startsWith("/runner")) return { title: "Runner Control", subtitle: "Start/stop runs and manage runners." };
  if (pathname.startsWith("/monitor")) return { title: "Live Monitoring", subtitle: "View logs and run status in near real-time." };
  if (pathname.startsWith("/settings")) return { title: "Settings", subtitle: "Connection settings and preferences." };
  return { title: "Robot Runner", subtitle: "Control panel" };
}

// PUBLIC_INTERFACE
export function Header() {
  /** Sticky top header providing context and quick actions. */
  const location = useLocation();
  const { state, actions } = useAppState();
  const { title, subtitle } = titleForPath(location.pathname);

  return (
    <header className="header">
      <div className="headerRow">
        <div className="headerTitle">
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </div>

        <div className="headerActions">
          <span className="pill" title={state.realtime.reason}>
            <strong style={{ color: "var(--text)" }}>{state.realtime.mode.toUpperCase()}</strong>
            <span style={{ color: "var(--text-3)" }}>
              {state.realtime.connected ? "connected" : "fallback"}
            </span>
          </span>

          <button className="btn btnSmall" onClick={() => actions.refreshAll()} type="button">
            Refresh
          </button>

          <button
            className="btn btnSmall btnPrimary"
            onClick={() => actions.setTheme(state.theme === "light" ? "dark" : "light")}
            type="button"
            aria-label="Toggle theme"
            title="Toggle theme"
          >
            {state.theme === "light" ? "Dark" : "Light"}
          </button>
        </div>
      </div>
    </header>
  );
}
