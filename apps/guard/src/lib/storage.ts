export type IncidentSeverity = "low" | "medium" | "high" | "critical";
export type IncidentType =
  | "theft"
  | "vandalism"
  | "trespass"
  | "medical"
  | "fire"
  | "suspicious_activity"
  | "other";

export interface PendingShiftStart {
  id: string;
  type: "shift_start";
  shiftId: string;
  timestamp: string;
  latitude?: number;
  longitude?: number;
  photoData?: string;
  status: "pending" | "syncing" | "failed";
  retryCount: number;
}

export interface PendingShiftEnd {
  id: string;
  type: "shift_end";
  shiftId: string;
  timestamp: string;
  latitude?: number;
  longitude?: number;
  summary?: string;
  status: "pending" | "syncing" | "failed";
  retryCount: number;
}

export interface PendingPatrolCheck {
  id: string;
  type: "patrol_check";
  shiftId: string;
  checkpointId: string;
  checkpointName: string;
  timestamp: string;
  latitude?: number;
  longitude?: number;
  notes?: string;
  photoData?: string;
  status: "pending" | "syncing" | "failed";
  retryCount: number;
}

export interface PendingIncident {
  id: string;
  type: "incident";
  severity: IncidentSeverity;
  incidentType: IncidentType;
  title: string;
  description: string;
  occurredAt: string;
  latitude?: number;
  longitude?: number;
  mediaFiles: string[];
  status: "pending" | "syncing" | "failed";
  retryCount: number;
}

export type OutboxItem =
  | PendingShiftStart
  | PendingShiftEnd
  | PendingPatrolCheck
  | PendingIncident;

const STORAGE_KEYS = {
  OUTBOX: "ots_guard_outbox",
  ACTIVE_SHIFT: "ots_guard_active_shift",
  PATROL_PROGRESS: "ots_guard_patrol_progress",
  DRAFT_INCIDENT: "ots_guard_draft_incident",
  USER_PROFILE: "ots_guard_user_profile",
  SETTINGS: "ots_guard_settings",
} as const;

export const storage = {
  outbox: {
    getAll: (): OutboxItem[] => {
      if (typeof window === "undefined") return [];
      const data = localStorage.getItem(STORAGE_KEYS.OUTBOX);
      return data ? JSON.parse(data) : [];
    },

    add: (item: {
      id: string;
      type: OutboxItem["type"];
      [key: string]: unknown;
    }): OutboxItem => {
      const outbox = storage.outbox.getAll();
      const newItem = {
        ...item,
        status: "pending" as const,
        retryCount: 0,
      } as OutboxItem;
      outbox.push(newItem);
      localStorage.setItem(STORAGE_KEYS.OUTBOX, JSON.stringify(outbox));
      return newItem;
    },

    update: (id: string, updates: Partial<OutboxItem>): void => {
      const outbox = storage.outbox.getAll();
      const index = outbox.findIndex((item) => item.id === id);
      if (index !== -1) {
        outbox[index] = { ...outbox[index], ...updates } as OutboxItem;
        localStorage.setItem(STORAGE_KEYS.OUTBOX, JSON.stringify(outbox));
      }
    },

    remove: (id: string): void => {
      const outbox = storage.outbox.getAll();
      const filtered = outbox.filter((item) => item.id !== id);
      localStorage.setItem(STORAGE_KEYS.OUTBOX, JSON.stringify(filtered));
    },

    getPending: (): OutboxItem[] => {
      return storage.outbox
        .getAll()
        .filter((item) => item.status === "pending");
    },

    getFailed: (): OutboxItem[] => {
      return storage.outbox.getAll().filter((item) => item.status === "failed");
    },

    getCount: (): number => {
      return storage.outbox.getAll().length;
    },
  },

  activeShift: {
    get: () => {
      if (typeof window === "undefined") return null;
      const data = localStorage.getItem(STORAGE_KEYS.ACTIVE_SHIFT);
      if (!data) return null;
      return JSON.parse(data) as {
        shiftId: string;
        siteName: string;
        siteAddress: string;
        startTime: string;
        scheduledEndTime: string;
        patrolRouteId?: string;
      };
    },

    set: (shift: {
      shiftId: string;
      siteName: string;
      siteAddress: string;
      startTime: string;
      scheduledEndTime: string;
      patrolRouteId?: string;
    }): void => {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_SHIFT, JSON.stringify(shift));
    },

    clear: (): void => {
      localStorage.removeItem(STORAGE_KEYS.ACTIVE_SHIFT);
    },

    isActive: (): boolean => {
      return !!storage.activeShift.get();
    },
  },

  patrolProgress: {
    get: (routeId: string) => {
      if (typeof window === "undefined") return null;
      const data = localStorage.getItem(STORAGE_KEYS.PATROL_PROGRESS);
      if (!data) return null;
      const all = JSON.parse(data) as Record<
        string,
        {
          routeId: string;
          completedCheckpoints: string[];
          currentCheckpointIndex: number;
          lastUpdated: string;
        }
      >;
      return all[routeId] || null;
    },

    set: (
      routeId: string,
      progress: {
        routeId: string;
        completedCheckpoints: string[];
        currentCheckpointIndex: number;
      }
    ): void => {
      const data = localStorage.getItem(STORAGE_KEYS.PATROL_PROGRESS);
      const all = data ? JSON.parse(data) : {};
      all[routeId] = { ...progress, lastUpdated: new Date().toISOString() };
      localStorage.setItem(STORAGE_KEYS.PATROL_PROGRESS, JSON.stringify(all));
    },

    completeCheckpoint: (routeId: string, checkpointId: string): void => {
      const progress = storage.patrolProgress.get(routeId);
      if (progress) {
        if (!progress.completedCheckpoints.includes(checkpointId)) {
          progress.completedCheckpoints.push(checkpointId);
        }
        progress.currentCheckpointIndex++;
        storage.patrolProgress.set(routeId, progress);
      }
    },

    clear: (routeId: string): void => {
      const data = localStorage.getItem(STORAGE_KEYS.PATROL_PROGRESS);
      if (data) {
        const all = JSON.parse(data);
        delete all[routeId];
        localStorage.setItem(STORAGE_KEYS.PATROL_PROGRESS, JSON.stringify(all));
      }
    },
  },

  draftIncident: {
    get: () => {
      if (typeof window === "undefined") return null;
      const data = localStorage.getItem(STORAGE_KEYS.DRAFT_INCIDENT);
      return data
        ? (JSON.parse(data) as {
            severity?: IncidentSeverity;
            incidentType?: IncidentType;
            title?: string;
            description?: string;
            occurredAt?: string;
            mediaFiles: string[];
          })
        : null;
    },

    set: (draft: {
      severity?: IncidentSeverity;
      incidentType?: IncidentType;
      title?: string;
      description?: string;
      occurredAt?: string;
      mediaFiles: string[];
    }): void => {
      localStorage.setItem(STORAGE_KEYS.DRAFT_INCIDENT, JSON.stringify(draft));
    },

    clear: (): void => {
      localStorage.removeItem(STORAGE_KEYS.DRAFT_INCIDENT);
    },

    addMedia: (dataUrl: string): void => {
      const draft = storage.draftIncident.get() || { mediaFiles: [] };
      draft.mediaFiles.push(dataUrl);
      storage.draftIncident.set(draft);
    },

    removeMedia: (index: number): void => {
      const draft = storage.draftIncident.get();
      if (draft && draft.mediaFiles[index]) {
        draft.mediaFiles.splice(index, 1);
        storage.draftIncident.set(draft);
      }
    },
  },

  settings: {
    get: () => {
      if (typeof window === "undefined")
        return {
          autoSync: true,
          highAccuracyGPS: false,
          voiceToText: true,
          hapticFeedback: true,
          darkMode: true,
        };
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return data
        ? JSON.parse(data)
        : {
            autoSync: true,
            highAccuracyGPS: false,
            voiceToText: true,
            hapticFeedback: true,
            darkMode: true,
          };
    },

    set: (settings: {
      autoSync?: boolean;
      highAccuracyGPS?: boolean;
      voiceToText?: boolean;
      hapticFeedback?: boolean;
      darkMode?: boolean;
    }): void => {
      const current = storage.settings.get();
      localStorage.setItem(
        STORAGE_KEYS.SETTINGS,
        JSON.stringify({ ...current, ...settings })
      );
    },
  },
};

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function isOnline(): boolean {
  return typeof navigator !== "undefined" && navigator.onLine;
}
