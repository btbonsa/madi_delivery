import { useEffect } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { LogBox } from "react-native";
import {
  useFonts,
  Anaheim_400Regular,
  Anaheim_500Medium,
  Anaheim_600SemiBold,
  Anaheim_700Bold,
  Anaheim_800ExtraBold,
} from "@expo-google-fonts/anaheim";
import * as SplashScreen from "expo-splash-screen";
import "./globals.css";
import { AuthProvider, useAuth } from "../contexts/AuthContext";
import { CartProvider } from "../contexts/CartContext";
import { FavoritesProvider } from "../contexts/FavoritesContext";

void SplashScreen.preventAutoHideAsync();
LogBox.ignoreLogs([
  "SafeAreaView has been deprecated and will be removed in a future release.",
]);

function AppNavigator() {
  const { user } = useAuth();
  return (
    <FavoritesProvider
      key={user?.id ?? "signed-out"}
      storageKey={`localbite:favorites:${user?.id ?? "guest"}`}
    >
      <CartProvider key={user?.id ?? "signed-out"}>
        <StatusBar
          style="light"
          backgroundColor="#15803D"
          hidden={false}
        />
        <Stack screenOptions={{ headerShown: false }} />
      </CartProvider>
    </FavoritesProvider>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Anaheim_400Regular,
    Anaheim_500Medium,
    Anaheim_600SemiBold,
    Anaheim_700Bold,
    Anaheim_800ExtraBold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      void SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;

  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
}
