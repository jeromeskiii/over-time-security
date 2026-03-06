export { sendEmail, type EmailOptions } from './email';
export { sendSMS, type SMSOptions } from './sms';
export {
  createNotificationRecord,
  markNotificationSent,
  markNotificationFailed,
} from './tracker';
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
} from './templates';
