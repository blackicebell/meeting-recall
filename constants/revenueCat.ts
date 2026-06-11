export const REVENUECAT_IOS_API_KEY = "appl_oRRlEchJWPXPTjjPRfnGFwEZNzA";
export const REVENUECAT_ANDROID_API_KEY = "goog_NFututeZJdhVWJcnmwjRSIzADyn";

export const MEETING_RECALL_PRO_ENTITLEMENT_ID = "Meeting Recall Pro";

export const MEETING_RECALL_PRO_ENTITLEMENT_ALIASES = [
  MEETING_RECALL_PRO_ENTITLEMENT_ID,
  "meeting_recall_pro",
  "pro"
];

export const REVENUECAT_OFFERING_ID = "default";

export const REVENUECAT_PRODUCTS = {
  monthly: "monthly",
  yearly: "yearly"
} as const;

export type RevenueCatProductKey = keyof typeof REVENUECAT_PRODUCTS;
