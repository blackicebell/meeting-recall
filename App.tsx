import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";

import { HomeScreen } from "./app/screens/HomeScreen";
import { OnboardingScreen } from "./app/screens/OnboardingScreen";
import { RecordingDetailScreen } from "./app/screens/RecordingDetailScreen";
import { RecordingScreen } from "./app/screens/RecordingScreen";
import { SaveRecordingScreen } from "./app/screens/SaveRecordingScreen";
import { SettingsScreen } from "./app/screens/SettingsScreen";
import { theme } from "./constants/theme";
import type { RootStackParamList } from "./types/navigation";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
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
  );
}
