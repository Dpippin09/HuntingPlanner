import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { EmergencyAlert, EmergencyType, EmergencySettings } from '../types/emergency';
import { useHuntingTrip } from './HuntingTripContext';

interface EmergencyContextType {
  alerts: EmergencyAlert[];
  settings: EmergencySettings;
  currentLocation: GeolocationPosition | null;
  isTracking: boolean;
  
  // Emergency actions
  sendEmergencyAlert: (type: EmergencyType, message?: string) => void;
  resolveAlert: (alertId: string) => void;
  updateSettings: (settings: Partial<EmergencySettings>) => void;
  
  // Location tracking
  startLocationTracking: () => void;
  stopLocationTracking: () => void;
  getCurrentLocation: () => Promise<GeolocationPosition>;
  
  // Party member location sharing
  shareLocationWithParty: () => void;
}

const EmergencyContext = createContext<EmergencyContextType | undefined>(undefined);

export const useEmergency = () => {
  const context = useContext(EmergencyContext);
  if (!context) {
    throw new Error('useEmergency must be used within an EmergencyProvider');
  }
  return context;
};

const defaultSettings: EmergencySettings = {
  enableGPS: true,
  enableNotifications: true,
  emergencyContacts: [],
  autoShareLocation: true,
  checkInInterval: 30 // 30 minutes
};

export const EmergencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentTrip } = useHuntingTrip();
  const [alerts, setAlerts] = useState<EmergencyAlert[]>([]);
  const [settings, setSettings] = useState<EmergencySettings>(defaultSettings);
  const [currentLocation, setCurrentLocation] = useState<GeolocationPosition | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const [watchId, setWatchId] = useState<number | null>(null);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  // Load saved alerts and settings
  useEffect(() => {
    if (currentTrip) {
      const savedAlerts = localStorage.getItem(`emergency-alerts-${currentTrip.id}`);
      if (savedAlerts) {
        setAlerts(JSON.parse(savedAlerts).map((alert: any) => ({
          ...alert,
          timestamp: new Date(alert.timestamp),
          resolvedAt: alert.resolvedAt ? new Date(alert.resolvedAt) : undefined
        })));
      }
      
      const savedSettings = localStorage.getItem('emergency-settings');
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
    }
  }, [currentTrip]);

  // Save alerts when they change
  useEffect(() => {
    if (currentTrip && alerts.length > 0) {
      localStorage.setItem(`emergency-alerts-${currentTrip.id}`, JSON.stringify(alerts));
    }
  }, [alerts, currentTrip]);

  // Save settings when they change
  useEffect(() => {
    localStorage.setItem('emergency-settings', JSON.stringify(settings));
  }, [settings]);

  const getCurrentLocation = useCallback((): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation(position);
          resolve(position);
        },
        (error) => {
          console.error('Error getting location:', error);
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000 // 1 minute
        }
      );
    });
  }, []);

  const startLocationTracking = useCallback(() => {
    if (!navigator.geolocation || !settings.enableGPS) return;

    const id = navigator.geolocation.watchPosition(
      (position) => {
        setCurrentLocation(position);
        
        // Auto-share location with party if enabled
        if (settings.autoShareLocation) {
          // In a real app, this would send to other party members
          console.log('Location updated:', position.coords);
        }
      },
      (error) => {
        console.error('Location tracking error:', error);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 60000
      }
    );

    setWatchId(id);
    setIsTracking(true);
  }, [settings.enableGPS, settings.autoShareLocation]);

  const stopLocationTracking = useCallback(() => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
      setIsTracking(false);
    }
  }, [watchId]);

  const sendEmergencyAlert = useCallback(async (type: EmergencyType, message?: string) => {
    if (!currentTrip) return;

    try {
      // Get current location
      const position = await getCurrentLocation();
      
      const alert: EmergencyAlert = {
        id: generateId(),
        tripId: currentTrip.id,
        senderId: 'current-user', // In a real app, this would be the actual user ID
        senderName: 'You', // In a real app, this would be the actual user name
        alertType: type,
        location: {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy
        },
        timestamp: new Date(),
        message: message || getDefaultMessage(type),
        isResolved: false
      };

      setAlerts(prev => [alert, ...prev]);

      // Send notifications to party members only (in a real app, this would use a backend service)
      notifyPartyMembers(alert);

      return alert;
    } catch (error) {
      console.error('Failed to send party alert:', error);
      throw error;
    }
  }, [currentTrip, getCurrentLocation]);

  const resolveAlert = useCallback((alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId 
        ? { 
            ...alert, 
            isResolved: true, 
            resolvedAt: new Date(),
            resolvedBy: 'current-user'
          }
        : alert
    ));
  }, []);

  const updateSettings = useCallback((newSettings: Partial<EmergencySettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  const shareLocationWithParty = useCallback(async () => {
    if (!currentTrip) return;

    try {
      const position = await getCurrentLocation();
      
      // In a real app, this would send the location to party members
      console.log('Sharing location with party:', {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        timestamp: new Date()
      });
      
      // For demo purposes, create a location share "alert"
      const locationShare = {
        type: 'location-share',
        location: {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        },
        timestamp: new Date(),
        sender: 'You'
      };
      
      console.log('Location shared:', locationShare);
    } catch (error) {
      console.error('Failed to share location:', error);
    }
  }, [currentTrip, getCurrentLocation]);

  // Helper functions
  const getDefaultMessage = (type: EmergencyType): string => {
    switch (type) {
      case EmergencyType.LOST:
        return 'I am lost and need assistance finding my way back to the group.';
      case EmergencyType.INJURED:
        return 'I am injured and need help from the hunting party.';
      case EmergencyType.EQUIPMENT_FAILURE:
        return 'I have equipment failure and need assistance from the group.';
      case EmergencyType.SEVERE_WEATHER:
        return 'Severe weather conditions, seeking shelter. Party please check in.';
      case EmergencyType.WILDLIFE_ENCOUNTER:
        return 'Wildlife encounter, staying put. Party please be aware of my location.';
      default:
        return 'Need assistance from hunting party - please check my location.';
    }
  };

  const notifyPartyMembers = (alert: EmergencyAlert) => {
    // Send notifications to hunting party members only (not emergency services)
    console.log('Notifying hunting party members of alert:', alert);
    
    // Show browser notification if permitted
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(`Alert from ${alert.senderName}`, {
        body: `${alert.message} - Location shared with party.`,
        icon: '/favicon.ico',
        tag: 'party-alert'
      });
    }
  };

  // Request notification permission on mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const value = {
    alerts,
    settings,
    currentLocation,
    isTracking,
    sendEmergencyAlert,
    resolveAlert,
    updateSettings,
    startLocationTracking,
    stopLocationTracking,
    getCurrentLocation,
    shareLocationWithParty
  };

  return (
    <EmergencyContext.Provider value={value}>
      {children}
    </EmergencyContext.Provider>
  );
};
