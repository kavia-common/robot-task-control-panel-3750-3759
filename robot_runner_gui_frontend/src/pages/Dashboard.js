import React, { useMemo } from "react";
import { useAppState } from "../state/AppState";

function badgeForStatus(status) {
  if (status === "running") return <span className="badge">running</span>;
  if (status === "busy") return <span className="badge badgeAmber">busy</span>;
  if (status === "idle") return <span className="badge">idle</span>;
  if (status === "stopping") return <span className="badge badgeRed">stopping</span>;
  return <span className="badge">{status || "unknown"}</span>;
}

// PUBLIC_INTERFACE
export function Dashboard() {
  /** Main dashboard with quick KPIs and tables for active runs and runners. */
  const { state } = useAppState();

  const kpis = useMemo(() => {
    const totalTasks = state.tasks.length;
    const totalRunners = state.runners.length;
    const activeRuns = state.activeRuns.length;
    const busy = state.runners.filter((r) => r.status === "busy").length;
    return { totalTasks, totalRunners, activeRuns, busy };
  }, [state.tasks, state.runners, state.activeRuns]);

  return (
    <div className="content">
      <div className="cardGrid">
        <div className="card" style={{ gridColumn: "span 3" }}>
          <div className="cardHeader">
            <h2>Tasks</h2>
            <span>available</span>
          </div>
          <div className="kpiValue">{kpis.totalTasks}</div>
          <div className="kpiLabel">Ready to run</div>
        </div>

        <div className="card" style={{ gridColumn: "span 3" }}>
          <div className="cardHeader">
            <h2>Runners</h2>
            <span>connected</span>
          </div>
          <div className="kpiValue">{kpis.totalRunners}</div>
          <div className="kpiLabel">{kpis.busy} currently busy</div>
        </div>

        <div className="card" style={{ gridColumn: "span 3" }}>
          <div className="cardHeader">
            <h2>Active Runs</h2>
            <span>in progress</span>
          </div>
          <div className="kpiValue">{kpis.activeRuns}</div>
          <div className="kpiLabel">Monitoring enabled</div>
        </div>

        <div className="card" style={{ gridColumn: "span 3" }}>
          <div className="cardHeader">
            <h2>Logs</h2>
            <span>recent</span>
          </div>
          <div className="kpiValue">{Math.min(state.logs.length, 250)}</div>
          <div className="kpiLabel">Last refresh window</div>
        </div>
      </div>

      <div className="cardGrid">
        <div className="card" style={{ gridColumn: "span 7" }}>
          <div className="cardHeader">
            <h2>Active Runs</h2>
            <span>{state.activeRuns.length} total</span>
          </div>

          <table className="table" aria-label="Active runs">
            <thead>
              <tr>
                <th>Run</th>
                <th>Runner</th>
                <th>Task</th>
                <th>Status</th>
                <th>Started</th>
              </tr>
            </thead>
            <tbody>
              {state.activeRuns.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ color: "var(--text-3)" }}>
                    No active runs.
                  </td>
                </tr>
              ) : (
                state.activeRuns.map((r) => (
                  <tr key={r.runId}>
                    <td>
                      <code>{r.runId}</code>
                    </td>
                    <td>{r.runnerId}</td>
                    <td>{r.taskId}</td>
                    <td>{badgeForStatus(r.status)}</td>
                    <td style={{ color: "var(--text-3)" }}>{r.startedAt ? new Date(r.startedAt).toLocaleString() : "-"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="card" style={{ gridColumn: "span 5" }}>
          <div className="cardHeader">
            <h2>Runners</h2>
            <span>{state.runners.length} total</span>
          </div>

          <table className="table" aria-label="Runners">
            <thead>
              <tr>
                <th>Name</th>
                <th>Status</th>
                <th>Last seen</th>
              </tr>
            </thead>
            <tbody>
              {state.runners.length === 0 ? (
                <tr>
                  <td colSpan={3} style={{ color: "var(--text-3)" }}>
                    No runners detected.
                  </td>
                </tr>
              ) : (
                state.runners.map((r) => (
                  <tr key={r.id}>
                    <td>{r.name}</td>
                    <td>{badgeForStatus(r.status)}</td>
                    <td style={{ color: "var(--text-3)" }}>{r.lastSeen ? new Date(r.lastSeen).toLocaleTimeString() : "-"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
