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
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Card,
  CardContent,
  Grid
} from '@mui/material';
import {
  ContentCopy,
  PersonAdd,
  Check,
  Close,
  Share,
  QrCode
} from '@mui/icons-material';

interface TripSharingProps {
  trip: any;
  open: boolean;
  onClose: () => void;
}

// This would be a new component for trip sharing
const TripSharingDialog: React.FC<TripSharingProps> = ({ trip, open, onClose }) => {
  const [tripCode] = useState('BUCK24'); // Generated 6-character code
  const [joinRequests] = useState([
    { id: '1', userName: 'Mike Johnson', requestedAt: new Date(), message: 'Ready for opening day!' },
    { id: '2', userName: 'Sarah Wilson', requestedAt: new Date(), message: 'First time hunting, excited to join!' }
  ]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(tripCode);
    // Show success toast
  };

  const handleApproveRequest = (requestId: string) => {
    // In real app: API call to approve member
    console.log('Approving request:', requestId);
  };

  const handleRejectRequest = (requestId: string) => {
    // In real app: API call to reject member
    console.log('Rejecting request:', requestId);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        🎯 Share Hunting Trip: {trip.name}
      </DialogTitle>
      
      <DialogContent>
        {/* Trip Code Section */}
        <Card sx={{ mb: 3, bgcolor: 'primary.light' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              📱 Trip Join Code
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Typography variant="h4" sx={{ 
                fontFamily: 'monospace', 
                bgcolor: 'white', 
                px: 2, 
                py: 1, 
                borderRadius: 1,
                letterSpacing: 2
              }}>
                {tripCode}
              </Typography>
              <Button
                variant="outlined"
                startIcon={<ContentCopy />}
                onClick={handleCopyCode}
                sx={{ bgcolor: 'white' }}
              >
                Copy
              </Button>
              <Button
                variant="outlined"
                startIcon={<Share />}
                sx={{ bgcolor: 'white' }}
              >
                Share Link
              </Button>
              <Button
                variant="outlined"
                startIcon={<QrCode />}
                sx={{ bgcolor: 'white' }}
              >
                QR Code
              </Button>
            </Box>
            <Typography variant="body2" color="text.secondary">
              Share this code with your hunting party. They can enter it in their app to join the trip.
            </Typography>
          </CardContent>
        </Card>

        {/* Current Members */}
        <Typography variant="h6" gutterBottom>
          👥 Current Members ({trip.huntingParty?.length || 0})
        </Typography>
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {trip.huntingParty?.map((member: any) => (
            <Grid item xs={12} sm={6} key={member.id}>
              <Card variant="outlined">
                <CardContent sx={{ py: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="subtitle2">{member.name}</Typography>
                    {member.role === 'Lead Hunter' && (
                      <Chip label="Leader" size="small" color="primary" />
                    )}
                    <Chip 
                      label="Online" 
                      size="small" 
                      color="success" 
                      sx={{ ml: 'auto' }}
                    />
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    {member.role}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Join Requests */}
        {joinRequests.length > 0 && (
          <>
            <Typography variant="h6" gutterBottom>
              📬 Join Requests ({joinRequests.length})
            </Typography>
            <List>
              {joinRequests.map((request) => (
                <ListItem key={request.id} divider>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PersonAdd color="primary" />
                        <Typography variant="subtitle2">
                          {request.userName}
                        </Typography>
                        <Chip label="New" size="small" color="info" />
                      </Box>
                    }
                    secondary={
                      <>
                        <Typography variant="body2" color="text.secondary">
                          Requested: {request.requestedAt.toLocaleDateString()}
                        </Typography>
                        {request.message && (
                          <Typography variant="body2" style={{ fontStyle: 'italic' }}>
                            "{request.message}"
                          </Typography>
                        )}
                      </>
                    }
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      color="success"
                      onClick={() => handleApproveRequest(request.id)}
                      sx={{ mr: 1 }}
                    >
                      <Check />
                    </IconButton>
                    <IconButton
                      edge="end"
                      color="error"
                      onClick={() => handleRejectRequest(request.id)}
                    >
                      <Close />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </>
        )}

        {/* Share Instructions */}
        <Alert severity="info" sx={{ mt: 3 }}>
          <Typography variant="body2">
            <strong>How to share:</strong><br />
            1. Send the trip code <strong>{tripCode}</strong> to your hunting party<br />
            2. They download the app and create an account<br />
            3. They enter your trip code to request access<br />
            4. You approve their request and they're in!
          </Typography>
        </Alert>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default TripSharingDialog;
