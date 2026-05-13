export const GOOGLE_CALENDAR_SCOPE = "https://www.googleapis.com/auth/calendar.events.readonly";
export const GOOGLE_CALENDAR_READONLY_FALLBACK_SCOPE =
  "https://www.googleapis.com/auth/calendar.readonly";

export const GOOGLE_OAUTH_CONFIG = {
  androidPackageName: "com.meetingrecall.app",
  iosBundleIdentifier: "com.meetingrecall.app",
  // Replace after creating OAuth clients in Google Cloud Console.
  androidClientId: "YOUR_ANDROID_OAUTH_CLIENT_ID",
  iosClientId: "YOUR_IOS_OAUTH_CLIENT_ID",
  // Required by Google Sign-In for some token/id-token flows. Do not use a client secret in the app.
  webClientId: "YOUR_WEB_OAUTH_CLIENT_ID"
} as const;
