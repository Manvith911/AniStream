// src/services/supabaseClient.js
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://bjitlknvvjhflpqcoeww.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_Q-4vq83eR29Xgu0ZnZMrHw_Qhx-mTMu";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
