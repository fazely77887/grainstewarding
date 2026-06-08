"use client";

import { useCallback, useEffect, useState } from "react";
import { normaliseTab, type RawSheets } from "@/lib/sheets";
import type { ModuleRecord } from "@/lib/demo-data";

export type SheetsState = {
  /** Live records per sheet tab name; null while loading or in demo mode */
  live: Record<string, ModuleRecord[]> | null;
  /** Raw unnormalised rows per tab (for non-module tabs: Defect Log, Rework Tracker) */
  raw: RawSheets | null;
  isDemo: boolean;
  loading: boolean;
  updatedAt: Date | null;
  refresh: () => void;
};

/**
 * Fetches all tabs through /api/sheets every 60s.
 * Falls back to demo mode (live = null) when Apps Script isn't configured.
 */
export function useSheets(): SheetsState {
  const [live, setLive] = useState<Record<string, ModuleRecord[]> | null>(null);
  const [raw, setRaw] = useState<RawSheets | null>(null);
  const [isDemo, setIsDemo] = useState(true);
  const [loading, setLoading] = useState(true);
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/sheets", { cache: "no-store" });
      const payload = await res.json();
      if (payload.demo) {
        setIsDemo(true);
        setLive(null);
        setRaw(null);
      } else {
        const rawData = payload.data as RawSheets;
        const mapped: Record<string, ModuleRecord[]> = {};
        for (const tab of Object.keys(rawData)) mapped[tab] = normaliseTab(tab, rawData[tab]);
        setLive(mapped);
        setRaw(rawData);
        setIsDemo(false);
      }
    } catch {
      setIsDemo(true);
      setLive(null);
      setRaw(null);
    } finally {
      setUpdatedAt(new Date());
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    const t = setInterval(load, 60_000);
    return () => clearInterval(t);
  }, [load]);

  return { live, raw, isDemo, loading, updatedAt, refresh: load };
}
