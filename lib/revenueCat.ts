import { Platform } from "react-native";
import type {
  CustomerInfo,
  CustomerInfoUpdateListener,
  PurchasesOfferings
} from "react-native-purchases";

import {
  MEETING_RECALL_PRO_ENTITLEMENT_ALIASES,
  MEETING_RECALL_PRO_ENTITLEMENT_ID,
  REVENUECAT_ANDROID_API_KEY,
  REVENUECAT_IOS_API_KEY,
  REVENUECAT_OFFERING_ID,
  REVENUECAT_PRODUCTS
} from "../constants/revenueCat";
import { devLog } from "./devLog";

export type RevenueCatCustomerInfo = CustomerInfo;
export type RevenueCatOfferings = PurchasesOfferings;

let configureStarted = false;
let configureSucceeded = false;
let configureError: string | null = null;
let purchasesModule: typeof import("react-native-purchases") | null = null;

function isPurchasesPlatform() {
  return Platform.OS === "ios" || Platform.OS === "android";
}

function getRevenueCatApiKey() {
  if (Platform.OS === "android") {
    return REVENUECAT_ANDROID_API_KEY;
  }

  if (Platform.OS === "ios") {
    return REVENUECAT_IOS_API_KEY;
  }

  return null;
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "object" && error !== null && "message" in error) {
    return String((error as { message?: unknown }).message);
  }

  return "RevenueCat request failed.";
}

async function getPurchasesModule() {
  if (purchasesModule) {
    return purchasesModule;
  }

  purchasesModule = await import("react-native-purchases");
  return purchasesModule;
}

export async function initializeRevenueCat() {
  if (!isPurchasesPlatform()) {
    return false;
  }

  if (configureSucceeded) {
    return true;
  }

  try {
    configureStarted = true;
    configureError = null;
    const apiKey = getRevenueCatApiKey();

    if (!apiKey) {
      throw new Error("RevenueCat is not supported on this platform.");
    }

    const { default: Purchases, LOG_LEVEL } = await getPurchasesModule();
    await Purchases.setLogLevel(__DEV__ ? LOG_LEVEL.VERBOSE : LOG_LEVEL.WARN);
    Purchases.configure({
      apiKey,
      diagnosticsEnabled: __DEV__
    });

    configureSucceeded = true;
    devLog.info("RevenueCat configured", {
      platform: Platform.OS,
      apiKeyPrefix: apiKey.slice(0, 4),
      entitlement: MEETING_RECALL_PRO_ENTITLEMENT_ID,
      products: REVENUECAT_PRODUCTS
    });
    return true;
  } catch (error) {
    configureSucceeded = false;
    configureError = getErrorMessage(error);
    devLog.warn("Unable to configure RevenueCat.", error);
    return false;
  }
}

export function getRevenueCatConfigurationState() {
  return {
    configureStarted,
    configureSucceeded,
    configureError,
    platform: Platform.OS,
    apiKeyPrefix: getRevenueCatApiKey()?.slice(0, 4) ?? null,
    entitlementId: MEETING_RECALL_PRO_ENTITLEMENT_ID,
    offeringId: REVENUECAT_OFFERING_ID,
    products: REVENUECAT_PRODUCTS
  };
}

export function hasMeetingRecallPro(customerInfo: RevenueCatCustomerInfo | null) {
  if (!customerInfo) {
    return false;
  }

  return MEETING_RECALL_PRO_ENTITLEMENT_ALIASES.some(
    (entitlementId) => customerInfo.entitlements.active[entitlementId] !== undefined
  );
}

export async function getRevenueCatCustomerInfo() {
  const isInitialized = await initializeRevenueCat();
  if (!isInitialized) {
    throw new Error(configureError ?? "RevenueCat is not configured.");
  }
  const { default: Purchases } = await getPurchasesModule();
  return Purchases.getCustomerInfo();
}

export async function getRevenueCatOfferings() {
  const isInitialized = await initializeRevenueCat();
  if (!isInitialized) {
    throw new Error(configureError ?? "RevenueCat is not configured.");
  }
  const { default: Purchases } = await getPurchasesModule();
  return Purchases.getOfferings();
}

export async function restoreRevenueCatPurchases() {
  const isInitialized = await initializeRevenueCat();
  if (!isInitialized) {
    throw new Error(configureError ?? "RevenueCat is not configured.");
  }
  const { default: Purchases } = await getPurchasesModule();
  const customerInfo = await Purchases.restorePurchases();

  devLog.info("RevenueCat purchases restored", {
    isPro: hasMeetingRecallPro(customerInfo)
  });

  return customerInfo;
}

export async function presentMeetingRecallProPaywall() {
  const isInitialized = await initializeRevenueCat();
  if (!isInitialized) {
    throw new Error(configureError ?? "RevenueCat is not configured.");
  }

  const RevenueCatUI = (await import("react-native-purchases-ui")).default;

  const result = await RevenueCatUI.presentPaywallIfNeeded({
    requiredEntitlementIdentifier: MEETING_RECALL_PRO_ENTITLEMENT_ID
  });

  devLog.info("RevenueCat paywall result", { result });

  return {
    result,
    purchasedOrRestored: result === "PURCHASED" || result === "RESTORED"
  };
}

export async function presentRevenueCatCustomerCenter() {
  const isInitialized = await initializeRevenueCat();
  if (!isInitialized) {
    throw new Error(configureError ?? "RevenueCat is not configured.");
  }

  const RevenueCatUI = (await import("react-native-purchases-ui")).default;
  await RevenueCatUI.presentCustomerCenter();
}

export async function addRevenueCatCustomerInfoUpdateListener(
  listener: CustomerInfoUpdateListener
) {
  const isInitialized = await initializeRevenueCat();
  if (!isInitialized) {
    throw new Error(configureError ?? "RevenueCat is not configured.");
  }

  const { default: Purchases } = await getPurchasesModule();
  Purchases.addCustomerInfoUpdateListener(listener);

  return () => {
    Purchases.removeCustomerInfoUpdateListener(listener);
  };
}

export async function getRevenueCatProductSummary() {
  const offerings = await getRevenueCatOfferings();
  const current = offerings.current;

  return {
    currentOfferingId: current?.identifier ?? null,
    availablePackages:
      current?.availablePackages.map((availablePackage) => ({
        identifier: availablePackage.identifier,
        packageType: availablePackage.packageType,
        productIdentifier: availablePackage.product.identifier,
        title: availablePackage.product.title,
        priceString: availablePackage.product.priceString
      })) ?? []
  };
}
