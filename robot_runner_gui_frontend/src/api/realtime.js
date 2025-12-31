import { getWsUrl } from "../config";

/**
 * Real-time subscription helper:
 * - If REACT_APP_WS_URL is configured, attempts WebSocket connection.
 * - If connection fails or not configured, callers can use polling fallback.
 */

// PUBLIC_INTERFACE
export function createRealtimeClient({ onEvent, onStatus } = {}) {
  /** Creates a realtime client that pushes events into onEvent callback. */
  const wsUrl = getWsUrl();
  let ws = null;

  const emitStatus = (status) => {
    if (onStatus) onStatus(status);
  };

  const connect = () => {
    if (!wsUrl) {
      emitStatus({ mode: "polling", connected: false, reason: "WS not configured" });
      return;
    }

    try {
      emitStatus({ mode: "ws", connected: false, reason: "Connecting" });
      ws = new WebSocket(wsUrl);

      ws.onopen = () => emitStatus({ mode: "ws", connected: true, reason: "Connected" });

      ws.onmessage = (msg) => {
        let payload = null;
        try {
          payload = JSON.parse(msg.data);
        } catch {
          payload = { type: "message", data: msg.data };
        }
        if (onEvent) onEvent(payload);
      };

      ws.onclose = () => {
        emitStatus({ mode: "polling", connected: false, reason: "Closed" });
        ws = null;
      };

      ws.onerror = () => {
        emitStatus({ mode: "polling", connected: false, reason: "Error" });
      };
    } catch (e) {
      emitStatus({ mode: "polling", connected: false, reason: "WS init failed" });
      ws = null;
    }
  };

  const disconnect = () => {
    if (ws) {
      ws.close();
      ws = null;
    }
  };

  const send = (event) => {
    if (!ws || ws.readyState !== WebSocket.OPEN) return false;
    ws.send(JSON.stringify(event));
    return true;
  };

  return { connect, disconnect, send };
}
