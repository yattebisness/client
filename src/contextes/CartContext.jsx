"use client";


import { createContext, useContext, useReducer, useEffect } from "react";
import Cookies from "js-cookie";

const cartContext = createContext();
export const useCart = () => useContext(cartContext);

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_BACKEND_CART":
      return action.payload;

    case "ADD":
      const found = state.find(item => item.id === action.payload.id);
      if (found) {
        return state.map(item =>
          item.id === action.payload.id
            ? { ...item, quantiter: item.quantiter + 1 }
            : item
        );
      } else {
        return [...state, { ...action.payload, quantiter: 1 }];
      }

    case "REMOVE":
      return state.filter(item => item.id !== action.payload.id);

    case "SET_QUANTITY":
      return state.map(item =>
        item.id === action.payload.id
          ? { ...item, quantiter: action.payload.quantity }
          : item
      );

    case "CLEAR":
      return [];

    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  
  const initialCart = () => {
   const saved = Cookies.get("guest_cart");
   return saved ? JSON.parse(saved) : [];
  };
  
  const [panier, dispatch] = useReducer(reducer, [], initialCart)
  
 
  
  const mergeGuestCartWithBackend = async () => {
     const guestCart = Cookies.get("guest_cart");
     const token = Cookies.get("token");

    if (!guestCart || !token) return;

    try {
      const items = JSON.parse(guestCart);
      for (const item of items) {
        await fetch("https://yatteshop.pythonanywhere.com/api/shop/cart-items/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
          body: JSON.stringify({
            product: item.id,
            quantity: item.quantiter,
          }),
        });
      }
      Cookies.remove("guest_cart");
    } catch (error) {
      console.error("Erreur fusion panier invité :", error);
    }
  };

  const fetchPanier = async () => {
    const token = Cookies.get("token");

    if (!token) {
      const savedCart = Cookies.get("guest_cart");
      if (savedCart) {
        try {
          dispatch({ type: "SET_BACKEND_CART", payload: JSON.parse(savedCart) });
          
        } catch (e) {
          console.error("Erreur parsing panier invité :", e);
        }
      }
      return;
    }

    await mergeGuestCartWithBackend();

    fetch("https://yatteshop.pythonanywhere.com/api/shop/cart-items/", {
      headers: { Authorization: `Token ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        
        const cartData = data.map(item => ({
          id: item.product, 
          cartItemId: item.id, 
          quantiter: item.quantity,
          name: item.product_name,
          price: item.product_price,
          image: item.product_image,
          description: item.product_description,
          prix_livraison: item.product_prix_livraison,
        }));
        dispatch({ type: "SET_BACKEND_CART", payload: cartData });
      })
      .catch(err => console.error("Erreur chargement panier :", err));
  };

  const updateQuantityBackend = async (id, quantity) => {
    const token = Cookies.get("token");
    if (!token) {
      dispatch({ type: "SET_QUANTITY", payload: { id, quantity } });
      return;
    }

    try {
      
      const cartItem = panier.find(item => item.id === id);
      const cartItemId = cartItem?.cartItemId;

      if (cartItemId) {
        await fetch(`https://yatteshop.pythonanywhere.com/api/shop/cart-items/${cartItemId}/`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
          body: JSON.stringify({ quantity }),
        });
      }
      dispatch({ type: "SET_QUANTITY", payload: { id, quantity } });
    } catch (error) {
      console.error("Erreur mise à jour quantité :", error);
    }
  };

  const removeItem = async (id) => {
    const token = Cookies.get("token");
    const cartItem = panier.find(item => item.id === id);

    if (token && cartItem?.cartItemId) {
      try {
        await fetch(`https://yatteshop.pythonanywhere.com/api/shop/cart-items/${cartItem.cartItemId}/`, {
          method: "DELETE",
          headers: { Authorization: `Token ${token}` },
        });
      } catch (error) {
        console.error("Erreur suppression :", error);
      }
    }
    dispatch({ type: "REMOVE", payload: { id } });
  };

  
  const handlePlus = (id) => {
    const item = panier.find(i => i.id === id);
    if (!item) return;

    updateQuantityBackend(id, item.quantiter + 1);
    
    
  };

  const handleMoins = (id) => {
    const item = panier.find(i => i.id === id);
    if (!item) return;

    if (item.quantiter > 1) {
      updateQuantityBackend(id, item.quantiter - 1);
    

    } else {
      removeItem(id);

    }
  };
  
  
  const clearCart = () => {
    dispatch({ type: "CLEAR" });
    Cookies.remove("guest_cart");
  };

  
  useEffect(() => {
   const token = Cookies.get("token");
   if (!token) {
    Cookies.set("guest_cart", JSON.stringify(panier), { expires: 7, path: '/' });
   }
  }, [panier]);

  
  
  
  useEffect(() => {
    fetchPanier();
  }, []);
  
  
  return (
    <cartContext.Provider
      value={{ panier, fetchPanier, handlePlus, handleMoins, removeItem,
        dispatch,
        mergeGuestCartWithBackend,
        clearCart,
      }}
    >
      {children}
    </cartContext.Provider>
  );
};




