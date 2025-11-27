import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthState, LoginCredentials, SignupData } from '../types/auth';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Mock user data for demonstration
const mockUsers: (User & { password: string })[] = [
  {
    id: 'user1',
    email: 'john@example.com',
    password: 'password123',
    displayName: 'John Smith',
    avatar: 'JS',
    phone: '+1-555-0123',
    createdAt: new Date('2024-01-15'),
    huntingExperience: 'expert',
    certifications: ['Hunter Safety', 'Bow Hunter Education'],
    location: { state: 'Minnesota', country: 'USA' }
  },
  {
    id: 'user2',
    email: 'sarah@example.com', 
    password: 'password123',
    displayName: 'Sarah Wilson',
    avatar: 'SW',
    phone: '+1-555-0124',
    createdAt: new Date('2024-02-10'),
    huntingExperience: 'intermediate',
    certifications: ['Hunter Safety'],
    location: { state: 'Wisconsin', country: 'USA' }
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null
  });

  // Check for saved session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('hunting-planner-user');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setAuthState({
          user: {
            ...user,
            createdAt: new Date(user.createdAt)
          },
          isAuthenticated: true,
          isLoading: false,
          error: null
        });
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('hunting-planner-user');
        setAuthState(prev => ({ ...prev, isLoading: false }));
      }
    } else {
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const login = async (credentials: LoginCredentials): Promise<void> => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Find user in mock data
      const mockUser = mockUsers.find(
        u => u.email === credentials.email && u.password === credentials.password
      );

      if (!mockUser) {
        throw new Error('Invalid email or password');
      }

      // Remove password from user object
      const { password, ...user } = mockUser;

      // Save to localStorage (in real app, would use secure tokens)
      localStorage.setItem('hunting-planner-user', JSON.stringify(user));

      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null
      });
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Login failed'
      }));
      throw error;
    }
  };

  const signup = async (data: SignupData): Promise<void> => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Validate passwords match
      if (data.password !== data.confirmPassword) {
        throw new Error('Passwords do not match');
      }

      // Check if user already exists
      if (mockUsers.some(u => u.email === data.email)) {
        throw new Error('An account with this email already exists');
      }

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Create new user
      const newUser: User = {
        id: `user_${Date.now()}`,
        email: data.email,
        displayName: data.displayName,
        avatar: data.displayName.split(' ').map(n => n[0]).join('').toUpperCase(),
        phone: data.phone,
        createdAt: new Date(),
        huntingExperience: data.huntingExperience,
        certifications: [],
        location: data.state ? { state: data.state, country: 'USA' } : undefined
      };

      // In a real app, this would be saved to a database
      mockUsers.push({ ...newUser, password: data.password });

      // Save to localStorage
      localStorage.setItem('hunting-planner-user', JSON.stringify(newUser));

      setAuthState({
        user: newUser,
        isAuthenticated: true,
        isLoading: false,
        error: null
      });
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Signup failed'
      }));
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('hunting-planner-user');
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null
    });
  };

  const updateProfile = async (updates: Partial<User>): Promise<void> => {
    if (!authState.user) throw new Error('No user logged in');

    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      const updatedUser = { ...authState.user, ...updates };
      
      // Save to localStorage
      localStorage.setItem('hunting-planner-user', JSON.stringify(updatedUser));

      setAuthState(prev => ({
        ...prev,
        user: updatedUser,
        isLoading: false
      }));
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Update failed'
      }));
      throw error;
    }
  };

  const value = {
    ...authState,
    login,
    signup,
    logout,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
