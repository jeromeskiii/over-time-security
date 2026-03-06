"use client";
import { useState, useMemo } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { Search, Calendar } from "lucide-react";
import { DataTable } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Drawer } from "@/components/ui/Drawer";
import { DensityToggle } from "@/components/ui/DensityToggle";
import { mockShifts } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import type { Shift } from "@ots/domain";

type ShiftRow = (typeof mockShifts)[number];

const STATUS_FILTERS = ["all", "scheduled", "in_progress", "completed", "cancelled"] as const;

function formatTime(d: Date) {
  return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
}
function formatDate(d: Date) {
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

const columns: ColumnDef<ShiftRow, unknown>[] = [
  {
    accessorKey: "guardName",
    header: "Guard",
    cell: ({ getValue }) => <span className="font-semibold text-text-primary">{getValue() as string}</span>,
  },
  { accessorKey: "siteName", header: "Site" },
  {
    accessorKey: "startTime",
    header: "Start",
    cell: ({ getValue }) => {
      const d = getValue() as Date;
      return <span>{formatDate(d)} {formatTime(d)}</span>;
    },
  },
  {
    accessorKey: "endTime",
    header: "End",
    cell: ({ getValue }) => {
      const d = getValue() as Date;
      return <span>{formatDate(d)} {formatTime(d)}</span>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ getValue }) => <StatusBadge status={getValue() as Shift["status"]} />,
  },
];

export default function ShiftsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selected, setSelected] = useState<ShiftRow | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const filtered = useMemo(() =>
    mockShifts.filter((s) => {
      const matchSearch =
        s.guardName.toLowerCase().includes(search.toLowerCase()) ||
        s.siteName.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === "all" || s.status.toLowerCase() === statusFilter;
      return matchSearch && matchStatus;
    }), [search, statusFilter]);

  return (
    <div className="space-y-5">
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-accent mb-1">Scheduling</p>
        <h1 className="text-2xl font-black uppercase tracking-tight text-text-primary">Shifts</h1>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 bg-surface border border-white/10 rounded-sm px-3 py-2 flex-1 min-w-[200px] max-w-sm">
          <Search size={14} className="text-text-secondary shrink-0" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search guard or site..."
            className="bg-transparent text-sm text-text-primary placeholder:text-text-secondary outline-none w-full"
          />
        </div>
        <div className="flex items-center gap-1 flex-wrap">
          {STATUS_FILTERS.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={cn(
                "px-3 py-2 text-xs font-semibold uppercase tracking-wider rounded-sm transition-colors whitespace-nowrap",
                statusFilter === s
                  ? "bg-brand-accent text-white"
                  : "bg-surface border border-white/10 text-text-secondary hover:text-text-primary"
              )}
            >
              {s.replace("_", " ")}
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

      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} title="Shift Details">
        {selected && (
          <div className="space-y-5">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-sm bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                <Calendar size={24} className="text-amber-400" />
              </div>
              <div>
                <p className="text-base font-black text-text-primary">{selected.guardName}</p>
                <p className="text-xs text-text-secondary mt-0.5">{selected.siteName}</p>
                <StatusBadge status={selected.status} className="mt-1.5" />
              </div>
            </div>
            <div className="space-y-1">
              {[
                { label: "Guard",    value: selected.guardName },
                { label: "Site",     value: selected.siteName },
                { label: "Start",    value: `${formatDate(selected.startTime)} ${formatTime(selected.startTime)}` },
                { label: "End",      value: `${formatDate(selected.endTime)} ${formatTime(selected.endTime)}` },
                { label: "Duration", value: `${Math.round((selected.endTime.getTime() - selected.startTime.getTime()) / 3600000)}h` },
              ].map((f) => (
                <div key={f.label} className="flex justify-between items-center py-2.5 border-b border-white/5">
                  <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">{f.label}</span>
                  <span className="text-sm text-text-primary">{f.value}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-2 pt-2">
              <button className="flex-1 bg-surface border border-white/10 hover:border-white/20 text-text-primary px-4 py-2 rounded-sm text-xs font-bold uppercase tracking-wider transition-colors">
                Edit
              </button>
              <button className="flex-1 bg-red-600/10 border border-red-500/20 hover:border-red-500/40 text-red-400 px-4 py-2 rounded-sm text-xs font-bold uppercase tracking-wider transition-colors">
                Cancel
              </button>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
