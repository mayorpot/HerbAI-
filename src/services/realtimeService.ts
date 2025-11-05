// src/services/realtimeService.ts
class RealtimeService {
  private eventSource: EventSource | null = null;
  private listeners: Map<string, Function[]> = new Map();

  connect() {
    // In production, this would connect to a WebSocket or Server-Sent Events
    console.log('🔌 Real-time service connected');
  }

  disconnect() {
    if (this.eventSource) {
      this.eventSource.close();
    }
    console.log('🔌 Real-time service disconnected');
  }

  on(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }

  off(event: string, callback: Function) {
    if (this.listeners.has(event)) {
      const callbacks = this.listeners.get(event)!;
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  emit(event: string, data: any) {
    // Simulate real-time events
    if (this.listeners.has(event)) {
      this.listeners.get(event)!.forEach(callback => {
        setTimeout(() => callback(data), 100);
      });
    }
  }

  // Simulate real-time updates
  simulateNewFeedback() {
    const feedbackTypes = [
      { rating: 5, helpful: true, comment: 'Great advice!' },
      { rating: 4, helpful: true, comment: 'Very helpful recommendations' },
      { rating: 3, helpful: false, comment: 'Could be more specific' }
    ];
    
    const randomFeedback = feedbackTypes[Math.floor(Math.random() * feedbackTypes.length)];
    this.emit('newFeedback', {
      id: Date.now(),
      ...randomFeedback,
      timestamp: new Date().toISOString()
    });
  }

  simulateUserActivity() {
    const activities = ['login', 'consultation', 'remedy_search', 'profile_update'];
    const randomActivity = activities[Math.floor(Math.random() * activities.length)];
    
    this.emit('userActivity', {
      type: randomActivity,
      userId: `user_${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString()
    });
  }
}

export const realtimeService = new RealtimeService();