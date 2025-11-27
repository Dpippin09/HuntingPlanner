export interface User {
  id: string;
  email: string;
  displayName: string;
  avatar?: string;
  phone?: string;
  createdAt: Date;
  huntingExperience: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  certifications?: string[];
  location?: {
    state: string;
    country: string;
  };
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  email: string;
  password: string;
  confirmPassword: string;
  displayName: string;
  phone?: string;
  huntingExperience: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  state?: string;
}
