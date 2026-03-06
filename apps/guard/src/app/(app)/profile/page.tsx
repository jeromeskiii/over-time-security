"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  Settings,
  Wifi,
  WifiOff,
  Database,
  LogOut,
  ChevronRight,
  Shield,
  Moon,
  Vibrate,
  MapPin,
  RefreshCw,
  Check,
  Trash2,
} from "lucide-react";
import { useOnlineStatus, useOutbox, useHaptic } from "@/lib/hooks";
import { storage } from "@/lib/storage";

interface Settings {
  autoSync: boolean;
  highAccuracyGPS: boolean;
  voiceToText: boolean;
  hapticFeedback: boolean;
  darkMode: boolean;
}

interface ToggleProps {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  icon: React.ReactNode;
}

function Toggle({ label, description, checked, onChange, icon }: ToggleProps) {
  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-surface rounded-lg flex items-center justify-center text-text-secondary">
          {icon}
        </div>
        <div>
          <p className="font-semibold text-sm">{label}</p>
          {description && (
            <p className="text-xs text-text-secondary">{description}</p>
          )}
        </div>
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`w-12 h-6 rounded-full transition-colors relative ${
          checked ? "bg-brand-accent" : "bg-surface border border-white/10"
        }`}
      >
        <div
          className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
            checked ? "translate-x-7" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
}

export default function ProfilePage() {
  const router = useRouter();
  const online = useOnlineStatus();
  const { items, pendingCount, sync, isSyncing } = useOutbox();
  const haptic = useHaptic();
  const [settings, setSettings] = useState<Settings>(storage.settings.get() as Settings);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    storage.settings.set(settings);
  }, [settings]);

  const handleClearData = () => {
    localStorage.removeItem("ots_guard_outbox");
    localStorage.removeItem("ots_guard_active_shift");
    localStorage.removeItem("ots_guard_patrol_progress");
    localStorage.removeItem("ots_guard_draft_incident");
    haptic.trigger("heavy");
    setShowClearConfirm(false);
    window.location.reload();
  };

  const handleLogout = () => {
    storage.activeShift.clear();
    router.push("/login");
  };

  return (
    <div className="pb-24 pt-4 px-4 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-lg font-black uppercase tracking-tight">
          Profile
        </h1>
        <span className="text-xs font-bold text-brand-accent uppercase tracking-wider">
          Settings
        </span>
      </div>

      {/* Profile Card */}
      <div className="bg-surface border border-white/5 rounded-xl p-6 mb-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-brand-accent/20 rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-brand-accent" />
          </div>
          <div>
            <h2 className="text-lg font-black uppercase tracking-tight">
              John Mitchell
            </h2>
            <p className="text-text-secondary text-sm">Guard ID: G-2847</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                Active
              </span>
              <span className="text-[10px] text-text-secondary">
                License: BSIS-784321
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-center">
          <div className="bg-base rounded-lg p-3">
            <p className="text-2xl font-black text-brand-accent">127</p>
            <p className="text-[10px] uppercase tracking-wider text-text-secondary">
              Shifts Completed
            </p>
          </div>
          <div className="bg-base rounded-lg p-3">
            <p className="text-2xl font-black text-brand-accent">98%</p>
            <p className="text-[10px] uppercase tracking-wider text-text-secondary">
              On-Time Rate
            </p>
          </div>
        </div>
      </div>

      {/* Connection Status */}
      <div className="bg-surface border border-white/5 rounded-xl p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                online ? "bg-emerald-500/20" : "bg-amber-500/20"
              }`}
            >
              {online ? (
                <Wifi className="w-5 h-5 text-emerald-400" />
              ) : (
                <WifiOff className="w-5 h-5 text-amber-400" />
              )}
            </div>
            <div>
              <p className="font-semibold text-sm">
                {online ? "Online" : "Offline Mode"}
              </p>
              <p className="text-xs text-text-secondary">
                {pendingCount > 0
                  ? `${pendingCount} items waiting to sync`
                  : "All data synced"}
              </p>
            </div>
          </div>
          {pendingCount > 0 && (
            <button
              onClick={sync}
              disabled={isSyncing}
              className="p-2 bg-brand-accent/20 rounded-lg text-brand-accent"
            >
              <RefreshCw
                className={`w-5 h-5 ${isSyncing ? "animate-spin" : ""}`}
              />
            </button>
          )}
        </div>
      </div>

      {/* App Settings */}
      <div className="bg-surface border border-white/5 rounded-xl p-4 mb-6">
        <h3 className="text-xs font-bold uppercase tracking-wider text-text-secondary mb-4">
          App Settings
        </h3>

        <Toggle
          label="Auto Sync"
          description="Upload data when connection available"
          checked={settings.autoSync}
          onChange={(checked) =>
            setSettings((s) => ({ ...s, autoSync: checked }))
          }
          icon={<RefreshCw className="w-5 h-5" />}
        />

        <div className="border-t border-white/5" />

        <Toggle
          label="High Accuracy GPS"
          description="Use precise location (uses more battery)"
          checked={settings.highAccuracyGPS}
          onChange={(checked) =>
            setSettings((s) => ({ ...s, highAccuracyGPS: checked }))
          }
          icon={<MapPin className="w-5 h-5" />}
        />

        <div className="border-t border-white/5" />

        <Toggle
          label="Haptic Feedback"
          description="Vibrate on actions"
          checked={settings.hapticFeedback}
          onChange={(checked) =>
            setSettings((s) => ({ ...s, hapticFeedback: checked }))
          }
          icon={<Vibrate className="w-5 h-5" />}
        />

        <div className="border-t border-white/5" />

        <Toggle
          label="Dark Mode"
          description="Always use dark theme"
          checked={settings.darkMode}
          onChange={(checked) =>
            setSettings((s) => ({ ...s, darkMode: checked }))
          }
          icon={<Moon className="w-5 h-5" />}
        />
      </div>

      {/* Data Management */}
      <div className="bg-surface border border-white/5 rounded-xl p-4 mb-6">
        <h3 className="text-xs font-bold uppercase tracking-wider text-text-secondary mb-4">
          Data Management
        </h3>

        <button
          onClick={() => setShowClearConfirm(true)}
          className="w-full flex items-center justify-between py-3 text-red-400"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-500/10 rounded-lg flex items-center justify-center">
              <Trash2 className="w-5 h-5" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-sm">Clear Local Data</p>
              <p className="text-xs text-text-secondary">
                Remove all offline stored data
              </p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-text-secondary" />
        </button>
      </div>

      {/* Logout */}
      <button
        onClick={() => setShowLogoutConfirm(true)}
        className="w-full bg-surface border border-white/5 rounded-xl p-4 flex items-center justify-center gap-2 text-red-400 font-bold uppercase tracking-wider text-sm"
      >
        <LogOut className="w-5 h-5" />
        Sign Out
      </button>

      {/* Version */}
      <p className="text-center text-xs text-text-secondary/50 mt-6">
        OTS Guard v1.0.0
      </p>

      {/* Clear Data Confirmation */}
      {showClearConfirm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface border border-white/10 rounded-xl p-6 max-w-sm w-full">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-8 h-8 text-red-400" />
            </div>
            <h3 className="text-xl font-black uppercase tracking-tight text-center mb-2">
              Clear All Data?
            </h3>
            <p className="text-text-secondary text-center text-sm mb-6">
              This will remove all offline stored shifts, patrol logs, and
              pending uploads. This cannot be undone.
            </p>
            <div className="space-y-3">
              <button
                onClick={handleClearData}
                className="w-full bg-red-600 text-white py-3 rounded-lg font-bold uppercase tracking-wider text-sm"
              >
                Clear Data
              </button>
              <button
                onClick={() => setShowClearConfirm(false)}
                className="w-full bg-surface border border-white/10 text-text-primary py-3 rounded-lg font-bold uppercase tracking-wider text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Logout Confirmation */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface border border-white/10 rounded-xl p-6 max-w-sm w-full">
            <div className="w-16 h-16 bg-brand-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <LogOut className="w-8 h-8 text-brand-accent" />
            </div>
            <h3 className="text-xl font-black uppercase tracking-tight text-center mb-2">
              Sign Out?
            </h3>
            <p className="text-text-secondary text-center text-sm mb-6">
              {pendingCount > 0
                ? `You have ${pendingCount} unsynced items. They will sync when you log back in.`
                : "Are you sure you want to sign out?"}
            </p>
            <div className="space-y-3">
              <button
                onClick={handleLogout}
                className="w-full bg-brand-accent text-white py-3 rounded-lg font-bold uppercase tracking-wider text-sm"
              >
                Sign Out
              </button>
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="w-full bg-surface border border-white/10 text-text-primary py-3 rounded-lg font-bold uppercase tracking-wider text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}