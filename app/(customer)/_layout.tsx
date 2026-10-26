import { Redirect, Stack } from "expo-router";
import type { Href } from "expo-router";
import AuthLoading from "../../components/auth/AuthLoading";
import { useAuth } from "../../contexts/AuthContext";

export default function CustomerLayout() {
  const { session, role, profile, profileError, isLoading, isProfileLoading } =
    useAuth();

  if (isLoading || (session && isProfileLoading)) return <AuthLoading />;
  if (!session) return <Redirect href={"/(auth)/email" as Href} />;
  if (profileError || !profile || !profile.is_active || role !== "customer") {
    return <Redirect href={"/account-status" as Href} />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="restaurants/[restaurantId]" />
      <Stack.Screen name="cart" />
      <Stack.Screen name="checkout" />
      <Stack.Screen name="order-success" />
    </Stack>
  );
}
