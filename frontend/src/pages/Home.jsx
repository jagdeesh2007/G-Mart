import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useCart } from '../context/CartContext';
import API from '../api';
import {
  Search,
  SlidersHorizontal,
  ShoppingCart,
  Heart,
  Star,
  ChevronRight,
  User,
  LogOut,
  Sliders,
  Sparkles,
  LayoutGrid,
  TrendingUp
} from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();
  const { user, logout, isAdmin, isAuthenticated } = useAuth();
  const { showSuccess, showError, showInfo } = useToast();
  const { addToCart } = useCart();

  // Catalog States
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState(null); // category object
  const [selectedBrand, setSelectedBrand] = useState('');
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sort, setSort] = useState('id,desc');
  const [showFiltersPanel, setShowFiltersPanel] = useState(false);

  // Cart/Wishlist quick counters (will connect dynamically in next modules)
  const [cartCount, setCartCount] = useState(0);
  const [wishlistItems, setWishlistItems] = useState([]);

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);
    return () => clearTimeout(handler);
  }, [search]);

  // Load initial categories & brands
  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const catRes = await API.get('/categories');
        setCategories(catRes.data);
      } catch (error) {
        showError('Failed to load store categories!');
      }
    };
    fetchMetadata();
  }, []);

  // Fetch products whenever filters change
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = {};
        if (selectedCategory) params.categoryId = selectedCategory.id;
        if (selectedBrand) params.brandId = selectedBrand;
        if (minPrice) params.minPrice = minPrice;
        if (maxPrice) params.maxPrice = maxPrice;
        if (debouncedSearch) params.search = debouncedSearch;
        params.sort = sort;
        params.page = 0;
        params.size = 20;

        const response = await API.get('/products', { params });
        setProducts(response.data.content);
      } catch (error) {
        showError('Failed to fetch products!');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [selectedCategory, selectedBrand, minPrice, maxPrice, debouncedSearch, sort]);

  const handleCategoryClick = (category) => {
    setSelectedCategory(selectedCategory?.id === category?.id ? null : category);
  };

  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    addToCart(product, null, 1);
  };

  const handleToggleWishlist = (e, product) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      showInfo('Please log in to add items to your wishlist.');
      navigate('/login');
      return;
    }
    if (wishlistItems.includes(product.id)) {
      setWishlistItems(prev => prev.filter(id => id !== product.id));
      showInfo(`Removed ${product.name} from wishlist.`);
    } else {
      setWishlistItems(prev => [...prev, product.id]);
      showSuccess(`Saved ${product.name} to wishlist!`);
    }
  };

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
      fontFamily: 'Outfit, sans-serif'
    }}>
      
      {/* Sidebar - Categories & Nav */}
      <aside style={{
        width: '280px',
        backgroundColor: '#ffffff',
        borderRight: '1px solid #e2e8f0',
        padding: '30px 24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '30px',
        flexShrink: 0
      }} className="hidden-mobile">
        
        {/* Brand Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            backgroundColor: '#2563eb',
            color: '#ffffff',
            padding: '8px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center'
          }}>
            <ShoppingCart size={20} />
          </div>
          <span style={{ fontSize: '20px', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.5px' }}>G-Shop</span>
        </div>

        {/* Categories Menu */}
        <div>
          <h3 style={{
            fontSize: '12px',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            color: '#94a3b8',
            marginBottom: '16px',
            fontWeight: '700'
          }}>Categories</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <button
              onClick={() => setSelectedCategory(null)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 14px',
                borderRadius: '10px',
                width: '100%',
                textAlign: 'left',
                backgroundColor: !selectedCategory ? '#eff6ff' : 'transparent',
                color: !selectedCategory ? '#2563eb' : '#475569',
                fontWeight: !selectedCategory ? '600' : '500',
                fontSize: '14px',
                transition: 'all 0.15s ease'
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <LayoutGrid size={16} /> All Products
              </span>
              <ChevronRight size={14} />
            </button>

            {categories.map((cat) => {
              const isSelected = selectedCategory?.id === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryClick(cat)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    width: '100%',
                    textAlign: 'left',
                    backgroundColor: isSelected ? '#eff6ff' : 'transparent',
                    color: isSelected ? '#2563eb' : '#475569',
                    fontWeight: isSelected ? '600' : '500',
                    fontSize: '14px',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <span>{cat.name}</span>
                  <ChevronRight size={14} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Quick Links / Account Actions */}
        <div style={{ marginTop: 'auto', borderTop: '1px solid #e2e8f0', paddingTop: '20px' }}>
          {isAuthenticated ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: '#eff6ff',
                  color: '#2563eb',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '700',
                  fontSize: '14px'
                }}>
                  {user?.firstName?.charAt(0) || 'U'}{user?.lastName?.charAt(0) || ''}
                </div>
                <div>
                  <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#0f172a', margin: 0 }}>
                    {user?.firstName || 'User'} {user?.lastName || ''}
                  </h4>
                  <p style={{ fontSize: '11px', color: '#64748b', margin: 0 }}>
                    {isAdmin ? 'Admin Portal' : 'Customer'}
                  </p>
                </div>
              </div>
              
              {isAdmin && (
                <button
                  onClick={() => navigate('/admin')}
                  className="btn-outline"
                  style={{ width: '100%', padding: '8px 14px', fontSize: '13px', borderRadius: '10px' }}
                >
                  Admin Control Panel
                </button>
              )}

              <button
                onClick={() => navigate('/dashboard')}
                className="btn-secondary"
                style={{ width: '100%', padding: '8px 14px', fontSize: '13px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}
              >
                <User size={14} /> My Profile
              </button>
              <button
                onClick={logout}
                className="btn-outline"
                style={{ width: '100%', padding: '8px 14px', fontSize: '13px', borderRadius: '10px', border: '1px solid #fee2e2', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}
              >
                <LogOut size={14} /> Log Out
              </button>
            </div>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="btn-primary"
              style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}
            >
              <User size={16} /> Sign In
            </button>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <main style={{
        flex: 1,
        padding: '30px 40px',
        display: 'flex',
        flexDirection: 'column',
        gap: '30px',
        overflowY: 'auto'
      }} className="main-mobile">
        
        {/* Header Navigation Area */}
        <header style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '20px'
        }}>
          <div>
            <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.5px' }}>
              Explore
            </h2>
            <p style={{ fontSize: '14px', color: '#64748b' }}>
              {selectedCategory ? `${selectedCategory.name} Category` : 'Explore premium products & fresh organic items'}
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {/* Search Input */}
            <div style={{ position: 'relative', width: '280px' }} className="search-mobile">
              <Search size={16} style={{
                position: 'absolute',
                left: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#94a3b8'
              }} />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products, brands..."
                style={{
                  paddingLeft: '40px',
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  fontSize: '14px',
                  height: '42px'
                }}
              />
            </div>

            {/* Filter Toggle Button */}
            <button
              onClick={() => setShowFiltersPanel(!showFiltersPanel)}
              className="btn-outline"
              style={{
                height: '42px',
                padding: '0 16px',
                borderRadius: '12px',
                display: 'flex',
                gap: '8px',
                backgroundColor: showFiltersPanel ? '#eff6ff' : 'transparent',
                borderColor: showFiltersPanel ? '#2563eb' : '#e2e8f0',
                color: showFiltersPanel ? '#2563eb' : '#475569'
              }}
            >
              <SlidersHorizontal size={16} /> Filters
            </button>

            {/* Cart Icon */}
            <button
              onClick={() => navigate('/cart')}
              style={{
                height: '42px',
                width: '42px',
                borderRadius: '12px',
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                color: '#475569',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative'
              }}
            >
              <ShoppingCart size={18} />
              {cartCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-4px',
                  backgroundColor: '#2563eb',
                  color: '#ffffff',
                  fontSize: '10px',
                  fontWeight: '700',
                  borderRadius: '50%',
                  width: '18px',
                  height: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>{cartCount}</span>
              )}
            </button>
          </div>
        </header>

        {/* Dropdown Filters Panel (Expanded View) */}
        {showFiltersPanel && (
          <div className="animate-fade-in" style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '16px',
            padding: '20px 24px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px',
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
          }}>
            {/* Brand Filter */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#475569' }}>Select Brand</label>
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                style={{ fontSize: '14px', height: '40px', backgroundColor: '#ffffff', border: '1px solid #e2e8f0' }}
              >
                <option value="">All Brands</option>
                {brands.map(b => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            </div>

            {/* Price Ranges */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#475569' }}>Min Price (₹)</label>
                <input
                  type="number"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  placeholder="0"
                  style={{ fontSize: '14px', height: '40px', backgroundColor: '#ffffff', border: '1px solid #e2e8f0' }}
                />
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#475569' }}>Max Price (₹)</label>
                <input
                  type="number"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  placeholder="2000"
                  style={{ fontSize: '14px', height: '40px', backgroundColor: '#ffffff', border: '1px solid #e2e8f0' }}
                />
              </div>
            </div>

            {/* Sort Filter */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#475569' }}>Sort By</label>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                style={{ fontSize: '14px', height: '40px', backgroundColor: '#ffffff', border: '1px solid #e2e8f0' }}
              >
                <option value="id,desc">New Arrivals</option>
                <option value="price,asc">Price: Low to High</option>
                <option value="price,desc">Price: High to Low</option>
                <option value="name,asc">Name: A to Z</option>
              </select>
            </div>

            {/* Reset Button */}
            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
              <button
                onClick={() => {
                  setSelectedBrand('');
                  setMinPrice('');
                  setMaxPrice('');
                  setSort('id,desc');
                  setSearch('');
                }}
                className="btn-secondary"
                style={{ height: '40px', width: '100%', fontSize: '13px', borderRadius: '10px' }}
              >
                Reset Filters
              </button>
            </div>
          </div>
        )}

        {/* Dynamic Marketing Banner Card */}
        {!selectedCategory && !search && (
          <div style={{
            background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)',
            color: '#ffffff',
            borderRadius: '24px',
            padding: '40px',
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            boxShadow: '0 10px 30px rgba(37, 99, 235, 0.15)'
          }}>
            <div style={{ zIndex: 2, maxWidth: '500px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: 'rgba(255,255,255,0.15)', padding: '6px 12px', borderRadius: '100px', width: 'fit-content', fontSize: '12px', fontWeight: '600', marginBottom: '16px' }}>
                <Sparkles size={12} /> Seasonal Hot Collection
              </div>
              <h2 style={{ fontSize: '32px', fontWeight: '800', lineHeight: '1.2', marginBottom: '12px' }}>
                Bring Bold Fashion
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '15px', marginBottom: '24px', lineHeight: '1.5' }}>
                Layers on Layers. Check out our newly dropped Winter Parkas and Sweat-wicking Sportswear collections. Up to 50% discount.
              </p>
              <button
                onClick={() => {
                  // Jump to clothing category
                  const summerCat = categories.find(c => c.slug === 'summer-wear');
                  if (summerCat) setSelectedCategory(summerCat);
                }}
                className="btn-primary"
                style={{ backgroundColor: '#ffffff', color: '#2563eb', padding: '10px 20px', borderRadius: '10px', fontSize: '14px' }}
              >
                View Collection
              </button>
            </div>
            <div style={{
              position: 'absolute',
              right: '5%',
              bottom: '-20px',
              width: '260px',
              height: '260px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255,255,255,0.06)'
            }} className="hidden-mobile" />
          </div>
        )}

        {/* Catalog Section */}
        <div>
          {loading ? (
            /* Loading Skeletons */
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
              gap: '24px'
            }}>
              {[...Array(8)].map((_, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div className="skeleton" style={{ height: '220px', borderRadius: '16px' }} />
                  <div className="skeleton" style={{ height: '14px', width: '60%', borderRadius: '4px' }} />
                  <div className="skeleton" style={{ height: '18px', width: '90%', borderRadius: '4px' }} />
                  <div className="skeleton" style={{ height: '16px', width: '40%', borderRadius: '4px' }} />
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            /* Empty State */
            <div style={{
              textAlign: 'center',
              padding: '60px 20px',
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '20px'
            }}>
              <Sliders size={48} style={{ color: '#94a3b8', marginBottom: '16px' }} />
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#0f172a', marginBottom: '6px' }}>No Products Found</h3>
              <p style={{ color: '#64748b', fontSize: '14px', maxWidth: '360px', margin: '0 auto' }}>
                We couldn't find any products matching your current filters. Try relaxing your searches or price parameters.
              </p>
            </div>
          ) : (
            /* Product Grid */
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
              gap: '28px'
            }}>
              {products.map((product) => {
                let imageUrl = '';
                try {
                  const imgs = JSON.parse(product.imageUrls || '[""]');
                  imageUrl = Array.isArray(imgs) ? imgs[0] : '';
                } catch (_) { imageUrl = ''; }
                const hasDiscount = product.discountPrice !== null && product.discountPrice !== undefined;
                const discountPercent = hasDiscount 
                  ? Math.round(((product.price - product.discountPrice) / product.price) * 100) 
                  : 0;

                return (
                  <div
                    key={product.id}
                    onClick={() => navigate(`/product/${product.id}`)}
                    className="product-card"
                    style={{
                      backgroundColor: '#ffffff',
                      borderRadius: '20px',
                      border: '1px solid #e2e8f0',
                      padding: '16px',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      position: 'relative',
                      transition: 'all 0.25s ease',
                      boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)'
                    }}
                  >
                    {/* Wishlist Button */}
                    <button
                      onClick={(e) => handleToggleWishlist(e, product)}
                      style={{
                        position: 'absolute',
                        top: '24px',
                        right: '24px',
                        zIndex: 10,
                        backgroundColor: '#ffffff',
                        border: '1px solid #e2e8f0',
                        color: wishlistItems.includes(product.id) ? '#ef4444' : '#64748b',
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
                      }}
                    >
                      <Heart size={16} fill={wishlistItems.includes(product.id) ? '#ef4444' : 'none'} />
                    </button>

                    {/* Image Container with Discount Tag */}
                    <div style={{
                      backgroundColor: '#f8fafc',
                      borderRadius: '14px',
                      height: '200px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      overflow: 'hidden',
                      marginBottom: '16px',
                      position: 'relative'
                    }}>
                      <img
                        src={imageUrl}
                        alt={product.name}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          transition: 'transform 0.3s ease'
                        }}
                        className="card-image-hover"
                      />
                      {hasDiscount && (
                        <span style={{
                          position: 'absolute',
                          bottom: '12px',
                          left: '12px',
                          backgroundColor: '#ef4444',
                          color: '#ffffff',
                          fontSize: '11px',
                          fontWeight: '700',
                          padding: '4px 8px',
                          borderRadius: '6px'
                        }}>
                          {discountPercent}% OFF
                        </span>
                      )}
                    </div>

                    {/* Meta info */}
                    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, gap: '4px' }}>
                      <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#94a3b8', fontWeight: '700' }}>
                        {product.brand?.name || 'Organic'}
                      </span>
                      <h4 style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a', lineHeight: '1.4', marginBottom: '8px' }}>
                        {product.name}
                      </h4>
                      
                      {/* Review details */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '12px' }}>
                        <Star size={14} fill="#f59e0b" color="#f59e0b" />
                        <span style={{ fontSize: '12px', fontWeight: '700', color: '#475569' }}>4.5</span>
                        <span style={{ fontSize: '11px', color: '#94a3b8' }}>(24 reviews)</span>
                      </div>

                      {/* Pricing row */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginTop: 'auto'
                      }}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          {hasDiscount ? (
                            <>
                              <span style={{ fontSize: '18px', fontWeight: '800', color: '#2563eb' }}>
                                ₹{product.discountPrice.toFixed(2)}
                              </span>
                              <span style={{ fontSize: '12px', color: '#94a3b8', textDecoration: 'line-through' }}>
                                ₹{product.price.toFixed(2)}
                              </span>
                            </>
                          ) : (
                            <span style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a' }}>
                              ₹{product.price.toFixed(2)}
                            </span>
                          )}
                        </div>

                        {/* Add to Cart Button */}
                        <button
                          onClick={(e) => handleAddToCart(e, product)}
                          style={{
                            backgroundColor: '#2563eb',
                            color: '#ffffff',
                            width: '40px',
                            height: '40px',
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 4px 10px rgba(37,99,235,0.2)'
                          }}
                          className="add-cart-hover"
                        >
                          <ShoppingCart size={16} />
                        </button>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <style>{`
        .product-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 20px -8px rgba(0,0,0,0.08) !important;
          border-color: #cbd5e1 !important;
        }
        .product-card:hover .card-image-hover {
          transform: scale(1.05);
        }
        .add-cart-hover:hover {
          background-color: #1d4ed8 !important;
          transform: scale(1.05);
        }
        @media (max-width: 900px) {
          .hidden-mobile {
            display: none !important;
          }
          .main-mobile {
            padding: 24px 16px !important;
          }
          .search-mobile {
            width: 100% !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Home;
