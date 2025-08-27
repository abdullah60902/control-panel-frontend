'use client';
import { createContext, useContext, useState, useEffect, useMemo } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(true); // Prevent early rendering
  const [totalclientlength, setTotalClientLength] = useState(0);
  const [jaa, setJaa] = useState(false);

  const [userclient, setUserclient] = useState({
    clients: [],
  });

  // ✅ Check token on load
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      try {
        const decoded = JSON.parse(atob(storedToken.split('.')[1]));

        // Check expiry
        if (decoded.exp * 1000 < Date.now()) {
          localStorage.removeItem('token');
          setToken('');
          setUser(null);
          return;
        }

        setToken(storedToken);
        setUser(decoded);
      } catch (err) {
        console.error('Invalid token');
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  const login = (token, userInfo) => {
    localStorage.setItem('token', token);
    setToken(token);
    setUser(userInfo);
    setJaa(true);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken('');
    setUser(null);
  };

  // ✅ Helper to check if user has clients
  const hasClients = user?.clients && user.clients.length > 0;

  const contextValue = useMemo(() => ({
    user,
    token,
    login,
    logout,
    totalclientlength,
    setTotalClientLength,
    jaa,
    setJaa,
    userclient,
    setUser,
    hasClients,
  }), [user, token, totalclientlength, jaa, userclient]);

  // ✅ Wait until token/user are checked
  if (loading) return null;

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
