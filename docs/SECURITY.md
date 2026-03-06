# Security Policy

## Authentication

### Operations Portal
- Role-based access control (RBAC)
- Roles: admin, supervisor, client
- Session-based authentication via NextAuth.js

### Guard App
- PIN + license number authentication
- GPS verification on check-in
- Session expires after shift end

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
