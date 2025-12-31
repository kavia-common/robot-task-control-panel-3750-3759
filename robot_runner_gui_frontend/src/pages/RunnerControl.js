import React, { useMemo, useState } from "react";
import { useAppState } from "../state/AppState";

function statusBadge(status) {
  if (status === "busy") return <span className="badge badgeAmber">busy</span>;
  if (status === "idle") return <span className="badge">idle</span>;
  return <span className="badge">{status || "unknown"}</span>;
}

// PUBLIC_INTERFACE
export function RunnerControl() {
  /** Page to start/stop tasks on selected runners with confirmations. */
  const { state, actions } = useAppState();
  const [parametersText, setParametersText] = useState(`{
  "speed": "normal",
  "retries": 1
}`);

  const selectedTask = useMemo(() => state.tasks.find((t) => t.id === state.selection.selectedTaskId), [
    state.tasks,
    state.selection.selectedTaskId
  ]);
  const selectedRunner = useMemo(() => state.runners.find((r) => r.id === state.selection.selectedRunnerId), [
    state.runners,
    state.selection.selectedRunnerId
  ]);

  const runnerRuns = useMemo(() => {
    return state.activeRuns.filter((r) => r.runnerId === state.selection.selectedRunnerId);
  }, [state.activeRuns, state.selection.selectedRunnerId]);

  const canStart = Boolean(selectedTask && selectedRunner);

  const parseParameters = () => {
    try {
      const obj = JSON.parse(parametersText || "{}");
      return obj && typeof obj === "object" ? obj : {};
    } catch (e) {
      throw new Error("Parameters must be valid JSON.");
    }
  };

  return (
    <div className="content">
      <div className="cardGrid">
        <div className="card" style={{ gridColumn: "span 6" }}>
          <div className="cardHeader">
            <h2>Selection</h2>
            <span>Choose runner and task</span>
          </div>

          <div className="fieldRow">
            <div className="field">
              <label htmlFor="runner">Runner</label>
              <select
                id="runner"
                className="select"
                value={state.selection.selectedRunnerId}
                onChange={(e) => actions.setSelection({ selectedRunnerId: e.target.value })}
              >
                <option value="">Select runner…</option>
                {state.runners.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name} ({r.status})
                  </option>
                ))}
              </select>
              <div style={{ fontSize: 12, color: "var(--text-3)" }}>
                {selectedRunner ? (
                  <>
                    Status: {statusBadge(selectedRunner.status)} • Capabilities:{" "}
                    {(selectedRunner.capabilities || []).join(", ") || "—"}
                  </>
                ) : (
                  "Pick a runner to enable run controls."
                )}
              </div>
            </div>

            <div className="field">
              <label htmlFor="task">Task</label>
              <select
                id="task"
                className="select"
                value={state.selection.selectedTaskId}
                onChange={(e) => actions.setSelection({ selectedTaskId: e.target.value })}
              >
                <option value="">Select task…</option>
                {state.tasks.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
              <div style={{ fontSize: 12, color: "var(--text-3)" }}>
                {selectedTask ? selectedTask.description : "Pick a task from Task Library."}
              </div>
            </div>
          </div>

          <div className="field" style={{ marginTop: 12 }}>
            <label htmlFor="params">Run parameters (JSON)</label>
            <textarea
              id="params"
              className="textarea"
              value={parametersText}
              onChange={(e) => setParametersText(e.target.value)}
              spellCheck={false}
            />
          </div>

          <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
            <button
              className={`btn ${canStart ? "btnPrimary" : ""}`}
              type="button"
              disabled={!canStart}
              onClick={() => {
                actions.confirm({
                  title: "Confirm start run",
                  message: `Start ${selectedTask?.name || "task"} on ${selectedRunner?.name || "runner"}?`,
                  confirmLabel: "Start Run",
                  danger: false,
                  onConfirm: async () => {
                    const parameters = parseParameters();
                    await actions.startRun({
                      runnerId: selectedRunner.id,
                      taskId: selectedTask.id,
                      parameters
                    });
                  }
                });
              }}
            >
              Start
            </button>

            <button
              className="btn"
              type="button"
              onClick={() => actions.refreshAll()}
            >
              Sync
            </button>
          </div>
        </div>

        <div className="card" style={{ gridColumn: "span 6" }}>
          <div className="cardHeader">
            <h2>Active runs for selection</h2>
            <span>{runnerRuns.length} runs</span>
          </div>

          <table className="table" aria-label="Active runs for selected runner">
            <thead>
              <tr>
                <th>Run</th>
                <th>Task</th>
                <th>Status</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {runnerRuns.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ color: "var(--text-3)" }}>
                    No active runs for this runner.
                  </td>
                </tr>
              ) : (
                runnerRuns.map((r) => (
                  <tr key={r.runId}>
                    <td>
                      <code>{r.runId}</code>
                    </td>
                    <td>{r.taskId}</td>
                    <td>{r.status}</td>
                    <td style={{ textAlign: "right" }}>
                      <button
                        className="btn btnSmall btnDanger"
                        type="button"
                        onClick={() => {
                          actions.confirm({
                            title: "Confirm stop run",
                            message: `Stop run ${r.runId}?`,
                            confirmLabel: "Stop Run",
                            danger: true,
                            onConfirm: async () => {
                              await actions.stopRun({ runId: r.runId });
                            }
                          });
                        }}
                      >
                        Stop
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <div style={{ marginTop: 12, color: "var(--text-3)", fontSize: 12 }}>
            Tip: If WebSocket is configured, the UI will refresh on events. Otherwise it polls every 2 seconds.
          </div>
        </div>
      </div>
    </div>
  );
}
