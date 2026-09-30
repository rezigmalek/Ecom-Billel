import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, quantity = 1, options = {}) => {
    setCart(prevCart => {
      const existingItemIndex = prevCart.findIndex(
        item => item.id === product.id && JSON.stringify(item.options) === JSON.stringify(options)
      );

      if (existingItemIndex > -1) {
        const newCart = [...prevCart];
        newCart[existingItemIndex].quantity += quantity;
        return newCart;
      }
      return [...prevCart, { ...product, quantity, options }];
    });
  };

  const removeFromCart = (indexToRemove) => {
    setCart(prevCart => prevCart.filter((_, index) => index !== indexToRemove));
  };

  const updateQuantity = (indexToUpdate, newQuantity) => {
    if (newQuantity < 1) return;
    setCart(prevCart => {
      const newCart = [...prevCart];
      newCart[indexToUpdate].quantity = newQuantity;
      return newCart;
    });
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
