import { format } from 'date-fns';

export interface DailyReportData {
  siteName: string;
  siteAddress: string;
  clientName: string;
  periodStart: Date;
  periodEnd: Date;
  shifts: Array<{
    guardName: string;
    startTime: Date;
    endTime: Date | null;
    status: string;
    checkpoints: number;
    completedCheckpoints: number;
  }>;
  incidents: Array<{
    title: string;
    type: string;
    severity: string;
    description: string;
    guardName: string;
    createdAt: Date;
    photoCount: number;
  }>;
  summary: {
    executiveSummary: string;
    highlights: string[];
    concerns: string[];
    recommendations: string[];
    patrolSummary: string;
    incidentSummary: string;
  };
  complianceScore?: {
    overallScore: number;
    grade: string;
    patrolCompletion: number;
  };
}

/**
 * Generate an HTML document suitable for PDF conversion.
 * Can be rendered server-side using puppeteer, wkhtmltopdf, or similar.
 * Also works as a rich email body.
 */
export function generateDailyReportHTML(data: DailyReportData): string {
  const periodStr = `${format(data.periodStart, 'MMM d, yyyy HH:mm')} — ${format(data.periodEnd, 'MMM d, yyyy HH:mm')}`;
  
  const shiftRows = data.shifts.map((s) => `
    <tr>
      <td style="padding: 8px; border-bottom: 1px solid #1a1f2e;">${s.guardName}</td>
      <td style="padding: 8px; border-bottom: 1px solid #1a1f2e;">${format(s.startTime, 'HH:mm')}</td>
      <td style="padding: 8px; border-bottom: 1px solid #1a1f2e;">${s.endTime ? format(s.endTime, 'HH:mm') : '—'}</td>
      <td style="padding: 8px; border-bottom: 1px solid #1a1f2e;">${s.status}</td>
      <td style="padding: 8px; border-bottom: 1px solid #1a1f2e;">${s.completedCheckpoints}/${s.checkpoints}</td>
    </tr>
  `).join('');

  const incidentBlocks = data.incidents.map((i) => `
    <div style="background: rgba(255,255,255,0.03); border-left: 3px solid ${i.severity === 'CRITICAL' || i.severity === 'HIGH' ? '#ef4444' : '#ff6200'}; padding: 12px; margin-bottom: 12px;">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <strong style="color: #e6e6e6;">${i.title}</strong>
        <span style="font-size: 11px; padding: 2px 8px; background: ${i.severity === 'CRITICAL' ? '#ef4444' : i.severity === 'HIGH' ? '#f97316' : '#6b7280'}; color: white; border-radius: 2px;">${i.severity}</span>
      </div>
      <p style="font-size: 13px; color: #9ca3af; margin: 4px 0;">
        ${i.type} — Reported by ${i.guardName} at ${format(i.createdAt, 'HH:mm')} | ${i.photoCount} photo(s)
      </p>
      <p style="font-size: 14px; color: #d1d5db; margin: 8px 0 0;">${i.description.substring(0, 300)}${i.description.length > 300 ? '...' : ''}</p>
    </div>
  `).join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <title>Daily Security Report — ${data.siteName}</title>
      <style>
        body { font-family: 'Inter', Arial, sans-serif; background: #05070a; color: #e6e6e6; margin: 0; padding: 40px; }
        .container { max-width: 800px; margin: 0 auto; }
        h1 { color: #ff6200; font-size: 28px; text-transform: uppercase; letter-spacing: 0.1em; margin: 0; }
        h2 { color: #ff6200; font-size: 16px; text-transform: uppercase; letter-spacing: 0.15em; border-bottom: 1px solid #ff620040; padding-bottom: 8px; margin-top: 32px; }
        table { width: 100%; border-collapse: collapse; font-size: 14px; }
        th { text-align: left; padding: 8px; border-bottom: 2px solid #ff620060; color: #ff6200; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; }
        td { color: #d1d5db; }
        .metric { display: inline-block; text-align: center; padding: 16px 24px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05); margin: 4px; min-width: 120px; }
        .metric-value { font-size: 32px; font-weight: 800; color: #ff6200; }
        .metric-label { font-size: 10px; text-transform: uppercase; letter-spacing: 0.15em; color: #9ca3af; margin-top: 4px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div style="border-bottom: 3px solid #ff6200; padding-bottom: 24px; margin-bottom: 32px;">
          <h1>Daily Security Report</h1>
          <p style="color: #9ca3af; font-size: 14px; margin: 8px 0 0;">
            ${data.siteName} — ${data.siteAddress}<br />
            ${periodStr}<br />
            Prepared for: ${data.clientName}
          </p>
        </div>

        <h2>Executive Summary</h2>
        <p style="font-size: 15px; line-height: 1.7; color: #d1d5db;">${data.summary.executiveSummary}</p>

        ${data.complianceScore ? `
        <h2>Coverage Health</h2>
        <div style="text-align: center; padding: 20px;">
          <div class="metric">
            <div class="metric-value">${data.complianceScore.overallScore.toFixed(0)}%</div>
            <div class="metric-label">Overall Score</div>
          </div>
          <div class="metric">
            <div class="metric-value">${data.complianceScore.grade}</div>
            <div class="metric-label">Grade</div>
          </div>
          <div class="metric">
            <div class="metric-value">${data.complianceScore.patrolCompletion.toFixed(0)}%</div>
            <div class="metric-label">Patrol Completion</div>
          </div>
        </div>
        ` : ''}

        <h2>Shift Activity</h2>
        <table>
          <thead>
            <tr>
              <th>Guard</th>
              <th>Start</th>
              <th>End</th>
              <th>Status</th>
              <th>Checkpoints</th>
            </tr>
          </thead>
          <tbody>${shiftRows || '<tr><td colspan="5" style="padding: 16px; color: #6b7280;">No shifts recorded</td></tr>'}</tbody>
        </table>

        <h2>Patrol Summary</h2>
        <p style="font-size: 14px; line-height: 1.6; color: #d1d5db;">${data.summary.patrolSummary}</p>

        <h2>Incidents (${data.incidents.length})</h2>
        ${incidentBlocks || '<p style="color: #6b7280;">No incidents reported during this period.</p>'}
        ${data.summary.incidentSummary ? `<p style="font-size: 14px; line-height: 1.6; color: #d1d5db; margin-top: 16px;">${data.summary.incidentSummary}</p>` : ''}

        ${data.summary.highlights.length > 0 ? `
        <h2>Highlights</h2>
        <ul style="padding-left: 20px;">
          ${data.summary.highlights.map((h) => `<li style="color: #d1d5db; margin-bottom: 6px; font-size: 14px;">${h}</li>`).join('')}
        </ul>
        ` : ''}

        ${data.summary.concerns.length > 0 ? `
        <h2>Concerns</h2>
        <ul style="padding-left: 20px;">
          ${data.summary.concerns.map((c) => `<li style="color: #f97316; margin-bottom: 6px; font-size: 14px;">${c}</li>`).join('')}
        </ul>
        ` : ''}

        ${data.summary.recommendations.length > 0 ? `
        <h2>Recommendations</h2>
        <ul style="padding-left: 20px;">
          ${data.summary.recommendations.map((r) => `<li style="color: #d1d5db; margin-bottom: 6px; font-size: 14px;">${r}</li>`).join('')}
        </ul>
        ` : ''}

        <div style="margin-top: 48px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.1); font-size: 11px; color: #6b7280; text-align: center;">
          Generated by Over Time Security Automation Platform<br />
          ${format(new Date(), 'MMMM d, yyyy HH:mm:ss z')}
        </div>
      </div>
    </body>
    </html>
  `;
}
