
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Pastikan Anda membuat file .env dan mengisinya dengan kredensial Supabase Anda untuk mengaktifkan fitur Login
// REACT_APP_SUPABASE_URL=...
// REACT_APP_SUPABASE_ANON_KEY=...

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

// Only initialize if keys are present to avoid "supabaseUrl is required" error
export const supabase: SupabaseClient | null = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
