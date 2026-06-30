import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";

export const Shop = () => {
  const { addToCart } = useOutletContext();
  const [filter, setFilter] = useState("all");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("https://creacionaplicaciones.onrender.com/api/productos", {
          method: "GET",
          headers: {
            "x-project-key": "grupo-12"
          }
        });
        if (res.status === 200) {
          const data = await res.json();
          const mapped = (data.items || []).map(item => ({
            id: item.id,
            ...item.data
          }));
          setProducts(mapped);
        } else {
          setError("Could not load products from API.");
        }
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Connection error while fetching products.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = filter === "all" 
    ? products 
    : products.filter(p => p.category === filter);

  return (
    <main className="container page-wrapper" style={{ paddingTop: "8rem" }}>
      <div className="fade-in">
        <section className="shop-header" style={{ textAlign: "center", marginBottom: "3rem" }}>
          <h1 className="section-title" style={{ marginBottom: "1rem" }}>Shop All</h1>
          <p style={{ color: "var(--color-dark-gray)", maxWidth: "600px", margin: "0 auto 2rem auto" }}>
            Discover our full collection of makeup for eyes, lips, and face. Use the filters below to find exactly what you're looking for.
          </p>
          
          <div className="filter-group" style={{ display: "flex", justifyContent: "center", gap: "1rem", flexWrap: "wrap" }}>
            <button className={`filter-btn ${filter === "all" ? "active" : ""}`} onClick={() => setFilter("all")}>All</button>
            <button className={`filter-btn ${filter === "eyes" ? "active" : ""}`} onClick={() => setFilter("eyes")}>Eyes</button>
            <button className={`filter-btn ${filter === "lip" ? "active" : ""}`} onClick={() => setFilter("lip")}>Lip</button>
            <button className={`filter-btn ${filter === "face" ? "active" : ""}`} onClick={() => setFilter("face")}>Face</button>
          </div>
        </section>

        <section id="shop-products">
          {loading ? (
            <div style={{ textAlign: "center", padding: "4rem 0" }}>
              <div className="spinner" style={{ border: "4px solid var(--color-gray)", borderTop: "4px solid var(--color-primary)", borderRadius: "50%", width: "40px", height: "40px", margin: "0 auto 1rem auto", animation: "spin 1s linear infinite" }}></div>
              <p style={{ color: "var(--color-dark-gray)" }}>Loading collection...</p>
              <style>{`
                @keyframes spin {
                  0% { transform: rotate(0deg); }
                  100% { transform: rotate(360deg); }
                }
              `}</style>
            </div>
          ) : error ? (
            <div style={{ textAlign: "center", padding: "4rem 0", color: "#cc0000" }}>
              <p>{error}</p>
            </div>
          ) : (
            <div className="product-grid">
              {filteredProducts.map(product => (
                <div className="product-card" key={product.id}>
                  <div className="product-image-container">
                    <img src={product.image} alt={product.name} className="product-image" />
                  </div>
                  <div className="product-info">
                    <h3 className="product-name">{product.name}</h3>
                    <p className="product-desc">{product.description}</p>
                    <div className="product-footer">
                      <span className="product-price">${product.price.toFixed(2)}</span>
                      <button onClick={() => addToCart(product)} className="btn btn-primary">Add to cart</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
};
