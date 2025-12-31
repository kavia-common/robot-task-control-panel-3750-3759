import React from "react";
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

  return (
    <section className="dashboardPage" aria-label="Dashboard page">
      <DashboardHeader
        title="Test Automation Dashboard"
        subtitle={selectedProject ? `Project: ${selectedProject.name}` : "Select a project"}
        meta={
          selectedProject
            ? `Last run: ${new Date(selectedProject.lastRunAt).toLocaleString()}`
            : "No project selected"
        }
        rightActions={[
          {
            id: "refresh",
            label: "Refresh",
            variant: "secondary",
            onClick: refresh,
            disabled: isLoadingProjects || isLoadingRuns || isLoadingSummary,
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
            <div className="muted">{error}</div>
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
            emptyStateLabel={isLoadingProjects ? "Loading projects…" : "No projects available."}
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
                    aria-busy={isStarting ? "true" : "false"}
                  >
                    {isStarting ? "Starting…" : "Start Test"}
                  </button>
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
