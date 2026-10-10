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
    "WLC_Control_2026"
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
    "Willes Literary Club",
    "",
    "Membership Confirmation",
    `Dear ${member.name},`,
    "",
    "Congratulations! Your Willes Literary Club membership registration has been recorded successfully.",
    "",
    `Member ID: ${member.memberId}`,
    "",
    "Please keep this Member ID safe. Event-specific portal credentials and instructions will be shared separately before relevant events.",
    "",
    "— Willes Literary Club",
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
  const logoUrl = "https://wlc.pro.bd/logo.png";

  return {
    subject: "Willes Literary Club — Membership Confirmation",
    text: buildMemberMessage(member),
    html: `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>Willes Literary Club - Membership Confirmation</title>
  </head>
  <body style="margin:0;padding:0;background:#f7f3ef;font-family:Arial,Helvetica,sans-serif;color:#292524;">
    <div style="width:100%;background:#f7f3ef;padding:32px 12px;">
      <div style="max-width:620px;margin:0 auto;">
        <div style="background:#ffffff;border:1px solid #e7e5e4;border-radius:24px;overflow:hidden;box-shadow:0 8px 30px rgba(41,37,36,.08);">
          
          <div style="background:#fff;border-bottom:1px solid #eee7e1;padding:28px 28px 22px;text-align:center;">
            <img src="${logoUrl}" width="76" height="76" alt="Willes Literary Club logo" style="display:block;width:76px;height:76px;object-fit:contain;margin:0 auto 14px;border-radius:18px;" />
            <div style="font-size:12px;letter-spacing:.18em;text-transform:uppercase;color:#a8a29e;font-weight:700;">Willes Literary Club</div>
            <div style="font-size:13px;color:#78716c;margin-top:5px;">উইল্‌স সাহিত্য ক্লাব</div>
          </div>

          <div style="height:5px;background:linear-gradient(90deg,#7f1d1d,#be123c,#991b1b);"></div>

          <div style="padding:34px 30px 30px;">
            <div style="display:inline-block;padding:7px 12px;border-radius:999px;background:#fef2f2;color:#991b1b;font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;">Membership Confirmation</div>
            <h1 style="margin:16px 0 10px;font-size:30px;line-height:1.2;color:#1c1917;">Welcome ${safeName},</h1>
            <p style="margin:0;color:#57534e;font-size:15px;line-height:1.8;">Congratulations! Your Willes Literary Club membership registration has been recorded successfully.</p>

            <div style="margin:26px 0;padding:22px;border:1px solid #eadfd8;border-radius:18px;background:#faf8f6;">
              <div style="font-size:11px;text-transform:uppercase;letter-spacing:.16em;color:#a8a29e;font-weight:700;">Your Member ID</div>
              <div style="margin-top:9px;font-size:30px;line-height:1.2;font-weight:800;letter-spacing:.06em;color:#7f1d1d;">${safeMemberId}</div>
            </div>

            <p style="margin:0;color:#57534e;font-size:14px;line-height:1.8;">Please keep this Member ID safe. Event-specific portal credentials and instructions will be shared separately before relevant events.</p>

            <div style="margin-top:30px;padding-top:22px;border-top:1px solid #eee7e1;">
              <p style="margin:0;color:#44403c;font-size:14px;line-height:1.7;">With literary regards,<br /><strong style="color:#7f1d1d;">Willes Literary Club</strong></p>
              <p style="margin:7px 0 0;color:#a8a29e;font-size:12px;">“সাহিত্যের বন্ধনে, প্রতিভার সন্ধানে”</p>
            </div>
          </div>

          <div style="background:#1c1917;padding:22px 28px;text-align:center;">
            <div style="font-size:12px;color:#d6d3d1;font-weight:700;">Willes Literary Club</div>
            <div style="font-size:11px;color:#a8a29e;margin-top:5px;">Willes Little Flower School & College, Dhaka</div>
            <a href="https://wlc.pro.bd" style="display:inline-block;margin-top:12px;color:#fca5a5;text-decoration:none;font-size:11px;font-weight:700;">wlc.pro.bd</a>
          </div>
        </div>

        <div style="text-align:center;padding:18px 8px 4px;color:#a8a29e;font-size:10px;line-height:1.6;">
          This is an automated membership confirmation from Willes Literary Club.
        </div>
      </div>
    </div>
  </body>
</html>`,
  };
}

export async function sendMemberEmail(member: RegisteredMember) {
  if (!member.email) throw new Error("This member does not have an email address.");

  const apiToken = process.env.MAILERSEND_API_TOKEN?.trim();
  const fromEmail = process.env.MAILERSEND_FROM_EMAIL?.trim();
  const fromName = process.env.MAILERSEND_FROM_NAME?.trim() || "Willes Literary Club ";

  if (!apiToken || !fromEmail) {
    throw new Error(
      "Email service is not configured. Add MAILERSEND_API_TOKEN and MAILERSEND_FROM_EMAIL in Vercel."
    );
  }

  const email = buildMemberEmail(member);
  const response = await fetch("https://api.mailersend.com/v1/email", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: {
        email: fromEmail,
        name: fromName,
      },
      to: [
        {
          email: member.email,
          name: member.name,
        },
      ],
      subject: email.subject,
      html: email.html,
      text: email.text,
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    const reason =
      typeof body?.message === "string"
        ? body.message
        : typeof body?.error === "string"
          ? body.error
          : `MailerSend returned HTTP ${response.status}`;
    throw new Error(reason);
  }

  return response.headers.get("x-message-id") || "";
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
  const counterRef = db.collection("system_counters").doc("registered_members_WLC-03");
  const now = Date.now();

  const member = await db.runTransaction(async (transaction) => {
    const counterSnap = await transaction.get(counterRef);
    let current = Math.max(1, Math.floor(Number(counterSnap.data()?.nextNumber || 1)));
    let memberId = "";
    let memberRef = db.collection("registered_members").doc("WLC-03-001");

    // Preserve any existing IDs; pick the next unused serial starting at 001.
    while (true) {
      memberId = `WLC-03-${String(current).padStart(3, "0")}`;
      memberRef = db.collection("registered_members").doc(memberId);
      const existingMember = await transaction.get(memberRef);
      if (!existingMember.exists) break;
      current += 1;
    }

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
