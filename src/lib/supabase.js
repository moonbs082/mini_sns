import { createClient } from '@supabase/supabase-js';

/** Supabase 클라이언트 (URL/키는 .env 또는 GitHub Secrets에서 주입) */
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
);
