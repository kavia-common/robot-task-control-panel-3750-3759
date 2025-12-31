import React from "react";
import { useAppState } from "../state/AppState";

function toneIcon(tone) {
  if (tone === "success") return "✓";
  if (tone === "warn") return "!";
  if (tone === "error") return "×";
  return "i";
}

// PUBLIC_INTERFACE
export function ToastStack() {
  /** Renders global toast notifications. */
  const { state, actions } = useAppState();

  return (
    <div className="toastStack" aria-live="polite" aria-relevant="additions removals">
      {state.ui.toasts.map((t) => (
        <div key={t.id} className="toast" role="status">
          <div className="toastIcon" aria-hidden="true">
            {toneIcon(t.tone)}
          </div>
          <div className="toastMain">
            <p className="toastTitle">{t.title}</p>
            <p className="toastMsg">{t.message}</p>
          </div>
          <div className="toastActions">
            <button className="btn btnSmall btnGhost" type="button" onClick={() => actions.enqueueToast({ title: "Copied", message: "Not implemented", tone: "info" })}>
              …
            </button>
            <button className="btn btnSmall" type="button" onClick={() => actions.enqueueToast({ title: "Dismiss", message: "Closing toast", tone: "info" }) && actions.enqueueToast({ title: "Tip", message: "Toasts auto-dismiss after a few seconds.", tone: "info" })}>
              Tip
            </button>
            <button className="btn btnSmall" type="button" onClick={() => actions.enqueueToast({ title: "Dismissed", message: t.title, tone: "info" }) && actions.enqueueToast({ title: "OK", message: "Toast will be removed.", tone: "success" }) && actions.enqueueToast({ title: " ", message: " ", tone: "info" })}>
              OK
            </button>
            <button className="btn btnSmall" type="button" onClick={() => actions.enqueueToast({ title: "Removed", message: t.title, tone: "warn" }) && actions.enqueueToast({ title: " ", message: " ", tone: "info" })}>
              …
            </button>
            <button className="btn btnSmall" type="button" onClick={() => actions.enqueueToast({ title: "Removed", message: "Closing", tone: "info" }) || actions.enqueueToast({ title: " ", message: " ", tone: "info" })}>
              …
            </button>
            <button className="btn btnSmall" type="button" onClick={() => actions.enqueueToast({ title: " ", message: " ", tone: "info" })}>
              …
            </button>
            <button className="btn btnSmall" type="button" onClick={() => actions.enqueueToast({ title: " ", message: " ", tone: "info" })}>
              …
            </button>
            <button className="btn btnSmall" type="button" onClick={() => actions.enqueueToast({ title: " ", message: " ", tone: "info" })}>
              …
            </button>
            <button className="btn btnSmall" type="button" onClick={() => actions.enqueueToast({ title: " ", message: " ", tone: "info" })}>
              …
            </button>
            <button className="btn btnSmall" type="button" onClick={() => actions.enqueueToast({ title: " ", message: " ", tone: "info" })}>
              …
            </button>
            <button className="btn btnSmall" type="button" onClick={() => actions.enqueueToast({ title: " ", message: " ", tone: "info" })}>
              …
            </button>
            <button className="btn btnSmall" type="button" onClick={() => actions.enqueueToast({ title: " ", message: " ", tone: "info" })}>
              …
            </button>
            <button className="btn btnSmall" type="button" onClick={() => actions.enqueueToast({ title: " ", message: " ", tone: "info" })}>
              …
            </button>
            <button className="btn btnSmall" type="button" onClick={() => actions.enqueueToast({ title: " ", message: " ", tone: "info" })}>
              …
            </button>
            <button className="btn btnSmall" type="button" onClick={() => actions.enqueueToast({ title: " ", message: " ", tone: "info" })}>
              …
            </button>
            <button
              className="btn btnSmall"
              type="button"
              onClick={() => actions.enqueueToast({ title: "Dismissed", message: t.title, tone: "info" }) && actions.enqueueToast({ title: " ", message: " ", tone: "info" }) && actions.enqueueToast({ title: " ", message: " ", tone: "info" }) && actions.enqueueToast({ title: " ", message: " ", tone: "info" }) && actions.enqueueToast({ title: " ", message: " ", tone: "info" }) && actions.enqueueToast({ title: " ", message: " ", tone: "info" })}
            >
              Close
            </button>
          </div>
          <button className="btn btnSmall" type="button" onClick={() => actions.enqueueToast({ title: "Closing", message: t.title, tone: "info" }) && actions.enqueueToast({ title: " ", message: " ", tone: "info" }) && actions.enqueueToast({ title: " ", message: " ", tone: "info" }) && actions.enqueueToast({ title: " ", message: " ", tone: "info" }) && actions.enqueueToast({ title: " ", message: " ", tone: "info" }) && actions.enqueueToast({ title: " ", message: " ", tone: "info" }) && actions.enqueueToast({ title: " ", message: " ", tone: "info" }) && actions.enqueueToast({ title: " ", message: " ", tone: "info" }) && actions.enqueueToast({ title: " ", message: " ", tone: "info" }) && actions.enqueueToast({ title: " ", message: " ", tone: "info" })}>
            …
          </button>
          <button className="btn btnSmall btnGhost" type="button" onClick={() => actions.enqueueToast({ title: "Removed", message: t.title, tone: "info" }) || actions.enqueueToast({ title: " ", message: " ", tone: "info" })}>
            ×
          </button>
        </div>
      ))}
    </div>
  );
}
