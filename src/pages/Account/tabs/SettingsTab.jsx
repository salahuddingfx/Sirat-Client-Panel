import { useState } from "react";
import { User, Lock, Camera, Trash2, Shield, Bell } from "lucide-react";
import { useAuth } from "../../../app/providers/AuthContext";
import { changePassword as changePasswordApi } from "../../../api/queries";

function Avatar({ src, name, size = 72 }) {
  const [imgError, setImgError] = useState(false);
  const hasValidSrc = src && typeof src === "string" && src.startsWith("http") && !imgError;
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, var(--sirat-gold) 0%, var(--sirat-gold-soft) 100%)", color: "#FFFDFB", fontSize: size * 0.4, fontWeight: 800, flexShrink: 0, border: "3px solid var(--sirat-border)" }}>
      {hasValidSrc ? (
        <img src={src} alt={name || "Avatar"} onError={() => setImgError(true)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      ) : (
        name?.charAt(0)?.toUpperCase() || "U"
      )}
    </div>
  );
}

export default function SettingsTab() {
  const { user, updateProfile, logout } = useAuth();

  // Profile
  const [isEditing, setIsEditing] = useState(false);
  const [profileForm, setProfileForm] = useState({ name: user?.name || "", phone: user?.phone || "", username: user?.username || "" });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [saving, setSaving] = useState(false);

  // Password
  const [showPassword, setShowPassword] = useState(false);
  const [pwForm, setPwForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [changingPw, setChangingPw] = useState(false);

  // Delete
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    const formData = new FormData();
    formData.append("name", profileForm.name);
    formData.append("username", profileForm.username);
    formData.append("phone", profileForm.phone);
    if (avatarFile) formData.append("avatar", avatarFile);
    const res = await updateProfile(formData);
    if (res.success) {
      setIsEditing(false);
      setAvatarFile(null);
      setAvatarPreview(null);
    }
    setSaving(false);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }
    if (pwForm.newPassword.length < 6) {
      alert("Password must be at least 6 characters.");
      return;
    }
    setChangingPw(true);
    const token = localStorage.getItem("sirat_token");
    const res = await changePasswordApi({ currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword }, token);
    if (res.success) {
      alert("Password updated successfully!");
      setShowPassword(false);
      setPwForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } else {
      alert(res.message);
    }
    setChangingPw(false);
  };

  return (
    <div>
      <div className="dash-content-header">
        <h2>Settings</h2>
        <p>Manage your profile, password, and preferences.</p>
      </div>

      <div className="settings-sections">
        {/* Profile */}
        <div className="settings-card">
          <div className="settings-card__header">
            <h3><User size={18} /> Profile</h3>
            {!isEditing && (
              <button className="order-btn" onClick={() => setIsEditing(true)}>Edit</button>
            )}
          </div>

          <div className="settings-avatar-section">
            <Avatar src={avatarPreview || user?.avatar} name={user?.name} size={72} />
            <div className="settings-avatar-upload">
              <label>
                <Camera size={14} /> Change Photo
                <input type="file" hidden accept="image/*" onChange={(e) => {
                  const f = e.target.files[0];
                  if (f) { setAvatarFile(f); setAvatarPreview(URL.createObjectURL(f)); }
                }} />
              </label>
              <span style={{ fontSize: "0.72rem", color: "var(--sirat-muted)" }}>JPG, PNG. Max 2MB.</span>
            </div>
          </div>

          {isEditing ? (
            <form onSubmit={handleSaveProfile} className="settings-form">
              <div className="settings-form__row">
                <div className="form-group">
                  <label style={{ fontSize: "0.78rem", fontWeight: 700 }}>Full Name</label>
                  <input className="form-input" value={profileForm.name} onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label style={{ fontSize: "0.78rem", fontWeight: 700 }}>Username</label>
                  <input className="form-input" value={profileForm.username} onChange={(e) => setProfileForm({ ...profileForm, username: e.target.value })} />
                </div>
              </div>
              <div className="form-group">
                <label style={{ fontSize: "0.78rem", fontWeight: 700 }}>Phone</label>
                <input className="form-input" value={profileForm.phone} onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })} />
              </div>
              <div className="form-group">
                <label style={{ fontSize: "0.78rem", fontWeight: 700 }}>Email</label>
                <input className="form-input" value={user?.email || ""} disabled style={{ opacity: 0.6 }} />
                <span style={{ fontSize: "0.72rem", color: "var(--sirat-muted)" }}>Email cannot be changed.</span>
              </div>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button type="submit" className="order-btn order-btn--primary" disabled={saving}>
                  {saving ? "Saving..." : "Save Changes"}
                </button>
                <button type="button" className="order-btn" onClick={() => { setIsEditing(false); setAvatarFile(null); setAvatarPreview(null); }}>Cancel</button>
              </div>
            </form>
          ) : (
            <div style={{ display: "grid", gap: "0.65rem", fontSize: "0.9rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--sirat-muted)" }}>Name</span>
                <span style={{ fontWeight: 600 }}>{user?.name}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--sirat-muted)" }}>Username</span>
                <span style={{ fontWeight: 600 }}>@{user?.username}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--sirat-muted)" }}>Email</span>
                <span style={{ fontWeight: 600 }}>{user?.email}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--sirat-muted)" }}>Phone</span>
                <span style={{ fontWeight: 600 }}>{user?.phone || "Not set"}</span>
              </div>
            </div>
          )}
        </div>

        {/* Password */}
        <div className="settings-card">
          <div className="settings-card__header">
            <h3><Lock size={18} /> Password</h3>
            {!showPassword && (
              <button className="order-btn" onClick={() => setShowPassword(true)}>Change</button>
            )}
          </div>
          {showPassword ? (
            <form onSubmit={handleChangePassword} className="settings-form">
              <div className="form-group">
                <label style={{ fontSize: "0.78rem", fontWeight: 700 }}>Current Password</label>
                <input className="form-input" type="password" required value={pwForm.currentPassword} onChange={(e) => setPwForm({ ...pwForm, currentPassword: e.target.value })} />
              </div>
              <div className="settings-form__row">
                <div className="form-group">
                  <label style={{ fontSize: "0.78rem", fontWeight: 700 }}>New Password</label>
                  <input className="form-input" type="password" required minLength={6} value={pwForm.newPassword} onChange={(e) => setPwForm({ ...pwForm, newPassword: e.target.value })} />
                </div>
                <div className="form-group">
                  <label style={{ fontSize: "0.78rem", fontWeight: 700 }}>Confirm New Password</label>
                  <input className="form-input" type="password" required minLength={6} value={pwForm.confirmPassword} onChange={(e) => setPwForm({ ...pwForm, confirmPassword: e.target.value })} />
                </div>
              </div>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button type="submit" className="order-btn order-btn--primary" disabled={changingPw}>
                  {changingPw ? "Updating..." : "Update Password"}
                </button>
                <button type="button" className="order-btn" onClick={() => { setShowPassword(false); setPwForm({ currentPassword: "", newPassword: "", confirmPassword: "" }); }}>Cancel</button>
              </div>
            </form>
          ) : (
            <p style={{ margin: 0, fontSize: "0.88rem", color: "var(--sirat-muted)" }}>
              Last changed: Unknown. Keep your account secure with a strong password.
            </p>
          )}
        </div>

        {/* Notifications */}
        <div className="settings-card">
          <div className="settings-card__header">
            <h3><Bell size={18} /> Notifications</h3>
          </div>
          <div style={{ display: "grid", gap: "0.75rem" }}>
            {[
              { label: "Order status updates", desc: "Get notified when your order ships or is delivered.", checked: true },
              { label: "Promotional emails", desc: "Receive offers, new drops, and exclusive deals.", checked: false },
              { label: "SMS notifications", desc: "Get text messages for order tracking.", checked: true },
            ].map((pref, i) => (
              <label key={i} style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", padding: "0.75rem", borderRadius: "10px", border: "1px solid var(--sirat-border)", cursor: "pointer" }}>
                <input type="checkbox" defaultChecked={pref.checked} style={{ width: "16px", height: "16px", accentColor: "var(--sirat-gold)", marginTop: "2px" }} />
                <div>
                  <div style={{ fontSize: "0.88rem", fontWeight: 600 }}>{pref.label}</div>
                  <div style={{ fontSize: "0.78rem", color: "var(--sirat-muted)" }}>{pref.desc}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Danger Zone */}
        <div className="settings-danger">
          <div className="settings-danger__header">
            <Shield size={18} />
            <h3>Danger Zone</h3>
          </div>
          <p>Permanently delete your account and all associated data. This action cannot be undone.</p>
          <button className="settings-danger-btn" onClick={() => setShowDeleteConfirm(true)}>
            <Trash2 size={14} /> Delete Account
          </button>
          {showDeleteConfirm && (
            <div style={{ marginTop: "1rem", padding: "1rem", background: "rgba(239, 68, 68, 0.05)", borderRadius: "10px", border: "1px solid rgba(239, 68, 68, 0.15)" }}>
              <p style={{ margin: "0 0 0.75rem", fontSize: "0.85rem", fontWeight: 600, color: "#dc2626" }}>
                Are you absolutely sure? This will permanently delete your account.
              </p>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button className="settings-danger-btn" style={{ background: "#dc2626", color: "#fff", borderColor: "#dc2626" }}>
                  Yes, delete my account
                </button>
                <button className="order-btn" onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
              </div>
            </div>
          )}
        </div>

        {/* Logout */}
        <button className="order-btn" onClick={logout} style={{ width: "fit-content", gap: "0.5rem" }}>
          Log Out
        </button>
      </div>
    </div>
  );
}
