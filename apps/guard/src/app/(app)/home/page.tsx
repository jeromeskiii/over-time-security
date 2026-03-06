"use client";

import {
  Play,
  MapPin,
  AlertTriangle,
  StopCircle,
  Shield,
  Clock,
} from "lucide-react";
import Link from "next/link";
import { BigButton } from "@/components/BigButton";
import { SavedToast } from "@/components/SavedToast";
import { useActiveShift, useCurrentTime, useSavedConfirmation } from "@/lib/hooks";
import { storage, generateId, isOnline } from "@/lib/storage";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function HomePage() {
  const { activeShift, isLoading } = useActiveShift();
  const currentTime = useCurrentTime();
  const savedToast = useSavedConfirmation();
  const router = useRouter();
  const [isStarting, setIsStarting] = useState(false);

  const handleStartShift = async () => {
    setIsStarting(true);

    const mockShift = {
      shiftId: generateId(),
      siteName: "Downtown Office Building",
      siteAddress: "123 Main St, Los Angeles, CA 90012",
      startTime: new Date().toISOString(),
      scheduledEndTime: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(),
      patrolRouteId: "route-1",
    };

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
      shiftId: mockShift.shiftId,
      timestamp: mockShift.startTime,
      latitude: location?.coords.latitude,
      longitude: location?.coords.longitude,
    });

    storage.activeShift.set(mockShift);

    savedToast.trigger();
    setIsStarting(false);

    setTimeout(() => {
      router.push("/patrol");
    }, 500);
  };

  const handleEndShift = () => {
    const shift = storage.activeShift.get();
    if (!shift) return;

    storage.outbox.add({
      id: generateId(),
      type: "shift_end",
      shiftId: shift.shiftId,
      timestamp: new Date().toISOString(),
    });

    if (shift.patrolRouteId) {
      storage.patrolProgress.clear(shift.patrolRouteId);
    }

    storage.activeShift.clear();
    savedToast.trigger();
  };

  if (isLoading || !currentTime) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-brand-accent">
          <Shield className="w-12 h-12" />
        </div>
      </div>
    );
  }

  return (
    <div className="pb-24 pt-4 px-4 space-y-4">
      <SavedToast show={savedToast.show} mode={isOnline() ? "saved" : "offline"} />

      {/* Header */}
      <div className="text-center py-4">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Shield className="w-8 h-8 text-brand-accent" />
          <span className="text-xs font-bold tracking-[0.3em] text-brand-accent uppercase">
            OTS Guard
          </span>
        </div>
        <h1 className="text-2xl font-black uppercase tracking-tight">
          {currentTime.toLocaleTimeString([], {
            hour: "numeric",
            minute: "2-digit",
          })}
        </h1>
        <p className="text-text-secondary text-sm uppercase tracking-wider">
          {currentTime.toLocaleDateString([], {
            weekday: "long",
            month: "short",
            day: "numeric",
          })}
        </p>
      </div>

      {activeShift ? (
        <>
          {/* Active Shift Card */}
          <div className="bg-surface border border-brand-accent/20 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-xs font-bold tracking-[0.2em] text-emerald-400 uppercase">
                Shift Active
              </span>
            </div>
            <h2 className="text-xl font-black uppercase tracking-tight mb-1">
              {activeShift.siteName}
            </h2>
            <p className="text-text-secondary text-sm mb-3">
              {activeShift.siteAddress}
            </p>
            <div className="flex items-center gap-2 text-sm text-text-secondary">
              <Clock className="w-4 h-4" />
              <span>
                Started{" "}
                {new Date(activeShift.startTime).toLocaleTimeString([], {
                  hour: "numeric",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>

          {/* Action Grid */}
          <div className="grid grid-cols-2 gap-3">
            <Link href="/patrol" className="col-span-1">
              <BigButton
                icon={MapPin}
                label="Run Patrol"
                sublabel="Scan Checkpoints"
                variant="secondary"
                className="h-[160px]"
              />
            </Link>
            <Link href="/incident" className="col-span-1">
              <BigButton
                icon={AlertTriangle}
                label="Report"
                sublabel="Incident"
                variant="danger"
                className="h-[160px]"
              />
            </Link>
          </div>

          <BigButton
            icon={StopCircle}
            label="End Shift"
            sublabel="Complete & Log Out"
            variant="neutral"
            onClick={handleEndShift}
          />
        </>
      ) : (
        <>
          {/* No Active Shift */}
          <div className="bg-surface border border-white/5 rounded-xl p-6 text-center">
            <div className="w-16 h-16 bg-brand-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-brand-accent" />
            </div>
            <h2 className="text-lg font-black uppercase tracking-tight mb-2">
              No Active Shift
            </h2>
            <p className="text-text-secondary text-sm">
              Start your shift to begin patrol and incident reporting
            </p>
          </div>

          <BigButton
            icon={Play}
            label="Start Shift"
            sublabel="Begin Your Work Day"
            variant="primary"
            onClick={handleStartShift}
            loading={isStarting}
          />

          <Link href="/incident">
            <BigButton
              icon={AlertTriangle}
              label="Report Incident"
              sublabel="Emergency Only"
              variant="danger"
            />
          </Link>
        </>
      )}
    </div>
  );
}
