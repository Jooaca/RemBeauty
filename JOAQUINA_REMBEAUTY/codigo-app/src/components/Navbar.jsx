import { NavLink } from "react-router-dom";
import { ShoppingCart, User, LogOut } from "lucide-react";

export const Navbar = ({ cartCount, user, onLogout }) => {
  return (
    <nav className="navbar" style={{ 
      position: 'sticky', 
      top: 0, 
      backgroundColor: 'rgba(255, 255, 255, 0.85)', 
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      borderBottom: '1px solid var(--color-gray)',
      zIndex: 1000,
      width: '100%'
    }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <NavLink to="/" className="navbar-logo">r.e.m. beauty</NavLink>
        
        {user && (
          <div className="navbar-links" style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
            <NavLink to="/" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Home</NavLink>
            <NavLink to="/shop" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Shop</NavLink>
            
            <NavLink to="/cart" className="nav-icon" style={{ position: 'relative', color: 'inherit' }}>
              <ShoppingCart size={24} />
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </NavLink>
            
            <NavLink to="/profile" className="nav-icon" style={{ color: 'inherit' }} title="Profile">
              <User size={24} />
            </NavLink>
            
            <button 
              onClick={onLogout} 
              className="btn-icon" 
              style={{ color: 'inherit', background: 'none', border: 'none', padding: 0, display: 'flex', alignItems: 'center', cursor: 'pointer' }} 
              title="Logout"
            >
              <LogOut size={24} />
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};
