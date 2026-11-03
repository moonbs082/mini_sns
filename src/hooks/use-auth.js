import { useContext } from 'react';
import { AuthContext } from './auth-context.js';

/**
 * 로그인 정보 훅
 * @returns {{ session: object|null, profile: object|null, isLoading: boolean, refreshProfile: function, signOut: function }}
 */
export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) {
    throw new Error('useAuth는 AuthProvider 안에서만 사용할 수 있습니다.');
  }
  return value;
}
