import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Sidebar } from "./components/Sidebar";
import { Header } from "./components/Header";
import { routes } from "./routes";
import { AppStateProvider } from "./state/AppState";
import { ConfirmDialog } from "./components/ConfirmDialog";
import { ToastStack } from "./components/ToastStack";

// PUBLIC_INTERFACE
function App() {
  /** Root app: providers + app shell + routing. */
  return (
    <AppStateProvider>
      <BrowserRouter>
        <div className="app">
          <div className="appShell">
            <Sidebar />
            <main className="main">
              <Header />
              <Routes>
                {routes.map((r) => (
                  <Route key={r.path} path={r.path} element={r.element} />
                ))}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
          </div>

          <ConfirmDialog />
          <ToastStack />
        </div>
      </BrowserRouter>
    </AppStateProvider>
  );
}

export default App;
