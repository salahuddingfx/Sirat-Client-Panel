import { useState } from "react";
import { ArrowRight, Eye, EyeOff } from "lucide-react";
import { Button } from "../../lib/ui";

export default function LoginForm({ onLogin, onForgotPassword, onToggleRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) return;
    onLogin(email, password);
  };

  return (
    <>
      <div className="auth-header">
        <h2>Sign In</h2>
        <p className="page-section__text" style={{ fontSize: "0.85rem" }}>Access order logs and details.</p>
      </div>
      
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label htmlFor="auth-email">Email Address</label>
          <input
            id="auth-email"
            type="email"
            required
            className="form-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@example.com"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="auth-pass">Password</label>
          <div style={{ position: "relative" }}>
            <input
              id="auth-pass"
              type={showPass ? "text" : "password"}
              required
              className="form-input"
              style={{ width: "100%", paddingRight: "3rem" }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
            <button
              type="button"
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
            style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }} 
            onClick={() => onForgotPassword(email)}
          >
            Forgot Password?
          </button>
        </div>

        <Button type="submit" style={{ width: "100%", marginTop: "0.5rem" }}>
          Sign In <ArrowRight size={14} style={{ marginLeft: "4px" }} />
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
