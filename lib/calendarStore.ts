import * as FileSystem from "expo-file-system/legacy";

import type { CalendarConnection } from "../types/calendar";

const CALENDAR_CONNECTION_FILE = "meeting-recall-calendar-connection.json";

const emptyConnection: CalendarConnection = {
  connected: false,
  email: null,
  lastConnectedAt: null,
  provider: "google"
};

function getCalendarConnectionUri() {
  if (!FileSystem.documentDirectory) {
    throw new Error("App storage is unavailable.");
  }

  return `${FileSystem.documentDirectory}${CALENDAR_CONNECTION_FILE}`;
}

export async function loadCalendarConnection(): Promise<CalendarConnection> {
  const connectionUri = getCalendarConnectionUri();
  const fileInfo = await FileSystem.getInfoAsync(connectionUri);

  if (!fileInfo.exists) {
    return emptyConnection;
  }

  const rawConnection = await FileSystem.readAsStringAsync(connectionUri);
  const parsedConnection = JSON.parse(rawConnection) as Partial<CalendarConnection>;

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

  await FileSystem.writeAsStringAsync(
    getCalendarConnectionUri(),
    JSON.stringify(connection, null, 2)
  );

  return connection;
}

export async function clearCalendarConnection() {
  await FileSystem.deleteAsync(getCalendarConnectionUri(), { idempotent: true });
}
