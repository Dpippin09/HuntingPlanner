import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper
} from '@mui/material';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #2e7d32 0%, #4caf50 50%, #66bb6a 100%)',
        display: 'flex',
        alignItems: 'center',
        py: 4
      }}
    >
      <Container maxWidth="sm">
        {/* Background Pattern */}
        <Paper
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.1,
            backgroundImage: `
              radial-gradient(circle at 20% 20%, rgba(255,255,255,0.3) 2px, transparent 2px),
              radial-gradient(circle at 80% 80%, rgba(255,255,255,0.3) 2px, transparent 2px),
              radial-gradient(circle at 40% 40%, rgba(255,255,255,0.3) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px, 50px 50px, 25px 25px',
            zIndex: 0
          }}
        />

        {/* Main Content */}
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          {/* App Title */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography
              variant="h2"
              sx={{
                fontWeight: 'bold',
                color: 'white',
                textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                mb: 1
              }}
            >
              🦌 Hunting Planner
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: 'rgba(255,255,255,0.9)',
                textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
                maxWidth: 500,
                mx: 'auto'
              }}
            >
              Plan your hunting trips, coordinate with your party, and stay safe in the field
            </Typography>
          </Box>

          {/* Authentication Forms */}
          {isLogin ? (
            <LoginForm onSwitchToSignup={() => setIsLogin(false)} />
          ) : (
            <SignupForm onSwitchToLogin={() => setIsLogin(true)} />
          )}

          {/* Footer */}
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Typography
              variant="body2"
              sx={{
                color: 'rgba(255,255,255,0.8)',
                textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
              }}
            >
              © 2024 Hunting Planner. Your hunting adventure starts here.
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default AuthPage;
