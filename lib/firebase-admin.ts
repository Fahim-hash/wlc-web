import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";

let adminDb: Firestore | null = null;

function parseServiceAccount(raw: string) {
  const candidates = [raw.trim()];

  // Vercel/env managers may store the whole JSON object as a quoted JSON string.
  try {
    const decoded = JSON.parse(raw);
    if (typeof decoded === "string") candidates.push(decoded.trim());
    else if (decoded && typeof decoded === "object") return decoded as Record<string, unknown>;
  } catch {
    // Try the other supported representations below.
  }

  // Also support base64-encoded service-account JSON.
  try {
    const decoded = Buffer.from(raw.trim(), "base64").toString("utf8").trim();
    if (decoded.startsWith("{")) candidates.push(decoded);
  } catch {
    // Ignore and report a useful configuration error below.
  }

  for (const candidate of candidates) {
    try {
      const parsed = JSON.parse(candidate);
      if (parsed && typeof parsed === "object") return parsed as Record<string, unknown>;
    } catch {
      // Continue to the next representation.
    }
  }

  throw new Error(
    "FIREBASE_SERVICE_ACCOUNT_JSON is not valid JSON. Paste the complete Firebase service-account JSON, or its base64-encoded form, into the Vercel environment variable."
  );
}

function getServiceAccount() {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON?.trim();

  if (!raw) {
    throw new Error("FIREBASE_SERVICE_ACCOUNT_JSON is not configured");
  }

  const parsed = parseServiceAccount(raw);
  const projectId = typeof parsed.project_id === "string" ? parsed.project_id : "";
  const clientEmail = typeof parsed.client_email === "string" ? parsed.client_email : "";
  const privateKey = typeof parsed.private_key === "string" ? parsed.private_key : "";

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error("FIREBASE_SERVICE_ACCOUNT_JSON is missing project_id, client_email, or private_key");
  }

  return {
    projectId,
    clientEmail,
    privateKey: privateKey.replace(/\\n/g, "\n"),
  };
}

export function getAdminDb() {
  if (adminDb) return adminDb;

  const app =
    getApps().length > 0
      ? getApps()[0]
      : initializeApp({ credential: cert(getServiceAccount()) });

  adminDb = getFirestore(app);
  return adminDb;
}
