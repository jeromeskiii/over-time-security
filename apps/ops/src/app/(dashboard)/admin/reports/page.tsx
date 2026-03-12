"use client";
import { useState, useEffect, useMemo } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { Search, FileText, AlertTriangle, CheckCircle, Send, Eye } from "lucide-react";
import { DataTable } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Drawer } from "@/components/ui/Drawer";
import { DensityToggle } from "@/components/ui/DensityToggle";
import { cn } from "@/lib/utils";
import type { ReportStatus } from "@ots/domain";

type ReportRow = {
  id: string;
  incidentId: string;
  content: string;
  status: ReportStatus;
  pdfKey: string | null;
  sentAt: Date | null;
  sentTo: string | null;
  createdAt: Date;
  incident: {
    type: string;
    severity: string;
    description: string;
    occurredAt: Date;
    guard: { name: string };
    site: { location: string };
  };
};

const STATUS_FILTERS = ["all", "PENDING", "AI_GENERATED", "SUPERVISOR_REVIEW", "APPROVED", "SENT"] as const;

const STATUS_LABELS: Record<ReportStatus, string> = {
  PENDING: "Pending",
  AI_GENERATED: "AI Generated",
  SUPERVISOR_REVIEW: "In Review",
  APPROVED: "Approved",
  SENT: "Sent",
};

const columns: ColumnDef<ReportRow, unknown>[] = [
  {
    accessorKey: "incident.type",
    header: "Type",
    cell: ({ row }) => (
      <span className="capitalize font-medium text-text-primary">
        {row.original.incident.type.replace("_", " ")}
      </span>
    ),
  },
  {
    accessorKey: "incident.guard.name",
    header: "Guard",
    cell: ({ row }) => row.original.incident.guard.name,
  },
  {
    accessorKey: "incident.site.location",
    header: "Site",
    cell: ({ row }) => row.original.incident.site.location,
  },
  {
    accessorKey: "incident.severity",
    header: "Severity",
    cell: ({ row }) => <StatusBadge status={row.original.incident.severity as any} />,
  },
  {
    accessorKey: "status",
    header: "Report Status",
    cell: ({ getValue }) => {
      const status = getValue() as ReportStatus;
      return (
        <span className={cn(
          "px-2 py-1 text-xs font-semibold rounded-sm",
          status === "SENT" && "bg-emerald-500/20 text-emerald-400",
          status === "APPROVED" && "bg-blue-500/20 text-blue-400",
          status === "SUPERVISOR_REVIEW" && "bg-amber-500/20 text-amber-400",
          status === "AI_GENERATED" && "bg-purple-500/20 text-purple-400",
          status === "PENDING" && "bg-gray-500/20 text-gray-400",
        )}>
          {STATUS_LABELS[status]}
        </span>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ getValue }) => {
      const d = new Date(getValue() as string);
      return d.toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
    },
  },
];

export default function ReportsPage() {
  const [reports, setReports] = useState<ReportRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selected, setSelected] = useState<ReportRow | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [sendEmail, setSendEmail] = useState("");

  useEffect(() => {
    async function fetchReports() {
      try {
        const res = await fetch("/api/reports");
        if (!res.ok) throw new Error("Failed to fetch reports");
        const data = await res.json();
        setReports(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load reports");
      } finally {
        setLoading(false);
      }
    }
    fetchReports();
  }, []);

  const filtered = useMemo(() =>
    reports.filter((r) => {
      const matchSearch =
        r.incident.guard.name.toLowerCase().includes(search.toLowerCase()) ||
        r.incident.site.location.toLowerCase().includes(search.toLowerCase()) ||
        r.incident.type.toLowerCase().includes(search.toLowerCase()) ||
        r.content.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === "all" || r.status === statusFilter;
      return matchSearch && matchStatus;
    }), [reports, search, statusFilter]);

  const stats = useMemo(() => ({
    total: reports.length,
    pending: reports.filter((r) => r.status === "PENDING" || r.status === "AI_GENERATED").length,
    review: reports.filter((r) => r.status === "SUPERVISOR_REVIEW").length,
    approved: reports.filter((r) => r.status === "APPROVED").length,
    sent: reports.filter((r) => r.status === "SENT").length,
  }), [reports]);

  async function handleAction(action: "approve" | "send") {
    if (!selected) return;
    if (action === "send" && !sendEmail) {
      alert("Please enter an email address");
      return;
    }

    setActionLoading(true);
    try {
      const res = await fetch("/api/reports", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selected.id,
          status: action === "approve" ? "APPROVED" : "SENT",
          sentTo: action === "send" ? sendEmail : undefined,
        }),
      });
      if (!res.ok) throw new Error("Failed to update report");
      const updated = await res.json();
      setReports((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
      setSelected(updated);
      if (action === "send") setDrawerOpen(false);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to update report");
    } finally {
      setActionLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-text-secondary">Loading reports...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-accent mb-1">Reports</p>
          <h1 className="text-2xl font-black uppercase tracking-tight text-text-primary">AI-Generated Reports</h1>
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {[
          { label: "Total", value: stats.total, color: "text-text-primary" },
          { label: "Pending", value: stats.pending, color: "text-gray-400" },
          { label: "In Review", value: stats.review, color: "text-amber-400" },
          { label: "Approved", value: stats.approved, color: "text-blue-400" },
          { label: "Sent", value: stats.sent, color: "text-emerald-400" },
        ].map((s) => (
          <div key={s.label} className="bg-surface border border-white/5 rounded-sm px-4 py-3">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-text-secondary">{s.label}</p>
            <p className={cn("text-2xl font-black mt-0.5", s.color)}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 bg-surface border border-white/10 rounded-sm px-3 py-2 flex-1 min-w-[200px] max-w-sm">
          <Search size={14} className="text-text-secondary shrink-0" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search reports..."
            className="bg-transparent text-sm text-text-primary placeholder:text-text-secondary outline-none w-full"
          />
        </div>
        <div className="flex items-center gap-1 flex-wrap">
          {STATUS_FILTERS.map((s) => (
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
              {s === "all" ? "All" : STATUS_LABELS[s as ReportStatus]}
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
          onRowClick={(row) => { setSelected(row); setDrawerOpen(true); setSendEmail(""); }}
        />
      </div>

      {/* Detail Drawer */}
      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} title="Report Details">
        {selected && (
          <div className="space-y-5">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-sm bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                <FileText size={24} className="text-purple-400" />
              </div>
              <div>
                <p className="text-base font-black text-text-primary capitalize">
                  {selected.incident.type.replace("_", " ")}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <StatusBadge status={selected.incident.severity as any} />
                  <span className={cn(
                    "px-2 py-0.5 text-xs font-semibold rounded-sm",
                    selected.status === "SENT" && "bg-emerald-500/20 text-emerald-400",
                    selected.status === "APPROVED" && "bg-blue-500/20 text-blue-400",
                    selected.status === "SUPERVISOR_REVIEW" && "bg-amber-500/20 text-amber-400",
                    selected.status === "AI_GENERATED" && "bg-purple-500/20 text-purple-400",
                    selected.status === "PENDING" && "bg-gray-500/20 text-gray-400",
                  )}>
                    {STATUS_LABELS[selected.status]}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white/[0.03] border border-white/5 rounded-sm p-4">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-text-secondary mb-2">AI-Generated Content</p>
              <p className="text-sm text-text-primary leading-relaxed whitespace-pre-wrap">{selected.content}</p>
            </div>

            <div className="space-y-1">
              {[
                { label: "Guard", value: selected.incident.guard.name },
                { label: "Site", value: selected.incident.site.location },
                { label: "Incident Occurred", value: new Date(selected.incident.occurredAt).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" }) },
                { label: "Report Created", value: new Date(selected.createdAt).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" }) },
                ...(selected.sentAt ? [{ label: "Sent At", value: new Date(selected.sentAt).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" }) }] : []),
                ...(selected.sentTo ? [{ label: "Sent To", value: selected.sentTo }] : []),
              ].map((f) => (
                <div key={f.label} className="flex justify-between items-center py-2.5 border-b border-white/5">
                  <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">{f.label}</span>
                  <span className="text-sm text-text-primary">{f.value}</span>
                </div>
              ))}
            </div>

            {/* Action buttons based on status */}
            {selected.status === "SUPERVISOR_REVIEW" && (
              <div className="space-y-3">
                <button
                  onClick={() => handleAction("approve")}
                  disabled={actionLoading}
                  className="w-full inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-sm text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-50"
                >
                  <CheckCircle size={14} /> {actionLoading ? "Approving..." : "Approve Report"}
                </button>
              </div>
            )}

            {selected.status === "APPROVED" && (
              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-text-secondary mb-1.5">
                    Recipient Email
                  </label>
                  <input
                    type="email"
                    value={sendEmail}
                    onChange={(e) => setSendEmail(e.target.value)}
                    placeholder="client@example.com"
                    className="w-full bg-white/5 border border-white/10 rounded-sm px-3 py-2 text-sm text-text-primary placeholder:text-text-secondary outline-none focus:border-brand-accent/50 transition-colors"
                  />
                </div>
                <button
                  onClick={() => handleAction("send")}
                  disabled={actionLoading || !sendEmail}
                  className="w-full inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-sm text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-50"
                >
                  <Send size={14} /> {actionLoading ? "Sending..." : "Send Report"}
                </button>
              </div>
            )}

            {selected.status === "SENT" && (
              <div className="flex items-center gap-2 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-sm">
                <CheckCircle size={16} className="text-emerald-400" />
                <span className="text-sm text-emerald-400">Report sent to {selected.sentTo}</span>
              </div>
            )}

            {selected.status === "PENDING" && (
              <div className="flex items-center gap-2 p-3 bg-gray-500/10 border border-gray-500/20 rounded-sm">
                <Eye size={16} className="text-gray-400" />
                <span className="text-sm text-gray-400">AI report generation in progress...</span>
              </div>
            )}
          </div>
        )}
      </Drawer>
    </div>
  );
}
