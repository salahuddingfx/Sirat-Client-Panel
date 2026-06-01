import { useState } from "react";
import { ArrowRight, Eye, EyeOff } from "lucide-react";
import { Button } from "@components/ui";

export default function LoginForm({ onLogin, onForgotPassword, onToggleRegister }) {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!identifier || !password) return;
    setError("");
    setLoading(true);
    const res = await onLogin(identifier, password);
    setLoading(false);
    if (res && !res.success) {
      setError(res.message || "Invalid credentials");
    }
  };

  return (
    <>
      <div className="auth-header">
        <h2>Sign In</h2>
        <p className="page-section__text" style={{ fontSize: "0.85rem" }}>Access order logs and details.</p>
      </div>

      {error && (
        <div style={{ color: "var(--sirat-gold-soft)", fontSize: "0.85rem", textAlign: "center", marginBottom: "1rem", fontWeight: "600" }}>
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label htmlFor="auth-identifier">Email, Username, or Phone</label>
          <input
            id="auth-identifier"
            type="text"
            required
            disabled={loading}
            className="form-input"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder="e.g. user@email.com or 017..."
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="auth-pass">Password</label>
          <div style={{ position: "relative" }}>
            <input
              id="auth-pass"
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

        <div className="auth-links">
          <button 
            type="button" 
            disabled={loading}
            style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }} 
            onClick={() => onForgotPassword(identifier)}
          >
            Forgot Password?
          </button>
        </div>

        <Button type="submit" disabled={loading} style={{ width: "100%", marginTop: "0.5rem", opacity: loading ? 0.7 : 1 }}>
          {loading ? "Signing In..." : "Sign In"} <ArrowRight size={14} style={{ marginLeft: "4px" }} />
        </Button>
      </form>

      <div style={{ textAlign: "center", fontSize: "0.85rem", color: "var(--sirat-muted)", marginTop: "0.5rem" }}>
        Don't have an account?{" "}
        <button 
          type="button" 
          style={{ background: "none", border: "none", cursor: "pointer", color: "var(--sirat-gold-soft)", fontWeight: "700" }} 
          onClick={onToggleRegister}
        >
          Register Here
        </button>
      </div>
    </>
  );
}
