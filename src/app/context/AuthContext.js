'use client';
import axios from 'axios';
import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(true); // Prevent early rendering
  const [totalclientlength, setTotalClientLength] = useState(0);
  const [jaa, setJaa] = useState(false);
const [hasLowStock, setHasLowStock] = useState(false);
const [totalLowStock, setTotalLowStock] = useState(0);
  const [todayReviews, setTodayReviews] = useState([]);
  const [overdueReviews, setOverdueReviews] = useState([]);
  const [totalToday, setTotalToday] = useState(0);
  const [totalOverdue, setTotalOverdue] = useState(0);
  const [hasReviews, setHasReviews] = useState(false); // 👈
console.log(
  "AuthContext Rendered: ",
  { user, token, hasLowStock, totalLowStock, todayReviews, overdueReviews, totalToday, totalOverdue, hasReviews }
);


  const [userclient, setUserclient] = useState({
    clients: [],
  });

  // ✅ Check token on load
  useEffect(() => {
  const storedToken = localStorage.getItem('token');
  const storedUser = localStorage.getItem('user'); // ✅ new

  if (storedToken) {
    try {
      const decoded = JSON.parse(atob(storedToken.split('.')[1]));

      if (decoded.exp * 1000 < Date.now()) {
        localStorage.removeItem('token');
        localStorage.removeItem('user'); // ✅ new
        setToken('');
        setUser(null);
        return;
      }

      setToken(storedToken);
      // ✅ If decoded has limited info, merge with stored user
      setUser(storedUser ? JSON.parse(storedUser) : decoded);
    } catch (err) {
      console.error('Invalid token');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }
  setLoading(false);
}, []);

const login = (token, userInfo) => {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(userInfo)); // ✅ new
  setToken(token);
  setUser(userInfo);
  setJaa(true);
};


  const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  setToken('');
  setUser(null);
};// ✅ Define function before useEffect
const fetchLowStock = async () => {
  try {
    const res = await axios.get(
      "http://localhost:3000/medications/low-stock",
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }
    );

    // ✅ Set values from backend
    setHasLowStock(res.data.hasLowStock || false);
    setTotalLowStock(res.data.totalLowStock || 0);
  } catch (err) {
    console.error("Error fetching low stock:", err);
  }
};

// ✅ Auto refresh every 10s
  const fetchReviews = async () => {
    try {
      const res = await axios.get('http://localhost:3000/carePlanning/alerts', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });

      setTodayReviews(res.data.todayReviews);
      setOverdueReviews(res.data.overdueReviews);
      setTotalToday(res.data.totalToday);
      setTotalOverdue(res.data.totalOverdue);
      setHasReviews(res.data.hasAlerts);

      // ✅ Toastify Alerts
      if (res.data.todayReviews.length > 0) {
        const names = res.data.todayReviews
          .map((p) => `${p.client?.fullname || 'Unknown'} (${p.planType})`)
          .join(', ');
      }

      if (res.data.overdueReviews.length > 0) {
        const names = res.data.overdueReviews
          .map((p) => `${p.client?.fullname || 'Unknown'} (${p.planType})`)
          .join(', ');
      }
    } catch (err) {
      console.error('Error fetching care plan alerts:', err);
    }
  };

  // 🔁 Auto-refresh every 10 seconds
  useEffect(() => {
    fetchLowStock();
    fetchReviews();
    const interval = setInterval(() => {
      fetchLowStock();
      fetchReviews();
    }, 10000);
    return () => clearInterval(interval);
  }, []);



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
  hasLowStock,          // ✅ new
  setHasLowStock,       // ✅ new
  totalLowStock,
  setTotalLowStock,
  todayReviews,
  setTodayReviews,
  
  overdueReviews,
  setOverdueReviews,
  
  totalToday,
  setTotalToday,
  
  totalOverdue,
  setTotalOverdue,
  hasReviews,          // 👈 new
  setHasReviews,       // 👈 new
}), [user, token, totalclientlength, jaa, userclient, hasLowStock ]);

  // ✅ Wait until token/user are checked
  if (loading) return null;

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
