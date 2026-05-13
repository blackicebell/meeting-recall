export type CalendarProvider = "google" | "outlook";

export type CalendarConnection = {
  connected: boolean;
  email: string | null;
  lastConnectedAt: string | null;
  provider: CalendarProvider;
};

export type MeetingEvent = {
  endTime: string | null;
  id: string;
  provider: CalendarProvider;
  raw?: unknown;
  startTime: string | null;
  title: string;
};

export type TodayMeeting = MeetingEvent;
