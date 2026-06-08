"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, CheckCircle2, Copy, Save } from "lucide-react";
import { Card, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Field } from "@/components/ui/input";
import { Pill } from "@/components/ui/pill";
import { sheetTabs } from "@/lib/demo-data";
import { useSheetsContext } from "@/components/shell";

export default function SettingsPage() {
  const { isDemo, refresh } = useSheetsContext();
  const [spreadsheetId, setSpreadsheetId] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSpreadsheetId(localStorage.getItem("spreadsheetId") ?? process.env.NEXT_PUBLIC_SPREADSHEET_ID ?? "");
  }, []);

  function save() {
    localStorage.setItem("spreadsheetId", spreadsheetId.trim());
    setSaved(true);
    setTimeout(() => setSaved(false), 2200);
    refresh();
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <header>
        <p className="text-[11px] font-black uppercase tracking-[0.24em] text-sky-400">Configuration</p>
        <h1 className="mt-1 text-2xl font-black tracking-tight sm:text-3xl">Settings</h1>
        <p className="mt-1 text-sm font-semibold text-muted">Google Sheets connection &amp; sheet structure</p>
      </header>

      {/* Connection status */}
      {isDemo ? (
        <div className="flex items-start gap-3 rounded-2xl border border-amber-400/30 bg-amber-500/10 px-5 py-4">
          <AlertTriangle size={18} className="mt-0.5 shrink-0 text-amber-300" />
          <div className="text-sm">
            <p className="font-bold text-amber-200">Running on demo data</p>
            <p className="mt-0.5 text-amber-200/70">
              Set <code className="rounded bg-black/30 px-1.5 py-0.5 font-mono text-xs">APPS_SCRIPT_URL</code> and{" "}
              <code className="rounded bg-black/30 px-1.5 py-0.5 font-mono text-xs">APPS_SCRIPT_SECRET</code> in your Vercel
              environment variables (or <code className="rounded bg-black/30 px-1.5 py-0.5 font-mono text-xs">.env.local</code>) to connect your sheet.
              The deployment guide is in the README.
            </p>
          </div>
        </div>
      ) : (
        <div className="flex items-start gap-3 rounded-2xl border border-emerald-400/30 bg-emerald-500/10 px-5 py-4">
          <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-emerald-300" />
          <div className="text-sm">
            <p className="font-bold text-emerald-200">Connected to Google Sheets</p>
            <p className="mt-0.5 text-emerald-200/70">Data refreshes automatically every 60 seconds via the Apps Script API layer.</p>
          </div>
        </div>
      )}

      {/* Google Sheets configuration */}
      <Card>
        <CardHeader title="Google Sheets Configuration" subtitle="The dashboard reads and writes through Google Apps Script" />
        <div className="space-y-4 p-5">
          <Field label="Spreadsheet ID" hint="From the sheet URL: docs.google.com/spreadsheets/d/⟨SPREADSHEET ID⟩/edit — shown for reference; the Apps Script is already bound to your sheet.">
            <Input placeholder="1AbC…xYz" value={spreadsheetId} onChange={(e) => setSpreadsheetId(e.target.value)} className="font-mono" />
          </Field>
          <Field label="Apps Script Web App URL" hint="Configured server-side as APPS_SCRIPT_URL — never exposed to the browser.">
            <Input disabled value={isDemo ? "Not configured" : "Configured ✓ (hidden)"} className="font-mono opacity-70" />
          </Field>
          <Field label="Shared Secret" hint="Configured server-side as APPS_SCRIPT_SECRET — must match the SECRET constant inside Code.gs.">
            <Input disabled value={isDemo ? "Not configured" : "••••••••••••"} className="font-mono opacity-70" />
          </Field>
          <div className="flex items-center gap-3 pt-1">
            <Button onClick={save}><Save size={15} /> Save Settings</Button>
            {saved && <Pill tone="green">Saved</Pill>}
          </div>
        </div>
      </Card>

      {/* Required tabs & headers */}
      <Card>
        <CardHeader title="Required Sheet Tabs & Column Headers" subtitle="Tab names and headers must match exactly (row 1 = headers)" />
        <ul className="divide-y divide-line-soft">
          {sheetTabs.map((t) => (
            <li key={t.value} className="px-5 py-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-base">{t.emoji}</span>
                <p className="text-sm font-bold">{t.label}</p>
                <code className="rounded-lg bg-panel-2 px-2 py-1 font-mono text-[11px] text-sky-300">{t.value}</code>
                <button
                  className="text-muted transition hover:text-accent"
                  title="Copy tab name"
                  onClick={() => navigator.clipboard?.writeText(t.value)}
                >
                  <Copy size={13} />
                </button>
              </div>
              <p className="mt-1.5 font-mono text-[11px] leading-relaxed text-faint">{t.headers.join("  ·  ")}</p>
            </li>
          ))}
          <li className="px-5 py-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-base">🛠️</span>
              <p className="text-sm font-bold">Defect Log</p>
              <code className="rounded-lg bg-panel-2 px-2 py-1 font-mono text-[11px] text-sky-300">Defect Log</code>
            </div>
            <p className="mt-1.5 font-mono text-[11px] leading-relaxed text-faint">Month · Severity · Reported By · Description · Action Taken · Preventive Action · Status</p>
          </li>
          <li className="px-5 py-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-base">♻️</span>
              <p className="text-sm font-bold">Rework Tracker</p>
              <code className="rounded-lg bg-panel-2 px-2 py-1 font-mono text-[11px] text-sky-300">Rework Tracker</code>
            </div>
            <p className="mt-1.5 font-mono text-[11px] leading-relaxed text-faint">Month · Total Items · Rework Items · Trigger Area · Rework Case · Action Taken · Prevent Action</p>
          </li>
        </ul>
      </Card>

      {/* Deployment steps */}
      <Card>
        <CardHeader title="Connect Your Sheet — 4 Steps" />
        <ol className="space-y-3 p-5 text-sm">
          {[
            ["1", "Open your Google Sheet → Extensions → Apps Script, paste apps-script/Code.gs and set a long random SECRET."],
            ["2", "Deploy → New deployment → Web app · Execute as: Me · Who has access: Anyone. Copy the /exec URL."],
            ["3", "In Vercel → Project → Settings → Environment Variables, add APPS_SCRIPT_URL and APPS_SCRIPT_SECRET."],
            ["4", "Redeploy. The amber DEMO DATA badge disappears once live data flows."],
          ].map(([n, text]) => (
            <li key={n} className="flex gap-3">
              <span className="grid h-6 w-6 shrink-0 place-items-center rounded-lg bg-accent/15 font-mono text-xs font-bold text-accent">{n}</span>
              <span className="text-muted">{text}</span>
            </li>
          ))}
        </ol>
      </Card>
    </div>
  );
}
