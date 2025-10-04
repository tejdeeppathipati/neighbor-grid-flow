import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

export type Role = 'admin' | 'user';

export interface AuthState {
  isAuthenticated: boolean;
  role: Role | null;
  userId?: string | null;
}

interface AuthContextType extends AuthState {
  login: (role: Role, userId?: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'ng.auth';

export function AuthProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    role: null,
    userId: null,
  });

  // Hydrate from sessionStorage on mount
  useEffect(() => {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.isAuthenticated && parsed.role) {
          setAuthState(parsed);
        } else {
          sessionStorage.removeItem(STORAGE_KEY);
        }
      } catch {
        sessionStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  const login = (role: Role, userId?: string) => {
    const newState: AuthState = {
      isAuthenticated: true,
      role,
      userId: userId || null,
    };
    setAuthState(newState);
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
  };

  const logout = () => {
    const newState: AuthState = {
      isAuthenticated: false,
      role: null,
      userId: null,
    };
    setAuthState(newState);
    sessionStorage.removeItem(STORAGE_KEY);
    navigate('/login/user');
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
