"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function AuthModal({ isOpen, onClose = () => {}, defaultTab = "login", redirectTo = "/dashboard" }) {
  const [tab, setTab] = useState(defaultTab);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    setTab(defaultTab);
    setError("");
  }, [defaultTab]);

  if (!isOpen) return null;

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setError("");
      const redirect = typeof window !== "undefined" ? `${window.location.origin}${redirectTo}` : undefined;
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: redirect }
      });
      if (error) setError(error.message);
    } catch (err) {
      setError(err?.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!email || !password) return setError("Please provide both email and password.");
    try {
      setLoading(true);
      setError("");
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) { setError(error.message); return; }
      onClose();
      router.replace(redirectTo);
    } catch (err) {
      setError(err?.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!email || !password || !name) return setError("Please provide name, email and password.");
    try {
      setLoading(true);
      setError("");
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: name } }
      });
      if (error) { setError(error.message); return; }
      onClose();
      router.replace(redirectTo);
    } catch (err) {
      setError(err?.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const submit = (e) => (tab === "login" ? handleLogin(e) : handleSignup(e));

  return (
    <div
      onClick={(e) => e.target === e.currentTarget && onClose()}
      style={{
        position: "fixed", inset: 0, zIndex: 999,
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "16px",
        background: "rgba(26,46,26,0.5)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)"
      }}
    >
      <div style={{
        width: "100%", maxWidth: "420px",
        background: "rgba(255,255,255,0.97)",
        borderRadius: "28px", padding: "36px",
        boxShadow: "0 32px 80px rgba(45,90,39,0.25), 0 0 0 1px rgba(255,255,255,0.8)",
        position: "relative",
        animation: "slideUp 0.3s ease"
      }}>
        <style>{`
          @keyframes slideUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .auth-input {
            width: 100%;
            padding: 12px 16px;
            border-radius: 14px;
            border: 1.5px solid #e5e7eb;
            background: #f8faf8;
            color: #1a2e1a;
            font-size: 14px;
            outline: none;
            transition: border 0.2s;
            font-family: 'DM Sans', sans-serif;
            box-sizing: border-box;
          }
          .auth-input:focus { border-color: #4a7c59; }
          .auth-input::placeholder { color: #9ca3af; }
          .google-btn:hover { background: #f9fafb !important; }
        `}</style>

        {/* Close */}
        <button
          onClick={onClose}
          aria-label="Close"
          style={{
            position: "absolute", top: "16px", right: "16px",
            width: "32px", height: "32px", borderRadius: "50%",
            border: "none", background: "#f3f4f6", color: "#6b7280",
            fontSize: "16px", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center"
          }}
        >✕</button>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <div style={{ fontSize: "32px", marginBottom: "6px" }}>🌿</div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "22px", fontWeight: "700", color: "#1a2e1a", margin: 0 }}>
            Vasu Agents
          </h2>
          <p style={{ color: "#6b7280", fontSize: "13px", marginTop: "4px" }}>
            {tab === "login" ? "Welcome back!" : "Create your account"}
          </p>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", background: "#f3f4f6", borderRadius: "14px", padding: "4px", marginBottom: "20px" }}>
          {["login", "signup"].map((t) => (
            <button
              key={t}
              onClick={() => { setTab(t); setError(""); }}
              style={{
                flex: 1, padding: "9px", borderRadius: "10px", border: "none",
                fontSize: "13px", fontWeight: "500", cursor: "pointer", transition: "all 0.2s",
                background: tab === t ? "white" : "transparent",
                color: tab === t ? "#1a2e1a" : "#6b7280",
                boxShadow: tab === t ? "0 2px 8px rgba(0,0,0,0.1)" : "none",
                fontFamily: "'DM Sans', sans-serif"
              }}
            >
              {t === "login" ? "Login" : "Sign Up"}
            </button>
          ))}
        </div>

        {/* Google Button */}
        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="google-btn"
          style={{
            width: "100%", padding: "12px", borderRadius: "14px",
            border: "1.5px solid #e5e7eb", background: "white",
            color: "#1a2e1a", fontSize: "14px", fontWeight: "500",
            cursor: loading ? "not-allowed" : "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            gap: "10px", marginBottom: "16px",
            fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s",
            boxShadow: "0 2px 8px rgba(0,0,0,0.06)"
          }}
        >
          <img src="https://www.google.com/favicon.ico" alt="Google" style={{ width: "16px", height: "16px" }} />
          Continue with Google
        </button>

        {/* Divider */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
          <div style={{ flex: 1, height: "1px", background: "#e5e7eb" }} />
          <span style={{ color: "#9ca3af", fontSize: "12px" }}>or</span>
          <div style={{ flex: 1, height: "1px", background: "#e5e7eb" }} />
        </div>

        {/* Error */}
        {error && (
          <div role="alert" style={{
            background: "#fef2f2", border: "1px solid #fecaca",
            color: "#dc2626", padding: "10px 14px",
            borderRadius: "12px", fontSize: "13px", marginBottom: "14px"
          }}>
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {tab === "signup" && (
            <input className="auth-input" type="text" value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full Name" aria-label="Full name" />
          )}
          <input className="auth-input" type="email" value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address" aria-label="Email address" />
          <input className="auth-input" type="password" value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password" aria-label="Password" />
          <button
            type="submit" disabled={loading}
            style={{
              width: "100%", padding: "13px", borderRadius: "14px", border: "none",
              background: loading ? "#9ca3af" : "linear-gradient(135deg, #2d5a27, #4a7c59)",
              color: "white", fontSize: "14px", fontWeight: "600",
              cursor: loading ? "not-allowed" : "pointer",
              fontFamily: "'DM Sans', sans-serif", marginTop: "4px", transition: "all 0.2s"
            }}
          >
            {loading ? "Please wait..." : tab === "login" ? "Login" : "Create Account"}
          </button>
        </form>

        <p style={{ textAlign: "center", fontSize: "12px", color: "#9ca3af", marginTop: "16px" }}>
          {tab === "login" ? "Don't have an account? " : "Already have an account? "}
          <button
            onClick={() => { setTab(tab === "login" ? "signup" : "login"); setError(""); }}
            style={{ color: "#4a7c59", background: "none", border: "none", cursor: "pointer", fontWeight: "600", fontSize: "12px" }}
          >
            {tab === "login" ? "Sign Up" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
}