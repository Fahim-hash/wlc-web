import crypto from "node:crypto";
import { getAdminDb } from "@/lib/firebase-admin";
import type { RegisteredMember } from "@/lib/member-management";

type SyncResult = { status: "synced" | "pending"; message?: string };

function base64Url(value: string | Buffer) {
  return Buffer.from(value).toString("base64url");
}

function getServiceAccount() {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON?.trim();
  if (!raw) throw new Error("Firebase service account is not configured.");
  let parsed: Record<string, unknown>;
  try {
    const decoded = JSON.parse(raw);
    parsed = typeof decoded === "string" ? JSON.parse(decoded) : decoded;
  } catch {
    try {
      parsed = JSON.parse(Buffer.from(raw, "base64").toString("utf8"));
    } catch {
      throw new Error("Firebase service account configuration is invalid.");
    }
  }
  const email = typeof parsed.client_email === "string" ? parsed.client_email : "";
  const privateKey = typeof parsed.private_key === "string" ? parsed.private_key.replace(/\\n/g, "\n") : "";
  if (!email || !privateKey) throw new Error("Firebase service account is missing required fields.");
  return { email, privateKey };
}

async function getAccessToken() {
  const account = getServiceAccount();
  const now = Math.floor(Date.now() / 1000);
  const header = base64Url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claim = base64Url(JSON.stringify({
    iss: account.email,
    scope: "https://www.googleapis.com/auth/spreadsheets",
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600,
  }));
  const unsigned = `${header}.${claim}`;
  const signature = crypto.sign("RSA-SHA256", Buffer.from(unsigned), account.privateKey);
  const assertion = `${unsigned}.${base64Url(signature)}`;
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion,
    }),
    cache: "no-store",
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok || typeof payload.access_token !== "string") {
    throw new Error("Google Sheets authorization failed. Check the service account and Google Sheets API.");
  }
  return payload.access_token as string;
}

function config() {
  const spreadsheetId = process.env.WLC_MEMBER_SHEET_ID?.trim();
  const range = process.env.WLC_MEMBER_SHEET_RANGE?.trim() || "Members!A:D";
  if (!spreadsheetId) return null;
  return { spreadsheetId, range };
}

async function sheetsRequest(url: string, token: string, init?: RequestInit) {
  const response = await fetch(url, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
    cache: "no-store",
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(
      response.status === 403
        ? "Google Sheets access denied. Enable the Sheets API and share the spreadsheet with the service-account email as Editor."
        : `Google Sheets request failed (HTTP ${response.status}).`
    );
  }
  return payload;
}

/** Idempotently mirrors the basic member fields to a private Google Sheet. */
export async function syncRegisteredMemberToGoogleSheet(member: Pick<RegisteredMember, "memberId" | "name" | "phone" | "email">): Promise<SyncResult> {
  const sheet = config();
  const memberRef = getAdminDb().collection("registered_members").doc(member.memberId);
  if (!sheet) {
    await memberRef.set({ spreadsheetSyncStatus: "PENDING", spreadsheetSyncUpdatedAt: Date.now() }, { merge: true });
    return { status: "pending", message: "Add WLC_MEMBER_SHEET_ID in Vercel to enable Google Sheets sync." };
  }

  try {
    const token = await getAccessToken();
    const base = `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(sheet.spreadsheetId)}`;
    const readRange = sheet.range.includes("!") ? sheet.range.slice(0, sheet.range.lastIndexOf("!") + 1) + "A:A" : "Members!A:A";
    const read = await sheetsRequest(`${base}/values/${encodeURIComponent(readRange)}`, token) as { values?: unknown[][] };
    const rows = read.values || [];
    const alreadyPresent = rows.some((row) => String(row?.[0] ?? "").trim() === member.memberId);

    if (!alreadyPresent) {
      const appendRange = sheet.range.includes("!") ? sheet.range : `Members!A:D`;
      await sheetsRequest(
        `${base}/values/${encodeURIComponent(appendRange)}:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`,
        token,
        {
          method: "POST",
          body: JSON.stringify({
            majorDimension: "ROWS",
            values: [[member.memberId, member.name, member.phone || "", member.email || ""]],
          }),
        }
      );
    }

    await memberRef.set({
      spreadsheetSyncStatus: "SYNCED",
      spreadsheetSyncUpdatedAt: Date.now(),
      spreadsheetSyncError: null,
    }, { merge: true });
    return { status: "synced" };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Google Sheets sync failed.";
    await memberRef.set({
      spreadsheetSyncStatus: "PENDING",
      spreadsheetSyncUpdatedAt: Date.now(),
      spreadsheetSyncError: message.slice(0, 300),
    }, { merge: true });
    return { status: "pending", message };
  }
}
