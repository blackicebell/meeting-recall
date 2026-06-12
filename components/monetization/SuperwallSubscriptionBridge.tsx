import { useEffect } from "react";
import type { SubscriptionStatus } from "expo-superwall";
import { useUser } from "expo-superwall";

import { MEETING_RECALL_PRO_ENTITLEMENT_ID } from "../../constants/revenueCat";
import {
  addRevenueCatCustomerInfoUpdateListener,
  getRevenueCatCustomerInfo,
  hasMeetingRecallPro,
  initializeRevenueCat,
  type RevenueCatCustomerInfo
} from "../../lib/revenueCat";
import { devLog } from "../../lib/devLog";

function getSuperwallStatus(customerInfo: RevenueCatCustomerInfo): SubscriptionStatus {
  if (!hasMeetingRecallPro(customerInfo)) {
    return { status: "INACTIVE" };
  }

  return {
    status: "ACTIVE",
    entitlements: [
      {
        id: MEETING_RECALL_PRO_ENTITLEMENT_ID,
        type: "SERVICE_LEVEL"
      }
    ]
  };
}

export function SuperwallSubscriptionBridge() {
  const { setSubscriptionStatus } = useUser();

  useEffect(() => {
    let isMounted = true;
    let removeListener: (() => void) | null = null;

    async function syncCustomerInfo(customerInfo: RevenueCatCustomerInfo) {
      const status = getSuperwallStatus(customerInfo);
      await setSubscriptionStatus(status);

      devLog.info("Superwall subscription status synced from RevenueCat.", {
        status: status.status,
        entitlement: MEETING_RECALL_PRO_ENTITLEMENT_ID
      });
    }

    async function bootstrap() {
      try {
        const isInitialized = await initializeRevenueCat();

        if (!isInitialized || !isMounted) {
          return;
        }

        removeListener = await addRevenueCatCustomerInfoUpdateListener((customerInfo) => {
          void syncCustomerInfo(customerInfo).catch((error) => {
            devLog.warn("Unable to sync RevenueCat update to Superwall.", error);
          });
        });

        const customerInfo = await getRevenueCatCustomerInfo();

        if (isMounted) {
          await syncCustomerInfo(customerInfo);
        }
      } catch (error) {
        devLog.warn("Unable to bridge RevenueCat subscription state to Superwall.", error);
      }
    }

    void bootstrap();

    return () => {
      isMounted = false;
      if (removeListener) {
        removeListener();
      }
    };
  }, [setSubscriptionStatus]);

  return null;
}
