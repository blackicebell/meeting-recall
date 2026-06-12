import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { SuperwallProvider } from "expo-superwall";

import { HomeScreen } from "./app/screens/HomeScreen";
import { OnboardingScreen } from "./app/screens/OnboardingScreen";
import { RecordingDetailScreen } from "./app/screens/RecordingDetailScreen";
import { RecordingScreen } from "./app/screens/RecordingScreen";
import { SaveRecordingScreen } from "./app/screens/SaveRecordingScreen";
import { SettingsScreen } from "./app/screens/SettingsScreen";
import { SuperwallSubscriptionBridge } from "./components/monetization/SuperwallSubscriptionBridge";
import { SUPERWALL_API_KEYS } from "./constants/superwall";
import { theme } from "./constants/theme";
import { devLog } from "./lib/devLog";
import type { RootStackParamList } from "./types/navigation";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <SuperwallProvider
      apiKeys={SUPERWALL_API_KEYS}
      onConfigurationError={(error) => {
        devLog.warn("Unable to configure Superwall.", error);
      }}
    >
      <SuperwallSubscriptionBridge />
      <NavigationContainer>
        <StatusBar style="dark" />
        <Stack.Navigator
          initialRouteName="Onboarding"
          screenOptions={{
            contentStyle: { backgroundColor: theme.colors.background },
            headerShown: false
          }}
        >
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Recording" component={RecordingScreen} />
          <Stack.Screen name="SaveRecording" component={SaveRecordingScreen} />
          <Stack.Screen name="RecordingDetail" component={RecordingDetailScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SuperwallProvider>
  );
}
