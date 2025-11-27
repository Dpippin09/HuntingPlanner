// Types for the hunting planner application

export interface HuntingTrip {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  location: {
    name: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  gameType: GameType;
  packingList: PackingItem[];
  huntingParty: HunterMember[];
  weatherData?: WeatherData;
  notes: string;
}

export interface PackingItem {
  id: string;
  name: string;
  category: PackingCategory;
  isPacked: boolean;
  isRequired: boolean;
  notes?: string;
}

export enum PackingCategory {
  WEAPONS = 'weapons',
  CLOTHING = 'clothing',
  SAFETY = 'safety',
  CAMPING = 'camping',
  FOOD = 'food',
  ELECTRONICS = 'electronics',
  TOOLS = 'tools',
  LICENSES = 'licenses',
  OTHER = 'other'
}

export interface HunterMember {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  role: string;
  licenseNumber?: string;
  emergencyContact?: {
    name: string;
    phone: string;
  };
}

export enum GameType {
  DEER = 'deer',
  ELK = 'elk',
  BEAR = 'bear',
  DUCK = 'duck',
  TURKEY = 'turkey',
  FISH = 'fish',
  RABBIT = 'rabbit',
  SQUIRREL = 'squirrel',
  PHEASANT = 'pheasant',
  OTHER = 'other'
}

export interface WeatherData {
  current: {
    temperature: number;
    humidity: number;
    windSpeed: number;
    windDirection: string;
    conditions: string;
    icon: string;
  };
  forecast: WeatherForecast[];
}

export interface WeatherForecast {
  date: Date;
  high: number;
  low: number;
  conditions: string;
  icon: string;
  precipitation: number;
  windSpeed: number;
}

export interface MapLocation {
  name: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  type: 'hunting_spot' | 'camp' | 'parking' | 'landmark';
  notes?: string;
}

// Re-export emergency types
export * from './emergency';
