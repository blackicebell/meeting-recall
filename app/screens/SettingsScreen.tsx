import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { usePlacement } from "expo-superwall";
import { useState } from "react";
import { Alert, Linking, Pressable, StyleSheet, Text, View } from "react-native";

import { IconButton, Screen, SecondaryButton, SectionHeader } from "../../components/ui";
import { SUPERWALL_PLACEMENTS } from "../../constants/superwall";
import { theme } from "../../constants/theme";
import { devLog } from "../../lib/devLog";
import {
  getRevenueCatConfigurationState,
  getRevenueCatProductSummary,
  hasMeetingRecallPro
} from "../../lib/revenueCat";
import { useRevenueCatSubscription } from "../../hooks/useRevenueCatSubscription";
import type { RootStackParamList } from "../../types/navigation";

type Props = NativeStackScreenProps<RootStackParamList, "Settings">;

const ABOUT_LINKS = [
  { label: "Support", url: "https://getmeetingrecall.com/support" },
  { label: "Terms", url: "https://getmeetingrecall.com/terms" },
  { label: "Privacy Policy", url: "https://getmeetingrecall.com/privacy" }
] as const;

export function SettingsScreen({ navigation }: Props) {
  const [subscriptionStatus, setSubscriptionStatus] = useState("Checking subscription...");
  const subscription = useRevenueCatSubscription();
  const { registerPlacement } = usePlacement({
    onPresent: (paywallInfo) => {
      devLog.info("Superwall paywall presented", {
        identifier: paywallInfo.identifier,
        name: paywallInfo.name
      });
    },
    onDismiss: (paywallInfo, result) => {
      devLog.info("Superwall paywall dismissed", {
        identifier: paywallInfo.identifier,
        result
      });
    },
    onSkip: (reason) => {
      devLog.info("Superwall paywall skipped", { reason });
    },
    onError: (error) => {
      devLog.warn("Superwall paywall error", error);
    }
  });

  async function showUpgradePaywall() {
    setSubscriptionStatus("Opening Pro options...");

    try {
      await registerPlacement({
        placement: SUPERWALL_PLACEMENTS.upgrade,
        params: {
          source: "settings",
          entitlement: "Meeting Recall Pro"
        }
      });

      const customerInfo = await subscription.refresh();

      setSubscriptionStatus(
        customerInfo && hasMeetingRecallPro(customerInfo)
          ? "Meeting Recall Pro is active."
          : "Pro options closed."
      );
    } catch (error) {
      devLog.warn("Unable to open Superwall paywall.", error);
      setSubscriptionStatus("Unable to open Pro options. Please try again.");
      Alert.alert("Unable to open Pro options", "Please try again.");
    }
  }

  async function restorePurchases() {
    setSubscriptionStatus("Restoring purchases...");
    const customerInfo = await subscription.restore();

    setSubscriptionStatus(
      customerInfo && subscription.isPro
        ? "Meeting Recall Pro is active."
        : "No active Pro subscription found."
    );
  }

  async function openCustomerCenter() {
    setSubscriptionStatus("Opening subscription settings...");
    const opened = await subscription.openCustomerCenter();
    setSubscriptionStatus(opened ? "Subscription settings closed." : "Unable to open subscription settings.");
  }

  async function checkProducts() {
    try {
      setSubscriptionStatus("Checking RevenueCat products...");
      const summary = await getRevenueCatProductSummary();
      setSubscriptionStatus(
        summary.availablePackages.length > 0
          ? `Offering ${summary.currentOfferingId ?? "default"} has ${summary.availablePackages.length} package(s).`
          : "No RevenueCat packages found. Check your offering setup."
      );
    } catch (error) {
      devLog.warn("Unable to fetch RevenueCat products.", error);
      setSubscriptionStatus("Unable to fetch RevenueCat products. Check RevenueCat setup.");
    }
  }

  async function openAboutLink(label: string, url: string) {
    try {
      const canOpen = await Linking.canOpenURL(url);

      if (!canOpen) {
        Alert.alert("Unable to open link", `Please visit ${url}.`);
        return;
      }

      await Linking.openURL(url);
    } catch (error) {
      devLog.warn(`Unable to open ${label}.`, error);
      Alert.alert("Unable to open link", `Please visit ${url}.`);
    }
  }

  return (
    <Screen>
      <View style={styles.header}>
        <IconButton label="Back to home" symbol="‹" onPress={() => navigation.navigate("Home")} />
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={styles.headerSpace} />
      </View>

      <Text style={styles.title}>Settings</Text>

      <SectionHeader>Subscription</SectionHeader>
      <View style={styles.proRow}>
        <View style={styles.rowText}>
          <Text style={styles.rowTitle}>Meeting Recall Pro</Text>
          <Text style={styles.meta}>
            {subscription.isLoading
              ? "Checking subscription..."
              : subscription.isPro
                ? "Active"
                : "Free plan"}
          </Text>
          <Text style={styles.meta}>
            {subscription.error ?? subscriptionStatus}
          </Text>
        </View>
        <SecondaryButton disabled={subscription.isLoading} onPress={showUpgradePaywall}>
          {subscription.isPro ? "View" : "Upgrade"}
        </SecondaryButton>
      </View>
      <View style={styles.inlineActions}>
        <SecondaryButton disabled={subscription.isLoading} onPress={restorePurchases}>
          Restore
        </SecondaryButton>
        <SecondaryButton disabled={subscription.isLoading} onPress={openCustomerCenter}>
          Manage
        </SecondaryButton>
        {__DEV__ ? (
          <SecondaryButton disabled={subscription.isLoading} onPress={checkProducts}>
            Check Products
          </SecondaryButton>
        ) : null}
      </View>
      {__DEV__ ? (
        <Text style={styles.devMeta}>
          RevenueCat: {JSON.stringify(getRevenueCatConfigurationState())}
        </Text>
      ) : null}

      <View style={styles.section}>
        <SectionHeader>Storage</SectionHeader>
        <View style={styles.dividerRow}>
          <Text style={styles.rowTitle}>Meeting Recall folder</Text>
          <Text style={styles.meta}>Recordings are saved locally and accessible from your device files.</Text>
        </View>
        <View style={styles.dividerRow}>
          <Text style={styles.rowTitle}>File naming</Text>
          <Text style={styles.meta}>YYYY-MM-DD - Meeting Name.m4a</Text>
        </View>
      </View>

      <View style={styles.section}>
        <SectionHeader>About</SectionHeader>
        {ABOUT_LINKS.map((item) => (
          <Pressable
            accessibilityRole="link"
            key={item.label}
            onPress={() => openAboutLink(item.label, item.url)}
            style={({ pressed }) => [styles.linkRow, pressed ? styles.pressedRow : null]}
          >
            <Text style={styles.rowTitle}>{item.label}</Text>
            <Text style={styles.chevron}>&gt;</Text>
          </Pressable>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: theme.spacing["2xl"]
  },
  headerTitle: {
    color: theme.colors.text,
    fontSize: theme.typography.body.fontSize,
    fontWeight: "700"
  },
  headerSpace: {
    width: 48
  },
  title: {
    color: theme.colors.text,
    fontSize: theme.typography.display.fontSize,
    fontWeight: theme.typography.display.fontWeight,
    lineHeight: theme.typography.display.lineHeight,
    marginBottom: theme.spacing["2xl"]
  },
  section: {
    marginTop: theme.spacing["2xl"]
  },
  row: {
    alignItems: "center",
    borderBottomColor: theme.colors.divider,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderTopColor: theme.colors.divider,
    borderTopWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    gap: theme.spacing.md,
    justifyContent: "space-between",
    paddingVertical: theme.spacing.lg
  },
  proRow: {
    alignItems: "center",
    borderBottomColor: theme.colors.divider,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderTopColor: theme.colors.divider,
    borderTopWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    gap: theme.spacing.md,
    justifyContent: "space-between",
    paddingVertical: theme.spacing.lg
  },
  rowText: {
    flex: 1
  },
  inlineActions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.sm,
    marginTop: theme.spacing.md
  },
  dividerRow: {
    borderBottomColor: theme.colors.divider,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderTopColor: theme.colors.divider,
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingVertical: theme.spacing.lg
  },
  linkRow: {
    alignItems: "center",
    borderBottomColor: theme.colors.divider,
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: theme.spacing.lg
  },
  pressedRow: {
    opacity: 0.58
  },
  rowTitle: {
    color: theme.colors.text,
    fontSize: theme.typography.body.fontSize,
    fontWeight: "700",
    lineHeight: theme.typography.body.lineHeight
  },
  meta: {
    color: theme.colors.textMuted,
    fontSize: theme.typography.metadata.fontSize,
    lineHeight: theme.typography.metadata.lineHeight,
    marginTop: theme.spacing.xs
  },
  chevron: {
    color: theme.colors.textSubtle,
    fontSize: 30
  },
  devMeta: {
    color: theme.colors.textSubtle,
    fontSize: 11,
    lineHeight: 16,
    marginTop: theme.spacing.sm
  }
});
