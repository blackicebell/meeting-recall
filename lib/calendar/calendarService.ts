import { loadCalendarConnection } from "../calendarStore";
import { getGoogleCalendarAccessToken } from "../googleSignIn";
import type { CalendarProvider, MeetingEvent } from "../../types/calendar";

import {
  fetchGoogleTodayMeetingsWithDebug,
  GoogleCalendarFetchError,
  type GoogleCalendarFetchDebugInfo
} from "./providers/googleCalendarProvider";

export type CalendarServiceDebugInfo = {
  provider: CalendarProvider;
  result: GoogleCalendarFetchDebugInfo;
};

export type CalendarServiceResult = {
  connected: boolean;
  debugInfo: CalendarServiceDebugInfo[];
  meetings: MeetingEvent[];
};

export class CalendarServiceError extends Error {
  debugInfo?: CalendarServiceDebugInfo;
  httpStatus?: number | null;
  provider?: CalendarProvider;

  constructor(
    message: string,
    options?: {
      debugInfo?: CalendarServiceDebugInfo;
      httpStatus?: number | null;
      provider?: CalendarProvider;
    }
  ) {
    super(message);
    this.debugInfo = options?.debugInfo;
    this.httpStatus = options?.httpStatus;
    this.provider = options?.provider;
  }
}

export async function fetchTodayMeetingsFromConnectedProviders(): Promise<CalendarServiceResult> {
  const connection = await loadCalendarConnection();

  if (!connection.connected) {
    return {
      connected: false,
      debugInfo: [],
      meetings: []
    };
  }

  // Google is the only connected provider today. Outlook can slot in here later
  // without changing the Home screen contract.
  const googleAccessToken = await getGoogleCalendarAccessToken();

  if (!googleAccessToken) {
    return {
      connected: false,
      debugInfo: [],
      meetings: []
    };
  }

  try {
    const googleResult = await fetchGoogleTodayMeetingsWithDebug(googleAccessToken);
    const meetings = sortMeetingsByStartTime(googleResult.meetings);

    return {
      connected: true,
      debugInfo: [
        {
          provider: "google",
          result: googleResult.debugInfo
        }
      ],
      meetings
    };
  } catch (error) {
    if (error instanceof GoogleCalendarFetchError) {
      throw new CalendarServiceError(error.message, {
        debugInfo: {
          provider: "google",
          result: error.debugInfo
        },
        httpStatus: error.debugInfo.httpStatus,
        provider: "google"
      });
    }

    throw error;
  }
}

function sortMeetingsByStartTime(meetings: MeetingEvent[]) {
  return [...meetings].sort((first, second) => {
    if (!first.startTime && !second.startTime) {
      return 0;
    }

    if (!first.startTime) {
      return 1;
    }

    if (!second.startTime) {
      return -1;
    }

    return new Date(first.startTime).getTime() - new Date(second.startTime).getTime();
  });
}
