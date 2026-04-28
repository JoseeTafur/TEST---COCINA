import { createContext, useState, useEffect } from 'react';
import apiClient from '../api/apiClient';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Estado para esperar la verificación

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Opcional: Podrías llamar a un endpoint /api/auth/me para validar el token
      const savedUser = JSON.parse(localStorage.getItem('user'));
      setUser(savedUser);
    }
    setLoading(false); // Terminamos de verificar
  }, []);

  const login = (userData, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('cart');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children} {/* No renderiza nada hasta que sepamos si hay usuario */}
    </AuthContext.Provider>
  );
};