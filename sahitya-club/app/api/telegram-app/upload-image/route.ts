import crypto from "node:crypto";
import { getApps } from "firebase-admin/app";
import { getStorage } from "firebase-admin/storage";
import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase-admin";
import { getVerifiedTelegramMiniAppAdmin } from "@/lib/telegram-mini-app-auth-v2";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const admin = getVerifiedTelegramMiniAppAdmin(request);
  if (!admin) return NextResponse.json({ ok: false, error: "Telegram admin verification failed." }, { status: 401 });

  try {
    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File)) return NextResponse.json({ ok: false, error: "Choose an image first." }, { status: 400 });
    if (!file.type.startsWith("image/") || !["image/jpeg", "image/png", "image/webp", "image/gif"].includes(file.type)) {
      return NextResponse.json({ ok: false, error: "Use a JPG, PNG, WEBP, or GIF image." }, { status: 400 });
    }
    if (file.size <= 0 || file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ ok: false, error: "Image must be smaller than 5 MB." }, { status: 400 });
    }

    // Initialize the existing Firebase Admin app through the shared database helper.
    getAdminDb();
    const app = getApps()[0];
    const explicitBucket = process.env.FIREBASE_STORAGE_BUCKET?.trim() || String(app?.options.storageBucket || "");
    const projectId = String(app?.options.projectId || "");
    const bucketNames = explicitBucket
      ? [explicitBucket]
      : [projectId ? `${projectId}.firebasestorage.app` : "", projectId ? `${projectId}.appspot.com` : ""].filter(Boolean);
    if (!bucketNames.length) {
      return NextResponse.json({ ok: false, error: "Firebase Storage bucket is not configured. Set FIREBASE_STORAGE_BUCKET in Vercel to your Firebase Storage bucket name." }, { status: 503 });
    }

    const extension = file.type === "image/jpeg" ? "jpg" : file.type.split("/")[1];
    const objectPath = `wlc-control-hub/${new Date().toISOString().slice(0, 10)}/${crypto.randomUUID()}.${extension}`;
    const token = crypto.randomUUID();
    const bytes = Buffer.from(await file.arrayBuffer());
    let bucketName = bucketNames[0];
    let saved = false;
    let lastError: unknown;
    for (const candidate of bucketNames) {
      try {
        const bucket = getStorage(app).bucket(candidate);
        await bucket.file(objectPath).save(bytes, {
          resumable: false,
          metadata: {
            contentType: file.type,
            cacheControl: "public, max-age=31536000, immutable",
            metadata: { firebaseStorageDownloadTokens: token, uploadedBy: String(admin.id), originalName: file.name.slice(0, 180) },
          },
        });
        bucketName = candidate;
        saved = true;
        break;
      } catch (e) {
        lastError = e;
        if (explicitBucket) break;
      }
    }
    if (!saved) throw new Error(`Could not upload to Firebase Storage bucket ${bucketName}. Set FIREBASE_STORAGE_BUCKET to the exact bucket name in Vercel. ${lastError instanceof Error ? lastError.message : ""}`);

    await getAdminDb().collection("audit_logs").add({ action: "MINI_APP_IMAGE_UPLOAD", actor: "telegram:" + admin.id, objectPath, bucket: bucketName, size: file.size, createdAt: Date.now() });
    const encodedPath = encodeURIComponent(objectPath);
    const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/${encodedPath}?alt=media&token=${token}`;
    return NextResponse.json({ ok: true, imageUrl, name: file.name, size: file.size });
  } catch (e) {
    console.error("Telegram Mini App image upload failed:", e);
    return NextResponse.json({ ok: false, error: e instanceof Error ? e.message : "Image upload failed." }, { status: 500 });
  }
}
