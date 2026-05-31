import { useState } from "react";
import { LogOut, User, Mail, Phone, MapPin, Package } from "lucide-react";
import PageFrame from "../components/PageFrame";
import { Button, Panel } from "../lib/ui";
import SEO from "../components/SEO";
import { useAuth } from "../context/AuthContext";
import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";
import ForgotPasswordForm from "../components/ForgotPasswordForm";

export default function AccountPage() {
  const { isLoggedIn, user, login, register, logout } = useAuth();
  
  // Local form states
  const [activeForm, setActiveForm] = useState("login"); // login, register, forgot
  const [userEmail, setUserEmail] = useState(""); // For forgot password form email tracking
  
  // Simulated orders
  const simulatedOrders = [
    { id: "SRT-876124", date: "May 31, 2026", status: "processing", total: 1350 },
    { id: "SRT-982161", date: "May 24, 2026", status: "delivered", total: 2400 },
    { id: "SRT-321568", date: "April 10, 2026", status: "delivered", total: 950 }
  ];

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
              {simulatedOrders.map((ord) => (
                <div key={ord.id} className="order-row">
                  <div className="order-meta">
                    <span className="order-id">{ord.id}</span>
                    <span className="order-date">Placed on {ord.date}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
                    <strong style={{ fontSize: "1rem" }}>৳{ord.total}</strong>
                    <span className={["order-status", ord.status].filter(Boolean).join(" ")}>
                      {ord.status}
                    </span>
                  </div>
                </div>
              ))}
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
