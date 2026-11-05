import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase.js';
import { useAuth } from './use-auth.js';
import {
  fromBodyProfileRow,
  readOnboarding,
  saveOnboarding,
  toBodyProfileRow,
} from '../utils/onboarding-storage.js';

/**
 * 신체 정보(온보딩 결과) 훅
 * - 로그인 전: 브라우저에 저장된 정보 사용
 * - 로그인 후: body_profiles 테이블 사용, 가입 전에 입력한 정보가 있으면 자동으로 DB에 저장
 * @returns {{ body: object|null, isLoading: boolean, errorMessage: string, saveBody: function }}
 */
export function useBodyProfile() {
  const { profile, isLoading: isAuthLoading } = useAuth();
  const [body, setBody] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const upsertBody = useCallback(async (nextBody, userId) => {
    const { error } = await supabase
      .from('body_profiles')
      .upsert(toBodyProfileRow(nextBody, userId), { onConflict: 'user_id' });
    if (error) {
      setErrorMessage('신체 정보를 저장하지 못했습니다.');
      return false;
    }
    saveOnboarding(nextBody, true);
    return true;
  }, []);

  useEffect(() => {
    if (isAuthLoading) return undefined;
    let isCancelled = false;

    const load = async () => {
      const local = readOnboarding();
      if (!profile) {
        setBody(local?.body ?? null);
        setIsLoading(false);
        return;
      }

      /** 가입 직전에 입력한 정보가 아직 DB에 없으면 먼저 저장 */
      if (local?.body && !local.isSynced) {
        await upsertBody(local.body, profile.id);
        if (!isCancelled) {
          setBody(local.body);
          setIsLoading(false);
        }
        return;
      }

      const { data } = await supabase
        .from('body_profiles')
        .select('*')
        .eq('user_id', profile.id)
        .maybeSingle();
      if (!isCancelled) {
        setBody(data ? fromBodyProfileRow(data) : null);
        setIsLoading(false);
      }
    };

    load();
    return () => {
      isCancelled = true;
    };
  }, [profile, isAuthLoading, upsertBody]);

  const saveBody = useCallback(async (nextBody) => {
    saveOnboarding(nextBody, false);
    setBody(nextBody);
    if (profile) {
      return upsertBody(nextBody, profile.id);
    }
    return true;
  }, [profile, upsertBody]);

  return { body, isLoading, errorMessage, saveBody };
}
