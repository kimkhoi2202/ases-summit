import React, { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  user: any | null;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  login: async () => ({ success: false }),
  logout: async () => {},
  user: null
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already authenticated using local storage
    const authStatus = localStorage.getItem('ases_auth');
    const username = localStorage.getItem('ases_username');

    if (authStatus === 'authenticated') {
      setIsAuthenticated(true);
      setUser({
        id: '1',
        username: username || 'organizer',
        role: 'organizer'
      });
    }

    setLoading(false);
  }, []);

  // Simple login function that doesn't rely on Supabase auth
  const login = async (username: string, password: string) => {
    try {
      // Check if username and password match the environment variables
      if (username === import.meta.env.VITE_AUTH_USERNAME && password === import.meta.env.VITE_AUTH_PASSWORD) {
        // Store authentication in local storage
        localStorage.setItem('ases_auth', 'authenticated');
        localStorage.setItem('ases_username', username);

        // Set authenticated state
        setIsAuthenticated(true);
        setUser({
          id: '1',
          username: username,
          role: 'organizer'
        });

        return { success: true };
      }

      return { success: false, error: 'Invalid username or password' };
    } catch (error) {
      console.error('Error during login:', error);
      return { success: false, error: 'An unexpected error occurred' };
    }
  };

  const logout = async () => {
    // Remove authentication from local storage
    localStorage.removeItem('ases_auth');
    localStorage.removeItem('ases_username');

    // Reset state
    setIsAuthenticated(false);
    setUser(null);
  };

  if (loading) {
    // You could return a loading spinner here if needed
    return null;
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};