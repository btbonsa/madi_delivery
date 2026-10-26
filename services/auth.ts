import type { AuthError } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";

export type AuthRequestResult = {
  error: string | null;
};

export type AuthVerificationResult = {
  error: string | null;
  userId: string | null;
};

const configurationError =
  "Supabase is not configured. Add the project URL and publishable key to Frontend/.env, then restart Expo.";

function getUserMessage(error: AuthError) {
  const message = error.message.toLowerCase();
  if (message.includes("rate limit") || message.includes("too many requests"))
    return "Too many codes were requested. Wait a while and try again.";
  if (message.includes("email") && message.includes("invalid"))
    return "Check that your email address is correct and try again.";
  if (
    message.includes("expired") ||
    message.includes("invalid") ||
    message.includes("otp")
  )
    return "That code is invalid or expired. Check the code or request a new one.";
  return "We couldn’t complete sign-in. Please try again.";
}

export async function sendEmailCode(email: string): Promise<AuthRequestResult> {
  if (!supabase) return { error: configurationError };
  const normalizedEmail = email.trim().toLowerCase();
  const { error } = await supabase.auth.signInWithOtp({
    email: normalizedEmail,
  });
  return { error: error ? getUserMessage(error) : null };
}

export async function verifyEmailCode(
  email: string,
  token: string,
): Promise<AuthVerificationResult> {
  if (!supabase) return { error: configurationError, userId: null };
  const normalizedEmail = email.trim().toLowerCase();
  const { data, error } = await supabase.auth.verifyOtp({
    email: normalizedEmail,
    token: token.trim(),
    type: "email",
  });

  if (error) return { error: getUserMessage(error), userId: null };
  const userId = data.session?.user.id ?? data.user?.id ?? null;
  return userId
    ? { error: null, userId }
    : {
        error:
          "The code was accepted, but we couldn’t start your session. Request a new code and try again.",
        userId: null,
      };
}

export async function signOutFromSupabase(): Promise<string | null> {
  if (!supabase) return "Supabase is not configured.";
  const { error } = await supabase.auth.signOut();
  return error ? getUserMessage(error) : null;
}
