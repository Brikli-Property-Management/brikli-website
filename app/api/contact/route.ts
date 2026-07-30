import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

type ContactPayload = {
  name?: unknown;
  email?: unknown;
  city?: unknown;
  portfolio?: unknown;
  website?: unknown;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const requestLog = new Map<string, { count: number; resetAt: number }>();

function clean(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function isRateLimited(request: NextRequest) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  const client = forwardedFor?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
  const now = Date.now();
  const existing = requestLog.get(client);

  if (!existing || existing.resetAt <= now) {
    requestLog.set(client, { count: 1, resetAt: now + 60_000 });
    return false;
  }

  existing.count += 1;
  return existing.count > 5;
}

export async function POST(request: NextRequest) {
  if (isRateLimited(request)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > 10_000) {
    return NextResponse.json({ error: "Request too large" }, { status: 413 });
  }

  let payload: ContactPayload;
  try {
    payload = (await request.json()) as ContactPayload;
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const name = clean(payload.name, 100);
  const email = clean(payload.email, 254).toLowerCase();
  const city = clean(payload.city, 100);
  const portfolio = clean(payload.portfolio, 50);
  const website = clean(payload.website, 200);

  // Silently accept honeypot submissions without sending an email.
  if (website) return NextResponse.json({ ok: true });

  if (!name || !emailPattern.test(email) || !portfolio) {
    return NextResponse.json({ error: "Missing or invalid fields" }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  if (!apiKey || !from) {
    console.error("Contact form: RESEND_API_KEY or RESEND_FROM_EMAIL is not configured");
    return NextResponse.json({ error: "Email service unavailable" }, { status: 503 });
  }

  const to = process.env.CONTACT_TO_EMAIL || "jonathan@brikli.com";
  const message = [
    "New Brikli website inquiry",
    "",
    `Name: ${name}`,
    `Email: ${email}`,
    `City: ${city || "Not provided"}`,
    `Portfolio size: ${portfolio}`,
  ].join("\n");

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "Idempotency-Key": crypto.randomUUID(),
        "User-Agent": "Brikli-Website/1.0",
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: email,
        subject: `New Brikli inquiry from ${name}`,
        text: message,
      }),
    });

    if (!response.ok) {
      console.error("Contact form: Resend rejected the email", response.status, await response.text());
      return NextResponse.json({ error: "Email delivery failed" }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Contact form: email request failed", error);
    return NextResponse.json({ error: "Email delivery failed" }, { status: 502 });
  }
}
