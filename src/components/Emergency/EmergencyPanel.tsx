import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Switch,
  FormControlLabel,
  Fab,
  Divider,
  LinearProgress
} from '@mui/material';
import {
  Warning,
  LocationOn,
  CheckCircle,
  Settings,
  MyLocation,
  NotificationImportant,
  Phone,
  Timer,
  Group
} from '@mui/icons-material';
import { useEmergency } from '../../context/EmergencyContext';
import { useHuntingTrip } from '../../context/HuntingTripContext';
import { EmergencyType } from '../../types/emergency';
import { format } from 'date-fns';

const EmergencyPanel: React.FC = () => {
  const { 
    alerts, 
    settings, 
    currentLocation, 
    isTracking,
    sendEmergencyAlert, 
    resolveAlert,
    updateSettings,
    startLocationTracking,
    stopLocationTracking,
    shareLocationWithParty
  } = useEmergency();
  
  const { currentTrip } = useHuntingTrip();
  
  const [emergencyDialogOpen, setEmergencyDialogOpen] = useState(false);
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false);
  const [selectedEmergencyType, setSelectedEmergencyType] = useState<EmergencyType>(EmergencyType.GENERAL_EMERGENCY);
  const [emergencyMessage, setEmergencyMessage] = useState('');
  const [confirmDialog, setConfirmDialog] = useState(false);
  const [locationPermission, setLocationPermission] = useState<string>('unknown');

  // Check location permission status
  useEffect(() => {
    if ('permissions' in navigator) {
      navigator.permissions.query({ name: 'geolocation' }).then((result) => {
        setLocationPermission(result.state);
        result.onchange = () => {
          setLocationPermission(result.state);
        };
      });
    }
  }, []);

  const handleEmergencyAlert = async () => {
    try {
      await sendEmergencyAlert(selectedEmergencyType, emergencyMessage);
      setEmergencyDialogOpen(false);
      setEmergencyMessage('');
      setConfirmDialog(false);
    } catch (error) {
      console.error('Failed to send alert to party:', error);
      alert('Failed to send alert to hunting party. Please try again or use alternative communication.');
    }
  };

  const getEmergencyTypeInfo = (type: EmergencyType) => {
    switch (type) {
      case EmergencyType.LOST:
        return { label: 'Lost', color: 'warning', icon: <MyLocation /> };
      case EmergencyType.INJURED:
        return { label: 'Injured', color: 'error', icon: <Warning /> };
      case EmergencyType.EQUIPMENT_FAILURE:
        return { label: 'Equipment Failure', color: 'info', icon: <Warning /> };
      case EmergencyType.SEVERE_WEATHER:
        return { label: 'Severe Weather', color: 'warning', icon: <Warning /> };
      case EmergencyType.WILDLIFE_ENCOUNTER:
        return { label: 'Wildlife Encounter', color: 'error', icon: <Warning /> };
      default:
        return { label: 'General Emergency', color: 'error', icon: <Warning /> };
    }
  };

  const activeAlerts = alerts.filter(alert => !alert.isResolved);

  if (!currentTrip) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="info">
          Please select or create a trip to access emergency features.
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, position: 'relative' }}>
      <Typography variant="h4" gutterBottom>
        🚨 Party Communication Center
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Send alerts and share your location with your hunting party members. 
        This system only contacts your hunting party - not emergency services.
      </Typography>

      {/* Emergency Status */}
      <Card sx={{ mb: 3, bgcolor: activeAlerts.length > 0 ? 'error.light' : 'success.light' }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={8}>
              <Typography variant="h6">
                {activeAlerts.length === 0 ? '✅ All Clear' : `🚨 ${activeAlerts.length} Active Alert(s)`}
              </Typography>
              <Typography variant="body2">
                {isTracking ? '📍 Location tracking active' : '📍 Location tracking inactive'}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<Settings />}
                  onClick={() => setSettingsDialogOpen(true)}
                >
                  Settings
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<Group />}
                  onClick={shareLocationWithParty}
                  disabled={!currentLocation}
                >
                  Share Location
                </Button>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Location Status */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            📍 Location Status
          </Typography>
          {currentLocation ? (
            <Box>
              <Typography variant="body2">
                <strong>Current Position:</strong>
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Lat: {currentLocation.coords.latitude.toFixed(6)}<br />
                Lng: {currentLocation.coords.longitude.toFixed(6)}<br />
                Accuracy: ±{Math.round(currentLocation.coords.accuracy)}m<br />
                Last updated: {format(new Date(currentLocation.timestamp), 'HH:mm:ss')}
              </Typography>
            </Box>
          ) : (
            <Typography variant="body2" color="text.secondary">
              No location data available
            </Typography>
          )}
          
          <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
            {!isTracking ? (
              <Button
                variant="contained"
                size="small"
                startIcon={<MyLocation />}
                onClick={startLocationTracking}
                disabled={locationPermission === 'denied'}
              >
                Start Tracking
              </Button>
            ) : (
              <Button
                variant="outlined"
                size="small"
                onClick={stopLocationTracking}
              >
                Stop Tracking
              </Button>
            )}
          </Box>
          
          {locationPermission === 'denied' && (
            <Alert severity="warning" sx={{ mt: 2 }}>
              Location access denied. Please enable location permissions in your browser settings.
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Active Alerts */}
      {activeAlerts.length > 0 && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom color="error">
              🚨 Active Emergency Alerts
            </Typography>
            <List>
              {activeAlerts.map((alert) => {
                const typeInfo = getEmergencyTypeInfo(alert.alertType);
                return (
                  <ListItem key={alert.id} divider>
                    <ListItemIcon>
                      {typeInfo.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Chip 
                            label={typeInfo.label}
                            color={typeInfo.color as any}
                            size="small"
                          />
                          <Typography variant="body2">
                            from {alert.senderName}
                          </Typography>
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2">{alert.message}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {format(alert.timestamp, 'MMM dd, HH:mm')} • 
                            📍 {alert.location.lat.toFixed(4)}, {alert.location.lng.toFixed(4)}
                          </Typography>
                        </Box>
                      }
                    />
                    <Button
                      size="small"
                      variant="outlined"
                      color="success"
                      onClick={() => resolveAlert(alert.id)}
                    >
                      Resolve
                    </Button>
                  </ListItem>
                );
              })}
            </List>
          </CardContent>
        </Card>
      )}

      {/* Recent Alerts History */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            📋 Recent Alerts
          </Typography>
          {alerts.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              No emergency alerts yet. Stay safe out there!
            </Typography>
          ) : (
            <List>
              {alerts.slice(0, 5).map((alert) => {
                const typeInfo = getEmergencyTypeInfo(alert.alertType);
                return (
                  <ListItem key={alert.id}>
                    <ListItemIcon>
                      {alert.isResolved ? <CheckCircle color="success" /> : typeInfo.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Chip 
                            label={typeInfo.label}
                            color={alert.isResolved ? 'success' : typeInfo.color as any}
                            size="small"
                          />
                          <Typography variant="body2">
                            {alert.senderName}
                          </Typography>
                        </Box>
                      }
                      secondary={format(alert.timestamp, 'MMM dd, HH:mm')}
                    />
                  </ListItem>
                );
              })}
            </List>
          )}
        </CardContent>
      </Card>

      {/* Party Alert FAB */}
      <Fab
        color="error"
        size="large"
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 1000
        }}
        onClick={() => setEmergencyDialogOpen(true)}
        title="Send Alert to Hunting Party"
      >
        <Warning />
      </Fab>

      {/* Emergency Alert Dialog */}
      <Dialog open={emergencyDialogOpen} onClose={() => setEmergencyDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: 'error.main', color: 'white' }}>
          � Send Alert to Hunting Party
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Alert severity="info" sx={{ mb: 3 }}>
            This will alert your hunting party members to your location and situation. 
            Your GPS coordinates will be shared with the group.
          </Alert>

          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>Alert Type</InputLabel>
            <Select
              value={selectedEmergencyType}
              label="Alert Type"
              onChange={(e) => setSelectedEmergencyType(e.target.value as EmergencyType)}
            >
              <MenuItem value={EmergencyType.LOST}>🧭 Lost - Need Direction</MenuItem>
              <MenuItem value={EmergencyType.INJURED}>🩹 Injured - Need Medical Help</MenuItem>
              <MenuItem value={EmergencyType.EQUIPMENT_FAILURE}>🔧 Equipment Failure</MenuItem>
              <MenuItem value={EmergencyType.SEVERE_WEATHER}>⛈️ Severe Weather</MenuItem>
              <MenuItem value={EmergencyType.WILDLIFE_ENCOUNTER}>🐻 Wildlife Encounter</MenuItem>
              <MenuItem value={EmergencyType.GENERAL_EMERGENCY}>🚨 General Emergency</MenuItem>
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="Additional Message (optional)"
            multiline
            rows={3}
            value={emergencyMessage}
            onChange={(e) => setEmergencyMessage(e.target.value)}
            placeholder="Describe your situation or specific help needed..."
          />

          {!currentLocation && (
            <Alert severity="error" sx={{ mt: 2 }}>
              Location not available. Your alert will be sent without GPS coordinates.
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEmergencyDialogOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={() => setConfirmDialog(true)}
            variant="contained"
            color="error"
            startIcon={<Warning />}
          >
            Send Alert to Party
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialog} onClose={() => setConfirmDialog(false)}>
        <DialogTitle>Confirm Party Alert</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to send an alert to your hunting party? This action will:
          </Typography>
          <List dense>
            <ListItem>
              <ListItemText primary="• Notify all hunting party members immediately" />
            </ListItem>
            <ListItem>
              <ListItemText primary="• Share your current GPS location with the group" />
            </ListItem>
            <ListItem>
              <ListItemText primary="• Display your alert on the party's map" />
            </ListItem>
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleEmergencyAlert}
            variant="contained"
            color="error"
          >
            Yes, Send Alert to Party
          </Button>
        </DialogActions>
      </Dialog>

      {/* Settings Dialog */}
      <Dialog open={settingsDialogOpen} onClose={() => setSettingsDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Party Communication Settings</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.enableGPS}
                  onChange={(e) => updateSettings({ enableGPS: e.target.checked })}
                />
              }
              label="Enable GPS Tracking"
            />
            <Typography variant="body2" color="text.secondary" sx={{ ml: 4, mb: 2 }}>
              Allow the app to track your location to share with your hunting party
            </Typography>

            <FormControlLabel
              control={
                <Switch
                  checked={settings.enableNotifications}
                  onChange={(e) => updateSettings({ enableNotifications: e.target.checked })}
                />
              }
              label="Enable Party Notifications"
            />
            <Typography variant="body2" color="text.secondary" sx={{ ml: 4, mb: 2 }}>
              Receive notifications when party members send alerts
            </Typography>

            <FormControlLabel
              control={
                <Switch
                  checked={settings.autoShareLocation}
                  onChange={(e) => updateSettings({ autoShareLocation: e.target.checked })}
                />
              }
              label="Auto-Share Location with Party"
            />
            <Typography variant="body2" color="text.secondary" sx={{ ml: 4, mb: 3 }}>
              Automatically share your location updates with hunting party members
            </Typography>

            <Alert severity="info">
              <Typography variant="body2">
                <strong>Note:</strong> This system only communicates with your hunting party members. 
                For true emergencies requiring professional help, use your phone to call emergency services directly.
              </Typography>
            </Alert>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSettingsDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EmergencyPanel;
