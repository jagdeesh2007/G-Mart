import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';

// Authentication Pages
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';

// Catalog Pages
import Home from './pages/Home';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import CustomerDashboard from './pages/CustomerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import { CartProvider } from './context/CartContext';

// Route Guards
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div>Loading session...</div>;
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  if (loading) return <div>Loading session...</div>;
  return isAuthenticated && isAdmin ? children : <Navigate to="/" replace />;
};

const AuthWrapper = () => {
  const [authView, setAuthView] = useState('login'); // 'login', 'register', 'forgot'
  const { isAuthenticated, isAdmin } = useAuth();

  if (isAuthenticated) {
    return <Navigate to={isAdmin ? "/admin" : "/"} replace />;
  }

  if (authView === 'register') {
    return <Register onToggleView={() => setAuthView('login')} />;
  }
  
  if (authView === 'forgot') {
    return <ForgotPassword onBackToLogin={() => setAuthView('login')} />;
  }

  return (
    <Login 
      onToggleView={() => setAuthView('register')} 
      onForgotPassword={() => setAuthView('forgot')} 
    />
  );
};

const AppContent = () => {
  return (
    <Routes>
      {/* Auth Route Group */}
      <Route path="/login" element={<AuthWrapper />} />
      <Route path="/register" element={<AuthWrapper />} />
      <Route path="/forgot-password" element={<AuthWrapper />} />

      {/* Public Catalog Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/product/:slug" element={<ProductDetails />} />

      {/* Customer Routes */}
      <Route path="/cart" element={<Cart />} />
      <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
      <Route path="/dashboard" element={<ProtectedRoute><CustomerDashboard /></ProtectedRoute>} />

      {/* Admin Panel */}
      <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
      
      {/* Catch-all Redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <CartProvider>
          <Router>
            <AppContent />
          </Router>
        </CartProvider>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
