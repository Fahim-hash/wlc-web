import crypto from "node:crypto";
import { cookies } from "next/headers";
import { getAdminDb } from "@/lib/firebase-admin";

export const MEMBER_SESSION_COOKIE = "wlc_member_session";
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;
const ACTIVATION_TTL_MS = 48 * 60 * 60 * 1000;

function sessionSecret() {
  const secret = process.env.MEMBER_PORTAL_SESSION_SECRET?.trim();
  if (!secret || secret.length < 32) {
    throw new Error("Configure MEMBER_PORTAL_SESSION_SECRET with at least 32 random characters in Vercel.");
  }
  return secret;
}

function hash(value: string) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function sign(value: string) {
  return crypto.createHmac("sha256", sessionSecret()).update(value).digest("hex");
}

function equal(a: string, b: string) {
  const aa = Buffer.from(a);
  const bb = Buffer.from(b);
  return aa.length === bb.length && crypto.timingSafeEqual(aa, bb);
}

export function normalizeUsername(value: unknown) {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

export function validateUsername(value: string) {
  return /^[a-z0-9_]{4,20}$/.test(value);
}

function passwordHash(password: string, salt = crypto.randomBytes(16).toString("hex")) {
  const derived = crypto.scryptSync(password, salt, 64).toString("hex");
  return { salt, hash: derived };
}

export async function createActivationLink(memberId: string) {
  const db = getAdminDb();
  const memberRef = db.collection("registered_members").doc(memberId);
  const snap = await memberRef.get();
  if (!snap.exists) throw new Error("Member not found.");
  const member = snap.data()!;
  if (!member.email) throw new Error("An email address is required to activate a portal account.");
  if (member.portalStatus === "ACTIVE") throw new Error("This member already has an active portal account.");

  const token = crypto.randomBytes(32).toString("base64url");
  const tokenHash = hash(token);
  const now = Date.now();
  await db.collection("member_activation_tokens").doc(tokenHash).set({
    memberId,
    createdAt: now,
    expiresAt: now + ACTIVATION_TTL_MS,
    usedAt: null,
  });
  await memberRef.set({ portalStatus: "PENDING", activationIssuedAt: now, updatedAt: now }, { merge: true });
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://wlc.pro.bd").replace(/\/$/, "");
  return { url: baseUrl + "/member-portal/activate?token=" + encodeURIComponent(token), member };
}

export async function activateMemberAccount(input: { token: string; username: string; password: string }) {
  const token = input.token.trim();
  const username = normalizeUsername(input.username);
  const password = input.password;
  if (token.length < 32 || token.length > 200) throw new Error("This activation link is invalid.");
  if (!validateUsername(username)) throw new Error("UID must be 4–20 characters using English letters, numbers, or underscores.");
  if (typeof password !== "string" || password.length < 10 || password.length > 128) {
    throw new Error("Password must be between 10 and 128 characters.");
  }

  const db = getAdminDb();
  const tokenHash = hash(token);
  const tokenRef = db.collection("member_activation_tokens").doc(tokenHash);
  const now = Date.now();

  return db.runTransaction(async (tx) => {
    const tokenSnap = await tx.get(tokenRef);
    if (!tokenSnap.exists) throw new Error("This activation link is invalid or has already been used.");
    const tokenData = tokenSnap.data()!;
    if (tokenData.usedAt || Number(tokenData.expiresAt) < now) throw new Error("This activation link has expired. Ask the club admin for a new one.");
    const memberRef = db.collection("registered_members").doc(String(tokenData.memberId));
    const memberSnap = await tx.get(memberRef);
    if (!memberSnap.exists) throw new Error("Member record not found.");
    const member = memberSnap.data()!;
    if (member.status !== "ACTIVE") throw new Error("This membership is inactive. Please contact the club admin.");
    if (member.portalStatus === "ACTIVE") throw new Error("This member portal account is already active.");

    const usernameRef = db.collection("member_usernames").doc(username);
    const usernameSnap = await tx.get(usernameRef);
    if (usernameSnap.exists) throw new Error("That UID is already taken. Please choose another.");

    const credentials = passwordHash(password);
    tx.create(usernameRef, { memberId: memberSnap.id, createdAt: now });
    tx.set(memberRef, {
      username,
      usernameChangedAt: now,
      portalStatus: "ACTIVE",
      passwordSalt: credentials.salt,
      passwordHash: credentials.hash,
      portalActivatedAt: now,
      updatedAt: now,
    }, { merge: true });
    tx.update(tokenRef, { usedAt: now });
    return { memberId: memberSnap.id, name: String(member.name || ""), username };
  });
}

export async function loginMember(input: { username: string; password: string }) {
  const username = normalizeUsername(input.username);
  const db = getAdminDb();
  const userSnap = await db.collection("member_usernames").doc(username).get();
  if (!userSnap.exists) throw new Error("Incorrect UID/email or password.");
  const memberId = String(userSnap.data()?.memberId || "");
  const memberRef = db.collection("registered_members").doc(memberId);
  const memberSnap = await memberRef.get();
  if (!memberSnap.exists) throw new Error("Incorrect UID/email or password.");
  const member = memberSnap.data()!;
  if (member.status !== "ACTIVE" || member.portalStatus !== "ACTIVE" || !member.passwordSalt || !member.passwordHash) {
    throw new Error("This account is not active. Please contact the club admin.");
  }
  const candidate = passwordHash(input.password, String(member.passwordSalt)).hash;
  if (!equal(candidate, String(member.passwordHash))) throw new Error("Incorrect UID/email or password.");
  const expiresAt = Date.now() + SESSION_TTL_MS;
  const payload = Buffer.from(JSON.stringify({ memberId, expiresAt })).toString("base64url");
  return { token: payload + "." + sign(payload), expiresAt };
}

export function verifyMemberSession(token: string | undefined) {
  try {
    if (!token) return null;
    const [payload, signature] = token.split(".");
    if (!payload || !signature || !equal(signature, sign(payload))) return null;
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    if (typeof data.memberId !== "string" || Number(data.expiresAt) < Date.now()) return null;
    return { memberId: data.memberId as string, expiresAt: Number(data.expiresAt) };
  } catch {
    return null;
  }
}

export async function currentMember() {
  const store = await cookies();
  const session = verifyMemberSession(store.get(MEMBER_SESSION_COOKIE)?.value);
  if (!session) return null;
  const snap = await getAdminDb().collection("registered_members").doc(session.memberId).get();
  if (!snap.exists) return null;
  const member = snap.data()!;
  if (member.status !== "ACTIVE" || member.portalStatus !== "ACTIVE") return null;
  return {
    memberId: snap.id,
    name: member.name || "",
    email: member.email || null,
    phone: member.phone || null,
    batch: member.batch || null,
    username: member.username || "",
    portalActivatedAt: member.portalActivatedAt || null,
    status: member.status,
    portalStatus: member.portalStatus,
  };
}

export async function sendActivationEmail(member: { name: string; email: string; memberId: string }, activationUrl: string) {
  const apiToken = process.env.MAILERSEND_API_TOKEN?.trim();
  const fromEmail = process.env.MAILERSEND_FROM_EMAIL?.trim();
  const fromName = process.env.MAILERSEND_FROM_NAME?.trim() || "Willes Literary Club";
  if (!apiToken || !fromEmail) throw new Error("Email service is not configured. Check MailerSend environment variables in Vercel.");

  const safe = (v: string) => v.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  const name = safe(member.name);
  const id = safe(member.memberId);
  const url = safe(activationUrl);
  const text = `Willes Literary Club — Member Portal Activation\n\nDear ${member.name},\nYour member ID is ${member.memberId}. Activate your personal portal account using this secure link within 48 hours:\n${activationUrl}\n\nCreate your own memorable UID and password. Never share your password.\n\n— Willes Literary Club`;
  const html = `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><body style="margin:0;background:#f7f3ef;font-family:Arial,sans-serif;color:#292524;padding:28px 12px"><main style="max-width:600px;margin:auto;background:#fff;border:1px solid #eadfd8;border-radius:20px;overflow:hidden"><header style="padding:26px;text-align:center;border-bottom:1px solid #eee7e1"><img src="https://wlc.pro.bd/logo.png" alt="WLC" width="64" height="64" style="object-fit:contain"><p style="color:#7f1d1d;font-weight:bold;letter-spacing:2px">WILLES LITERARY CLUB</p></header><div style="height:5px;background:#991b1b"></div><section style="padding:30px"><p style="font-size:12px;color:#991b1b;font-weight:bold;letter-spacing:1px">MEMBER PORTAL</p><h1 style="font-size:28px">Welcome, ${name}!</h1><p style="line-height:1.8;color:#57534e">Your membership has been registered. Activate your personal WLC Member Portal to set a memorable UID and password.</p><div style="background:#faf8f6;border:1px solid #eadfd8;border-radius:14px;padding:18px"><div style="font-size:12px;color:#78716c">OFFICIAL MEMBER ID</div><strong style="display:block;margin-top:8px;font-size:26px;color:#7f1d1d">${id}</strong></div><p style="text-align:center;margin:28px 0"><a href="${url}" style="background:#7f1d1d;color:white;text-decoration:none;padding:14px 22px;border-radius:10px;font-weight:bold;display:inline-block">Activate Member Portal</a></p><p style="font-size:13px;color:#78716c;line-height:1.7">This one-time link expires in 48 hours. If you did not expect this email, you can ignore it. Never share your password.</p><p style="margin-top:28px">With literary regards,<br><strong style="color:#7f1d1d">Willes Literary Club</strong></p></section><footer style="background:#1c1917;color:#d6d3d1;text-align:center;padding:20px;font-size:12px">Willes Little Flower School & College, Dhaka<br><a href="https://wlc.pro.bd" style="color:#fca5a5">wlc.pro.bd</a></footer></main></body></html>`;
  const response = await fetch("https://api.mailersend.com/v1/email", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiToken}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: { email: fromEmail, name: fromName }, to: [{ email: member.email, name: member.name }], subject: "Willes Literary Club — Activate Your Member Portal", text, html }),
    cache: "no-store",
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(typeof body?.message === "string" ? body.message : `MailerSend returned HTTP ${response.status}`);
  }
  return response.headers.get("x-message-id") || "";
}


export async function changeMemberUsername(input: { memberId: string; currentPassword: string; nextUsername: string }) {
  const memberId = input.memberId.trim();
  const currentPassword = input.currentPassword;
  const nextUsername = normalizeUsername(input.nextUsername);
  if (!validateUsername(nextUsername)) {
    throw new Error("UID must be 4–20 characters using English letters, numbers, or underscores.");
  }
  if (typeof currentPassword !== "string" || currentPassword.length < 1) {
    throw new Error("Enter your current password to change your UID.");
  }

  const db = getAdminDb();
  const memberRef = db.collection("registered_members").doc(memberId);
  const memberSnap = await memberRef.get();
  if (!memberSnap.exists) throw new Error("Member account not found.");
  const member = memberSnap.data()!;
  if (member.status !== "ACTIVE" || member.portalStatus !== "ACTIVE") {
    throw new Error("This account is not active.");
  }
  if (!member.passwordSalt || !member.passwordHash) throw new Error("Current password is incorrect.");
  const candidate = passwordHash(currentPassword, String(member.passwordSalt)).hash;
  if (!equal(candidate, String(member.passwordHash))) throw new Error("Current password is incorrect.");

  const oldUsername = normalizeUsername(member.username);
  if (nextUsername === oldUsername) return { username: oldUsername };
  const newUsernameRef = db.collection("member_usernames").doc(nextUsername);
  const oldUsernameRef = db.collection("member_usernames").doc(oldUsername);
  const now = Date.now();

  await db.runTransaction(async (tx) => {
    const [freshMemberSnap, newUsernameSnap, oldUsernameSnap] = await Promise.all([
      tx.get(memberRef),
      tx.get(newUsernameRef),
      tx.get(oldUsernameRef),
    ]);
    if (!freshMemberSnap.exists) throw new Error("Member account not found.");
    const freshMember = freshMemberSnap.data()!;
    if (freshMember.status !== "ACTIVE" || freshMember.portalStatus !== "ACTIVE") throw new Error("This account is not active.");
    const freshCandidate = passwordHash(currentPassword, String(freshMember.passwordSalt || "")).hash;
    if (!freshMember.passwordSalt || !freshMember.passwordHash || !equal(freshCandidate, String(freshMember.passwordHash))) {
      throw new Error("Current password is incorrect.");
    }
    if (normalizeUsername(freshMember.username) !== oldUsername) throw new Error("Your UID changed in another session. Refresh and try again.");
    if (newUsernameSnap.exists) throw new Error("That UID is already taken. Please choose another.");
    if (!oldUsernameSnap.exists || String(oldUsernameSnap.data()?.memberId || "") !== memberId) {
      throw new Error("Your current UID record could not be verified. Contact the club admin.");
    }
    tx.create(newUsernameRef, { memberId, createdAt: now });
    tx.delete(oldUsernameRef);
    tx.set(memberRef, { username: nextUsername, usernameChangedAt: now, updatedAt: now }, { merge: true });
  });
  return { username: nextUsername };
}
