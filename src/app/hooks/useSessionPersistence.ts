import { useEffect, useRef, useState, useCallback } from 'react';
import { dbService } from '@/app/lib/dbService';
import { useAuth } from '@/app/contexts/AuthContext';

interface UseSessionPersistenceProps {
  agentConfig: string;
  activeAgent: string;
  enabled?: boolean;
}

// Global promise tracker to prevent duplicate session creation across all instances
let initializationPromise: Promise<string> | null = null;

export function useSessionPersistence({ agentConfig, activeAgent, enabled = true }: UseSessionPersistenceProps) {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const sessionInitialized = useRef(false);
  const initializationInProgress = useRef(false);
  const { user, isAuthenticated } = useAuth();

  // Initialize or restore session
  useEffect(() => {
    if (!enabled) return;
    
    // Strong guard: prevent multiple initializations
    if (sessionInitialized.current) {
      console.log('[Session] Already initialized, skipping');
      return;
    }
    
    if (initializationInProgress.current) {
      console.log('[Session] Initialization in progress, skipping');
      return;
    }

    // Mark as in progress immediately to prevent race conditions
    initializationInProgress.current = true;

    const initializeSession = async (): Promise<string> => {
      // If there's already an initialization in progress globally, wait for it
      if (initializationPromise) {
        console.log('[Session] Waiting for existing initialization...');
        try {
          const existingSessionId = await initializationPromise;
          setSessionId(existingSessionId);
          dbService.setSessionId(existingSessionId);
          sessionInitialized.current = true;
          return existingSessionId;
        } catch (err) {
          console.error('[Session] Failed to wait for existing initialization:', err);
          // Continue to create new session
        }
      }

      setIsLoading(true);
      setError(null);

      try {
        // PRIORITY 1: Check localStorage first (fastest, most reliable)
        const storedSessionId = localStorage.getItem('currentSessionId');
        
        if (storedSessionId) {
          try {
            const session = await dbService.getSession(storedSessionId);
            if (session && session.status === 'active') {
              // If user is authenticated and session isn't linked, link it
              if (isAuthenticated && user && !session.userId) {
                await dbService.linkSessionToUser(storedSessionId, user.id);
                console.log('[Session] Linked anonymous session to user:', user.id);
              }
              
              setSessionId(storedSessionId);
              dbService.setSessionId(storedSessionId);
              console.log('[Session] Restored session from localStorage:', storedSessionId);
              sessionInitialized.current = true;
              setIsLoading(false);
              return storedSessionId;
            } else {
              // Session is inactive or doesn't exist, clear it
              localStorage.removeItem('currentSessionId');
              console.log('[Session] Cleared invalid session from localStorage');
            }
          } catch (error) {
            console.warn('[Session] Failed to restore localStorage session:', error);
            localStorage.removeItem('currentSessionId');
          }
        }

        // PRIORITY 2: If authenticated, check for active user sessions
        if (isAuthenticated && user) {
          try {
            const userSessions = await dbService.getUserSessions(user.id);
            const activeSession = userSessions.find(
              (s: any) => s.status === 'active' && s.agentConfig === agentConfig
            );
            
            if (activeSession) {
              setSessionId(activeSession.id);
              dbService.setSessionId(activeSession.id);
              localStorage.setItem('currentSessionId', activeSession.id);
              console.log('[Session] Restored active user session:', activeSession.id);
              sessionInitialized.current = true;
              setIsLoading(false);
              return activeSession.id;
            }
          } catch (error) {
            console.warn('[Session] Failed to load user sessions:', error);
          }
        }

        // PRIORITY 3: Create new session (only if no existing session found)
        console.log('[Session] Creating new session...');
        const newSession = await dbService.createSession(
          agentConfig, 
          activeAgent, 
          isAuthenticated && user ? user.id : undefined
        );
        setSessionId(newSession.id);
        dbService.setSessionId(newSession.id);
        localStorage.setItem('currentSessionId', newSession.id);
        console.log('[Session] Created new session:', newSession.id, isAuthenticated ? `for user: ${user?.id}` : '(anonymous)');
        sessionInitialized.current = true;
        setIsLoading(false);
        return newSession.id;
      } catch (err) {
        console.error('[Session] Failed to initialize session:', err);
        setError(err as Error);
        throw err;
      } finally {
        setIsLoading(false);
        initializationInProgress.current = false;
        initializationPromise = null;
      }
    };

    // Store the promise globally to prevent duplicate requests
    initializationPromise = initializeSession();
    initializationPromise.catch(() => {
      // Clean up on error
      initializationInProgress.current = false;
      initializationPromise = null;
    });
    
    // Cleanup function for React Strict Mode
    return () => {
      // Don't reset if session was successfully initialized
      if (!sessionInitialized.current) {
        initializationInProgress.current = false;
      }
    };
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled]); // Only re-run if enabled changes

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
      initializationInProgress.current = false;
      initializationPromise = null;
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
