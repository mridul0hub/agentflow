"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function AuthModal({ isOpen, onClose, defaultTab = "login" }) {
  const [tab, setTab] = useState(defaultTab);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  if (!isOpen) return null;

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/dashboard` }
    });
  };

  const handleLogin = async () => {
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
    } else {
      onClose();
      router.push("/dashboard");
    }
    setLoading(false);
  };

  const handleSignup = async () => {
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } }
    });
    if (error) {
      setError(error.message);
    } else {
      onClose();
      router.push("/dashboard");
    }
    setLoading(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(8px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-md rounded-3xl p-8 relative"
        style={{
          background: "rgba(255,255,255,0.92)",
          border: "1px solid rgba(255,255,255,0.9)",
          boxShadow: "0 25px 60px rgba(45,90,39,0.2)"
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
        >
          ✕
        </button>

        {/* Logo */}
        <div className="text-center mb-6">
          <span className="text-3xl">🌿</span>
          <h2
            className="text-2xl font-bold mt-1"
            style={{ fontFamily: "'Playfair Display', serif", color: "#1a2e1a" }}
          >
            AgentFlow
          </h2>
        </div>

        {/* Tabs */}
        <div className="flex bg-gray-100 rounded-2xl p-1 mb-6">
          <button
            onClick={() => { setTab("login"); setError(""); }}
            className="flex-1 py-2 rounded-xl text-sm font-medium transition"
            style={{
              background: tab === "login" ? "white" : "transparent",
              color: tab === "login" ? "#1a2e1a" : "#5a7a5a",
              boxShadow: tab === "login" ? "0 2px 8px rgba(0,0,0,0.1)" : "none"
            }}
          >
            Login
          </button>
          <button
            onClick={() => { setTab("signup"); setError(""); }}
            className="flex-1 py-2 rounded-xl text-sm font-medium transition"
            style={{
              background: tab === "signup" ? "white" : "transparent",
              color: tab === "signup" ? "#1a2e1a" : "#5a7a5a",
              boxShadow: tab === "signup" ? "0 2px 8px rgba(0,0,0,0.1)" : "none"
            }}
          >
            Sign Up
          </button>
        </div>

        {/* Google Button */}
        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 py-3 rounded-2xl font-medium text-sm transition mb-4"
          style={{
            background: "white",
            border: "1.5px solid #e5e7eb",
            color: "#1a2e1a",
            boxShadow: "0 2px 8px rgba(0,0,0,0.06)"
          }}
        >
          <img src="https://www.google.com/favicon.ico" className="w-4 h-4" />
          Continue with Google
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 h-px bg-gray-200"></div>
          <span className="text-gray-400 text-xs">or</span>
          <div className="flex-1 h-px bg-gray-200"></div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-4 text-sm">
            {error}
          </div>
        )}

        {/* Form */}
        <div className="space-y-3">
          {tab === "signup" && (
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full Name"
              className="w-full px-4 py-3 rounded-2xl text-sm outline-none transition"
              style={{
                background: "#f8faf8",
                border: "1.5px solid #e5e7eb",
                color: "#1a2e1a"
              }}
            />
          )}
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            className="w-full px-4 py-3 rounded-2xl text-sm outline-none transition"
            style={{
              background: "#f8faf8",
              border: "1.5px solid #e5e7eb",
              color: "#1a2e1a"
            }}
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            onKeyDown={(e) => e.key === "Enter" && (tab === "login" ? handleLogin() : handleSignup())}
            className="w-full px-4 py-3 rounded-2xl text-sm outline-none transition"
            style={{
              background: "#f8faf8",
              border: "1.5px solid #e5e7eb",
              color: "#1a2e1a"
            }}
          />
          <button
            onClick={tab === "login" ? handleLogin : handleSignup}
            disabled={loading}
            className="w-full py-3 rounded-2xl font-semibold text-sm transition"
            style={{
              background: "linear-gradient(135deg, #2d5a27, #4a7c59)",
              color: "white",
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? "Please wait..." : tab === "login" ? "Login" : "Create Account"}
          </button>
        </div>

      </div>
    </div>
  );
}