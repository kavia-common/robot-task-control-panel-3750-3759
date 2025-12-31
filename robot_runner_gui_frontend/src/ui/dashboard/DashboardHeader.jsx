import React from "react";

/**
 * DashboardHeader
 * A reusable header for the dashboard page (title/subtitle + right-side actions).
 */

// PUBLIC_INTERFACE
export default function DashboardHeader({
  title,
  subtitle,
  meta,
  rightActions = [],
}) {
  /** Render a dashboard header with optional metadata and actions. */

  return (
    <header className="dashboardHeader" aria-label="Dashboard header">
      <div className="dashboardHeaderLeft">
        <h1 className="h1">{title}</h1>
        {subtitle ? <div className="muted">{subtitle}</div> : null}
        {meta ? <div className="dashboardHeaderMeta">{meta}</div> : null}
      </div>

      <div className="dashboardHeaderRight" aria-label="Dashboard header actions">
        {rightActions.map((action) => (
          <button
            key={action.id}
            type="button"
            className={`btn ${action.variant === "secondary" ? "btn-secondary" : "btn-primary"}`}
            onClick={action.onClick}
            disabled={action.disabled}
          >
            {action.label}
          </button>
        ))}
      </div>
    </header>
  );
}
