// ============================================
// Authentication Types
// ============================================

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  token: string;
  message: string;
}

export interface User {
  id: string;
  username: string;
  role: string;
  isActive: boolean;
  lastLogin?: Date;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
}