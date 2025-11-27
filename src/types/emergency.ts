// Emergency alert types and interfaces

export interface EmergencyAlert {
  id: string;
  tripId: string;
  senderId: string;
  senderName: string;
  alertType: EmergencyType;
  location: {
    lat: number;
    lng: number;
    accuracy?: number;
  };
  timestamp: Date;
  message?: string;
  isResolved: boolean;
  resolvedAt?: Date;
  resolvedBy?: string;
}

export enum EmergencyType {
  LOST = 'lost',
  INJURED = 'injured',
  EQUIPMENT_FAILURE = 'equipment_failure',
  SEVERE_WEATHER = 'severe_weather',
  WILDLIFE_ENCOUNTER = 'wildlife_encounter',
  GENERAL_EMERGENCY = 'general_emergency'
}

export interface EmergencyContact {
  name: string;
  phone: string;
  relationship: string;
}

export interface EmergencySettings {
  enableGPS: boolean;
  enableNotifications: boolean;
  emergencyContacts: EmergencyContact[];
  autoShareLocation: boolean;
  checkInInterval: number; // minutes
}
