/**
 * API client facade.
 * - Exposes a stable API surface for the UI.
 * - Selects mock vs real implementation via feature flags.
 *
 * Env vars (CRA):
 * - REACT_APP_API_BASE or REACT_APP_BACKEND_URL: base HTTP URL for backend (when not using mocks)
 * - REACT_APP_FEATURE_FLAGS: comma/space-separated flags; include "use_mocks" to force mocks
 * - REACT_APP_NODE_ENV: optional; when not "production", mocks are enabled by default
 */

import * as mock from "./mockAdapter";

function parseFeatureFlags(raw) {
  if (!raw) return new Set();
  return new Set(
    String(raw)
      .split(/[,\s]+/)
      .map((f) => f.trim().toLowerCase())
      .filter(Boolean)
  );
}

function isMockEnabled() {
  const flags = parseFeatureFlags(process.env.REACT_APP_FEATURE_FLAGS);
  if (flags.has("use_mocks")) return true;

  // Default behavior: enable mocks in non-production unless explicitly disabled later.
  // This matches the requested fallback behavior.
  return String(process.env.REACT_APP_NODE_ENV ?? process.env.NODE_ENV ?? "").toLowerCase() !== "production";
}

function getApiBase() {
  const base =
    process.env.REACT_APP_API_BASE ||
    process.env.REACT_APP_BACKEND_URL ||
    "";
  return String(base).replace(/\/+$/, "");
}

async function httpJson(path, options = {}) {
  const base = getApiBase();
  if (!base) {
    const err = new Error(
      "Missing API base URL. Set REACT_APP_API_BASE or REACT_APP_BACKEND_URL, or enable mocks via REACT_APP_FEATURE_FLAGS=use_mocks."
    );
    err.code = "CONFIG_ERROR";
    throw err;
  }

  const url = `${base}${path.startsWith("/") ? "" : "/"}${path}`;

  const resp = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!resp.ok) {
    const text = await resp.text().catch(() => "");
    const err = new Error(`API request failed (${resp.status}): ${text || resp.statusText}`);
    err.status = resp.status;
    err.body = text;
    throw err;
  }

  // Attempt JSON but tolerate empty.
  const text = await resp.text().catch(() => "");
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch (e) {
    const err = new Error("API response was not valid JSON");
    err.cause = e;
    err.raw = text;
    throw err;
  }
}

/**
 * Real backend implementations (kept minimal; can be aligned to a future OpenAPI spec).
 * The UI is expected to call through the exported functions below, never directly.
 */
const real = {
  async fetchProjects() {
    return httpJson("/projects", { method: "GET" });
  },

  async fetchLatestSummary(projectId) {
    if (!projectId) return { passed: 0, failed: 0, running: 0, queued: 0 };
    return httpJson(`/projects/${encodeURIComponent(projectId)}/summary/latest`, { method: "GET" });
  },

  async fetchRuns(projectId) {
    if (!projectId) return [];
    return httpJson(`/projects/${encodeURIComponent(projectId)}/runs`, { method: "GET" });
  },

  async startTest(projectId) {
    if (!projectId) {
      const err = new Error("projectId is required to start a test");
      err.code = "VALIDATION_ERROR";
      throw err;
    }
    return httpJson(`/projects/${encodeURIComponent(projectId)}/runs`, {
      method: "POST",
      body: JSON.stringify({ trigger: "ui" }),
    });
  },

  buildLogsUrl(run) {
    const base = getApiBase();
    const id = run?.id;
    if (!id) return base || "";
    // Convention-only; to be updated when backend is available.
    return `${base}/runs/${encodeURIComponent(id)}/logs`;
  },
};

function adapter() {
  return isMockEnabled() ? mock : real;
}

// PUBLIC_INTERFACE
export async function fetchProjects() {
  /** Fetch projects list from mock or real backend depending on feature flag. */
  return adapter().fetchProjects();
}

// PUBLIC_INTERFACE
export async function fetchLatestSummary(projectId) {
  /** Fetch latest summary for a project from mock or real backend depending on feature flag. */
  return adapter().fetchLatestSummary(projectId);
}

// PUBLIC_INTERFACE
export async function fetchRuns(projectId) {
  /** Fetch recent runs for a project from mock or real backend depending on feature flag. */
  return adapter().fetchRuns(projectId);
}

// PUBLIC_INTERFACE
export async function startTest(projectId) {
  /** Start a new run for a project from mock or real backend depending on feature flag. */
  return adapter().startTest(projectId);
}

// PUBLIC_INTERFACE
export function buildLogsUrl(run) {
  /** Build a logs URL for a run from mock or real backend depending on feature flag. */
  return adapter().buildLogsUrl(run);
}
