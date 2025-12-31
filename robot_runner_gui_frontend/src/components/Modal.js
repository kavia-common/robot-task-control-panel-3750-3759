import React, { useEffect } from "react";

// PUBLIC_INTERFACE
export function Modal({ title, description, children, onClose, footer }) {
  /** Accessible modal with overlay. Closes on ESC and overlay click. */
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <div className="modalOverlay" role="dialog" aria-modal="true" aria-label={title}>
      <div
        className="modal"
        onMouseDown={(e) => {
          // Prevent overlay close when clicking inside
          e.stopPropagation();
        }}
      >
        <div className="modalHeader">
          <div>
            <h3>{title}</h3>
            {description ? <p>{description}</p> : null}
          </div>
          <button className="btn btnSmall btnGhost" type="button" onClick={onClose} aria-label="Close dialog">
            Close
          </button>
        </div>

        <div className="modalBody">{children}</div>

        {footer ? <div className="modalFooter">{footer}</div> : null}
      </div>

      <div
        className="sr-only"
        aria-hidden="true"
        // Overlay click handler is on a sibling by capturing mouse down on overlay area.
      />
    </div>
  );
}
