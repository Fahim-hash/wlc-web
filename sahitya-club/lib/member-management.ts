import crypto from "node:crypto";
import { cookies } from "next/headers";
import { getAdminDb } from "@/lib/firebase-admin";

export const MEMBER_ADMIN_COOKIE = "wlc_member_admin_session";
const SESSION_TTL_MS = 8 * 60 * 60 * 1000;

export type MemberNotification = "none" | "email" | "whatsapp" | "both";

export type RegisteredMember = {
  memberId: string;
  name: string;
  email: string | null;
  phone: string | null;
  batch: string | null;
  notes: string | null;
  status: "ACTIVE" | "INACTIVE";
  emailStatus: "PENDING" | "SENT" | "FAILED" | "NOT_APPLICABLE";
  emailSentAt: number | null;
  emailMessageId: string | null;
  createdAt: number;
  updatedAt: number;
  createdBy: string;
};

function getAdminSecret() {
  return (
    process.env.MEMBER_ADMIN_GATEWAY_KEY?.trim() ||
    process.env.CONTROL_GATEWAY_KEY?.trim() ||
    ""
  );
}

function safeString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function timingSafeEqualText(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && crypto.timingSafeEqual(left, right);
}

export function isMemberAdminSecret(value: string) {
  const expected = getAdminSecret();
  return Boolean(expected && value && timingSafeEqualText(value, expected));
}

export function createMemberAdminSession() {
  const secret = getAdminSecret();
  if (!secret) throw new Error("MEMBER_ADMIN_GATEWAY_KEY or CONTROL_GATEWAY_KEY is not configured.");

  const expiresAt = Date.now() + SESSION_TTL_MS;
  const payload = String(expiresAt);
  const signature = crypto.createHmac("sha256", secret).update(payload).digest("hex");
  return { value: `${payload}.${signature}`, expiresAt };
}

export function verifyMemberAdminSession(token: string | undefined) {
  const secret = getAdminSecret();
  if (!secret || !token) return false;

  const [expiresAtText, signature] = token.split(".");
  const expiresAt = Number(expiresAtText);
  if (!Number.isFinite(expiresAt) || expiresAt < Date.now() || !signature) return false;

  const expected = crypto.createHmac("sha256", secret).update(expiresAtText).digest("hex");
  return timingSafeEqualText(signature, expected);
}

export async function isMemberAdminAuthenticated() {
  const store = await cookies();
  return verifyMemberAdminSession(store.get(MEMBER_ADMIN_COOKIE)?.value);
}

export function normalizePhoneForWhatsApp(phone: string) {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("880")) return digits;
  if (digits.startsWith("0")) return `880${digits.slice(1)}`;
  if (digits.startsWith("1")) return `880${digits}`;
  return digits;
}

export function buildMemberMessage(member: Pick<RegisteredMember, "memberId" | "name">) {
  return [
    "Willes Literary Club (WLC)",
    "",
    "Membership Confirmation",
    `Dear ${member.name},`,
    "",
    "Congratulations! Your WLC membership registration has been recorded successfully.",
    "",
    `Member ID: ${member.memberId}`,
    "",
    "Please keep this Member ID safe. Event-specific portal credentials and instructions will be shared separately before relevant events.",
    "",
    "— Willes Literary Club (WLC)",
  ].join("\n");
}

export function buildWhatsAppUrl(phone: string, message: string) {
  const target = normalizePhoneForWhatsApp(phone);
  return target ? `https://wa.me/${target}?text=${encodeURIComponent(message)}` : null;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function buildMemberEmail(member: Pick<RegisteredMember, "memberId" | "name">) {
  const safeName = escapeHtml(member.name);
  const safeMemberId = escapeHtml(member.memberId);

  return {
    subject: "Willes Literary Club — Membership Confirmation",
    text: buildMemberMessage(member),
    html: `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>WLC Membership Confirmation</title>
  </head>
  <body style="margin:0;background:#f6f9fc;font-family:Arial,sans-serif;color:#0f172a;">
    <div style="max-width:620px;margin:0 auto;padding:32px 16px;">
      <div style="background:#0f172a;border-radius:22px;padding:28px;color:#fff;">
        <div style="font-size:13px;letter-spacing:.12em;text-transform:uppercase;opacity:.75;">Willes Literary Club</div>
        <h1 style="margin:10px 0 0;font-size:28px;">Membership Confirmed</h1>
      </div>
      <div style="background:#fff;border:1px solid #e2e8f0;border-radius:22px;padding:28px;margin-top:16px;">
        <p style="font-size:16px;">Dear <strong>${safeName}</strong>,</p>
        <p style="line-height:1.7;">Congratulations! Your WLC membership registration has been recorded successfully.</p>
        <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:16px;padding:20px;margin:22px 0;">
          <div style="font-size:12px;text-transform:uppercase;letter-spacing:.12em;color:#64748b;">Member ID</div>
          <div style="font-size:28px;font-weight:700;margin-top:8px;letter-spacing:.04em;">${safeMemberId}</div>
        </div>
        <p style="line-height:1.7;">Please keep this Member ID safe. Event-specific portal credentials and instructions will be shared separately before relevant events.</p>
        <p style="margin-top:28px;">— Willes Literary Club (WLC)</p>
      </div>
    </div>
  </body>
</html>`,
  };
}

export async function sendMemberEmail(member: RegisteredMember) {
  if (!member.email) throw new Error("This member does not have an email address.");

  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.RESEND_FROM_EMAIL?.trim();

  if (!apiKey || !from) {
    throw new Error("Email service is not configured. Add RESEND_API_KEY and RESEND_FROM_EMAIL in Vercel.");
  }

  const email = buildMemberEmail(member);
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [member.email],
      subject: email.subject,
      html: email.html,
      text: email.text,
    }),
    cache: "no-store",
  });

  const body = await response.json().catch(() => ({}));

  if (!response.ok) {
    const reason =
      typeof body?.message === "string"
        ? body.message
        : typeof body?.error === "string"
          ? body.error
          : `Resend returned HTTP ${response.status}`;
    throw new Error(reason);
  }

  return String(body?.id || "");
}

export async function updateEmailStatus(
  memberId: string,
  status: RegisteredMember["emailStatus"],
  extra: Record<string, unknown> = {}
) {
  const now = Date.now();
  await getAdminDb().collection("registered_members").doc(memberId).set(
    {
      emailStatus: status,
      updatedAt: now,
      ...extra,
    },
    { merge: true }
  );
}

export async function createRegisteredMember(input: {
  name: string;
  email?: string | null;
  phone?: string | null;
  batch?: string | null;
  notes?: string | null;
  actor: string;
}) {
  const name = safeString(input.name);
  const email = safeString(input.email) || null;
  const phone = safeString(input.phone) || null;
  const batch = safeString(input.batch) || null;
  const notes = safeString(input.notes) || null;

  if (name.length < 2 || name.length > 120) {
    throw new Error("Name must be between 2 and 120 characters.");
  }

  if (!email && !phone) {
    throw new Error("At least one contact method is required: email or phone.");
  }

  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("Please enter a valid email address.");
  }

  if (phone && phone.replace(/\D/g, "").length < 10) {
    throw new Error("Please enter a valid phone number.");
  }

  const db = getAdminDb();
  const year = new Date().getFullYear();
  const counterRef = db.collection("system_counters").doc(`registered_members_${year}`);
  const now = Date.now();

  const member = await db.runTransaction(async (transaction) => {
    const counterSnap = await transaction.get(counterRef);
    const current = Math.max(1, Math.floor(Number(counterSnap.data()?.nextNumber || 1)));
    const memberId = `WLC-${year}-${String(current).padStart(4, "0")}`;
    const memberRef = db.collection("registered_members").doc(memberId);

    const record: RegisteredMember = {
      memberId,
      name,
      email,
      phone,
      batch,
      notes,
      status: "ACTIVE",
      emailStatus: email ? "PENDING" : "NOT_APPLICABLE",
      emailSentAt: null,
      emailMessageId: null,
      createdAt: now,
      updatedAt: now,
      createdBy: input.actor,
    };

    transaction.set(
      counterRef,
      { nextNumber: current + 1, updatedAt: now },
      { merge: true }
    );
    transaction.set(memberRef, record);

    return record;
  });

  await db.collection("audit_logs").add({
    action: "CREATE",
    collection: "registered_members",
    recordId: member.memberId,
    actor: input.actor,
    createdAt: now,
  });

  return member;
}
