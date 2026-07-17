import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { ShoppingCart, Eye, EyeOff, Mail, Lock } from 'lucide-react';

const Login = ({ onToggleView, onForgotPassword }) => {
  const { login } = useAuth();
  const { showSuccess, showError } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      showError('Please fill in all fields!');
      return;
    }
    
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    
    if (result.success) {
      showSuccess('Welcome back to G-Shop!');
    } else {
      showError(result.message);
    }
  };

  return (
    <div className="animate-fade-in" style={{
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
      fontFamily: 'Outfit, sans-serif'
    }}>
      {/* Left Column - Graphic Banner (Hidden on mobile/tablet) */}
      <div style={{
        flex: 1,
        backgroundColor: '#2563eb',
        color: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '60px',
        position: 'relative',
        overflow: 'hidden'
      }} className="hidden-mobile">
        {/* Subtle geometric circles background */}
        <div style={{
          position: 'absolute',
          top: '-10%',
          right: '-10%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.05)',
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-20%',
          left: '-10%',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.03)',
        }} />

        <div style={{ position: 'relative', zIndex: 2, maxWidth: '500px' }}>
          <h1 style={{
            fontSize: '44px',
            fontWeight: '800',
            lineHeight: '1.2',
            marginBottom: '20px',
            letterSpacing: '-1px'
          }}>
            Simplify management With Our dashboard.
          </h1>
          <p style={{
            fontSize: '18px',
            color: 'rgba(255, 255, 255, 0.85)',
            lineHeight: '1.6',
            marginBottom: '40px',
            fontWeight: '400'
          }}>
            Simplify your e-commerce management with our user-friendly admin dashboard. Settle payments, manage stocks, and track order logistics in real-time.
          </p>

          {/* Luxury Mock 3D Illustration Representation */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(16px)',
            borderRadius: '24px',
            padding: '30px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
              <div style={{
                background: '#ffffff',
                color: '#2563eb',
                width: '48px',
                height: '48px',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 16px rgba(0,0,0,0.05)'
              }}>
                <ShoppingCart size={24} />
              </div>
              <div>
                <h4 style={{ fontWeight: '700', fontSize: '16px', margin: 0 }}>G-Shop Platform</h4>
                <p style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.7)', margin: 0 }}>Active Store Management</p>
              </div>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {['Electronics', 'Vegetables', 'Apparel', 'Activewear'].map((tag) => (
                <span key={tag} style={{
                  fontSize: '12px',
                  fontWeight: '600',
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  padding: '6px 12px',
                  borderRadius: '100px',
                  color: '#ffffff'
                }}>{tag}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right Column - Form Container */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '40px 60px',
        backgroundColor: '#ffffff'
      }} className="full-width-mobile">
        <div style={{ maxWidth: '420px', width: '100%', margin: '0 auto' }}>
          
          {/* Logo Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '40px' }}>
            <div style={{
              backgroundColor: '#2563eb',
              color: '#ffffff',
              padding: '8px',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <ShoppingCart size={22} />
            </div>
            <span style={{ fontSize: '22px', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.5px' }}>G-Shop</span>
          </div>

          <h2 style={{ fontSize: '32px', fontWeight: '700', color: '#0f172a', marginBottom: '8px' }}>Welcome Back</h2>
          <p style={{ color: '#64748b', fontSize: '15px', marginBottom: '32px' }}>Please login to your account</p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Email Input */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '14px', fontWeight: '600', color: '#334155' }}>Email address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} style={{
                  position: 'absolute',
                  left: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#94a3b8'
                }} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  style={{ paddingLeft: '44px' }}
                />
              </div>
            </div>

            {/* Password Input */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label style={{ fontSize: '14px', fontWeight: '600', color: '#334155' }}>Password</label>
                <button
                  type="button"
                  onClick={onForgotPassword}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#2563eb',
                    fontSize: '13px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Forgot Password?
                </button>
              </div>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{
                  position: 'absolute',
                  left: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#94a3b8'
                }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  style={{ paddingLeft: '44px', paddingRight: '44px' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '14px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#94a3b8',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{
                width: '100%',
                padding: '12px',
                marginTop: '10px',
                opacity: loading ? 0.7 : 1,
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? (
                <div style={{
                  width: '20px',
                  height: '20px',
                  border: '3px solid rgba(255,255,255,0.3)',
                  borderTopColor: '#ffffff',
                  borderRadius: '50%',
                  animation: 'spin 0.8s linear infinite'
                }} />
              ) : 'Login'}
            </button>
          </form>

          {/* Social Logins */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            margin: '30px 0',
            color: '#94a3b8',
            fontSize: '13px'
          }}>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#e2e8f0' }} />
            <span>Or Login With</span>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#e2e8f0' }} />
          </div>

          <div style={{ display: 'flex', gap: '16px', marginBottom: '32px' }}>
            <button
              type="button"
              className="btn-outline"
              onClick={() => showSuccess('Google Authentication is architectural simulation.')}
              style={{
                flex: 1,
                padding: '10px',
                fontSize: '14px',
                fontWeight: '600',
                display: 'flex',
                gap: '8px',
                justifyContent: 'center'
              }}
            >
              <img src="https://logo.clearbit.com/google.com" alt="Google" style={{ width: '16px', height: '16px' }} />
              Google
            </button>
            <button
              type="button"
              className="btn-outline"
              onClick={() => showSuccess('Facebook Authentication is architectural simulation.')}
              style={{
                flex: 1,
                padding: '10px',
                fontSize: '14px',
                fontWeight: '600',
                display: 'flex',
                gap: '8px',
                justifyContent: 'center'
              }}
            >
              <img src="https://logo.clearbit.com/facebook.com" alt="Facebook" style={{ width: '16px', height: '16px' }} />
              Facebook
            </button>
          </div>

          {/* Switch View Link */}
          <p style={{
            textAlign: 'center',
            fontSize: '14px',
            color: '#64748b'
          }}>
            Don't have an account?{' '}
            <button
              onClick={onToggleView}
              style={{
                background: 'none',
                border: 'none',
                color: '#2563eb',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Signup
            </button>
          </p>

        </div>
      </div>
      
      {/* Inline styles for responsive tweaks */}
      <style>{`
        @media (max-width: 900px) {
          .hidden-mobile {
            display: none !important;
          }
          .full-width-mobile {
            flex: 1 1 100% !important;
            padding: 40px 20px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Login;
