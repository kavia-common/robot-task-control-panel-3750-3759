import { apiFetch } from "./http";
import { createMockAdapter } from "./mockAdapter";

/**
 * API client is designed to work with:
 * - Known endpoints (when backend exists)
 * - Unknown endpoints (fallback to mock adapter)
 *
 * Toggle behavior:
 * - If REACT_APP_API_BASE or REACT_APP_BACKEND_URL are set, we will attempt real requests first.
 * - On network/404 errors, we gracefully fall back to mock for that call.
 */

const mock = createMockAdapter();

async function tryRealOrMock(realFn, mockFn) {
  try {
    return await realFn();
  } catch (e) {
    // Most likely endpoints are not implemented yet; fallback to mock.
    return await mockFn(e);
  }
}

// PUBLIC_INTERFACE
export const api = {
  /** High-level API for tasks, runners, runs and logs. */

  listTasks() {
    return tryRealOrMock(
      () => apiFetch("/tasks", { method: "GET" }),
      () => mock.listTasks()
    );
  },

  listRunners() {
    return tryRealOrMock(
      () => apiFetch("/runners", { method: "GET" }),
      () => mock.listRunners()
    );
  },

  listActiveRuns() {
    return tryRealOrMock(
      () => apiFetch("/runs/active", { method: "GET" }),
      () => mock.listActiveRuns()
    );
  },

  startRun({ runnerId, taskId, parameters }) {
    return tryRealOrMock(
      () =>
        apiFetch("/runs/start", {
          method: "POST",
          body: { runnerId, taskId, parameters: parameters || {} }
        }),
      () => mock.startRun({ runnerId, taskId, parameters })
    );
  },

  stopRun({ runId }) {
    return tryRealOrMock(
      () =>
        apiFetch("/runs/stop", {
          method: "POST",
          body: { runId }
        }),
      () => mock.stopRun({ runId })
    );
  },

  getLogs({ limit } = {}) {
    return tryRealOrMock(
      () => apiFetch(`/logs?limit=${encodeURIComponent(limit || 200)}`, { method: "GET" }),
      () => mock.getLogs({ limit })
    );
  }
};
