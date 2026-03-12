# System Spine

This is the single production vertical slice we optimize first:

`Client -> Quote -> Shift -> Guard -> Incident -> Report`

## Workflow

1. **Client**
   - A prospect submits intake data from `apps/web` (`/api/leads`).
   - Record of truth: `Lead` in `@ots/db`.

2. **Quote**
   - Ops reviews and qualifies the lead, then generates pricing scope.
   - Record of truth: lead status + estimate artifacts.

3. **Shift**
   - Approved quote creates planned coverage windows.
   - Record of truth: `Shift` + `Site` in `@ots/db`.

4. **Guard**
   - Guard is assigned and authenticates in `apps/guard`.
   - Record of truth: `Guard` + assignment references.

5. **Incident**
   - Guard submits field event from guard app (`/api/incidents`).
   - Record of truth: `Incident`; automation emits downstream events.

6. **Report**
   - Ops reviews AI-generated report, approves, and sends to client.
   - Record of truth: `Report` with status lifecycle.

## Why This Is The Spine

- It ties revenue intake to delivery quality.
- It drives the highest-leverage data loop for automation.
- It constrains architecture decisions to one end-to-end path before adding branches.

## Operational Rule

Any new feature must map to one stage above or clearly justify a new stage.
