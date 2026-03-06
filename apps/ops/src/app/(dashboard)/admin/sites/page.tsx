"use client";
import { useState, useMemo } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { Search, MapPin } from "lucide-react";
import { DataTable } from "@/components/ui/DataTable";
import { Drawer } from "@/components/ui/Drawer";
import { DensityToggle } from "@/components/ui/DensityToggle";
import { mockSites } from "@/lib/mock-data";

type SiteRow = (typeof mockSites)[number];

const columns: ColumnDef<SiteRow, unknown>[] = [
  {
    accessorKey: "location",
    header: "Location",
    cell: ({ getValue }) => (
      <span className="font-semibold text-text-primary">{getValue() as string}</span>
    ),
  },
  { accessorKey: "clientName", header: "Client" },
  {
    accessorKey: "instructions",
    header: "Instructions",
    cell: ({ getValue }) => (
      <span className="text-text-secondary text-xs truncate max-w-[260px] block">{getValue() as string}</span>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Added",
    cell: ({ getValue }) =>
      (getValue() as Date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
  },
];

export default function SitesPage() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<SiteRow | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const filtered = useMemo(() =>
    mockSites.filter((s) =>
      s.location.toLowerCase().includes(search.toLowerCase()) ||
      s.clientName.toLowerCase().includes(search.toLowerCase())
    ), [search]);

  return (
    <div className="space-y-5">
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-accent mb-1">Locations</p>
        <h1 className="text-2xl font-black uppercase tracking-tight text-text-primary">Sites</h1>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 bg-surface border border-white/10 rounded-sm px-3 py-2 flex-1 min-w-[200px] max-w-sm">
          <Search size={14} className="text-text-secondary shrink-0" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search sites or clients..."
            className="bg-transparent text-sm text-text-primary placeholder:text-text-secondary outline-none w-full"
          />
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

      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} title="Site Details">
        {selected && (
          <div className="space-y-5">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-sm bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                <MapPin size={24} className="text-blue-400" />
              </div>
              <div>
                <p className="text-base font-black text-text-primary leading-snug">{selected.location}</p>
                <p className="text-xs text-text-secondary mt-0.5">{selected.clientName}</p>
              </div>
            </div>
            <div className="space-y-3">
              {[
                { label: "Client",       value: selected.clientName },
                { label: "Instructions", value: selected.instructions ?? "—" },
                { label: "Added",        value: selected.createdAt.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) },
              ].map((f) => (
                <div key={f.label} className="py-2.5 border-b border-white/5">
                  <span className="block text-[11px] font-semibold uppercase tracking-wider text-text-secondary mb-1">{f.label}</span>
                  <span className="text-sm text-text-primary">{f.value}</span>
                </div>
              ))}
            </div>
            <button className="w-full bg-surface border border-white/10 hover:border-white/20 text-text-primary px-4 py-2 rounded-sm text-xs font-bold uppercase tracking-wider transition-colors">
              Edit Site
            </button>
          </div>
        )}
      </Drawer>
    </div>
  );
}
