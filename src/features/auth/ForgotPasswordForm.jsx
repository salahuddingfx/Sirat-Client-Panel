import { useState, useEffect, useRef } from "react";
import { ShieldCheck, KeyRound, Eye, EyeOff, Mail, RefreshCw, Clock, CheckCircle2 } from "lucide-react";
import { Button } from "@components/ui";
import { useCart } from "../../app/providers/CartContext";
import { forgotPassword as forgotPasswordApi, verifyResetOtp, resetPassword as resetPasswordApi } from "../../api/queries";

const OTP_LENGTH = 6;
const OTP_EXPIRY_SECONDS = 15 * 60;
const RESEND_COOLDOWN_SECONDS = 30;

const formatTime = (totalSeconds) => {
  const s = Math.max(0, Math.floor(totalSeconds));
  const mm = String(Math.floor(s / 60)).padStart(2, "0");
  const ss = String(s % 60).padStart(2, "0");
  return `${mm}:${ss}`;
};

export default function ForgotPasswordForm({ initialEmail = "", onToggleLogin }) {
  const { triggerToast } = useCart();
  const [activeSubForm, setActiveSubForm] = useState("forgot");
  const [email, setEmail] = useState(initialEmail);
  const [otpSentEmail, setOtpSentEmail] = useState("");
  const [otpCode, setOtpCode] = useState(Array(OTP_LENGTH).fill(""));
  const [isLoading, setIsLoading] = useState(false);

  // Timer / expiry state — `expiresAtMs` is the wall-clock expiry timestamp.
  const [expiresAtMs, setExpiresAtMs] = useState(null);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [resendCooldown, setResendCooldown] = useState(0);

  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const otpInputRefs = useRef([]);

  // Countdown ticker — drives both the OTP expiry display and the resend cooldown.
  useEffect(() => {
    if (activeSubForm !== "otp") return undefined;
    const tick = () => {
      const now = Date.now();
      setSecondsLeft(expiresAtMs ? Math.max(0, Math.round((expiresAtMs - now) / 1000)) : 0);
      setResendCooldown((c) => Math.max(0, c - 1));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [activeSubForm, expiresAtMs]);

  // Auto-focus the first OTP box when the OTP step mounts.
  useEffect(() => {
    if (activeSubForm === "otp") {
      const t = setTimeout(() => otpInputRefs.current[0]?.focus(), 60);
      return () => clearTimeout(t);
    }
    return undefined;
  }, [activeSubForm]);

  const startOtpTimer = () => {
    setExpiresAtMs(Date.now() + OTP_EXPIRY_SECONDS * 1000);
    setResendCooldown(RESEND_COOLDOWN_SECONDS);
  };

  const handleForgot = async (e) => {
    e?.preventDefault?.();
    if (!email) {
      triggerToast("Please enter your registered email address.", "warning");
      return;
    }
    setIsLoading(true);
    const res = await forgotPasswordApi(email);
    if (res.success) {
      setOtpSentEmail(email);
      setOtpCode(Array(OTP_LENGTH).fill(""));
      startOtpTimer();
      setActiveSubForm("otp");
      triggerToast("Verification code sent! Check your email.", "success");
    } else {
      triggerToast(res.message || "Failed to send code.", "error");
    }
    setIsLoading(false);
  };

  const handleResendOtp = async () => {
    if (resendCooldown > 0 || isLoading) return;
    setIsLoading(true);
    const res = await forgotPasswordApi(otpSentEmail);
    if (res.success) {
      setOtpCode(Array(OTP_LENGTH).fill(""));
      startOtpTimer();
      triggerToast("A fresh code has been sent to your email.", "success");
      setTimeout(() => otpInputRefs.current[0]?.focus(), 60);
    } else {
      triggerToast(res.message || "Failed to resend code.", "error");
    }
    setIsLoading(false);
  };

  const handleChangeEmail = () => {
    setActiveSubForm("forgot");
    setOtpCode(Array(OTP_LENGTH).fill(""));
    setExpiresAtMs(null);
    setResendCooldown(0);
  };

  const handleOtpVerify = async (e) => {
    e.preventDefault();
    const fullOtp = otpCode.join("");
    if (fullOtp.length < OTP_LENGTH) {
      triggerToast(`Please enter the complete ${OTP_LENGTH}-digit verification code.`, "warning");
      return;
    }
    if (secondsLeft <= 0) {
      triggerToast("This code has expired. Please request a new one.", "error");
      return;
    }
    setIsLoading(true);
    const res = await verifyResetOtp(otpSentEmail, fullOtp);
    if (res.success) {
      setActiveSubForm("reset");
    } else {
      triggerToast(res.message || "Invalid code.", "error");
    }
    setIsLoading(false);
  };

  const handleOtpChange = (index, value) => {
    const digits = value.replace(/\D/g, "");
    if (digits.length === 0) {
      const next = [...otpCode];
      next[index] = "";
      setOtpCode(next);
      return;
    }
    if (digits.length === 1) {
      const next = [...otpCode];
      next[index] = digits;
      setOtpCode(next);
      if (index < OTP_LENGTH - 1) otpInputRefs.current[index + 1]?.focus();
      return;
    }
    // Multi-char input (typical from a paste) — spread across remaining boxes.
    const next = [...otpCode];
    for (let i = 0; i < digits.length && index + i < OTP_LENGTH; i++) {
      next[index + i] = digits[i];
    }
    setOtpCode(next);
    const lastFilled = Math.min(index + digits.length, OTP_LENGTH) - 1;
    otpInputRefs.current[Math.min(lastFilled + 1, OTP_LENGTH - 1)]?.focus();
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otpCode[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowLeft" && index > 0) {
      e.preventDefault();
      otpInputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < OTP_LENGTH - 1) {
      e.preventDefault();
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    const pasted = (e.clipboardData.getData("text") || "").replace(/\D/g, "");
    if (!pasted) return;
    e.preventDefault();
    const next = Array(OTP_LENGTH).fill("");
    for (let i = 0; i < Math.min(pasted.length, OTP_LENGTH); i++) next[i] = pasted[i];
    setOtpCode(next);
    const focusIdx = Math.min(pasted.length, OTP_LENGTH) - 1;
    otpInputRefs.current[Math.min(focusIdx + 1, OTP_LENGTH - 1)]?.focus();
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPass !== confirmPass) {
      triggerToast("Passwords do not match!", "error");
      return;
    }
    if (newPass.length < 6) {
      triggerToast("Password must be at least 6 characters.", "error");
      return;
    }
    setIsLoading(true);
    const res = await resetPasswordApi(otpSentEmail, otpCode.join(""), newPass);
    if (res.success) {
      triggerToast("Password reset successfully! Please log in.", "success");
      onToggleLogin();
    } else {
      triggerToast(res.message || "Failed to reset password.", "error");
    }
    setIsLoading(false);
  };

  const otpExpired = activeSubForm === "otp" && secondsLeft <= 0;
  const otpAlmostOut = activeSubForm === "otp" && secondsLeft > 0 && secondsLeft <= 60;

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
              <label htmlFor="forgot-email"><Mail size={13} style={{ marginRight: "4px" }} /> Account Email Address</label>
              <input
                id="forgot-email"
                type="email"
                required
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="johndoe@example.com"
                autoComplete="email"
              />
            </div>

            <Button type="submit" style={{ width: "100%", marginTop: "0.5rem" }} disabled={isLoading}>
              {isLoading ? "Sending..." : "Send Reset Code"}
            </Button>
          </form>

          <div style={{ textAlign: "center", fontSize: "0.85rem", color: "var(--sirat-muted)", marginTop: "0.5rem" }}>
            Remember your password?{" "}
            <button
              type="button"
              onClick={onToggleLogin}
              style={{ background: "none", border: "none", cursor: "pointer", color: "var(--sirat-gold-soft)", fontWeight: "700" }}
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
              Enter the 6-digit code we sent to <strong>{otpSentEmail}</strong>.
            </p>
          </div>

          {/* EXPIRY COUNTDOWN BAR */}
          <div
            className="otp-expiry-bar"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              padding: "10px 14px",
              borderRadius: "10px",
              fontSize: "0.8rem",
              fontWeight: "600",
              letterSpacing: "0.04em",
              background: otpExpired ? "#FEE2E2" : otpAlmostOut ? "#FEF3C7" : "var(--sirat-cream, #FAF9F5)",
              border: `1px solid ${otpExpired ? "#FCA5A5" : otpAlmostOut ? "#FDE68A" : "var(--sirat-border)"}`,
              color: otpExpired ? "#991B1B" : otpAlmostOut ? "#B45309" : "var(--sirat-muted)",
              marginBottom: "0.5rem",
            }}
          >
            {otpExpired ? (
              <>
                <Clock size={14} /> Code expired — request a new one below.
              </>
            ) : (
              <>
                <Clock size={14} />
                <span>Code expires in</span>
                <span
                  style={{
                    fontFamily: "'Courier New', Courier, monospace",
                    fontWeight: "800",
                    color: otpAlmostOut ? "#B45309" : "var(--sirat-charcoal, #141311)",
                    minWidth: "44px",
                    textAlign: "center",
                  }}
                >
                  {formatTime(secondsLeft)}
                </span>
              </>
            )}
          </div>

          <form onSubmit={handleOtpVerify} className="auth-form">
            <div
              className="otp-box-container"
              style={{ display: "flex", gap: "0.5rem", justifyContent: "center", margin: "0.5rem 0" }}
              onPaste={handleOtpPaste}
            >
              {otpCode.map((val, idx) => (
                <input
                  key={idx}
                  ref={(el) => { otpInputRefs.current[idx] = el; }}
                  id={`forgot-otp-${idx}`}
                  type="text"
                  inputMode="numeric"
                  autoComplete={idx === 0 ? "one-time-code" : "off"}
                  maxLength={OTP_LENGTH}
                  className="otp-input"
                  style={{
                    width: "44px",
                    height: "48px",
                    borderRadius: "10px",
                    border: `1.5px solid ${otpExpired ? "#FCA5A5" : "var(--sirat-border)"}`,
                    textAlign: "center",
                    fontSize: "1.25rem",
                    fontWeight: "700",
                    background: otpExpired ? "#FEF2F2" : "var(--sirat-bg)",
                    outline: "none",
                    color: otpExpired ? "#9CA3AF" : "var(--sirat-text)",
                    caretColor: "var(--sirat-gold)",
                    transition: "all 180ms ease",
                  }}
                  value={val}
                  onChange={(e) => handleOtpChange(idx, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                  disabled={otpExpired}
                  required
                />
              ))}
            </div>

            <Button type="submit" style={{ width: "100%", marginTop: "0.5rem" }} disabled={isLoading || otpExpired}>
              {isLoading ? "Verifying..." : otpExpired ? "Code Expired" : "Verify Code"}
            </Button>
          </form>

          {/* RESEND + CHANGE EMAIL ROW */}
          <div className="otp-action-row" style={{ display: "flex", flexDirection: "column", gap: "0.65rem", marginTop: "1rem" }}>
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={resendCooldown > 0 || isLoading}
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.4rem",
                background: resendCooldown > 0 ? "var(--sirat-cream, #FAF9F5)" : "transparent",
                border: "1px solid var(--sirat-border-strong, rgba(197, 160, 89, 0.35))",
                borderRadius: "99px",
                padding: "0.55rem 1.1rem",
                fontSize: "0.82rem",
                fontWeight: "700",
                color: resendCooldown > 0 ? "var(--sirat-muted)" : "var(--sirat-gold-soft)",
                cursor: resendCooldown > 0 ? "not-allowed" : "pointer",
                opacity: resendCooldown > 0 ? 0.7 : 1,
                transition: "all 180ms ease",
                width: "100%",
              }}
            >
              {resendCooldown > 0 ? (
                <>
                  <RefreshCw size={13} /> Resend available in {resendCooldown}s
                </>
              ) : (
                <>
                  <RefreshCw size={13} /> Resend Code
                </>
              )}
            </button>

            <div style={{ textAlign: "center", fontSize: "0.82rem", color: "var(--sirat-muted)" }}>
              Sent to the wrong address?{" "}
              <button
                type="button"
                onClick={handleChangeEmail}
                style={{ background: "none", border: "none", cursor: "pointer", color: "var(--sirat-gold-soft)", fontWeight: "700" }}
              >
                Change Email
              </button>
            </div>
          </div>
        </>
      )}

      {/* 3. RESET PASSWORD INPUT STAGE */}
      {activeSubForm === "reset" && (
        <>
          <div className="auth-header">
            <h2><CheckCircle2 size={20} style={{ marginRight: "6px", verticalAlign: "middle", color: "var(--sirat-gold)" }} /> Reset Password</h2>
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
                  autoComplete="new-password"
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
                  autoComplete="new-password"
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

            <Button type="submit" style={{ width: "100%", marginTop: "0.5rem" }} disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Password"}
            </Button>
          </form>
        </>
      )}
    </>
  );
}
