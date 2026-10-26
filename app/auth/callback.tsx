import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Pressable, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import type { Href } from "expo-router";
import * as Linking from "expo-linking";
import { useAuth } from "../../contexts/AuthContext";
import { supabase } from "../../lib/supabase";

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function readUrlParam(url: string | null, name: string) {
  if (!url) return undefined;
  const [beforeHash, hash = ""] = url.split("#", 2);
  const query = beforeHash.includes("?")
    ? beforeHash.slice(beforeHash.indexOf("?") + 1)
    : "";
  return (
    new URLSearchParams(query).get(name) ??
    new URLSearchParams(hash).get(name) ??
    undefined
  );
}

export default function AuthCallbackScreen() {
  const deepLinkUrl = Linking.useURL();
  const browserUrl =
    typeof window === "undefined" ? null : window.location.href;
  const params = useLocalSearchParams<{
    code?: string | string[];
    token_hash?: string | string[];
    type?: string | string[];
    error_description?: string | string[];
    error?: string | string[];
    access_token?: string | string[];
    refresh_token?: string | string[];
  }>();

  const incomingUrl = deepLinkUrl ?? browserUrl;
  const [message, setMessage] = useState("Confirming your email…");
  const [hasError, setHasError] = useState(false);
  const [authenticatedUserId, setAuthenticatedUserId] = useState<string | null>(
    null,
  );
  const handled = useRef(false);
  const { session, profile, profileError, isLoading, isProfileLoading } =
    useAuth();

  useEffect(() => {
    if (!authenticatedUserId || isLoading) return;
    if (!session || session.user.id !== authenticatedUserId) {
      const timeout = setTimeout(() => {
        setHasError(true);
        setMessage(
          "Your email link was accepted, but we couldn’t restore your sign-in session. Request a new link and try again.",
        );
      }, 8000);
      return () => clearTimeout(timeout);
    }
    if (isProfileLoading) return;

    if (
      profileError ||
      !profile ||
      !profile.is_active ||
      profile.role !== "customer"
    ) {
      router.replace("/account-status");
      return;
    }
    if (profile.id === authenticatedUserId)
      router.replace("/(customer)/(tabs)");
  }, [
    authenticatedUserId,
    isLoading,
    session,
    isProfileLoading,
    profile,
    profileError,
  ]);

  useEffect(() => {
    if (handled.current) return;
    handled.current = true;

    const completeConfirmation = async () => {
      if (!supabase) {
        setHasError(true);
        setMessage(
          "Supabase is not configured. Reopen the app after configuration and try again.",
        );
        return;
      }

      const providerError =
        firstParam(params.error_description) ??
        readUrlParam(incomingUrl, "error_description");
      const providerErrorCode =
        firstParam(params.error) ??
        readUrlParam(incomingUrl, "error") ??
        readUrlParam(incomingUrl, "error_code");
      if (providerError) {
        setHasError(true);
        setMessage(
          `${providerErrorCode ? `${providerErrorCode}: ` : ""}${providerError}`,
        );
        return;
      }

      const code = firstParam(params.code) ?? readUrlParam(incomingUrl, "code");
      const tokenHash =
        firstParam(params.token_hash) ??
        readUrlParam(incomingUrl, "token_hash");
      const accessToken = readUrlParam(incomingUrl, "access_token");
      const refreshToken = readUrlParam(incomingUrl, "refresh_token");
      const type = firstParam(params.type) ?? readUrlParam(incomingUrl, "type");
      const emailOtpType =
        type === "signup" || type === "email" || type === "magiclink"
          ? type
          : null;
      const result = code
        ? await supabase.auth.exchangeCodeForSession(code)
        : tokenHash && emailOtpType
          ? await supabase.auth.verifyOtp({
              token_hash: tokenHash,
              type: emailOtpType,
            })
          : accessToken && refreshToken
            ? await supabase.auth.setSession({
                access_token: accessToken,
                refresh_token: refreshToken,
              })
            : null;

      if (!result) {
        setHasError(true);
        setMessage(
          "This sign-in link is incomplete or expired. Request a new link and try again.",
        );
        return;
      }
      if (result.error) {
        setHasError(true);
        const errorText = result.error.message.toLowerCase();
        setMessage(
          errorText.includes("expired") ||
            errorText.includes("invalid") ||
            errorText.includes("otp")
            ? "This sign-in link is invalid or expired. Request a new link and try again."
            : result.error.message,
        );
        return;
      }

      const userId = result.data.session?.user.id;
      if (!userId) {
        setHasError(true);
        setMessage(
          "Your email link was accepted, but no sign-in session was created. Request a new link and try again.",
        );
        return;
      }
      setMessage("Email confirmed. Loading your account…");
      setAuthenticatedUserId(userId);
    };

    void completeConfirmation().catch(() => {
      setHasError(true);
      setMessage(
        "We couldn’t confirm your email. Check your connection and request a new link if needed.",
      );
    });
  }, [params, incomingUrl]);

  return (
    <SafeAreaView
      className="flex-1 items-center justify-center bg-[#F8F7F2] px-8"
      edges={["top", "bottom"]}
    >
      {!hasError && <ActivityIndicator size="large" color="#016938" />}
      <Text
        accessibilityRole="alert"
        className="font-anaheim mt-5 text-center text-base leading-6 text-[#26372D]"
      >
        {message}
      </Text>
      {hasError && (
        <Pressable
          accessibilityRole="button"
          onPress={() => router.replace("/(auth)/email" as Href)}
          className="mt-5 rounded-2xl bg-[#FF7622] px-5 py-3"
        >
          <Text className="font-anaheim text-sm font-bold font-anaheim-bold text-white">
            Request a new sign-in link
          </Text>
        </Pressable>
      )}
    </SafeAreaView>
  );
}
