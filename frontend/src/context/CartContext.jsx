import { createContext, useContext, useMemo, useState } from 'react';
import api from '../api/axios.js';
import { useAuth } from './AuthContext.jsx';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState({ items: [], totalAmount: 0 });
  const [loading, setLoading] = useState(false);

  const loadCart = async () => {
    if (!isAuthenticated) return setCart({ items: [], totalAmount: 0 });
    setLoading(true);
    try {
      const { data } = await api.get('/cart');
      setCart(data);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    const { data } = await api.post('/cart/add', { productId, quantity });
    setCart(data);
    return data;
  };

  const updateQuantity = async (productId, quantity) => {
    const { data } = await api.put(`/cart/update/${productId}`, { quantity });
    setCart(data);
    return data;
  };

  const removeItem = async (productId) => {
    const { data } = await api.delete(`/cart/remove/${productId}`);
    setCart(data);
    return data;
  };

  const clearCart = async () => {
    const { data } = await api.delete('/cart/clear');
    setCart(data);
    return data;
  };

  const value = useMemo(
    () => ({ cart, loading, loadCart, addToCart, updateQuantity, removeItem, clearCart }),
    [cart, loading, isAuthenticated]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => useContext(CartContext);
