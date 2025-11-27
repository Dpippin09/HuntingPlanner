import React, { useState } from 'react';
import {
  Box,
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Typography,
  Divider,
  Chip
} from '@mui/material';
import {
  Person,
  Settings,
  Logout,
  AdminPanelSettings
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

const UserProfileMenu: React.FC = () => {
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
  };

  if (!user) return null;

  return (
    <Box>
      {/* Profile Button */}
      <Button
        onClick={handleMenuOpen}
        sx={{
          color: 'white',
          textTransform: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          '&:hover': {
            backgroundColor: 'rgba(255,255,255,0.1)'
          }
        }}
      >
        <Avatar 
          sx={{ 
            width: 32, 
            height: 32, 
            bgcolor: 'secondary.main',
            fontSize: '0.875rem'
          }}
        >
          {user.avatar || user.displayName.charAt(0)}
        </Avatar>
        <Box sx={{ textAlign: 'left', display: { xs: 'none', sm: 'block' } }}>
          <Typography variant="body2" sx={{ lineHeight: 1.2 }}>
            {user.displayName}
          </Typography>
          <Typography variant="caption" sx={{ opacity: 0.8, lineHeight: 1 }}>
            {user.huntingExperience}
          </Typography>
        </Box>
      </Button>

      {/* Dropdown Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            mt: 1,
            minWidth: 280,
            '& .MuiMenuItem-root': {
              px: 2,
              py: 1
            }
          }
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {/* Profile Header */}
        <Box sx={{ px: 2, py: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar 
              sx={{ 
                width: 48, 
                height: 48, 
                bgcolor: 'primary.main'
              }}
            >
              {user.avatar || user.displayName.charAt(0)}
            </Avatar>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                {user.displayName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {user.email}
              </Typography>
              <Box sx={{ mt: 1 }}>
                <Chip 
                  label={user.huntingExperience} 
                  size="small" 
                  color="primary"
                  variant="outlined"
                />
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Profile Stats */}
        <Box sx={{ px: 2, py: 1 }}>
          <Typography variant="caption" color="text.secondary">
            Member since {user.createdAt.toLocaleDateString()}
          </Typography>
        </Box>

        <Divider />

        {/* Menu Items */}
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <Person />
          </ListItemIcon>
          <ListItemText 
            primary="Edit Profile"
            secondary="Update your information"
          />
        </MenuItem>

        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <Settings />
          </ListItemIcon>
          <ListItemText 
            primary="Settings"
            secondary="App preferences"
          />
        </MenuItem>

        {user.huntingExperience === 'expert' && (
          <MenuItem onClick={handleMenuClose}>
            <ListItemIcon>
              <AdminPanelSettings />
            </ListItemIcon>
            <ListItemText 
              primary="Trip Management"
              secondary="Manage your hunting trips"
            />
          </MenuItem>
        )}

        <Divider />

        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout />
          </ListItemIcon>
          <ListItemText 
            primary="Sign Out"
            secondary="Sign out of your account"
          />
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default UserProfileMenu;
