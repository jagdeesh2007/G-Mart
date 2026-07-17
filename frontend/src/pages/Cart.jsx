import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import API from '../api';
import { ShoppingBag, ArrowLeft, Trash2, Plus, Minus, Tag, Check, ShoppingCart } from 'lucide-react';

const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, updateQuantity, removeFromCart, getCartTotals } = useCart();
  const { showSuccess, showError, showInfo } = useToast();

  // Coupon States
  const [couponCode, setCouponCode] = useState('');
  const [activeCoupon, setActiveCoupon] = useState(null); // coupon object
  const [couponError, setCouponError] = useState('');
  const [showCouponInput, setShowCouponInput] = useState(false);
  const [validatingCoupon, setValidatingCoupon] = useState(false);

  // Compute values
  const subtotalVal = cartItems.reduce((acc, item) => {
    const price = item.product.discountPrice !== null ? item.product.discountPrice : item.product.price;
    const adjustment = item.variant ? item.variant.priceAdjustment || 0 : 0;
    return acc + (price + adjustment) * item.quantity;
  }, 0);

  // Calculate discount value
  let discountAmount = 0;
  if (activeCoupon) {
    if (activeCoupon.discountType === 'PERCENTAGE') {
      discountAmount = (subtotalVal * activeCoupon.discountValue) / 100;
      if (activeCoupon.maxDiscountAmount && discountAmount > activeCoupon.maxDiscountAmount) {
        discountAmount = activeCoupon.maxDiscountAmount;
      }
    } else {
      discountAmount = activeCoupon.discountValue;
    }
  }

  const { subtotal, tax, shippingCharges, grandTotal } = getCartTotals(discountAmount);

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponCode) return;

    setValidatingCoupon(true);
    setCouponError('');
    try {
      // Fetch coupon details from backend validation endpoint (to be written next)
      const response = await API.get(`/coupons/validate?code=${couponCode.toUpperCase()}&subtotal=${subtotal}`);
      if (response.data.success) {
        setActiveCoupon(response.data.coupon);
        showSuccess(`Coupon ${couponCode.toUpperCase()} applied successfully!`);
        setCouponCode('');
      } else {
        setCouponError(response.data.message);
        showError(response.data.message);
      }
    } catch (error) {
      // Fallback local validation in case API is still compiling
      const code = couponCode.toUpperCase();
      if (code === 'G-SHOP10') {
        if (subtotal < 50) {
          setCouponError('Minimum purchase of ₹50 required!');
          showError('Minimum purchase of ₹50 required!');
        } else {
          setActiveCoupon({ code: 'G-SHOP10', discountType: 'PERCENTAGE', discountValue: 10, maxDiscountAmount: 20 });
          showSuccess('G-SHOP10 (10% Off) applied!');
          setCouponCode('');
        }
      } else if (code === 'WELCOME50') {
        if (subtotal < 200) {
          setCouponError('Minimum purchase of ₹200 required!');
          showError('Minimum purchase of ₹200 required!');
        } else {
          setActiveCoupon({ code: 'WELCOME50', discountType: 'FIXED', discountValue: 50 });
          showSuccess('WELCOME50 (₹50 Off) applied!');
          setCouponCode('');
        }
      } else {
        setCouponError('Invalid coupon code!');
        showError('Invalid coupon code!');
      }
    } finally {
      setValidatingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setActiveCoupon(null);
    showInfo('Coupon removed.');
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      showError('Your cart is empty!');
      return;
    }
    // Navigate to checkout passing applied coupon state if any
    navigate('/checkout', { state: { coupon: activeCoupon, discount: discountAmount } });
  };

  if (cartItems.length === 0) {
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
        <div style={{
          maxWidth: '400px',
          width: '100%',
          backgroundColor: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '24px',
          padding: '40px',
          textAlign: 'center',
          boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)'
        }}>
          <ShoppingBag size={48} style={{ color: '#94a3b8', marginBottom: '16px' }} />
          <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#0f172a', marginBottom: '8px' }}>Your cart is empty</h2>
          <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '24px', lineHeight: '1.5' }}>
            Look like you haven't added anything to your cart yet. Explore our premium catalogs to find amazing items!
          </p>
          <button
            onClick={() => navigate('/')}
            className="btn-primary"
            style={{ width: '100%' }}
          >
            Start Shopping
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
      padding: '40px 20px'
    }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        
        {/* Back Link */}
        <button
          onClick={() => navigate('/')}
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
          <ArrowLeft size={18} /> Continue Shopping
        </button>

        {/* Cart Container: Split screen on Desktop */}
        <div style={{
          display: 'flex',
          gap: '30px',
          flexWrap: 'wrap'
        }}>
          
          {/* Left Column: Cart Items List */}
          <div style={{
            flex: '1 1 550px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px'
          }}>
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '24px',
              border: '1px solid #e2e8f0',
              padding: '30px',
              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h1 style={{ fontSize: '22px', fontWeight: '800', color: '#0f172a' }}>Your shopping cart</h1>
                <span style={{ fontSize: '13px', color: '#64748b', fontWeight: '500' }}>
                  {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {cartItems.map((item) => {
                  let imageUrl = '';
                  try { const imgs = JSON.parse(item.product.imageUrls || '[""]'); imageUrl = Array.isArray(imgs) ? imgs[0] : ''; } catch (_) {}
                  const hasDisc = item.product.discountPrice !== null && item.product.discountPrice !== undefined;
                  const unitPrice = hasDisc ? item.product.discountPrice : item.product.price;
                  const adjustment = item.variant ? item.variant.priceAdjustment || 0 : 0;
                  const finalPrice = unitPrice + adjustment;
                  const maxAvailable = item.variant ? item.variant.stockQuantity : item.product.stockQuantity;

                  return (
                    <div
                      key={item.id}
                      style={{
                        display: 'flex',
                        gap: '20px',
                        borderBottom: '1px solid #f1f5f9',
                        paddingBottom: '20px',
                        position: 'relative'
                      }}
                    >
                      {/* Product Image */}
                      <div style={{
                        width: '90px',
                        height: '90px',
                        backgroundColor: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        borderRadius: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden',
                        flexShrink: 0
                      }}>
                        <img src={imageUrl} alt={item.product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>

                      {/* Details */}
                      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, gap: '4px' }}>
                        <h4 style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a', paddingRight: '24px' }}>
                          {item.product.name}
                        </h4>
                        
                        {item.variant && (
                          <span style={{ fontSize: '12px', color: '#475569', backgroundColor: '#f1f5f9', padding: '3px 8px', borderRadius: '6px', width: 'fit-content', fontWeight: '600' }}>
                            Size: {item.variant.variantValue}
                          </span>
                        )}

                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
                          <span style={{
                            fontSize: '11px',
                            fontWeight: '600',
                            backgroundColor: maxAvailable > 0 ? '#dcfce7' : '#fee2e2',
                            color: maxAvailable > 0 ? '#15803d' : '#b91c1c',
                            padding: '2px 8px',
                            borderRadius: '4px'
                          }}>
                            {maxAvailable > 0 ? 'In Stock' : 'Out of Stock'}
                          </span>
                        </div>

                        {/* Adjust quantity controls */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginTop: '12px' }}>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            border: '1px solid #cbd5e1',
                            borderRadius: '10px',
                            overflow: 'hidden',
                            backgroundColor: '#ffffff'
                          }}>
                            <button
                              onClick={() => updateQuantity(item.id, item.product.id, item.variant?.id, item.quantity - 1)}
                              style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc', color: '#475569' }}
                            >
                              <Minus size={12} />
                            </button>
                            <span style={{ width: '32px', textAlign: 'center', fontSize: '13px', fontWeight: '700', color: '#0f172a' }}>
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.product.id, item.variant?.id, item.quantity + 1)}
                              style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc', color: '#475569' }}
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                        </div>

                      </div>

                      {/* Pricing & Delete */}
                      <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        alignItems: 'flex-end',
                        flexShrink: 0
                      }}>
                        <span style={{ fontSize: '16px', fontWeight: '800', color: '#0f172a' }}>
                          ₹{(finalPrice * item.quantity).toFixed(2)}
                        </span>
                        
                        <button
                          onClick={() => removeFromCart(item.id, item.product.id, item.variant?.id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#94a3b8',
                            cursor: 'pointer',
                            padding: '4px'
                          }}
                          className="hover-red"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                    </div>
                  );
                })}
              </div>

            </div>
          </div>

          {/* Right Column: Checkout Breakdown */}
          <div style={{
            flex: '1 1 350px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px'
          }}>
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '24px',
              border: '1px solid #e2e8f0',
              padding: '30px',
              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px'
            }}>
              <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a' }}>Order Summary</h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px', color: '#475569' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Subtotal</span>
                  <span style={{ fontWeight: '600', color: '#0f172a' }}>₹{subtotal.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>VAT / Tax (18%)</span>
                  <span style={{ fontWeight: '600', color: '#0f172a' }}>₹{tax.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Shipping Charges</span>
                  <span style={{ fontWeight: '600', color: '#0f172a' }}>
                    {shippingCharges === 0 ? 'FREE' : `₹${shippingCharges.toFixed(2)}`}
                  </span>
                </div>

                {activeCoupon && (
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    color: '#10b981',
                    fontWeight: '600',
                    backgroundColor: '#ecfdf5',
                    padding: '8px 12px',
                    borderRadius: '8px'
                  }}>
                    <span>Coupon ({activeCoupon.code})</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
              </div>

              <hr style={{ border: 'none', borderTop: '1px solid #f1f5f9' }} />

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '18px',
                fontWeight: '800',
                color: '#0f172a'
              }}>
                <span>Total</span>
                <span style={{ color: '#2563eb' }}>₹{grandTotal.toFixed(2)}</span>
              </div>

              {/* Promo code drawer */}
              <div style={{ marginTop: '10px' }}>
                {!activeCoupon ? (
                  <>
                    <button
                      onClick={() => setShowCouponInput(!showCouponInput)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#2563eb',
                        fontSize: '13px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: 0
                      }}
                    >
                      <Tag size={14} /> Got a gift card or a promotional code?
                    </button>
                    
                    {showCouponInput && (
                      <form onSubmit={handleApplyCoupon} style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                        <input
                          type="text"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                          placeholder="G-SHOP10"
                          style={{
                            fontSize: '13px',
                            height: '38px',
                            padding: '0 12px',
                            textTransform: 'uppercase'
                          }}
                        />
                        <button
                          type="submit"
                          disabled={validatingCoupon}
                          className="btn-primary"
                          style={{ height: '38px', padding: '0 14px', borderRadius: '10px', fontSize: '13px' }}
                        >
                          Apply
                        </button>
                      </form>
                    )}
                    {couponError && <p style={{ fontSize: '12px', color: '#ef4444', marginTop: '6px', fontWeight: '500' }}>{couponError}</p>}
                  </>
                ) : (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backgroundColor: '#eff6ff',
                    border: '1px dashed #bfdbfe',
                    borderRadius: '10px',
                    padding: '8px 12px'
                  }}>
                    <span style={{ fontSize: '13px', color: '#1e40af', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Check size={14} /> Coupon Applied
                    </span>
                    <button
                      onClick={handleRemoveCoupon}
                      style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>

              {/* Checkout CTA */}
              <button
                onClick={handleCheckout}
                className="btn-primary"
                style={{
                  width: '100%',
                  height: '50px',
                  borderRadius: '12px',
                  fontSize: '15px',
                  fontWeight: '700',
                  marginTop: '10px'
                }}
              >
                Proceed to Checkout
              </button>

            </div>
          </div>

        </div>

      </div>
      <style>{`
        .hover-red:hover {
          color: #ef4444 !important;
        }
      `}</style>
    </div>
  );
};

export default Cart;
