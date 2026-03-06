"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Shield,
  LayoutDashboard,
  Users,
  MapPin,
  Calendar,
  FileText,
  Settings,
  LogOut,
  Bell,
  ChevronLeft,
  ChevronRight,
  Menu,
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { DensityProvider } from "./ui/DensityToggle";

const navItems = [
  { icon: LayoutDashboard, label: "Overview",  href: "/admin" },
  { icon: Users,           label: "Guards",    href: "/admin/guards" },
  { icon: MapPin,          label: "Sites",     href: "/admin/sites" },
  { icon: Calendar,        label: "Shifts",    href: "/admin/shifts" },
  { icon: FileText,        label: "Reports",   href: "/admin/reports" },
  { icon: Settings,        label: "Settings",  href: "/admin/settings" },
];

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <DensityProvider>
      <div className="min-h-screen flex bg-base">
        {/* Sidebar */}
        <aside
          className={cn(
            "flex flex-col bg-surface border-r border-white/5 transition-all duration-300 shrink-0",
            collapsed ? "w-[60px]" : "w-[220px]"
          )}
        >
          {/* Logo */}
          <div className={cn("flex items-center border-b border-white/5 h-14 shrink-0", collapsed ? "justify-center px-0" : "px-5 gap-3")}>
            <Shield className="w-6 h-6 text-brand-accent shrink-0" strokeWidth={1.5} />
            {!collapsed && (
              <span className="font-black text-xs uppercase tracking-widest text-text-primary whitespace-nowrap">
                OTS Ops
              </span>
            )}
          </div>

          {/* Nav */}
          <nav className="flex-1 py-3 px-2 space-y-0.5">
            {navItems.map((item) => {
              const active = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={collapsed ? item.label : undefined}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm transition-colors group",
                    active
                      ? "bg-brand-accent/10 text-brand-accent"
                      : "text-text-secondary hover:text-text-primary hover:bg-white/5",
                    collapsed && "justify-center"
                  )}
                >
                  <item.icon size={17} className="shrink-0" />
                  {!collapsed && <span className="font-medium">{item.label}</span>}
                </Link>
              );
            })}
          </nav>

          {/* Collapse toggle + sign out */}
          <div className="border-t border-white/5 p-2 space-y-0.5">
            <button
              onClick={() => setCollapsed(!collapsed)}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-sm text-text-secondary hover:text-text-primary hover:bg-white/5 w-full text-sm transition-colors",
                collapsed && "justify-center"
              )}
            >
              {collapsed ? <ChevronRight size={17} /> : <><ChevronLeft size={17} /><span className="font-medium">Collapse</span></>}
            </button>
            <button
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-sm text-text-secondary hover:text-red-400 w-full text-sm transition-colors",
                collapsed && "justify-center"
              )}
            >
              <LogOut size={17} className="shrink-0" />
              {!collapsed && <span className="font-medium">Sign Out</span>}
            </button>
          </div>
        </aside>

        {/* Main area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top bar */}
          <header className="h-14 border-b border-white/5 bg-surface flex items-center px-6 gap-4 shrink-0">
            <button className="md:hidden p-1.5 rounded-sm hover:bg-white/10 text-text-secondary">
              <Menu size={18} />
            </button>

            {/* Search */}
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-sm px-3 py-1.5 flex-1 max-w-sm">
              <Search size={14} className="text-text-secondary shrink-0" />
              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent text-sm text-text-primary placeholder:text-text-secondary outline-none w-full"
              />
            </div>

            <div className="flex-1" />

            {/* Org switcher */}
            <div className="hidden sm:flex items-center gap-2 bg-white/5 border border-white/10 rounded-sm px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-text-secondary cursor-pointer hover:border-white/20 transition-colors">
              <Shield size={13} className="text-brand-accent" />
              Over Time Security
            </div>

            {/* Notifications */}
            <button className="relative p-2 rounded-sm hover:bg-white/10 text-text-secondary hover:text-text-primary transition-colors">
              <Bell size={17} />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-brand-accent rounded-full" />
            </button>

            {/* Avatar */}
            <div className="w-8 h-8 rounded-sm bg-brand-accent/20 border border-brand-accent/30 flex items-center justify-center text-xs font-bold text-brand-accent cursor-pointer">
              AD
            </div>
          </header>

          {/* Page content */}
          <main className="flex-1 overflow-auto p-6">{children}</main>
        </div>
      </div>
    </DensityProvider>
  );
}
