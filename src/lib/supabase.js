import { createClient } from '@supabase/supabase-js';

/**
 * Supabase 클라이언트 (URL/키는 .env 또는 GitHub Secrets에서 주입)
 * - HashRouter(#/경로)와 충돌하지 않도록 SNS 로그인 콜백은 PKCE(?code=) 방식 사용
 */
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
  {
    auth: {
      flowType: 'pkce',
    },
  },
);
