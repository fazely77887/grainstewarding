# 🚀 Deploy — drop-in steps

Each block below is self-contained. Copy → paste → next. The shared secret is **already
pre-filled** in `apps-script/Code.gs` and `.env.local`, so they match out of the box.

> Pre-filled secret: `stw-ops-7Kq2VtX9mLp4hRf8sBnY6wD3jUc1Ae5Gx0NoTbQiHl`
> For real production, regenerate once with `openssl rand -hex 32` and replace it in **both**
> `Code.gs` and `.env.local` (+ Vercel). They must stay identical.

---

## STEP 1 — Apps Script (input + database + API)

1. Create one **empty Google Sheet**.
2. **Extensions → Apps Script**. Create three files and paste each one:
   - `Code.gs`  ← from `apps-script/Code.gs` (secret already set)
   - `CreateForms.gs`  ← from `apps-script/CreateForms.gs`
   - `SetupSheet.gs`  ← from `apps-script/SetupSheet.gs`
3. Run the functions **in this order** (pick the function from the toolbar dropdown → Run →
   approve the permission prompt the first time):

```
createForms()      → builds the 7 field Google Forms + their response tabs
setupSheet()       → adds the Defect Log + Rework Tracker tabs
```

4. Open **Executions** (left sidebar) → click the `createForms` run → copy the **live form links**
   from the log. Those links go to your operators.

---

## STEP 2 — Deploy the API (Apps Script Web App)

In the Apps Script editor:

```
Deploy → New deployment → ⚙ → Web app
  Execute as:        Me
  Who has access:    Anyone
Deploy → copy the Web app URL (ends in /exec)
```

Test it in a browser (paste your /exec URL before `?`):

```
https://script.google.com/macros/s/XXXXX/exec?secret=stw-ops-7Kq2VtX9mLp4hRf8sBnY6wD3jUc1Ae5Gx0NoTbQiHl&action=health
```

You should see each tab name and its row count. ✅

---

## STEP 3 — Fill the /exec URL

Open `.env.local` and paste the URL from Step 2 into the empty line:

```
APPS_SCRIPT_URL=https://script.google.com/macros/s/XXXXX/exec
```

(The secret line is already filled and matches `Code.gs`.)

---

## STEP 4 — Vercel environment variables

These are the **exact 3 values** to add in Vercel. Add each to **Production, Preview, and
Development**.

```
APPS_SCRIPT_URL = https://script.google.com/macros/s/XXXXX/exec
APPS_SCRIPT_SECRET = stw-ops-7Kq2VtX9mLp4hRf8sBnY6wD3jUc1Ae5Gx0NoTbQiHl
NEXT_PUBLIC_SPREADSHEET_ID = (optional — your sheet ID)
```

### Option A — Vercel dashboard
Project → **Settings → Environment Variables** → add the three above → **Save**.

### Option B — Vercel CLI
```bash
npm i -g vercel
vercel login
vercel link                       # link this folder to a Vercel project
printf 'https://script.google.com/macros/s/XXXXX/exec' | vercel env add APPS_SCRIPT_URL production
printf 'stw-ops-7Kq2VtX9mLp4hRf8sBnY6wD3jUc1Ae5Gx0NoTbQiHl' | vercel env add APPS_SCRIPT_SECRET production
```

---

## STEP 5 — Deploy the dashboard to Vercel

### Option A — CLI (fastest)
```bash
cd ~/Downloads/stewarding-ops
npm install
vercel --prod
```

### Option B — Git + Vercel dashboard
```bash
cd ~/Downloads/stewarding-ops
git init && git add . && git commit -m "Stewarding Ops pipeline"
git branch -M main
git remote add origin https://github.com/<you>/stewarding-ops.git
git push -u origin main
```
Then on **vercel.com → Add New → Project → Import** the repo, add the Step 4 env vars, **Deploy**.

`vercel.json` already pins the **Singapore (sin1)** region — no action needed.

---

## Do I need to redeploy later?

| You changed… | Redeploy Vercel? |
|---|---|
| New form submissions / sheet rows | ❌ No — dashboard auto-refreshes every 60s |
| `Code.gs` (e.g. health endpoint) | ❌ Vercel no — but **re-deploy the Apps Script**: Deploy → Manage deployments → Edit → Version: *New version* |
| Dashboard code (`.tsx`, `lib/`, `hooks/`) | ✅ Yes — `vercel --prod` (or push to Git) |
| Added/changed a Vercel env var | ✅ Yes — env changes only apply to a new deployment |

---

## Quick checklist

- [ ] 3 Apps Script files pasted, `createForms()` + `setupSheet()` run
- [ ] Web App deployed, `?action=health` returns tabs ✅
- [ ] `.env.local` `APPS_SCRIPT_URL` filled
- [ ] 3 env vars added in Vercel
- [ ] `vercel --prod` (or Git import) — amber **DEMO DATA** badge gone = live 🎉
