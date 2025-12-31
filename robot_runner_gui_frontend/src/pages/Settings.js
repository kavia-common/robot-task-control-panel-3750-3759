import React from "react";
import { useAppState } from "../state/AppState";
import { getApiBaseUrl, getWsUrl } from "../config";

// PUBLIC_INTERFACE
export function Settings() {
  /** Settings page for theme and connection information. */
  const { state, actions } = useAppState();
  const apiBase = getApiBaseUrl();
  const wsUrl = getWsUrl();

  return (
    <div className="content">
      <div className="cardGrid">
        <div className="card" style={{ gridColumn: "span 6" }}>
          <div className="cardHeader">
            <h2>Preferences</h2>
            <span>UI options</span>
          </div>

          <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
            <span className="pill">
              Theme: <strong style={{ color: "var(--text)" }}>{state.theme}</strong>
            </span>
            <button
              className="btn btnPrimary"
              type="button"
              onClick={() => actions.setTheme(state.theme === "light" ? "dark" : "light")}
            >
              Toggle theme
            </button>
          </div>

          <div style={{ marginTop: 14, color: "var(--text-3)", fontSize: 12 }}>
            Theme is stored in memory for now. You can persist to localStorage later if desired.
          </div>
        </div>

        <div className="card" style={{ gridColumn: "span 6" }}>
          <div className="cardHeader">
            <h2>Connectivity</h2>
            <span>Environment driven</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div>
              <div style={{ fontSize: 12, color: "var(--text-3)" }}>REST base URL</div>
              <div style={{ fontWeight: 800 }}>{apiBase || "(same-origin / mock fallback)"}</div>
            </div>

            <div>
              <div style={{ fontSize: 12, color: "var(--text-3)" }}>WebSocket URL</div>
              <div style={{ fontWeight: 800 }}>{wsUrl || "(disabled — polling fallback)"}</div>
            </div>

            <button
              className="btn"
              type="button"
              onClick={() =>
                actions.enqueueToast({
                  title: "Config",
                  message: "Update REACT_APP_API_BASE / REACT_APP_BACKEND_URL / REACT_APP_WS_URL in .env and restart dev server.",
                  tone: "info"
                })
              }
            >
              How to configure
            </button>
          </div>
        </div>

        <div className="card" style={{ gridColumn: "span 12" }}>
          <div className="cardHeader">
            <h2>Notes</h2>
            <span>Backend endpoints</span>
          </div>

          <div style={{ color: "var(--text-2)", fontSize: 13, lineHeight: 1.6 }}>
            <p style={{ marginTop: 0 }}>
              This frontend attempts to call REST endpoints (<code>/tasks</code>, <code>/runners</code>,{" "}
              <code>/runs/start</code>, <code>/runs/stop</code>, <code>/runs/active</code>, <code>/logs</code>).
              If those endpoints are not available yet, it automatically falls back to a mock adapter so the UI remains usable.
            </p>
            <p style={{ marginBottom: 0 }}>
              When a WebSocket URL is provided, the client will try to subscribe to events and refresh data on messages.
              Polling remains enabled as a safety net.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
