"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  Camera,
  Mic,
  MicOff,
  X,
  Check,
  ChevronLeft,
  Phone,
  Clock,
  MapPin,
  FileText,
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
import { storage, generateId, type IncidentSeverity, type IncidentType } from "@/lib/storage";

const SEVERITIES: { value: IncidentSeverity; label: string; color: string }[] = [
  { value: "low", label: "Low", color: "bg-blue-500" },
  { value: "medium", label: "Medium", color: "bg-amber-500" },
  { value: "high", label: "High", color: "bg-orange-500" },
  { value: "critical", label: "Critical", color: "bg-red-500" },
];

const INCIDENT_TYPES: { value: IncidentType; label: string; icon: string }[] = [
  { value: "suspicious_activity", label: "Suspicious Activity", icon: "👁" },
  { value: "theft", label: "Theft", icon: "💰" },
  { value: "vandalism", label: "Vandalism", icon: "🔨" },
  { value: "trespass", label: "Trespassing", icon: "🚫" },
  { value: "medical", label: "Medical Emergency", icon: "🏥" },
  { value: "fire", label: "Fire / Hazard", icon: "🔥" },
  { value: "other", label: "Other", icon: "📋" },
];

export default function IncidentPage() {
  const router = useRouter();
  const { activeShift } = useActiveShift();
  const online = useOnlineStatus();
  const haptic = useHaptic();
  const savedToast = useSavedConfirmation();

  const [severity, setSeverity] = useState<IncidentSeverity | null>(null);
  const [incidentType, setIncidentType] = useState<IncidentType | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [occurredAt, setOccurredAt] = useState(
    new Date().toISOString().slice(0, 16)
  );
  const [mediaFiles, setMediaFiles] = useState<string[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCapturePhoto = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setMediaFiles((prev) => [...prev, reader.result as string]);
        haptic.trigger("light");
      };
      reader.readAsDataURL(file);
    }
  };

  const removeMedia = (index: number) => {
    setMediaFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const toggleVoiceRecording = () => {
    setIsRecording(!isRecording);
    haptic.trigger("medium");

    if (!isRecording) {
      setTimeout(() => {
        setDescription((prev) =>
          prev
            ? prev +
                " Observed suspicious individual near north entrance, wearing dark clothing. Subject departed when approached."
            : "Observed suspicious individual near north entrance, wearing dark clothing. Subject departed when approached."
        );
        setIsRecording(false);
        haptic.trigger("heavy");
      }, 2000);
    }
  };

  const handleSubmit = async () => {
    if (!severity || !incidentType || !title) return;

    setIsSubmitting(true);
    haptic.trigger("heavy");

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
      type: "incident",
      severity,
      incidentType,
      title,
      description,
      occurredAt: new Date(occurredAt).toISOString(),
      latitude: location?.coords.latitude,
      longitude: location?.coords.longitude,
      mediaFiles,
    });

    storage.draftIncident.clear();
    savedToast.trigger();
    setIsSubmitting(false);
    setShowSuccess(true);
  };

  const isHighSeverity = severity === "high" || severity === "critical";
  const canSubmit = severity && incidentType && title.length > 2;

  if (showSuccess) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-sm text-center">
          <div
            className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 ${
              isHighSeverity ? "bg-red-500" : "bg-emerald-500"
            }`}
          >
            <Check className="w-12 h-12 text-white" strokeWidth={3} />
          </div>
          <h2 className="text-2xl font-black uppercase tracking-tight mb-2">
            Report Submitted
          </h2>
          <p className="text-text-secondary mb-8">
            {online
              ? "Your incident report has been saved and will sync automatically."
              : "Saved offline. Will sync when connection is restored."}
          </p>

          {isHighSeverity && (
            <a
              href="tel:+18005550199"
              className="flex items-center justify-center gap-2 w-full bg-red-600 text-white py-4 rounded-xl font-black uppercase tracking-wider mb-4"
            >
              <Phone className="w-5 h-5" />
              Call Supervisor
            </a>
          )}

          <BigButton
            icon={ChevronLeft}
            label="Back to Home"
            variant="neutral"
            onClick={() => router.push("/home")}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="pb-24 pt-4 px-4 min-h-screen">
      <SavedToast
        show={savedToast.show}
        mode={online ? "saved" : "offline"}
        message="Draft Saved"
      />

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => router.push("/home")}
          className="flex items-center gap-1 text-text-secondary hover:text-text-primary transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="text-sm font-semibold uppercase">Cancel</span>
        </button>
        <span className="text-xs font-bold text-brand-accent uppercase tracking-wider">
          New Incident
        </span>
      </div>

      {/* Severity Selection */}
      <div className="mb-6">
        <label className="text-xs font-bold uppercase tracking-wider text-text-secondary mb-3 block">
          Severity *
        </label>
        <div className="grid grid-cols-4 gap-2">
          {SEVERITIES.map((sev) => (
            <button
              key={sev.value}
              onClick={() => {
                setSeverity(sev.value);
                haptic.trigger("light");
              }}
              className={`py-3 px-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                severity === sev.value
                  ? `${sev.color} text-white`
                  : "bg-surface text-text-secondary hover:bg-surface-hover"
              }`}
            >
              {sev.label}
            </button>
          ))}
        </div>
      </div>

      {/* Incident Type */}
      <div className="mb-6">
        <label className="text-xs font-bold uppercase tracking-wider text-text-secondary mb-3 block">
          Type *
        </label>
        <div className="grid grid-cols-2 gap-2">
          {INCIDENT_TYPES.map((type) => (
            <button
              key={type.value}
              onClick={() => {
                setIncidentType(type.value);
                haptic.trigger("light");
              }}
              className={`flex items-center gap-2 p-3 rounded-lg text-left transition-all ${
                incidentType === type.value
                  ? "bg-brand-accent/20 border border-brand-accent/50"
                  : "bg-surface border border-white/5 hover:bg-surface-hover"
              }`}
            >
              <span className="text-lg">{type.icon}</span>
              <span
                className={`text-xs font-semibold ${
                  incidentType === type.value
                    ? "text-brand-accent"
                    : "text-text-secondary"
                }`}
              >
                {type.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Title */}
      <div className="mb-4">
        <label className="text-xs font-bold uppercase tracking-wider text-text-secondary mb-3 block">
          Title *
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Brief summary..."
          className="w-full bg-surface border border-white/10 rounded-xl px-4 py-3 text-sm placeholder:text-text-secondary/50 focus:outline-none focus:border-brand-accent/50"
        />
      </div>

      {/* Description */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-3">
          <label className="text-xs font-bold uppercase tracking-wider text-text-secondary">
            What Happened
          </label>
          <button
            onClick={toggleVoiceRecording}
            className={`flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors ${
              isRecording
                ? "bg-red-500 text-white animate-pulse"
                : "bg-surface text-text-secondary"
            }`}
          >
            {isRecording ? (
              <>
                <MicOff className="w-3 h-3" /> Recording...
              </>
            ) : (
              <>
                <Mic className="w-3 h-3" /> Voice
              </>
            )}
          </button>
        </div>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe the incident..."
          rows={4}
          className="w-full bg-surface border border-white/10 rounded-xl px-4 py-3 text-sm placeholder:text-text-secondary/50 focus:outline-none focus:border-brand-accent/50 resize-none"
        />
      </div>

      {/* Time & Location */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-text-secondary mb-2 block">
            <Clock className="w-3 h-3 inline mr-1" />
            Time
          </label>
          <input
            type="datetime-local"
            value={occurredAt}
            onChange={(e) => setOccurredAt(e.target.value)}
            className="w-full bg-surface border border-white/10 rounded-xl px-3 py-3 text-xs focus:outline-none focus:border-brand-accent/50"
          />
        </div>
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-text-secondary mb-2 block">
            <MapPin className="w-3 h-3 inline mr-1" />
            Location
          </label>
          <div className="bg-surface border border-white/10 rounded-xl px-3 py-3 text-xs text-text-secondary">
            {activeShift?.siteName || "Current Location"}
          </div>
        </div>
      </div>

      {/* Media */}
      <div className="mb-6">
        <label className="text-xs font-bold uppercase tracking-wider text-text-secondary mb-3 block">
          Photos / Media
        </label>
        <div className="flex gap-2 flex-wrap">
          {mediaFiles.map((file, index) => (
            <div
              key={index}
              className="relative w-20 h-20 rounded-lg overflow-hidden border border-white/10"
            >
              <img
                src={file}
                alt={`Capture ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => removeMedia(index)}
                className="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center"
              >
                <X className="w-3 h-3 text-white" />
              </button>
            </div>
          ))}
          <button
            onClick={handleCapturePhoto}
            className="w-20 h-20 bg-surface border-2 border-dashed border-white/20 rounded-lg flex flex-col items-center justify-center gap-1 hover:border-brand-accent/50 transition-colors"
          >
            <Camera className="w-6 h-6 text-text-secondary" />
            <span className="text-[10px] text-text-secondary uppercase">Add</span>
          </button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {/* Submit Button */}
      <BigButton
        icon={AlertTriangle}
        label={isSubmitting ? "Submitting..." : "Submit Report"}
        variant={isHighSeverity ? "danger" : "primary"}
        onClick={handleSubmit}
        disabled={!canSubmit || isSubmitting}
        loading={isSubmitting}
        className="h-[80px]"
      />

      {!canSubmit && (
        <p className="text-center text-xs text-text-secondary/50 mt-3">
          Fill in severity, type, and title to submit
        </p>
      )}
    </div>
  );
}