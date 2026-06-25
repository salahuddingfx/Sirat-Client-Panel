import { useState } from "react";
import { MapPin, Plus, Edit2, Trash2, Star, X, Check } from "lucide-react";
import { useAuth } from "../../../app/providers/AuthContext";

export default function AddressesTab() {
  const { user, updateProfile } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ street: "", city: "", zipCode: "", country: "Bangladesh", isDefault: false });

  const resetForm = () => {
    setForm({ street: "", city: "", zipCode: "", country: "Bangladesh", isDefault: false });
    setEditingIndex(null);
    setShowForm(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    let updated = [...(user.addresses || [])];
    if (editingIndex !== null) {
      updated[editingIndex] = { ...form };
    } else {
      updated.push(form);
    }
    if (form.isDefault) {
      updated = updated.map((a, i) => ({ ...a, isDefault: i === (editingIndex !== null ? editingIndex : updated.length - 1) }));
    }
    const res = await updateProfile({ addresses: updated });
    if (res.success) resetForm();
    setSaving(false);
  };

  const handleEdit = (index) => {
    const addr = user.addresses[index];
    setForm({ street: addr.street || "", city: addr.city || "", zipCode: addr.zipCode || "", country: addr.country || "Bangladesh", isDefault: addr.isDefault || false });
    setEditingIndex(index);
    setShowForm(true);
  };

  const handleDelete = async (index) => {
    const updated = user.addresses.filter((_, i) => i !== index);
    await updateProfile({ addresses: updated });
  };

  const handleSetDefault = async (index) => {
    const updated = user.addresses.map((a, i) => ({ ...a, isDefault: i === index }));
    await updateProfile({ addresses: updated });
  };

  return (
    <div>
      <div className="dash-content-header">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <h2>Addresses</h2>
            <p>Manage your saved shipping addresses.</p>
          </div>
          <button className="order-btn order-btn--primary" onClick={() => { resetForm(); setShowForm(true); }}>
            <Plus size={14} /> Add Address
          </button>
        </div>
      </div>

      {/* Address Form Modal */}
      {showForm && (
        <div className="address-modal-overlay" onClick={(e) => e.target === e.currentTarget && resetForm()}>
          <div className="address-modal">
            <div className="address-modal__header">
              <h3>{editingIndex !== null ? "Edit Address" : "New Address"}</h3>
              <button className="address-modal__close" onClick={resetForm}><X size={16} /></button>
            </div>
            <form onSubmit={handleSave} className="address-form">
              <div className="form-group">
                <label style={{ fontSize: "0.78rem", fontWeight: 700 }}>Street Address</label>
                <input className="form-input" placeholder="House 12, Road 5, Block C" value={form.street} onChange={(e) => setForm({ ...form, street: e.target.value })} required />
              </div>
              <div className="address-form__row">
                <div className="form-group">
                  <label style={{ fontSize: "0.78rem", fontWeight: 700 }}>City</label>
                  <input className="form-input" placeholder="Dhaka" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label style={{ fontSize: "0.78rem", fontWeight: 700 }}>Zip Code</label>
                  <input className="form-input" placeholder="1212" value={form.zipCode} onChange={(e) => setForm({ ...form, zipCode: e.target.value })} required />
                </div>
              </div>
              <label className="address-form__checkbox">
                <input type="checkbox" checked={form.isDefault} onChange={(e) => setForm({ ...form, isDefault: e.target.checked })} />
                Set as default address
              </label>
              <div className="address-form__actions">
                <button type="submit" className="order-btn order-btn--primary" disabled={saving}>
                  {saving ? "Saving..." : editingIndex !== null ? "Update" : "Save Address"}
                </button>
                <button type="button" className="order-btn" onClick={resetForm}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Address Cards */}
      <div className="addresses-grid">
        {(user.addresses || []).map((addr, idx) => (
          <div key={idx} className={`address-card ${addr.isDefault ? "address-card--default" : ""}`}>
            {addr.isDefault && (
              <span className="address-card__badge"><Star size={10} /> Default</span>
            )}
            <div className="address-card__street">{addr.street}</div>
            <div className="address-card__city">{addr.city}, {addr.zipCode}</div>
            <div className="address-card__country">{addr.country}</div>
            <div className="address-card__actions">
              {!addr.isDefault && (
                <button className="address-action-btn" onClick={() => handleSetDefault(idx)}>
                  <Star size={12} /> Set Default
                </button>
              )}
              <button className="address-action-btn" onClick={() => handleEdit(idx)}>
                <Edit2 size={12} /> Edit
              </button>
              <button className="address-action-btn address-action-btn--delete" onClick={() => handleDelete(idx)}>
                <Trash2 size={12} /> Remove
              </button>
            </div>
          </div>
        ))}

        {(!user.addresses || user.addresses.length === 0) && (
          <div className="dash-empty" style={{ gridColumn: "1 / -1" }}>
            <MapPin size={40} strokeWidth={1.2} />
            <h4>No addresses saved</h4>
            <p>Add an address for faster checkout.</p>
          </div>
        )}
      </div>
    </div>
  );
}
