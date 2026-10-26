import { Redirect, router } from "expo-router";
import type { Href } from "expo-router";
import { useState } from "react";
import {
  ImageBackground,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { ArrowRight, MapPin, UtensilsCrossed } from "lucide-react-native";
import * as Haptics from "expo-haptics";
import { SafeAreaView } from "react-native-safe-area-context";
import AuthLoading from "../components/auth/AuthLoading";
import { useAuth } from "../contexts/AuthContext";

export default function WelcomeScreen() {
  const { session, profile, profileError, isLoading, isProfileLoading } =
    useAuth();
  const [isNavigating, setIsNavigating] = useState(false);

  if (isLoading || (session && isProfileLoading)) return <AuthLoading />;
  if (session) {
    if (
      profileError ||
      !profile ||
      !profile.is_active ||
      profile.role !== "customer"
    )
      return <Redirect href="/account-status" />;
    return <Redirect href="/(customer)/(tabs)" />;
  }

  const startSignup = () => {
    if (isNavigating) return;
    setIsNavigating(true);
    void Haptics.selectionAsync().catch(() => undefined);
    router.push("/(auth)/email" as Href);
    setTimeout(() => setIsNavigating(false), 500);
  };

  const openEmailSignIn = () => {
    void Haptics.selectionAsync().catch(() => undefined);
    router.push("/(auth)/email" as Href);
  };

  return (
    <SafeAreaView className="flex-1 bg-[#016938]" edges={["top", "bottom"]}>
      <ImageBackground
        source={require("../assets/images/Seamless food background patterns_ - Vitalii Brenyk.jpeg")}
        resizeMode="cover"
        imageStyle={{ opacity: 0.15 }}
        className="flex-1"
      >
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <View className="w-full flex-1 justify-between px-6 pb-6 pt-3">
            {/* Header Location Badge */}
            <View className="flex-row items-center justify-end">
              <View className="flex-row items-center rounded-full border border-white/20 bg-white/10 px-3 py-1.5">
                <MapPin size={13} color="#E1F0E6" strokeWidth={2.4} />
                <Text className="font-anaheim ml-1.5 text-xs font-semibold text-emerald-50">
                  Holeta, Ethiopia
                </Text>
              </View>
            </View>

            {/* Middle Branding Section */}
            <View className="my-auto py-8">
              <View className="h-14 w-14 items-center justify-center rounded-2xl bg-white/15 border border-white/20 mb-4">
                <UtensilsCrossed size={28} color="#FFFFFF" strokeWidth={2} />
              </View>
              <Text className="font-anaheim text-4xl font-extrabold text-white leading-tight">
                Local Food,{"\n"}Delivered Simply.
              </Text>
              <Text className="font-anaheim mt-3 text-sm text-emerald-100/90 leading-6 max-w-[280px]">
                Discover your favorite local spots in Holeta and get food delivered straight to your door.
              </Text>
            </View>

            {/* Action Buttons */}
            <View className="pt-2">
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Get started and create an account"
                disabled={isNavigating}
                onPress={startSignup}
                className={`h-14 w-full flex-row items-center justify-center rounded-xl bg-white active:bg-slate-100 ${
                  isNavigating ? "opacity-70" : ""
                }`}
                style={({ pressed }) => ({
                  transform: [{ scale: pressed ? 0.985 : 1 }],
                })}
              >
                <Text className="font-anaheim text-left font-extrabold text-[#016938]">
                  Get Started
                </Text>
                <View className="ml-2.5 h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-left">
                  <ArrowRight size={16} color="#016938" strokeWidth={2.5} />
                </View>
              </Pressable>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Sign in with email"
                onPress={openEmailSignIn}
                className="mt-3.5 min-h-11 flex-row items-center justify-center rounded-full px-4 active:opacity-75"
              >
                <Text className="font-anaheim text-xs text-emerald-100/90">
                  Already have an account?{" "}
                </Text>
                <Text className="font-anaheim text-xs font-extrabold text-white">
                  Continue with email
                </Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
}