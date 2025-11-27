import React, { useState } from 'react';
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
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Avatar,
  Chip,
  Divider
} from '@mui/material';
import {
  Add,
  Delete,
  Edit,
  Person,
  Phone,
  Email,
  Badge,
  Warning
} from '@mui/icons-material';
import { useHuntingTrip } from '../../context/HuntingTripContext';
import { HunterMember } from '../../types';

const HuntingParty: React.FC = () => {
  const { 
    currentTrip, 
    addPartyMember, 
    updatePartyMember, 
    deletePartyMember 
  } = useHuntingTrip();
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<HunterMember | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    licenseNumber: '',
    emergencyContactName: '',
    emergencyContactPhone: ''
  });

  const handleAddMember = () => {
    if (!currentTrip || !formData.name.trim()) return;
    
    const memberData = {
      name: formData.name,
      email: formData.email || undefined,
      phone: formData.phone || undefined,
      role: formData.role,
      licenseNumber: formData.licenseNumber || undefined,
      emergencyContact: (formData.emergencyContactName && formData.emergencyContactPhone) ? {
        name: formData.emergencyContactName,
        phone: formData.emergencyContactPhone
      } : undefined
    };

    if (editingMember) {
      updatePartyMember(currentTrip.id, editingMember.id, memberData);
    } else {
      addPartyMember(currentTrip.id, memberData);
    }
    
    handleCloseDialog();
  };

  const handleEditMember = (member: HunterMember) => {
    setEditingMember(member);
    setFormData({
      name: member.name,
      email: member.email || '',
      phone: member.phone || '',
      role: member.role,
      licenseNumber: member.licenseNumber || '',
      emergencyContactName: member.emergencyContact?.name || '',
      emergencyContactPhone: member.emergencyContact?.phone || ''
    });
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingMember(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      role: '',
      licenseNumber: '',
      emergencyContactName: '',
      emergencyContactPhone: ''
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleColor = (role: string) => {
    const lowerRole = role.toLowerCase();
    if (lowerRole.includes('lead') || lowerRole.includes('guide')) return 'primary';
    if (lowerRole.includes('safety')) return 'error';
    if (lowerRole.includes('cook') || lowerRole.includes('camp')) return 'success';
    return 'default';
  };

  if (!currentTrip) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="info">
          Please select or create a trip to manage your hunting party.
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Hunting Party - {currentTrip.name}
      </Typography>

      {/* Party Summary */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} sm={6}>
              <Typography variant="h6">
                Party Size: {currentTrip.huntingParty.length} Member{currentTrip.huntingParty.length !== 1 ? 's' : ''}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Trip: {new Date(currentTrip.startDate).toLocaleDateString()} - {new Date(currentTrip.endDate).toLocaleDateString()}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {Array.from(new Set(currentTrip.huntingParty.map(m => m.role).filter(r => r))).map(role => (
                  <Chip 
                    key={role}
                    label={role}
                    size="small"
                    color={getRoleColor(role) as any}
                  />
                ))}
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Add Member Button */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">
          Party Members
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setDialogOpen(true)}
        >
          Add Member
        </Button>
      </Box>

      {/* Members List */}
      {currentTrip.huntingParty.length === 0 ? (
        <Card>
          <CardContent>
            <Typography variant="h6" color="text.secondary" align="center">
              No party members added yet
            </Typography>
            <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
              Add your first party member to get started
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={2}>
          {currentTrip.huntingParty.map((member) => (
            <Grid item xs={12} md={6} lg={4} key={member.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                    <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                      {getInitials(member.name)}
                    </Avatar>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" component="div">
                        {member.name}
                      </Typography>
                      {member.role && (
                        <Chip 
                          label={member.role}
                          size="small"
                          color={getRoleColor(member.role) as any}
                          sx={{ mt: 0.5 }}
                        />
                      )}
                    </Box>
                    <Box>
                      <IconButton 
                        size="small" 
                        onClick={() => handleEditMember(member)}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        onClick={() => deletePartyMember(currentTrip.id, member.id)}
                        color="error"
                      >
                        <Delete />
                      </IconButton>
                    </Box>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  {/* Contact Information */}
                  <List dense>
                    {member.email && (
                      <ListItem sx={{ px: 0 }}>
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <Email fontSize="small" />
                        </ListItemIcon>
                        <ListItemText 
                          primary={member.email}
                          primaryTypographyProps={{ variant: 'body2' }}
                        />
                      </ListItem>
                    )}
                    
                    {member.phone && (
                      <ListItem sx={{ px: 0 }}>
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <Phone fontSize="small" />
                        </ListItemIcon>
                        <ListItemText 
                          primary={member.phone}
                          primaryTypographyProps={{ variant: 'body2' }}
                        />
                      </ListItem>
                    )}

                    {member.licenseNumber && (
                      <ListItem sx={{ px: 0 }}>
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <Badge fontSize="small" />
                        </ListItemIcon>
                        <ListItemText 
                          primary={`License: ${member.licenseNumber}`}
                          primaryTypographyProps={{ variant: 'body2' }}
                        />
                      </ListItem>
                    )}

                    {member.emergencyContact && (
                      <ListItem sx={{ px: 0 }}>
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <Warning fontSize="small" color="error" />
                        </ListItemIcon>
                        <ListItemText 
                          primary={`Emergency: ${member.emergencyContact.name}`}
                          secondary={member.emergencyContact.phone}
                          primaryTypographyProps={{ variant: 'body2' }}
                          secondaryTypographyProps={{ variant: 'caption' }}
                        />
                      </ListItem>
                    )}
                  </List>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Add/Edit Member Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingMember ? 'Edit Party Member' : 'Add Party Member'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Full Name *"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Role/Position"
                value={formData.role}
                onChange={(e) => setFormData({...formData, role: e.target.value})}
                placeholder="e.g., Lead Hunter, Safety Officer, Cook"
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone Number"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Hunting License Number"
                value={formData.licenseNumber}
                onChange={(e) => setFormData({...formData, licenseNumber: e.target.value})}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
                Emergency Contact
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Emergency Contact Name"
                value={formData.emergencyContactName}
                onChange={(e) => setFormData({...formData, emergencyContactName: e.target.value})}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Emergency Contact Phone"
                value={formData.emergencyContactPhone}
                onChange={(e) => setFormData({...formData, emergencyContactPhone: e.target.value})}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button 
            onClick={handleAddMember} 
            variant="contained"
            disabled={!formData.name.trim()}
          >
            {editingMember ? 'Update' : 'Add'} Member
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default HuntingParty;
