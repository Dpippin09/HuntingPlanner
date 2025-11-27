import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  Alert,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  CircularProgress
} from '@mui/material';
import {
  GroupAdd,
  Check
} from '@mui/icons-material';

interface JoinTripDialogProps {
  open: boolean;
  onClose: () => void;
  onJoinTrip: (tripCode: string, message?: string) => void;
}

// This would be a new component for joining existing trips
const JoinTripDialog: React.FC<JoinTripDialogProps> = ({ open, onClose, onJoinTrip }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [tripCode, setTripCode] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [tripInfo, setTripInfo] = useState<any>(null);
  
  const steps = ['Enter Trip Code', 'Trip Details', 'Request Access'];

  const handleVerifyCode = async () => {
    if (!tripCode || tripCode.length !== 6) return;
    
    setLoading(true);
    
    // Simulate API call to verify trip code
    setTimeout(() => {
      // Mock trip data that would come from API
      setTripInfo({
        name: 'Opening Day Deer Hunt 2024',
        location: 'Pine Ridge Wildlife Area',
        startDate: new Date('2024-11-15'),
        endDate: new Date('2024-11-17'),
        creatorName: 'John Smith',
        memberCount: 3,
        maxMembers: 6,
        gameType: 'Deer'
      });
      setActiveStep(1);
      setLoading(false);
    }, 1000);
  };

  const handleJoinRequest = () => {
    setLoading(true);
    
    // Simulate sending join request
    setTimeout(() => {
      onJoinTrip(tripCode, message);
      setActiveStep(2);
      setLoading(false);
    }, 1000);
  };

  const handleClose = () => {
    setActiveStep(0);
    setTripCode('');
    setMessage('');
    setTripInfo(null);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <GroupAdd color="primary" />
          Join Hunting Trip
        </Box>
      </DialogTitle>
      
      <DialogContent>
        <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {/* Step 1: Enter Trip Code */}
        {activeStep === 0 && (
          <Box>
            <Typography variant="body1" gutterBottom>
              Enter the 6-character trip code shared by your hunt leader:
            </Typography>
            <TextField
              fullWidth
              label="Trip Code"
              value={tripCode}
              onChange={(e) => setTripCode(e.target.value.toUpperCase())}
              placeholder="ABC123"
              inputProps={{ maxLength: 6, style: { textAlign: 'center', fontSize: '1.5rem', letterSpacing: 2 } }}
              sx={{ mt: 2, mb: 3 }}
              autoFocus
            />
            <Alert severity="info">
              The trip code is usually shared via text message, email, or shown to you in person by the hunt leader.
            </Alert>
          </Box>
        )}

        {/* Step 2: Trip Details */}
        {activeStep === 1 && tripInfo && (
          <Box>
            <Typography variant="h6" gutterBottom color="success.main">
              ✅ Trip Found!
            </Typography>
            
            <Card variant="outlined" sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {tripInfo.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  <strong>Location:</strong> {tripInfo.location}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  <strong>Dates:</strong> {tripInfo.startDate.toLocaleDateString()} - {tripInfo.endDate.toLocaleDateString()}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  <strong>Game Type:</strong> {tripInfo.gameType}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  <strong>Hunt Leader:</strong> {tripInfo.creatorName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Party Size:</strong> {tripInfo.memberCount}/{tripInfo.maxMembers} members
                </Typography>
              </CardContent>
            </Card>

            <TextField
              fullWidth
              label="Message to Hunt Leader (Optional)"
              multiline
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Introduce yourself or mention your hunting experience..."
              sx={{ mb: 2 }}
            />

            <Alert severity="info">
              Your request will be sent to the hunt leader for approval. You'll be notified once they respond.
            </Alert>
          </Box>
        )}

        {/* Step 3: Request Sent */}
        {activeStep === 2 && (
          <Box sx={{ textAlign: 'center', py: 3 }}>
            <Check sx={{ fontSize: 60, color: 'success.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom color="success.main">
              Join Request Sent!
            </Typography>
            <Typography variant="body1" gutterBottom>
              Your request to join "{tripInfo?.name}" has been sent to {tripInfo?.creatorName}.
            </Typography>
            <Alert severity="success" sx={{ mt: 2 }}>
              You'll receive a notification once the hunt leader approves your request. 
              Check back in the app or watch for email/push notifications.
            </Alert>
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        {activeStep === 0 && (
          <>
            <Button onClick={handleClose}>Cancel</Button>
            <Button
              onClick={handleVerifyCode}
              variant="contained"
              disabled={tripCode.length !== 6 || loading}
            >
              {loading ? <CircularProgress size={20} /> : 'Find Trip'}
            </Button>
          </>
        )}
        
        {activeStep === 1 && (
          <>
            <Button onClick={() => setActiveStep(0)}>Back</Button>
            <Button
              onClick={handleJoinRequest}
              variant="contained"
              disabled={loading}
            >
              {loading ? <CircularProgress size={20} /> : 'Request to Join'}
            </Button>
          </>
        )}
        
        {activeStep === 2 && (
          <Button onClick={handleClose} variant="contained">
            Done
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default JoinTripDialog;
