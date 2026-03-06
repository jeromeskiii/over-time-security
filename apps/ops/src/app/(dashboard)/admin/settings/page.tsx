"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const settingsSchema = z.object({
  orgName:       z.string().min(1, "Organization name is required"),
  contactEmail:  z.string().email("Valid email required"),
  contactPhone:  z.string().min(10, "Valid phone required"),
  timezone:      z.string().min(1),
  incidentAlerts: z.boolean(),
  shiftReminders: z.boolean(),
});

type SettingsInput = z.infer<typeof settingsSchema>;

export default function SettingsPage() {
  const { register, handleSubmit, formState: { errors, isDirty } } = useForm<SettingsInput>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      orgName:        "Over Time Security",
      contactEmail:   "ops@overtimesecurity.com",
      contactPhone:   "1-800-555-0199",
      timezone:       "America/Los_Angeles",
      incidentAlerts: true,
      shiftReminders: true,
    },
  });

  function onSave(data: SettingsInput) {
    console.log("Settings saved:", data);
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-accent mb-1">Configuration</p>
        <h1 className="text-2xl font-black uppercase tracking-tight text-text-primary">Settings</h1>
      </div>

      <form onSubmit={handleSubmit(onSave)} className="space-y-6">
        {/* Organization */}
        <div className="bg-surface border border-white/5 rounded-sm p-6 space-y-4">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-text-secondary">Organization</p>
          {[
            { name: "orgName"      as const, label: "Organization Name", placeholder: "Over Time Security",        type: "text"  },
            { name: "contactEmail" as const, label: "Contact Email",     placeholder: "ops@overtimesecurity.com",  type: "email" },
            { name: "contactPhone" as const, label: "Contact Phone",     placeholder: "1-800-555-0199",            type: "tel"   },
          ].map((f) => (
            <div key={f.name}>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-text-secondary mb-1.5">
                {f.label}
              </label>
              <input
                {...register(f.name)}
                type={f.type}
                placeholder={f.placeholder}
                className="w-full bg-white/5 border border-white/10 rounded-sm px-3 py-2 text-sm text-text-primary placeholder:text-text-secondary outline-none focus:border-brand-accent/50 transition-colors"
              />
              {errors[f.name] && (
                <p className="text-xs text-red-400 mt-1">{errors[f.name]?.message}</p>
              )}
            </div>
          ))}
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-text-secondary mb-1.5">
              Timezone
            </label>
            <select
              {...register("timezone")}
              className="w-full bg-white/5 border border-white/10 rounded-sm px-3 py-2 text-sm text-text-primary outline-none focus:border-brand-accent/50 transition-colors"
            >
              <option value="America/Los_Angeles">Pacific Time (PT)</option>
              <option value="America/Denver">Mountain Time (MT)</option>
              <option value="America/Chicago">Central Time (CT)</option>
              <option value="America/New_York">Eastern Time (ET)</option>
            </select>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-surface border border-white/5 rounded-sm p-6 space-y-4">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-text-secondary">Notifications</p>
          {[
            { name: "incidentAlerts" as const, label: "Incident Alerts",  description: "Receive alerts for new incidents" },
            { name: "shiftReminders" as const, label: "Shift Reminders",  description: "Reminders before shift start" },
          ].map((f) => (
            <label key={f.name} className="flex items-center justify-between cursor-pointer group">
              <div>
                <p className="text-sm font-semibold text-text-primary">{f.label}</p>
                <p className="text-xs text-text-secondary">{f.description}</p>
              </div>
              <div className="relative">
                <input type="checkbox" {...register(f.name)} className="sr-only peer" />
                <div className="w-10 h-5 bg-white/10 rounded-full peer-checked:bg-brand-accent transition-colors" />
                <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5" />
              </div>
            </label>
          ))}
        </div>

        <button
          type="submit"
          disabled={!isDirty}
          className="bg-brand-accent hover:bg-brand-accent-hover disabled:opacity-40 disabled:cursor-not-allowed text-white px-6 py-2.5 rounded-sm text-xs font-bold uppercase tracking-wider transition-colors"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}
