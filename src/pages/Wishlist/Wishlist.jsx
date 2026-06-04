import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart, ArrowLeft, ShoppingCart, Trash2 } from "lucide-react";
import PageFrame from "@components/layout/PageFrame";
import { Button, Panel } from "@components/ui";
import SEO from "@components/layout/SEO";
import { useAuth } from "@app/providers/AuthContext";
import { useCart } from "@app/providers/CartContext";
import { fetchWishlist, removeFromWishlistApi } from "@api/queries";

export default function WishlistPage() {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const { addToCart } = useCart();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn) {
      setLoading(false);
      return;
    }
    const token = localStorage.getItem("sirat_token");
    fetchWishlist(token).then(res => {
      if (res.success) setItems(res.data || []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [isLoggedIn]);

  const handleRemove = async (productId) => {
    const token = localStorage.getItem("sirat_token");
    await removeFromWishlistApi(productId, token);
    setItems(prev => prev.filter(i => i.product.id !== productId));
  };

  const handleAddToCart = (item) => {
    const variant = item.product.variants?.[0] || { id: "default", label: "M", priceDelta: 0, stock: 0 };
    addToCart(item.product, variant, 1);
  };

  return (
    <PageFrame title="My Wishlist" eyebrow="Wishlist">
      <SEO title="Wishlist" description="View your saved favorite items." noindex />

      {!isLoggedIn ? (
        <Panel className="shop-empty-state" style={{ padding: "4rem 2rem", textAlign: "center" }}>
          <Heart size={48} style={{ margin: "0 auto 1.5rem", color: "var(--sirat-gold)" }} />
          <h3>Log in to see your wishlist</h3>
          <p className="page-section__text" style={{ maxWidth: "450px", margin: "0.5rem auto 1.5rem" }}>
            Sign in to save and manage your favorite items.
          </p>
          <Button onClick={() => navigate("/account")}>Go to Account</Button>
        </Panel>
      ) : loading ? (
        <Panel style={{ padding: "4rem 2rem", textAlign: "center" }}>
          <p>Loading wishlist...</p>
        </Panel>
      ) : items.length === 0 ? (
        <Panel className="shop-empty-state" style={{ padding: "4rem 2rem", textAlign: "center" }}>
          <Heart size={48} style={{ margin: "0 auto 1.5rem", color: "var(--sirat-gold)" }} />
          <h3>Your wishlist is empty</h3>
          <p className="page-section__text" style={{ maxWidth: "450px", margin: "0.5rem auto 1.5rem" }}>
            Browse our collection and save items you love.
          </p>
          <Button onClick={() => navigate("/shop")}>Browse Shop</Button>
        </Panel>
      ) : (
        <div className="wishlist-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "1.5rem" }}>
          {items.map((item) => (
            <Panel key={item.wishlistId} className="wishlist-item" style={{ padding: "1rem" }}>
              <div style={{ position: "relative", marginBottom: "0.75rem" }}>
                <img
                  src={item.product.images?.[0] || item.product.image}
                  alt={item.product.name}
                  style={{ width: "300px", height: "300px", maxWidth: "100%", objectFit: "cover", borderRadius: "8px", display: "block", margin: "0 auto" }}
                  onClick={() => navigate(`/product/${item.product.slug}`)}
                />
                <button
                  onClick={() => handleRemove(item.product.id)}
                  style={{ position: "absolute", top: "0.5rem", right: "0.5rem", background: "rgba(0,0,0,0.6)", border: "none", borderRadius: "50%", width: "32px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#fff" }}
                  title="Remove from wishlist"
                >
                  <Trash2 size={14} />
                </button>
              </div>
              <Link to={`/product/${item.product.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
                <div style={{ fontSize: "0.78rem", opacity: 0.6, marginBottom: "0.2rem" }}>{item.product.category?.name || item.product.category}</div>
                <h4 style={{ margin: "0 0 0.25rem", fontSize: "0.95rem" }}>{item.product.name}</h4>
                <div style={{ fontWeight: 700, fontSize: "1rem", color: "var(--sirat-gold-soft)" }}>
                  {'\u09F3'}{(item.product.discountedPrice || item.product.price)}
                  {item.product.oldPrice && <span className="old-price" style={{ marginLeft: "0.5rem", fontSize: "0.8rem" }}>{'\u09F3'}{item.product.oldPrice}</span>}
                </div>
              </Link>
              <Button size="sm" style={{ width: "100%", marginTop: "0.75rem" }} onClick={() => handleAddToCart(item)}>
                <ShoppingCart size={14} style={{ marginRight: "6px" }} /> Add to Cart
              </Button>
            </Panel>
          ))}
        </div>
      )}
    </PageFrame>
  );
}
