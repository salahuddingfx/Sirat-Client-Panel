import { useEffect } from "react";
import { LogOut, User, Mail, Phone, MapPin, Package } from "lucide-react";
import PageFrame from "../../components/layout/PageFrame";
import { Button, Panel } from "../../components/ui";
import SEO from "../../components/layout/SEO";
import { useAuth } from "../../app/providers/AuthContext";
import LoginForm from "../../features/auth/LoginForm";
import RegisterForm from "../../features/auth/RegisterForm";
import ForgotPasswordForm from "../../features/auth/ForgotPasswordForm";
import { fetchMyOrders } from "../../api/queries";

export default function AccountPage() {
  const { isLoggedIn, user, login, register, logout } = useAuth();
  const [orders, setOrders] = useState([]);
  
  // Local form states
  const [activeForm, setActiveForm] = useState("login"); // login, register, forgot
  const [userEmail, setUserEmail] = useState(""); // For forgot password form email tracking
  
  useEffect(() => {
    if (isLoggedIn) {
      const token = localStorage.getItem("sirat_token");
      fetchMyOrders(token).then(res => {
        if (res.success) setOrders(res.data);
      });
    }
  }, [isLoggedIn]);

  const handleLogout = () => {
    logout();
    setUserEmail("");
    setActiveForm("login");
  };

  return (
    <PageFrame title={isLoggedIn ? "Account Dashboard" : "Customer Portal"} eyebrow="My Account">
      <SEO title="User Profile" description="Access order history, tracking credentials, and update details." />

      {isLoggedIn ? (
        /* USER DASHBOARD PANEL */
        <div className="dashboard-grid">
          
          {/* Left profile info card */}
          <Panel className="profile-card">
            <div className="profile-header">
              <div className="profile-avatar">
                {user?.name?.charAt(0) || "U"}
              </div>
              <div className="profile-details">
                <h3>{user?.name || "Premium User"}</h3>
                <span>Premium Customer</span>
              </div>
            </div>

            <hr className="product-card-modern__divider" style={{ margin: "0.5rem 0" }} />

            <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem", fontSize: "0.88rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--sirat-muted)" }}>
                <Mail size={14} className="accent" />
                <span style={{ color: "var(--sirat-text)" }}>{user?.email || "salahuddin@sirat.com"}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--sirat-muted)" }}>
                <Phone size={14} className="accent" />
                <span style={{ color: "var(--sirat-text)" }}>{user?.phone || "+880 1711-223344"}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--sirat-muted)" }}>
                <MapPin size={14} className="accent" />
                <span style={{ color: "var(--sirat-text)" }}>House 24, Road 5, Banani, Dhaka</span>
              </div>
            </div>

            <Button 
              variant="outline" 
              onClick={handleLogout} 
              style={{ marginTop: "1rem", display: "inline-flex", width: "100%", justifyContent: "center", gap: "0.5rem" }}
            >
              <LogOut size={14} /> Log Out
            </Button>
          </Panel>

          {/* Right Orders List panel */}
          <div className="dashboard-section">
            <h3 style={{ margin: "0 0 1rem" }}>
              <Package size={18} style={{ marginRight: "6px", verticalAlign: "middle", color: "var(--sirat-gold)" }} /> 
              Recent Purchases
            </h3>
            
            <div className="orders-list">
              {orders.map((ord) => (
                <div key={ord._id} className="order-row">
                  <div className="order-meta">
                    <span className="order-id">{ord.orderId}</span>
                    <span className="order-date">Placed on {new Date(ord.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
                    <strong style={{ fontSize: "1rem" }}>৳{ord.totalAmount}</strong>
                    <span className={["order-status", ord.status].filter(Boolean).join(" ")}>
                      {ord.status}
                    </span>
                  </div>
                </div>
              ))}
              {orders.length === 0 && <p className="muted">No orders found.</p>}
            </div>
          </div>

        </div>
      ) : (
        /* AUTHENTICATION FORMS VIEW */
        <div className="auth-container">
          {activeForm === "login" && (
            <LoginForm 
              onLogin={login} 
              onForgotPassword={(email) => { 
                setUserEmail(email); 
                setActiveForm("forgot"); 
              }} 
              onToggleRegister={() => setActiveForm("register")} 
            />
          )}

          {activeForm === "register" && (
            <RegisterForm 
              onRegister={register} 
              onToggleLogin={() => setActiveForm("login")} 
            />
          )}

          {activeForm === "forgot" && (
            <ForgotPasswordForm 
              initialEmail={userEmail} 
              onToggleLogin={() => setActiveForm("login")} 
            />
          )}
        </div>
      )}
    </PageFrame>
  );
}
