import { useCallback, useEffect, useState } from "react";

import {
  addRevenueCatCustomerInfoUpdateListener,
  getRevenueCatConfigurationState,
  getRevenueCatCustomerInfo,
  hasMeetingRecallPro,
  initializeRevenueCat,
  presentMeetingRecallProPaywall,
  presentRevenueCatCustomerCenter,
  restoreRevenueCatPurchases,
  type RevenueCatCustomerInfo
} from "../lib/revenueCat";

type SubscriptionState = {
  customerInfo: RevenueCatCustomerInfo | null;
  error: string | null;
  isConfigured: boolean;
  isLoading: boolean;
  isPro: boolean;
  lastUpdatedAt: string | null;
};

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "object" && error !== null && "message" in error) {
    return String((error as { message?: unknown }).message);
  }

  return "Unable to update subscription status.";
}

export function useRevenueCatSubscription() {
  const [state, setState] = useState<SubscriptionState>({
    customerInfo: null,
    error: null,
    isConfigured: getRevenueCatConfigurationState().configureSucceeded,
    isLoading: true,
    isPro: false,
    lastUpdatedAt: null
  });

  const applyCustomerInfo = useCallback((customerInfo: RevenueCatCustomerInfo) => {
    setState((current) => ({
      ...current,
      customerInfo,
      error: null,
      isConfigured: true,
      isLoading: false,
      isPro: hasMeetingRecallPro(customerInfo),
      lastUpdatedAt: new Date().toISOString()
    }));
  }, []);

  const refresh = useCallback(async () => {
    try {
      setState((current) => ({ ...current, error: null, isLoading: true }));
      const customerInfo = await getRevenueCatCustomerInfo();
      applyCustomerInfo(customerInfo);
      return customerInfo;
    } catch (error) {
      setState((current) => ({
        ...current,
        error: getErrorMessage(error),
        isLoading: false
      }));
      return null;
    }
  }, [applyCustomerInfo]);

  useEffect(() => {
    let isMounted = true;
    let removeListener: (() => void) | null = null;

    const listener = (customerInfo: RevenueCatCustomerInfo) => {
      if (isMounted) {
        applyCustomerInfo(customerInfo);
      }
    };

    async function bootstrap() {
      try {
        const isInitialized = await initializeRevenueCat();
        if (!isInitialized) {
          throw new Error("RevenueCat is not configured.");
        }

        removeListener = await addRevenueCatCustomerInfoUpdateListener(listener);

        const customerInfo = await getRevenueCatCustomerInfo();

        if (isMounted) {
          applyCustomerInfo(customerInfo);
        }
      } catch (error) {
        if (isMounted) {
          setState((current) => ({
            ...current,
            error: getErrorMessage(error),
            isConfigured: false,
            isLoading: false
          }));
        }
      }
    }

    void bootstrap();

    return () => {
      isMounted = false;
      if (removeListener) {
        removeListener();
      }
    };
  }, [applyCustomerInfo]);

  const presentPaywall = useCallback(async () => {
    try {
      setState((current) => ({ ...current, error: null, isLoading: true }));
      const paywallResult = await presentMeetingRecallProPaywall();
      const customerInfo = await getRevenueCatCustomerInfo();
      applyCustomerInfo(customerInfo);
      return paywallResult;
    } catch (error) {
      setState((current) => ({
        ...current,
        error: getErrorMessage(error),
        isLoading: false
      }));
      return null;
    }
  }, [applyCustomerInfo]);

  const restore = useCallback(async () => {
    try {
      setState((current) => ({ ...current, error: null, isLoading: true }));
      const customerInfo = await restoreRevenueCatPurchases();
      applyCustomerInfo(customerInfo);
      return customerInfo;
    } catch (error) {
      setState((current) => ({
        ...current,
        error: getErrorMessage(error),
        isLoading: false
      }));
      return null;
    }
  }, [applyCustomerInfo]);

  const openCustomerCenter = useCallback(async () => {
    try {
      setState((current) => ({ ...current, error: null }));
      await presentRevenueCatCustomerCenter();
      await refresh();
      return true;
    } catch (error) {
      setState((current) => ({
        ...current,
        error: getErrorMessage(error),
        isLoading: false
      }));
      return false;
    }
  }, [refresh]);

  return {
    ...state,
    openCustomerCenter,
    presentPaywall,
    refresh,
    restore
  };
}
