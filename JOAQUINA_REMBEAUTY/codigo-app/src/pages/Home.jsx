import { useState, useEffect, useRef } from "react";
import { useOutletContext, Link } from "react-router-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export const Home = () => {
  const { addToCart } = useOutletContext();
  const [filter, setFilter] = useState("all");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const mapRef = useRef(null);
  const mapInstance = useRef(null);

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

  // Initialize Map
  useEffect(() => {
    if (!mapRef.current) return;
    if (mapInstance.current) return;

    mapInstance.current = L.map(mapRef.current, {
      center: [-34.9011, -56.1645],
      zoom: 12,
      scrollWheelZoom: false
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapInstance.current);

    const locations = [
      { name: "r.e.m. beauty - Punta Carretas Pop-Up", coords: [-34.9229, -56.1583], details: "Punta Carretas Shopping, Level 2" },
      { name: "r.e.m. beauty - Montevideo Shopping", coords: [-34.9038, -56.1362], details: "Montevideo Shopping, Ground Floor" },
      { name: "r.e.m. beauty - Carrasco Boutique", coords: [-34.8887, -56.0567], details: "Av. Alfredo Arocena 1640" }
    ];

    const customIcon = L.divIcon({
      html: `<div style="
        background-color: #b19cd9;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        border: 2px solid white;
        box-shadow: 0 0 6px rgba(0,0,0,0.3);
      "></div>`,
      className: 'custom-map-marker',
      iconSize: [16, 16],
      iconAnchor: [8, 8]
    });

    locations.forEach(loc => {
      L.marker(loc.coords, { icon: customIcon })
        .addTo(mapInstance.current)
        .bindPopup(`
          <div style="font-family: 'Inter', sans-serif; color: #333; padding: 4px;">
            <strong style="color: #7b6ba1; display: block; margin-bottom: 2px; font-size: 0.95rem;">${loc.name}</strong>
            <span style="font-size: 0.8rem; color: #666;">${loc.details}</span>
          </div>
        `);
    });

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [loading]);

  const filteredProducts = filter === "all" 
    ? products 
    : products.filter(p => p.category === filter);

  return (
    <>
      {/* Hero Banner */}
      <section className="hero-image-banner fade-in">
        <img src="/img/logorem_Mesa de trabajo 1.png" alt="r.e.m. beauty logo" className="hero-brand-logo" id="heroLogo" />
      </section>

      {/* Main Content */}
      <main className="container page-wrapper">
        <div className="fade-in">
          <section className="split-banner">
            <div className="split-card split-text-card">
              <h2>The Beauty of<br/>everyday artistry.</h2>
              <p>An invitation to express yourself through beauty and beyond.</p>
              <Link to="/shop" className="btn btn-purple">Shop now</Link>
            </div>
            <div className="split-card split-image-card" style={{backgroundImage: "url('/img/header.jpg')"}}></div>
          </section>

          <section id="best-sellers">
            <div style={{ textAlign: "center", marginBottom: "3rem" }}>
              <h2 className="section-title" style={{ marginBottom: "1rem" }}>Best Sellers & Shop</h2>
              <p style={{ color: "var(--color-dark-gray)", maxWidth: "600px", margin: "0 auto 2rem auto" }}>
                Discover our full collection of makeup for eyes, lips, and face. Use the filters below to find exactly what you're looking for.
              </p>
              
              <div className="filter-group" style={{ display: "flex", justifyContent: "center", gap: "1rem", flexWrap: "wrap" }}>
                <button className={`filter-btn ${filter === "all" ? "active" : ""}`} onClick={() => setFilter("all")}>All</button>
                <button className={`filter-btn ${filter === "eyes" ? "active" : ""}`} onClick={() => setFilter("eyes")}>Eyes</button>
                <button className={`filter-btn ${filter === "lip" ? "active" : ""}`} onClick={() => setFilter("lip")}>Lip</button>
                <button className={`filter-btn ${filter === "face" ? "active" : ""}`} onClick={() => setFilter("face")}>Face</button>
              </div>
            </div>

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

          <section style={{ marginBottom: "2rem" }}>
            <h2 className="section-title">Find Us</h2>
            <p style={{ textAlign: "center", color: "var(--color-dark-gray)", marginBottom: "2rem" }}>
              Visit our official pop-ups and boutiques to try the r.e.m. beauty collection in person.
            </p>
            <div 
              ref={mapRef} 
              id="map-container"
              style={{ 
                height: "400px", 
                borderRadius: "var(--radius-card)", 
                border: "1px solid var(--color-gray)", 
                boxShadow: "var(--shadow-md)",
                overflow: "hidden",
                zIndex: 10
              }}
            ></div>
          </section>
        </div>
      </main>
    </>
  );
};
