import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { PropsWithChildren } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { isSupabaseConfigured, supabase } from "../lib/supabase";
import { loadMyProfile } from "../services/profiles";
import type { AppRole, Profile } from "../services/profiles";
import { signOutFromSupabase } from "../services/auth";

type AuthContextValue = {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  role: AppRole | null;
  profileError: string | null;
  isLoading: boolean;
  isProfileLoading: boolean;
  isConfigured: boolean;
  refreshProfile: () => Promise<string | null>;
  signOut: () => Promise<string | null>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [isProfileLoading, setIsProfileLoading] = useState(false);

  useEffect(() => {
    if (!supabase) {
      setIsLoading(false);
      return;
    }

    let isMounted = true;
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (isMounted) setSession(nextSession);
    });

    void supabase.auth
      .getSession()
      .then(({ data, error }) => {
        if (!isMounted) return;
        setSession(error ? null : data.session);
        setIsLoading(false);
      })
      .catch(() => {
        if (!isMounted) return;
        setSession(null);
        setIsLoading(false);
      });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const userId = session?.user.id;

  useEffect(() => {
    if (!userId) {
      setProfile(null);
      setProfileError(null);
      setIsProfileLoading(false);
      return;
    }

    let isCurrent = true;
    setIsProfileLoading(true);
    setProfile(null);
    setProfileError(null);

    void loadMyProfile(userId)
      .then(({ profile: nextProfile, error }) => {
        if (!isCurrent) return;
        setProfile(nextProfile);
        setProfileError(error);
      })
      .catch(() => {
        if (!isCurrent) return;
        setProfile(null);
        setProfileError(
          "We couldn't load your profile. Check your connection and try again.",
        );
      })
      .finally(() => {
        if (isCurrent) setIsProfileLoading(false);
      });

    return () => {
      isCurrent = false;
    };
  }, [userId]);

  const refreshProfile = useCallback(async () => {
    if (!userId) return "You need to sign in again.";
    setIsProfileLoading(true);
    setProfileError(null);
    try {
      const result = await loadMyProfile(userId);
      setProfile(result.profile);
      setProfileError(result.error);
      return result.error;
    } catch {
      const message =
        "We couldn't load your profile. Check your connection and try again.";
      setProfile(null);
      setProfileError(message);
      return message;
    } finally {
      setIsProfileLoading(false);
    }
  }, [userId]);

  const profileBelongsToCurrentUser = profile?.id === userId;
  const waitingForCurrentProfile =
    Boolean(userId) && !profileError && !profileBelongsToCurrentUser;

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      user: session?.user ?? null,
      profile,
      role: profile?.role ?? null,
      profileError,
      isLoading,
      isProfileLoading: isProfileLoading || waitingForCurrentProfile,
      isConfigured: isSupabaseConfigured,
      refreshProfile,
      signOut: signOutFromSupabase,
    }),
    [
      session,
      profile,
      profileError,
      isLoading,
      isProfileLoading,
      waitingForCurrentProfile,
      refreshProfile,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider.");
  return context;
}
