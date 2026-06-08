# Apps Script — the pipeline backend

Three scripts run inside the Google Sheet (**Extensions → Apps Script**). Together they build the
input layer (Google Forms), the database layer (Sheet tabs), and the API layer the dashboard reads.

| File | Role | Key functions |
|---|---|---|
| `CreateForms.gs` | **Input** — builds 7 field Google Forms and links each to its tab | `createForms()`, `auditTabs()` |
| `SetupSheet.gs` | **Database** — provisions all 9 tabs with exact headers | `setupSheet()`, `setupManagementTabs()`, `clearAllData()` |
| `Code.gs` | **API** — serves the sheet as JSON, appends rows, health check | `doGet()`, `doPost()` |

## Run order (one time)

```
1. createForms()    →  7 forms + 7 response tabs (canonical names). Copy the live form links
                       printed in the Execution log.
2. setupSheet()     →  adds the 2 management tabs (Defect Log, Rework Tracker).
3. Set SECRET in Code.gs, then Deploy → New deployment → Web app
   (Execute as: Me · Who has access: Anyone). Copy the /exec URL.
```

Re-running is safe: `createForms()` skips any tab that already exists, and `setupSheet()` skips any
tab already present. To regenerate a form, delete its tab first, then re-run `createForms()`.

## Verify

Open in a browser (replace the secret):

```
https://script.google.com/macros/s/XXXX/exec?secret=YOUR_SECRET&action=health
```

Returns each tab and its data-row count — a fast way to confirm forms are wired before deploying
the dashboard.

## The contract (why titles matter)

Each form **question title** is set to the exact column header the dashboard expects. Google Forms
adds the `Timestamp` column automatically, so a linked response tab reads:

```
Timestamp · Dispenser ID · Operator Name · Cleaning Status · Remarks   (Water Dispenser)
```

These headers are the single source of truth shared across three files — keep them identical if you
ever edit a form:

- `lib/sheets.ts` → `normaliseTab()` reads rows by header name
- `lib/demo-data.ts` → `sheetTabs` lists the headers shown on the Settings page
- `apps-script/Code.gs` → `TABS` + `doPost` map appended rows by header name

Choice options must also match the statuses the dashboard understands: **Completed / In Progress /
Pending / Failed**, **Pass / Fail**, **On Time / Delayed / Missed**, **Open / In Progress /
Resolved**.

## Security

The `SECRET` in `Code.gs` must equal `APPS_SCRIPT_SECRET` in the dashboard's environment. The
browser never sees it — it only ever calls the Next.js `/api/sheets` route, which injects the secret
server-side and proxies to this web app.
