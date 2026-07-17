import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { ShoppingCart, Mail, Lock, Key, ArrowLeft } from 'lucide-react';

const ForgotPassword = ({ onBackToLogin }) => {
  const { sendForgotPasswordOtp, resetPassword } = useAuth();
  const { showSuccess, showError } = useToast();

  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email) {
      showError('Please enter your email address!');
      return;
    }

    setLoading(true);
    const result = await sendForgotPasswordOtp(email);
    setLoading(false);

    if (result.success) {
      showSuccess(result.message || 'OTP sent successfully!');
      setOtpSent(true);
    } else {
      showError(result.message);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!otp || otp.length !== 6 || !newPassword) {
      showError('Please complete all fields!');
      return;
    }
    if (newPassword.length < 6) {
      showError('Password must be at least 6 characters long!');
      return;
    }

    setLoading(true);
    const result = await resetPassword(email, otp, newPassword);
    setLoading(false);

    if (result.success) {
      showSuccess('Password reset successfully! You can now log in.');
      onBackToLogin();
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
      {/* Left Column - Graphic Banner (Hidden on mobile) */}
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
            Recover your credentials.
          </h1>
          <p style={{
            fontSize: '18px',
            color: 'rgba(255, 255, 255, 0.85)',
            lineHeight: '1.6',
            marginBottom: '40px',
            fontWeight: '400'
          }}>
            Don't worry, it happens to all of us. Follow the simple steps to reset your password and secure your G-Shop profile.
          </p>
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '30px' }}>
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

          <h2 style={{ fontSize: '32px', fontWeight: '700', color: '#0f172a', marginBottom: '8px' }}>Reset Password</h2>
          <p style={{ color: '#64748b', fontSize: '15px', marginBottom: '32px' }}>Secure your account using a one-time verification link</p>

          {!otpSent ? (
            /* Email Request Form */
            <form onSubmit={handleSendOtp} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '14px', fontWeight: '600', color: '#334155' }}>Email address</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
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

              <button
                type="submit"
                disabled={loading}
                className="btn-primary"
                style={{
                  width: '100%',
                  padding: '12px',
                  opacity: loading ? 0.7 : 1,
                  cursor: loading ? 'not-allowed' : 'pointer'
                }}
              >
                {loading ? 'Sending OTP...' : 'Send Reset OTP'}
              </button>

              <button
                type="button"
                onClick={onBackToLogin}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#64748b',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  marginTop: '10px'
                }}
              >
                <ArrowLeft size={16} /> Back to Login
              </button>
            </form>
          ) : (
            /* Verify OTP & Reset Form */
            <form onSubmit={handleResetPassword} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{
                backgroundColor: '#eff6ff',
                border: '1px solid #bfdbfe',
                borderRadius: '12px',
                padding: '16px',
                color: '#1e40af',
                fontSize: '14px',
                lineHeight: '1.5'
              }}>
                A 6-digit verification code has been dispatched to <strong>{email}</strong>.
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '14px', fontWeight: '600', color: '#334155' }}>Enter 6-Digit OTP</label>
                <div style={{ position: 'relative' }}>
                  <Key size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                  <input
                    type="text"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    placeholder="123456"
                    required
                    style={{ paddingLeft: '44px', letterSpacing: '2px', fontWeight: 'bold' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '14px', fontWeight: '600', color: '#334155' }}>New Password</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    required
                    style={{ paddingLeft: '44px' }}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary"
                style={{
                  width: '100%',
                  padding: '12px',
                  opacity: loading ? 0.7 : 1,
                  cursor: loading ? 'not-allowed' : 'pointer'
                }}
              >
                {loading ? 'Resetting...' : 'Verify & Reset Password'}
              </button>

              <button
                type="button"
                onClick={() => setOtpSent(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#64748b',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <ArrowLeft size={16} /> Change Email
              </button>
            </form>
          )}

        </div>
      </div>

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

export default ForgotPassword;
