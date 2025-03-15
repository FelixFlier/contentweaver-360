// src/hooks/use-agent-task.ts
import { useState, useEffect } from 'react';
import { API, AgentTask } from '@/services/apiService';

/**
 * Hook for polling agent task results
 * @param taskId - The ID of the task to poll
 * @param interval - Polling interval in milliseconds
 * @returns Task status and result
 */
export function useAgentTask<T>(taskId: string | null, interval = 2000) {
  const [result, setResult] = useState<T | null>(null);
  const [status, setStatus] = useState<'pending' | 'processing' | 'completed' | 'failed'>('pending');
  const [error, setError] = useState<string | null>(null);
  const [isPolling, setIsPolling] = useState(false);

  useEffect(() => {
    if (!taskId) {
      return;
    }

    let timeoutId: number;
    let unmounted = false;

    const pollTask = async () => {
      try {
        setIsPolling(true);
        const task = await API.agents.getTask(taskId);
        
        if (unmounted) return;
        
        setStatus(task.status);
        
        if (task.status === 'completed') {
          setResult(task.result);
          setIsPolling(false);
        } else if (task.status === 'failed') {
          setError(task.error || 'Task failed');
          setIsPolling(false);
        } else {
          // Continue polling
          timeoutId = window.setTimeout(pollTask, interval);
        }
      } catch (err: any) {
        if (unmounted) return;
        
        setError(err.message || 'Error polling task');
        setStatus('failed');
        setIsPolling(false);
      }
    };

    pollTask();

    return () => {
      unmounted = true;
      clearTimeout(timeoutId);
    };
  }, [taskId, interval]);

  return { result, status, error, isPolling };
}
