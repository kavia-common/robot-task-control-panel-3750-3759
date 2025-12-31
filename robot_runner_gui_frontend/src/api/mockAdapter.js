const nowIso = () => new Date().toISOString();

const mockDb = {
  tasks: [
    {
      id: "task_pick_place",
      name: "Pick & Place",
      description: "Pick a part and place it into the fixture.",
      version: "1.2.0",
      tags: ["manipulation", "fixture"],
      lastUpdated: "2025-01-07T10:18:00.000Z"
    },
    {
      id: "task_patrol",
      name: "Patrol Route A",
      description: "Patrol between checkpoints and report anomalies.",
      version: "0.9.3",
      tags: ["mobile", "inspection"],
      lastUpdated: "2025-01-04T15:22:00.000Z"
    },
    {
      id: "task_calibrate_cam",
      name: "Calibrate Camera",
      description: "Calibrate camera intrinsics/extrinsics for accurate pose estimation.",
      version: "2.0.1",
      tags: ["calibration", "vision"],
      lastUpdated: "2024-12-30T09:02:00.000Z"
    }
  ],
  runners: [
    {
      id: "runner_alpha",
      name: "Runner Alpha",
      status: "idle",
      lastSeen: nowIso(),
      capabilities: ["arm", "vision"]
    },
    {
      id: "runner_bravo",
      name: "Runner Bravo",
      status: "busy",
      lastSeen: nowIso(),
      capabilities: ["mobile", "lidar"]
    }
  ],
  activeRuns: [
    {
      runId: "run_1001",
      runnerId: "runner_bravo",
      taskId: "task_patrol",
      status: "running",
      startedAt: nowIso()
    }
  ],
  logs: [
    { id: "log_1", runId: "run_1001", ts: nowIso(), level: "info", message: "Run started." },
    { id: "log_2", runId: "run_1001", ts: nowIso(), level: "info", message: "Checkpoint A reached." }
  ]
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// PUBLIC_INTERFACE
export function createMockAdapter() {
  /** Mock API adapter with simulated latency. */
  return {
    async listTasks() {
      await sleep(180);
      return [...mockDb.tasks].sort((a, b) => (b.lastUpdated || "").localeCompare(a.lastUpdated || ""));
    },
    async listRunners() {
      await sleep(180);
      // Update lastSeen to feel "live"
      mockDb.runners = mockDb.runners.map((r) => ({ ...r, lastSeen: nowIso() }));
      return [...mockDb.runners];
    },
    async listActiveRuns() {
      await sleep(200);
      return [...mockDb.activeRuns];
    },
    async startRun({ runnerId, taskId, parameters }) {
      await sleep(250);
      const runId = `run_${Math.floor(Math.random() * 9000) + 1000}`;
      const run = { runId, runnerId, taskId, status: "running", startedAt: nowIso(), parameters: parameters || {} };
      mockDb.activeRuns = [run, ...mockDb.activeRuns];
      mockDb.logs = [
        { id: `log_${Date.now()}`, runId, ts: nowIso(), level: "info", message: `Starting ${taskId} on ${runnerId}` },
        ...mockDb.logs
      ];
      mockDb.runners = mockDb.runners.map((r) =>
        r.id === runnerId ? { ...r, status: "busy", lastSeen: nowIso() } : r
      );
      return run;
    },
    async stopRun({ runId }) {
      await sleep(250);
      mockDb.activeRuns = mockDb.activeRuns.map((r) => (r.runId === runId ? { ...r, status: "stopping" } : r));
      mockDb.logs = [
        { id: `log_${Date.now()}`, runId, ts: nowIso(), level: "warn", message: `Stop requested for ${runId}` },
        ...mockDb.logs
      ];

      // "Complete" after a moment
      await sleep(350);
      const stopped = mockDb.activeRuns.find((r) => r.runId === runId);
      mockDb.activeRuns = mockDb.activeRuns.filter((r) => r.runId !== runId);
      if (stopped) {
        mockDb.runners = mockDb.runners.map((r) =>
          r.id === stopped.runnerId ? { ...r, status: "idle", lastSeen: nowIso() } : r
        );
        mockDb.logs = [
          { id: `log_${Date.now() + 1}`, runId, ts: nowIso(), level: "info", message: `Run ${runId} stopped.` },
          ...mockDb.logs
        ];
      }

      return { ok: true };
    },
    async getLogs({ limit = 200 } = {}) {
      await sleep(150);
      return mockDb.logs.slice(0, limit);
    },
    async appendLog({ runId, level, message }) {
      await sleep(60);
      const entry = { id: `log_${Date.now()}`, runId, ts: nowIso(), level: level || "info", message };
      mockDb.logs = [entry, ...mockDb.logs];
      return entry;
    }
  };
}
