import type { ConfigureParams } from "@react-native-google-signin/google-signin";
import { Platform } from "react-native";

import { GOOGLE_OAUTH_CONFIG, GOOGLE_SIGN_IN_SCOPES } from "../constants/google";

import { devLog } from "./devLog";

let initializationPromise: Promise<void> | null = null;

function configuredValue(value: string) {
  return value.startsWith("YOUR_") ? undefined : value;
}

function buildGoogleSignInConfig() {
  const iosClientId = configuredValue(GOOGLE_OAUTH_CONFIG.iosClientId);
  const webClientId = configuredValue(GOOGLE_OAUTH_CONFIG.webClientId);

  return {
    ...(iosClientId ? { iosClientId } : {}),
    ...(webClientId ? { webClientId } : { webClientId: GOOGLE_OAUTH_CONFIG.webClientId }),
    scopes: [...GOOGLE_SIGN_IN_SCOPES]
  } satisfies ConfigureParams;
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

export async function initializeGoogleSignIn() {
  if (initializationPromise) {
    return initializationPromise;
  }

  initializationPromise = (async () => {
    try {
      const { GoogleSignin } = await import("@react-native-google-signin/google-signin");

      GoogleSignin.configure(buildGoogleSignInConfig());
      devLog.info("Google Sign-In configured", {
        scopes: [...GOOGLE_SIGN_IN_SCOPES],
        webClientIdPresent: Boolean(configuredValue(GOOGLE_OAUTH_CONFIG.webClientId))
      });
    } catch (error) {
      initializationPromise = null;
      devLog.warn("Google Sign-In configuration failed", getErrorMessage(error));
      throw new Error(getErrorMessage(error) || "Unable to configure Google Sign-In.");
    }
  })();

  return initializationPromise;
}

export async function connectGoogleCalendarAccount() {
  await initializeGoogleSignIn();

  try {
    const { GoogleSignin } = await import("@react-native-google-signin/google-signin");

    if (Platform.OS === "android") {
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true
      });
    }

    const signInResponse = await GoogleSignin.signIn();

    if (signInResponse.type !== "success") {
      throw new Error(`Sign-in ${signInResponse.type}.`);
    }

    const tokens = await GoogleSignin.getTokens();

    if (!tokens.accessToken) {
      throw new Error("Unable to access Google Calendar.");
    }

    return {
      accessToken: tokens.accessToken,
      email: signInResponse.data.user.email
    };
  } catch (error) {
    devLog.warn("Google Calendar connect failed", getErrorMessage(error));
    throw new Error(getErrorMessage(error) || "Unable to connect Google Calendar.");
  }
}

export async function getGoogleCalendarAccessToken() {
  await initializeGoogleSignIn();

  const { GoogleSignin } = await import("@react-native-google-signin/google-signin");
  const silentResponse = await GoogleSignin.signInSilently();

  if (silentResponse.type !== "success") {
    return null;
  }

  const tokens = await GoogleSignin.getTokens();

  return tokens.accessToken || null;
}

export async function disconnectGoogleCalendarAccount() {
  const { GoogleSignin } = await import("@react-native-google-signin/google-signin");

  try {
    await GoogleSignin.signOut();
  } catch {
    // Local disconnect should still continue if the native account is already gone.
  }
}
