"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  QrCode,
  MapPin,
  Camera,
  FileText,
  Check,
  AlertCircle,
  ChevronRight,
  ChevronLeft,
  Shield,
} from "lucide-react";
import { BigButton } from "@/components/BigButton";
import { CheckpointProgress } from "@/components/CheckpointProgress";
import { SavedToast } from "@/components/SavedToast";
import {
  useActiveShift,
  usePatrolProgress,
  useSavedConfirmation,
  useOnlineStatus,
  useHaptic,
} from "@/lib/hooks";
import { storage, generateId, isOnline } from "@/lib/storage";

interface Checkpoint {
  id: string;
  name: string;
  location: string;
  qrCode: string;
}

const MOCK_CHECKPOINTS: Checkpoint[] = [
  { id: "cp-1", name: "Main Entrance", location: "Front Gate", qrCode: "CHK-001" },
  { id: "cp-2", name: "Lobby", location: "Reception Area", qrCode: "CHK-002" },
  { id: "cp-3", name: "Parking A", location: "North Lot", qrCode: "CHK-003" },
  { id: "cp-4", name: "Loading Dock", location: "Rear Entrance", qrCode: "CHK-004" },
  { id: "cp-5", name: "Server Room", location: "Basement Level", qrCode: "CHK-005" },
  { id: "cp-6", name: "Emergency Exit", location: "East Wing", qrCode: "CHK-006" },
  { id: "cp-7", name: "Parking B", location: "South Lot", qrCode: "CHK-007" },
  { id: "cp-8", name: "Rooftop", location: "HVAC Access", qrCode: "CHK-008" },
];

export default function PatrolPage() {
  const router = useRouter();
  const { activeShift } = useActiveShift();
  const online = useOnlineStatus();
  const haptic = useHaptic();
  const savedToast = useSavedConfirmation();
  const [notes, setNotes] = useState("");
  const [showNotes, setShowNotes] = useState(false);
  const [showWrongQRModal, setShowWrongQRModal] = useState(false);
  const [lastScannedQR, setLastScannedQR] = useState("");
  const [isScanning, setIsScanning] = useState(false);

  const routeId = activeShift?.patrolRouteId || "default";
  const { progress, completeCheckpoint, initProgress } = usePatrolProgress(routeId);

  useEffect(() => {
    if (!activeShift) {
      router.push("/home");
      return;
    }
    if (!progress) {
      initProgress(MOCK_CHECKPOINTS.length);
    }
  }, [activeShift, progress, initProgress, router]);

  const currentCheckpointIndex = progress?.currentCheckpointIndex || 0;
  const completedCount = progress?.completedCheckpoints.length || 0;
  const currentCheckpoint = MOCK_CHECKPOINTS[currentCheckpointIndex];
  const isComplete = completedCount >= MOCK_CHECKPOINTS.length;

  const handleScan = useCallback(
    async (qrData: string) => {
      setIsScanning(true);
      haptic.trigger("medium");

      await new Promise((resolve) => setTimeout(resolve, 800));

      if (!currentCheckpoint) {
        setIsScanning(false);
        return;
      }

      if (qrData !== currentCheckpoint.qrCode) {
        setLastScannedQR(qrData);
        setShowWrongQRModal(true);
        setIsScanning(false);
        return;
      }

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
        type: "patrol_check",
        shiftId: activeShift?.shiftId || "",
        checkpointId: currentCheckpoint.id,
        checkpointName: currentCheckpoint.name,
        timestamp: new Date().toISOString(),
        latitude: location?.coords.latitude,
        longitude: location?.coords.longitude,
        notes: notes || undefined,
      });

      completeCheckpoint(currentCheckpoint.id);
      setNotes("");
      setShowNotes(false);
      savedToast.trigger();
      haptic.trigger("heavy");
      setIsScanning(false);
    },
    [currentCheckpoint, activeShift, notes, completeCheckpoint, savedToast, haptic]
  );

  const handleManualSelect = (index: number) => {
    if (index <= currentCheckpointIndex) return;
    haptic.trigger("light");
  };

  const simulateScan = () => {
    if (currentCheckpoint) {
      handleScan(currentCheckpoint.qrCode);
    }
  };

  if (!activeShift) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <Shield className="w-12 h-12 text-brand-accent mx-auto mb-4" />
          <p className="text-text-secondary">Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-24 pt-4 px-4 min-h-screen">
      <SavedToast show={savedToast.show} mode={isOnline() ? "saved" : "offline"} />

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => router.push("/home")}
          className="flex items-center gap-1 text-text-secondary hover:text-text-primary transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="text-sm font-semibold uppercase">Back</span>
        </button>
        <div className="flex items-center gap-2">
          {!online && (
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-2 py-1 rounded">
              Offline
            </span>
          )}
          <span className="text-xs font-bold text-brand-accent uppercase tracking-wider">
            Patrol
          </span>
        </div>
      </div>

      {/* Progress */}
      <CheckpointProgress
        total={MOCK_CHECKPOINTS.length}
        completed={completedCount}
        currentIndex={currentCheckpointIndex}
        checkpointNames={MOCK_CHECKPOINTS.map((cp) => cp.name)}
        className="mb-6"
      />

      {isComplete ? (
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-8 text-center">
          <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-10 h-10 text-white" strokeWidth={3} />
          </div>
          <h2 className="text-2xl font-black uppercase tracking-tight mb-2">
            Patrol Complete
          </h2>
          <p className="text-text-secondary mb-6">
            All checkpoints verified successfully
          </p>
          <BigButton
            icon={ChevronRight}
            label="Back to Home"
            variant="success"
            onClick={() => router.push("/home")}
          />
        </div>
      ) : currentCheckpoint ? (
        <div className="space-y-4">
          {/* Current Checkpoint Card */}
          <div className="bg-surface border-2 border-brand-accent/30 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-brand-accent/20 rounded-full flex items-center justify-center">
                <MapPin className="w-6 h-6 text-brand-accent" />
              </div>
              <div>
                <p className="text-xs text-brand-accent font-bold uppercase tracking-wider">
                  Checkpoint {currentCheckpointIndex + 1} of {MOCK_CHECKPOINTS.length}
                </p>
                <h2 className="text-xl font-black uppercase tracking-tight">
                  {currentCheckpoint.name}
                </h2>
              </div>
            </div>
            <p className="text-text-secondary text-sm">
              {currentCheckpoint.location}
            </p>
          </div>

          {/* Scan Button */}
          <BigButton
            icon={QrCode}
            label={isScanning ? "Scanning..." : "Scan Checkpoint"}
            sublabel={isScanning ? "Processing QR code" : "Tap to simulate scan"}
            variant="primary"
            onClick={simulateScan}
            loading={isScanning}
            className="h-[180px]"
          />

          {/* Notes Toggle */}
          <button
            onClick={() => setShowNotes(!showNotes)}
            className="w-full flex items-center justify-between p-4 bg-surface border border-white/5 rounded-xl text-left"
          >
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-text-secondary" />
              <span className="font-semibold text-sm">Add Notes</span>
            </div>
            <ChevronRight
              className={`w-5 h-5 text-text-secondary transition-transform ${
                showNotes ? "rotate-90" : ""
              }`}
            />
          </button>

          {showNotes && (
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Enter any observations..."
              className="w-full h-24 bg-surface border border-white/10 rounded-xl p-4 text-sm placeholder:text-text-secondary/50 focus:outline-none focus:border-brand-accent/50"
            />
          )}

          {/* Manual Select (Backup) */}
          <div className="pt-4 border-t border-white/5">
            <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary mb-3">
              Quick Jump
            </p>
            <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
              {MOCK_CHECKPOINTS.map((cp, index) => {
                const isCompleted = progress?.completedCheckpoints.includes(cp.id);
                const isCurrent = index === currentCheckpointIndex;

                return (
                  <button
                    key={cp.id}
                    onClick={() => handleManualSelect(index)}
                    disabled={index > currentCheckpointIndex}
                    className={`flex-shrink-0 px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors ${
                      isCompleted
                        ? "bg-emerald-500/20 text-emerald-400"
                        : isCurrent
                        ? "bg-brand-accent text-white"
                        : index > currentCheckpointIndex
                        ? "bg-surface text-text-secondary/50 cursor-not-allowed"
                        : "bg-surface text-text-secondary hover:bg-surface-hover"
                    }`}
                  >
                    {cp.name}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      ) : null}

      {/* Wrong QR Modal */}
      {showWrongQRModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface border border-red-500/30 rounded-xl p-6 max-w-sm w-full">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-400" />
            </div>
            <h3 className="text-xl font-black uppercase tracking-tight text-center mb-2">
              Wrong Checkpoint
            </h3>
            <p className="text-text-secondary text-center text-sm mb-2">
              This QR code doesn&apos;t match the expected checkpoint.
            </p>
            <p className="text-xs text-text-secondary/70 text-center mb-6 font-mono">
              Scanned: {lastScannedQR}
              <br />
              Expected: {currentCheckpoint?.qrCode}
            </p>
            <div className="space-y-3">
              <button
                onClick={() => setShowWrongQRModal(false)}
                className="w-full bg-surface border border-white/10 text-text-primary py-3 rounded-lg font-bold uppercase tracking-wider text-sm"
              >
                Try Again
              </button>
              <button
                onClick={() => {
                  setShowWrongQRModal(false);
                  haptic.trigger("heavy");
                }}
                className="w-full bg-red-600/20 border border-red-500/30 text-red-400 py-3 rounded-lg font-bold uppercase tracking-wider text-sm"
              >
                Supervisor Override
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}