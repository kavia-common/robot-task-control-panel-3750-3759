import React from "react";
import { Dashboard } from "./pages/Dashboard";
import { TaskLibrary } from "./pages/TaskLibrary";
import { RunnerControl } from "./pages/RunnerControl";
import { LiveMonitoring } from "./pages/LiveMonitoring";
import { Settings } from "./pages/Settings";

// PUBLIC_INTERFACE
export const routes = [
  /** App routes for react-router. */
  { path: "/", element: <Dashboard /> },
  { path: "/tasks", element: <TaskLibrary /> },
  { path: "/runner", element: <RunnerControl /> },
  { path: "/monitor", element: <LiveMonitoring /> },
  { path: "/settings", element: <Settings /> }
];
