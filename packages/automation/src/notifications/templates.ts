// ── Email Templates ─────────────────────────────────────

export function leadAutoResponseEmail(data: {
  name: string;
  service: string;
}): { subject: string; html: string } {
  return {
    subject: 'Over Time Security — We Received Your Request',
    html: `
      <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0b0f14; color: #e6e6e6; padding: 40px;">
        <div style="border-bottom: 2px solid #ff6200; padding-bottom: 20px; margin-bottom: 30px;">
          <h1 style="color: #ff6200; font-size: 24px; margin: 0; text-transform: uppercase; letter-spacing: 0.1em;">Over Time Security</h1>
        </div>
        <p style="font-size: 16px; line-height: 1.6;">Hello ${data.name},</p>
        <p style="font-size: 16px; line-height: 1.6;">
          Thank you for your interest in our <strong style="color: #ff6200;">${data.service}</strong> services. 
          We've received your request and a member of our team will reach out within 2 business hours.
        </p>
        <p style="font-size: 16px; line-height: 1.6;">
          For immediate assistance, call us at <strong>1-800-555-0199</strong>.
        </p>
        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.1); font-size: 12px; color: #9ca3af;">
          Over Time Security — California Licensed Private Security<br />
          This is an automated response. Please do not reply directly.
        </div>
      </div>
    `,
  };
}

export function incidentReportEmail(data: {
  siteName: string;
  incidentTitle: string;
  severity: string;
  summary: string;
  hasPDF: boolean;
}): { subject: string; html: string } {
  const severityColor = data.severity === 'CRITICAL' || data.severity === 'HIGH' ? '#ef4444' : '#ff6200';
  
  return {
    subject: `[${data.severity}] Incident Report — ${data.siteName}: ${data.incidentTitle}`,
    html: `
      <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0b0f14; color: #e6e6e6; padding: 40px;">
        <div style="border-bottom: 2px solid #ff6200; padding-bottom: 20px; margin-bottom: 30px;">
          <h1 style="color: #ff6200; font-size: 24px; margin: 0; text-transform: uppercase; letter-spacing: 0.1em;">Incident Report</h1>
        </div>
        <div style="background: rgba(255,255,255,0.05); border-left: 4px solid ${severityColor}; padding: 16px; margin-bottom: 24px;">
          <p style="margin: 0; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; color: ${severityColor};">Severity: ${data.severity}</p>
          <h2 style="margin: 8px 0 0; font-size: 18px;">${data.incidentTitle}</h2>
          <p style="margin: 4px 0 0; font-size: 14px; color: #9ca3af;">${data.siteName}</p>
        </div>
        <p style="font-size: 16px; line-height: 1.6;">${data.summary}</p>
        ${data.hasPDF ? '<p style="font-size: 14px; color: #9ca3af;">Full PDF report is attached to this email.</p>' : ''}
        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.1); font-size: 12px; color: #9ca3af;">
          Over Time Security — Automated Incident Report<br />
          For questions, contact your account manager or call 1-800-555-0199.
        </div>
      </div>
    `,
  };
}

export function dailyReportEmail(data: {
  siteName: string;
  periodStart: string;
  periodEnd: string;
  executiveSummary: string;
}): { subject: string; html: string } {
  return {
    subject: `Daily Security Report — ${data.siteName} (${data.periodStart})`,
    html: `
      <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0b0f14; color: #e6e6e6; padding: 40px;">
        <div style="border-bottom: 2px solid #ff6200; padding-bottom: 20px; margin-bottom: 30px;">
          <h1 style="color: #ff6200; font-size: 24px; margin: 0; text-transform: uppercase; letter-spacing: 0.1em;">Daily Security Report</h1>
        </div>
        <p style="font-size: 14px; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.1em;">
          ${data.siteName} — ${data.periodStart} to ${data.periodEnd}
        </p>
        <div style="margin-top: 24px;">
          <p style="font-size: 16px; line-height: 1.6;">${data.executiveSummary}</p>
        </div>
        <p style="font-size: 14px; color: #9ca3af; margin-top: 24px;">
          Full PDF report is attached to this email with complete shift, patrol, and incident details.
        </p>
        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.1); font-size: 12px; color: #9ca3af;">
          Over Time Security — Automated Daily Report<br />
          For questions, contact your account manager or call 1-800-555-0199.
        </div>
      </div>
    `,
  };
}

export function escalationAlertEmail(data: {
  siteName: string;
  incidentTitle: string;
  severity: string;
  escalationReason: string;
}): { subject: string; html: string } {
  return {
    subject: `🚨 ESCALATION [${data.severity}] — ${data.siteName}: ${data.incidentTitle}`,
    html: `
      <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0b0f14; color: #e6e6e6; padding: 40px;">
        <div style="border-bottom: 2px solid #ef4444; padding-bottom: 20px; margin-bottom: 30px;">
          <h1 style="color: #ef4444; font-size: 24px; margin: 0; text-transform: uppercase; letter-spacing: 0.1em;">⚠️ Incident Escalation</h1>
        </div>
        <div style="background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.3); padding: 20px; margin-bottom: 24px;">
          <p style="margin: 0; font-size: 14px; color: #ef4444; font-weight: bold;">IMMEDIATE ATTENTION REQUIRED</p>
          <h2 style="margin: 8px 0 0; font-size: 18px;">${data.incidentTitle}</h2>
          <p style="margin: 4px 0 0; font-size: 14px; color: #9ca3af;">${data.siteName} — Severity: ${data.severity}</p>
        </div>
        <p style="font-size: 16px; line-height: 1.6;"><strong>Escalation Reason:</strong> ${data.escalationReason}</p>
        <p style="font-size: 16px; line-height: 1.6;">
          Please review this incident in the Operations Dashboard and take appropriate action.
        </p>
        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.1); font-size: 12px; color: #9ca3af;">
          Over Time Security — Automated Escalation Alert<br />
          This requires immediate response. Call 1-800-555-0199 if needed.
        </div>
      </div>
    `,
  };
}

// ── SMS Templates ────────────────────────────────────────

export function patrolMissAlertSMS(data: {
  guardName: string;
  siteName: string;
  checkpoint: string;
  expectedBy: string;
}): string {
  return `⚠️ OTS ALERT: Missed checkpoint at ${data.siteName}. Guard ${data.guardName} missed "${data.checkpoint}" (expected by ${data.expectedBy}). Check ops dashboard.`;
}

export function shiftNoShowAlertSMS(data: {
  guardName: string;
  siteName: string;
  scheduledStart: string;
}): string {
  return `🚨 OTS ALERT: No-show at ${data.siteName}. Guard ${data.guardName} did not check in for shift starting ${data.scheduledStart}. Immediate action required.`;
}

export function escalationAlertSMS(data: {
  siteName: string;
  severity: string;
  incidentTitle: string;
}): string {
  return `🚨 OTS ESCALATION [${data.severity}]: ${data.incidentTitle} at ${data.siteName}. Review immediately in ops dashboard.`;
}

export function leadConfirmationSMS(data: {
  name: string;
}): string {
  return `Hi ${data.name}, thank you for contacting Over Time Security. We've received your request and will reach out within 2 business hours. For immediate help: 1-800-555-0199`;
}

export function lowComplianceAlertSMS(data: {
  siteName: string;
  score: number;
  grade: string;
}): string {
  return `⚠️ OTS: Coverage health for ${data.siteName} dropped to ${data.score.toFixed(0)}% (Grade: ${data.grade}). Review patrol and check-in compliance.`;
}
