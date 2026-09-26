import crypto from "node:crypto";
import webpush from "web-push";
import { getAdminDb } from "@/lib/firebase-admin";

export type PushSubscriptionJSON = {
  endpoint: string;
  expirationTime?: number | null;
  keys: {
    p256dh: string;
    auth: string;
  };
};

function getVapidConfig() {
  const publicKey = process.env.VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  const subject = process.env.VAPID_SUBJECT || "mailto:wlfsc.sahittoclub@gmail.com";

  if (!publicKey || !privateKey) {
    throw new Error("VAPID_PUBLIC_KEY and VAPID_PRIVATE_KEY are required");
  }

  return { publicKey, privateKey, subject };
}

function configureWebPush() {
  const { publicKey, privateKey, subject } = getVapidConfig();
  webpush.setVapidDetails(subject, publicKey, privateKey);
}

export function getPublicVapidKey() {
  return getVapidConfig().publicKey;
}

export function subscriptionId(endpoint: string) {
  return crypto.createHash("sha256").update(endpoint).digest("hex");
}

export async function savePushSubscription(subscription: PushSubscriptionJSON) {
  if (!subscription.endpoint || !subscription.keys?.p256dh || !subscription.keys?.auth) {
    throw new Error("Invalid push subscription");
  }

  const id = subscriptionId(subscription.endpoint);
  await getAdminDb().collection("push_subscriptions").doc(id).set({
    endpoint: subscription.endpoint,
    expirationTime: subscription.expirationTime ?? null,
    keys: subscription.keys,
    updatedAt: Date.now(),
  }, { merge: true });

  return id;
}

export async function getPushSubscriberCount() {
  const snapshot = await getAdminDb().collection("push_subscriptions").get();
  return snapshot.size;
}

export async function sendGlobalPushNotification(
  title: string,
  body: string,
  url = "/"
) {
  configureWebPush();

  const snapshot = await getAdminDb().collection("push_subscriptions").get();
  const subscriptions = snapshot.docs.map((item) => ({
    id: item.id,
    data: item.data() as PushSubscriptionJSON,
  }));

  let sent = 0;
  let removed = 0;
  let failed = 0;

  const payload = JSON.stringify({
    title,
    body,
    url,
    icon: "/logo.png",
    badge: "/logo.png",
  });

  const batchSize = 20;

  for (let index = 0; index < subscriptions.length; index += batchSize) {
    const batch = subscriptions.slice(index, index + batchSize);

    await Promise.all(
      batch.map(async ({ id, data }) => {
        try {
          await webpush.sendNotification(data, payload);
          sent += 1;
        } catch (error: unknown) {
          const statusCode =
            typeof error === "object" && error !== null && "statusCode" in error
              ? Number((error as { statusCode?: number }).statusCode)
              : 0;

          if (statusCode === 404 || statusCode === 410) {
            await getAdminDb().collection("push_subscriptions").doc(id).delete();
            removed += 1;
          } else {
            failed += 1;
            console.error("Global push delivery failed:", error);
          }
        }
      })
    );
  }

  return {
    total: subscriptions.length,
    sent,
    removed,
    failed,
  };
}
