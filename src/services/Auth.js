import { supabase } from "./supabase";

// Email/password login
export const login = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error: error?.message };
};

// Email/password signup (only)
export const signUp = async ({ email, password }) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${window.location.origin}/login`,
    },
  });
  return { data, error: error?.message };
};

// Google login
export const loginWithGoogle = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: `${window.location.origin}/home` },
  });
  return { data, error: error?.message };
};

// Logout
export const logout = async () => {
  const { error } = await supabase.auth.signOut();
  return { error: error?.message };
};
