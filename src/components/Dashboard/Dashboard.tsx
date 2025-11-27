import React, { useState } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
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
  Box,
  LinearProgress,
  Chip,
  IconButton
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  CheckCircle,
  Schedule,
  LocationOn,
  Group,
  Assignment,
  Share,
  GroupAdd
} from '@mui/icons-material';

import { useHuntingTrip } from '../../context/HuntingTripContext';
import { GameType } from '../../types';
import { format } from 'date-fns';
import TripSharingDialog from '../Trip/TripSharingDialog';
import JoinTripDialog from '../Trip/JoinTripDialog';

const Dashboard: React.FC = () => {
  const { 
    currentTrip, 
    trips, 
    createTrip, 
    setCurrentTrip,
    deleteTrip 
  } = useHuntingTrip();
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [sharingDialogOpen, setSharingDialogOpen] = useState(false);
  const [joinDialogOpen, setJoinDialogOpen] = useState(false);
  const [tripToShare, setTripToShare] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    startDate: '',
    endDate: '',
    locationName: '',
    locationLat: 0,
    locationLng: 0,
    gameType: GameType.DEER,
    notes: ''
  });

  const handleCreateTrip = () => {
    createTrip({
      name: formData.name,
      startDate: new Date(formData.startDate),
      endDate: new Date(formData.endDate),
      location: {
        name: formData.locationName,
        coordinates: {
          lat: formData.locationLat,
          lng: formData.locationLng
        }
      },
      gameType: formData.gameType,
      packingList: [],
      huntingParty: [],
      notes: formData.notes
    });
    
    setDialogOpen(false);
    setFormData({
      name: '',
      startDate: '',
      endDate: '',
      locationName: '',
      locationLat: 0,
      locationLng: 0,
      gameType: GameType.DEER,
      notes: ''
    });
  };

  const getPackingProgress = () => {
    if (!currentTrip) return 0;
    const packedItems = currentTrip.packingList.filter(item => item.isPacked).length;
    return currentTrip.packingList.length > 0 
      ? (packedItems / currentTrip.packingList.length) * 100 
      : 0;
  };

  const getTripStatus = (startDate: Date, endDate: Date) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (now < start) return { status: 'upcoming', color: 'primary' };
    if (now >= start && now <= end) return { status: 'active', color: 'success' };
    return { status: 'completed', color: 'default' };
  };

  const handleJoinTrip = (tripCode: string, message?: string) => {
    // In a real app, this would make an API call to join the trip
    console.log('Joining trip with code:', tripCode, 'Message:', message);
    // For now, just close the dialog
    setJoinDialogOpen(false);
    // TODO: Add actual join trip logic
  };

  return (
    <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Hunting Trip Dashboard
        </Typography>

        {/* Current Trip Card */}
        {currentTrip && (
          <Card sx={{ mb: 3, border: 2, borderColor: 'primary.main' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Typography variant="h5" component="h2">
                  Current Trip: {currentTrip.name}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<Share />}
                    onClick={() => {
                      setTripToShare(currentTrip);
                      setSharingDialogOpen(true);
                    }}
                  >
                    Share Trip
                  </Button>
                  <Chip 
                    label={getTripStatus(currentTrip.startDate, currentTrip.endDate).status}
                    color={getTripStatus(currentTrip.startDate, currentTrip.endDate).color as any}
                    size="small"
                  />
                </Box>
              </Box>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Schedule sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2">
                      {format(new Date(currentTrip.startDate), 'MMM dd, yyyy')} - {format(new Date(currentTrip.endDate), 'MMM dd, yyyy')}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <LocationOn sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2">
                      {currentTrip.location.name}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Group sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2">
                      {currentTrip.huntingParty.length} member(s)
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    Packing Progress: {Math.round(getPackingProgress())}%
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={getPackingProgress()} 
                    sx={{ mb: 2 }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    Game: {currentTrip.gameType}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        )}

        {/* Create New Trip Button */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6">
            Your Trips ({trips.length})
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<GroupAdd />}
              onClick={() => setJoinDialogOpen(true)}
            >
              Join Hunt
            </Button>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setDialogOpen(true)}
            >
              Create New Trip
            </Button>
          </Box>
        </Box>

        {/* Trips List */}
        <Grid container spacing={3}>
          {trips.map((trip) => {
            const tripStatus = getTripStatus(trip.startDate, trip.endDate);
            const packingProgress = trip.packingList.length > 0 
              ? (trip.packingList.filter(item => item.isPacked).length / trip.packingList.length) * 100 
              : 0;
            
            return (
              <Grid item xs={12} md={6} lg={4} key={trip.id}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Typography variant="h6" component="h3">
                        {trip.name}
                      </Typography>
                      <Box>
                        <IconButton 
                          size="small" 
                          onClick={() => {
                            setTripToShare(trip);
                            setSharingDialogOpen(true);
                          }}
                          color="primary"
                          title="Share Trip"
                        >
                          <Share />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          onClick={() => setCurrentTrip(trip.id)}
                          color={currentTrip?.id === trip.id ? 'primary' : 'default'}
                          title="Edit Trip"
                        >
                          <Edit />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          onClick={() => deleteTrip(trip.id)}
                          color="error"
                          title="Delete Trip"
                        >
                          <Delete />
                        </IconButton>
                      </Box>
                    </Box>
                    
                    <Chip 
                      label={tripStatus.status}
                      color={tripStatus.color as any}
                      size="small"
                      sx={{ mb: 2 }}
                    />
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {format(new Date(trip.startDate), 'MMM dd')} - {format(new Date(trip.endDate), 'MMM dd, yyyy')}
                    </Typography>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      📍 {trip.location.name}
                    </Typography>
                    
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        Packing: {Math.round(packingProgress)}%
                      </Typography>
                      <LinearProgress variant="determinate" value={packingProgress} />
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary">
                      🎯 {trip.gameType} • 👥 {trip.huntingParty.length}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>

        {/* Create Trip Dialog */}
        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>Create New Hunting Trip</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Trip Name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Start Date"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="End Date"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Location Name"
                  value={formData.locationName}
                  onChange={(e) => setFormData({...formData, locationName: e.target.value})}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Latitude"
                  type="number"
                  value={formData.locationLat}
                  onChange={(e) => setFormData({...formData, locationLat: parseFloat(e.target.value)})}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Longitude"
                  type="number"
                  value={formData.locationLng}
                  onChange={(e) => setFormData({...formData, locationLng: parseFloat(e.target.value)})}
                />
              </Grid>
              
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Game Type</InputLabel>
                  <Select
                    value={formData.gameType}
                    label="Game Type"
                    onChange={(e) => setFormData({...formData, gameType: e.target.value as GameType})}
                  >
                    {Object.values(GameType).map((type) => (
                      <MenuItem key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Notes"
                  multiline
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateTrip} variant="contained">Create Trip</Button>
          </DialogActions>
        </Dialog>

        {/* Trip Sharing Dialog */}
        {tripToShare && (
          <TripSharingDialog
            trip={tripToShare}
            open={sharingDialogOpen}
            onClose={() => {
              setSharingDialogOpen(false);
              setTripToShare(null);
            }}
          />
        )}

        {/* Join Trip Dialog */}
        <JoinTripDialog
          open={joinDialogOpen}
          onClose={() => setJoinDialogOpen(false)}
          onJoinTrip={handleJoinTrip}
        />
      </Box>
  );
};

export default Dashboard;
