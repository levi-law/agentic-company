import { useEffect, useRef, useState, useCallback } from 'react';
import { dbService } from '@/app/lib/dbService';

interface UseSessionPersistenceProps {
  agentConfig: string;
  activeAgent: string;
  enabled?: boolean;
}

export function useSessionPersistence({ agentConfig, activeAgent, enabled = true }: UseSessionPersistenceProps) {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const sessionInitialized = useRef(false);

  // Initialize or restore session
  useEffect(() => {
    if (!enabled || sessionInitialized.current) return;

    const initializeSession = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Check if there's a session ID in localStorage
        const storedSessionId = localStorage.getItem('currentSessionId');
        
        if (storedSessionId) {
          // Try to restore the session
          try {
            const session = await dbService.getSession(storedSessionId);
            if (session && session.status === 'active') {
              setSessionId(storedSessionId);
              dbService.setSessionId(storedSessionId);
              console.log('[Session] Restored session:', storedSessionId);
              sessionInitialized.current = true;
              setIsLoading(false);
              return;
            }
          } catch {
            console.warn('[Session] Failed to restore session, creating new one');
          }
        }

        // Create new session
        const newSession = await dbService.createSession(agentConfig, activeAgent);
        setSessionId(newSession.id);
        localStorage.setItem('currentSessionId', newSession.id);
        console.log('[Session] Created new session:', newSession.id);
        sessionInitialized.current = true;
      } catch (err) {
        console.error('[Session] Failed to initialize session:', err);
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeSession();
  }, [agentConfig, activeAgent, enabled]);

  // Update active agent when it changes
  useEffect(() => {
    if (!sessionId || !enabled) return;

    const updateActiveAgent = async () => {
      try {
        await dbService.updateSession(sessionId, { activeAgent });
      } catch (error) {
        console.error('[Session] Failed to update active agent:', error);
      }
    };

    updateActiveAgent();
  }, [sessionId, activeAgent, enabled]);

  // Save message to database
  const saveMessage = useCallback(async (role: 'user' | 'assistant', content: string, isSimulated = false, metadata?: any) => {
    if (!sessionId || !enabled) return;

    try {
      await dbService.saveMessage(sessionId, role, content, isSimulated, metadata);
    } catch (err) {
      console.error('[Session] Failed to save message:', err);
    }
  }, [sessionId, enabled]);

  // Save event to database
  const saveEvent = useCallback(async (direction: 'client' | 'server', eventName: string, eventData: any) => {
    if (!sessionId || !enabled) return;

    try {
      await dbService.saveEvent(sessionId, direction, eventName, eventData);
    } catch (err) {
      console.error('[Session] Failed to save event:', err);
    }
  }, [sessionId, enabled]);

  // Save tasks to database
  const saveTasks = useCallback(async (tasks: any[], businessId?: string) => {
    if (!sessionId || !enabled) return;

    try {
      await dbService.saveTasks(sessionId, tasks, businessId);
    } catch (err) {
      console.error('[Session] Failed to save tasks:', err);
    }
  }, [sessionId, enabled]);

  // Save business plan to database
  const saveBusinessPlan = useCallback(async (businessPlan: any) => {
    if (!sessionId || !enabled) return;

    try {
      await dbService.saveBusinessPlan(sessionId, businessPlan);
    } catch (err) {
      console.error('[Session] Failed to save business plan:', err);
    }
  }, [sessionId, enabled]);

  // Load session history
  const loadSessionHistory = async (sessionIdToLoad: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const session = await dbService.getSession(sessionIdToLoad);
      setSessionId(sessionIdToLoad);
      dbService.setSessionId(sessionIdToLoad);
      localStorage.setItem('currentSessionId', sessionIdToLoad);
      return session;
    } catch (err) {
      console.error('[Session] Failed to load session:', err);
      setError(err as Error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // End current session
  const endSession = async () => {
    if (!sessionId || !enabled) return;

    try {
      await dbService.updateSession(sessionId, { status: 'completed' });
      localStorage.removeItem('currentSessionId');
      setSessionId(null);
      sessionInitialized.current = false;
    } catch (err) {
      console.error('[Session] Failed to end session:', err);
    }
  };

  // Get all sessions
  const getAllSessions = async () => {
    try {
      return await dbService.getAllSessions();
    } catch (err) {
      console.error('[Session] Failed to get all sessions:', err);
      return [];
    }
  };

  return {
    sessionId,
    isLoading,
    error,
    saveMessage,
    saveEvent,
    saveTasks,
    saveBusinessPlan,
    loadSessionHistory,
    endSession,
    getAllSessions,
  };
}
