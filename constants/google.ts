export const GOOGLE_CALENDAR_SCOPE = "https://www.googleapis.com/auth/calendar.events.readonly";
export const GOOGLE_CALENDAR_READONLY_FALLBACK_SCOPE =
  "https://www.googleapis.com/auth/calendar.readonly";

export const GOOGLE_OAUTH_CONFIG = {
  androidPackageName: "com.meetingrecall.app",
  iosBundleIdentifier: "com.meetingrecall.app",
  // OAuth client IDs are public identifiers, not private secrets.
  androidClientId: "246712386244-dv9r6taeedo7i6ji8kat6fembml23ssk.apps.googleusercontent.com",
  iosClientId: "246712386244-j4mt2dd5ja7n241gi09c3acoo62vshca.apps.googleusercontent.com",
  iosUrlScheme: "com.googleusercontent.apps.246712386244-j4mt2dd5ja7n241gi09c3acoo62vshca",
  // Web OAuth client ID used by GoogleSignin.configure(). Do not use a client secret in the app.
  webClientId: "246712386244-lrdeep9efn801ae52rh6cfqqeqk3ju5r.apps.googleusercontent.com"
} as const;

export const GOOGLE_SIGN_IN_SCOPES = [GOOGLE_CALENDAR_SCOPE] as const;
