import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

export const Layout = () => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem("token") || null;
  });

  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem("cart");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [purchases, setPurchases] = useState([]);
  const [toast, setToast] = useState(null);

  // Persist cart changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // Fetch purchases when token is set
  const fetchPurchases = async () => {
    if (!token) return;
    try {
      const res = await fetch("https://creacionaplicaciones.onrender.com/api/compras", {
        method: "GET",
        headers: {
          "x-project-key": "grupo-12",
          "Authorization": `Bearer ${token}`
        }
      });
      if (res.status === 200) {
        const data = await res.json();
        const purchaseList = Array.isArray(data) ? data : (data.items || []);
        setPurchases(purchaseList);
      }
    } catch (err) {
      console.error("Failed to fetch purchases from API:", err);
    }
  };

  useEffect(() => {
    if (token) {
      fetchPurchases();
    } else {
      setPurchases([]);
    }
  }, [token]);

  // Auto-hide toast
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const login = (userData, tokenVal) => {
    setUser(userData);
    setToken(tokenVal);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", tokenVal);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setPurchases([]);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setToast(`${product.name} added to your bag!`);
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    setCart(prev => prev.map(item => item.id === productId ? { ...item, quantity: newQuantity } : item));
  };

  const clearCart = () => setCart([]);

  return (
    <>
      <Navbar cartCount={cart.reduce((acc, item) => acc + item.quantity, 0)} user={user} onLogout={logout} />
      <div className="app-content-wrapper">
        <Outlet context={{ 
          cart, addToCart, removeFromCart, updateQuantity, clearCart,
          user, token, login, logout, purchases, fetchPurchases 
        }} />
      </div>
      <Footer />

      {/* Toast Notification */}
      {toast && (
        <div style={{
          position: "fixed",
          bottom: "30px",
          right: "30px",
          backgroundColor: "#b19cd9",
          color: "white",
          padding: "1rem 2rem",
          borderRadius: "var(--radius-pill)",
          boxShadow: "0 10px 30px rgba(177, 156, 217, 0.4)",
          zIndex: 99999,
          display: "flex",
          alignItems: "center",
          gap: "10px",
          fontWeight: 500,
          animation: "slideIn 0.3s ease forwards"
        }}>
          <span style={{ display: "inline-block", width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "white" }}></span>
          {toast}
          <style>{`
            @keyframes slideIn {
              from { transform: translateY(50px); opacity: 0; }
              to { transform: translateY(0); opacity: 1; }
            }
          `}</style>
        </div>
      )}
    </>
  );
};
