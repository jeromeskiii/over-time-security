"use client";
import { Users, MapPin, Calendar, AlertTriangle } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { ActivityFeed } from "@/components/ui/ActivityFeed";
import { mockGuards, mockShifts, mockSites, mockIncidents, mockActivityFeed, mockShiftChartData } from "@/lib/mock-data";

const stats = [
  {
    label: "Active Guards",
    value: mockGuards.filter((g) => g.status === "ACTIVE").length,
    icon: Users,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
  },
  {
    label: "Active Sites",
    value: mockSites.length,
    icon: MapPin,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
  },
  {
    label: "Shifts Today",
    value: mockShifts.length,
    icon: Calendar,
    color: "text-amber-400",
    bg: "bg-amber-500/10",
  },
  {
    label: "Open Incidents",
    value: mockIncidents.filter((i) => i.severity === "HIGH" || i.severity === "CRITICAL").length,
    icon: AlertTriangle,
    color: "text-red-400",
    bg: "bg-red-500/10",
  },
];

export default function OverviewPage() {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-accent mb-1">Dashboard</p>
        <h1 className="text-2xl font-black uppercase tracking-tight text-text-primary">Operations Overview</h1>
        <p className="text-sm text-text-secondary mt-1">Today — March 5, 2025</p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-surface border border-white/5 rounded-sm p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-text-secondary">{s.label}</p>
                <p className="text-3xl font-black text-text-primary mt-1">{s.value}</p>
              </div>
              <div className={`p-2 rounded-sm ${s.bg}`}>
                <s.icon size={18} className={s.color} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Chart + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Shift chart */}
        <div className="lg:col-span-2 bg-surface border border-white/5 rounded-sm p-5">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-text-secondary mb-4">Shifts This Week</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={mockShiftChartData} barSize={10} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="day" tick={{ fill: "#9ca3af", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#9ca3af", fontSize: 11 }} axisLine={false} tickLine={false} width={24} />
              <Tooltip
                contentStyle={{ background: "#0b0f14", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 2, fontSize: 12 }}
                labelStyle={{ color: "#e6e6e6", fontWeight: 700 }}
                itemStyle={{ color: "#9ca3af" }}
              />
              <Bar dataKey="completed" name="Completed" fill="#10b981" radius={[2, 2, 0, 0]} />
              <Bar dataKey="scheduled" name="Scheduled" fill="#3b82f6" radius={[2, 2, 0, 0]} />
              <Bar dataKey="cancelled" name="Cancelled"  fill="#ef4444" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Activity feed */}
        <div className="bg-surface border border-white/5 rounded-sm p-5">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-text-secondary mb-4">Recent Activity</p>
          <ActivityFeed items={mockActivityFeed} />
        </div>
      </div>
    </div>
  );
}
