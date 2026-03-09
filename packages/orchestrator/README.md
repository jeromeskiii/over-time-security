# @ots/orchestrator

**Status: Experimental / Not yet wired to production**

This package contains an MCTS-based agent routing engine intended for future AI workflow orchestration. It is **not imported by any app or package** and is not part of the active runtime.

## Contents

- `src/mcts/` — Monte Carlo Tree Search implementation for agent selection
- `src/agents/` — Agent definitions and capability declarations
- `src/router/` — Task classification and routing logic
- `src/polyglot/` — Multi-language code generation helpers

## Usage (future)

```typescript
import { createOrchestrator } from '@ots/orchestrator';

const orch = createOrchestrator({ useMCTS: true });
const result = await orch.select({ prompt: 'Generate incident summary', context: {} });
```

## Intentional Tradeoffs

- Not part of CI or build pipeline — `turbo build` and `turbo typecheck` do not include this package.
- No tests exist yet — add tests before wiring to production.
- Activate via `pnpm --filter @ots/orchestrator typecheck` to check types independently.
