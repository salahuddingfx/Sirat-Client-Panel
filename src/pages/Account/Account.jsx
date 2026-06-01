import { useEffect, useState } from "react";
import { LogOut, User, Mail, Phone, MapPin, Package, Edit2, Plus, Trash2, Check, Camera } from "lucide-react";
import PageFrame from "../../components/layout/PageFrame";
import { Button, Panel } from "../../components/ui";
import SEO from "../../components/layout/SEO";
import { useAuth } from "../../app/providers/AuthContext";
import LoginForm from "../../features/auth/LoginForm";
import RegisterForm from "../../features/auth/RegisterForm";
import ForgotPasswordForm from "../../features/auth/ForgotPasswordForm";
import { fetchMyOrders } from "../../api/queries";
import { updateProfile as apiUpdateProfile } from "../../api/queries";

export default function AccountPage() {
  const { isLoggedIn, user, login, register, updateProfile, logout } = useAuth();
  const [orders, setOrders] = useState([]);
  
  // Local form states
  const [activeForm, setActiveForm] = useState("login"); // login, register, forgot
  const [userEmail, setUserEmail] = useState(""); 

  // Dashboard states
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({ name: "", phone: "", username: "" });
  const [isUpdating, setIsUpdating] = useState(false);

  // Avatar states
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

  // Address states
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressForm, setProfileAddressForm] = useState({ street: "", city: "", zipCode: "", country: "Bangladesh", isDefault: false });
  
  useEffect(() => {
    if (isLoggedIn) {
      const token = localStorage.getItem("sirat_token");
      fetchMyOrders(token).then(res => {
        if (res.success) setOrders(res.data);
      });
      setProfileForm({ 
          name: user?.name || "", 
          phone: user?.phone || "", 
          username: user?.username || "" 
      });
    const { isLoggedIn, user, login, register, updateProfile, logout, triggerToast } = useAuth();
    // ... (rest of states)

    const handleUpdateProfile = async (e) => {
      e.preventDefault();
      setIsUpdating(true);

      try {
          const formData = new FormData();
          formData.append("name", profileForm.name);
          formData.append("username", profileForm.username);
          formData.append("phone", profileForm.phone);
          if (avatarFile) {
              formData.append("avatar", avatarFile);
          }

          const res = await updateProfile(formData);
          if (res.success) {
              setIsEditingProfile(false);
              setAvatarFile(null);
              setAvatarPreview(null);
              triggerToast("Profile updated successfully!", "success");
          } else {
              triggerToast(res.message, "error");
          }
      } catch (err) {
          console.error(err);
          triggerToast("Failed to update profile", "error");
      } finally {
          setIsUpdating(false);
      }
    };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
        setAvatarFile(file);
        setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    const updatedAddresses = [...(user.addresses || []), addressForm];
    if (addressForm.isDefault) {
        updatedAddresses.forEach(a => a.isDefault = false);
        updatedAddresses[updatedAddresses.length - 1].isDefault = true;
    }
    const res = await updateProfile({ addresses: updatedAddresses });
    if (res.success) {
        setShowAddressForm(false);
        setProfileAddressForm({ street: "", city: "", zipCode: "", country: "Bangladesh", isDefault: false });
    }
    setIsUpdating(false);
  };

  const handleDeleteAddress = async (index) => {
    if (!window.confirm("Delete this address?")) return;
    const updatedAddresses = user.addresses.filter((_, i) => i !== index);
    await updateProfile({ addresses: updatedAddresses });
  };

  const handleSetDefault = async (index) => {
    const updatedAddresses = user.addresses.map((a, i) => ({ ...a, isDefault: i === index }));
    await updateProfile({ addresses: updatedAddresses });
  };

  const handleLogout = () => {
    logout();
    setUserEmail("");
    setActiveForm("login");
  };

  return (
    <PageFrame title={isLoggedIn ? "Account Dashboard" : "Customer Portal"} eyebrow="My Account">
      <SEO title="User Profile" description="Access order history, tracking credentials, and update details." />

      {isLoggedIn ? (
        <div className="dashboard-grid">
          
          <div style={{ display: "grid", gap: "1.5rem" }}>
            {/* Profile Info Card */}
            <Panel className="profile-card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div className="profile-header">
                        <div className="profile-avatar" style={{ position: "relative", overflow: "hidden" }}>
                            {avatarPreview || user?.avatar ? (
                                <img src={avatarPreview || user?.avatar} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                            ) : (
                                user?.name?.charAt(0) || "U"
                            )}
                            
                            {isEditingProfile && (
                                <label style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#fff" }}>
                                    <Camera size={16} />
                                    <input type="file" hidden accept="image/*" onChange={handleAvatarChange} />
                                </label>
                            )}
                        </div>
                        <div className="profile-details">
                            <h3>{user?.name || "User"}</h3>
                            <span className="muted">@{user?.username || "no-username"}</span>
                        </div>
                    </div>
                    {!isEditingProfile && (
                        <button onClick={() => setIsEditingProfile(true)} className="action-circle-btn" style={{ width: "32px", height: "32px" }}>
                            <Edit2 size={14} />
                        </button>
                    )}
                </div>

                <hr className="product-card-modern__divider" style={{ margin: "1rem 0" }} />

                {isEditingProfile ? (
                    <form onSubmit={handleUpdateProfile} style={{ display: "grid", gap: "0.75rem" }}>
                        <div className="form-group">
                            <label style={{ fontSize: "0.75rem", fontWeight: "700" }}>Full Name</label>
                            <input className="form-input" value={profileForm.name} onChange={e => setProfileForm({...profileForm, name: e.target.value})} required />
                        </div>
                        <div className="form-group">
                            <label style={{ fontSize: "0.75rem", fontWeight: "700" }}>Username</label>
                            <input className="form-input" value={profileForm.username} onChange={e => setProfileForm({...profileForm, username: e.target.value})} />
                        </div>
                        <div className="form-group">
                            <label style={{ fontSize: "0.75rem", fontWeight: "700" }}>Phone Number</label>
                            <input className="form-input" value={profileForm.phone} onChange={e => setProfileForm({...profileForm, phone: e.target.value})} />
                        </div>
                        <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
                            <Button type="submit" size="sm" disabled={isUpdating}>{isUpdating ? "Saving..." : "Save Changes"}</Button>
                            <Button type="button" variant="outline" size="sm" onClick={() => setIsEditingProfile(false)}>Cancel</Button>
                        </div>
                    </form>
                ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem", fontSize: "0.88rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--sirat-muted)" }}>
                            <Mail size={14} className="accent" />
                            <span style={{ color: "var(--sirat-text)" }}>{user?.email}</span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--sirat-muted)" }}>
                            <Phone size={14} className="accent" />
                            <span style={{ color: "var(--sirat-text)" }}>{user?.phone || "No phone added"}</span>
                        </div>
                    </div>
                )}

                <Button variant="outline" onClick={handleLogout} style={{ marginTop: "1.5rem", width: "100%", gap: "0.5rem" }}>
                    <LogOut size={14} /> Log Out
                </Button>
            </Panel>

            {/* Address Book Card */}
            <Panel className="profile-card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                    <h3 style={{ margin: 0, fontSize: "1rem" }}><MapPin size={16} className="accent" style={{ verticalAlign: "middle", marginRight: "6px" }} /> Address Book</h3>
                    <button onClick={() => setShowAddressForm(!showAddressForm)} className="action-circle-btn" style={{ width: "28px", height: "28px" }}>
                        {showAddressForm ? <Trash2 size={14} /> : <Plus size={14} />}
                    </button>
                </div>

                {showAddressForm && (
                    <form onSubmit={handleAddAddress} style={{ display: "grid", gap: "0.75rem", marginBottom: "1.5rem", padding: "1rem", background: "var(--sirat-bg-alt)", borderRadius: "8px" }}>
                        <input className="form-input" placeholder="Street Address" value={addressForm.street} onChange={e => setProfileAddressForm({...addressForm, street: e.target.value})} required />
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
                            <input className="form-input" placeholder="City" value={addressForm.city} onChange={e => setProfileAddressForm({...addressForm, city: e.target.value})} required />
                            <input className="form-input" placeholder="Zip" value={addressForm.zipCode} onChange={e => setProfileAddressForm({...addressForm, zipCode: e.target.value})} required />
                        </div>
                        <label style={{ fontSize: "0.8rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                            <input type="checkbox" checked={addressForm.isDefault} onChange={e => setProfileAddressForm({...addressForm, isDefault: e.target.checked})} /> Set as Default
                        </label>
                        <Button type="submit" size="sm" disabled={isUpdating}>Add Address</Button>
                    </form>
                )}

                <div style={{ display: "grid", gap: "0.75rem" }}>
                    {user.addresses?.map((addr, idx) => (
                        <div key={idx} style={{ padding: "0.75rem", border: "1px solid var(--sirat-border)", borderRadius: "8px", position: "relative" }}>
                            {addr.isDefault && <span style={{ position: "absolute", top: "0.5rem", right: "0.5rem", color: "var(--sirat-gold)", fontSize: "0.7rem", fontWeight: "700" }}>DEFAULT</span>}
                            <p style={{ margin: 0, fontSize: "0.85rem", fontWeight: "600" }}>{addr.street}</p>
                            <p style={{ margin: 0, fontSize: "0.8rem", color: "var(--sirat-muted)" }}>{addr.city}, {addr.zipCode}</p>
                            <div style={{ display: "flex", gap: "1rem", marginTop: "0.5rem" }}>
                                {!addr.isDefault && <button onClick={() => handleSetDefault(idx)} style={{ background: "none", border: "none", color: "var(--sirat-gold-soft)", fontSize: "0.75rem", cursor: "pointer", padding: 0 }}>Set Default</button>}
                                <button onClick={() => handleDeleteAddress(idx)} style={{ background: "none", border: "none", color: "var(--sirat-error)", fontSize: "0.75rem", cursor: "pointer", padding: 0 }}>Remove</button>
                            </div>
                        </div>
                    ))}
                    {(!user.addresses || user.addresses.length === 0) && <p className="muted" style={{ fontSize: "0.85rem" }}>No addresses saved yet.</p>}
                </div>
            </Panel>
          </div>

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
                    <strong style={{ fontSize: "1rem" }}>{'\u09F3'}{ord.totalAmount}</strong>
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
