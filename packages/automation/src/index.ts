// ── Event Pipeline ───────────────────────────────────────
export { EventBus } from './events';
export { eventJobRouter } from './events';

// ── Job Queue ────────────────────────────────────────────
export {
  getQueue,
  getAllQueues,
  closeAllQueues,
  QUEUE_NAMES,
  type QueueName,
} from './jobs';
export { getRedisConnection, closeRedisConnection } from './jobs';
export { registerScheduledJobs } from './jobs';

// ── Workers ──────────────────────────────────────────────
export { createWorker, shutdownAllWorkers } from './workers';
export { startAlertsWorker } from './workers/alerts.worker';
export { startAIWorker } from './workers/ai.worker';
export { startReportsWorker } from './workers/reports.worker';
export { startNotificationsWorker } from './workers/notifications.worker';
export { startComplianceWorker } from './workers/compliance.worker';

// ── Factory ──────────────────────────────────────────────
export { createEventBus } from './factory';

// ── AI ───────────────────────────────────────────────────
export { safeAICall, getAIModel } from './ai';
export {
  buildIncidentReportPrompt,
  buildDailyReportPrompt,
  buildLeadEstimatePrompt,
} from './ai';
export {
  incidentReportSchema,
  dailyReportSummarySchema,
  leadEstimateSchema,
  type IncidentReportOutput,
  type DailyReportSummaryOutput,
  type LeadEstimateOutput,
} from './ai';

// ── Notifications ────────────────────────────────────────
export { sendEmail, sendSMS, type EmailOptions, type SMSOptions } from './notifications';
export {
  createNotificationRecord,
  markNotificationSent,
  markNotificationFailed,
} from './notifications';
export {
  leadAutoResponseEmail,
  incidentReportEmail,
  dailyReportEmail,
  escalationAlertEmail,
  patrolMissAlertSMS,
  shiftNoShowAlertSMS,
  escalationAlertSMS,
  leadConfirmationSMS,
  lowComplianceAlertSMS,
} from './notifications';

// ── Reports ──────────────────────────────────────────────
export { generateDailyReportHTML, type DailyReportData } from './reports';

// ── Job Types ────────────────────────────────────────────
export type {
  PatrolMissAlertJob,
  ScheduleCheckpointWatchJob,
  ShiftNoShowAlertJob,
  IncidentEscalationJob,
  LowComplianceAlertJob,
  GenerateIncidentReportJob,
  GenerateDailyReportJob,
  LeadAutoResponseJob,
  DispatcherNewLeadTaskJob,
  SendReportNotificationJob,
  EscalationNotificationJob,
  RecalculateSiteScoreJob,
  AlertsJobData,
  AIJobData,
  ReportsJobData,
  NotificationsJobData,
  ComplianceJobData,
} from './jobs';

// ── Workflows ────────────────────────────────────────────
export {
  handlePatrolMiss,
  processNewIncident,
  processNewLead,
  processGuardCheckIn,
  processPatrolScan,
} from './workflows';
