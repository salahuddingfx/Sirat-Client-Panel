import { useState } from "react";
import { LogOut, User, Mail, Phone, MapPin, Package, ArrowRight, ShieldCheck, KeyRound } from "lucide-react";
import PageFrame from "../components/PageFrame";
import { Button, Panel } from "../lib/ui";
import SEO from "../components/SEO";
import { useAuth } from "../context/AuthContext";

export default function AccountPage() {
  const { isLoggedIn, user, login, register, logout } = useAuth();
  
  // Local form states
  const [activeForm, setActiveForm] = useState("login"); // login, register, forgot, otp, reset
  const [userEmail, setUserEmail] = useState(""); // For forgot password form email tracking
  const [otpSentEmail, setOtpSentEmail] = useState("");
  const [otpCode, setOtpCode] = useState(["", "", "", "", "", ""]);
  
  // Dummy inputs
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regPass, setRegPass] = useState("");
  
  // Simulated orders
  const simulatedOrders = [
    { id: "SRT-876124", date: "May 31, 2026", status: "processing", total: 1350 },
    { id: "SRT-982161", date: "May 24, 2026", status: "delivered", total: 2400 },
    { id: "SRT-321568", date: "April 10, 2026", status: "delivered", total: 950 }
  ];

  const handleLogin = (e) => {
    e.preventDefault();
    if (!loginEmail || !loginPass) return;
    login(loginEmail, loginPass);
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (!regName || !regEmail || !regPhone || !regPass) return;
    register(regName, regEmail, regPhone, regPass);
  };

  const handleForgot = (e) => {
    e.preventDefault();
    if (!userEmail) {
      alert("Please enter your registered email address.");
      return;
    }
    setOtpSentEmail(userEmail);
    setActiveForm("otp");
  };

  const handleOtpVerify = (e) => {
    e.preventDefault();
    const fullOtp = otpCode.join("");
    if (fullOtp.length < 6) {
      alert("Please enter the complete 6-digit verification code.");
      return;
    }
    setActiveForm("reset");
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return;
    const newOtp = [...otpCode];
    newOtp[index] = value;
    setOtpCode(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-char-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    alert("Your password has been successfully reset. Please log in with your new credentials.");
    setActiveForm("login");
    setOtpCode(["", "", "", "", "", ""]);
  };

  const handleLogout = () => {
    logout();
    setLoginEmail("");
    setLoginPass("");
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
          
          {/* LOGIN FORM */}
          {activeForm === "login" && (
            <>
              <div className="auth-header">
                <h2>Sign In</h2>
                <p className="page-section__text" style={{ fontSize: "0.85rem" }}>Access order logs and details.</p>
              </div>
              <form onSubmit={handleLogin} className="auth-form">
                <div className="form-group">
                  <label htmlFor="auth-email">Email Address</label>
                  <input
                    id="auth-email"
                    type="email"
                    required
                    className="form-input"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="email@example.com"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="auth-pass">Password</label>
                  <input
                    id="auth-pass"
                    type="password"
                    required
                    className="form-input"
                    value={loginPass}
                    onChange={(e) => setLoginPass(e.target.value)}
                    placeholder="••••••••"
                  />
                </div>

                <div className="auth-links">
                  <button type="button" style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }} onClick={() => { setUserEmail(loginEmail); setActiveForm("forgot"); }}>
                    Forgot Password?
                  </button>
                </div>

                <Button type="submit" style={{ width: "100%", marginTop: "0.5rem" }}>
                  Sign In <ArrowRight size={14} style={{ marginLeft: "4px" }} />
                </Button>
              </form>

              <div style={{ textAlign: "center", fontSize: "0.85rem", color: "var(--sirat-muted)", marginTop: "0.5rem" }}>
                Don't have an account?{" "}
                <button type="button" style={{ background: "none", border: "none", cursor: "pointer", color: "var(--sirat-gold-soft)", fontWeight: "700" }} onClick={() => setActiveForm("register")}>
                  Register Here
                </button>
              </div>
            </>
          )}

          {/* REGISTRATION FORM */}
          {activeForm === "register" && (
            <>
              <div className="auth-header">
                <h2>Create Account</h2>
                <p className="page-section__text" style={{ fontSize: "0.85rem" }}>Join for premium member perks.</p>
              </div>
              <form onSubmit={handleRegister} className="auth-form">
                <div className="form-group">
                  <label htmlFor="reg-name">Full Name *</label>
                  <input
                    id="reg-name"
                    type="text"
                    required
                    className="form-input"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="Salahuddin Ahmed"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="reg-email">Email Address *</label>
                  <input
                    id="reg-email"
                    type="email"
                    required
                    className="form-input"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="salahuddin@example.com"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="reg-phone">Contact Phone *</label>
                  <input
                    id="reg-phone"
                    type="tel"
                    required
                    className="form-input"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="+880 1711-223344"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="reg-pass">Secure Password *</label>
                  <input
                    id="reg-pass"
                    type="password"
                    required
                    className="form-input"
                    value={regPass}
                    onChange={(e) => setRegPass(e.target.value)}
                    placeholder="••••••••"
                  />
                </div>

                <Button type="submit" style={{ width: "100%", marginTop: "0.5rem" }}>
                  Create Profile <ArrowRight size={14} style={{ marginLeft: "4px" }} />
                </Button>
              </form>

              <div style={{ textAlign: "center", fontSize: "0.85rem", color: "var(--sirat-muted)", marginTop: "0.5rem" }}>
                Already have an account?{" "}
                <button type="button" style={{ background: "none", border: "none", cursor: "pointer", color: "var(--sirat-gold-soft)", fontWeight: "700" }} onClick={() => setActiveForm("login")}>
                  Sign In
                </button>
              </div>
            </>
          )}

          {/* FORGOT PASSWORD FORM */}
          {activeForm === "forgot" && (
            <>
              <div className="auth-header">
                <h2>Forgot Password</h2>
                <p className="page-section__text" style={{ fontSize: "0.85rem" }}>We will send a 6-digit OTP code to verify your profile.</p>
              </div>
              <form onSubmit={handleForgot} className="auth-form">
                <div className="form-group">
                  <label htmlFor="forgot-email">Account Email Address</label>
                  <input
                    id="forgot-email"
                    type="email"
                    required
                    className="form-input"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    placeholder="salahuddin@example.com"
                  />
                </div>

                <Button type="submit" style={{ width: "100%", marginTop: "0.5rem" }}>
                  Request Verification Code
                </Button>
              </form>

              <div style={{ textAlign: "center", fontSize: "0.85rem", color: "var(--sirat-muted)", marginTop: "0.5rem" }}>
                Remember your password?{" "}
                <button type="button" style={{ background: "none", border: "none", cursor: "pointer", color: "var(--sirat-gold-soft)", fontWeight: "700" }} onClick={() => setActiveForm("login")}>
                  Go Back
                </button>
              </div>
            </>
          )}

          {/* OTP VERIFICATION FORM */}
          {activeForm === "otp" && (
            <>
              <div className="auth-header">
                <h2>Verify Code</h2>
                <p className="page-section__text" style={{ fontSize: "0.85rem" }}>
                  Enter the 6-digit OTP code sent to <strong>{otpSentEmail}</strong>. (Simulated code: <strong>123456</strong>)
                </p>
              </div>
              <form onSubmit={handleOtpVerify} className="auth-form">
                <div className="otp-box-container">
                  {otpCode.map((val, idx) => (
                    <input
                      key={idx}
                      id={`otp-char-${idx}`}
                      type="text"
                      maxLength={1}
                      className="otp-input"
                      value={val}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Backspace" && !val && idx > 0) {
                          const prevInput = document.getElementById(`otp-char-${idx - 1}`);
                          prevInput?.focus();
                        }
                      }}
                      required
                    />
                  ))}
                </div>

                <Button type="submit" style={{ width: "100%", marginTop: "0.5rem" }}>
                  Confirm Verification Code
                </Button>
              </form>

              <div style={{ textAlign: "center", fontSize: "0.85rem", color: "var(--sirat-muted)", marginTop: "0.5rem" }}>
                Didn't receive the email?{" "}
                <button type="button" style={{ background: "none", border: "none", cursor: "pointer", color: "var(--sirat-gold-soft)", fontWeight: "700" }} onClick={() => setActiveForm("forgot")}>
                  Resend OTP
                </button>
              </div>
            </>
          )}

          {/* RESET PASSWORD FORM */}
          {activeForm === "reset" && (
            <>
              <div className="auth-header">
                <h2>Reset Password</h2>
                <p className="page-section__text" style={{ fontSize: "0.85rem" }}>Choose a strong password for your profile.</p>
              </div>
              <form onSubmit={handleResetPassword} className="auth-form">
                <div className="form-group">
                  <label htmlFor="new-pass"><ShieldCheck size={13} style={{ marginRight: "4px" }} /> New Password</label>
                  <input
                    id="new-pass"
                    type="password"
                    required
                    className="form-input"
                    placeholder="••••••••"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="confirm-new-pass"><KeyRound size={13} style={{ marginRight: "4px" }} /> Confirm New Password</label>
                  <input
                    id="confirm-new-pass"
                    type="password"
                    required
                    className="form-input"
                    placeholder="••••••••"
                  />
                </div>

                <Button type="submit" style={{ width: "100%", marginTop: "0.5rem" }}>
                  Save New Password
                </Button>
              </form>
            </>
          )}

        </div>
      )}
    </PageFrame>
  );
}
