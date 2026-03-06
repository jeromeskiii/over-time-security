"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Clock,
  MapPin,
  Play,
  StopCircle,
  ChevronLeft,
  Calendar,
  Check,
  AlertCircle,
} from "lucide-react";
import { BigButton } from "@/components/BigButton";
import { SavedToast } from "@/components/SavedToast";
import {
  useActiveShift,
  useSavedConfirmation,
  useOnlineStatus,
  useHaptic,
} from "@/lib/hooks";
import { storage, generateId } from "@/lib/storage";

interface ShiftSchedule {
  id: string;
  siteName: string;
  siteAddress: string;
  startTime: string;
  endTime: string;
  status: "upcoming" | "in_progress" | "completed";
}

const MOCK_SHIFTS: ShiftSchedule[] = [
  {
    id: "shift-1",
    siteName: "Downtown Office Building",
    siteAddress: "123 Main St, Los Angeles, CA 90012",
    startTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
    status: "in_progress",
  },
  {
    id: "shift-2",
    siteName: "Westfield Mall",
    siteAddress: "6600 Topanga Canyon Blvd, Canoga Park, CA",
    startTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() + 32 * 60 * 60 * 1000).toISOString(),
    status: "upcoming",
  },
  {
    id: "shift-3",
    siteName: "Tech Campus",
    siteAddress: "1 Hacker Way, Menlo Park, CA",
    startTime: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() - 40 * 60 * 60 * 1000).toISOString(),
    status: "completed",
  },
];

export default function ShiftPage() {
  const router = useRouter();
  const { activeShift, startShift, endShift } = useActiveShift();
  const online = useOnlineStatus();
  const haptic = useHaptic();
  const savedToast = useSavedConfirmation();
  const [isStarting, setIsStarting] = useState(false);
  const [isEnding, setIsEnding] = useState(false);
  const [showEndConfirm, setShowEndConfirm] = useState(false);
  const [summary, setSummary] = useState("");

  const handleStartShift = async (shift: ShiftSchedule) => {
    setIsStarting(true);

    const location = await new Promise<GeolocationPosition | null>(
      (resolve) => {
        if (!navigator.geolocation) {
          resolve(null);
          return;
        }
        navigator.geolocation.getCurrentPosition(
          (pos) => resolve(pos),
          () => resolve(null),
          { timeout: 5000 }
        );
      }
    );

    storage.outbox.add({
      id: generateId(),
      type: "shift_start",
      shiftId: shift.id,
      timestamp: new Date().toISOString(),
      latitude: location?.coords.latitude,
      longitude: location?.coords.longitude,
    });

    startShift({
      shiftId: shift.id,
      siteName: shift.siteName,
      siteAddress: shift.siteAddress,
      startTime: new Date().toISOString(),
      scheduledEndTime: shift.endTime,
      patrolRouteId: "route-1",
    });

    haptic.trigger("heavy");
    savedToast.trigger();
    setIsStarting(false);
  };

  const handleEndShift = async () => {
    setIsEnding(true);

    const location = await new Promise<GeolocationPosition | null>(
      (resolve) => {
        if (!navigator.geolocation) {
          resolve(null);
          return;
        }
        navigator.geolocation.getCurrentPosition(
          (pos) => resolve(pos),
          () => resolve(null),
          { timeout: 5000 }
        );
      }
    );

    storage.outbox.add({
      id: generateId(),
      type: "shift_end",
      shiftId: activeShift?.shiftId || "",
      timestamp: new Date().toISOString(),
      latitude: location?.coords.latitude,
      longitude: location?.coords.longitude,
      summary: summary || undefined,
    });

    if (activeShift?.patrolRouteId) {
      storage.patrolProgress.clear(activeShift.patrolRouteId);
    }

    endShift();
    haptic.trigger("heavy");
    savedToast.trigger();
    setIsEnding(false);
    setShowEndConfirm(false);
  };

  const formatTime = (isoString: string) => {
    return new Date(isoString).toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString([], {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="pb-24 pt-4 px-4 min-h-screen">
      <SavedToast
        show={savedToast.show}
        mode={online ? "saved" : "offline"}
      />

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => router.push("/home")}
          className="flex items-center gap-1 text-text-secondary hover:text-text-primary transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="text-sm font-semibold uppercase">Back</span>
        </button>
        <span className="text-xs font-bold text-brand-accent uppercase tracking-wider">
          Shifts
        </span>
      </div>

      {activeShift ? (
        <>
          {/* Active Shift Card */}
          <div className="bg-surface border-2 border-brand-accent/30 rounded-xl p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-xs font-bold tracking-[0.2em] text-emerald-400 uppercase">
                Currently On Duty
              </span>
            </div>

            <h2 className="text-xl font-black uppercase tracking-tight mb-1">
              {activeShift.siteName}
            </h2>
            <p className="text-text-secondary text-sm mb-4">
              {activeShift.siteAddress}
            </p>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-base rounded-lg p-3">
                <div className="flex items-center gap-2 text-text-secondary mb-1">
                  <Play className="w-4 h-4" />
                  <span className="text-[10px] uppercase tracking-wider font-semibold">
                    Started
                  </span>
                </div>
                <p className="text-sm font-bold">
                  {formatTime(activeShift.startTime)}
                </p>
              </div>
              <div className="bg-base rounded-lg p-3">
                <div className="flex items-center gap-2 text-text-secondary mb-1">
                  <Clock className="w-4 h-4" />
                  <span className="text-[10px] uppercase tracking-wider font-semibold">
                    Scheduled End
                  </span>
                </div>
                <p className="text-sm font-bold">
                  {formatTime(activeShift.scheduledEndTime)}
                </p>
              </div>
            </div>

            <BigButton
              icon={StopCircle}
              label="End Shift"
              sublabel="Complete & Sign Out"
              variant="neutral"
              onClick={() => setShowEndConfirm(true)}
            />
          </div>

          {/* End Shift Confirmation Modal */}
          {showEndConfirm && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-surface border border-white/10 rounded-xl p-6 max-w-sm w-full">
                <div className="w-16 h-16 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="w-8 h-8 text-amber-400" />
                </div>
                <h3 className="text-xl font-black uppercase tracking-tight text-center mb-2">
                  End Shift?
                </h3>
                <p className="text-text-secondary text-center text-sm mb-4">
                  This will complete your shift and log your checkout time.
                </p>

                <div className="mb-4">
                  <label className="text-xs font-bold uppercase tracking-wider text-text-secondary mb-2 block">
                    Shift Summary (Optional)
                  </label>
                  <textarea
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    placeholder="Any notes about the shift..."
                    rows={2}
                    className="w-full bg-base border border-white/10 rounded-lg px-3 py-2 text-sm placeholder:text-text-secondary/50 focus:outline-none focus:border-brand-accent/50 resize-none"
                  />
                </div>

                <div className="space-y-3">
                  <button
                    onClick={handleEndShift}
                    disabled={isEnding}
                    className="w-full bg-brand-accent text-white py-3 rounded-lg font-bold uppercase tracking-wider text-sm disabled:opacity-50"
                  >
                    {isEnding ? "Ending..." : "Confirm End Shift"}
                  </button>
                  <button
                    onClick={() => setShowEndConfirm(false)}
                    className="w-full bg-surface border border-white/10 text-text-primary py-3 rounded-lg font-bold uppercase tracking-wider text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <>
          {/* Today's Shifts */}
          <div className="mb-6">
            <h2 className="text-xs font-bold uppercase tracking-wider text-text-secondary mb-4">
              Today&apos;s Shifts
            </h2>
            <div className="space-y-3">
              {MOCK_SHIFTS.filter((s) => s.status !== "completed").map(
                (shift) => (
                  <div
                    key={shift.id}
                    className={`bg-surface border rounded-xl p-4 ${
                      shift.status === "in_progress"
                        ? "border-brand-accent/30"
                        : "border-white/5"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-bold text-sm mb-1">
                          {shift.siteName}
                        </h3>
                        <p className="text-text-secondary text-xs">
                          {shift.siteAddress}
                        </p>
                      </div>
                      {shift.status === "in_progress" && (
                        <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded">
                          Active
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-4 text-xs text-text-secondary mb-4">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{formatDate(shift.startTime)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>
                          {formatTime(shift.startTime)} -{" "}
                          {formatTime(shift.endTime)}
                        </span>
                      </div>
                    </div>

                    {shift.status === "upcoming" && (
                      <BigButton
                        icon={Play}
                        label="Start Shift"
                        variant="primary"
                        onClick={() => handleStartShift(shift)}
                        loading={isStarting}
                        className="h-[56px]"
                      />
                    )}
                  </div>
                )
              )}
            </div>
          </div>

          {/* Completed Shifts */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-text-secondary mb-4">
              Recent History
            </h2>
            <div className="space-y-2">
              {MOCK_SHIFTS.filter((s) => s.status === "completed").map(
                (shift) => (
                  <div
                    key={shift.id}
                    className="bg-surface/50 border border-white/5 rounded-lg p-3 flex items-center justify-between"
                  >
                    <div>
                      <h3 className="font-semibold text-sm">{shift.siteName}</h3>
                      <p className="text-text-secondary text-xs">
                        {formatDate(shift.startTime)}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 text-emerald-400">
                      <Check className="w-4 h-4" />
                      <span className="text-[10px] font-bold uppercase">
                        Done
                      </span>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}