import React, { createContext, useContext, useEffect, useMemo, useReducer, useRef } from "react";
import { api } from "../api/client";
import { createRealtimeClient } from "../api/realtime";

const AppStateContext = createContext(null);

const initialState = {
  theme: "light",

  tasks: [],
  runners: [],
  activeRuns: [],
  logs: [],

  selection: {
    selectedTaskId: "",
    selectedRunnerId: ""
  },

  realtime: {
    mode: "polling",
    connected: false,
    reason: "Not started"
  },

  ui: {
    confirm: null, // { title, message, confirmLabel, danger, onConfirm }
    toasts: [] // { id, title, message, tone }
  }
};

function uid() {
  return `${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function reducer(state, action) {
  switch (action.type) {
    case "theme/set":
      return { ...state, theme: action.theme };

    case "data/set":
      return { ...state, ...action.payload };

    case "selection/set":
      return { ...state, selection: { ...state.selection, ...action.payload } };

    case "realtime/set":
      return { ...state, realtime: { ...state.realtime, ...action.payload } };

    case "ui/confirm":
      return { ...state, ui: { ...state.ui, confirm: action.confirm } };

    case "ui/toast/add":
      return { ...state, ui: { ...state.ui, toasts: [action.toast, ...state.ui.toasts] } };

    case "ui/toast/remove":
      return { ...state, ui: { ...state.ui, toasts: state.ui.toasts.filter((t) => t.id !== action.id) } };

    default:
      return state;
  }
}

// PUBLIC_INTERFACE
export function AppStateProvider({ children }) {
  /** Provides app state and actions to the component tree. */
  const [state, dispatch] = useReducer(reducer, initialState);
  const pollingTimerRef = useRef(null);

  // Theme application
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", state.theme);
  }, [state.theme]);

  const actions = useMemo(() => {
    const enqueueToast = ({ title, message, tone = "info" }) => {
      const toast = { id: uid(), title, message, tone };
      dispatch({ type: "ui/toast/add", toast });
      // auto-dismiss
      window.setTimeout(() => dispatch({ type: "ui/toast/remove", id: toast.id }), 5200);
    };

    const confirm = ({ title, message, confirmLabel = "Confirm", danger = false, onConfirm }) => {
      dispatch({
        type: "ui/confirm",
        confirm: { title, message, confirmLabel, danger, onConfirm }
      });
    };

    const dismissConfirm = () => dispatch({ type: "ui/confirm", confirm: null });

    const refreshAll = async () => {
      const [tasks, runners, activeRuns, logs] = await Promise.all([
        api.listTasks(),
        api.listRunners(),
        api.listActiveRuns(),
        api.getLogs({ limit: 250 })
      ]);

      dispatch({ type: "data/set", payload: { tasks, runners, activeRuns, logs } });
    };

    const startPolling = () => {
      if (pollingTimerRef.current) return;
      pollingTimerRef.current = window.setInterval(() => {
        refreshAll().catch(() => {
          // silence; we already have mock fallback and toasts happen on user actions
        });
      }, 2000);
    };

    const stopPolling = () => {
      if (pollingTimerRef.current) {
        window.clearInterval(pollingTimerRef.current);
        pollingTimerRef.current = null;
      }
    };

    const startRun = async ({ runnerId, taskId, parameters }) => {
      const run = await api.startRun({ runnerId, taskId, parameters });
      enqueueToast({ title: "Run started", message: `Run ${run.runId} started on ${runnerId}.`, tone: "success" });
      await refreshAll();
      return run;
    };

    const stopRun = async ({ runId }) => {
      await api.stopRun({ runId });
      enqueueToast({ title: "Stop requested", message: `Stop requested for ${runId}.`, tone: "warn" });
      await refreshAll();
    };

    return {
      enqueueToast,
      confirm,
      dismissConfirm,
      setTheme: (theme) => dispatch({ type: "theme/set", theme }),
      setSelection: (payload) => dispatch({ type: "selection/set", payload }),
      refreshAll,
      startPolling,
      stopPolling,
      startRun,
      stopRun
    };
  }, []);

  // Start realtime (WS) if configured; else polling.
  useEffect(() => {
    const realtime = createRealtimeClient({
      onStatus: (s) => dispatch({ type: "realtime/set", payload: s }),
      onEvent: (evt) => {
        // Minimal event handling; backend may send {type, payload}
        // We refresh when we see anything meaningful.
        if (evt && evt.type) {
          actions.enqueueToast({
            title: "Realtime event",
            message: `${evt.type}`,
            tone: "info"
          });
        }
        actions.refreshAll().catch(() => {});
      }
    });

    realtime.connect();

    // Always poll as a fallback; WS may not include full data events.
    actions.startPolling();
    actions.refreshAll().catch(() => {});

    return () => {
      realtime.disconnect();
      actions.stopPolling();
    };
  }, [actions]);

  const value = useMemo(() => ({ state, actions }), [state, actions]);

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

// PUBLIC_INTERFACE
export function useAppState() {
  /** Hook to access app state and actions. */
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error("useAppState must be used within AppStateProvider");
  return ctx;
}
