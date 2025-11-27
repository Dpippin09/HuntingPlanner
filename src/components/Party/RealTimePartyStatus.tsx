import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Badge,
  IconButton,
  Tooltip,
  Button
} from '@mui/material';
import {
  Circle,
  LocationOn,
  Message,
  Warning,
  Phone,
  Visibility,
  VisibilityOff
} from '@mui/icons-material';

interface RealTimePartyStatusProps {
  tripId: string;
}

// This would show real-time status of all hunting party members
const RealTimePartyStatus: React.FC<RealTimePartyStatusProps> = ({ tripId }) => {
  const [partyMembers] = useState([
    {
      id: '1',
      name: 'John Smith',
      role: 'Hunt Leader',
      status: 'online',
      lastSeen: new Date(),
      location: { lat: 45.123, lng: -93.456, name: 'Main Camp' },
      isSharing: true,
      hasAlert: false,
      avatar: 'JS'
    },
    {
      id: '2', 
      name: 'Mike Johnson',
      role: 'Hunter',
      status: 'online',
      lastSeen: new Date(Date.now() - 5 * 60000), // 5 mins ago
      location: { lat: 45.124, lng: -93.457, name: 'North Ridge' },
      isSharing: true,
      hasAlert: false,
      avatar: 'MJ'
    },
    {
      id: '3',
      name: 'Sarah Wilson', 
      role: 'Hunter',
      status: 'away',
      lastSeen: new Date(Date.now() - 20 * 60000), // 20 mins ago
      location: { lat: 45.122, lng: -93.458, name: 'South Valley' },
      isSharing: false,
      hasAlert: true, // Has an active alert
      avatar: 'SW'
    },
    {
      id: '4',
      name: 'Dave Miller',
      role: 'Hunter', 
      status: 'offline',
      lastSeen: new Date(Date.now() - 2 * 60 * 60000), // 2 hours ago
      location: null,
      isSharing: false,
      hasAlert: false,
      avatar: 'DM'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'success';
      case 'away': return 'warning'; 
      case 'offline': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    const color = getStatusColor(status);
    return <Circle sx={{ fontSize: 12, color: `${color}.main` }} />;
  };

  const formatLastSeen = (lastSeen: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - lastSeen.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return lastSeen.toLocaleDateString();
  };

  const handleSendMessage = (memberId: string) => {
    console.log('Opening chat with member:', memberId);
    // Would open in-app chat
  };

  const handleCall = (memberId: string) => {
    console.log('Initiating call to member:', memberId);
    // Would initiate voice/video call
  };

  const handleViewLocation = (memberId: string) => {
    console.log('Viewing location of member:', memberId);
    // Would center map on member's location
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          👥 Party Status - Live
        </Typography>
        
        {/* Quick Stats */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="success.main">
                {partyMembers.filter(m => m.status === 'online').length}
              </Typography>
              <Typography variant="caption">Online</Typography>
            </Box>
          </Grid>
          <Grid item xs={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="info.main">
                {partyMembers.filter(m => m.isSharing).length}
              </Typography>
              <Typography variant="caption">Sharing Location</Typography>
            </Box>
          </Grid>
          <Grid item xs={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="warning.main">
                {partyMembers.filter(m => m.hasAlert).length}
              </Typography>
              <Typography variant="caption">Active Alerts</Typography>
            </Box>
          </Grid>
          <Grid item xs={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="text.primary">
                {partyMembers.length}
              </Typography>
              <Typography variant="caption">Total Members</Typography>
            </Box>
          </Grid>
        </Grid>

        {/* Member List */}
        <List dense>
          {partyMembers.map((member) => (
            <ListItem key={member.id} divider>
              <ListItemAvatar>
                <Badge
                  overlap="circular"
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  badgeContent={
                    member.hasAlert ? (
                      <Warning sx={{ fontSize: 16, color: 'error.main' }} />
                    ) : (
                      getStatusIcon(member.status)
                    )
                  }
                >
                  <Avatar sx={{ bgcolor: 'primary.main' }}>
                    {member.avatar}
                  </Avatar>
                </Badge>
              </ListItemAvatar>
              
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="subtitle2">
                      {member.name}
                    </Typography>
                    {member.role === 'Hunt Leader' && (
                      <Chip label="Leader" size="small" color="primary" />
                    )}
                    {member.hasAlert && (
                      <Chip label="ALERT" size="small" color="error" />
                    )}
                  </Box>
                }
                secondary={
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      {member.status === 'online' ? 'Online now' : `Last seen: ${formatLastSeen(member.lastSeen)}`}
                    </Typography>
                    {member.location && member.isSharing && (
                      <Typography variant="caption" color="text.secondary" display="block">
                        📍 {member.location.name}
                      </Typography>
                    )}
                    {!member.isSharing && member.status !== 'offline' && (
                      <Typography variant="caption" color="warning.main" display="block">
                        🔒 Location private
                      </Typography>
                    )}
                  </Box>
                }
              />
              
              {/* Action Buttons */}
              <Box sx={{ display: 'flex', gap: 1 }}>
                {member.status !== 'offline' && (
                  <Tooltip title="Send Message">
                    <IconButton size="small" onClick={() => handleSendMessage(member.id)}>
                      <Message />
                    </IconButton>
                  </Tooltip>
                )}
                
                {member.status === 'online' && (
                  <Tooltip title="Call">
                    <IconButton size="small" onClick={() => handleCall(member.id)}>
                      <Phone />
                    </IconButton>
                  </Tooltip>
                )}
                
                {member.location && member.isSharing && (
                  <Tooltip title="View on Map">
                    <IconButton size="small" onClick={() => handleViewLocation(member.id)}>
                      <LocationOn />
                    </IconButton>
                  </Tooltip>
                )}
              </Box>
            </ListItem>
          ))}
        </List>

        {/* Real-time indicators */}
        <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
          <Typography variant="caption" color="text.secondary">
            🔄 Last updated: {new Date().toLocaleTimeString()} • 
            Real-time sync active • 
            {partyMembers.filter(m => m.status === 'online').length} members online
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default RealTimePartyStatus;
