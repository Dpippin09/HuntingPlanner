import React, { useState } from 'react';
import './App.css';
import { PackingItem, HuntingLocation, HuntingGame } from './types';
import TripDetails from './components/TripDetails';
import LocationSelector from './components/LocationSelector';
import WeatherForecast from './components/WeatherForecast';
import GameSelector from './components/GameSelector';
import PackingList from './components/PackingList';

function App() {
  const [tripName, setTripName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [location, setLocation] = useState<HuntingLocation | null>(null);
  const [selectedGame, setSelectedGame] = useState<HuntingGame | null>(null);
  const [packingList, setPackingList] = useState<PackingItem[]>([]);

  return (
    <div className="app">
      <header className="app-header">
        <h1>🦌 Hunting Trip Planner</h1>
        <p>Plan and prepare for your next hunting adventure</p>
      </header>

      <main className="app-main">
        <div className="grid-layout">
          <section className="section trip-section">
            <TripDetails
              tripName={tripName}
              startDate={startDate}
              endDate={endDate}
              onTripNameChange={setTripName}
              onStartDateChange={setStartDate}
              onEndDateChange={setEndDate}
            />
          </section>

          <section className="section game-section">
            <GameSelector
              selectedGame={selectedGame}
              onGameSelect={setSelectedGame}
            />
          </section>

          <section className="section location-section">
            <LocationSelector
              location={location}
              onLocationChange={setLocation}
            />
          </section>

          <section className="section weather-section">
            <WeatherForecast
              location={location}
            />
          </section>

          <section className="section packing-section">
            <PackingList
              items={packingList}
              onUpdateItems={setPackingList}
            />
          </section>
        </div>
      </main>

      <footer className="app-footer">
        <p>Happy Hunting! 🎯</p>
      </footer>
    </div>
  );
}

export default App;
