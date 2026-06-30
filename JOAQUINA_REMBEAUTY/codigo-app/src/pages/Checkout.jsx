import { useState } from "react";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import Joi from "joi";
import { useOutletContext, Link } from "react-router-dom";

const schema = Joi.object({
  fullName: Joi.string().min(3).required().messages({
    "string.empty": "Full name is required.",
    "string.min": "Full name must be at least 3 characters."
  }),
  email: Joi.string().email({ tlds: { allow: false } }).required().messages({
    "string.empty": "Email is required.",
    "string.email": "Must be a valid email address."
  }),
  address: Joi.string().min(5).required().messages({
    "string.empty": "Shipping address is required.",
    "string.min": "Address must be at least 5 characters."
  })
});

export const Checkout = () => {
  const { cart, token, clearCart, fetchPurchases } = useOutletContext();
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);
  const [apiError, setApiError] = useState("");

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const shipping = subtotal > 50 ? 0 : 5.99;
  const total = subtotal > 0 ? subtotal + shipping : 0;

  const { register, handleSubmit, formState: { errors, isValid, isDirty, isSubmitting } } = useForm({
    resolver: joiResolver(schema),
    mode: "onChange"
  });

  const onSubmit = async (data) => {
    setApiError("");
    try {
      const payload = {
        items: cart.map(item => ({
          productoId: item.id,
          cantidad: item.quantity,
          data: {
            nombre: item.name,
            precio: item.price,
            imagen: item.image
          }
        })),
        total: total,
        datosCheckout: {
          nombre: data.fullName,
          email: data.email,
          direccion: data.address
        },
        data: {
          comentario: "Web order"
        }
      };

      const res = await fetch("https://creacionaplicaciones.onrender.com/api/compras", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-project-key": "grupo-12",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (res.status === 201) {
        clearCart();
        await fetchPurchases(); // refresh purchase history in background
        setPurchaseSuccess(true);
      } else {
        const errorData = await res.json().catch(() => ({}));
        setApiError(errorData.error || "An error occurred while processing payment.");
      }
    } catch (err) {
      console.error(err);
      setApiError("Connection error while processing order. Please try again later.");
    }
  };

  if (purchaseSuccess) {
    return (
      <main className="container page-wrapper" style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", paddingTop: "8rem" }}>
        <div className="fade-in" style={{ textAlign: "center", padding: "3rem", background: "var(--color-light-gray)", borderRadius: "var(--radius-card)", maxWidth: "600px", border: "1px solid var(--color-gray)" }}>
          <h2 className="section-title" style={{ color: "var(--color-primary)" }}>Purchase Successful!</h2>
          <p style={{ margin: "1.5rem 0", color: "var(--color-dark-gray)" }}>
            Thank you very much for your order. We are processing your request and will send you a confirmation email shortly.
          </p>
          <Link to="/profile" className="btn btn-primary">View Purchase History</Link>
        </div>
      </main>
    );
  }

  if (cart.length === 0) {
    return (
      <main className="container page-wrapper" style={{ paddingTop: "8rem" }}>
        <div style={{ textAlign: "center", padding: "4rem 0" }}>
          <p style={{ color: "var(--color-dark-gray)", marginBottom: "2rem" }}>Your cart is empty. There are no items to purchase.</p>
          <Link to="/shop" className="btn btn-primary">Go to Shop</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="container page-wrapper" style={{ paddingTop: "8rem" }}>
      <div className="checkout-container fade-in">
        <h2 style={{ textAlign: "center", marginBottom: "2rem" }}>Checkout</h2>
        
        {apiError && (
          <div style={{
            backgroundColor: "#ffe6e6",
            color: "#cc0000",
            padding: "1rem",
            borderRadius: "var(--radius-input)",
            marginBottom: "1.5rem",
            fontSize: "0.9rem",
            border: "1px solid #ffcccc"
          }}>
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label className="form-label" htmlFor="fullName">Full Name</label>
            <input 
              type="text" 
              id="fullName" 
              className={`form-input ${errors.fullName ? "error" : ""}`} 
              placeholder="Jane Doe" 
              {...register("fullName")} 
            />
            {errors.fullName && <span className="form-error">{errors.fullName.message}</span>}
          </div>
          
          <div className="form-group">
            <label className="form-label" htmlFor="email">Email Address</label>
            <input 
              type="email" 
              id="email" 
              className={`form-input ${errors.email ? "error" : ""}`} 
              placeholder="you@example.com" 
              {...register("email")} 
            />
            {errors.email && <span className="form-error">{errors.email.message}</span>}
          </div>
          
          <div className="form-group">
            <label className="form-label" htmlFor="address">Shipping Address</label>
            <input 
              type="text" 
              id="address" 
              className={`form-input ${errors.address ? "error" : ""}`} 
              placeholder="123 Galaxy Way, Montevideo" 
              {...register("address")} 
            />
            {errors.address && <span className="form-error">{errors.address.message}</span>}
          </div>

          <div style={{ margin: "2rem 0", padding: "1.5rem", background: "var(--color-light-gray)", borderRadius: "var(--radius-input)", border: "1px solid var(--color-gray)" }}>
            <h3 style={{ fontSize: "1.1rem", marginBottom: "1rem" }}>Order Summary</h3>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem", fontSize: "0.9rem" }}>
              <span>Subtotal:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.8rem", fontSize: "0.9rem" }}>
              <span>Shipping:</span>
              <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "600", borderTop: "1px dashed var(--color-dark-gray)", paddingTop: "0.8rem" }}>
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
          
          <button 
            style={{ width: "100%" }} 
            type="submit" 
            className="btn btn-primary"
            disabled={!isDirty || !isValid || isSubmitting}
          >
            {isSubmitting ? "Processing..." : "Confirm Order"}
          </button>
        </form>
      </div>
    </main>
  );
};
