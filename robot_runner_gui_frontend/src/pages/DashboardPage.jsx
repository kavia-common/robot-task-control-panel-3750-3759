import React, { useMemo, useState } from "react";
import SidebarProjects from "../ui/dashboard/SidebarProjects";
import DashboardHeader from "../ui/dashboard/DashboardHeader";
import ResultsPieCard from "../ui/dashboard/ResultsPieCard";
import RunsTable from "../ui/dashboard/RunsTable";

/**
 * DashboardPage
 * Assembles dashboard components using mock data for immediate UI verification.
 * Components are kept data-agnostic by passing props and callbacks.
 */

// PUBLIC_INTERFACE
export default function DashboardPage() {
  /** Dashboard route "/" page layout composed of mock-friendly dashboard components. */

  const projects = useMemo(
    () => [
      {
        id: "proj-1",
        name: "Warehouse Regression",
        description: "Nightly E2E suite",
        lastRunAt: "2025-12-30T19:12:00Z",
      },
      {
        id: "proj-2",
        name: "Robot Arm Calibration",
        description: "Calibration validations",
        lastRunAt: "2025-12-30T16:40:00Z",
      },
      {
        id: "proj-3",
        name: "Navigation Smoke",
        description: "Quick smoke checks",
        lastRunAt: "2025-12-29T09:05:00Z",
      },
    ],
    []
  );

  const [selectedProjectId, setSelectedProjectId] = useState(projects[0]?.id ?? null);
  const selectedProject = useMemo(
    () => projects.find((p) => p.id === selectedProjectId) ?? null,
    [projects, selectedProjectId]
  );

  const statusSummary = useMemo(
    () => ({
      passed: 18,
      failed: 3,
      running: 2,
      queued: 1,
    }),
    []
  );

  const runs = useMemo(
    () => [
      {
        id: "run-1024",
        suite: "e2e/warehouse",
        status: "passed",
        startedAt: "2025-12-30T19:12:00Z",
        durationSeconds: 562,
        triggeredBy: "scheduler",
      },
      {
        id: "run-1023",
        suite: "e2e/warehouse",
        status: "failed",
        startedAt: "2025-12-30T16:40:00Z",
        durationSeconds: 611,
        triggeredBy: "alex",
      },
      {
        id: "run-1022",
        suite: "smoke/navigation",
        status: "running",
        startedAt: "2025-12-30T16:10:00Z",
        durationSeconds: 190,
        triggeredBy: "api",
      },
      {
        id: "run-1021",
        suite: "calibration/arm",
        status: "passed",
        startedAt: "2025-12-29T09:05:00Z",
        durationSeconds: 312,
        triggeredBy: "sam",
      },
      {
        id: "run-1020",
        suite: "calibration/arm",
        status: "queued",
        startedAt: "2025-12-29T08:59:00Z",
        durationSeconds: null,
        triggeredBy: "scheduler",
      },
    ],
    []
  );

  const [isStarting, setIsStarting] = useState(false);

  const handleStartTest = async () => {
    // Placeholder action that is mock-friendly and can be wired to a real API later.
    if (isStarting) return;
    setIsStarting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      // no-op: success UX can be added later
    } finally {
      setIsStarting(false);
    }
  };

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
            id: "filters",
            label: "Filters",
            variant: "secondary",
            onClick: () => {
              // placeholder
              window.alert("Filters will be added in a later step.");
            },
          },
        ]}
      />

      <div className="dashboardGrid" aria-label="Dashboard layout grid">
        <aside className="dashboardSidebar" aria-label="Projects sidebar">
          <SidebarProjects
            title="Projects"
            projects={projects}
            selectedProjectId={selectedProjectId}
            onSelectProject={setSelectedProjectId}
            emptyStateLabel="No projects available."
          />
        </aside>

        <section className="dashboardMain" aria-label="Dashboard main content">
          <div className="dashboardTopRow" aria-label="Dashboard top row">
            <div className="dashboardTopCenter" aria-label="Run status summary">
              <ResultsPieCard
                title="Run Status"
                subtitle="Last 24 hours (mock)"
                summary={statusSummary}
                isLoading={false}
                onLegendItemClick={(key) => {
                  // placeholder to show interaction; real filtering later
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
                    Start a new run for the selected project. (Mock action only.)
                  </div>
                  <button
                    type="button"
                    className="btn btn-primary dashboardStartBtn"
                    onClick={handleStartTest}
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
              subtitle="Most recent runs (mock)"
              rows={runs}
              isLoading={false}
              emptyStateLabel="No runs yet."
              onRowClick={(row) => {
                // placeholder
                window.alert(`Open run details: ${row.id}`);
              }}
            />
          </div>
        </section>
      </div>
    </section>
  );
}
