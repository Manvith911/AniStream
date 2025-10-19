import { supabase } from "./supabase";

// Login with email/password
export const login = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error: error?.message };
};

// Signup with email/password (only)
export const signUp = async ({ email, password }) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${window.location.origin}/login`, // redirect after confirmation
    },
  });

  // Profile will not be created here; user can update in Profile page later
  return { data, error: error?.message };
};

// Google login
export const loginWithGoogle = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${window.location.origin}/home`,
    },
  });
  return { data, error: error?.message };
};

// Logout
export const logout = async () => {
  const { error } = await supabase.auth.signOut();
  return { error: error?.message };
};
