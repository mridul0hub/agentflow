"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function AuthModal({ isOpen, onClose, defaultTab = "login" }) {
  const [tab, setTab] = useState(defaultTab);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => { setTab(defaultTab); }, [defaultTab]);
  useEffect(() => { setError(""); setSuccess(""); }, [tab]);
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!isOpen) return null;

  const redirectTo = typeof window !== "undefined"
    ? `${window.location.origin}/dashboard`
    : "https://vasuagents-p0oag9ncy-mridul0hubs-projects.vercel.app/dashboard";

  const handleGoogle = async () => {
    setLoading(true); setError("");
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo, queryParams: { prompt: "select_account" } },
    });
    if (error) { setError(error.message); setLoading(false); }
  };

  const handleEmailAuth = async () => {
    setLoading(true); setError(""); setSuccess("");
    if (!email || !password) { setError("Please fill all fields."); setLoading(false); return; }
    if (tab === "signup") {
      if (!name) { setError("Please enter your name."); setLoading(false); return; }
      const { error } = await supabase.auth.signUp({
        email, password,
        options: { data: { full_name: name }, emailRedirectTo: redirectTo },
      });
      if (error) setError(error.message);
      else setSuccess("Check your email to confirm your account!");
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError("Invalid email or password.");
      else onClose();
    }
    setLoading(false);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Geist:wght@300;400;500;600;700&display=swap');

        .am-overlay {
          position: fixed; inset: 0; z-index: 1000;
          background: rgba(0,0,0,0.5);
          backdrop-filter: blur(8px);
          display: flex; align-items: center; justify-content: center;
          padding: 20px;
          animation: amIn 0.2s ease;
        }
        @keyframes amIn { from { opacity: 0; } to { opacity: 1; } }

        .am-box {
          background: #fff;
          border-radius: 24px;
          width: 100%;
          max-width: 420px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 32px 80px rgba(0,0,0,0.2), 0 0 0 1px rgba(0,0,0,0.06);
          animation: amUp 0.25s ease;
          font-family: 'Geist', sans-serif;
          scrollbar-width: none;
        }
        .am-box::-webkit-scrollbar { display: none; }
        @keyframes amUp { from { opacity: 0; transform: translateY(16px) scale(0.98); } to { opacity: 1; transform: translateY(0) scale(1); } }

        /* TOP */
        .am-top {
          background: linear-gradient(135deg, #0a0a0a 0%, #1a0a2e 100%);
          padding: 32px 32px 26px;
          position: relative; overflow: hidden;
        }
        .am-top-grid {
          position: absolute; inset: 0;
          background-image: linear-gradient(rgba(124,58,237,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(124,58,237,0.1) 1px, transparent 1px);
          background-size: 28px 28px;
        }
        .am-top-glow {
          position: absolute; inset: 0;
          background: radial-gradient(ellipse 80% 80% at 50% -20%, rgba(124,58,237,0.45) 0%, transparent 70%);
        }
        .am-close {
          position: absolute; top: 14px; right: 14px; z-index: 2;
          width: 30px; height: 30px; border-radius: 8px;
          background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.15);
          color: rgba(255,255,255,0.7); font-size: 15px;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: all 0.15s; line-height: 1;
        }
        .am-close:hover { background: rgba(255,255,255,0.2); color: white; }

        .am-brand {
          position: relative; z-index: 1;
          display: flex; align-items: center; gap: 10px; margin-bottom: 18px;
        }
        .am-brand-icon {
          width: 34px; height: 34px; border-radius: 9px;
          background: linear-gradient(135deg, #7c3aed, #a855f7);
          display: flex; align-items: center; justify-content: center;
          font-size: 17px; color: white;
          box-shadow: 0 4px 14px rgba(124,58,237,0.5);
        }
        .am-brand-name { font-size: 14px; font-weight: 600; color: white; letter-spacing: -0.2px; }

        .am-headline {
          position: relative; z-index: 1;
          font-family: 'Instrument Serif', serif;
          font-size: 26px; font-weight: 400;
          color: white; line-height: 1.2; letter-spacing: -0.5px;
        }
        .am-headline em { font-style: italic; color: #a78bfa; }
        .am-subline {
          position: relative; z-index: 1;
          font-size: 13px; color: rgba(255,255,255,0.5);
          margin-top: 7px; line-height: 1.5;
        }
        .am-trial {
          position: relative; z-index: 1;
          display: inline-flex; align-items: center; gap: 7px;
          margin-top: 14px;
          background: rgba(124,58,237,0.25);
          border: 1px solid rgba(167,139,250,0.35);
          border-radius: 50px; padding: 5px 13px;
          font-size: 12px; font-weight: 500; color: #c4b5fd;
        }
        .am-trial-dot {
          width: 6px; height: 6px; border-radius: 50%; background: #a78bfa;
          box-shadow: 0 0 0 3px rgba(167,139,250,0.25);
          animation: tpulse 2s infinite;
        }
        @keyframes tpulse { 0%,100%{box-shadow:0 0 0 3px rgba(167,139,250,0.25)} 50%{box-shadow:0 0 0 6px rgba(167,139,250,0.1)} }

        /* BODY */
        .am-body { padding: 26px 32px 30px; }

        /* TABS */
        .am-tabs { display: flex; gap: 4px; background: #f4f4f5; border-radius: 10px; padding: 4px; margin-bottom: 22px; }
        .am-tab { flex: 1; padding: 8px; border-radius: 8px; font-size: 14px; font-weight: 500; border: none; cursor: pointer; font-family: 'Geist', sans-serif; transition: all 0.2s; color: #71717a; background: transparent; }
        .am-tab.on { background: white; color: #0a0a0a; box-shadow: 0 1px 4px rgba(0,0,0,0.1); }

        /* GOOGLE */
        .am-google {
          width: 100%; padding: 11px 16px;
          border-radius: 10px; border: 1px solid #e4e4e7;
          background: white; color: #0a0a0a;
          font-size: 14px; font-weight: 500;
          cursor: pointer; font-family: 'Geist', sans-serif;
          display: flex; align-items: center; justify-content: center; gap: 10px;
          transition: all 0.2s; margin-bottom: 18px;
        }
        .am-google:hover { background: #f4f4f5; }
        .am-google:disabled { opacity: 0.6; cursor: not-allowed; }

        /* DIVIDER */
        .am-div { display: flex; align-items: center; gap: 12px; margin-bottom: 18px; }
        .am-div-line { flex: 1; height: 1px; background: #e4e4e7; }
        .am-div-txt { font-size: 12px; color: #a1a1aa; font-weight: 500; }

        /* ALERTS */
        .am-err { background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 10px 13px; font-size: 13px; color: #dc2626; margin-bottom: 14px; }
        .am-ok { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 10px 13px; font-size: 13px; color: #16a34a; margin-bottom: 14px; }

        /* FIELDS */
        .am-field { margin-bottom: 13px; }
        .am-label { display: block; font-size: 13px; font-weight: 500; color: #3f3f46; margin-bottom: 5px; }
        .am-input {
          width: 100%; padding: 10px 13px;
          border-radius: 10px; border: 1px solid #e4e4e7;
          font-size: 14px; color: #0a0a0a;
          font-family: 'Geist', sans-serif;
          transition: all 0.15s; background: white; outline: none;
          box-sizing: border-box;
        }
        .am-input:focus { border-color: #7c3aed; box-shadow: 0 0 0 3px rgba(124,58,237,0.1); }
        .am-input::placeholder { color: #a1a1aa; }

        /* SUBMIT */
        .am-submit {
          width: 100%; padding: 12px;
          border-radius: 10px; border: none;
          background: #0a0a0a; color: white;
          font-size: 14px; font-weight: 600;
          cursor: pointer; font-family: 'Geist', sans-serif;
          transition: all 0.2s; margin-top: 4px;
        }
        .am-submit:hover:not(:disabled) { background: #1a1a1a; transform: translateY(-1px); box-shadow: 0 4px 14px rgba(0,0,0,0.15); }
        .am-submit:disabled { opacity: 0.6; cursor: not-allowed; }

        .am-switch { text-align: center; margin-top: 14px; font-size: 13px; color: #71717a; }
        .am-switch-btn { color: #7c3aed; font-weight: 500; cursor: pointer; background: none; border: none; font-family: 'Geist', sans-serif; font-size: 13px; }
        .am-switch-btn:hover { text-decoration: underline; }

        .am-terms { text-align: center; font-size: 11px; color: #a1a1aa; margin-top: 12px; line-height: 1.5; }

        /* RESPONSIVE */
        @media (max-width: 480px) {
          .am-overlay { padding: 0; align-items: flex-end; }
          .am-box { border-radius: 24px 24px 0 0; max-width: 100%; max-height: 92vh; }
          .am-top { padding: 26px 22px 22px; }
          .am-body { padding: 22px 22px 28px; }
          .am-headline { font-size: 23px; }
        }

        @media (max-width: 360px) {
          .am-top { padding: 22px 18px 20px; }
          .am-body { padding: 18px 18px 24px; }
        }
      `}</style>

      <div className="am-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
        <div className="am-box">

          {/* TOP */}
          <div className="am-top">
            <div className="am-top-grid" />
            <div className="am-top-glow" />
            <button className="am-close" onClick={onClose}>✕</button>

            <div className="am-brand">
              <img src="/logo.png" style={{ height: "30px", width: "30px", borderRadius: "8px" }} />
              <span className="am-brand-name">Soni AI Agents</span>
            </div>

            {tab === "signup" ? (
              <>
                <div className="am-headline">Start your<br /><em>free trial today</em></div>
                <div className="am-subline">Set up your AI agent in minutes. No credit card needed.</div>
                <div className="am-trial">
                  <div className="am-trial-dot" />
                  1-day free trial included
                </div>
              </>
            ) : (
              <>
                <div className="am-headline">Welcome<br /><em>back</em></div>
                <div className="am-subline">Your AI agent is waiting. Login to continue.</div>
              </>
            )}
          </div>

          {/* BODY */}
          <div className="am-body">
            <div className="am-tabs">
              <button className={`am-tab ${tab === "login" ? "on" : ""}`} onClick={() => setTab("login")}>Login</button>
              <button className={`am-tab ${tab === "signup" ? "on" : ""}`} onClick={() => setTab("signup")}>Sign Up Free</button>
            </div>

            <button className="am-google" onClick={handleGoogle} disabled={loading}>
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>

            <div className="am-div">
              <div className="am-div-line" /><span className="am-div-txt">or</span><div className="am-div-line" />
            </div>

            {error && <div className="am-err">⚠ {error}</div>}
            {success && <div className="am-ok">✓ {success}</div>}

            {tab === "signup" && (
              <div className="am-field">
                <label className="am-label">Full Name</label>
                <input className="am-input" type="text" placeholder="Rahul Sharma" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
            )}
            <div className="am-field">
              <label className="am-label">Email</label>
              <input className="am-input" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleEmailAuth()} />
            </div>
            <div className="am-field">
              <label className="am-label">Password</label>
              <input className="am-input" type="password" placeholder={tab === "signup" ? "Min. 8 characters" : "Your password"} value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleEmailAuth()} />
            </div>

            <button className="am-submit" onClick={handleEmailAuth} disabled={loading}>
              {loading ? "Please wait..." : tab === "signup" ? "Create Account — Start Free Trial" : "Login to Dashboard →"}
            </button>

            <div className="am-switch">
              {tab === "login"
                ? <> Don't have an account? <button className="am-switch-btn" onClick={() => setTab("signup")}>Sign up free</button></>
                : <> Already have an account? <button className="am-switch-btn" onClick={() => setTab("login")}>Login</button></>
              }
            </div>

            {tab === "signup" && (
              <div className="am-terms">By signing up you agree to our Terms of Service.<br />1-day free trial · No credit card required.</div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}