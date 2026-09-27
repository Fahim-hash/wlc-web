import { getAdminDb } from "@/lib/firebase-admin";

export type PublishStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export const CMS_COLLECTIONS = [
  "events",
  "members",
  "committee",
  "achievements",
  "writing",
  "announcements",
  "albums",
  "media",
  "shobdo",
  "kothasokhi_knowledge",
] as const;

export type CmsCollection = typeof CMS_COLLECTIONS[number];

export function assertCollection(value: string): asserts value is CmsCollection {
  if (!CMS_COLLECTIONS.includes(value as CmsCollection)) {
    throw new Error("Unsupported CMS collection");
  }
}

export function cleanData(input: Record<string, unknown>) {
  const output: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(input)) {
    if (key.startsWith("_")) continue;
    if (value === undefined) continue;
    if (typeof value === "string") output[key] = value.trim();
    else output[key] = value;
  }
  return output;
}

export async function listPublished(collectionName: CmsCollection, limit = 100) {
  assertCollection(collectionName);
  const snapshot = await getAdminDb()
    .collection(collectionName)
    .where("status", "==", "PUBLISHED")
    .limit(Math.min(Math.max(limit, 1), 200))
    .get();

  return snapshot.docs
    .map((doc) => ({ id: doc.id, ...doc.data() }))
    .sort((a: any, b: any) => Number(a.sortOrder ?? 0) - Number(b.sortOrder ?? 0));
}

export async function listCollection(collectionName: CmsCollection, limit = 100) {
  assertCollection(collectionName);
  const snapshot = await getAdminDb()
    .collection(collectionName)
    .orderBy("updatedAt", "desc")
    .limit(Math.min(Math.max(limit, 1), 200))
    .get();

  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

export async function writeCmsRecord(
  collectionName: CmsCollection,
  data: Record<string, unknown>,
  id?: string,
  actor = "system"
) {
  assertCollection(collectionName);
  const db = getAdminDb();
  const now = Date.now();
  const ref = id ? db.collection(collectionName).doc(id) : db.collection(collectionName).doc();

  const payload = {
    ...cleanData(data),
    status: (data.status as PublishStatus) || "DRAFT",
    createdAt: data.createdAt || now,
    updatedAt: now,
    updatedBy: actor,
  };

  await ref.set(payload, { merge: true });

  await db.collection("audit_logs").add({
    action: id ? "UPDATE" : "CREATE",
    collection: collectionName,
    recordId: ref.id,
    actor,
    createdAt: now,
  });

  return { id: ref.id, ...payload };
}

export async function archiveCmsRecord(collectionName: CmsCollection, id: string, actor = "system") {
  assertCollection(collectionName);
  await getAdminDb().collection(collectionName).doc(id).set(
    { status: "ARCHIVED", updatedAt: Date.now(), updatedBy: actor },
    { merge: true }
  );
  await getAdminDb().collection("audit_logs").add({
    action: "ARCHIVE",
    collection: collectionName,
    recordId: id,
    actor,
    createdAt: Date.now(),
  });
}
