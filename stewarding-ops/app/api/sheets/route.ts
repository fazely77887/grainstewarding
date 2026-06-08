import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * Server-side proxy to the Google Apps Script web app.
 * Keeps APPS_SCRIPT_URL + APPS_SCRIPT_SECRET off the client.
 * GET  → all sheet tabs as JSON
 * POST → { tab, row } append a record
 */
const URL_ = process.env.APPS_SCRIPT_URL;
const SECRET = process.env.APPS_SCRIPT_SECRET;

export async function GET() {
  if (!URL_ || !SECRET) {
    return NextResponse.json({ demo: true, reason: "APPS_SCRIPT_URL not configured" });
  }
  try {
    const res = await fetch(`${URL_}?secret=${encodeURIComponent(SECRET)}`, {
      cache: "no-store",
      redirect: "follow",
    });
    if (!res.ok) throw new Error(`Apps Script responded ${res.status}`);
    const data = await res.json();
    if (data.error) throw new Error(data.error);
    return NextResponse.json({ demo: false, data });
  } catch (err) {
    return NextResponse.json({ demo: true, reason: String(err) });
  }
}

export async function POST(req: NextRequest) {
  if (!URL_ || !SECRET) {
    return NextResponse.json({ demo: true, reason: "APPS_SCRIPT_URL not configured" });
  }
  try {
    const body = await req.json();
    const res = await fetch(URL_, {
      method: "POST",
      redirect: "follow",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ secret: SECRET, tab: body.tab, row: body.row }),
    });
    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
