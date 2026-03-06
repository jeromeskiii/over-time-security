import { describe, it, expect } from 'vitest';
import {
  calculateComplianceScore,
  classifyShiftRiskLevel,
  isValidLeadTransition,
} from '../policies/index.js';

describe('calculateComplianceScore', () => {
  it('returns grade A for perfect metrics', () => {
    const result = calculateComplianceScore({
      patrolCompletion: 1,
      incidentFrequency: 0,
      missedCheckIns: 0,
      reportTimeliness: 1,
    });
    expect(result.grade).toBe('A');
    expect(result.overallScore).toBeCloseTo(1);
  });

  it('returns grade F for worst-case metrics', () => {
    const result = calculateComplianceScore({
      patrolCompletion: 0,
      incidentFrequency: 1,
      missedCheckIns: 1,
      reportTimeliness: 0,
    });
    expect(result.grade).toBe('F');
    expect(result.overallScore).toBeCloseTo(0);
  });

  it('clamps overallScore to [0, 1]', () => {
    const result = calculateComplianceScore({
      patrolCompletion: 2,
      incidentFrequency: -1,
      missedCheckIns: -1,
      reportTimeliness: 2,
    });
    expect(result.overallScore).toBe(1);
  });

  it('assigns grade B for score in [80, 90)', () => {
    // patrolCompletion=0.85, incidentFrequency=0.1, missedCheckIns=0.1, reportTimeliness=0.85
    // score = 0.85*0.35 + 0.9*0.15 + 0.9*0.25 + 0.85*0.25
    //        = 0.2975 + 0.135 + 0.225 + 0.2125 = 0.87
    const result = calculateComplianceScore({
      patrolCompletion: 0.85,
      incidentFrequency: 0.1,
      missedCheckIns: 0.1,
      reportTimeliness: 0.85,
    });
    expect(result.overallScore * 100).toBeGreaterThanOrEqual(80);
    expect(result.overallScore * 100).toBeLessThan(90);
    expect(result.grade).toBe('B');
  });

  it('assigns grade D for score in [60, 70)', () => {
    // patrolCompletion=0.5, incidentFrequency=0.4, missedCheckIns=0.4, reportTimeliness=0.6
    // score = 0.5*0.35 + 0.6*0.15 + 0.6*0.25 + 0.6*0.25
    //        = 0.175 + 0.09 + 0.15 + 0.15 = 0.565 → F ... let's tune
    // patrolCompletion=0.6, incidentFrequency=0.2, missedCheckIns=0.3, reportTimeliness=0.65
    // = 0.21 + 0.12 + 0.175 + 0.1625 = 0.6675 → D
    const result = calculateComplianceScore({
      patrolCompletion: 0.6,
      incidentFrequency: 0.2,
      missedCheckIns: 0.3,
      reportTimeliness: 0.65,
    });
    expect(result.overallScore * 100).toBeGreaterThanOrEqual(60);
    expect(result.overallScore * 100).toBeLessThan(70);
    expect(result.grade).toBe('D');
  });
});

describe('classifyShiftRiskLevel', () => {
  it('returns NORMAL for a healthy in-progress shift', () => {
    const result = classifyShiftRiskLevel({
      status: 'IN_PROGRESS',
      missedCheckInsCount: 0,
      openIncidentCount: 0,
      minutesSinceLastActivity: 10,
    });
    expect(result).toBe('NORMAL');
  });

  it('returns CRITICAL when there are open incidents', () => {
    const result = classifyShiftRiskLevel({
      status: 'IN_PROGRESS',
      missedCheckInsCount: 0,
      openIncidentCount: 1,
      minutesSinceLastActivity: 5,
    });
    expect(result).toBe('CRITICAL');
  });

  it('returns CRITICAL when guard has been silent for >90 minutes', () => {
    const result = classifyShiftRiskLevel({
      status: 'IN_PROGRESS',
      missedCheckInsCount: 0,
      openIncidentCount: 0,
      minutesSinceLastActivity: 91,
    });
    expect(result).toBe('CRITICAL');
  });

  it('returns AT_RISK when guard has been silent for >45 but ≤90 minutes', () => {
    const result = classifyShiftRiskLevel({
      status: 'IN_PROGRESS',
      missedCheckInsCount: 0,
      openIncidentCount: 0,
      minutesSinceLastActivity: 60,
    });
    expect(result).toBe('AT_RISK');
  });

  it('returns AT_RISK when there are 3 or more missed check-ins', () => {
    const result = classifyShiftRiskLevel({
      status: 'IN_PROGRESS',
      missedCheckInsCount: 3,
      openIncidentCount: 0,
      minutesSinceLastActivity: 10,
    });
    expect(result).toBe('AT_RISK');
  });

  it('returns NORMAL when shift is SCHEDULED (not yet started)', () => {
    const result = classifyShiftRiskLevel({
      status: 'SCHEDULED',
      missedCheckInsCount: 0,
      openIncidentCount: 0,
      minutesSinceLastActivity: null,
    });
    expect(result).toBe('NORMAL');
  });

  it('open incidents take priority over missed check-ins', () => {
    const result = classifyShiftRiskLevel({
      status: 'IN_PROGRESS',
      missedCheckInsCount: 5,
      openIncidentCount: 2,
      minutesSinceLastActivity: 50,
    });
    expect(result).toBe('CRITICAL');
  });
});

describe('isValidLeadTransition', () => {
  it('allows NEW → CONTACTED', () => {
    expect(isValidLeadTransition('NEW', 'CONTACTED')).toBe(true);
  });

  it('allows NEW → LOST', () => {
    expect(isValidLeadTransition('NEW', 'LOST')).toBe(true);
  });

  it('allows CONTACTED → QUOTED', () => {
    expect(isValidLeadTransition('CONTACTED', 'QUOTED')).toBe(true);
  });

  it('allows QUOTED → WON', () => {
    expect(isValidLeadTransition('QUOTED', 'WON')).toBe(true);
  });

  it('disallows NEW → WON (skipping steps)', () => {
    expect(isValidLeadTransition('NEW', 'WON')).toBe(false);
  });

  it('disallows transition out of WON (terminal state)', () => {
    expect(isValidLeadTransition('WON', 'LOST')).toBe(false);
  });

  it('disallows transition out of LOST (terminal state)', () => {
    expect(isValidLeadTransition('LOST', 'NEW')).toBe(false);
  });

  it('disallows backward transition QUOTED → CONTACTED', () => {
    expect(isValidLeadTransition('QUOTED', 'CONTACTED')).toBe(false);
  });
});
