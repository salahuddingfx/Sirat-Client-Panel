import { NavLink } from "react-router-dom";
import { Home, Compass, Truck, ShoppingCart, User } from "lucide-react";
import { useCart } from "../../app/providers/CartContext";

export default function BottomNav() {
  const { cartCount, setCartDrawerOpen } = useCart();

  const handleCartClick = (e) => {
    e.preventDefault();
    setCartDrawerOpen(true);
  };

  return (
    <div className="mobile-bottom-nav">
      <NavLink
        to="/"
        className={({ isActive }) => 
          `mobile-bottom-nav__item ${isActive ? "active" : ""}`
        }
      >
        <Home size={20} />
        <span className="mobile-bottom-nav__label">Home</span>
      </NavLink>

      <NavLink
        to="/shop"
        className={({ isActive }) => 
          `mobile-bottom-nav__item ${isActive ? "active" : ""}`
        }
      >
        <Compass size={20} />
        <span className="mobile-bottom-nav__label">Shop</span>
      </NavLink>

      <NavLink
        to="/track"
        className={({ isActive }) => 
          `mobile-bottom-nav__item ${isActive ? "active" : ""}`
        }
      >
        <Truck size={20} />
        <span className="mobile-bottom-nav__label">Track</span>
      </NavLink>

      <button
        type="button"
        onClick={handleCartClick}
        className="mobile-bottom-nav__item mobile-bottom-nav__btn"
      >
        <div className="mobile-bottom-nav__icon-wrapper">
          <ShoppingCart size={20} />
          {cartCount > 0 && (
            <span className="mobile-bottom-nav__badge">{cartCount}</span>
          )}
        </div>
        <span className="mobile-bottom-nav__label">Cart</span>
      </button>

      <NavLink
        to="/account"
        className={({ isActive }) => 
          `mobile-bottom-nav__item ${isActive ? "active" : ""}`
        }
      >
        <User size={20} />
        <span className="mobile-bottom-nav__label">Account</span>
      </NavLink>
    </div>
  );
}
