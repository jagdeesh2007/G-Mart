import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';
import API from '../api';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const { showSuccess, showError, showInfo } = useToast();
  
  const [cartItems, setCartItems] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loadingCart, setLoadingCart] = useState(true);

  // Helper to load guest cart
  const getGuestCart = () => {
    const data = localStorage.getItem('guest_cart');
    return data ? JSON.parse(data) : [];
  };

  // Load wishlist & cart from DB or LocalStorage
  const fetchCartAndWishlist = useCallback(async () => {
    setLoadingCart(true);
    // Temporarily use local storage for all users since CartController is missing
    setCartItems(getGuestCart());
    setWishlistItems([]);
    setLoadingCart(false);
  }, []);

  // Sync / Merge guest cart on login
  useEffect(() => {
    fetchCartAndWishlist();
  }, [isAuthenticated, fetchCartAndWishlist]);

  // Add to cart
  const addToCart = async (product, variant = null, quantity = 1) => {
    const currentCart = getGuestCart();
    const existingItemIndex = currentCart.findIndex(item => 
      item.product.id === product.id && 
      (!variant ? !item.variant : item.variant?.id === variant?.id)
    );

    // Validate stock
    const maxAvailable = variant ? variant.stockQuantity : product.stockQuantity;
    let newQty = quantity;

    if (existingItemIndex > -1) {
      newQty = currentCart[existingItemIndex].quantity + quantity;
    }

    if (maxAvailable < newQty) {
      showError(`Requested quantity exceeds stock! Only ${maxAvailable} left.`);
      return;
    }

    if (existingItemIndex > -1) {
      currentCart[existingItemIndex].quantity = newQty;
    } else {
      currentCart.push({
        id: `local_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
        product,
        variant,
        quantity
      });
    }

    localStorage.setItem('guest_cart', JSON.stringify(currentCart));
    setCartItems(currentCart);
    showSuccess(`Added ${product.name} to cart!`);
  };

  // Update cart quantity
  const updateQuantity = async (cartItemId, productId, variantId, newQty) => {
    const currentCart = getGuestCart();
    const itemIndex = currentCart.findIndex(item => 
      item.product.id === productId && 
      (!variantId ? !item.variant : item.variant?.id === variantId)
    );

    if (itemIndex > -1) {
      if (newQty <= 0) {
        currentCart.splice(itemIndex, 1);
      } else {
        const maxAvailable = currentCart[itemIndex].variant 
          ? currentCart[itemIndex].variant.stockQuantity 
          : currentCart[itemIndex].product.stockQuantity;

        if (maxAvailable < newQty) {
          showError(`Cannot exceed available stock of ${maxAvailable} units.`);
          return;
        }
        currentCart[itemIndex].quantity = newQty;
      }

      localStorage.setItem('guest_cart', JSON.stringify(currentCart));
      setCartItems(currentCart);
    }
  };

  // Remove from cart
  const removeFromCart = async (cartItemId, productId, variantId) => {
    const currentCart = getGuestCart();
    const filtered = currentCart.filter(item => 
      !(item.product.id === productId && 
        (!variantId ? !item.variant : item.variant?.id === variantId))
    );
    localStorage.setItem('guest_cart', JSON.stringify(filtered));
    setCartItems(filtered);
    showInfo('Item removed from cart.');
  };

  // Toggle wishlist
  const toggleWishlist = async (product) => {
    showInfo('Wishlist functionality is currently unavailable.');
  };

  const clearCart = async () => {
    localStorage.removeItem('guest_cart');
    setCartItems([]);
  };

  // Math Calculations (Subtotal, Tax, Shipping, Grand Total)
  const getCartTotals = (couponDiscount = 0) => {
    const subtotal = cartItems.reduce((acc, item) => {
      const price = item.product.discountPrice !== null ? item.product.discountPrice : item.product.price;
      const adjustment = item.variant ? item.variant.priceAdjustment || 0 : 0;
      return acc + (price + adjustment) * item.quantity;
    }, 0);

    const taxRate = 0.18; // 18% standard VAT/Tax
    const tax = subtotal * taxRate;
    
    // Free shipping above $100, standard is $15
    const shippingCharges = subtotal > 100 || subtotal === 0 ? 0 : 15;
    const grandTotal = Math.max(0, subtotal + tax + shippingCharges - couponDiscount);

    return {
      subtotal,
      tax,
      shippingCharges,
      grandTotal
    };
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        wishlistItems,
        loadingCart,
        addToCart,
        updateQuantity,
        removeFromCart,
        toggleWishlist,
        clearCart,
        getCartTotals,
        fetchCartAndWishlist
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
