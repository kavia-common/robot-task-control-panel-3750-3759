import React from "react";
import { NavLink } from "react-router-dom";

// PUBLIC_INTERFACE
export function Sidebar() {
  /** Sidebar navigation for primary app sections. */
  const navLinkClass = ({ isActive }) => `navItem ${isActive ? "navItemActive" : ""}`;

  return (
    <aside className="sidebar" aria-label="Primary navigation">
      <div className="brand" aria-label="Robot Runner GUI">
        <div className="brandMark" aria-hidden="true">
          RR
        </div>
        <div className="brandText">
          <div className="brandTitle">Robot Runner</div>
          <div className="brandSubtitle">Control Panel</div>
        </div>
      </div>

      <div className="navGroup">
        <div className="navLabel">Navigate</div>

        <NavLink to="/" end className={navLinkClass}>
          <span className="navIcon" aria-hidden="true">
            D
          </span>
          <span>Dashboard</span>
        </NavLink>

        <NavLink to="/tasks" className={navLinkClass}>
          <span className="navIcon" aria-hidden="true">
            T
          </span>
          <span>Task Library</span>
        </NavLink>

        <NavLink to="/runner" className={navLinkClass}>
          <span className="navIcon" aria-hidden="true">
            R
          </span>
          <span>Runner Control</span>
        </NavLink>

        <NavLink to="/monitor" className={navLinkClass}>
          <span className="navIcon" aria-hidden="true">
            L
          </span>
          <span>Live Monitoring</span>
        </NavLink>

        <NavLink to="/settings" className={navLinkClass}>
          <span className="navIcon" aria-hidden="true">
            S
          </span>
          <span>Settings</span>
        </NavLink>
      </div>

      <div className="sidebarFooter" aria-label="Connection status">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
          <div>
            <div style={{ fontWeight: 800, fontSize: 12 }}>Realtime</div>
            <div style={{ color: "var(--text-3)", fontSize: 12 }}>WS or polling fallback</div>
          </div>
          <span className="badge badgeAmber">Active</span>
        </div>
      </div>
    </aside>
  );
}
