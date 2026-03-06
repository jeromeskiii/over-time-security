"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { storage, isOnline, type OutboxItem } from "./storage";

export function useOnlineStatus() {
  const [online, setOnline] = useState<boolean>(
    typeof navigator !== "undefined" ? navigator.onLine : true
  );

  useEffect(() => {
    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return online;
}

export function useActiveShift() {
  const [activeShift, setActiveShift] = useState<ReturnType<
    typeof storage.activeShift.get
  > | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const shift = storage.activeShift.get();
    setActiveShift(shift);
    setIsLoading(false);

    const handleStorageChange = () => {
      setActiveShift(storage.activeShift.get());
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const startShift = useCallback(
    (shift: {
      shiftId: string;
      siteName: string;
      siteAddress: string;
      startTime: string;
      scheduledEndTime: string;
      patrolRouteId?: string;
    }) => {
      storage.activeShift.set(shift);
      setActiveShift(shift);
    },
    []
  );

  const endShift = useCallback(() => {
    storage.activeShift.clear();
    setActiveShift(null);
  }, []);

  return { activeShift, isLoading, startShift, endShift };
}

export function useOutbox() {
  const [items, setItems] = useState<OutboxItem[]>([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    const updateItems = () => {
      const all = storage.outbox.getAll();
      setItems(all);
      setPendingCount(all.filter((i) => i.status === "pending").length);
    };

    updateItems();

    const interval = setInterval(updateItems, 1000);
    window.addEventListener("storage", updateItems);

    return () => {
      clearInterval(interval);
      window.removeEventListener("storage", updateItems);
    };
  }, []);

  const sync = useCallback(async () => {
    if (!isOnline()) return;

    setIsSyncing(true);
    const pending = storage.outbox.getPending();

    for (const item of pending) {
      try {
        storage.outbox.update(item.id, { status: "syncing" });

        await new Promise((resolve) => setTimeout(resolve, 500));

        const shouldFail = Math.random() < 0.1;
        if (shouldFail && item.retryCount < 2) {
          throw new Error("Simulated network error");
        }

        storage.outbox.remove(item.id);
      } catch {
        storage.outbox.update(item.id, {
          status: "failed",
          retryCount: item.retryCount + 1,
        });
      }
    }

    setIsSyncing(false);
  }, []);

  useEffect(() => {
    if (isOnline() && pendingCount > 0) {
      const timeout = setTimeout(sync, 2000);
      return () => clearTimeout(timeout);
    }
  }, [pendingCount, sync]);

  return { items, pendingCount, isSyncing, sync };
}

export function usePatrolProgress(routeId: string) {
  const [progress, setProgress] = useState<{
    completedCheckpoints: string[];
    currentCheckpointIndex: number;
  } | null>(null);

  useEffect(() => {
    const data = storage.patrolProgress.get(routeId);
    if (data) {
      setProgress({
        completedCheckpoints: data.completedCheckpoints,
        currentCheckpointIndex: data.currentCheckpointIndex,
      });
    }
  }, [routeId]);

  const completeCheckpoint = useCallback(
    (checkpointId: string) => {
      storage.patrolProgress.completeCheckpoint(routeId, checkpointId);
      const updated = storage.patrolProgress.get(routeId);
      if (updated) {
        setProgress({
          completedCheckpoints: updated.completedCheckpoints,
          currentCheckpointIndex: updated.currentCheckpointIndex,
        });
      }
    },
    [routeId]
  );

  const initProgress = useCallback(
    (totalCheckpoints: number) => {
      storage.patrolProgress.set(routeId, {
        routeId,
        completedCheckpoints: [],
        currentCheckpointIndex: 0,
      });
      setProgress({
        completedCheckpoints: [],
        currentCheckpointIndex: 0,
      });
    },
    [routeId]
  );

  return { progress, completeCheckpoint, initProgress };
}

export function useGPS() {
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
    accuracy: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const getLocation = useCallback(async (): Promise<{
    latitude: number;
    longitude: number;
    accuracy: number;
  } | null> => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        setError("GPS not available");
        resolve(null);
        return;
      }

      setIsLoading(true);
      setError(null);

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const loc = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
          };
          setLocation(loc);
          setIsLoading(false);
          resolve(loc);
        },
        (err) => {
          setError(err.message);
          setIsLoading(false);
          resolve(null);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000,
        }
      );
    });
  }, []);

  return { location, error, isLoading, getLocation };
}

export function useHaptic() {
  const trigger = useCallback((type: "light" | "medium" | "heavy" = "medium") => {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      const patterns = {
        light: 10,
        medium: 25,
        heavy: 50,
      };
      navigator.vibrate(patterns[type]);
    }
  }, []);

  return { trigger };
}

export function useSavedConfirmation() {
  const [show, setShow] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const trigger = useCallback(() => {
    setShow(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setShow(false), 2000);
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return { show, trigger };
}

export function useCurrentTime() {
  const [time, setTime] = useState<Date | null>(null);

  useEffect(() => {
    setTime(new Date());
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  return time;
}
