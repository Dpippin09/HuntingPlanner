# Hunting Planner

A comprehensive planning and preparation tool for hunting and fishing trips.

## Features

🎯 **Trip Management**
- Create and manage multiple hunting/fishing trips
- Track trip dates, locations, and game types
- Dashboard overview of all your trips

📋 **Packing List**
- Smart packing checklist with pre-populated essential items
- Categorized items (weapons, clothing, safety, food, etc.)
- Track packing progress with visual indicators
- Mark required vs. optional items

🌤️ **Weather Monitor**
- View current weather conditions for your hunting location
- 5-day weather forecast
- Hunting conditions assessment based on weather
- Integration ready for OpenWeatherMap API

🗺️ **Interactive Map**
- Mark hunting spots, camps, parking areas, and landmarks
- Interactive map with custom markers
- Save and manage multiple locations per trip
- Click-to-add new location functionality

👥 **Hunting Party Management**
- Add and manage hunting party members
- Track contact information and emergency contacts
- Record hunting license numbers
- Organize roles and responsibilities

🦌 **Game Selection & Information**
- Detailed information for 9 different game types
- Hunting tips and recommended gear
- License requirements and hunting seasons
- Difficulty ratings and preparation guides

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone this repository or download the source code
2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open your browser and navigate to `http://localhost:3000` (or the port shown in the terminal)

### Building for Production

To create a production build:
```bash
npm run build
```

## Usage

1. **Create Your First Trip**: Click "Create New Trip" on the dashboard to set up your hunting expedition
2. **Select Your Game**: Choose what you're hunting from deer, elk, bear, duck, turkey, fish, and more
3. **Plan Your Packing**: Use the smart packing list to ensure you have everything needed
4. **Check the Weather**: Monitor conditions to plan the best hunting days
5. **Mark Your Spots**: Use the interactive map to mark hunting locations and important landmarks
6. **Organize Your Party**: Add hunting partners with their contact and license information

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **UI Framework**: Material-UI (MUI)
- **Maps**: React-Leaflet with OpenStreetMap
- **State Management**: React Context API
- **Styling**: Emotion (styled-components)
- **Build Tool**: Create React App

## Features in Detail

### Dashboard
- Overview of all trips with status indicators
- Quick access to create new trips
- Progress tracking for packing and preparation

### Packing List
- Pre-populated with essential hunting gear
- Categorized items for easy organization
- Custom item addition with notes
- Progress tracking and required item warnings

### Weather Monitor
- Mock weather data for demonstration
- Real weather integration ready (requires API key)
- Hunting conditions assessment
- 5-day forecast with detailed information

### Interactive Map
- Leaflet-based mapping with OpenStreetMap tiles
- Custom markers for different location types
- Click-to-add functionality
- Persistent location storage

### Game Information Database
- Comprehensive details for 9+ game types
- Hunting seasons, difficulty ratings
- Required licenses and recommended gear
- Expert hunting tips and techniques

## Contributing

This is a demonstration project, but contributions are welcome! Feel free to:
- Report bugs or issues
- Suggest new features
- Submit pull requests
- Improve documentation

## License

This project is open source and available under the MIT License.

## Weather API Setup (Optional)

To get live weather data:
1. Sign up for a free account at [OpenWeatherMap](https://openweathermap.org/api)
2. Get your API key
3. Enter it in the Weather Monitor section
4. Enjoy live weather updates for your hunting locations!

## Disclaimer

This tool is for planning purposes only. Always:
- Check local hunting regulations and seasons
- Obtain proper licenses and permits
- Follow all safety guidelines
- Respect private property and wildlife conservation laws

Happy hunting! 🏹
