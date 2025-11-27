# 🦌 Hunting Trip Planner

A web application to help you plan and prepare for hunting trips. Built with React and TypeScript.

## Features

- **Trip Details**: Set your trip name and dates
- **Hunting Game Selection**: Choose from various game animals with seasonal information
- **Location Management**: Save hunting locations with state and GPS coordinates
- **Weather Forecast**: Automatically fetches weather data from the National Weather Service API (US locations only)
- **Packing List**: Create and manage your packing list with categories, progress tracking, and item checkoffs

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm

### Installation

```bash
# Install dependencies
npm install

# Start the development server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view the app in your browser.

### Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production

## Usage

1. **Set Trip Details**: Enter your trip name and select start/end dates
2. **Select Hunting Game**: Click on a game animal card to select what you'll be hunting
3. **Add Location**: Enter your hunting location details including GPS coordinates
4. **View Weather**: Once you've entered valid US coordinates, weather data will automatically load
5. **Manage Packing List**: Add items to your packing list and check them off as you pack

## Tech Stack

- React 19
- TypeScript
- Create React App
- National Weather Service API (for weather forecasts)

## License

This project is private and for personal use.
