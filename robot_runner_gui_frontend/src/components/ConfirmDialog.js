import React from "react";
import { Modal } from "./Modal";
import { useAppState } from "../state/AppState";

// PUBLIC_INTERFACE
export function ConfirmDialog() {
  /** Renders a global confirmation dialog when state.ui.confirm is set. */
  const { state, actions } = useAppState();
  const confirm = state.ui.confirm;

  if (!confirm) return null;

  const { title, message, confirmLabel, danger, onConfirm } = confirm;

  return (
    <div
      className="modalOverlay"
      onMouseDown={() => actions.dismissConfirm()}
      role="presentation"
    >
      <div onMouseDown={(e) => e.stopPropagation()}>
        <Modal
          title={title}
          description={message}
          onClose={() => actions.dismissConfirm()}
          footer={
            <>
              <button className="btn" type="button" onClick={() => actions.dismissConfirm()}>
                Cancel
              </button>
              <button
                className={`btn ${danger ? "btnDanger" : "btnPrimary"}`}
                type="button"
                onClick={async () => {
                  actions.dismissConfirm();
                  try {
                    await onConfirm?.();
                  } catch (e) {
                    actions.enqueueToast({
                      title: "Action failed",
                      message: e?.message || "Unknown error",
                      tone: "error"
                    });
                  }
                }}
              >
                {confirmLabel}
              </button>
            </>
          }
        >
          <div style={{ color: "var(--text-2)", fontSize: 13 }}>
            Please confirm to proceed. This action may affect active runs.
          </div>
        </Modal>
      </div>
    </div>
  );
}
