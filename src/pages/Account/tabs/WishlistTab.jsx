import { useState, useEffect } from "react";
import { Heart, ShoppingCart, Trash2, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { fetchWishlist, removeFromWishlistApi } from "../../../api/queries";
import { useAuth } from "../../../app/providers/AuthContext";
import { useCart } from "../../../app/providers/CartContext";

export default function WishlistTab() {
  const { token } = useAuth();
  const { addItem } = useCart();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetchWishlist(token);
        if (res?.success && Array.isArray(res.data)) {
          setItems(res.data.map((w) => w.product || w));
        }
      } catch (e) {
        console.error("Wishlist load error:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, [token]);

  const handleRemove = async (productId) => {
    try {
      const res = await removeFromWishlistApi(productId, token);
      if (res?.success) {
        setItems((prev) => prev.filter((p) => (p._id || p.id) !== productId));
      }
    } catch (e) {
      console.error("Remove error:", e);
    }
  };

  const handleAddToCart = (product) => {
    addItem({
      productId: product._id || product.id,
      name: product.name,
      price: product.salePrice || product.price,
      image: product.images?.[0] || product.image,
      size: product.sizes?.[0] || "M",
      quantity: 1,
    });
    navigate("/cart");
  };

  if (loading) {
    return <div className="dash-spinner" />;
  }

  return (
    <div>
      <div className="dash-content-header">
        <h2>Wishlist</h2>
        <p>Products you've saved for later.</p>
      </div>

      <div className="wishlist-grid">
        {items.map((product) => {
          const id = product._id || product.id;
          return (
            <div key={id} className="wishlist-card">
              <div className="wishlist-card__img">
                <img
                  src={product.images?.[0] || product.image || "/placeholder.png"}
                  alt={product.name}
                  onClick={() => navigate(`/product/${product.slug || id}`)}
                  style={{ cursor: "pointer" }}
                />
              </div>
              <div className="wishlist-card__body">
                <div className="wishlist-card__name">{product.name}</div>
                <div className="wishlist-card__price">
                  {'\u09F3'}{product.salePrice || product.price}
                </div>
                <div className="wishlist-card__actions">
                  <button className="wishlist-btn wishlist-btn--cart" onClick={() => handleAddToCart(product)}>
                    <ShoppingCart size={14} /> Add
                  </button>
                  <button className="wishlist-btn" onClick={() => navigate(`/product/${product.slug || id}`)}>
                    <Eye size={14} />
                  </button>
                  <button className="wishlist-btn wishlist-btn--remove" onClick={() => handleRemove(id)}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {items.length === 0 && (
          <div className="dash-empty" style={{ gridColumn: "1 / -1" }}>
            <Heart size={40} strokeWidth={1.2} />
            <h4>Your wishlist is empty</h4>
            <p>Browse the shop and save items you love.</p>
          </div>
        )}
      </div>
    </div>
  );
}
