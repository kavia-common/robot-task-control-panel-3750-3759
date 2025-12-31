import React, { useMemo } from "react";

/**
 * SidebarProjects
 * A presentational projects list that accepts data via props and emits selection events.
 */

// PUBLIC_INTERFACE
export default function SidebarProjects({
  title = "Projects",
  projects = [],
  selectedProjectId = null,
  onSelectProject,
  emptyStateLabel = "No projects found.",
}) {
  /** Render a selectable projects list to be used in the dashboard sidebar. */

  const sortedProjects = useMemo(() => {
    // Keep stable but provide a predictable order (recent first if lastRunAt exists).
    const copy = [...projects];
    copy.sort((a, b) => {
      const aTs = a?.lastRunAt ? new Date(a.lastRunAt).getTime() : 0;
      const bTs = b?.lastRunAt ? new Date(b.lastRunAt).getTime() : 0;
      return bTs - aTs;
    });
    return copy;
  }, [projects]);

  return (
    <div className="surface card" aria-label="Projects">
      <div className="cardHeader">
        <h2 className="h2">{title}</h2>
        <span className="muted">{sortedProjects.length} total</span>
      </div>

      <div className="cardBody">
        {sortedProjects.length === 0 ? (
          <div className="muted">{emptyStateLabel}</div>
        ) : (
          <ul className="projectsList" aria-label="Project list">
            {sortedProjects.map((project) => {
              const isActive = project.id === selectedProjectId;
              const lastRunLabel = project.lastRunAt
                ? new Date(project.lastRunAt).toLocaleString()
                : "—";

              return (
                <li key={project.id} className="projectsListItem">
                  <button
                    type="button"
                    className={`projectRow ${isActive ? "projectRowActive" : ""}`}
                    onClick={() => onSelectProject?.(project.id)}
                    aria-current={isActive ? "true" : "false"}
                  >
                    <span className="projectRowMain">
                      <span className="projectTitleLine">
                        <span className="projectName">{project.name}</span>
                        <span
                          className={`projectStatusDot ${
                            isActive ? "projectStatusDotActive" : ""
                          }`}
                          aria-hidden="true"
                        />
                      </span>

                      {project.description ? (
                        <span className="projectDescription">{project.description}</span>
                      ) : null}

                      <span className="projectMeta">
                        <span className="muted">Last run:</span> {lastRunLabel}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}

        <div className="divider" role="separator" aria-hidden="true" />

        <div className="muted" style={{ fontSize: 12 }}>
          Tip: Components are prop-driven so a mock API can populate them next.
        </div>
      </div>
    </div>
  );
}
