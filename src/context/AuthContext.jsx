import React, { createContext, useState, useContext, useEffect } from 'react';

// Helper function to get token from localStorage
const getTokenFromStorage = () => localStorage.getItem('authToken');

const AuthContext = createContext(null);

// --- MAKE SURE THIS LINE IS HERE AND CORRECT ---
const apiUrl = import.meta.env.VITE_API_BASE_URL;
// ---------------------------------------------

export function AuthProvider({ children }) {
  const [token, setToken] = useState(getTokenFromStorage()); 
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Efek untuk fetch user data ketika token berubah
  useEffect(() => {
    async function fetchUser() {
      if (token) {
        try {
          setError(null);
          const response = await fetch(`http://localhost:3001/api/auth/me`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          
          if (response.ok) {
            const userData = await response.json();
            setUser(userData);
          } else {
            // Token tidak valid atau kedaluwarsa
            console.warn('Token tidak valid, melakukan logout...');
            localStorage.removeItem('authToken');
            setToken(null);
            setUser(null);
            setError('Sesi Anda telah berakhir. Silakan login kembali.');
          }
        } catch (error) {
          console.error("Gagal fetch user:", error);
          localStorage.removeItem('authToken');
          setToken(null);
          setUser(null);
          setError('Terjadi kesalahan saat memuat data pengguna.');
        }
      } else {
        // Tidak ada token, pastikan state bersih
        setUser(null);
        setError(null);
      }
      setLoading(false);
    }
    
    setLoading(true);
    fetchUser();
  }, [token]);

  const login = (newToken) => {
    try {
      localStorage.setItem('authToken', newToken);
      setToken(newToken);
      setError(null); // Reset error saat login berhasil
    } catch (error) {
      console.error('Gagal menyimpan token:', error);
      setError('Gagal menyimpan informasi login.');
    }
  };

  const logout = () => {
    try {
      localStorage.removeItem('authToken');
      setToken(null);
      setUser(null);
      setError(null); // Reset error saat logout
    } catch (error) {
      console.error('Gagal logout:', error);
      setError('Gagal melakukan logout.');
    }
  };

  const updateUser = (userData) => {
    setUser(userData);
  };

  // Value yang disediakan oleh context
  const value = { 
    token, 
    user, 
    login, 
    logout, 
    setUser: updateUser, 
    loading,
    error,
    clearError: () => setError(null)
  }; 

  // Optional: Tampilkan loading screen yang lebih baik
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        flexDirection: 'column',
        gap: '16px'
      }}>
        <div style={{ 
          width: '40px', 
          height: '40px', 
          border: '4px solid #f3f3f3', 
          borderTop: '4px solid #667eea', 
          borderRadius: '50%', 
          animation: 'spin 1s linear infinite' 
        }}></div>
        <p style={{ color: '#666', margin: 0 }}>Memuat aplikasi...</p>
        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        </style>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}