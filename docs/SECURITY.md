# Security Policy

## Authentication

### Operations Portal
- Role-based access control (RBAC) via `@ots/domain/policies`
- Roles: admin, supervisor, client
- Custom JWT auth via `@ots/auth` — HTTP-only `session` cookie, 8-hour access tokens
- All API routes enforce session + permission check via `apps/ops/src/lib/auth.ts`
- Today the ops portal is **admin-only** (single env-var credential). Supervisor and client roles are defined in RBAC but no user table exists yet.

### Guard App
- Phone → OTP → PIN three-step login
- OTPs: SHA-256 hashed, stored in `VerificationToken` DB table, 5-minute TTL, single-use
- PINs: bcrypt-hashed in `Guard.pinHash`. Guards without a hash are allowed through during migration rollout (logged as warning).
- Access tokens expire in **12 hours** (one shift)
- Guard identity is always derived from the verified session token — the request body is never trusted for `guardId`
- Shift ownership is verified on every write: checkin, patrol, and incident routes confirm `shift.guardId === session.guardId`

---

## Data Protection

### Sensitive Data
- Guard license numbers (encrypted at rest)
- Client contact information
- Incident photos and reports

### Access Control
- Guards can only access their own shifts
- Supervisors can access their assigned sites
- Admins have full access
- Clients can only view their own reports

---

## API Security

- All API routes require authentication
- Rate limiting on public endpoints
- Input validation via Zod schemas
- SQL injection protection via Prisma

---

## File Storage

- Incident photos stored in S3
- Pre-signed URLs for temporary access
- No public access to files

---

## Reporting

- Incident severity levels: low, medium, high, critical
- Critical incidents trigger immediate notifications
- AI-generated reports reviewed before sending
