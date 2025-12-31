import React, { useMemo, useState } from "react";
import { useAppState } from "../state/AppState";

function toneColor(level) {
  if (level === "error") return "rgba(239, 68, 68, 0.18)";
  if (level === "warn") return "rgba(245, 158, 11, 0.18)";
  return "rgba(37, 99, 235, 0.10)";
}

// PUBLIC_INTERFACE
export function LiveMonitoring() {
  /** Page for viewing logs and monitoring active runs. */
  const { state, actions } = useAppState();
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = (query || "").trim().toLowerCase();
    if (!q) return state.logs;
    return state.logs.filter((l) => `${l.level} ${l.message} ${l.runId}`.toLowerCase().includes(q));
  }, [state.logs, query]);

  return (
    <div className="content">
      <div className="cardGrid">
        <div className="card" style={{ gridColumn: "span 12" }}>
          <div className="cardHeader">
            <h2>Logs</h2>
            <span>{filtered.length} entries</span>
          </div>

          <div className="fieldRow" style={{ marginBottom: 12 }}>
            <div className="field">
              <label htmlFor="q">Filter</label>
              <input
                id="q"
                className="input"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search message / runId / level..."
              />
            </div>

            <div className="field">
              <label>Actions</label>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <button className="btn btnSmall" type="button" onClick={() => actions.refreshAll()}>
                  Refresh
                </button>
                <button
                  className="btn btnSmall btnPrimary"
                  type="button"
                  onClick={() => actions.enqueueToast({ title: "Monitoring", message: "Polling enabled (2s).", tone: "info" })}
                >
                  Status
                </button>
              </div>
            </div>
          </div>

          <div
            style={{
              border: "1px solid var(--border)",
              borderRadius: 16,
              background: "var(--surface)",
              overflow: "auto",
              maxHeight: "58vh"
            }}
            aria-label="Log stream"
          >
            <table className="table" style={{ border: "none", boxShadow: "none", borderRadius: 0 }}>
              <thead>
                <tr>
                  <th style={{ width: 140 }}>Time</th>
                  <th style={{ width: 80 }}>Level</th>
                  <th style={{ width: 140 }}>Run</th>
                  <th>Message</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={4} style={{ color: "var(--text-3)" }}>
                      No logs to display.
                    </td>
                  </tr>
                ) : (
                  filtered.map((l) => (
                    <tr key={l.id} style={{ background: toneColor(l.level) }}>
                      <td style={{ color: "var(--text-3)" }}>{l.ts ? new Date(l.ts).toLocaleTimeString() : "-"}</td>
                      <td style={{ fontWeight: 800 }}>{l.level}</td>
                      <td>
                        <code>{l.runId || "-"}</code>
                      </td>
                      <td style={{ whiteSpace: "pre-wrap" }}>{l.message}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
