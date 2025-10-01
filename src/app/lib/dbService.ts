// Database service layer for client-side operations

export class DatabaseService {
  private sessionId: string | null = null;
  private createSessionPromise: Promise<any> | null = null;

  // Session Management
  async createSession(agentConfig: string, activeAgent?: string, userId?: string): Promise<any> {
    // Prevent duplicate session creation requests
    if (this.createSessionPromise) {
      console.log('[dbService] Reusing existing createSession request');
      return this.createSessionPromise;
    }

    this.createSessionPromise = (async () => {
      try {
        const response = await fetch('/api/db/session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ agentConfig, activeAgent, userId }),
        });
        
        if (!response.ok) throw new Error('Failed to create session');
        const data = await response.json();
        this.sessionId = data.id;
        return data;
      } finally {
        // Clear the promise after completion
        this.createSessionPromise = null;
      }
    })();

    return this.createSessionPromise;
  }

  async getSession(sessionId: string): Promise<any> {
    const response = await fetch(`/api/db/session?sessionId=${sessionId}`);
    if (!response.ok) throw new Error('Failed to fetch session');
    return response.json();
  }

  async updateSession(sessionId: string, updates: { activeAgent?: string; status?: string }): Promise<any> {
    const response = await fetch('/api/db/session', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId, ...updates }),
    });
    
    if (!response.ok) throw new Error('Failed to update session');
    return response.json();
  }

  async getAllSessions(): Promise<any[]> {
    const response = await fetch('/api/db/session');
    if (!response.ok) throw new Error('Failed to fetch sessions');
    return response.json();
  }

  async getUserSessions(userId: string): Promise<any[]> {
    const response = await fetch(`/api/db/session?userId=${userId}`);
    if (!response.ok) throw new Error('Failed to fetch user sessions');
    const data = await response.json();
    return Array.isArray(data) ? data : [data];
  }

  async linkSessionToUser(sessionId: string, userId: string): Promise<any> {
    const response = await fetch('/api/db/session', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId, userId }),
    });
    
    if (!response.ok) throw new Error('Failed to link session to user');
    return response.json();
  }

  // Message Management
  async saveMessage(sessionId: string, role: string, content: string, isSimulated = false, metadata?: any): Promise<any> {
    const response = await fetch('/api/db/message', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId, role, content, isSimulated, metadata }),
    });
    
    if (!response.ok) throw new Error('Failed to save message');
    return response.json();
  }

  async getMessages(sessionId: string): Promise<any[]> {
    const response = await fetch(`/api/db/message?sessionId=${sessionId}`);
    if (!response.ok) throw new Error('Failed to fetch messages');
    return response.json();
  }

  // Event Management
  async saveEvent(sessionId: string, direction: 'client' | 'server', eventName: string, eventData: any): Promise<any> {
    const response = await fetch('/api/db/event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId, direction, eventName, eventData }),
    });
    
    if (!response.ok) throw new Error('Failed to save event');
    return response.json();
  }

  async getEvents(sessionId: string): Promise<any[]> {
    const response = await fetch(`/api/db/event?sessionId=${sessionId}`);
    if (!response.ok) throw new Error('Failed to fetch events');
    return response.json();
  }

  // Task Management
  async saveTasks(sessionId: string, tasks: any[], businessId?: string): Promise<any> {
    const response = await fetch('/api/db/task', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId, tasks, businessId }),
    });
    
    if (!response.ok) throw new Error('Failed to save tasks');
    return response.json();
  }

  async getTasks(sessionId: string): Promise<any[]> {
    const response = await fetch(`/api/db/task?sessionId=${sessionId}`);
    if (!response.ok) throw new Error('Failed to fetch tasks');
    return response.json();
  }

  async updateTask(taskId: string, updates: {
    status?: string;
    progress?: number;
    blockers?: string;
    startedAt?: string;
    completedAt?: string;
    actualHours?: number;
  }): Promise<any> {
    const response = await fetch('/api/db/task', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ taskId, ...updates }),
    });
    
    if (!response.ok) throw new Error('Failed to update task');
    return response.json();
  }

  // Business Plan Management
  async saveBusinessPlan(sessionId: string, businessPlan: any): Promise<any> {
    const response = await fetch('/api/db/business-plan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId, ...businessPlan }),
    });
    
    if (!response.ok) throw new Error('Failed to save business plan');
    return response.json();
  }

  async getBusinessPlan(sessionId: string): Promise<any> {
    const response = await fetch(`/api/db/business-plan?sessionId=${sessionId}`);
    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error('Failed to fetch business plan');
    }
    return response.json();
  }

  // Utility
  getCurrentSessionId(): string | null {
    return this.sessionId;
  }

  setSessionId(sessionId: string): void {
    this.sessionId = sessionId;
  }
}

// Singleton instance
export const dbService = new DatabaseService();
