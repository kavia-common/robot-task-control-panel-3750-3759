import React, { useMemo } from "react";
import { useAppState } from "../state/AppState";

// PUBLIC_INTERFACE
export function TaskLibrary() {
  /** Task library page with selectable tasks and metadata. */
  const { state, actions } = useAppState();

  const selected = useMemo(() => state.tasks.find((t) => t.id === state.selection.selectedTaskId), [
    state.tasks,
    state.selection.selectedTaskId
  ]);

  return (
    <div className="content">
      <div className="cardGrid">
        <div className="card" style={{ gridColumn: "span 7" }}>
          <div className="cardHeader">
            <h2>Tasks</h2>
            <span>Select a task to view details</span>
          </div>

          <table className="table" aria-label="Task library">
            <thead>
              <tr>
                <th>Name</th>
                <th>Version</th>
                <th>Tags</th>
                <th>Updated</th>
              </tr>
            </thead>
            <tbody>
              {state.tasks.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ color: "var(--text-3)" }}>
                    No tasks available.
                  </td>
                </tr>
              ) : (
                state.tasks.map((t) => (
                  <tr
                    key={t.id}
                    onClick={() => actions.setSelection({ selectedTaskId: t.id })}
                    style={{
                      cursor: "pointer",
                      background:
                        t.id === state.selection.selectedTaskId ? "rgba(37, 99, 235, 0.08)" : "transparent"
                    }}
                  >
                    <td style={{ fontWeight: 800 }}>{t.name}</td>
                    <td>
                      <code>{t.version || "-"}</code>
                    </td>
                    <td style={{ color: "var(--text-3)" }}>{(t.tags || []).join(", ") || "-"}</td>
                    <td style={{ color: "var(--text-3)" }}>{t.lastUpdated ? new Date(t.lastUpdated).toLocaleDateString() : "-"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="card" style={{ gridColumn: "span 5" }}>
          <div className="cardHeader">
            <h2>Task Details</h2>
            <span>{selected ? selected.id : "none selected"}</span>
          </div>

          {!selected ? (
            <div style={{ color: "var(--text-3)", fontSize: 13 }}>
              Select a task from the table to view details and prepare it for a run.
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div>
                <div style={{ fontWeight: 900, fontSize: 16 }}>{selected.name}</div>
                <div style={{ color: "var(--text-3)", marginTop: 4 }}>{selected.description}</div>
              </div>

              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <span className="badge">version {selected.version || "-"}</span>
                <span className="badge badgeAmber">{(selected.tags || []).length} tags</span>
              </div>

              <div>
                <div style={{ fontSize: 12, color: "var(--text-3)", marginBottom: 6 }}>Suggested parameters</div>
                <pre
                  style={{
                    margin: 0,
                    padding: 12,
                    borderRadius: 14,
                    border: "1px solid var(--border)",
                    background: "var(--surface-2)",
                    overflow: "auto",
                    fontFamily: "var(--mono)",
                    fontSize: 12
                  }}
                >
{JSON.stringify(
  {
    speed: "normal",
    retries: 1,
    safetyChecks: true
  },
  null,
  2
)}
                </pre>
              </div>

              <button
                className="btn btnPrimary"
                type="button"
                onClick={() =>
                  actions.enqueueToast({
                    title: "Task selected",
                    message: `${selected.name} ready for Runner Control.`,
                    tone: "success"
                  })
                }
              >
                Use in Runner Control
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
