import { useState, useEffect } from "react";
import { useOutletContext, Link, Navigate } from "react-router-dom";
import { ChevronDown, ChevronUp } from "lucide-react";

export const Profile = () => {
  const { user, purchases, fetchPurchases } = useOutletContext();
  const [selectedPurchase, setSelectedPurchase] = useState(null);

  useEffect(() => {
    if (user) {
      fetchPurchases();
    }
  }, []);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <main className="container page-wrapper" style={{ paddingTop: "8rem" }}>
      <div className="fade-in">
        <h2 className="section-title" style={{ textAlign: "left", margin: "2rem 0" }}>Your Profile</h2>
        
        <div className="profile-header" style={{ display: "flex", alignItems: "center", gap: "2rem", marginBottom: "3rem", padding: "2rem", backgroundColor: "var(--color-pale-purple)", borderRadius: "var(--radius-card)" }}>
          <div className="profile-avatar" style={{ width: "80px", height: "80px", backgroundColor: "var(--color-primary)", color: "var(--color-white)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2rem", fontWeight: "bold" }}>
            {user.name ? user.name.charAt(0).toUpperCase() : (user.email ? user.email.charAt(0).toUpperCase() : "U")}
          </div>
          <div>
            <h3 style={{ marginBottom: "0.25rem", fontSize: "1.5rem" }}>{user.name || "User"}</h3>
            <p style={{ margin: 0, color: "var(--color-dark-gray)" }}>{user.email}</p>
          </div>
        </div>

        <h3 style={{ marginBottom: "1.5rem" }}>Purchase History</h3>
        
        {purchases.length === 0 ? (
          <p style={{ color: "var(--color-dark-gray)" }}>
            You haven't made any purchases yet. <Link to="/shop" style={{ color: "var(--color-primary)", textDecoration: "underline" }}>Start shopping</Link>
          </p>
        ) : (
          <div className="purchase-history" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {purchases.map(purchase => {
              const formattedDate = new Date(purchase.createdAt || purchase.date).toLocaleDateString();
              const checkoutDetails = purchase.datosCheckout || purchase.shippingDetails;
              const shippingName = checkoutDetails?.nombre || checkoutDetails?.fullName || "";
              const shippingAddress = checkoutDetails?.direccion || checkoutDetails?.address || "";
              const purchaseItems = purchase.items || [];

              return (
                <div key={purchase.id} className="purchase-card" style={{ backgroundColor: "var(--color-white)", borderRadius: "var(--radius-card)", border: "1px solid var(--color-gray)", padding: "1.5rem", transition: "var(--transition)" }}>
                  <div 
                    className="purchase-header" 
                    onClick={() => setSelectedPurchase(selectedPurchase === purchase.id ? null : purchase.id)}
                    style={{ cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}
                  >
                    <div>
                      <strong>Order #{purchase.id}</strong>
                      <span style={{ display: "block", fontSize: "0.9rem", color: "var(--color-dark-gray)" }}>{formattedDate}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                      <strong>${purchase.total.toFixed(2)}</strong>
                      {selectedPurchase === purchase.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </div>
                  </div>
                  
                  {selectedPurchase === purchase.id && (
                    <div className="purchase-details" style={{ marginTop: "1.5rem", paddingTop: "1.5rem", borderTop: "1px solid var(--color-gray)" }}>
                      <h4 style={{ fontSize: "1rem", marginBottom: "1rem" }}>Products</h4>
                      {purchaseItems.map((item, idx) => {
                        const qty = item.cantidad || item.quantity || 1;
                        const name = item.data?.nombre || item.name || "Product";
                        const price = item.data?.precio || item.price || 0;

                        return (
                          <div key={idx} className="purchase-item" style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem", color: "var(--color-text-light)" }}>
                            <span>{qty}x {name}</span>
                            <span>${(price * qty).toFixed(2)}</span>
                          </div>
                        );
                      })}
                      
                      {checkoutDetails && (
                        <div style={{ marginTop: "1rem", paddingTop: "1rem", borderTop: "1px dashed var(--color-light-gray)" }}>
                          <h4 style={{ fontSize: "1rem", marginBottom: "0.5rem" }}>Shipping Details</h4>
                          <p style={{ fontSize: "0.9rem", margin: 0, color: "var(--color-dark-gray)" }}>
                            {shippingName}<br/>
                            {shippingAddress}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
};
