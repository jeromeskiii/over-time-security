import { beforeEach, describe, expect, it, vi } from "vitest";

const {
  alertsQueue,
  complianceQueue,
  reportsQueue,
  getQueueMock,
} = vi.hoisted(() => ({
  reportsQueue: { upsertJobScheduler: vi.fn() },
  complianceQueue: { upsertJobScheduler: vi.fn() },
  alertsQueue: { upsertJobScheduler: vi.fn() },
  getQueueMock: vi.fn(),
}));

vi.mock("../jobs/queues", () => ({
  QUEUE_NAMES: {
    REPORTS: "reports",
    COMPLIANCE: "compliance",
    ALERTS: "alerts",
  },
  getQueue: getQueueMock,
}));

describe("registerScheduledJobs", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getQueueMock.mockImplementation((queueName: string) => {
      if (queueName === "reports") return reportsQueue;
      if (queueName === "compliance") return complianceQueue;
      if (queueName === "alerts") return alertsQueue;
      throw new Error(`Unexpected queue name: ${queueName}`);
    });
    vi.spyOn(console, "log").mockImplementation(() => {});
  });

  it("registers recurring jobs for reports, compliance, and alerts", async () => {
    const { registerScheduledJobs } = await import("../jobs/scheduler");

    await registerScheduledJobs();

    expect(reportsQueue.upsertJobScheduler).toHaveBeenCalledWith(
      "daily-report-all-sites",
      { pattern: "0 6 * * *" },
      { name: "generate-daily-reports", data: { trigger: "scheduled" } }
    );
    expect(complianceQueue.upsertJobScheduler).toHaveBeenCalledWith(
      "daily-compliance-batch",
      { pattern: "0 7 * * *" },
      { name: "batch-compliance-recalculation", data: { trigger: "scheduled" } }
    );
    expect(alertsQueue.upsertJobScheduler).toHaveBeenCalledWith(
      "shift-no-show-checker",
      { pattern: "*/15 * * * *" },
      { name: "check-shift-no-shows", data: { trigger: "scheduled" } }
    );
  });
});
