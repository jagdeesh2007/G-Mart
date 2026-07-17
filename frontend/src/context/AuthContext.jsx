import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser && token) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, [token]);

  const login = async (email, password) => {
    try {
      const response = await API.post('/auth/login', { email, password });
      const { token: jwtToken, id, firstName, lastName, role, roles: resRoles } = response.data;
      
      localStorage.setItem('token', jwtToken);
      const roles = resRoles || (role ? [role] : []);
      const userData = { id, email, firstName, lastName, roles };
      localStorage.setItem('user', JSON.stringify(userData));
      
      setToken(jwtToken);
      setUser(userData);
      return { success: true };
    } catch (error) {
      const msg = error.response?.data?.message || 'Login failed. Invalid credentials.';
      return { success: false, message: msg };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  const sendRegisterOtp = async (userData) => {
    try {
      const response = await API.post('/auth/register/send-otp', userData);
      return response.data; // { success: true, message: '...' }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to send verification email.',
      };
    }
  };

  const verifyRegisterOtp = async (userData, otp) => {
    try {
      const response = await API.post(`/auth/register/verify?otp=${otp}`, userData);
      return response.data; // { success: true, message: '...' }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Verification failed. Please try again.',
      };
    }
  };

  const sendForgotPasswordOtp = async (email) => {
    try {
      const response = await API.post(`/auth/forgot-password/send-otp?email=${email}`);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to send password reset OTP.',
      };
    }
  };

  const resetPassword = async (email, otp, newPassword) => {
    try {
      const response = await API.post('/auth/forgot-password/reset', { email, otp, newPassword });
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Reset password failed.',
      };
    }
  };

  const isAdmin = user?.roles?.includes('ROLE_ADMIN') || false;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        logout,
        sendRegisterOtp,
        verifyRegisterOtp,
        sendForgotPasswordOtp,
        resetPassword,
        isAdmin,
        isAuthenticated: !!token,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
