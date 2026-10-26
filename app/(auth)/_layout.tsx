import { Redirect, Stack } from "expo-router";
import type { Href } from "expo-router";
import AuthLoading from "../../components/auth/AuthLoading";
import { useAuth } from "../../contexts/AuthContext";

export default function AuthLayout() {
  const { session, role, profile, profileError, isLoading, isProfileLoading } =
    useAuth();

  if (isLoading || (session && isProfileLoading)) return <AuthLoading />;
  if (session) {
    if (profileError || !profile || !profile.is_active || role !== "customer") {
      return <Redirect href={"/account-status" as Href} />;
    }
    return <Redirect href="/(customer)/(tabs)" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="email" />
    </Stack>
  );
}
