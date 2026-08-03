import { api } from "@/lib/api";
import type { Event } from "@/lib/events";

export type EventInput = {
  title: string;
  /** ISO timestamp. */
  date: string;
  location?: string | null;
  description?: string | null;
  imageUrl?: string | null;
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
