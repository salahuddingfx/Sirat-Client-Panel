import { useEffect, useState } from "react";
import { LogOut, User, Mail, Phone, MapPin, Package, Edit2, Plus, Trash2, Camera } from "lucide-react";
import PageFrame from "../../components/layout/PageFrame";
import { Button, Panel } from "../../components/ui";
import SEO from "../../components/layout/SEO";
import { useAuth } from "../../app/providers/AuthContext";
import LoginForm from "../../features/auth/LoginForm";
import RegisterForm from "../../features/auth/RegisterForm";
import ForgotPasswordForm from "../../features/auth/ForgotPasswordForm";
import { fetchMyOrders } from "../../api/queries";

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
    }
  }, [isLoggedIn, user]);

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
        } else {
            alert(res.message);
        }
    } catch (err) {
        console.error(err);
        alert("Failed to update profile");
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
                    <form onSubmit={handleAddAddress} className="address-form">
                        <input className="form-input" placeholder="Street Address" value={addressForm.street} onChange={e => setProfileAddressForm({...addressForm, street: e.target.value})} required />
                        <div className="address-form__row">
                            <input className="form-input" placeholder="City" value={addressForm.city} onChange={e => setProfileAddressForm({...addressForm, city: e.target.value})} required />
                            <input className="form-input" placeholder="Zip" value={addressForm.zipCode} onChange={e => setProfileAddressForm({...addressForm, zipCode: e.target.value})} required />
                        </div>
                        <label className="address-form__checkbox">
                            <input type="checkbox" checked={addressForm.isDefault} onChange={e => setProfileAddressForm({...addressForm, isDefault: e.target.checked})} /> Set as Default
                        </label>
                        <div className="address-form__actions">
                            <Button type="submit" size="sm" disabled={isUpdating}>Add Address</Button>
                        </div>
                    </form>
                )}

                <div style={{ display: "grid", gap: "0.75rem" }}>
                    {user.addresses?.map((addr, idx) => (
                        <div key={idx} className="address-item">
                            {addr.isDefault && <span className="address-item__default-badge">DEFAULT</span>}
                            <p className="address-item__street">{addr.street}</p>
                            <p className="address-item__city">{addr.city}, {addr.zipCode}</p>
                            <div className="address-item__actions">
                                {!addr.isDefault && <button onClick={() => handleSetDefault(idx)} className="address-item__btn address-item__btn--default">Set Default</button>}
                                <button onClick={() => handleDeleteAddress(idx)} className="address-item__btn address-item__btn--remove">Remove</button>
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
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.25rem" }}>
                      <strong style={{ fontSize: "1rem" }}>{'\u09F3'}{ord.totalAmount}</strong>
                      <span style={{ fontSize: "0.7rem", color: ord.paymentStatus === 'approved' ? 'var(--sirat-success)' : 'var(--sirat-gold-soft)' }}>
                        {ord.paymentStatus === 'approved' ? 'Paid' : 'Unpaid'}
                      </span>
                    </div>
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
