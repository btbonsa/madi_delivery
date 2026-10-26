import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Redirect, router } from "expo-router";
import type { Href } from "expo-router";
import { ShieldAlert } from "lucide-react-native";
import BrandLogo from "../components/BrandLogo";
import AuthLoading from "../components/auth/AuthLoading";
import { useAuth } from "../contexts/AuthContext";

export default function AccountStatusScreen() {
  const {
    session,
    profile,
    profileError,
    isLoading,
    isProfileLoading,
    refreshProfile,
    signOut,
  } = useAuth();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [actionError, setActionError] = useState("");

  useEffect(() => {
    if (profile?.role === "customer" && profile.is_active) {
      router.replace("/(customer)/(tabs)");
    }
  }, [profile]);

  if (isLoading || (session && isProfileLoading)) return <AuthLoading />;
  if (!session) return <Redirect href={"/(auth)/email" as Href} />;

  const title = profileError
    ? "We couldn’t load your profile"
    : !profile
      ? "Profile not found"
      : !profile.is_active
        ? "Account inactive"
        : "This account uses another role";
  const description =
    profileError ??
    (!profile
      ? "Your account exists, but no profile row was returned. The signup trigger should create a customer profile automatically."
      : !profile.is_active
        ? "This account is currently inactive. Contact support for help."
        : `Your account role is “${profile.role}”. This app currently has the customer ordering area available.`);

  const handleRetry = async () => {
    setActionError("");
    const error = await refreshProfile();
    if (error) setActionError(error);
  };

  const handleSignOut = async () => {
    setIsSigningOut(true);
    const error = await signOut();
    setIsSigningOut(false);
    if (error) setActionError(error);
  };

  return (
    <SafeAreaView
      className="flex-1 items-center justify-center bg-[#F8F7F2] px-7"
      edges={["top", "bottom"]}
    >
      <View className="mb-5">
        <BrandLogo size={56} />
      </View>
      <View className="mb-4 h-12 w-12 items-center justify-center rounded-full bg-[#FFF0E5]">
        <ShieldAlert size={23} color="#B45309" />
      </View>
      <Text className="font-anaheim text-center text-[23px] font-extrabold font-anaheim-extrabold text-[#17251D]">
        {title}
      </Text>
      <Text className="font-anaheim mt-3 text-center text-sm leading-6 text-[#748078]">
        {description}
      </Text>
      {!!actionError && (
        <Text
          accessibilityRole="alert"
          className="font-anaheim mt-4 text-center text-sm text-[#B42318]"
        >
          {actionError}
        </Text>
      )}

      {profileError || !profile ? (
        <Pressable
          accessibilityRole="button"
          disabled={isProfileLoading}
          className="mt-6 h-12 min-w-[180px] items-center justify-center rounded-2xl bg-[#016938] px-5"
          onPress={handleRetry}
        >
          {isProfileLoading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text className="font-anaheim font-bold font-anaheim-bold text-white">
              Retry profile
            </Text>
          )}
        </Pressable>
      ) : null}
      <Pressable
        accessibilityRole="button"
        disabled={isSigningOut}
        className="mt-3 h-12 min-w-[180px] items-center justify-center rounded-2xl border border-[#D9E2DA] bg-white px-5"
        onPress={handleSignOut}
      >
        {isSigningOut ? (
          <ActivityIndicator color="#016938" />
        ) : (
          <Text className="font-anaheim font-bold font-anaheim-bold text-[#016938]">
            Sign out
          </Text>
        )}
      </Pressable>
    </SafeAreaView>
  );
}
