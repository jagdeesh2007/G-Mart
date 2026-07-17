import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import API from '../api';
import { ArrowLeft, ShoppingCart, Heart, Star, Calendar, ShieldCheck, RefreshCw } from 'lucide-react';

const ProductDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { showSuccess, showError, showInfo } = useToast();

  const [product, setProduct] = useState(null);
  const [variants, setVariants] = useState([]);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const [savedWishlist, setSavedWishlist] = useState(false);

  // Delivery estimation calculations
  const [deliveryMinDate, setDeliveryMinDate] = useState('');
  const [deliveryMaxDate, setDeliveryMaxDate] = useState('');

  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true);
      try {
        const prodRes = await API.get(`/products/${slug}`);
        setProduct(prodRes.data);
        setVariants([]); // No variants exist in the new backend schema
      } catch (error) {
        showError('Product details could not be loaded!');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    fetchProductDetails();
  }, [slug]);

  // Estimate delivery range
  useEffect(() => {
    const today = new Date();
    const minD = new Date(today);
    minD.setDate(today.getDate() + 3);
    const maxD = new Date(today);
    maxD.setDate(today.getDate() + 7);

    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    setDeliveryMinDate(minD.toLocaleDateString('en-US', options));
    setDeliveryMaxDate(maxD.toLocaleDateString('en-US', options));
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid #e2e8f0',
            borderTopColor: '#2563eb',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
          <span style={{ fontSize: '15px', color: '#64748b', fontWeight: '500' }}>Loading product details...</span>
        </div>
      </div>
    );
  }

  if (!product) return null;

  let imageUrls = [''];
  try { imageUrls = JSON.parse(product.imageUrls || '[""]'); if (!Array.isArray(imageUrls)) imageUrls = ['']; } catch (_) {}
  let specObj = {};
  try { specObj = JSON.parse(product.specifications || '{}'); } catch (_) {}
  const hasDiscount = product.discountPrice !== null && product.discountPrice !== undefined;

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      showInfo('Please log in to add items to your cart.');
      navigate('/login');
      return;
    }
    
    // Validate variant selection if product has size configurations
    if (variants.length > 0 && !selectedSize) {
      showError('Please select a size!');
      return;
    }

    setAddingToCart(true);
    
    // We simulate API call for adding to cart, which will connect to database in Module 4
    setTimeout(() => {
      setAddingToCart(false);
      showSuccess(`Added ${product.name} (${selectedSize || 'Standard'}) to cart successfully!`);
    }, 600);
  };

  const handleToggleWishlist = () => {
    if (!isAuthenticated) {
      showInfo('Please log in to save items to wishlist.');
      navigate('/login');
      return;
    }
    setSavedWishlist(!savedWishlist);
    showSuccess(savedWishlist ? 'Removed from wishlist.' : 'Saved to wishlist!');
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
      fontFamily: 'Outfit, sans-serif',
      padding: '40px 20px'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
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
          <ArrowLeft size={18} /> Back to Catalog
        </button>

        {/* Product Container */}
        <div style={{
          display: 'flex',
          gap: '50px',
          flexWrap: 'wrap'
        }}>
          
          {/* Left Side: Product Gallery */}
          <div style={{
            flex: '1 1 500px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px'
          }}>
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '24px',
              border: '1px solid #e2e8f0',
              padding: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '500px',
              position: 'relative'
            }}>
              <img
                src={imageUrls[0]}
                alt={product.name}
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain',
                  borderRadius: '12px'
                }}
              />
            </div>

            {/* Sub-images indicator */}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              {imageUrls.map((img, i) => (
                <div
                  key={i}
                  style={{
                    width: '70px',
                    height: '70px',
                    borderRadius: '12px',
                    border: i === 0 ? '2px solid #2563eb' : '1px solid #e2e8f0',
                    padding: '6px',
                    backgroundColor: '#ffffff',
                    cursor: 'pointer'
                  }}
                >
                  <img src={img} alt="thumbnail" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </div>
              ))}
            </div>
          </div>

          {/* Right Side: Product Details & Config Panel */}
          <div style={{
            flex: '1 1 450px',
            backgroundColor: '#ffffff',
            borderRadius: '24px',
            border: '1px solid #e2e8f0',
            padding: '40px',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px'
          }}>
            
            {/* Title & Brand */}
            <div>
              <span style={{
                fontSize: '13px',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                color: '#2563eb',
                fontWeight: '700'
              }}>{product.brand?.name || 'G-SHOP SELECT'}</span>
              <h1 style={{
                fontSize: '32px',
                fontWeight: '800',
                color: '#0f172a',
                lineHeight: '1.2',
                marginTop: '4px',
                letterSpacing: '-0.5px'
              }}>{product.name}</h1>
              
              {/* Ratings */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '12px' }}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill={i < 4 ? "#f59e0b" : "none"} color={i < 4 ? "#f59e0b" : "#cbd5e1"} />
                ))}
                <span style={{ fontSize: '14px', fontWeight: '700', color: '#475569', marginLeft: '6px' }}>4.5 / 5.0</span>
                <span style={{ fontSize: '13px', color: '#94a3b8', marginLeft: '4px' }}>(24 Verified Reviews)</span>
              </div>
            </div>

            {/* Pricing Section */}
            <div style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: '12px',
              borderBottom: '1px solid #f1f5f9',
              paddingBottom: '20px'
            }}>
              {hasDiscount ? (
                <>
                  <span style={{ fontSize: '36px', fontWeight: '800', color: '#2563eb' }}>
                    ₹{product.discountPrice.toFixed(2)}
                  </span>
                  <span style={{ fontSize: '18px', color: '#94a3b8', textDecoration: 'line-through' }}>
                    ₹{product.price.toFixed(2)}
                  </span>
                  <span style={{
                    backgroundColor: '#fee2e2',
                    color: '#ef4444',
                    fontSize: '12px',
                    fontWeight: '700',
                    padding: '4px 10px',
                    borderRadius: '8px',
                    marginLeft: '8px'
                  }}>
                    {Math.round(((product.price - product.discountPrice) / product.price) * 100)}% OFF
                  </span>
                </>
              ) : (
                <span style={{ fontSize: '36px', fontWeight: '800', color: '#0f172a' }}>
                  ₹{product.price.toFixed(2)}
                </span>
              )}
            </div>

            {/* Variant selections - SIZE (only for Clothing or Shoes category) */}
            {variants.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label style={{ fontSize: '14px', fontWeight: '700', color: '#334155' }}>
                    Select Size
                  </label>
                  <span style={{ fontSize: '12px', color: '#2563eb', fontWeight: '600', cursor: 'pointer' }}>Size Guide</span>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  {variants.map((v) => {
                    const isSelected = selectedSize === v.variantValue;
                    return (
                      <button
                        key={v.id}
                        onClick={() => setSelectedSize(v.variantValue)}
                        style={{
                          minWidth: '50px',
                          height: '45px',
                          border: isSelected ? '2px solid #2563eb' : '1px solid #e2e8f0',
                          backgroundColor: isSelected ? '#eff6ff' : '#ffffff',
                          color: isSelected ? '#2563eb' : '#475569',
                          fontWeight: '600',
                          borderRadius: '10px',
                          fontSize: '14px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: '0 12px'
                        }}
                      >
                        {v.variantValue}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Description */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#334155' }}>Product Description</h4>
              <p style={{ fontSize: '14px', color: '#64748b', lineHeight: '1.6' }}>{product.description}</p>
            </div>

            {/* Delivery Estimation widget */}
            <div style={{
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '16px',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#475569', fontSize: '14px' }}>
                <Calendar size={18} style={{ color: '#2563eb' }} />
                <span>
                  Estimated delivery between: <strong style={{ color: '#0f172a' }}>{deliveryMinDate} - {deliveryMaxDate}</strong>
                </span>
              </div>
              <div style={{ display: 'flex', gap: '16px', borderTop: '1px solid #e2e8f0', paddingTop: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#64748b', flex: 1 }}>
                  <ShieldCheck size={14} style={{ color: '#10b981' }} />
                  <span>100% Brand Original</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#64748b', flex: 1 }}>
                  <RefreshCw size={14} style={{ color: '#10b981' }} />
                  <span>7-Day Return Policy</span>
                </div>
              </div>
            </div>

            {/* Actions: Add to Cart & Wishlist */}
            <div style={{ display: 'flex', gap: '16px', marginTop: '10px' }}>
              <button
                onClick={handleAddToCart}
                disabled={addingToCart}
                className="btn-primary"
                style={{
                  flex: 1,
                  height: '50px',
                  borderRadius: '12px',
                  fontSize: '15px'
                }}
              >
                <ShoppingCart size={18} />
                {addingToCart ? 'Adding to Cart...' : 'Add to Cart'}
              </button>

              <button
                onClick={handleToggleWishlist}
                style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '12px',
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  color: savedWishlist ? '#ef4444' : '#475569',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.02)'
                }}
              >
                <Heart size={20} fill={savedWishlist ? '#ef4444' : 'none'} />
              </button>
            </div>

            {/* Specifications Details Table */}
            {Object.keys(specObj).length > 0 && (
              <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '20px', marginTop: '10px' }}>
                <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#334155', marginBottom: '12px' }}>Specifications</h4>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                  <tbody>
                    {Object.entries(specObj).map(([key, value]) => (
                      <tr key={key} style={{ borderBottom: '1px solid #f8fafc' }}>
                        <td style={{ padding: '8px 0', color: '#64748b', fontWeight: '500', width: '40%' }}>{key}</td>
                        <td style={{ padding: '8px 0', color: '#0f172a', fontWeight: '600' }}>{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};

export default ProductDetails;
