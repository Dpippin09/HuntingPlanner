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
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText
} from '@mui/material';
import {
  Email,
  Lock,
  Visibility,
  VisibilityOff,
  Person,
  Phone,
  Pets,
  PersonAdd,
  LocationOn
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

interface SignupFormProps {
  onSwitchToLogin: () => void;
}

const SignupForm: React.FC<SignupFormProps> = ({ onSwitchToLogin }) => {
  const { signup, isLoading, error } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    displayName: '',
    phone: '',
    huntingExperience: 'beginner' as const,
    state: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [localError, setLocalError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');

    // Validation
    if (!formData.email || !formData.password || !formData.displayName) {
      setLocalError('Please fill in all required fields');
      return;
    }

    if (formData.password.length < 6) {
      setLocalError('Password must be at least 6 characters long');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setLocalError('Passwords do not match');
      return;
    }

    try {
      await signup(formData);
    } catch (error) {
      console.error('Signup error:', error);
    }
  };

  const handleChange = (field: string) => (e: any) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  const usStates = [
    'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado',
    'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho',
    'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana',
    'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota',
    'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada',
    'New Hampshire', 'New Jersey', 'New Mexico', 'New York',
    'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon',
    'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
    'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington',
    'West Virginia', 'Wisconsin', 'Wyoming'
  ];

  return (
    <Card sx={{ maxWidth: 500, mx: 'auto', mt: 4 }}>
      <CardContent sx={{ p: 4 }}>
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Pets sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
          <Typography variant="h4" gutterBottom>
            Join Hunting Planner
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Create your account to start planning hunting trips
          </Typography>
        </Box>

        {/* Error Display */}
        {(error || localError) && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error || localError}
          </Alert>
        )}

        {/* Signup Form */}
        <Box component="form" onSubmit={handleSubmit}>
          {/* Email */}
          <TextField
            fullWidth
            label="Email Address"
            type="email"
            value={formData.email}
            onChange={handleChange('email')}
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

          {/* Display Name */}
          <TextField
            fullWidth
            label="Full Name"
            value={formData.displayName}
            onChange={handleChange('displayName')}
            margin="normal"
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Person />
                </InputAdornment>
              ),
            }}
            placeholder="John Smith"
          />

          {/* Phone (Optional) */}
          <TextField
            fullWidth
            label="Phone Number (Optional)"
            type="tel"
            value={formData.phone}
            onChange={handleChange('phone')}
            margin="normal"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Phone />
                </InputAdornment>
              ),
            }}
            placeholder="+1-555-0123"
          />

          {/* Hunting Experience */}
          <FormControl fullWidth margin="normal" required>
            <InputLabel>Hunting Experience</InputLabel>
            <Select
              value={formData.huntingExperience}
              label="Hunting Experience"
              onChange={handleChange('huntingExperience')}
            >
              <MenuItem value="beginner">Beginner - New to hunting</MenuItem>
              <MenuItem value="intermediate">Intermediate - Some experience</MenuItem>
              <MenuItem value="advanced">Advanced - Several years experience</MenuItem>
              <MenuItem value="expert">Expert - Highly experienced</MenuItem>
            </Select>
            <FormHelperText>This helps match you with appropriate hunting groups</FormHelperText>
          </FormControl>

          {/* State (Optional) */}
          <FormControl fullWidth margin="normal">
            <InputLabel>State (Optional)</InputLabel>
            <Select
              value={formData.state}
              label="State (Optional)"
              onChange={handleChange('state')}
              startAdornment={
                <InputAdornment position="start">
                  <LocationOn />
                </InputAdornment>
              }
            >
              <MenuItem value="">
                <em>Select your state</em>
              </MenuItem>
              {usStates.map((state) => (
                <MenuItem key={state} value={state}>
                  {state}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>Help find local hunting opportunities</FormHelperText>
          </FormControl>

          {/* Password */}
          <TextField
            fullWidth
            label="Password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={handleChange('password')}
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
            helperText="Must be at least 6 characters"
          />

          {/* Confirm Password */}
          <TextField
            fullWidth
            label="Confirm Password"
            type={showConfirmPassword ? 'text' : 'password'}
            value={formData.confirmPassword}
            onChange={handleChange('confirmPassword')}
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
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    edge="end"
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
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
            startIcon={<PersonAdd />}
            sx={{ mt: 3, mb: 2, py: 1.5 }}
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </Button>
        </Box>

        <Divider sx={{ my: 3 }}>
          <Chip label="Already have an account?" size="small" />
        </Divider>

        {/* Switch to Login */}
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2">
            Already have an account?{' '}
            <Link 
              component="button" 
              type="button"
              onClick={onSwitchToLogin}
              sx={{ fontWeight: 'bold' }}
            >
              Sign In
            </Link>
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default SignupForm;
