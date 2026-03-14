import type { ComplianceMetrics, ComplianceScore, LeadStatus, RiskLevel, ShiftRiskInput } from '../models/index.js';
export * from './rbac.js';

/**
 * Calculates a weighted compliance score for a site over a period.
 *
 * Weights:
 *   - patrol completion:   35%
 *   - report timeliness:   25%
 *   - missed check-ins:    25% (inverted — lower missed = higher score)
 *   - incident frequency:  15% (inverted — lower frequency = higher score)
 */
export function calculateComplianceScore(metrics: ComplianceMetrics): ComplianceScore {
  const { patrolCompletion, incidentFrequency, missedCheckIns, reportTimeliness } = metrics;

  const overallScore =
    patrolCompletion * 0.35 +
    (1 - incidentFrequency) * 0.15 +
    (1 - missedCheckIns) * 0.25 +
    reportTimeliness * 0.25;

  const clamped = Math.min(1, Math.max(0, overallScore));
  const pct = clamped * 100;

  let grade: string;
  if (pct >= 90) grade = 'A';
  else if (pct >= 80) grade = 'B';
  else if (pct >= 70) grade = 'C';
  else if (pct >= 60) grade = 'D';
  else grade = 'F';

  return { overallScore: clamped, grade };
}

/**
 * Determines shift risk level based on operational signals.
 *
 * Escalation rules (in priority order):
 *   - Any open incidents with HIGH/CRITICAL severity → CRITICAL
 *   - No activity for >90 minutes during an in-progress shift → CRITICAL
 *   - ≥3 missed check-ins → AT_RISK
 *   - No activity for >45 minutes during an in-progress shift → AT_RISK
 *   - Otherwise → NORMAL
 */
export function classifyShiftRiskLevel(input: ShiftRiskInput): RiskLevel {
  const { status, missedCheckInsCount, openIncidentCount, minutesSinceLastActivity } = input;

  if (openIncidentCount > 0) return 'CRITICAL';

  if (
    status === 'IN_PROGRESS' &&
    minutesSinceLastActivity !== null &&
    minutesSinceLastActivity > 90
  ) {
    return 'CRITICAL';
  }

  if (missedCheckInsCount >= 3) return 'AT_RISK';

  if (
    status === 'IN_PROGRESS' &&
    minutesSinceLastActivity !== null &&
    minutesSinceLastActivity > 45
  ) {
    return 'AT_RISK';
  }

  return 'NORMAL';
}

/** Valid transitions for a lead through the sales funnel. */
const LEAD_TRANSITIONS: Record<LeadStatus, LeadStatus[]> = {
  NEW: ['CONTACTED', 'LOST'],
  CONTACTED: ['QUOTED', 'LOST'],
  QUOTED: ['WON', 'LOST'],
  WON: [],
  LOST: [],
};

/**
 * Returns true when moving a lead from `from` to `to` is a permitted transition.
 */
export function isValidLeadTransition(from: LeadStatus, to: LeadStatus): boolean {
  return LEAD_TRANSITIONS[from].includes(to);
}
