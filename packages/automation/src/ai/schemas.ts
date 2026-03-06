import { z } from 'zod';

/**
 * Structured output schema for AI-generated incident reports.
 * Gemini returns JSON matching this Zod schema.
 */
export const incidentReportSchema = z.object({
  summary: z.string().describe('Professional 2-3 sentence summary of the incident'),
  clientSafeSummary: z.string().describe('Client-facing summary without internal details or guard names'),
  recommendedActions: z.array(z.string()).describe('List of 2-5 recommended follow-up actions'),
  escalationRequired: z.boolean().describe('Whether this incident requires immediate supervisor escalation'),
  severityAssessment: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).describe('AI assessment of actual severity'),
  sourceFieldsUsed: z.array(z.string()).describe('List of data fields used to generate this report'),
});

export type IncidentReportOutput = z.infer<typeof incidentReportSchema>;

/**
 * Structured output schema for daily shift report summaries.
 */
export const dailyReportSummarySchema = z.object({
  executiveSummary: z.string().describe('1-2 paragraph executive summary of the shift period'),
  highlights: z.array(z.string()).describe('Key highlights and notable events'),
  concerns: z.array(z.string()).describe('Areas of concern or items needing attention'),
  patrolSummary: z.string().describe('Summary of patrol activity and completion rates'),
  incidentSummary: z.string().describe('Summary of incidents if any occurred'),
  recommendations: z.array(z.string()).describe('Recommendations for improving coverage'),
  sourceFieldsUsed: z.array(z.string()).describe('List of data fields used to generate this summary'),
});

export type DailyReportSummaryOutput = z.infer<typeof dailyReportSummarySchema>;

/**
 * Structured output schema for lead estimate generation.
 */
export const leadEstimateSchema = z.object({
  estimatedHoursPerWeek: z.number().describe('Estimated guard hours per week'),
  estimatedMonthlyRate: z.number().describe('Estimated monthly cost in USD'),
  serviceRecommendations: z.array(z.string()).describe('Recommended service configuration'),
  rationale: z.string().describe('Brief explanation of the estimate'),
  sourceFieldsUsed: z.array(z.string()).describe('Data fields used'),
});

export type LeadEstimateOutput = z.infer<typeof leadEstimateSchema>;
