import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import API from '../api';
import { MapPin, CreditCard, Wallet, Smartphone, ArrowLeft, Plus, CheckCircle, ShieldCheck, Truck } from 'lucide-react';

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartItems, getCartTotals, fetchCartAndWishlist, clearCart } = useCart();
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();

  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [isAddingNewAddress, setIsAddingNewAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({
    recipientName: user?.firstName ? `${user.firstName} ${user.lastName}` : '',
    phone: user?.phone || '',
    streetAddress: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India',
    addressType: 'HOME',
    isDefault: false
  });

  const [paymentMethod, setPaymentMethod] = useState('UPI'); // UPI, CARD, WALLET, COD
  const [processing, setProcessing] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [finalOrderNumber, setFinalOrderNumber] = useState('');

  // Extract coupon passed from Cart page (if any)
  const appliedCoupon = location.state?.coupon || null;
  const passedDiscount = location.state?.discount || 0;
  
  const { subtotal, tax, shippingCharges, grandTotal } = getCartTotals(passedDiscount);

  const [fetchingLocation, setFetchingLocation] = useState(false);

  useEffect(() => {
    if (cartItems.length === 0 && !orderPlaced) {
      navigate('/cart');
    }
    fetchAddresses();
  }, [cartItems.length, navigate, orderPlaced]);

  const fetchAddresses = async () => {
    // Mock addresses for now since AddressController is missing
    setAddresses([]);
    setIsAddingNewAddress(true);
    
    // Automatically trigger live location fetch
    setTimeout(() => {
      handleUseLiveLocation();
    }, 1000);
  };

  const handleUseLiveLocation = () => {
    if (!navigator.geolocation) {
      showError('Geolocation is not supported by your browser');
      return;
    }

    setFetchingLocation(true);
    showInfo('Detecting location...');
    
    // Fallback timeout in case the browser silently hangs on the prompt
    const fallbackTimeout = setTimeout(() => {
      setFetchingLocation(false);
      showError('Location detection timed out. Please fill manually or check permissions.');
    }, 8000);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        clearTimeout(fallbackTimeout);
        try {
          const { latitude, longitude } = position.coords;
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const data = await response.json();
          
          if (data && data.address) {
            setNewAddress(prev => ({
              ...prev,
              streetAddress: data.display_name.split(',').slice(0, 3).join(', ') || '',
              city: data.address.city || data.address.town || data.address.village || data.address.county || '',
              state: data.address.state || '',
              zipCode: data.address.postcode || ''
            }));
            showSuccess('Location detected successfully!');
          }
        } catch (error) {
          showError('Failed to fetch address from location.');
        } finally {
          setFetchingLocation(false);
        }
      },
      (error) => {
        clearTimeout(fallbackTimeout);
        showError('Unable to retrieve your location. Please check browser permissions.');
        setFetchingLocation(false);
      },
      { timeout: 7000, maximumAge: 0 }
    );
  };

  const handlePlaceOrderClick = () => {
    if (!selectedAddressId && !isAddingNewAddress) {
      showError('Please select a shipping address!');
      return;
    }
    if (isAddingNewAddress) {
      if (!newAddress.recipientName || !newAddress.phone || !newAddress.streetAddress || !newAddress.city || !newAddress.state || !newAddress.zipCode) {
        showError('Please fill out all required address fields!');
        return;
      }
    }
    setShowPaymentModal(true);
  };

  const executeOrderAPI = async (transactionId) => {
    setProcessing(true);
    try {
      // Mock order placement since OrderController is missing
      const mockOrderNumber = `ORD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      setFinalOrderNumber(mockOrderNumber);
      setOrderPlaced(true);
      setShowPaymentModal(false);
      clearCart(); // refresh/clear local cart
    } catch (error) {
      showError('Failed to process your order.');
    } finally {
      setProcessing(false);
    }
  };

  const simulatePaymentSuccess = () => {
    setProcessing(true);
    // Simulate 2 seconds of payment gateway processing
    setTimeout(() => {
      const txnId = `TXN-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      executeOrderAPI(txnId);
    }, 2000);
  };

  if (orderPlaced) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#f8fafc',
        fontFamily: 'Outfit, sans-serif',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}>
        <div className="animate-fade-in" style={{
          maxWidth: '500px',
          width: '100%',
          backgroundColor: '#ffffff',
          borderRadius: '24px',
          padding: '50px 40px',
          textAlign: 'center',
          boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            backgroundColor: '#dcfce7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px'
          }}>
            <CheckCircle size={40} style={{ color: '#16a34a' }} />
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#0f172a', marginBottom: '12px' }}>Order Confirmed!</h1>
          <p style={{ color: '#64748b', fontSize: '15px', marginBottom: '24px', lineHeight: '1.5' }}>
            Thank you for shopping with G-Shop. Your order has been successfully placed and is being processed.
          </p>
          <div style={{ backgroundColor: '#f8fafc', padding: '16px', borderRadius: '12px', marginBottom: '30px' }}>
            <span style={{ fontSize: '13px', color: '#64748b', fontWeight: '600' }}>ORDER ID</span>
            <div style={{ fontSize: '18px', fontWeight: '800', color: '#2563eb', letterSpacing: '1px' }}>{finalOrderNumber}</div>
          </div>
          <button
            onClick={() => navigate('/dashboard')}
            className="btn-primary"
            style={{ width: '100%', marginBottom: '12px' }}
          >
            Track My Order
          </button>
          <button
            onClick={() => navigate('/')}
            className="btn-secondary"
            style={{ width: '100%' }}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
      fontFamily: 'Outfit, sans-serif',
      padding: '40px 20px',
      position: 'relative'
    }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        
        <button
          onClick={() => navigate('/cart')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'none',
            border: 'none',
            color: '#64748b',
            fontSize: '15px',
            fontWeight: '600',
            cursor: 'pointer',
            marginBottom: '30px'
          }}
        >
          <ArrowLeft size={18} /> Return to Cart
        </button>

        <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#0f172a', marginBottom: '30px' }}>Secure Checkout</h1>

        <div style={{
          display: 'flex',
          gap: '30px',
          flexWrap: 'wrap'
        }}>
          
          {/* Left Column (Address & Payment) */}
          <div style={{ flex: '1 1 600px', display: 'flex', flexDirection: 'column', gap: '30px' }}>
            
            {/* Address Selection */}
            <div style={{ backgroundColor: '#ffffff', borderRadius: '24px', border: '1px solid #e2e8f0', padding: '30px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <MapPin size={16} style={{ color: '#2563eb' }} />
                  </div>
                  <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a', margin: 0 }}>Shipping Address</h3>
                </div>
                {isAddingNewAddress && (
                  <button
                    onClick={handleUseLiveLocation}
                    disabled={fetchingLocation}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      backgroundColor: '#eff6ff',
                      color: '#2563eb',
                      border: 'none',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: '600',
                      cursor: fetchingLocation ? 'not-allowed' : 'pointer',
                      opacity: fetchingLocation ? 0.7 : 1,
                      transition: 'all 0.2s'
                    }}
                  >
                    <MapPin size={14} /> {fetchingLocation ? 'Detecting...' : 'Use Live Location'}
                  </button>
                )}
              </div>

              {addresses.length > 0 && !isAddingNewAddress && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
                  {addresses.map((addr) => (
                    <div
                      key={addr.id}
                      onClick={() => setSelectedAddressId(addr.id)}
                      style={{
                        border: selectedAddressId === addr.id ? '2px solid #2563eb' : '1px solid #e2e8f0',
                        backgroundColor: selectedAddressId === addr.id ? '#eff6ff' : '#ffffff',
                        borderRadius: '16px',
                        padding: '16px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '12px',
                        transition: 'all 0.2s'
                      }}
                    >
                      <div style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        border: selectedAddressId === addr.id ? '6px solid #2563eb' : '2px solid #cbd5e1',
                        marginTop: '2px'
                      }} />
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <h4 style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a', margin: 0 }}>{addr.recipientName}</h4>
                          <span style={{ fontSize: '11px', backgroundColor: '#e2e8f0', color: '#475569', padding: '2px 6px', borderRadius: '4px', fontWeight: '600' }}>
                            {addr.addressType}
                          </span>
                        </div>
                        <p style={{ fontSize: '14px', color: '#64748b', marginTop: '4px', lineHeight: '1.5' }}>
                          {addr.streetAddress}, {addr.city}, {addr.state} {addr.zipCode}
                        </p>
                        <p style={{ fontSize: '13px', color: '#94a3b8', marginTop: '4px' }}>Phone: {addr.phone}</p>
                      </div>
                    </div>
                  ))}
                  
                  <button
                    onClick={() => setIsAddingNewAddress(true)}
                    style={{
                      background: 'none',
                      border: '1px dashed #cbd5e1',
                      borderRadius: '16px',
                      padding: '16px',
                      color: '#475569',
                      fontWeight: '600',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      marginTop: '8px'
                    }}
                  >
                    <Plus size={16} /> Add a new address
                  </button>
                </div>
              )}

              {isAddingNewAddress && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '13px', fontWeight: '600', color: '#475569' }}>Recipient Name *</label>
                      <input
                        type="text"
                        value={newAddress.recipientName}
                        onChange={(e) => setNewAddress({...newAddress, recipientName: e.target.value})}
                        style={{ padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '14px' }}
                      />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '13px', fontWeight: '600', color: '#475569' }}>Phone Number *</label>
                      <input
                        type="text"
                        value={newAddress.phone}
                        onChange={(e) => setNewAddress({...newAddress, phone: e.target.value})}
                        style={{ padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '14px' }}
                      />
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '13px', fontWeight: '600', color: '#475569' }}>Street Address *</label>
                    <input
                      type="text"
                      value={newAddress.streetAddress}
                      onChange={(e) => setNewAddress({...newAddress, streetAddress: e.target.value})}
                      style={{ padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '14px' }}
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '13px', fontWeight: '600', color: '#475569' }}>City *</label>
                      <input
                        type="text"
                        value={newAddress.city}
                        onChange={(e) => setNewAddress({...newAddress, city: e.target.value})}
                        style={{ padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '14px' }}
                      />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '13px', fontWeight: '600', color: '#475569' }}>State *</label>
                      <input
                        type="text"
                        value={newAddress.state}
                        onChange={(e) => setNewAddress({...newAddress, state: e.target.value})}
                        style={{ padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '14px' }}
                      />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '13px', fontWeight: '600', color: '#475569' }}>Zip Code *</label>
                      <input
                        type="text"
                        value={newAddress.zipCode}
                        onChange={(e) => setNewAddress({...newAddress, zipCode: e.target.value})}
                        style={{ padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '14px' }}
                      />
                    </div>
                  </div>
                  {addresses.length > 0 && (
                    <button
                      onClick={() => setIsAddingNewAddress(false)}
                      style={{ background: 'none', border: 'none', color: '#2563eb', fontSize: '14px', fontWeight: '600', textAlign: 'left', cursor: 'pointer', marginTop: '10px' }}
                    >
                      Cancel, use an existing address
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Payment Method Selection */}
            <div style={{ backgroundColor: '#ffffff', borderRadius: '24px', border: '1px solid #e2e8f0', padding: '30px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CreditCard size={16} style={{ color: '#2563eb' }} />
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a' }}>Payment Method</h3>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '16px' }}>
                {[
                  { id: 'UPI', label: 'UPI / QR', icon: <Smartphone size={20} /> },
                  { id: 'CARD', label: 'Credit Card', icon: <CreditCard size={20} /> },
                  { id: 'WALLET', label: 'Mobile Wallet', icon: <Wallet size={20} /> },
                ].map(pm => (
                  <div
                    key={pm.id}
                    onClick={() => setPaymentMethod(pm.id)}
                    style={{
                      border: paymentMethod === pm.id ? '2px solid #2563eb' : '1px solid #e2e8f0',
                      backgroundColor: paymentMethod === pm.id ? '#eff6ff' : '#ffffff',
                      borderRadius: '16px',
                      padding: '16px',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '12px',
                      transition: 'all 0.2s',
                      color: paymentMethod === pm.id ? '#2563eb' : '#64748b'
                    }}
                  >
                    {pm.icon}
                    <span style={{ fontSize: '14px', fontWeight: '600', color: paymentMethod === pm.id ? '#1e40af' : '#475569' }}>{pm.label}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column (Order Summary) */}
          <div style={{ flex: '1 1 350px' }}>
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '24px',
              border: '1px solid #e2e8f0',
              padding: '30px',
              position: 'sticky',
              top: '40px'
            }}>
              <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', marginBottom: '20px' }}>Order Summary</h3>

              {/* Items preview */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '20px', maxHeight: '300px', overflowY: 'auto' }}>
                {cartItems.map(item => (
                  <div key={item.id} style={{ display: 'flex', gap: '12px' }}>
                    <div style={{ width: '50px', height: '50px', borderRadius: '8px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                      <img src={(() => { try { const imgs = JSON.parse(item.product.imageUrls || '[""]'); return Array.isArray(imgs) ? imgs[0] : ''; } catch(_) { return ''; } })()} alt={item.product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                      <span style={{ fontSize: '13px', fontWeight: '600', color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '180px' }}>
                        {item.product.name}
                      </span>
                      <span style={{ fontSize: '12px', color: '#64748b' }}>Qty: {item.quantity} {item.variant ? `| ${item.variant.variantValue}` : ''}</span>
                    </div>
                    <div style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a' }}>
                      ₹{((item.product.discountPrice || item.product.price) * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              <hr style={{ border: 'none', borderTop: '1px solid #f1f5f9', margin: '20px 0' }} />

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px', color: '#475569' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Subtotal</span>
                  <span style={{ fontWeight: '600', color: '#0f172a' }}>₹{subtotal.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Tax (18%)</span>
                  <span style={{ fontWeight: '600', color: '#0f172a' }}>₹{tax.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Shipping</span>
                  <span style={{ fontWeight: '600', color: '#0f172a' }}>
                    {shippingCharges === 0 ? 'FREE' : `₹${shippingCharges.toFixed(2)}`}
                  </span>
                </div>
                {appliedCoupon && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#10b981', fontWeight: '600' }}>
                    <span>Discount ({appliedCoupon.code})</span>
                    <span>-${passedDiscount.toFixed(2)}</span>
                  </div>
                )}
              </div>

              <hr style={{ border: 'none', borderTop: '1px solid #f1f5f9', margin: '20px 0' }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '20px', fontWeight: '800', color: '#0f172a', marginBottom: '24px' }}>
                <span>Total</span>
                <span style={{ color: '#2563eb' }}>₹{grandTotal.toFixed(2)}</span>
              </div>

              <button
                onClick={handlePlaceOrderClick}
                className="btn-primary"
                style={{ width: '100%', height: '54px', fontSize: '16px', borderRadius: '14px' }}
              >
                Place Order & Pay
              </button>
              
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '16px', color: '#64748b', fontSize: '12px' }}>
                <ShieldCheck size={16} style={{ color: '#10b981' }} /> Secure 256-bit SSL encryption
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Gateway Simulation Modal */}
      {showPaymentModal && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(4px)',
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div className="animate-fade-in" style={{
            backgroundColor: '#ffffff',
            borderRadius: '24px',
            width: '100%',
            maxWidth: '450px',
            padding: '30px',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
            position: 'relative'
          }}>
            
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#eff6ff', marginBottom: '16px' }}>
                <ShieldCheck size={24} style={{ color: '#2563eb' }} />
              </div>
              <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#0f172a' }}>
                {paymentMethod === 'UPI' ? 'Scan & Pay via UPI' : paymentMethod === 'CARD' ? 'Credit / Debit Card' : 'Mobile Wallet'}
              </h2>
              <p style={{ fontSize: '14px', color: '#64748b', marginTop: '4px' }}>
                Complete your secure transaction of <strong style={{ color: '#0f172a' }}>₹{grandTotal.toFixed(2)}</strong>
              </p>
            </div>

            {paymentMethod === 'UPI' && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
                {/* Simulated QR Code via CSS gradient block to avoid needing external images */}
                <div style={{
                  width: '200px', height: '200px',
                  backgroundColor: '#ffffff',
                  border: '2px solid #e2e8f0',
                  borderRadius: '16px',
                  padding: '10px',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(10, 1fr)',
                  gridTemplateRows: 'repeat(10, 1fr)',
                  gap: '2px'
                }}>
                  {[...Array(100)].map((_, i) => (
                    <div key={i} style={{ backgroundColor: Math.random() > 0.5 ? '#000000' : 'transparent', borderRadius: '2px' }} />
                  ))}
                </div>
                <div style={{ fontSize: '14px', color: '#475569', fontWeight: '600' }}>UPI ID: 9177411203@ptyes</div>
              </div>
            )}

            {paymentMethod === 'CARD' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '13px', fontWeight: '600', color: '#475569' }}>Card Number</label>
                  <input type="text" placeholder="XXXX XXXX XXXX XXXX" style={{ padding: '12px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '14px', letterSpacing: '2px' }} />
                </div>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
                    <label style={{ fontSize: '13px', fontWeight: '600', color: '#475569' }}>Expiry</label>
                    <input type="text" placeholder="MM/YY" style={{ padding: '12px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '14px' }} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
                    <label style={{ fontSize: '13px', fontWeight: '600', color: '#475569' }}>CVV</label>
                    <input type="password" placeholder="•••" style={{ padding: '12px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '14px', letterSpacing: '2px' }} />
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'WALLET' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
                <p style={{ fontSize: '14px', color: '#475569', textAlign: 'center' }}>You will be redirected to your wallet provider to authorize the payment.</p>
                <input type="text" placeholder="Enter linked mobile number" style={{ padding: '12px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '14px', width: '100%', textAlign: 'center' }} />
              </div>
            )}

            <div style={{ display: 'flex', gap: '12px', marginTop: '30px' }}>
              <button
                onClick={() => setShowPaymentModal(false)}
                disabled={processing}
                className="btn-secondary"
                style={{ flex: 1, height: '48px' }}
              >
                Cancel
              </button>
              <button
                onClick={simulatePaymentSuccess}
                disabled={processing}
                className="btn-primary"
                style={{ flex: 2, height: '48px', position: 'relative' }}
              >
                {processing ? (
                  <div style={{ width: '20px', height: '20px', border: '2px solid #ffffff', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto' }} />
                ) : (
                  `Pay ₹${grandTotal.toFixed(2)}`
                )}
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;
