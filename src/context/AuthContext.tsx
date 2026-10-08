"use client";

import * as React from "react";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { showToast } from "@/components/ui/Toast";

export interface Profile {
  id: string;
  full_name: string | null;
  phone: string | null;
  email: string | null;
  avatar_url?: string | null;
}

export interface CustomerSession {
  id: string;
  name: string;
  phone: string;
  email?: string;
  role?: string;
}

interface AuthResponse {
  success: boolean;
  error?: string;
  notFound?: boolean;
  customer?: any;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  loginWithPhone: (phone: string, name?: string) => Promise<AuthResponse>;
  signupWithPhone: (name: string, phone: string) => Promise<AuthResponse>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (
    email: string,
    password: string,
    fullName?: string,
    phone?: string
  ) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = "sreesha_auth_customer";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [supabase] = React.useState(() => createClient());
  const [user, setUser] = React.useState<User | null>(null);
  const [profile, setProfile] = React.useState<Profile | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  // Helper to convert customer record into simulated User & Profile
  const applyCustomerSession = React.useCallback(
    (cust: { id?: string; name: string; phone: string; email?: string }) => {
      const cleanPhone = cust.phone.replace(/\D/g, "");
      const customerId = cust.id || `cust_${cleanPhone}`;
      const customerEmail = cust.email || `${cleanPhone}@client.sreeshaelegance.com`;

      const simulatedUser: User = {
        id: customerId,
        app_metadata: { provider: "phone", role: "customer" },
        user_metadata: {
          full_name: cust.name,
          phone: cleanPhone,
        },
        aud: "authenticated",
        created_at: new Date().toISOString(),
        phone: cleanPhone,
        email: customerEmail,
      } as unknown as User;

      const userProfile: Profile = {
        id: customerId,
        full_name: cust.name,
        phone: cleanPhone,
        email: customerEmail,
        avatar_url: null,
      };

      setUser(simulatedUser);
      setProfile(userProfile);

      try {
        if (typeof window !== "undefined") {
          localStorage.setItem(
            LOCAL_STORAGE_KEY,
            JSON.stringify({
              id: customerId,
              name: cust.name,
              phone: cleanPhone,
              email: customerEmail,
            })
          );
          localStorage.setItem("sreesha_device_known", "true");
        }
      } catch (err) {
        console.warn("Could not save customer to localStorage:", err);
      }
    },
    []
  );

  const fetchProfile = React.useCallback(
    async (userId: string) => {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", userId)
          .single();

        if (error) {
          return null;
        }
        return data as Profile;
      } catch {
        return null;
      }
    },
    [supabase]
  );

  const refreshProfile = React.useCallback(async () => {
    // Check localStorage customer first
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed?.phone) {
            applyCustomerSession(parsed);
            return;
          }
        }
      } catch {}
    }

    if (!user) return;
    const p = await fetchProfile(user.id);
    if (p) setProfile(p);
  }, [user, fetchProfile, applyCustomerSession]);

  React.useEffect(() => {
    let mounted = true;

    async function initAuth() {
      try {
        // 1. Check local customer session first for immediate offline/instant restoration
        if (typeof window !== "undefined") {
          const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
          if (stored) {
            try {
              const parsed = JSON.parse(stored);
              if (parsed?.name && parsed?.phone) {
                if (mounted) {
                  applyCustomerSession(parsed);
                  setIsLoading(false);
                  return;
                }
              }
            } catch (parseErr) {
              console.warn("Error parsing stored customer:", parseErr);
            }
          }
        }

        // 2. Fall back to Supabase auth session
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session?.user && mounted) {
          setUser(session.user);
          const p = await fetchProfile(session.user.id);
          if (mounted && p) setProfile(p);
        }
      } catch (err) {
        console.error("Auth init error:", err);
      } finally {
        if (mounted) setIsLoading(false);
      }
    }

    initAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!mounted) return;
      // If we already have a customer phone session, do not override unless session exists
      const stored = typeof window !== "undefined" ? localStorage.getItem(LOCAL_STORAGE_KEY) : null;
      if (stored && !session?.user) {
        return;
      }

      const currentUser = session?.user ?? null;
      setUser(currentUser);

      if (currentUser) {
        const p = await fetchProfile(currentUser.id);
        if (mounted) setProfile(p);
      } else if (!stored) {
        setProfile(null);
      }
      setIsLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [supabase, fetchProfile, applyCustomerSession]);

  // Phone-only Login (NO OTP required)
  const loginWithPhone = async (phone: string, name?: string): Promise<AuthResponse> => {
    try {
      const res = await fetch("/api/auth/phone", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, name, action: "login" }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        return {
          success: false,
          notFound: data.notFound || false,
          error: data.error || "Unable to sign in. Please verify your phone number.",
        };
      }

      const customer = data.customer;
      applyCustomerSession(customer);
      showToast.success(data.message || `Welcome back, ${customer.name}!`);
      return { success: true, customer };
    } catch (err: any) {
      const msg = err.message || "Failed to sign in. Please try again.";
      showToast.error(msg);
      return { success: false, error: msg };
    }
  };

  // Phone + Name Signup (NO OTP required)
  const signupWithPhone = async (name: string, phone: string): Promise<AuthResponse> => {
    try {
      const res = await fetch("/api/auth/phone", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, action: "signup" }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        const msg = data.error || "Unable to create account. Please check your details.";
        showToast.error(msg);
        return { success: false, error: msg };
      }

      const customer = data.customer;
      applyCustomerSession(customer);
      showToast.success(data.message || `Welcome to Sreesha Elegance, ${customer.name}!`);
      return { success: true, customer };
    } catch (err: any) {
      const msg = err.message || "Failed to register account.";
      showToast.error(msg);
      return { success: false, error: msg };
    }
  };

  // Legacy Email signIn support
  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        showToast.error(error.message);
        return { error };
      }
      showToast.success("Welcome back to Sreesha Elegance");
      return { error: null };
    } catch (err: any) {
      showToast.error(err.message || "Failed to sign in");
      return { error: err };
    }
  };

  // Legacy Email signUp support
  const signUp = async (email: string, password: string, fullName?: string, phone?: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            phone,
          },
        },
      });

      if (error) {
        showToast.error(error.message);
        return { error };
      }

      showToast.success("Registration successful!");
      return { error: null };
    } catch (err: any) {
      showToast.error(err.message || "Failed to sign up");
      return { error: err };
    }
  };

  const signOut = async () => {
    try {
      if (typeof window !== "undefined") {
        localStorage.removeItem(LOCAL_STORAGE_KEY);
      }
      await supabase.auth.signOut();
      setUser(null);
      setProfile(null);
      showToast.info("Signed out of boutique session");
    } catch (err: any) {
      console.error("Sign out error:", err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isLoading,
        loginWithPhone,
        signupWithPhone,
        signIn,
        signUp,
        signOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
