import { useState } from "react";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import Joi from "joi";

const loginSchema = Joi.object({
  email: Joi.string().email({ tlds: { allow: false } }).required().messages({
    "string.empty": "Email is required",
    "string.email": "Must be a valid email address"
  }),
  password: Joi.string().min(6).required().messages({
    "string.empty": "Password is required",
    "string.min": "Password must be at least 6 characters"
  })
});

const registerSchema = Joi.object({
  name: Joi.string().min(3).required().messages({
    "string.empty": "Name is required",
    "string.min": "Name must be at least 3 characters"
  }),
  email: Joi.string().email({ tlds: { allow: false } }).required().messages({
    "string.empty": "Email is required",
    "string.email": "Must be a valid email address"
  }),
  password: Joi.string().min(6).required().messages({
    "string.empty": "Password is required",
    "string.min": "Password must be at least 6 characters"
  })
});

export const AuthPopup = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);

  const { register, handleSubmit, formState: { errors, isValid, isDirty, isSubmitting }, reset } = useForm({
    resolver: joiResolver(isLogin ? loginSchema : registerSchema),
    mode: "onChange"
  });

  const onSubmit = async (data) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    onAuthSuccess({ email: data.email, name: data.name || "Joaquina García" });
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    reset();
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(255, 255, 255, 0.85)',
      backdropFilter: 'blur(10px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 9999
    }}>
      <div className="auth-container fade-in" style={{ width: "100%", maxWidth: "450px", backgroundColor: '#fff', padding: '3rem 2rem', borderRadius: '12px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}>
        
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <img src="/img/logorem_Mesa de trabajo 1.png" alt="r.e.m. beauty logo" style={{ height: "40px", marginBottom: "1rem" }} />
          <h2 style={{ fontSize: "1.5rem" }}>{isLogin ? "Welcome Back" : "Create Account"}</h2>
          <p style={{ color: "var(--color-dark-gray)", fontSize: "0.9rem", marginTop: "0.5rem" }}>
            Please {isLogin ? "sign in" : "register"} to continue shopping
          </p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
          
          {!isLogin && (
            <div className="form-group" style={{ marginBottom: "1rem" }}>
              <label htmlFor="name">Full Name</label>
              <input type="text" id="name" {...register("name")} className={`form-input ${errors.name ? "error" : ""}`} placeholder="Jane Doe" />
              {errors.name && <span className="error-message" style={{color: "var(--color-error)", fontSize: "0.85rem", marginTop: "0.25rem", display: "block"}}>{errors.name.message}</span>}
            </div>
          )}

          <div className="form-group" style={{ marginBottom: "1rem" }}>
            <label htmlFor="email">Email</label>
            <input type="email" id="email" {...register("email")} className={`form-input ${errors.email ? "error" : ""}`} placeholder="you@example.com" />
            {errors.email && <span className="error-message" style={{color: "var(--color-error)", fontSize: "0.85rem", marginTop: "0.25rem", display: "block"}}>{errors.email.message}</span>}
          </div>

          <div className="form-group" style={{ marginBottom: "1.5rem" }}>
            <label htmlFor="password">Password</label>
            <input type="password" id="password" {...register("password")} className={`form-input ${errors.password ? "error" : ""}`} placeholder="••••••••" />
            {errors.password && <span className="error-message" style={{color: "var(--color-error)", fontSize: "0.85rem", marginTop: "0.25rem", display: "block"}}>{errors.password.message}</span>}
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: "100%" }} disabled={!isDirty || !isValid || isSubmitting}>
            {isSubmitting ? "Processing..." : (isLogin ? "Sign In" : "Register")}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "1.5rem", fontSize: "0.9rem", color: "var(--color-dark-gray)" }}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button type="button" onClick={toggleMode} style={{ background: "none", border: "none", color: "var(--color-primary)", textDecoration: "underline", cursor: "pointer", fontSize: "0.9rem" }}>
            {isLogin ? "Register here" : "Sign in here"}
          </button>
        </p>
      </div>
    </div>
  );
};
