# 🧽 Stewarding Ops Control Center

Enterprise stewarding operations dashboard — deep cleaning, 5-minute QC inspections,
rubbish disposal timing, red tag management, defect tracking and rework analytics.

**Stack:** Google Forms (field input) · Google Sheets (database) · Google Apps Script (API) ·
Next.js 15 (App Router) · TypeScript · Tailwind CSS · Recharts · Vercel-ready.

**The pipeline:** operators submit **Google Forms** on their phones → responses land in a
**Google Sheet** → an **Apps Script** web app serves the sheet as JSON → the **Next.js dashboard**
on **Vercel** reads it live (60s polling) and visualises everything.

Works out of the box on a built-in demo dataset (amber **DEMO DATA** badge). Connect your
Google Sheet and it becomes the single source of truth — reads refresh every 60s, and the
in-dashboard **Add Record / Log Defect / Log Rework** forms append rows straight into the sheet
alongside the field Google Form submissions.

---

## Pages

| Route | Page |
|---|---|
| `/` | Executive Dashboard — compliance ring, 8 drill-down KPI cards, charts, incidents |
| `/kpi` | KPI Dashboard — KPI vs target, compliance detail |
| `/live` | Live Operations — activity feed, shift activity, module quick-launch |
| `/modules/[slug]` | 7 module pages — water-dispenser, black-box, machine-clean, kitchen-utensils, pest-control, rubbish-disposal, red-tag-items |
| `/audit` | Audit Dashboard — QC pass rates, area radar, fail findings |
| `/defect-board` | Defect Tracking Board — monthly defects, severity chart, Log Defect |
| `/rework` | Rework Management Board — rework rate trend, CAPA, Log Rework |
| `/reports` | Reports & Analytics — Overview / Operator / Area / Incidents / Shift / Weekly |
| `/settings` | Settings — connection status, required tabs & headers |

## Quick start (demo mode)

```bash
npm install
npm run dev        # http://localhost:3000
```

No configuration needed — the app runs on the demo dataset.

## Connect the pipeline (production)

Everything is scripted. You do **not** create tabs or forms by hand.

**1 — Create one empty Google Sheet**, then open **Extensions → Apps Script** and add all three
files from [`apps-script/`](apps-script/): `Code.gs`, `CreateForms.gs`, `SetupSheet.gs`.

**2 — Generate the input layer.** In the Apps Script editor:

```
Run  createForms()           → builds the 7 field Google Forms (English) and links each one
                               to its canonical response tab. Approve the permission prompt,
                               then open Executions/Logs to copy the live form links.
Run  setupSheet()            → adds the 2 management tabs (Defect Log, Rework Tracker).
                               (Idempotent — it skips the 7 tabs the forms already created.)
```

That produces all 9 tabs with the exact headers below. Question titles are set so each form's
response columns line up 1:1 with the dashboard — Google Forms adds the `Timestamp` column itself.

| Tab | Source | Headers |
|---|---|---|
| `Cambro Water Dispenser Deep Clean` | Form | Timestamp · Dispenser ID · Operator Name · Cleaning Status · Remarks |
| `Cambro Black Box Deep Clean` | Form | Timestamp · Cambro ID · Operator Name · Cleaning Status · Remarks |
| `Machine Deep Clean` | Form | Timestamp · Machine ID · Machine Name · Operator Name · Cleaning Status · Remarks |
| `5 Minute QC Kitchen Utensils` | Form | Timestamp · Area · Inspector Name · Pass/Fail · Findings · Corrective Action |
| `5 Minute QC Pest Control` | Form | Timestamp · Area · Inspector Name · Pass/Fail · Findings · Corrective Action |
| `Rubbish Disposal Timing` | Form | Timestamp · Area · Disposal Time · Operator Name · Status · Remarks |
| `Red Tag Item Management` | Form | Timestamp · Item ID · Item Name · Reason · Reported By · Status · Action Taken |
| `Defect Log` | Dashboard | Month · Severity · Reported By · Description · Action Taken · Preventive Action · Status |
| `Rework Tracker` | Dashboard | Month · Total Items · Rework Items · Trigger Area · Rework Case · Action Taken · Prevent Action |

Timestamps: `YYYY-MM-DD HH:mm`. Statuses: Completed / In Progress / Pending / Failed,
Pass / Fail, On Time / Delayed / Missed, Open / In Progress / Resolved.

> **Dashboard-only mode (no field forms):** skip `createForms()` and just run `setupSheet()` —
> it creates all 9 tabs and you enter data through the dashboard's Add Record dialogs.

**3 — Deploy the Apps Script.** In `Code.gs` set `SECRET` to a long random string →
Deploy → **New deployment → Web app** → *Execute as: Me* · *Who has access: Anyone* →
copy the `/exec` URL. Test it: open
`https://…/exec?secret=YOUR_SECRET&action=health` — you should see each tab and its row count.

**4 — Set environment variables** (Vercel → Settings → Environment Variables, or `.env.local`):

```
APPS_SCRIPT_URL=https://script.google.com/macros/s/XXXX/exec
APPS_SCRIPT_SECRET=the-same-secret-as-in-Code.gs
NEXT_PUBLIC_SPREADSHEET_ID=optional-for-settings-page
```

**5 — Deploy to Vercel.**

```bash
npm i -g vercel && vercel --prod
```

`vercel.json` pins the `sin1` (Singapore) region. The secret stays server-side: the browser
only ever talks to `/api/sheets`, which proxies to Apps Script. Distribute the form links from
step 2 to your operators (QR codes work well on the kitchen floor).

## Architecture

```
 Operators' phones
        │  submit
        ▼
  Google Forms ×7  ──────────────┐   (apps-script/CreateForms.gs builds these)
                                 ▼
                          Google Sheet  ◀── Dashboard Add/Log dialogs (append)
                       (single source of truth, 9 tabs)
                                 │
                                 ▼
              Google Apps Script Web App (apps-script/Code.gs)
                                 │  GET all tabs as JSON · GET ?action=health · POST append
                                 ▼
        Next.js /api/sheets  (server-side proxy — secret never reaches the browser)
                                 │  60s polling
                                 ▼
                 Dashboard on Vercel  (live KPIs, charts, drill-downs)
```

- `apps-script/CreateForms.gs` — generates the 7 field Google Forms, linked to canonical tabs
- `apps-script/SetupSheet.gs` — one-click tab/header provisioner (+ management tabs, data reset)
- `apps-script/Code.gs` — read/append/health API the dashboard talks to
- `lib/demo-data.ts` — demo dataset (the screenshots' numbers)
- `lib/sheets.ts` — header→record normalisation + append client
- `lib/kpi.ts` — KPI calculations (totals, rates, 7-day trends, shift bucketing)
- `lib/modules.ts` — config that drives all 7 module pages
- `hooks/useSheets.ts` — 60s polling hook with demo fallback
