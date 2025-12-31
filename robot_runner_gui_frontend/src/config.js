/**
 * Configuration helper for environment-driven URLs.
 * Uses CRA env vars (REACT_APP_*) and provides safe defaults.
 */

// PUBLIC_INTERFACE
export function getApiBaseUrl() {
  /** Returns the base URL for REST API calls. */
  const fromApiBase = process.env.REACT_APP_API_BASE;
  const fromBackendUrl = process.env.REACT_APP_BACKEND_URL;

  // Prefer explicit API base, then backend URL, then relative same-origin.
  return (fromApiBase || fromBackendUrl || "").trim() || "";
}

// PUBLIC_INTERFACE
export function getWsUrl() {
  /** Returns WebSocket URL if configured, otherwise empty string (meaning "disabled"). */
  const ws = (process.env.REACT_APP_WS_URL || "").trim();
  return ws;
}

// PUBLIC_INTERFACE
export function getLogLevel() {
  /** Returns desired log level (debug|info|warn|error). */
  return (process.env.REACT_APP_LOG_LEVEL || "info").trim();
}
