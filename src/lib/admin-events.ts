import { api } from "@/lib/api";
import type { Event } from "@/lib/events";

export type EventInput = {
  title: string;
  /** ISO timestamp. */
  date: string;
  location?: string | null;
  description?: string | null;
  imageUrl?: string | null;
  imagePublicId?: string | null;
  published?: boolean;
};

/** Every event including drafts. Admin only — the API enforces the role. */
export async function listAllEvents(): Promise<Event[]> {
  const { data } = await api.get<{ events: Event[] }>("/events/all");
  return data.events;
}

export async function createEvent(input: EventInput): Promise<Event> {
  const { data } = await api.post<{ event: Event }>("/events", input);
  return data.event;
}

export async function updateEvent(
  id: string,
  input: Partial<EventInput>,
): Promise<Event> {
  const { data } = await api.patch<{ event: Event }>(`/events/${id}`, input);
  return data.event;
}

export async function deleteEvent(id: string): Promise<void> {
  await api.delete(`/events/${id}`);
}

/**
 * Sends a photo to Cloudinary before the event itself is saved, so a new event
 * can be created with a picture already attached.
 */
export async function uploadEventImage(
  file: File,
): Promise<{ imageUrl: string; imagePublicId: string }> {
  const body = new FormData();
  body.append("image", file);
  const { data } = await api.post<{ imageUrl: string; imagePublicId: string }>(
    "/events/image",
    body,
    // Let the browser set the multipart boundary itself.
    { headers: { "Content-Type": undefined } },
  );
  return data;
}

/**
 * Deletes a photo that was uploaded but never saved onto an event. The API
 * refuses to touch an image any event still references.
 */
export async function discardEventImage(publicId: string): Promise<void> {
  await api.delete("/events/image", { data: { publicId } });
}
