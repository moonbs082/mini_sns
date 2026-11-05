import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase.js';
import { useAuth } from './use-auth.js';
import { toKoreanErrorMessage } from '../utils/db-error.js';

/**
 * 내 운동 기록(workout_logs) 훅
 * @returns {{ logs: object[], doneDateKeys: Set<string>, isLoading: boolean, errorMessage: string, addLog: function, deleteLog: function }}
 */
export function useWorkoutLogs() {
  const { profile } = useAuth();
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const loadLogs = useCallback(async () => {
    if (!profile) {
      setLogs([]);
      setIsLoading(false);
      return;
    }
    const { data, error } = await supabase
      .from('workout_logs')
      .select('*')
      .eq('user_id', profile.id)
      .order('workout_date', { ascending: false })
      .order('created_at', { ascending: true })
      .limit(200);
    if (error) setErrorMessage(toKoreanErrorMessage(error));
    setLogs(data ?? []);
    setIsLoading(false);
  }, [profile]);

  useEffect(() => {
    loadLogs();
  }, [loadLogs]);

  const addLog = useCallback(async (log) => {
    setErrorMessage('');
    const { error } = await supabase.from('workout_logs').insert({ ...log, user_id: profile.id });
    if (error) {
      setErrorMessage(toKoreanErrorMessage(error));
      return false;
    }
    await loadLogs();
    return true;
  }, [profile, loadLogs]);

  const deleteLog = useCallback(async (logId) => {
    const { error } = await supabase.from('workout_logs').delete().eq('id', logId);
    if (error) {
      setErrorMessage(toKoreanErrorMessage(error));
      return;
    }
    setLogs((prev) => prev.filter((log) => log.id !== logId));
  }, []);

  const doneDateKeys = new Set(logs.map((log) => log.workout_date));

  return { logs, doneDateKeys, isLoading, errorMessage, addLog, deleteLog };
}
