import { createHash, randomBytes, randomUUID } from "node:crypto";
import { getAdminDb } from "@/lib/firebase-admin";

export type TicketingEventStatus = "DRAFT" | "PUBLISHED" | "CANCELLED";
export type TicketingEventVisibility = "PUBLIC" | "INTERNAL";

export type TicketingEvent = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  description: string;
  bannerUrl: string;
  venue: string;
  startAt: string;
  endAt: string | null;
  capacity: number;
  ticketPrice: number;
  currency: "BDT";
  status: TicketingEventStatus;
  visibility?: TicketingEventVisibility;
  reservedCount: number;
  createdAt: number;
  updatedAt: number;
  createdBy: string;
};

export function slugifyEventTitle(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 64);
}

export function createTicketToken() {
  return randomBytes(32).toString("base64url");
}

export function hashTicketToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export function createTicketId() {
  return `WLC-TKT-${randomUUID().replace(/-/g, "").slice(0, 12).toUpperCase()}`;
}

export function publicEvent(event: Record<string, unknown>) {
  return {
    id: event.id,
    slug: event.slug,
    title: event.title,
    summary: event.summary,
    description: event.description,
    bannerUrl: event.bannerUrl ?? "",
    venue: event.venue,
    startAt: event.startAt,
    endAt: event.endAt ?? null,
    capacity: event.capacity,
    ticketPrice: event.ticketPrice,
    currency: event.currency ?? "BDT",
    status: event.status,
    visibility: event.visibility === "INTERNAL" ? "INTERNAL" : "PUBLIC",
    reservedCount: event.reservedCount ?? 0,
    availableCount: Math.max(0, Number(event.capacity || 0) - Number(event.reservedCount || 0)),
  };
}

export function getTicketingEventsCollection() {
  return getAdminDb().collection("ticketing_events");
}

export function getTicketingBookingsCollection() {
  return getAdminDb().collection("ticketing_bookings");
}
