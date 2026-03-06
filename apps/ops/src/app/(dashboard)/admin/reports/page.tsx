"use client";
import { useState, useMemo } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { Search, Download, FileText, AlertTriangle } from "lucide-react";
import { DataTable } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Drawer } from "@/components/ui/Drawer";
import { DensityToggle } from "@/components/ui/DensityToggle";
import { mockIncidents, mockShifts, mockGuards } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import type { Incident } from "@ots/domain";

type IncidentRow = (typeof mockIncidents)[number];

const SEVERITY_FILTERS = ["all", "low", "medium", "high", "critical"] as const;

const columns: ColumnDef<IncidentRow, unknown>[] = [
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ getValue }) => (
      <span className="capitalize font-medium text-text-primary">
        {(getValue() as string).replace("_", " ")}
      </span>
    ),
  },
  { accessorKey: "guardName", header: "Guard" },
  { accessorKey: "siteName",  header: "Site" },
  {
    accessorKey: "severity",
    header: "Severity",
    cell: ({ getValue }) => <StatusBadge status={getValue() as Incident["severity"]} />,
  },
  {
    accessorKey: "occurredAt",
    header: "Occurred",
    cell: ({ getValue }) => {
      const d = getValue() as Date;
      return d.toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
    },
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ getValue }) => (
      <span className="text-text-secondary text-xs truncate max-w-[240px] block">{getValue() as string}</span>
    ),
  },
];

const summaryStats = [
  { label: "Total Incidents", value: mockIncidents.length,                                                    color: "text-text-primary" },
  { label: "Critical",        value: mockIncidents.filter((i) => i.severity === "CRITICAL").length,           color: "text-red-400" },
  { label: "High",            value: mockIncidents.filter((i) => i.severity === "HIGH").length,               color: "text-orange-400" },
  { label: "Shifts Logged",   value: mockShifts.filter((s) => s.status === "COMPLETED").length,               color: "text-emerald-400" },
  { label: "Active Guards",   value: mockGuards.filter((g) => g.status === "ACTIVE").length,                  color: "text-blue-400" },
];

export default function ReportsPage() {
  const [search, setSearch] = useState("");
  const [severityFilter, setSeverityFilter] = useState<string>("all");
  const [selected, setSelected] = useState<IncidentRow | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const filtered = useMemo(() =>
    mockIncidents.filter((i) => {
      const matchSearch =
        i.guardName.toLowerCase().includes(search.toLowerCase()) ||
        i.siteName.toLowerCase().includes(search.toLowerCase()) ||
        i.type.toLowerCase().includes(search.toLowerCase()) ||
        i.description.toLowerCase().includes(search.toLowerCase());
      const matchSeverity = severityFilter === "all" || i.severity.toLowerCase() === severityFilter;
      return matchSearch && matchSeverity;
    }), [search, severityFilter]);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-accent mb-1">Analytics</p>
          <h1 className="text-2xl font-black uppercase tracking-tight text-text-primary">Reports</h1>
        </div>
        <button className="inline-flex items-center gap-2 bg-surface border border-white/10 hover:border-white/20 text-text-primary px-4 py-2 rounded-sm text-xs font-bold uppercase tracking-wider transition-colors">
          <Download size={14} /> Export PDF
        </button>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {summaryStats.map((s) => (
          <div key={s.label} className="bg-surface border border-white/5 rounded-sm px-4 py-3">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-text-secondary">{s.label}</p>
            <p className={cn("text-2xl font-black mt-0.5", s.color)}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Incident log */}
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-text-secondary mb-3">Incident Log</p>

        <div className="flex flex-wrap items-center gap-3 mb-3">
          <div className="flex items-center gap-2 bg-surface border border-white/10 rounded-sm px-3 py-2 flex-1 min-w-[200px] max-w-sm">
            <Search size={14} className="text-text-secondary shrink-0" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search incidents..."
              className="bg-transparent text-sm text-text-primary placeholder:text-text-secondary outline-none w-full"
            />
          </div>
          <div className="flex items-center gap-1 flex-wrap">
            {SEVERITY_FILTERS.map((s) => (
              <button
                key={s}
                onClick={() => setSeverityFilter(s)}
                className={cn(
                  "px-3 py-2 text-xs font-semibold uppercase tracking-wider rounded-sm transition-colors",
                  severityFilter === s
                    ? "bg-brand-accent text-white"
                    : "bg-surface border border-white/10 text-text-secondary hover:text-text-primary"
                )}
              >
                {s}
              </button>
            ))}
          </div>
          <DensityToggle className="ml-auto" />
        </div>

        <div className="bg-surface border border-white/5 rounded-sm overflow-hidden">
          <DataTable
            columns={columns}
            data={filtered}
            globalFilter={search}
            onRowClick={(row) => { setSelected(row); setDrawerOpen(true); }}
          />
        </div>
      </div>

      {/* Incident detail drawer */}
      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} title="Incident Report">
        {selected && (
          <div className="space-y-5">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-sm bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                <AlertTriangle size={24} className="text-red-400" />
              </div>
              <div>
                <p className="text-base font-black text-text-primary capitalize">
                  {selected.type.replace("_", " ")}
                </p>
                <StatusBadge status={selected.severity} className="mt-1" />
              </div>
            </div>

            <div className="bg-white/[0.03] border border-white/5 rounded-sm p-4">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-text-secondary mb-2">Description</p>
              <p className="text-sm text-text-primary leading-relaxed">{selected.description}</p>
            </div>

            <div className="space-y-1">
              {[
                { label: "Guard",     value: selected.guardName },
                { label: "Site",      value: selected.siteName },
                { label: "Occurred",  value: selected.occurredAt.toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" }) },
                { label: "Reported",  value: selected.createdAt.toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" }) },
              ].map((f) => (
                <div key={f.label} className="flex justify-between items-center py-2.5 border-b border-white/5">
                  <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">{f.label}</span>
                  <span className="text-sm text-text-primary">{f.value}</span>
                </div>
              ))}
            </div>

            <button className="w-full inline-flex items-center justify-center gap-2 bg-surface border border-white/10 hover:border-white/20 text-text-primary px-4 py-2 rounded-sm text-xs font-bold uppercase tracking-wider transition-colors">
              <FileText size={13} /> Export Report
            </button>
          </div>
        )}
      </Drawer>
    </div>
  );
}
