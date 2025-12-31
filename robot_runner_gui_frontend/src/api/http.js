import { getApiBaseUrl } from "../config";

// PUBLIC_INTERFACE
export async function apiFetch(path, options = {}) {
  /**
   * Fetch helper that:
   * - prefixes requests with API base url when present
   * - JSON encodes bodies when passed an object
   * - parses JSON responses when possible
   */
  const base = getApiBaseUrl();
  const url = `${base}${path.startsWith("/") ? path : `/${path}`}`;

  const headers = new Headers(options.headers || {});
  let body = options.body;

  if (body && typeof body === "object" && !(body instanceof FormData)) {
    if (!headers.has("Content-Type")) headers.set("Content-Type", "application/json");
    body = JSON.stringify(body);
  }

  const res = await fetch(url, {
    ...options,
    headers,
    body
  });

  const contentType = res.headers.get("content-type") || "";
  let payload = null;

  if (contentType.includes("application/json")) {
    payload = await res.json().catch(() => null);
  } else {
    payload = await res.text().catch(() => null);
  }

  if (!res.ok) {
    const message = (payload && payload.message) || (typeof payload === "string" ? payload : "") || res.statusText;
    const err = new Error(message);
    err.status = res.status;
    err.payload = payload;
    throw err;
  }

  return payload;
}
