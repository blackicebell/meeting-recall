import type { CalendarConnection } from "../types/calendar";
import { deleteJson, loadJsonWithLegacyFallback, saveJson } from "./appStorage";

const CALENDAR_CONNECTION_FILE = "meeting-recall-calendar-connection.json";

const emptyConnection: CalendarConnection = {
  connected: false,
  email: null,
  lastConnectedAt: null,
  provider: "google"
};

export async function loadCalendarConnection(): Promise<CalendarConnection> {
  const parsedConnection = await loadJsonWithLegacyFallback<Partial<CalendarConnection>>(
    CALENDAR_CONNECTION_FILE,
    emptyConnection
  );

  return {
    connected: parsedConnection.connected === true,
    email: parsedConnection.email ?? null,
    lastConnectedAt: parsedConnection.lastConnectedAt ?? null,
    provider: parsedConnection.provider ?? "google"
  };
}

export async function saveCalendarConnection(email: string | null) {
  const connection: CalendarConnection = {
    connected: true,
    email,
    lastConnectedAt: new Date().toISOString(),
    provider: "google"
  };

  await saveJson(CALENDAR_CONNECTION_FILE, connection);

  return connection;
}

export async function clearCalendarConnection() {
  await deleteJson(CALENDAR_CONNECTION_FILE);
}
