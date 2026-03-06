import type { Guard, Shift, Incident, RiskLevel } from "@ots/domain";

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: Date;
}

interface Site {
  id: string;
  clientId: string;
  location: string;
  instructions: string;
  createdAt: Date;
}

type ShiftRow = Shift & { guardName: string; siteName: string };
type IncidentRow = Incident & { guardName: string; siteName: string };

function withRiskLevel(riskLevel: RiskLevel): RiskLevel {
  return riskLevel;
}

export const mockGuards: Guard[] = [
  { id: "g1", name: "Marcus Rivera",   licenseNumber: "CA-2021-0041", phone: "310-555-0101", status: "ACTIVE",    createdAt: new Date("2023-01-15") },
  { id: "g2", name: "Tanya Brooks",    licenseNumber: "CA-2020-0188", phone: "213-555-0182", status: "ACTIVE",    createdAt: new Date("2022-08-03") },
  { id: "g3", name: "Derek Okafor",    licenseNumber: "CA-2019-0374", phone: "424-555-0239", status: "INACTIVE",  createdAt: new Date("2021-11-22") },
  { id: "g4", name: "Sofia Mendez",    licenseNumber: "CA-2022-0512", phone: "323-555-0317", status: "ACTIVE",    createdAt: new Date("2023-06-01") },
  { id: "g5", name: "James Whitfield", licenseNumber: "CA-2018-0093", phone: "818-555-0455", status: "SUSPENDED", createdAt: new Date("2020-04-10") },
  { id: "g6", name: "Priya Nair",      licenseNumber: "CA-2023-0601", phone: "562-555-0521", status: "ACTIVE",    createdAt: new Date("2024-01-08") },
  { id: "g7", name: "Leon Carter",     licenseNumber: "CA-2021-0278", phone: "714-555-0634", status: "ACTIVE",    createdAt: new Date("2023-03-19") },
  { id: "g8", name: "Aisha Thompson",  licenseNumber: "CA-2020-0445", phone: "626-555-0712", status: "INACTIVE",  createdAt: new Date("2022-07-14") },
];

export const mockClients: Client[] = [
  { id: "c1", name: "Westfield Corp",      email: "ops@westfield.com",   phone: "213-555-1000", createdAt: new Date("2022-01-01") },
  { id: "c2", name: "Harbor Logistics",    email: "sec@harborlog.com",   phone: "310-555-2000", createdAt: new Date("2022-06-15") },
  { id: "c3", name: "Apex Retail Group",   email: "fm@apexretail.com",   phone: "818-555-3000", createdAt: new Date("2023-02-20") },
  { id: "c4", name: "Pacific Event Co.",   email: "events@pacifice.com", phone: "424-555-4000", createdAt: new Date("2023-09-05") },
];

export const mockSites: (Site & { clientName: string })[] = [
  { id: "s1", clientId: "c1", clientName: "Westfield Corp",    location: "Westfield Century City, 10250 Santa Monica Blvd, LA",  instructions: "Check all entrances every 2 hours.", createdAt: new Date("2022-02-01") },
  { id: "s2", clientId: "c2", clientName: "Harbor Logistics",  location: "Port of Long Beach, Gate 7, Long Beach CA",            instructions: "Verify truck manifests at gate.",    createdAt: new Date("2022-07-10") },
  { id: "s3", clientId: "c3", clientName: "Apex Retail Group", location: "Apex Flagship Store, 3rd St Promenade, Santa Monica",  instructions: "Loss prevention focus on weekends.", createdAt: new Date("2023-03-01") },
  { id: "s4", clientId: "c4", clientName: "Pacific Event Co.", location: "Crypto.com Arena, 1111 S Figueroa St, LA",             instructions: "Event-specific briefing required.",  createdAt: new Date("2023-10-01") },
  { id: "s5", clientId: "c1", clientName: "Westfield Corp",    location: "Westfield Topanga, 6600 Topanga Canyon Blvd, Canoga",  instructions: "Patrol parking structure hourly.",   createdAt: new Date("2022-02-15") },
];

export const mockShifts: ShiftRow[] = [
  { id: "sh1", guardId: "g1", guardName: "Marcus Rivera",   siteId: "s1", siteName: "Westfield Century City", startTime: new Date("2025-03-05T06:00"), endTime: new Date("2025-03-05T14:00"), status: "COMPLETED",   riskLevel: withRiskLevel("NORMAL"),   createdAt: new Date("2025-03-01") },
  { id: "sh2", guardId: "g2", guardName: "Tanya Brooks",    siteId: "s2", siteName: "Port of Long Beach",     startTime: new Date("2025-03-05T14:00"), endTime: new Date("2025-03-05T22:00"), status: "IN_PROGRESS", riskLevel: withRiskLevel("AT_RISK"),  createdAt: new Date("2025-03-01") },
  { id: "sh3", guardId: "g4", guardName: "Sofia Mendez",    siteId: "s3", siteName: "Apex Flagship Store",    startTime: new Date("2025-03-05T22:00"), endTime: new Date("2025-03-06T06:00"), status: "SCHEDULED",   riskLevel: withRiskLevel("NORMAL"),   createdAt: new Date("2025-03-01") },
  { id: "sh4", guardId: "g6", guardName: "Priya Nair",      siteId: "s4", siteName: "Crypto.com Arena",       startTime: new Date("2025-03-06T08:00"), endTime: new Date("2025-03-06T20:00"), status: "SCHEDULED",   riskLevel: withRiskLevel("NORMAL"),   createdAt: new Date("2025-03-02") },
  { id: "sh5", guardId: "g7", guardName: "Leon Carter",     siteId: "s5", siteName: "Westfield Topanga",      startTime: new Date("2025-03-05T06:00"), endTime: new Date("2025-03-05T14:00"), status: "COMPLETED",   riskLevel: withRiskLevel("NORMAL"),   createdAt: new Date("2025-03-01") },
  { id: "sh6", guardId: "g1", guardName: "Marcus Rivera",   siteId: "s2", siteName: "Port of Long Beach",     startTime: new Date("2025-03-06T06:00"), endTime: new Date("2025-03-06T14:00"), status: "SCHEDULED",   riskLevel: withRiskLevel("NORMAL"),   createdAt: new Date("2025-03-02") },
  { id: "sh7", guardId: "g2", guardName: "Tanya Brooks",    siteId: "s1", siteName: "Westfield Century City", startTime: new Date("2025-03-04T14:00"), endTime: new Date("2025-03-04T22:00"), status: "COMPLETED",   riskLevel: withRiskLevel("NORMAL"),   createdAt: new Date("2025-02-28") },
  { id: "sh8", guardId: "g4", guardName: "Sofia Mendez",    siteId: "s5", siteName: "Westfield Topanga",      startTime: new Date("2025-03-04T22:00"), endTime: new Date("2025-03-05T06:00"), status: "CANCELLED",   riskLevel: withRiskLevel("CRITICAL"), createdAt: new Date("2025-02-28") },
];

export const mockIncidents: IncidentRow[] = [
  { id: "i1", guardId: "g1", guardName: "Marcus Rivera", siteId: "s1", siteName: "Westfield Century City", shiftId: "sh1", type: "THEFT",               severity: "HIGH",     description: "Shoplifter apprehended at south entrance. Police notified.", photoKeys: [], occurredAt: new Date("2025-03-05T09:30"), createdAt: new Date("2025-03-05T09:45") },
  { id: "i2", guardId: "g2", guardName: "Tanya Brooks",  siteId: "s2", siteName: "Port of Long Beach",     shiftId: "sh2", type: "SUSPICIOUS_ACTIVITY", severity: "MEDIUM",   description: "Unidentified vehicle circling Gate 7 for 20 minutes.",       photoKeys: [], occurredAt: new Date("2025-03-05T16:10"), createdAt: new Date("2025-03-05T16:20") },
  { id: "i3", guardId: "g7", guardName: "Leon Carter",   siteId: "s5", siteName: "Westfield Topanga",      shiftId: "sh5", type: "VANDALISM",          severity: "LOW",      description: "Graffiti found on parking level B2 pillar.",                 photoKeys: [], occurredAt: new Date("2025-03-05T11:00"), createdAt: new Date("2025-03-05T11:15") },
  { id: "i4", guardId: "g1", guardName: "Marcus Rivera", siteId: "s1", siteName: "Westfield Century City", shiftId: "sh1", type: "MEDICAL",            severity: "CRITICAL", description: "Patron collapsed near food court. EMS dispatched.",           photoKeys: [], occurredAt: new Date("2025-03-05T12:45"), createdAt: new Date("2025-03-05T12:50") },
];

export const mockActivityFeed = [
  { id: "a1", title: "Shift started — Tanya Brooks @ Port of Long Beach",       timestamp: "2:00 PM",  type: "info"    as const },
  { id: "a2", title: "Incident reported — Medical emergency at Century City",   timestamp: "12:50 PM", type: "danger"  as const, description: "Patron collapsed near food court. EMS dispatched." },
  { id: "a3", title: "Shift completed — Marcus Rivera @ Westfield Century City",timestamp: "2:00 PM",  type: "success" as const },
  { id: "a4", title: "Incident reported — Shoplifter apprehended",              timestamp: "9:45 AM",  type: "warning" as const, description: "South entrance, police notified." },
  { id: "a5", title: "Shift completed — Leon Carter @ Westfield Topanga",       timestamp: "2:00 PM",  type: "success" as const },
  { id: "a6", title: "Shift cancelled — Sofia Mendez @ Westfield Topanga",      timestamp: "Yesterday",type: "danger"  as const },
];

export const mockShiftChartData = [
  { day: "Mon", completed: 4, scheduled: 2, cancelled: 0 },
  { day: "Tue", completed: 5, scheduled: 1, cancelled: 1 },
  { day: "Wed", completed: 3, scheduled: 3, cancelled: 0 },
  { day: "Thu", completed: 6, scheduled: 2, cancelled: 0 },
  { day: "Fri", completed: 4, scheduled: 4, cancelled: 1 },
  { day: "Sat", completed: 7, scheduled: 1, cancelled: 0 },
  { day: "Sun", completed: 3, scheduled: 2, cancelled: 0 },
];
