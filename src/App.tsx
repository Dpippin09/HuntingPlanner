import React, { useState } from 'react';
import { 
  ThemeProvider, 
  createTheme, 
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  Container,
  Tabs,
  Tab,
  Box,
  CircularProgress
} from '@mui/material';
import { 
  Dashboard,
  ChecklistRtl,
  Cloud,
  Map,
  Group,
  Pets,
  Warning
} from '@mui/icons-material';

// Components
import DashboardComponent from './components/Dashboard/Dashboard';
import PackingList from './components/PackingList/PackingList';
import WeatherMonitor from './components/Weather/WeatherMonitor';
import LocationMap from './components/Map/LocationMap';
import HuntingParty from './components/Party/HuntingParty';
import GameSelection from './components/Game/GameSelection';
import EmergencyPanel from './components/Emergency/EmergencyPanel';
import AuthPage from './components/Auth/AuthPage';
import UserProfileMenu from './components/Auth/UserProfileMenu';

// Context
import { HuntingTripProvider } from './context/HuntingTripContext';
import { EmergencyProvider } from './context/EmergencyContext';
import { AuthProvider, useAuth } from './context/AuthContext';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2e7d32',
    },
    secondary: {
      main: '#5d4037',
    },
    background: {
      default: '#f5f5f5',
    },
  },
});

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`hunting-tabpanel-${index}`}
      aria-labelledby={`hunting-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `hunting-tab-${index}`,
    'aria-controls': `hunting-tabpanel-${index}`,
  };
}

function MainApp() {
  const { isAuthenticated, isLoading } = useAuth();
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          backgroundColor: 'background.default'
        }}
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  // Show authentication page if not logged in
  if (!isAuthenticated) {
    return <AuthPage />;
  }

  // Show main app if authenticated
  return (
    <HuntingTripProvider>
      <EmergencyProvider>
        <AppBar position="static">
          <Toolbar>
            <Pets sx={{ mr: 2 }} />
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Hunting Planner
            </Typography>
            <UserProfileMenu />
          </Toolbar>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            textColor="inherit"
            indicatorColor="secondary"
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab icon={<Dashboard />} label="Dashboard" {...a11yProps(0)} />
            <Tab icon={<ChecklistRtl />} label="Packing List" {...a11yProps(1)} />
            <Tab icon={<Cloud />} label="Weather" {...a11yProps(2)} />
            <Tab icon={<Map />} label="Location" {...a11yProps(3)} />
            <Tab icon={<Group />} label="Hunting Party" {...a11yProps(4)} />
            <Tab icon={<Pets />} label="Game Selection" {...a11yProps(5)} />
            <Tab icon={<Warning />} label="Party Alerts" {...a11yProps(6)} />
          </Tabs>
        </AppBar>

        <Container maxWidth="xl">
          <TabPanel value={tabValue} index={0}>
            <DashboardComponent />
          </TabPanel>
          <TabPanel value={tabValue} index={1}>
            <PackingList />
          </TabPanel>
          <TabPanel value={tabValue} index={2}>
            <WeatherMonitor />
          </TabPanel>
          <TabPanel value={tabValue} index={3}>
            <LocationMap />
          </TabPanel>
          <TabPanel value={tabValue} index={4}>
            <HuntingParty />
          </TabPanel>
          <TabPanel value={tabValue} index={5}>
            <GameSelection />
          </TabPanel>
          <TabPanel value={tabValue} index={6}>
            <EmergencyPanel />
          </TabPanel>
        </Container>
      </EmergencyProvider>
    </HuntingTripProvider>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <MainApp />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
