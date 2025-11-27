import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Alert,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip
} from '@mui/material';
import {
  Add,
  Delete,
  Edit,
  LocationOn,
  MyLocation,
  Terrain,
  DirectionsCar,
  Home,
  Flag
} from '@mui/icons-material';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { useHuntingTrip } from '../../context/HuntingTripContext';
import { useEmergency } from '../../context/EmergencyContext';
import { MapLocation } from '../../types';

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icons for different location types
const createCustomIcon = (color: string) => {
  return new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-${color}.png`,
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
};

const locationTypeIcons = {
  hunting_spot: createCustomIcon('red'),
  camp: createCustomIcon('green'),
  parking: createCustomIcon('blue'),
  landmark: createCustomIcon('yellow'),
};

// Emergency alert icon
const emergencyIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [35, 55], // Larger for emergency alerts
  iconAnchor: [17, 55],
  popupAnchor: [1, -44],
  shadowSize: [55, 55],
  className: 'emergency-marker-pulse' // We'll add CSS animation
});

const LocationMap: React.FC = () => {
  const { currentTrip, updateTrip } = useHuntingTrip();
  const { alerts } = useEmergency();
  const [locations, setLocations] = useState<MapLocation[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<MapLocation | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([39.8283, -98.5795]); // Center of US
  const [formData, setFormData] = useState({
    name: '',
    type: 'hunting_spot' as MapLocation['type'],
    notes: '',
    coordinates: { lat: 0, lng: 0 }
  });

  // Component to handle map clicks
  function MapClickHandler({ onLocationSelect }: { onLocationSelect: (lat: number, lng: number) => void }) {
    useMapEvents({
      click(e) {
        onLocationSelect(e.latlng.lat, e.latlng.lng);
      },
    });
    return null;
  }

  useEffect(() => {
    if (currentTrip) {
      // Set map center to trip location if available
      if (currentTrip.location.coordinates.lat && currentTrip.location.coordinates.lng) {
        setMapCenter([currentTrip.location.coordinates.lat, currentTrip.location.coordinates.lng]);
      }
      
      // Load saved locations for this trip
      const savedLocations = localStorage.getItem(`trip-locations-${currentTrip.id}`);
      if (savedLocations) {
        setLocations(JSON.parse(savedLocations));
      }
    }
  }, [currentTrip]);

  const handleSaveLocations = (newLocations: MapLocation[]) => {
    if (currentTrip) {
      setLocations(newLocations);
      localStorage.setItem(`trip-locations-${currentTrip.id}`, JSON.stringify(newLocations));
    }
  };

  const handleAddLocation = () => {
    if (!formData.name.trim()) return;

    const newLocation: MapLocation = {
      name: formData.name,
      type: formData.type,
      coordinates: formData.coordinates,
      notes: formData.notes || undefined
    };

    if (editingLocation) {
      const updatedLocations = locations.map(loc => 
        loc.name === editingLocation.name ? newLocation : loc
      );
      handleSaveLocations(updatedLocations);
    } else {
      handleSaveLocations([...locations, newLocation]);
    }

    handleCloseDialog();
  };

  const handleEditLocation = (location: MapLocation) => {
    setEditingLocation(location);
    setFormData({
      name: location.name,
      type: location.type,
      notes: location.notes || '',
      coordinates: location.coordinates
    });
    setDialogOpen(true);
  };

  const handleDeleteLocation = (locationName: string) => {
    const updatedLocations = locations.filter(loc => loc.name !== locationName);
    handleSaveLocations(updatedLocations);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingLocation(null);
    setFormData({
      name: '',
      type: 'hunting_spot',
      notes: '',
      coordinates: { lat: 0, lng: 0 }
    });
  };

  const handleMapClick = (lat: number, lng: number) => {
    setFormData(prev => ({
      ...prev,
      coordinates: { lat, lng }
    }));
    if (!dialogOpen) {
      setDialogOpen(true);
    }
  };

  const getLocationTypeInfo = (type: MapLocation['type']) => {
    switch (type) {
      case 'hunting_spot':
        return { label: 'Hunting Spot', icon: <Flag />, color: 'error' };
      case 'camp':
        return { label: 'Camp', icon: <Home />, color: 'success' };
      case 'parking':
        return { label: 'Parking', icon: <DirectionsCar />, color: 'primary' };
      case 'landmark':
        return { label: 'Landmark', icon: <Terrain />, color: 'warning' };
      default:
        return { label: 'Location', icon: <LocationOn />, color: 'default' };
    }
  };

  if (!currentTrip) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="info">
          Please select or create a trip to view and manage locations.
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Location Map - {currentTrip.name}
      </Typography>

      <Typography variant="body1" color="text.secondary" gutterBottom>
        Main Location: {currentTrip.location.name}
      </Typography>

      <Grid container spacing={3}>
        {/* Map */}
        <Grid item xs={12} lg={8}>
          <Card>
            <CardContent>
              <Box sx={{ height: 600, width: '100%' }}>
                <MapContainer
                  center={mapCenter}
                  zoom={10}
                  style={{ height: '100%', width: '100%' }}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <MapClickHandler onLocationSelect={handleMapClick} />
                  
                  {/* Main trip location marker */}
                  {currentTrip.location.coordinates.lat && currentTrip.location.coordinates.lng && (
                    <Marker 
                      position={[currentTrip.location.coordinates.lat, currentTrip.location.coordinates.lng]}
                    >
                      <Popup>
                        <strong>{currentTrip.location.name}</strong><br />
                        Main trip location
                      </Popup>
                    </Marker>
                  )}

                  {/* Emergency alert markers */}
                  {currentTrip && alerts
                    .filter(alert => alert.tripId === currentTrip.id && !alert.isResolved)
                    .map((alert, index) => (
                      <Marker
                        key={`emergency-${alert.id}`}
                        position={[alert.location.lat, alert.location.lng]}
                        icon={emergencyIcon}
                      >
                        <Popup>
                          <div style={{ minWidth: '200px' }}>
                            <strong style={{ color: 'red' }}>🚨 EMERGENCY ALERT</strong><br />
                            <strong>{alert.senderName}</strong><br />
                            Type: {alert.alertType.replace('_', ' ').toUpperCase()}<br />
                            {alert.message && <span>Message: {alert.message}<br /></span>}
                            Time: {alert.timestamp.toLocaleString()}<br />
                            Location: {alert.location.lat.toFixed(6)}, {alert.location.lng.toFixed(6)}
                            {alert.location.accuracy && <br />}
                            {alert.location.accuracy && <span>Accuracy: ±{Math.round(alert.location.accuracy)}m</span>}
                          </div>
                        </Popup>
                      </Marker>
                    ))}

                  {/* Additional location markers */}
                  {locations.map((location, index) => (
                    <Marker
                      key={index}
                      position={[location.coordinates.lat, location.coordinates.lng]}
                      icon={locationTypeIcons[location.type]}
                    >
                      <Popup>
                        <strong>{location.name}</strong><br />
                        Type: {getLocationTypeInfo(location.type).label}<br />
                        {location.notes && <span>Notes: {location.notes}</span>}
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </Box>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                Click on the map to add a new location marker
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Locations List */}
        <Grid item xs={12} lg={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  Saved Locations ({locations.length})
                </Typography>
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<Add />}
                  onClick={() => setDialogOpen(true)}
                >
                  Add
                </Button>
              </Box>

              <List>
                {locations.map((location, index) => {
                  const typeInfo = getLocationTypeInfo(location.type);
                  return (
                    <ListItem key={index} divider>
                      <ListItemIcon>
                        {typeInfo.icon}
                      </ListItemIcon>
                      <ListItemText
                        primary={location.name}
                        secondary={
                          <Box>
                            <Chip 
                              label={typeInfo.label} 
                              size="small" 
                              color={typeInfo.color as any}
                              sx={{ mr: 1, mb: 0.5 }}
                            />
                            <br />
                            {location.coordinates.lat.toFixed(4)}, {location.coordinates.lng.toFixed(4)}
                            {location.notes && (
                              <>
                                <br />
                                <Typography variant="caption">
                                  {location.notes}
                                </Typography>
                              </>
                            )}
                          </Box>
                        }
                      />
                      <ListItemSecondaryAction>
                        <IconButton 
                          size="small" 
                          onClick={() => handleEditLocation(location)}
                        >
                          <Edit />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          onClick={() => handleDeleteLocation(location.name)}
                          color="error"
                        >
                          <Delete />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  );
                })}
                {locations.length === 0 && (
                  <ListItem>
                    <ListItemText 
                      primary="No saved locations"
                      secondary="Click on the map or the Add button to create your first location marker"
                    />
                  </ListItem>
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Add/Edit Location Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingLocation ? 'Edit Location' : 'Add New Location'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              fullWidth
              label="Location Name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
            
            <FormControl fullWidth>
              <InputLabel>Location Type</InputLabel>
              <Select
                value={formData.type}
                label="Location Type"
                onChange={(e) => setFormData({...formData, type: e.target.value as MapLocation['type']})}
              >
                <MenuItem value="hunting_spot">Hunting Spot</MenuItem>
                <MenuItem value="camp">Camp</MenuItem>
                <MenuItem value="parking">Parking</MenuItem>
                <MenuItem value="landmark">Landmark</MenuItem>
              </Select>
            </FormControl>

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Latitude"
                  type="number"
                  value={formData.coordinates.lat}
                  onChange={(e) => setFormData({
                    ...formData, 
                    coordinates: { ...formData.coordinates, lat: parseFloat(e.target.value) || 0 }
                  })}
                  inputProps={{ step: 'any' }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Longitude"
                  type="number"
                  value={formData.coordinates.lng}
                  onChange={(e) => setFormData({
                    ...formData, 
                    coordinates: { ...formData.coordinates, lng: parseFloat(e.target.value) || 0 }
                  })}
                  inputProps={{ step: 'any' }}
                />
              </Grid>
            </Grid>
            
            <TextField
              fullWidth
              label="Notes (optional)"
              multiline
              rows={3}
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button 
            onClick={handleAddLocation} 
            variant="contained"
            disabled={!formData.name.trim() || !formData.coordinates.lat || !formData.coordinates.lng}
          >
            {editingLocation ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default LocationMap;
