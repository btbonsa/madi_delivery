import { supabase } from "../lib/supabase";

export const appRoles = ["customer", "restaurant", "rider", "admin"] as const;
export type AppRole = (typeof appRoles)[number];

export type Profile = {
  id: string;
  full_name: string;
  phone: string | null;
  role: AppRole;
  is_active: boolean;
  image_url: string | null;
};

export type ProfileResult = {
  profile: Profile | null;
  error: string | null;
};

export async function loadMyProfile(userId: string): Promise<ProfileResult> {
  if (!supabase) return { profile: null, error: "Supabase is not configured." };

  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, phone, role, is_active, image_url")
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    return {
      profile: null,
      error:
        "We couldn't load your profile. Check that the profiles table lets signed-in users read their own row.",
    };
  }
  if (!data) {
    return {
      profile: null,
      error:
        "No profile was found for this account. The Supabase signup trigger should create one automatically.",
    };
  }
  if (!appRoles.includes(data.role as AppRole)) {
    return {
      profile: null,
      error: "This account has an unrecognized role. Contact support.",
    };
  }

  return {
    profile: {
      id: data.id,
      full_name: data.full_name,
      phone: data.phone,
      role: data.role as AppRole,
      is_active: data.is_active,
      image_url: data.image_url,
    },
    error: null,
  };
}

/** Update only the authenticated user's own profile photo URL. */
export async function updateMyProfileImage(
  imageUrl: string,
): Promise<string | null> {
  if (!supabase) return "Supabase is not configured.";

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user)
    return "Your session has expired. Sign in again and retry.";

  const { data, error } = await supabase
    .from("profiles")
    .update({ image_url: imageUrl })
    .eq("id", user.id)
    .select("id")
    .maybeSingle();

  if (error) {
    if (
      error.code === "42501" ||
      error.message.toLowerCase().includes("row-level security")
    ) {
      return "Supabase blocked this profile photo update under Row Level Security. Confirm that profiles has an authenticated UPDATE policy limited to id = auth.uid().";
    }
    return "We couldn't save your photo to your profile. Check your connection and try again.";
  }
  if (!data) {
    return "Supabase did not update this profile row. Confirm the authenticated user has an own-row UPDATE policy on profiles.";
  }

  return null;
}

/** Update only the authenticated user's own phone number. */
export async function updateMyProfilePhone(
  phone: string | null,
): Promise<string | null> {
  if (!supabase) return "Supabase is not configured.";

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user)
    return "Your session has expired. Sign in again and retry.";

  const { data, error } = await supabase
    .from("profiles")
    .update({ phone })
    .eq("id", user.id)
    .select("id")
    .maybeSingle();

  if (error) {
    if (
      error.code === "42501" ||
      error.message.toLowerCase().includes("row-level security")
    ) {
      return "Supabase blocked this profile update under Row Level Security. Confirm the signed-in user can update their own profile row.";
    }
    return "We couldn't save your phone number. Check your connection and try again.";
  }
  if (!data) {
    return "Supabase did not update your profile. Confirm the authenticated user has an own-row UPDATE policy.";
  }

  return null;
}
