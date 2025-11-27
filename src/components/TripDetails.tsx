import React from 'react';
import './TripDetails.css';

interface TripDetailsProps {
  tripName: string;
  startDate: string;
  endDate: string;
  onTripNameChange: (name: string) => void;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
}

const TripDetails: React.FC<TripDetailsProps> = ({
  tripName,
  startDate,
  endDate,
  onTripNameChange,
  onStartDateChange,
  onEndDateChange,
}) => {
  return (
    <div className="trip-details">
      <h2>🏕️ Trip Details</h2>

      <div className="details-form">
        <div className="form-group">
          <label htmlFor="trip-name">Trip Name</label>
          <input
            id="trip-name"
            type="text"
            placeholder="e.g., Fall Deer Hunt 2024"
            value={tripName}
            onChange={(e) => onTripNameChange(e.target.value)}
          />
        </div>

        <div className="date-row">
          <div className="form-group">
            <label htmlFor="start-date">Start Date</label>
            <input
              id="start-date"
              type="date"
              value={startDate}
              onChange={(e) => onStartDateChange(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="end-date">End Date</label>
            <input
              id="end-date"
              type="date"
              value={endDate}
              onChange={(e) => onEndDateChange(e.target.value)}
            />
          </div>
        </div>

        {startDate && endDate && (
          <div className="trip-duration">
            {(() => {
              const start = new Date(startDate);
              const end = new Date(endDate);
              const diffTime = Math.abs(end.getTime() - start.getTime());
              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
              return <p>📅 {diffDays} day{diffDays !== 1 ? 's' : ''} trip</p>;
            })()}
          </div>
        )}
      </div>
    </div>
  );
};

export default TripDetails;
