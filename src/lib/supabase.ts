import { createClient, type SupabaseClient } from '@supabase/supabase-js'

/**
 * Browser-safe Supabase defaults for the portfolio project.
 * The publishable key is intentionally safe to expose when RLS is configured.
 * Environment variables override these values for Vercel/local deployment.
 */
const DEFAULT_SUPABASE_URL = 'https://sqgtzozlukfhfhrieuws.supabase.co'
const DEFAULT_SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_3ZplHSHTDPy2f-lyCm_Tpg_o2R8iNZT'

const url = import.meta.env.VITE_SUPABASE_URL?.trim() || DEFAULT_SUPABASE_URL
const publishableKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim() ||
  import.meta.env.VITE_SUPABASE_ANON_KEY?.trim() ||
  DEFAULT_SUPABASE_PUBLISHABLE_KEY

export const supabase: SupabaseClient = createClient(url, publishableKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
})
