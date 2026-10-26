import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { router } from "expo-router";
import { ArrowLeft, ArrowRight, Mail } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AppInput from "../../components/ui/AppInput";
import { useAuth } from "../../contexts/AuthContext";
import { sendEmailCode, verifyEmailCode } from "../../services/auth";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const resendCooldownSeconds = 60;

export default function EmailEntryScreen() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [hasSentCode, setHasSentCode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [resendIn, setResendIn] = useState(0);
  const [verifiedUserId, setVerifiedUserId] = useState<string | null>(null);
  const { isConfigured, session, profile, isLoading, isProfileLoading } =
    useAuth();

  useEffect(() => {
    if (resendIn <= 0) return;
    const timeout = setTimeout(
      () => setResendIn((seconds) => Math.max(seconds - 1, 0)),
      1000
    );
    return () => clearTimeout(timeout);
  }, [resendIn]);

  useEffect(() => {
    if (!verifiedUserId) return;
    if (!isLoading && session?.user.id === verifiedUserId) {
      if (isProfileLoading) return;
      if (
        profile?.id === verifiedUserId &&
        profile.is_active &&
        profile.role === "customer"
      ) {
        router.replace("/(customer)/(tabs)");
      } else {
        router.replace("/account-status");
      }
      return;
    }

    const timeout = setTimeout(() => {
      setErrorMessage(
        "Your code was accepted, but we couldn’t restore your session. Request a new code and try again."
      );
      setVerifiedUserId(null);
    }, 10000);
    return () => clearTimeout(timeout);
  }, [verifiedUserId, isLoading, session, isProfileLoading, profile]);

  const requestCode = async () => {
    if (isSubmitting || (hasSentCode && resendIn > 0)) return;
    setErrorMessage("");

    const normalizedEmail = email.trim().toLowerCase();
    if (!emailPattern.test(normalizedEmail)) {
      setErrorMessage("Enter a valid email address.");
      return;
    }
    if (!isConfigured) {
      setErrorMessage(
        "Sign-in is temporarily unavailable. Please try again later."
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await sendEmailCode(normalizedEmail);
      if (result.error) {
        setErrorMessage(result.error);
        return;
      }
      setEmail(normalizedEmail);
      setCode("");
      setHasSentCode(true);
      setResendIn(resendCooldownSeconds);
    } catch {
      setErrorMessage(
        "We couldn’t send your code. Check your connection and try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const verifyCode = async () => {
    if (isVerifying) return;
    setErrorMessage("");

    const normalizedCode = code.trim();
    if (!/^\d{6}$/.test(normalizedCode)) {
      setErrorMessage("Enter the six-digit code from your email.");
      return;
    }

    setIsVerifying(true);
    try {
      const result = await verifyEmailCode(email, normalizedCode);
      if (result.error || !result.userId) {
        setErrorMessage(
          result.error ??
            "We couldn’t verify that code. Check it and try again."
        );
        return;
      }
      setVerifiedUserId(result.userId);
    } catch {
      setErrorMessage(
        "We couldn’t verify your code. Check your connection and try again."
      );
    } finally {
      setIsVerifying(false);
    }
  };

  const changeEmail = () => {
    setHasSentCode(false);
    setCode("");
    setResendIn(0);
    setErrorMessage("");
  };

  const goBack = () => {
    if (hasSentCode) {
      changeEmail();
      return;
    }
    router.replace("/");
  };

  const busy = isSubmitting || isVerifying;

  return (
    <SafeAreaView className="flex-1 bg-slate-50" edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-1 px-5 pb-8 pt-2">
            {/* Back Button */}
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={
                hasSentCode ? "Change email address" : "Back to welcome"
              }
              onPress={goBack}
              className="h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white active:bg-slate-50"
            >
              <ArrowLeft size={18} color="#0F172A" />
            </Pressable>

            {/* Header Icon */}
            <View className="mt-8 h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 border border-emerald-100">
              <Mail size={24} color="#016938" />
            </View>

            {/* Screen Title & Subtitle */}
            <Text
              accessibilityRole="header"
              className="font-anaheim mt-5 text-2xl font-extrabold text-slate-900"
            >
              {hasSentCode ? "Check your email" : "Sign in with email"}
            </Text>
            <Text className="font-anaheim mt-1.5 text-xs text-slate-500 leading-5">
              {hasSentCode
                ? `Enter the six-digit code we sent to ${email}.`
                : "Enter your email and we’ll send you a one-time sign-in code."}
            </Text>

            {/* Input Form */}
            {!hasSentCode ? (
              <View className="mt-6">
                <AppInput
                  label="Email Address"
                  icon={Mail}
                  placeholder="you@example.com"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  returnKeyType="go"
                  onSubmitEditing={() => void requestCode()}
                />
              </View>
            ) : (
              <>
                <View className="mt-6">
                  <AppInput
                    label="Verification Code"
                    icon={Mail}
                    placeholder="123456"
                    value={code}
                    onChangeText={(value) => setCode(value.replace(/\D/g, ""))}
                    keyboardType="number-pad"
                    autoComplete="one-time-code"
                    maxLength={6}
                    returnKeyType="done"
                    onSubmitEditing={() => void verifyCode()}
                  />
                </View>
                <Pressable
                  accessibilityRole="button"
                  onPress={changeEmail}
                  className="mt-2.5 self-start"
                >
                  <Text className="font-anaheim text-xs font-semibold text-[#016938]">
                    Use a different email
                  </Text>
                </Pressable>
              </>
            )}

            {/* Error Message Alert */}
            {!!errorMessage && (
              <View className="mt-4 rounded-xl bg-rose-50 border border-rose-100 px-4 py-3">
                <Text
                  accessibilityRole="alert"
                  className="font-anaheim text-xs leading-5 text-rose-700"
                >
                  {errorMessage}
                </Text>
              </View>
            )}

            {/* Action Submit Button */}
            <View className="mt-6">
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={
                  hasSentCode ? "Verify email code" : "Send email code"
                }
                accessibilityState={{ disabled: busy, busy }}
                disabled={busy}
                onPress={() => void (hasSentCode ? verifyCode() : requestCode())}
                className={`h-12 flex-row items-center justify-center rounded-2xl bg-[#016938] active:bg-[#01522c] ${
                  busy ? "opacity-60" : ""
                }`}
              >
                {busy ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <>
                    <Text className="font-anaheim text-sm font-bold text-white">
                      {hasSentCode ? "Verify Code" : "Send Code"}
                    </Text>
                    <ArrowRight size={16} color="#FFFFFF" className="ml-2" />
                  </>
                )}
              </Pressable>
            </View>

            {/* Resend Link */}
            {hasSentCode && (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Resend email code"
                accessibilityState={{
                  disabled: busy || resendIn > 0,
                  busy: isSubmitting,
                }}
                disabled={busy || resendIn > 0}
                onPress={() => void requestCode()}
                className={`mt-4 min-h-10 items-center justify-center ${
                  busy || resendIn > 0 ? "opacity-50" : "active:opacity-70"
                }`}
              >
                <Text className="font-anaheim text-xs font-bold text-[#016938]">
                  {resendIn > 0 ? `Resend code in ${resendIn}s` : "Resend Code"}
                </Text>
              </Pressable>
            )}

            {/* Footer Information */}
            <Text className="font-anaheim mt-auto pt-6 text-center text-[11px] leading-4 text-slate-400">
              New and returning customers can sign in with an email code. No
              password needed.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}