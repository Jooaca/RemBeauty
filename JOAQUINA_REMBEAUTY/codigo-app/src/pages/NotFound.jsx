import { Link } from "react-router-dom";

export const NotFound = () => {
  return (
    <main className="container page-wrapper" style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", paddingTop: "8rem" }}>
      <div className="fade-in" style={{ textAlign: "center", padding: "3rem", background: "var(--color-light-gray)", borderRadius: "var(--radius-card)", maxWidth: "500px", border: "1px solid var(--color-gray)" }}>
        <h1 style={{ fontSize: "5rem", color: "var(--color-primary)", fontWeight: "600", margin: 0 }}>404</h1>
        <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>Page Not Found</h2>
        <p style={{ color: "var(--color-dark-gray)", marginBottom: "2rem" }}>
          The page you are looking for does not exist or has been moved.
        </p>
        <Link to="/" className="btn btn-primary">
          Back to Home
        </Link>
      </div>
    </main>
  );
};
