import { createContext, useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [cartItems, setCartItems] = useState({});
  const [products, setProducts] = useState([]);

  // Load products from backend
  useEffect(() => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/products/`);
        setProducts(response.data.products);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchProducts();
  }, []);

  // Load cart from localStorage when component mounts
  useEffect(() => {
    const savedCart = localStorage.getItem('cartItems');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (itemId) => {
    try {
      setCartItems((prev) => ({
        ...prev,
        [itemId]: (prev[itemId] || 0) + 1,
      }));
    } catch (error) {
      console.error('Error adding item to cart:', error);
    }
  };

  const removeFromCart = (itemId) => {
    try {
      setCartItems((prev) => {
        if (!prev[itemId]) return prev;
        const newCount = prev[itemId] - 1;
        if (newCount <= 0) {
          const { [itemId]: _, ...rest } = prev;
          return rest;
        }
        return { ...prev, [itemId]: newCount };
      });
    } catch (error) {
      console.error('Error removing item from cart:', error);
      toast.error('Failed to remove item from cart.');
    }
  };

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        const itemInfo = products.find((product) => product._id === item);
        if (itemInfo) {
          totalAmount += itemInfo.price * cartItems[item];
        }
      }
    }
    return totalAmount;
  };

  const clearCart = () => {
    setCartItems({});
  };

  const contextValue = {
    products,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    clearCart,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
