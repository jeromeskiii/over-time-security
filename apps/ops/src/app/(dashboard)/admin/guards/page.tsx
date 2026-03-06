"use client";
import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type ColumnDef } from "@tanstack/react-table";
import { Search, Plus, UserCheck } from "lucide-react";
import { z } from "zod";
import type { Guard } from "@ots/domain";
import { DataTable } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Drawer } from "@/components/ui/Drawer";
import { DensityToggle } from "@/components/ui/DensityToggle";
import { mockGuards } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const addGuardSchema = z.object({
  name:          z.string().min(1, "Name is required"),
  licenseNumber: z.string().min(1, "License number is required"),
  phone:         z.string().min(10, "Phone must be at least 10 digits"),
  status:        z.enum(["active", "inactive", "suspended"]),
});
type AddGuardInput = z.infer<typeof addGuardSchema>;

const columns: ColumnDef<Guard, unknown>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ getValue }) => (
      <span className="font-semibold text-text-primary">{getValue() as string}</span>
    ),
  },
  { accessorKey: "licenseNumber", header: "License #" },
  { accessorKey: "phone",         header: "Phone" },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ getValue }) => <StatusBadge status={getValue() as Guard["status"]} />,
  },
  {
    accessorKey: "createdAt",
    header: "Joined",
    cell: ({ getValue }) =>
      (getValue() as Date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
  },
];

export default function GuardsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selected, setSelected] = useState<Guard | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [guards, setGuards] = useState<Guard[]>(mockGuards);
  const [addOpen, setAddOpen] = useState(false);

  const filtered = useMemo(() => {
    return guards.filter((g) => {
      const matchSearch =
        g.name.toLowerCase().includes(search.toLowerCase()) ||
        g.licenseNumber.toLowerCase().includes(search.toLowerCase()) ||
        g.phone.includes(search);
      const matchStatus = statusFilter === "all" || g.status.toLowerCase() === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [guards, search, statusFilter]);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<AddGuardInput>({
    resolver: zodResolver(addGuardSchema),
    defaultValues: { status: "active" },
  });

  function onAddGuard(data: AddGuardInput) {
    const newGuard: Guard = {
      id: `g${Date.now()}`,
      ...data,
      status: data.status.toUpperCase() as Guard["status"],
      createdAt: new Date(),
    };
    setGuards((prev) => [newGuard, ...prev]);
    reset();
    setAddOpen(false);
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-accent mb-1">Personnel</p>
          <h1 className="text-2xl font-black uppercase tracking-tight text-text-primary">Guards</h1>
        </div>
        <button
          onClick={() => setAddOpen(true)}
          className="inline-flex items-center gap-2 bg-brand-accent hover:bg-brand-accent-hover text-white px-4 py-2 rounded-sm text-xs font-bold uppercase tracking-wider transition-colors"
        >
          <Plus size={14} /> Add Guard
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 bg-surface border border-white/10 rounded-sm px-3 py-2 flex-1 min-w-[200px] max-w-sm">
          <Search size={14} className="text-text-secondary shrink-0" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search guards..."
            className="bg-transparent text-sm text-text-primary placeholder:text-text-secondary outline-none w-full"
          />
        </div>
        <div className="flex items-center gap-1">
          {["all", "active", "inactive", "suspended"].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={cn(
                "px-3 py-2 text-xs font-semibold uppercase tracking-wider rounded-sm transition-colors",
                statusFilter === s
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

      {/* Table */}
      <div className="bg-surface border border-white/5 rounded-sm overflow-hidden">
        <DataTable
          columns={columns}
          data={filtered}
          globalFilter={search}
          onRowClick={(row) => { setSelected(row); setDrawerOpen(true); }}
        />
      </div>

      {/* Detail Drawer */}
      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title="Guard Details"
      >
        {selected && (
          <div className="space-y-5">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-sm bg-brand-accent/10 border border-brand-accent/20 flex items-center justify-center">
                <UserCheck size={24} className="text-brand-accent" />
              </div>
              <div>
                <p className="text-lg font-black text-text-primary">{selected.name}</p>
                <StatusBadge status={selected.status} className="mt-1" />
              </div>
            </div>
            <div className="space-y-3">
              {[
                { label: "License #",  value: selected.licenseNumber },
                { label: "Phone",      value: selected.phone },
                { label: "Joined",     value: selected.createdAt.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) },
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
                Suspend
              </button>
            </div>
          </div>
        )}
      </Drawer>

      {/* Add Guard Drawer */}
      <Drawer open={addOpen} onClose={() => setAddOpen(false)} title="Add New Guard">
        <form onSubmit={handleSubmit(onAddGuard)} className="space-y-4">
          {[
            { name: "name" as const,          label: "Full Name",       placeholder: "Marcus Rivera" },
            { name: "licenseNumber" as const,  label: "License Number",  placeholder: "CA-2024-0001" },
            { name: "phone" as const,          label: "Phone",           placeholder: "310-555-0100" },
          ].map((f) => (
            <div key={f.name}>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-text-secondary mb-1.5">
                {f.label}
              </label>
              <input
                {...register(f.name)}
                placeholder={f.placeholder}
                className="w-full bg-white/5 border border-white/10 rounded-sm px-3 py-2 text-sm text-text-primary placeholder:text-text-secondary outline-none focus:border-brand-accent/50 transition-colors"
              />
              {errors[f.name] && (
                <p className="text-xs text-red-400 mt-1">{errors[f.name]?.message}</p>
              )}
            </div>
          ))}
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-text-secondary mb-1.5">
              Status
            </label>
            <select
              {...register("status")}
              className="w-full bg-white/5 border border-white/10 rounded-sm px-3 py-2 text-sm text-text-primary outline-none focus:border-brand-accent/50 transition-colors"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-brand-accent hover:bg-brand-accent-hover text-white py-2.5 rounded-sm text-xs font-bold uppercase tracking-wider transition-colors mt-2"
          >
            Add Guard
          </button>
        </form>
      </Drawer>
    </div>
  );
}
