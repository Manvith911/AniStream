import { supabase } from "./supabaseClient";

/**
 * 🔐 Sign up a new user and create their profile record
 */
export const signUp = async ({ email, password, username, gender, bio }) => {
  try {
    // Create auth user
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username, gender, bio },
      },
    });

    if (error) throw error;
    const user = data.user;
    if (!user) throw new Error("User creation failed");

    // Insert into profiles table
    const { error: profileError } = await supabase.from("profiles").insert([
      {
        id: user.id,
        email,
        username,
        gender,
        bio,
        avatar_url: `https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${username || "User"}`,
      },
    ]);

    if (profileError) throw profileError;

    return { user, message: "Signup successful" };
  } catch (err) {
    console.error("SignUp Error:", err);
    return { error: err.message };
  }
};

/**
 * 🔑 Log in existing user with email and password
 */
export const login = async (email, password) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return { user: data.user, message: "Login successful" };
  } catch (err) {
    console.error("Login Error:", err);
    return { error: err.message };
  }
};

/**
 * 🌐 Continue with Google login
 */
export const loginWithGoogle = async () => {
  try {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });
    if (error) throw error;
    return { message: "Redirecting to Google..." };
  } catch (err) {
    console.error("Google Login Error:", err);
    return { error: err.message };
  }
};

/**
 * 🚪 Logout current user
 */
export const logout = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { message: "Logged out successfully" };
  } catch (err) {
    console.error("Logout Error:", err);
    return { error: err.message };
  }
};

/**
 * 🧑 Get currently logged-in user (with profile)
 */
export const getCurrentUser = async () => {
  try {
    const { data: authData } = await supabase.auth.getUser();
    const user = authData?.user;
    if (!user) return { user: null };

    const { data: profile, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (error) throw error;

    return { user, profile };
  } catch (err) {
    console.error("GetCurrentUser Error:", err);
    return { error: err.message };
  }
};
