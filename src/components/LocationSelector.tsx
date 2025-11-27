import React, { useState } from 'react';
import { HuntingLocation } from '../types';
import './LocationSelector.css';

interface LocationSelectorProps {
  location: HuntingLocation | null;
  onLocationChange: (location: HuntingLocation | null) => void;
}

const US_STATES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado',
  'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho',
  'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana',
  'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota',
  'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada',
  'New Hampshire', 'New Jersey', 'New Mexico', 'New York',
  'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon',
  'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
  'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington',
  'West Virginia', 'Wisconsin', 'Wyoming',
];

const LocationSelector: React.FC<LocationSelectorProps> = ({
  location,
  onLocationChange,
}) => {
  const [name, setName] = useState(location?.name || '');
  const [state, setState] = useState(location?.state || US_STATES[0]);
  const [latitude, setLatitude] = useState(location?.latitude?.toString() || '');
  const [longitude, setLongitude] = useState(location?.longitude?.toString() || '');

  const handleSaveLocation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const lat = parseFloat(latitude) || 0;
    const lng = parseFloat(longitude) || 0;

    onLocationChange({
      name: name.trim(),
      state,
      latitude: lat,
      longitude: lng,
    });
  };

  const handleClearLocation = () => {
    setName('');
    setLatitude('');
    setLongitude('');
    onLocationChange(null);
  };

  return (
    <div className="location-selector">
      <h2>📍 Hunting Location</h2>

      <form className="location-form" onSubmit={handleSaveLocation}>
        <div className="form-group">
          <label htmlFor="location-name">Location Name</label>
          <input
            id="location-name"
            type="text"
            placeholder="e.g., Pine Ridge Forest"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="location-state">State</label>
          <select
            id="location-state"
            value={state}
            onChange={(e) => setState(e.target.value)}
          >
            {US_STATES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="location-lat">Latitude</label>
            <input
              id="location-lat"
              type="number"
              step="any"
              placeholder="e.g., 45.5231"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="location-lng">Longitude</label>
            <input
              id="location-lng"
              type="number"
              step="any"
              placeholder="e.g., -122.6765"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
            />
          </div>
        </div>

        <div className="button-group">
          <button type="submit" className="save-button">
            Save Location
          </button>
          {location && (
            <button
              type="button"
              className="clear-button"
              onClick={handleClearLocation}
            >
              Clear
            </button>
          )}
        </div>
      </form>

      {location && (
        <div className="current-location">
          <h3>Current Location</h3>
          <p className="location-details">
            <strong>{location.name}</strong>
            <br />
            {location.state}
            {location.latitude !== 0 && location.longitude !== 0 && (
              <>
                <br />
                <span className="coordinates">
                  ({location.latitude.toFixed(4)}, {location.longitude.toFixed(4)})
                </span>
              </>
            )}
          </p>
        </div>
      )}
    </div>
  );
};

export default LocationSelector;
