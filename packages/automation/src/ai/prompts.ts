import type { Incident, Shift } from '@ots/db';

/**
 * System prompt prefix applied to ALL AI calls.
 * Enforces guardrails: no invented facts, source tracking, professional tone.
 */
const SYSTEM_PREFIX = `You are a professional security operations AI assistant for Over Time Security, a California-based private security company.

CRITICAL RULES:
1. ONLY reference data explicitly provided in the input. NEVER invent, assume, or hallucinate facts.
2. Always list which input fields you used in the "sourceFieldsUsed" array.
3. Use professional, concise language suitable for security industry reports.
4. If data is insufficient to make a determination, explicitly state that.
5. Respond ONLY with valid JSON matching the requested schema.`;

/**
 * Generate the prompt for an incident report.
 */
export function buildIncidentReportPrompt(data: {
  incident: Pick<Incident, 'type' | 'severity' | 'description' | 'createdAt'>;
  guard: { firstName: string; lastName: string; licenseNumber: string };
  site: { name: string; address: string };
  shift: Pick<Shift, 'startTime' | 'endTime'>;
  photoCount: number;
}): string {
  return `${SYSTEM_PREFIX}

Generate a structured incident report from the following data:

INCIDENT DATA:
- Type: ${data.incident.type}
- Severity: ${data.incident.severity}
- Title: ${data.incident.description.slice(0, 100)}
- Description: ${data.incident.description}
- Reported At: ${data.incident.createdAt}
- Photos Attached: ${data.photoCount}

LOCATION:
- Site: ${data.site.name}
- Address: ${data.site.address}

SHIFT CONTEXT:
- Shift Start: ${data.shift.startTime}
- Shift End: ${data.shift.endTime}
- Guard: ${data.guard.firstName} ${data.guard.lastName} (License: ${data.guard.licenseNumber})

Respond with JSON containing:
{
  "summary": "Professional 2-3 sentence summary",
  "clientSafeSummary": "Client-facing summary (no guard names or internal details)",
  "recommendedActions": ["action1", "action2", ...],
  "escalationRequired": true/false,
  "severityAssessment": "LOW|MEDIUM|HIGH|CRITICAL",
  "sourceFieldsUsed": ["incident.type", "incident.severity", ...]
}`;
}

/**
 * Generate the prompt for a daily report summary.
 */
export function buildDailyReportPrompt(data: {
  site: { name: string; address: string };
  periodStart: string;
  periodEnd: string;
  totalShifts: number;
  completedShifts: number;
  totalPatrolCheckpoints: number;
  completedPatrolCheckpoints: number;
  incidents: Array<{ type: string; severity: string; title: string }>;
  guardCount: number;
  totalCheckIns: number;
  missedCheckIns: number;
}): string {
  const incidentList = data.incidents.length > 0
    ? data.incidents.map((i, idx) => `  ${idx + 1}. [${i.severity}] ${i.type}: ${i.title}`).join('\n')
    : '  None';

  return `${SYSTEM_PREFIX}

Generate a daily security report summary for the following data:

SITE:
- Name: ${data.site.name}
- Address: ${data.site.address}

PERIOD: ${data.periodStart} to ${data.periodEnd}

SHIFT ACTIVITY:
- Total Shifts: ${data.totalShifts}
- Completed Shifts: ${data.completedShifts}
- Guards on Duty: ${data.guardCount}

PATROL ACTIVITY:
- Total Checkpoints Expected: ${data.totalPatrolCheckpoints}
- Checkpoints Completed: ${data.completedPatrolCheckpoints}
- Completion Rate: ${data.totalPatrolCheckpoints > 0 ? ((data.completedPatrolCheckpoints / data.totalPatrolCheckpoints) * 100).toFixed(1) : 'N/A'}%

CHECK-INS:
- Total Check-ins: ${data.totalCheckIns}
- Missed Check-ins: ${data.missedCheckIns}

INCIDENTS:
${incidentList}

Respond with JSON containing:
{
  "executiveSummary": "1-2 paragraph executive summary",
  "highlights": ["highlight1", ...],
  "concerns": ["concern1", ...],
  "patrolSummary": "Summary of patrol activity",
  "incidentSummary": "Summary of incidents",
  "recommendations": ["recommendation1", ...],
  "sourceFieldsUsed": ["site.name", "totalShifts", ...]
}`;
}

/**
 * Generate the prompt for lead estimate generation.
 */
export function buildLeadEstimatePrompt(data: {
  service: string;
  company?: string;
  message?: string;
}): string {
  return `${SYSTEM_PREFIX}

Based on the following lead inquiry, generate a preliminary security service estimate:

SERVICE REQUESTED: ${data.service}
COMPANY: ${data.company ?? 'Not provided'}
MESSAGE: ${data.message ?? 'Not provided'}

California security industry standard rates apply:
- Armed guards: $28-45/hour
- Unarmed guards: $20-32/hour
- Mobile patrol: $18-28/hour
- Fire watch: $22-35/hour
- Event security: $25-50/hour
- Executive protection: $45-85/hour

Respond with JSON containing:
{
  "estimatedHoursPerWeek": number,
  "estimatedMonthlyRate": number,
  "serviceRecommendations": ["recommendation1", ...],
  "rationale": "Brief explanation",
  "sourceFieldsUsed": ["service", ...]
}`;
}
