import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios'; // Axios importu şart

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<User>; 
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      try {
        const decoded: any = jwtDecode(savedToken);
        const currentTime = Date.now() / 1000;

        if (decoded.exp < currentTime) {
          logout(); 
        } else {
          setUser({
            id: decoded.id,
            name: decoded.name || 'Kullanıcı',
            email: decoded.email,
            role: decoded.role
          } as User);
          axios.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
        }
      } catch (err) {
        localStorage.removeItem('token');
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<User> => {
    try {
      const res = await axios.post('http://localhost:5001/api/login', { email, password });
      const { user: userData, token } = res.data;

      localStorage.setItem('token', token); 
      setUser(userData); 
      
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      return userData;
    } catch (error: any) {
      console.error("Login Hatası:", error.response?.data?.message || error.message);
      throw new Error(error.response?.data?.message || 'Giriş başarısız!');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};