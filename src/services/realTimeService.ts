// Real-time WebSocket service for multi-user hunting trips
import React from 'react';

// Note: In real implementation, you would install: npm install socket.io-client
// For now, we'll create mock interfaces
interface Socket {
  on(event: string, callback: Function): void;
  emit(event: string, data: any): void;
  disconnect(): void;
}

export interface RealTimeMessage {
  type: 'location_update' | 'party_alert' | 'member_join' | 'member_leave' | 'chat_message' | 'packing_update';
  tripId: string;
  userId: string;
  data: any;
  timestamp: Date;
}

export interface LocationUpdate {
  userId: string;
  location: {
    lat: number;
    lng: number;
    accuracy: number;
  };
  timestamp: Date;
}

export interface PartyAlert {
  alertId: string;
  senderId: string;
  alertType: string;
  message: string;
  location: {
    lat: number;
    lng: number;
  };
  requiresAcknowledgment: boolean;
}

class RealTimeService {
  private socket: Socket | null = null;
  private currentTripId: string | null = null;
  private userId: string | null = null;
  private listeners: Map<string, Function[]> = new Map();

  // Initialize connection
  connect(userId: string, accessToken: string) {
    this.userId = userId;
    
    // Mock socket for demonstration - in real app would use: io(url, options)
    this.socket = {
      on: (event: string, callback: Function) => {
        console.log(`Mock: Listening to ${event}`);
      },
      emit: (event: string, data: any) => {
        console.log(`Mock: Sending ${event}`, data);
      },
      disconnect: () => {
        console.log('Mock: Disconnecting socket');
      }
    } as Socket;

    this.setupEventHandlers();
  }

  // Setup WebSocket event handlers
  private setupEventHandlers() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('Connected to real-time server');
      this.emit('connection_established', { userId: this.userId });
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from real-time server');
      this.emit('connection_lost', {});
    });

    // Handle incoming real-time messages
    this.socket.on('trip_message', (message: RealTimeMessage) => {
      this.handleIncomingMessage(message);
    });

    // Handle member status updates
    this.socket.on('member_status', (data: { userId: string; status: 'online' | 'away' | 'offline' }) => {
      this.emit('member_status_changed', data);
    });

    // Handle trip updates
    this.socket.on('trip_updated', (data: any) => {
      this.emit('trip_data_changed', data);
    });
  }

  // Join a hunting trip room
  joinTrip(tripId: string) {
    if (!this.socket) return;
    
    this.currentTripId = tripId;
    this.socket.emit('join_trip', { tripId, userId: this.userId });
  }

  // Leave current trip room
  leaveTrip() {
    if (!this.socket || !this.currentTripId) return;
    
    this.socket.emit('leave_trip', { tripId: this.currentTripId, userId: this.userId });
    this.currentTripId = null;
  }

  // Send location update to party
  sendLocationUpdate(location: LocationUpdate) {
    if (!this.socket || !this.currentTripId) return;

    const message: RealTimeMessage = {
      type: 'location_update',
      tripId: this.currentTripId,
      userId: this.userId!,
      data: location,
      timestamp: new Date()
    };

    this.socket.emit('trip_message', message);
  }

  // Send party alert
  sendPartyAlert(alert: PartyAlert) {
    if (!this.socket || !this.currentTripId) return;

    const message: RealTimeMessage = {
      type: 'party_alert',
      tripId: this.currentTripId,
      userId: this.userId!,
      data: alert,
      timestamp: new Date()
    };

    this.socket.emit('trip_message', message);
  }

  // Send chat message
  sendChatMessage(text: string, recipientId?: string) {
    if (!this.socket || !this.currentTripId) return;

    const message: RealTimeMessage = {
      type: 'chat_message',
      tripId: this.currentTripId,
      userId: this.userId!,
      data: {
        text,
        recipientId // if private message
      },
      timestamp: new Date()
    };

    this.socket.emit('trip_message', message);
  }

  // Update packing list item
  sendPackingUpdate(itemId: string, updates: any) {
    if (!this.socket || !this.currentTripId) return;

    const message: RealTimeMessage = {
      type: 'packing_update',
      tripId: this.currentTripId,
      userId: this.userId!,
      data: {
        itemId,
        updates,
        updatedBy: this.userId
      },
      timestamp: new Date()
    };

    this.socket.emit('trip_message', message);
  }

  // Handle incoming messages
  private handleIncomingMessage(message: RealTimeMessage) {
    switch (message.type) {
      case 'location_update':
        this.emit('location_updated', message.data);
        break;
      
      case 'party_alert':
        this.emit('alert_received', message.data);
        break;
      
      case 'member_join':
        this.emit('member_joined', message.data);
        break;
      
      case 'member_leave':
        this.emit('member_left', message.data);
        break;
      
      case 'chat_message':
        this.emit('chat_message_received', message.data);
        break;
      
      case 'packing_update':
        this.emit('packing_list_updated', message.data);
        break;
    }
  }

  // Event listener management
  on(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }

  off(event: string, callback: Function) {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      const index = eventListeners.indexOf(callback);
      if (index > -1) {
        eventListeners.splice(index, 1);
      }
    }
  }

  private emit(event: string, data: any) {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.forEach(callback => callback(data));
    }
  }

  // Disconnect
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.currentTripId = null;
    this.listeners.clear();
  }
}

// Singleton instance
export const realTimeService = new RealTimeService();

// React Hook for using real-time service
export const useRealTime = (tripId?: string) => {
  React.useEffect(() => {
    if (tripId) {
      realTimeService.joinTrip(tripId);
    }

    return () => {
      if (tripId) {
        realTimeService.leaveTrip();
      }
    };
  }, [tripId]);

  return {
    sendLocationUpdate: realTimeService.sendLocationUpdate.bind(realTimeService),
    sendPartyAlert: realTimeService.sendPartyAlert.bind(realTimeService),
    sendChatMessage: realTimeService.sendChatMessage.bind(realTimeService),
    sendPackingUpdate: realTimeService.sendPackingUpdate.bind(realTimeService),
    on: realTimeService.on.bind(realTimeService),
    off: realTimeService.off.bind(realTimeService)
  };
};
