import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://kgwtwcchttcamekzqqjx.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_3t9UEKWzWSPxcLKX8Xwmug_f7Ve2jMk";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
