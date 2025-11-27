import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Alert,
  Link,
  InputAdornment,
  IconButton,
  Divider,
  Chip
} from '@mui/material';
import {
  Email,
  Lock,
  Visibility,
  VisibilityOff,
  Pets,
  Login as LoginIcon
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

interface LoginFormProps {
  onSwitchToSignup: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToSignup }) => {
  const { login, isLoading, error } = useAuth();
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');

    if (!credentials.email || !credentials.password) {
      setLocalError('Please fill in all fields');
      return;
    }

    try {
      await login(credentials);
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const handleDemoLogin = () => {
    setCredentials({
      email: 'john@example.com',
      password: 'password123'
    });
  };

  return (
    <Card sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
      <CardContent sx={{ p: 4 }}>
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Pets sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
          <Typography variant="h4" gutterBottom>
            Welcome Back
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Sign in to your hunting planner account
          </Typography>
        </Box>

        {/* Demo Account Info */}
        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="body2">
            <strong>Demo Account:</strong><br />
            Email: john@example.com<br />
            Password: password123
            <Button 
              size="small" 
              onClick={handleDemoLogin}
              sx={{ ml: 1, mt: 1 }}
            >
              Use Demo
            </Button>
          </Typography>
        </Alert>

        {/* Error Display */}
        {(error || localError) && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error || localError}
          </Alert>
        )}

        {/* Login Form */}
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email Address"
            type="email"
            value={credentials.email}
            onChange={(e) => setCredentials(prev => ({ ...prev, email: e.target.value }))}
            margin="normal"
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email />
                </InputAdornment>
              ),
            }}
            placeholder="your.email@example.com"
          />

          <TextField
            fullWidth
            label="Password"
            type={showPassword ? 'text' : 'password'}
            value={credentials.password}
            onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
            margin="normal"
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={isLoading}
            startIcon={<LoginIcon />}
            sx={{ mt: 3, mb: 2, py: 1.5 }}
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </Button>
        </Box>

        <Divider sx={{ my: 3 }}>
          <Chip label="New to Hunting Planner?" size="small" />
        </Divider>

        {/* Switch to Signup */}
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2">
            Don't have an account?{' '}
            <Link 
              component="button" 
              type="button"
              onClick={onSwitchToSignup}
              sx={{ fontWeight: 'bold' }}
            >
              Create Account
            </Link>
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default LoginForm;
