import { useState } from "react";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import Joi from "joi";
import { useOutletContext, Link, useNavigate, Navigate } from "react-router-dom";

const registerSchema = Joi.object({
  name: Joi.string().min(3).required().messages({
    "string.empty": "Name is required.",
    "string.min": "Name must be at least 3 characters."
  }),
  email: Joi.string().email({ tlds: { allow: false } }).required().messages({
    "string.empty": "Email is required.",
    "string.email": "Must be a valid email address."
  }),
  password: Joi.string().min(6).required().messages({
    "string.empty": "Password is required.",
    "string.min": "Password must be at least 6 characters."
  })
});

export const Register = () => {
  const { user, login } = useOutletContext();
  const [apiError, setApiError] = useState("");
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors, isValid, isDirty, isSubmitting } } = useForm({
    resolver: joiResolver(registerSchema),
    mode: "onChange"
  });

  // If already logged in, redirect to home
  if (user) {
    return <Navigate to="/" replace />;
  }

  const onSubmit = async (data) => {
    setApiError("");
    try {
      const res = await fetch("https://creacionaplicaciones.onrender.com/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-project-key": "grupo-12"
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
          data: {
            nombre: data.name
          }
        })
      });

      if (res.status === 201) {
        const responseData = await res.json();
        login(responseData.user, responseData.token);
        navigate("/");
      } else if (res.status === 409) {
        setApiError("This email address is already registered.");
      } else {
        const errorData = await res.json().catch(() => ({}));
        setApiError(errorData.error || "An error occurred during registration.");
      }
    } catch (err) {
      console.error(err);
      setApiError("Server connection error. Please try again later.");
    }
  };

  return (
    <main className="container page-wrapper" style={{ paddingTop: "6rem" }}>
      <div className="auth-container fade-in">
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <img src="/img/logorem_Mesa de trabajo 1.png" alt="r.e.m. beauty logo" style={{ height: "40px", marginBottom: "1rem" }} />
          <h2 style={{ fontSize: "1.5rem" }}>Create Account</h2>
          <p style={{ color: "var(--color-dark-gray)", fontSize: "0.9rem" }}>
            Fill in the form to create your account
          </p>
        </div>

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
            <label className="form-label" htmlFor="name">Full Name</label>
            <input 
              type="text" 
              id="name" 
              className={`form-input ${errors.name ? "error" : ""}`} 
              placeholder="Jane Doe"
              {...register("name")}
            />
            {errors.name && <span className="form-error">{errors.name.message}</span>}
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

          <div className="form-group" style={{ marginBottom: "2rem" }}>
            <label className="form-label" htmlFor="password">Password</label>
            <input 
              type="password" 
              id="password" 
              className={`form-input ${errors.password ? "error" : ""}`} 
              placeholder="••••••••"
              {...register("password")}
            />
            {errors.password && <span className="form-error">{errors.password.message}</span>}
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: "100%" }} 
            disabled={!isDirty || !isValid || isSubmitting}
          >
            {isSubmitting ? "Registering..." : "Register"}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "1.5rem", fontSize: "0.9rem", color: "var(--color-dark-gray)" }}>
          Already have an account?{" "}
          <Link to="/login" style={{ color: "var(--color-primary)", textDecoration: "underline", fontWeight: "500" }}>
            Sign in here
          </Link>
        </p>
      </div>
    </main>
  );
};
