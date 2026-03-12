import * as React from "react";
import { cn } from "../lib/utils";
import { Card } from "../primitives/Card";

/**
 * Hero + System Validation Panel
 * Reusable layout: emotional framing (command block) + operational credibility (KPI/viz panel).
 * Use for: dashboard overview, client portal landing, internal ops surfaces.
 *
 * Layout:
 * - Desktop: 58% Command Block | 42% Operational Panel
 * - Tablet: Command Block → Operational Panel (stacked)
 * - Mobile: Command block → KPI strip → simplified visualization
 */

export interface HeroValidationPanelProps extends React.HTMLAttributes<HTMLElement> {
  /** Left column: meta label above headline (e.g. "Network.Surface.v3") */
  metaLabel?: React.ReactNode;
  /** Dominant focal: command/display headline */
  headline: React.ReactNode;
  /** Supporting explanation below headline */
  supporting?: React.ReactNode;
  /** Primary CTA (Button) */
  primaryAction?: React.ReactNode;
  /** Secondary action(s) */
  secondaryAction?: React.ReactNode;
  /** Status strip (KPIs / StatusBadges) — shown at top of panel on all breakpoints */
  statusStrip?: React.ReactNode;
  /** Main visualization (DataVisualization or custom primitive) */
  visualization?: React.ReactNode;
  /** Optional module hints or secondary panel content */
  moduleHints?: React.ReactNode;
  /** Log / structured list (StructuredList primitive) */
  log?: React.ReactNode;
  /** Optional panel title for the operational card */
  panelTitle?: string;
  /** Optional panel subtitle (e.g. surface ID) */
  panelSubtitle?: string;
  /** Section ID for anchor */
  id?: string;
  /** Accessibility label for the section */
  "aria-label"?: string;
}

const HeroValidationPanel = React.forwardRef<HTMLElement, HeroValidationPanelProps>(
  (
    {
      metaLabel,
      headline,
      supporting,
      primaryAction,
      secondaryAction,
      statusStrip,
      visualization,
      moduleHints,
      log,
      panelTitle,
      panelSubtitle,
      id,
      "aria-label": ariaLabel,
      className,
      ...props
    },
    ref
  ) => {
    const hasPanelContent =
      statusStrip || visualization || moduleHints || log || panelTitle || panelSubtitle;

    return (
      <section
        ref={ref as React.Ref<HTMLDivElement>}
        id={id}
        aria-label={ariaLabel ?? "Hero and system validation"}
        className={cn(
          "relative w-full",
          "grid grid-cols-1 gap-8 md:gap-12",
          "lg:grid-cols-[58fr_42fr] lg:gap-16",
          className
        )}
        {...props}
      >
        {/* Command Block — 58% on desktop */}
        <div className="flex min-w-0 flex-col justify-center order-1">
          {metaLabel && (
            <div className="mb-4 label">
              {metaLabel}
            </div>
          )}
          <div className="display text-text-primary leading-[0.9]">
            {headline}
          </div>
          {supporting && (
            <div className="mt-5 max-w-md body text-text-secondary/80 normal-case tracking-normal">
              {supporting}
            </div>
          )}
          {(primaryAction || secondaryAction) && (
            <div className="mt-6 flex flex-wrap gap-4">
              {primaryAction}
              {secondaryAction}
            </div>
          )}
        </div>

        {/* Operational Panel — 42% on desktop; on mobile: status strip then viz */}
        {hasPanelContent && (
          <div className="order-2 flex min-w-0 flex-col gap-6 lg:pl-4">
            <Card className="flex flex-col overflow-hidden border-white/10 bg-surface/40 backdrop-blur-sm">
              {(panelTitle || panelSubtitle) && (
                <div className="flex flex-col gap-0.5 border-b border-white/10 bg-white/[0.02] px-6 py-4">
                  {panelTitle && (
                    <span className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-text-primary">
                      {panelTitle}
                    </span>
                  )}
                  {panelSubtitle && (
                    <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-text-secondary/60">
                      {panelSubtitle}
                    </span>
                  )}
                </div>
              )}
              {statusStrip && (
                <div className="border-b border-white/10 px-6 py-4">
                  {statusStrip}
                </div>
              )}
              {visualization && (
                <div className="relative min-h-[280px] md:min-h-[320px] lg:min-h-[360px]">
                  {visualization}
                </div>
              )}
              {moduleHints && (
                <div className="border-t border-white/5 px-6 py-4 text-text-secondary/80">
                  {moduleHints}
                </div>
              )}
              {log && (
                <div className="border-t border-white/10 px-6 py-4">
                  {log}
                </div>
              )}
            </Card>
          </div>
        )}
      </section>
    );
  }
);
HeroValidationPanel.displayName = "HeroValidationPanel";

export { HeroValidationPanel };
