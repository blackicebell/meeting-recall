import { GOOGLE_CALENDAR_SCOPE } from "../../../constants/google";
import type { MeetingEvent } from "../../../types/calendar";

const GOOGLE_CALENDAR_EVENTS_URL =
  "https://www.googleapis.com/calendar/v3/calendars/primary/events";

type GoogleCalendarDateTime = {
  date?: string;
  dateTime?: string;
};

type GoogleCalendarEvent = {
  end?: GoogleCalendarDateTime;
  id?: string;
  start?: GoogleCalendarDateTime;
  summary?: string;
};

type GoogleCalendarEventsResponse = {
  error?: {
    code?: number;
    message?: string;
    status?: string;
  };
  items?: GoogleCalendarEvent[];
};

export type GoogleCalendarFetchDebugInfo = {
  accessTokenPresent: boolean;
  eventCount: number | null;
  httpStatus: number | null;
  parsedErrorMessage: string | null;
  rawErrorResponseBody: string | null;
  requestUrl: string;
  scope: string;
  timeMax: string;
  timeMin: string;
};

export class GoogleCalendarFetchError extends Error {
  debugInfo: GoogleCalendarFetchDebugInfo;

  constructor(message: string, debugInfo: GoogleCalendarFetchDebugInfo) {
    super(message);
    this.debugInfo = debugInfo;
  }
}

function getTodayBounds() {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

  return {
    timeMax: endOfToday.toISOString(),
    timeMin: startOfToday.toISOString()
  };
}

function createRequestUrl(timeMin: string, timeMax: string) {
  const url = new URL(GOOGLE_CALENDAR_EVENTS_URL);

  url.searchParams.set("timeMin", timeMin);
  url.searchParams.set("timeMax", timeMax);
  url.searchParams.set("singleEvents", "true");
  url.searchParams.set("orderBy", "startTime");
  url.searchParams.set("maxResults", "20");

  return url;
}

function getEventTime(dateTime?: GoogleCalendarDateTime) {
  return dateTime?.dateTime ?? dateTime?.date ?? null;
}

function normalizeGoogleEvent(event: GoogleCalendarEvent): MeetingEvent | null {
  if (!event.id) {
    return null;
  }

  return {
    endTime: getEventTime(event.end),
    id: event.id,
    provider: "google",
    raw: event,
    startTime: getEventTime(event.start),
    title: event.summary?.trim() || "Untitled meeting"
  };
}

export async function fetchGoogleTodayMeetings(accessToken: string): Promise<MeetingEvent[]> {
  const result = await fetchGoogleTodayMeetingsWithDebug(accessToken);

  return result.meetings;
}

export async function fetchGoogleTodayMeetingsWithDebug(accessToken: string): Promise<{
  debugInfo: GoogleCalendarFetchDebugInfo;
  meetings: MeetingEvent[];
}> {
  const { timeMax, timeMin } = getTodayBounds();
  const url = createRequestUrl(timeMin, timeMax);
  const baseDebugInfo: GoogleCalendarFetchDebugInfo = {
    accessTokenPresent: Boolean(accessToken),
    eventCount: null,
    httpStatus: null,
    parsedErrorMessage: null,
    rawErrorResponseBody: null,
    requestUrl: url.toString(),
    scope: GOOGLE_CALENDAR_SCOPE,
    timeMax,
    timeMin
  };

  const response = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });
  const responseBody = await response.text();
  let payload: GoogleCalendarEventsResponse = {};

  try {
    payload = responseBody ? JSON.parse(responseBody) as GoogleCalendarEventsResponse : {};
  } catch {
    payload = {};
  }

  if (!response.ok) {
    const parsedErrorMessage = getCalendarErrorMessage(response.status, payload);
    const debugInfo: GoogleCalendarFetchDebugInfo = {
      ...baseDebugInfo,
      httpStatus: response.status,
      parsedErrorMessage,
      rawErrorResponseBody: responseBody
    };

    throw new GoogleCalendarFetchError(parsedErrorMessage, debugInfo);
  }

  const meetings = (payload.items ?? [])
    .map(normalizeGoogleEvent)
    .filter((event): event is MeetingEvent => event !== null);

  return {
    debugInfo: {
      ...baseDebugInfo,
      eventCount: meetings.length,
      httpStatus: response.status
    },
    meetings
  };
}

function getCalendarErrorMessage(
  httpStatus: number,
  payload: GoogleCalendarEventsResponse
) {
  const googleMessage = payload.error?.message;
  const googleStatus = payload.error?.status;

  if (httpStatus === 401) {
    return googleMessage
      ? `Token invalid or expired. ${googleMessage}`
      : "Token invalid or expired. Reconnect Google Calendar.";
  }

  if (httpStatus === 403) {
    const message = googleMessage ?? googleStatus ?? "";

    if (message.toLowerCase().includes("disabled")) {
      return "Google Calendar API may not be enabled for this Google Cloud project.";
    }

    if (
      message.toLowerCase().includes("insufficient") ||
      message.toLowerCase().includes("scope") ||
      googleStatus === "PERMISSION_DENIED"
    ) {
      return `Calendar access denied or insufficient scope. ${message}`.trim();
    }

    return `Calendar request forbidden. ${message}`.trim();
  }

  return googleMessage ?? "Unable to load calendar events.";
}
