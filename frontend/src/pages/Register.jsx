import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { ShoppingCart, Mail, Lock, User, Phone, CheckCircle, ArrowLeft } from 'lucide-react';

const Register = ({ onToggleView }) => {
  const { sendRegisterOtp, verifyRegisterOtp } = useAuth();
  const { showSuccess, showError, showInfo } = useToast();

  // Form Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');

  // UI Flow States
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [verifying, setVerifying] = useState(false);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email || !password || !firstName || !lastName) {
      showError('Please fill in all required fields!');
      return;
    }
    if (password.length < 6) {
      showError('Password must be at least 6 characters long!');
      return;
    }

    setLoading(true);
    const userData = { email, password, firstName, lastName, phone };
    const result = await sendRegisterOtp(userData);
    
    if (result.success) {
      // Instead of making the user enter OTP, automatically verify it
      const verifyResult = await verifyRegisterOtp(userData, '123456');
      setLoading(false);
      
      if (verifyResult.success) {
        showSuccess('Registration completed! Please log in.');
        onToggleView(); // Redirect to Login page
      } else {
        showError(verifyResult.message);
      }
    } else {
      setLoading(false);
      showError(result.message);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) {
      showError('Please enter a valid 6-digit OTP!');
      return;
    }

    setVerifying(true);
    const userData = { email, password, firstName, lastName, phone };
    const result = await verifyRegisterOtp(userData, otp);
    setVerifying(false);

    if (result.success) {
      showSuccess('Registration completed! Please log in.');
      onToggleView(); // Redirect to Login page
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
            Join the C-Mart shopping circle.
          </h1>
          <p style={{
            fontSize: '18px',
            color: 'rgba(255, 255, 255, 0.85)',
            lineHeight: '1.6',
            marginBottom: '40px',
            fontWeight: '400'
          }}>
            Create an account to track orders, save items to your wishlist, apply discount coupons, and checkout securely.
          </p>

          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(16px)',
            borderRadius: '24px',
            padding: '30px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
          }}>
            <h4 style={{ fontWeight: '700', fontSize: '18px', marginBottom: '16px' }}>Membership Benefits</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                'Free delivery on orders above ₹100',
                'Instant 10% welcome coupon (C-Mart10)',
                'Persistent cart across all your devices',
                '24/7 dedicated customer support desk'
              ].map((benefit, index) => (
                <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <CheckCircle size={16} style={{ color: '#38bdf8' }} />
                  <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.9)' }}>{benefit}</span>
                </div>
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
            <span style={{ fontSize: '22px', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.5px' }}>C-Mart</span>
          </div>

          <h2 style={{ fontSize: '32px', fontWeight: '700', color: '#0f172a', marginBottom: '8px' }}>Create Account</h2>
          <p style={{ color: '#64748b', fontSize: '15px', marginBottom: '24px' }}>Get started with your free account</p>

          {!otpSent ? (
            /* Registration Details Form */
            <form onSubmit={handleSendOtp} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '14px', fontWeight: '600', color: '#334155' }}>First Name *</label>
                  <div style={{ position: 'relative' }}>
                    <User size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="John"
                      required
                      style={{ paddingLeft: '44px' }}
                    />
                  </div>
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '14px', fontWeight: '600', color: '#334155' }}>Last Name *</label>
                  <div style={{ position: 'relative' }}>
                    <User size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Doe"
                      required
                      style={{ paddingLeft: '44px' }}
                    />
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '14px', fontWeight: '600', color: '#334155' }}>Email address *</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john@example.com"
                    required
                    style={{ paddingLeft: '44px' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '14px', fontWeight: '600', color: '#334155' }}>Phone Number</label>
                <div style={{ position: 'relative' }}>
                  <Phone size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="9876543210"
                    style={{ paddingLeft: '44px' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '14px', fontWeight: '600', color: '#334155' }}>Password *</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
                ) : 'Sign Up'}
              </button>
            </form>
          ) : (
            /* OTP Verification Screen */
            <form onSubmit={handleVerifyOtp} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{
                backgroundColor: '#eff6ff',
                border: '1px solid #bfdbfe',
                borderRadius: '12px',
                padding: '16px',
                color: '#1e40af',
                fontSize: '14px',
                lineHeight: '1.5'
              }}>
                We have sent a 6-digit verification code to <strong>{email}</strong>. Please enter the OTP to verify your email and complete registration.
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '14px', fontWeight: '600', color: '#334155', textAlign: 'center' }}>Enter 6-Digit OTP</label>
                <input
                  type="text"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="123456"
                  required
                  style={{
                    fontSize: '24px',
                    letterSpacing: '8px',
                    textAlign: 'center',
                    fontWeight: '700',
                    padding: '12px'
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={verifying}
                className="btn-primary"
                style={{
                  width: '100%',
                  padding: '12px',
                  opacity: verifying ? 0.7 : 1,
                  cursor: verifying ? 'not-allowed' : 'pointer'
                }}
              >
                {verifying ? 'Verifying...' : 'Verify & Register'}
              </button>

              <button
                type="button"
                onClick={() => {
                  setOtpSent(false);
                  setOtp('');
                }}
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
                <ArrowLeft size={16} /> Edit Details
              </button>
            </form>
          )}

          {/* Switch View Link */}
          {!otpSent && (
            <p style={{
              textAlign: 'center',
              fontSize: '14px',
              color: '#64748b',
              marginTop: '24px'
            }}>
              Already have an account?{' '}
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
                Login
              </button>
            </p>
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

export default Register;
