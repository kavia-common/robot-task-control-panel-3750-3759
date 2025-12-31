import React, { useMemo } from "react";
import SidebarProjects from "../ui/dashboard/SidebarProjects";
import DashboardHeader from "../ui/dashboard/DashboardHeader";
import ResultsPieCard from "../ui/dashboard/ResultsPieCard";
import RunsTable from "../ui/dashboard/RunsTable";
import useDashboardData from "../hooks/useDashboardData";

/**
 * DashboardPage
 * Assembles dashboard components using mock API data (via useDashboardData hook).
 * Components are kept data-agnostic by passing props and callbacks.
 */

// PUBLIC_INTERFACE
export default function DashboardPage() {
  /** Dashboard route "/" page layout driven by the mock-aware useDashboardData hook. */

  const {
    projects,
    selectedProjectId,
    selectedProject,
    summary,
    runs,
    isLoadingProjects,
    isLoadingSummary,
    isLoadingRuns,
    isStarting,
    error,
    selectProject,
    startTestRun,
    refresh,
    openLogs,
  } = useDashboardData();

  const isBusy = isLoadingProjects || isLoadingRuns || isLoadingSummary;

  const startButtonHelp = useMemo(() => {
    if (!selectedProjectId) return "Select a project to enable Start Test.";
    if (isStarting) return "Starting a new run. A queued run will appear immediately.";
    return "Starts a new run for the selected project.";
  }, [isStarting, selectedProjectId]);

  return (
    <section className="dashboardPage" aria-label="Dashboard page">
      <DashboardHeader
        title="Test Automation Dashboard"
        subtitle={
          selectedProject ? `Project: ${selectedProject.name}` : "Select a project"
        }
        meta={
          selectedProject
            ? `Last run: ${new Date(selectedProject.lastRunAt).toLocaleString()}`
            : "No project selected"
        }
        rightActions={[
          {
            id: "refresh",
            label: isBusy ? "Refreshing…" : "Refresh",
            variant: "secondary",
            onClick: refresh,
            disabled: isBusy,
          },
        ]}
      />

      {error ? (
        <div
          className="surface card"
          role="alert"
          aria-label="Dashboard error"
          style={{ marginBottom: 24 }}
        >
          <div className="cardHeader">
            <h2 className="h2">Something went wrong</h2>
            <span className="badge badgeError">Error</span>
          </div>
          <div className="cardBody">
            <div className="errorCallout" aria-label="Error details">
              {error}
            </div>
            <div style={{ marginTop: 12 }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={refresh}
                disabled={isBusy}
              >
                {isBusy ? (
                  <>
                    <span className="spinner spinner-dark" aria-hidden="true" />
                    Retrying…
                  </>
                ) : (
                  "Retry"
                )}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <div className="dashboardGrid" aria-label="Dashboard layout grid">
        <aside className="dashboardSidebar" aria-label="Projects sidebar">
          <SidebarProjects
            title="Projects"
            projects={projects}
            selectedProjectId={selectedProjectId}
            onSelectProject={selectProject}
            isLoading={isLoadingProjects}
            error={error}
            onRetry={refresh}
            emptyStateLabel={
              isLoadingProjects ? "Loading projects…" : "No projects available."
            }
          />
        </aside>

        <section className="dashboardMain" aria-label="Dashboard main content">
          <div className="dashboardTopRow" aria-label="Dashboard top row">
            <div className="dashboardTopCenter" aria-label="Run status summary">
              <ResultsPieCard
                title="Run Status"
                subtitle={selectedProject ? "Latest (mock)" : "Select a project to see status"}
                summary={summary}
                isLoading={isLoadingSummary}
                error={error}
                onRetry={refresh}
                onLegendItemClick={(key) => {
                  // Placeholder for filtering by status; keep it interactive for now.
                  window.alert(`Clicked legend item: ${key}`);
                }}
              />
            </div>

            <div className="dashboardTopRight" aria-label="Primary action panel">
              <div className="surface card dashboardActionCard">
                <div className="cardHeader">
                  <h2 className="h2">Quick action</h2>
                  <span className="muted">Run a new test</span>
                </div>
                <div className="cardBody">
                  <div className="muted">
                    Start a new run for the selected project. Runs update optimistically and then
                    refresh.
                  </div>

                  <button
                    type="button"
                    className="btn btn-primary dashboardStartBtn"
                    onClick={startTestRun}
                    disabled={isStarting || !selectedProjectId}
                    aria-disabled={isStarting || !selectedProjectId ? "true" : "false"}
                    aria-busy={isStarting ? "true" : "false"}
                    aria-describedby="startTestHelp"
                  >
                    {isStarting ? (
                      <>
                        <span className="spinner" aria-hidden="true" />
                        Starting…
                      </>
                    ) : (
                      "Start Test"
                    )}
                  </button>
                  <div id="startTestHelp" className="srOnly">
                    {startButtonHelp}
                  </div>

                  <div className="chip" role="status" aria-label="Selected project chip">
                    {selectedProject ? `Selected: ${selectedProject.name}` : "Select a project"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="dashboardBottomRow" aria-label="Recent runs table">
            <RunsTable
              title="Recent Test History"
              subtitle={selectedProject ? "Most recent runs (mock)" : "Select a project to view runs"}
              rows={runs}
              isLoading={isLoadingRuns}
              error={error}
              onRetry={refresh}
              emptyStateLabel={
                selectedProjectId
                  ? isLoadingRuns
                    ? "Loading runs…"
                    : "No runs yet."
                  : "No project selected."
              }
              onRowClick={(row) => {
                // For now: open logs in a new tab (works for mock URLs too).
                openLogs(row);
              }}
            />
          </div>
        </section>
      </div>
    </section>
  );
}
