import { useState } from "react";
import { ShieldCheck, KeyRound, Eye, EyeOff } from "lucide-react";
import { Button } from "@components/ui";
import { useCart } from "../../app/providers/CartContext";

export default function ForgotPasswordForm({ initialEmail = "", onToggleLogin }) {
  const { triggerToast } = useCart();
  const [activeSubForm, setActiveSubForm] = useState("forgot"); // forgot, otp, reset
  const [email, setEmail] = useState(initialEmail);
  const [otpSentEmail, setOtpSentEmail] = useState("");
  const [otpCode, setOtpCode] = useState(["", "", "", "", "", ""]);
  
  // Reset password fields
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const handleForgot = (e) => {
    e.preventDefault();
    if (!email) {
      triggerToast("Please enter your registered email address.", "warning");
      return;
    }
    setOtpSentEmail(email);
    setActiveSubForm("otp");
    triggerToast("Verification code sent!", "success");
  };

  const handleOtpVerify = (e) => {
    e.preventDefault();
    const fullOtp = otpCode.join("");
    if (fullOtp.length < 6) {
      triggerToast("Please enter the complete 6-digit verification code.", "warning");
      return;
    }
    setActiveSubForm("reset");
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return;
    const newOtp = [...otpCode];
    newOtp[index] = value;
    setOtpCode(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`forgot-otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    if (newPass !== confirmPass) {
      triggerToast("Passwords do not match!", "error");
      return;
    }
    triggerToast("Your password has been successfully reset. Please log in with your new credentials.", "success");
    onToggleLogin();
  };

  return (
    <>
      {/* 1. FORGOT EMAIL REQUEST STAGE */}
      {activeSubForm === "forgot" && (
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="salahuddin@example.com"
              />
            </div>

            <Button type="submit" style={{ width: "100%", marginTop: "0.5rem" }}>
              Request Verification Code
            </Button>
          </form>

          <div style={{ textAlign: "center", fontSize: "0.85rem", color: "var(--sirat-muted)", marginTop: "0.5rem" }}>
            Remember your password?{" "}
            <button 
              type="button" 
              style={{ background: "none", border: "none", cursor: "pointer", color: "var(--sirat-gold-soft)", fontWeight: "700" }} 
              onClick={onToggleLogin}
            >
              Go Back
            </button>
          </div>
        </>
      )}

      {/* 2. OTP VERIFICATION STAGE */}
      {activeSubForm === "otp" && (
        <>
          <div className="auth-header">
            <h2>Verify Code</h2>
            <p className="page-section__text" style={{ fontSize: "0.85rem" }}>
              Enter the 6-digit OTP code sent to <strong>{otpSentEmail}</strong>. (Simulated code: <strong>123456</strong>)
            </p>
          </div>
          
          <form onSubmit={handleOtpVerify} className="auth-form">
            <div className="otp-box-container" style={{ display: "flex", gap: "0.5rem", justifyContent: "center", margin: "1rem 0" }}>
              {otpCode.map((val, idx) => (
                <input
                  key={idx}
                  id={`forgot-otp-${idx}`}
                  type="text"
                  maxLength={1}
                  className="otp-input"
                  style={{
                    width: "44px",
                    height: "48px",
                    borderRadius: "10px",
                    border: "1px solid var(--sirat-border)",
                    textAlign: "center",
                    fontSize: "1.25rem",
                    fontWeight: "700",
                    background: "var(--sirat-bg)",
                    outline: "none",
                    color: "var(--sirat-text)"
                  }}
                  value={val}
                  onChange={(e) => handleOtpChange(idx, e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Backspace" && !val && idx > 0) {
                      const prevInput = document.getElementById(`forgot-otp-${idx - 1}`);
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
            <button 
              type="button" 
              style={{ background: "none", border: "none", cursor: "pointer", color: "var(--sirat-gold-soft)", fontWeight: "700" }} 
              onClick={() => setActiveSubForm("forgot")}
            >
              Resend OTP
            </button>
          </div>
        </>
      )}

      {/* 3. RESET PASSWORD INPUT STAGE */}
      {activeSubForm === "reset" && (
        <>
          <div className="auth-header">
            <h2>Reset Password</h2>
            <p className="page-section__text" style={{ fontSize: "0.85rem" }}>Choose a strong password for your profile.</p>
          </div>
          
          <form onSubmit={handleResetPassword} className="auth-form">
            <div className="form-group">
              <label htmlFor="new-pass"><ShieldCheck size={13} style={{ marginRight: "4px" }} /> New Password</label>
              <div style={{ position: "relative" }}>
                <input
                  id="new-pass"
                  type={showNewPass ? "text" : "password"}
                  required
                  className="form-input"
                  style={{ width: "100%", paddingRight: "3rem" }}
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPass(!showNewPass)}
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
                  aria-label={showNewPass ? "Hide password" : "Show password"}
                >
                  {showNewPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="confirm-new-pass"><KeyRound size={13} style={{ marginRight: "4px" }} /> Confirm New Password</label>
              <div style={{ position: "relative" }}>
                <input
                  id="confirm-new-pass"
                  type={showConfirmPass ? "text" : "password"}
                  required
                  className="form-input"
                  style={{ width: "100%", paddingRight: "3rem" }}
                  value={confirmPass}
                  onChange={(e) => setConfirmPass(e.target.value)}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPass(!showConfirmPass)}
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
                  aria-label={showConfirmPass ? "Hide password" : "Show password"}
                >
                  {showConfirmPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <Button type="submit" style={{ width: "100%", marginTop: "0.5rem" }}>
              Save New Password
            </Button>
          </form>
        </>
      )}
    </>
  );
}
