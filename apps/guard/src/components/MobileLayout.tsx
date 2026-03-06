"use client";

import { Home, MapPin, AlertTriangle, Clock, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { OfflineIndicator } from "./OfflineIndicator";
import { useOutbox } from "@/lib/hooks";

const navItems = [
  { icon: Home, label: "Home", href: "/home" },
  { icon: MapPin, label: "Patrol", href: "/patrol" },
  { icon: AlertTriangle, label: "Incident", href: "/incident" },
  { icon: Clock, label: "Shift", href: "/shift" },
  { icon: User, label: "Profile", href: "/profile" },
];

export function MobileLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { pendingCount } = useOutbox();

  return (
    <div className="min-h-screen flex flex-col bg-base">
      <OfflineIndicator />
      <main className="flex-1 pt-safe">{children}</main>
      <nav className="fixed bottom-0 left-0 right-0 bg-surface/95 backdrop-blur border-t border-white/5 safe-area-pb z-40">
        <div className="flex items-center justify-around py-2 pb-safe">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-1 p-2 min-w-[64px] transition-colors",
                  isActive
                    ? "text-brand-accent"
                    : "text-text-secondary hover:text-text-primary"
                )}
              >
                <div className="relative">
                  <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                  {item.label === "Home" && pendingCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-brand-accent text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                      {pendingCount > 9 ? "9+" : pendingCount}
                    </span>
                  )}
                </div>
                <span
                  className={cn(
                    "text-[10px] font-semibold uppercase tracking-wider",
                    isActive && "text-brand-accent"
                  )}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
