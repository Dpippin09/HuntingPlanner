export interface PackingItem {
  id: string;
  name: string;
  category: string;
  packed: boolean;
}

export interface HuntingLocation {
  name: string;
  latitude: number;
  longitude: number;
  state: string;
}

export interface WeatherData {
  date: string;
  temperature: number;
  temperatureUnit: string;
  description: string;
  windSpeed: string;
  icon: string;
}

export interface HuntingGame {
  id: string;
  name: string;
  season: string;
  icon: string;
}

export interface HuntingTrip {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  location: HuntingLocation | null;
  selectedGame: HuntingGame | null;
  packingList: PackingItem[];
  weatherForecast: WeatherData[];
}
