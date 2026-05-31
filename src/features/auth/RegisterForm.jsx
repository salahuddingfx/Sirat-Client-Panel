import { useState } from "react";
import { ArrowRight, Eye, EyeOff } from "lucide-react";
import { Button } from "../../../components/ui";

export default function RegisterForm({ onRegister, onToggleLogin }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !phone || !password) return;
    setError("");
    setLoading(true);
    const res = await onRegister(name, email, phone, password);
    setLoading(false);
    if (res && !res.success) {
      setError(res.message || "Registration failed. Try another email.");
    }
  };

  return (
    <>
      <div className="auth-header">
        <h2>Create Account</h2>
        <p className="page-section__text" style={{ fontSize: "0.85rem" }}>Join for premium member perks.</p>
      </div>

      {error && (
        <div style={{ color: "var(--sirat-gold-soft)", fontSize: "0.85rem", textAlign: "center", marginBottom: "1rem", fontWeight: "600" }}>
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label htmlFor="reg-name">Full Name *</label>
          <input
            id="reg-name"
            type="text"
            required
            disabled={loading}
            className="form-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Salahuddin Ahmed"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="reg-email">Email Address *</label>
          <input
            id="reg-email"
            type="email"
            required
            disabled={loading}
            className="form-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="salahuddin@example.com"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="reg-phone">Contact Phone *</label>
          <input
            id="reg-phone"
            type="tel"
            required
            disabled={loading}
            className="form-input"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+880 1711-223344"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="reg-pass">Secure Password *</label>
          <div style={{ position: "relative" }}>
            <input
              id="reg-pass"
              type={showPass ? "text" : "password"}
              required
              disabled={loading}
              className="form-input"
              style={{ width: "100%", paddingRight: "3rem" }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
            <button
              type="button"
              disabled={loading}
              onClick={() => setShowPass(!showPass)}
              style={{
                position: "absolute",
                right: "1.2rem",
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "var(--sirat-muted)",
                display: "flex",
                alignItems: "center"
              }}
              aria-label={showPass ? "Hide password" : "Show password"}
            >
              {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <Button type="submit" disabled={loading} style={{ width: "100%", marginTop: "0.5rem", opacity: loading ? 0.7 : 1 }}>
          {loading ? "Creating Profile..." : "Create Profile"} <ArrowRight size={14} style={{ marginLeft: "4px" }} />
        </Button>
      </form>

      <div style={{ textAlign: "center", fontSize: "0.85rem", color: "var(--sirat-muted)", marginTop: "0.5rem" }}>
        Already have an account?{" "}
        <button 
          type="button" 
          style={{ background: "none", border: "none", cursor: "pointer", color: "var(--sirat-gold-soft)", fontWeight: "700" }} 
          onClick={onToggleLogin}
        >
          Sign In
        </button>
      </div>
    </>
  );
}
