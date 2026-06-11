# Meeting Recall Monetization Setup

## Purpose

Meeting Recall uses RevenueCat for subscription status, purchases, restore purchases, paywalls, and subscription management.

The first production monetization model is:
- Free plan: limited saved recordings
- Meeting Recall Pro: unlimited saved recordings and paid workflow features

---

# SDKs Installed

Installed with:

```bash
npx expo install react-native-purchases react-native-purchases-ui
```

Packages:
- `react-native-purchases`
- `react-native-purchases-ui`

RevenueCat requires a development or production build for real purchase testing. Expo Go can preview some behavior but cannot complete real native purchases.

---

# RevenueCat App Configuration

Current API key:

```text
test_sLmMQrjwikTpYZluIVGQgqywhFA
```

Configured in:

```text
/constants/revenueCat.ts
```

Important:
RevenueCat API keys are public client keys, not private secrets.

---

# Entitlement

Primary entitlement:

```text
Meeting Recall Pro
```

The app checks this entitlement to decide whether the user has Pro access.

Because RevenueCat projects often use lowercase identifiers, the code also recognizes:
- `meeting_recall_pro`
- `pro`

Preferred production recommendation:
Use one clear RevenueCat entitlement identifier and keep it consistent across code, App Store Connect, Google Play, and RevenueCat.

---

# Products

Configured product identifiers:

```text
monthly
yearly
```

RevenueCat offering:

```text
default
```

The RevenueCat dashboard should include:
- Product: `monthly`
- Product: `yearly`
- Entitlement: `Meeting Recall Pro`
- Offering: `default`
- Packages connected to the monthly and yearly products
- A RevenueCat Paywall attached to the offering

---

# App Store Connect Setup

Create auto-renewable subscriptions:

## Monthly
- Product ID: `monthly`
- Duration: 1 month
- Price: recommended launch price

## Yearly
- Product ID: `yearly`
- Duration: 1 year
- Price: recommended launch price
- Optional 7-day free trial

Both products must be approved or ready for testing before they reliably appear in RevenueCat paywalls.

---

# Google Play Console Setup

Create subscription products:

## Monthly
- Product ID: `monthly`
- Base plan: monthly

## Yearly
- Product ID: `yearly`
- Base plan: yearly
- Optional 7-day free trial offer

After creating products, connect Google Play to RevenueCat and import/sync the products.

---

# Code Structure

## Constants

```text
/constants/revenueCat.ts
```

Defines:
- API key
- entitlement identifier
- offering identifier
- product IDs

## RevenueCat Service

```text
/lib/revenueCat.ts
```

Handles:
- SDK initialization
- customer info retrieval
- entitlement checking
- offerings retrieval
- restore purchases
- presenting the RevenueCat paywall
- presenting Customer Center

## Subscription Hook

```text
/hooks/useRevenueCatSubscription.ts
```

Provides:
- `isPro`
- `isLoading`
- `error`
- `customerInfo`
- `refresh`
- `presentPaywall`
- `restore`
- `openCustomerCenter`

## Settings UI

```text
/app/screens/SettingsScreen.tsx
```

Includes:
- Pro status
- Upgrade button
- Restore button
- Manage button
- dev-only RevenueCat product check

---

# Paywall Behavior

The app uses RevenueCat Paywalls:

```ts
RevenueCatUI.presentPaywallIfNeeded({
  requiredEntitlementIdentifier: "Meeting Recall Pro"
});
```

This only presents the paywall if the user does not already have the Pro entitlement.

Paywall design and pricing should be controlled from RevenueCat.

---

# Customer Center

Customer Center is exposed from Settings through:

```ts
RevenueCatUI.presentCustomerCenter();
```

Use Customer Center when users need to:
- manage subscriptions
- restore purchases
- request subscription help
- access RevenueCat-supported subscription management flows

It belongs in Settings, not in the main recording flow.

---

# Error Handling

Subscription errors should be calm and recoverable.

Examples:
- “Unable to open Pro options. Please try again.”
- “Unable to fetch RevenueCat products. Check RevenueCat setup.”
- “No active Pro subscription found.”

Do not block the core recording flow because RevenueCat is temporarily unavailable unless the user is clearly over a free-plan limit.

---

# Best Practices

## Keep RevenueCat as the Source of Truth

Use `CustomerInfo` and entitlements to decide Pro access.

Do not store Pro status permanently as local-only truth.

---

## Gate at Natural Moments

Good paywall moments:
- user tries to save beyond the free recording limit
- user taps Upgrade in Settings
- user taps a Pro-only feature

Avoid:
- interrupting an active recording
- blocking playback of recordings the user already created
- showing paywalls during error recovery

---

## Restore Purchases Must Stay Visible

Restore purchases should remain available from Settings.

This is especially important for App Store review.

---

## New Builds Required

Because RevenueCat uses native purchase modules, a new iOS and Android build is required after SDK integration.

Commands:

```bash
eas build -p ios --profile production
eas build -p android --profile production
```

---

# Testing Checklist

## RevenueCat Dashboard
- Products exist
- Products are attached to the Pro entitlement
- Offering exists
- Paywall is attached to the offering
- iOS app is connected
- Android app is connected

## iOS
- TestFlight build installed
- Sandbox tester account available
- Paywall opens
- Monthly purchase starts
- Yearly purchase starts
- Restore purchases works
- Customer Center opens

## Android
- Internal/closed/production test build installed from Google Play
- Google Play tester account has access
- Paywall opens
- Monthly purchase starts
- Yearly purchase starts
- Restore purchases works
- Customer Center opens

---

# Next Recommended Task

After verifying the paywall opens and products appear, add the first simple production gate:

Free users can save up to 3 recordings.

When a free user tries to start a fourth recording, show the RevenueCat paywall before recording starts.
