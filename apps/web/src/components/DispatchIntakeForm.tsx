"use client";

import { useState } from "react";
import { Input } from "@ots/ui/primitives";
import { Button } from "@ots/ui/primitives";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";

interface FormData {
  name: string;
  email: string;
  phone: string;
  propertyType: string;
  coverageHours: string;
  armedOrPatrol: string;
  siteAddress: string;
  accessNotes: string;
}

interface FormErrors {
  [key: string]: string;
}

function getApiBaseUrl(): string | null {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }

  if (typeof window !== "undefined") {
    const { hostname } = window.location;
    if (hostname === "localhost" || hostname === "127.0.0.1") {
      return "http://localhost:3001";
    }
  }

  return null;
}

export function DispatchIntakeForm() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    propertyType: "",
    coverageHours: "",
    armedOrPatrol: "",
    siteAddress: "",
    accessNotes: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setErrors({});

    try {
      const apiUrl = getApiBaseUrl();
      if (!apiUrl) {
        setError("Configuration error. Please contact support.");
        setIsLoading(false);
        return;
      }

      const response = await fetch(`${apiUrl}/api/dispatch`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const contentType = response.headers.get("content-type") ?? "";
      const data =
        contentType.includes("application/json")
          ? await response.json()
          : { error: "Unexpected response from server." };

      if (!response.ok) {
        if (response.status === 400 && data.error) {
          setError(data.error);
        } else {
          setError("Failed to submit request. Please try again.");
        }
        setIsLoading(false);
        return;
      }

      setSuccess(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        propertyType: "",
        coverageHours: "",
        armedOrPatrol: "",
        siteAddress: "",
        accessNotes: "",
      });
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="rounded-[28px] border border-brand-accent/20 bg-surface/80 p-8 text-center">
        <CheckCircle2 className="mx-auto mb-4 h-12 w-12 text-brand-accent" />
        <h3 className="mb-2 text-xl font-black uppercase tracking-tight text-text-primary">
          Request Received
        </h3>
        <p className="text-sm text-text-secondary">
          Dispatch will contact you within 15 minutes to confirm coverage details.
        </p>
        <button
          onClick={() => setSuccess(false)}
          className="mt-6 text-xs font-bold uppercase tracking-wider text-brand-accent hover:text-brand-accent-hover"
        >
          Submit Another Request
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="flex items-center gap-3 rounded-sm border border-red-500/20 bg-red-500/10 p-4">
          <AlertCircle className="h-5 w-5 text-red-500" />
          <p className="text-sm text-red-500">{error}</p>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <Input
          label="Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          disabled={isLoading}
          error={errors.name}
        />
        <Input
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
          disabled={isLoading}
          error={errors.email}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Input
          label="Phone"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handleChange}
          required
          disabled={isLoading}
          error={errors.phone}
        />
        <div className="w-full">
          <label className="block text-xs font-bold tracking-widest uppercase text-text-secondary mb-2">
            Property Type
          </label>
          <select
            name="propertyType"
            value={formData.propertyType}
            onChange={handleChange}
            required
            disabled={isLoading}
            className="w-full bg-surface border border-white/10 rounded-sm px-4 py-3 text-text-primary focus:outline-none focus:border-brand-accent/50 focus:ring-1 focus:ring-brand-accent/20 transition-colors"
          >
            <option value="">Select Type</option>
            <option value="commercial">Commercial</option>
            <option value="construction">Construction</option>
            <option value="residential">Residential</option>
            <option value="event">Event</option>
            <option value="institutional">Institutional</option>
          </select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Input
          label="Coverage Hours"
          name="coverageHours"
          placeholder="e.g., 6pm-6am, 24/7"
          value={formData.coverageHours}
          onChange={handleChange}
          required
          disabled={isLoading}
          error={errors.coverageHours}
        />
        <div className="w-full">
          <label className="block text-xs font-bold tracking-widest uppercase text-text-secondary mb-2">
            Armed or Patrol
          </label>
          <select
            name="armedOrPatrol"
            value={formData.armedOrPatrol}
            onChange={handleChange}
            required
            disabled={isLoading}
            className="w-full bg-surface border border-white/10 rounded-sm px-4 py-3 text-text-primary focus:outline-none focus:border-brand-accent/50 focus:ring-1 focus:ring-brand-accent/20 transition-colors"
          >
            <option value="">Select Coverage Type</option>
            <option value="armed">Armed Security</option>
            <option value="unarmed">Unarmed Security</option>
            <option value="patrol">Mobile Patrol</option>
            <option value="both">Armed + Patrol</option>
          </select>
        </div>
      </div>

      <div className="w-full">
        <label className="block text-xs font-bold tracking-widest uppercase text-text-secondary mb-2">
          Site Address
        </label>
        <textarea
          name="siteAddress"
          value={formData.siteAddress}
          onChange={handleChange}
          required
          disabled={isLoading}
          rows={2}
          className="w-full bg-surface border border-white/10 rounded-sm px-4 py-3 text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:border-brand-accent/50 focus:ring-1 focus:ring-brand-accent/20 transition-colors resize-none"
        />
      </div>

      <div className="w-full">
        <label className="block text-xs font-bold tracking-widest uppercase text-text-secondary mb-2">
          Access Notes (Optional)
        </label>
        <textarea
          name="accessNotes"
          value={formData.accessNotes}
          onChange={handleChange}
          disabled={isLoading}
          rows={3}
          placeholder="Gate codes, parking instructions, special requirements..."
          className="w-full bg-surface border border-white/10 rounded-sm px-4 py-3 text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:border-brand-accent/50 focus:ring-1 focus:ring-brand-accent/20 transition-colors resize-none"
        />
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        variant="primary"
        size="lg"
        className="w-full"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Submitting...
          </>
        ) : (
          "Request Coverage"
        )}
      </Button>
    </form>
  );
}
