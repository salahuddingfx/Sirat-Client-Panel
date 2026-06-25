import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { LayoutDashboard, Package, Heart, MapPin, Tag, Settings, LogOut } from "lucide-react";
import PageFrame from "../../components/layout/PageFrame";
import SEO from "../../components/layout/SEO";
import { useAuth } from "../../app/providers/AuthContext";
import LoginForm from "../../features/auth/LoginForm";
import RegisterForm from "../../features/auth/RegisterForm";
import ForgotPasswordForm from "../../features/auth/ForgotPasswordForm";
import { fetchMyOrders } from "../../api/queries";

import OverviewTab from "./tabs/OverviewTab";
import OrdersTab from "./tabs/OrdersTab";
import WishlistTab from "./tabs/WishlistTab";
import AddressesTab from "./tabs/AddressesTab";
import CouponsTab from "./tabs/CouponsTab";
import SettingsTab from "./tabs/SettingsTab";

import "./Account.css";

const TABS = [
  { key: "overview", label: "Overview", icon: LayoutDashboard },
  { key: "orders", label: "Orders", icon: Package },
  { key: "wishlist", label: "Wishlist", icon: Heart },
  { key: "addresses", label: "Addresses", icon: MapPin },
  { key: "coupons", label: "Coupons", icon: Tag },
  { key: "settings", label: "Settings", icon: Settings },
];

function Avatar({ src, name, size = 44, className = "" }) {
  const [imgError, setImgError] = useState(false);
  const hasValidSrc = src && typeof src === "string" && src.startsWith("http") && !imgError;
  return (
    <div className={className} style={{ width: size, height: size, borderRadius: "50%", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, var(--sirat-gold) 0%, var(--sirat-gold-soft) 100%)", color: "#FFFDFB", fontSize: size * 0.4, fontWeight: 800, flexShrink: 0 }}>
      {hasValidSrc ? (
        <img src={src} alt={name || "Avatar"} onError={() => setImgError(true)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      ) : (
        name?.charAt(0)?.toUpperCase() || "U"
      )}
    </div>
  );
}

export default function AccountPage() {
  const { isLoggedIn, user, login, register, logout } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "overview";

  const [orders, setOrders] = useState([]);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [activeForm, setActiveForm] = useState("login");
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    if (isLoggedIn) {
      const token = localStorage.getItem("sirat_token");
      fetchMyOrders(token).then((res) => {
        if (res?.success) setOrders(res.data);
      });
    }
  }, [isLoggedIn]);

  const setTab = (tab) => setSearchParams({ tab });

  const renderTab = () => {
    switch (activeTab) {
      case "overview":
        return <OverviewTab user={user} orders={orders} wishlistCount={wishlistCount} onNavigate={setTab} />;
      case "orders":
        return <OrdersTab orders={orders} />;
      case "wishlist":
        return <WishlistTab />;
      case "addresses":
        return <AddressesTab />;
      case "coupons":
        return <CouponsTab />;
      case "settings":
        return <SettingsTab />;
      default:
        return <OverviewTab user={user} orders={orders} wishlistCount={wishlistCount} onNavigate={setTab} />;
    }
  };

  return (
    <PageFrame title={isLoggedIn ? "Account Dashboard" : "Customer Portal"} eyebrow="My Account">
      <SEO title="User Profile" description="Access order history, tracking credentials, and update details." noindex />

      {isLoggedIn ? (
        <>
          {/* Mobile Tabs */}
          <div className="dash-mobile-tabs">
            {TABS.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                className={`dash-mobile-tab ${activeTab === key ? "dash-mobile-tab--active" : ""}`}
                onClick={() => setTab(key)}
              >
                <Icon size={14} /> {label}
              </button>
            ))}
          </div>

          <div className="dashboard-shell">
            {/* Sidebar */}
            <aside className="dash-sidebar">
              <div className="dash-sidebar__user">
                <Avatar src={user?.avatar} name={user?.name} size={44} />
                <div className="dash-sidebar__user-info">
                  <div className="dash-sidebar__user-name">{user?.name}</div>
                  <div className="dash-sidebar__user-email">@{user?.username}</div>
                </div>
              </div>

              {TABS.map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  className={`dash-nav-item ${activeTab === key ? "dash-nav-item--active" : ""}`}
                  onClick={() => setTab(key)}
                >
                  <Icon size={18} />
                  {label}
                  {key === "orders" && orders.length > 0 && (
                    <span className="dash-nav-item__badge">{orders.length}</span>
                  )}
                </button>
              ))}

              <div className="dash-sidebar__logout">
                <button className="dash-nav-item" onClick={logout}>
                  <LogOut size={18} /> Log Out
                </button>
              </div>
            </aside>

            {/* Content */}
            <main className="dash-content">
              {renderTab()}
            </main>
          </div>
        </>
      ) : (
        <div className="auth-container">
          {activeForm === "login" && (
            <LoginForm
              onLogin={login}
              onForgotPassword={(email) => { setUserEmail(email); setActiveForm("forgot"); }}
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
