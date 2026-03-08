"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import AuthModal from "./components/AuthModal";
import Link from "next/link";

export default function Home() {
  const [user, setUser] = useState(null);
  const [showAuth, setShowAuth] = useState(false);
  const [authTab, setAuthTab] = useState("login");
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };
    getUser();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setShowDropdown(false);
  };

  const openAuth = (tab) => {
    setAuthTab(tab);
    setShowAuth(true);
  };

  return (
    <>
      <style>{`
        html, body { margin: 0; padding: 0; overflow-x: hidden; }

        .nature-bg {
          min-height: 100vh;
          position: relative;
          overflow: hidden;
          background: linear-gradient(180deg, #87CEEB 0%, #b8e4f7 25%, #c8ecd8 60%, #a8d5b5 100%);
        }

        /* Sun */
        .sun {
          position: absolute;
          top: 60px;
          right: 12%;
          width: 100px;
          height: 100px;
          background: radial-gradient(circle, #fff9c4 30%, #ffd54f 60%, rgba(255,213,79,0) 100%);
          border-radius: 50%;
          animation: sunPulse 4s ease-in-out infinite;
          box-shadow: 0 0 60px rgba(255,213,79,0.6);
        }

        @keyframes sunPulse {
          0%, 100% { transform: scale(1); box-shadow: 0 0 60px rgba(255,213,79,0.6); }
          50% { transform: scale(1.08); box-shadow: 0 0 90px rgba(255,213,79,0.8); }
        }

        /* Clouds */
        .cloud {
          position: absolute;
          background: rgba(255,255,255,0.85);
          border-radius: 50px;
          filter: blur(6px);
        }
        .cloud-1 { top: 8%; left: 5%; width: 180px; height: 55px; animation: cloudFloat 8s ease-in-out infinite; }
        .cloud-2 { top: 14%; left: 28%; width: 140px; height: 45px; animation: cloudFloat 11s ease-in-out infinite 2s; }
        .cloud-3 { top: 6%; right: 20%; width: 200px; height: 60px; animation: cloudFloat 9s ease-in-out infinite 1s; }
        .cloud-4 { top: 18%; right: 8%; width: 120px; height: 40px; animation: cloudFloat 10s ease-in-out infinite 3s; }

        @keyframes cloudFloat {
          0%, 100% { transform: translateX(0px); }
          50% { transform: translateX(20px); }
        }

        /* Birds */
        .bird {
          position: absolute;
          font-size: 18px;
          animation: birdFly linear infinite;
          opacity: 0;
        }
        .bird-1 { top: 15%; animation-duration: 12s; animation-delay: 0s; }
        .bird-2 { top: 20%; animation-duration: 16s; animation-delay: 3s; }
        .bird-3 { top: 12%; animation-duration: 14s; animation-delay: 6s; }
        .bird-4 { top: 25%; animation-duration: 18s; animation-delay: 1s; }

        @keyframes birdFly {
          0% { transform: translateX(-80px); opacity: 0; }
          5% { opacity: 1; }
          95% { opacity: 1; }
          100% { transform: translateX(110vw); opacity: 0; }
        }

        /* Mountains back */
        .mountains-back {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 40vh;
          background: linear-gradient(180deg, #4a8a4a 0%, #2d6a2d 100%);
          clip-path: polygon(0% 100%, 0% 65%, 5% 40%, 10% 60%, 15% 30%, 20% 55%, 25% 25%, 30% 50%, 35% 20%, 40% 48%, 45% 28%, 50% 52%, 55% 22%, 60% 48%, 65% 25%, 70% 50%, 75% 22%, 80% 48%, 85% 30%, 90% 55%, 95% 35%, 100% 55%, 100% 100%);
        }

        /* Mountains front */
        .mountains-front {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 28vh;
          background: linear-gradient(180deg, #2d5a27 0%, #1a3d1a 100%);
          clip-path: polygon(0% 100%, 0% 70%, 4% 45%, 8% 65%, 12% 35%, 16% 60%, 20% 30%, 24% 55%, 28% 25%, 32% 52%, 36% 32%, 40% 55%, 44% 20%, 48% 50%, 52% 28%, 56% 52%, 60% 22%, 64% 50%, 68% 30%, 72% 55%, 76% 25%, 80% 52%, 84% 32%, 88% 58%, 92% 35%, 96% 58%, 100% 40%, 100% 100%);
        }

        /* Trees */
        .trees {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 15vh;
          background: linear-gradient(180deg, #1a4a15 0%, #0f2e0f 100%);
          clip-path: polygon(0% 100%, 0% 75%, 2% 50%, 4% 70%, 6% 40%, 8% 65%, 10% 35%, 12% 60%, 14% 30%, 16% 55%, 18% 40%, 20% 60%, 22% 25%, 24% 55%, 26% 35%, 28% 58%, 30% 28%, 32% 55%, 34% 38%, 36% 60%, 38% 22%, 40% 55%, 42% 32%, 44% 58%, 46% 28%, 48% 52%, 50% 35%, 52% 58%, 54% 25%, 56% 52%, 58% 35%, 60% 58%, 62% 22%, 64% 52%, 66% 35%, 68% 58%, 70% 28%, 72% 52%, 74% 35%, 76% 58%, 78% 25%, 80% 52%, 82% 32%, 84% 58%, 86% 28%, 88% 52%, 90% 38%, 92% 60%, 94% 30%, 96% 55%, 98% 40%, 100% 60%, 100% 100%);
        }

        /* Grass */
        .grass {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 6vh;
          background: linear-gradient(180deg, #2d7a2d, #1a4a1a);
        }

        /* Navbar */
        .navbar {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 100;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 32px;
          background: rgba(255,255,255,0.25);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255,255,255,0.4);
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 8px;
          text-decoration: none;
        }

        .logo-text {
          font-family: 'Playfair Display', serif;
          font-size: 20px;
          font-weight: 700;
          color: #1a2e1a;
        }

        .btn-login {
          padding: 8px 22px;
          border-radius: 50px;
          background: rgba(255,255,255,0.7);
          border: 1.5px solid rgba(255,255,255,0.9);
          color: #1a2e1a;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          font-family: 'DM Sans', sans-serif;
        }
        .btn-login:hover { background: rgba(255,255,255,0.9); }

        .btn-signup {
          padding: 8px 22px;
          border-radius: 50px;
          background: linear-gradient(135deg, #2d5a27, #4a7c59);
          border: none;
          color: white;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          font-family: 'DM Sans', sans-serif;
          box-shadow: 0 4px 15px rgba(45,90,39,0.3);
        }
        .btn-signup:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(45,90,39,0.4); }

        /* Hero */
        .hero {
          position: relative;
          z-index: 10;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 120px 24px 220px;
        }

        .hero-tag {
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: #2d6a2d;
          margin-bottom: 16px;
          animation: fadeUp 0.8s ease forwards;
        }

        .hero-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(42px, 9vw, 88px);
          font-weight: 700;
          line-height: 1.05;
          color: #1a2e1a;
          margin-bottom: 20px;
          text-shadow: 0 2px 20px rgba(255,255,255,0.5);
          animation: fadeUp 0.8s ease 0.15s forwards;
          opacity: 0;
        }

        .hero-sub {
          font-size: clamp(15px, 2vw, 19px);
          color: #3d5a3d;
          max-width: 480px;
          line-height: 1.7;
          margin-bottom: 40px;
          animation: fadeUp 0.8s ease 0.3s forwards;
          opacity: 0;
        }

        .hero-buttons {
          display: flex;
          gap: 14px;
          flex-wrap: wrap;
          justify-content: center;
          animation: fadeUp 0.8s ease 0.45s forwards;
          opacity: 0;
        }

        .btn-hero-primary {
          padding: 15px 36px;
          border-radius: 50px;
          background: linear-gradient(135deg, #2d5a27, #4a7c59);
          border: none;
          color: white;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          box-shadow: 0 8px 30px rgba(45,90,39,0.35);
          transition: all 0.2s;
          font-family: 'DM Sans', sans-serif;
        }
        .btn-hero-primary:hover { transform: translateY(-2px); box-shadow: 0 12px 35px rgba(45,90,39,0.45); }

        .btn-hero-secondary {
          padding: 15px 36px;
          border-radius: 50px;
          background: rgba(255,255,255,0.75);
          border: 1.5px solid rgba(255,255,255,0.9);
          color: #1a2e1a;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          backdrop-filter: blur(10px);
          transition: all 0.2s;
          font-family: 'DM Sans', sans-serif;
        }
        .btn-hero-secondary:hover { background: rgba(255,255,255,0.9); }

        /* Avatar dropdown */
        .avatar-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(255,255,255,0.8);
          border: 1.5px solid rgba(255,255,255,0.9);
          border-radius: 50px;
          padding: 6px 14px 6px 6px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .avatar-btn:hover { background: rgba(255,255,255,0.95); }

        .dropdown {
          position: absolute;
          top: 52px;
          right: 0;
          background: rgba(255,255,255,0.97);
          border-radius: 16px;
          padding: 8px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.15);
          min-width: 170px;
          z-index: 200;
        }

        .dropdown-item {
          display: block;
          width: 100%;
          text-align: left;
          padding: 10px 14px;
          border-radius: 10px;
          font-size: 13px;
          background: transparent;
          border: none;
          cursor: pointer;
          transition: background 0.2s;
          font-family: 'DM Sans', sans-serif;
          text-decoration: none;
        }
        .dropdown-item:hover { background: #f0f7f0; }
        .dropdown-item-red { color: #dc2626; }
        .dropdown-item-red:hover { background: #fff5f5 !important; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* Mobile */
        @media (max-width: 640px) {
          .navbar { padding: 14px 20px; }
          .hero { padding: 100px 20px 200px; }
          .sun { width: 70px; height: 70px; right: 8%; top: 80px; }
        }
      `}</style>

      <div className="nature-bg">
        {/* Nature Elements */}
        <div className="sun" />
        <div className="cloud cloud-1" />
        <div className="cloud cloud-2" />
        <div className="cloud cloud-3" />
        <div className="cloud cloud-4" />
        <div className="bird bird-1">🐦</div>
        <div className="bird bird-2">🐦</div>
        <div className="bird bird-3">🐦</div>
        <div className="bird bird-4">🐦</div>
        <div className="mountains-back" />
        <div className="mountains-front" />
        <div className="trees" />
        <div className="grass" />

        {/* Navbar */}
        <nav className="navbar">
          <div className="logo">
            <span style={{ fontSize: "24px" }}>🌿</span>
            <span className="logo-text">Vasu Agents</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {user ? (
              <div style={{ position: "relative" }}>
                <button className="avatar-btn" onClick={() => setShowDropdown(!showDropdown)}>
                  <img
                    src={user.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.user_metadata?.full_name || user.email)}&background=2d5a27&color=fff&size=32`}
                    style={{ width: "32px", height: "32px", borderRadius: "50%", objectFit: "cover" }}
                  />
                  <span style={{ fontSize: "13px", fontWeight: "500", color: "#1a2e1a" }}>
                    {user.user_metadata?.full_name?.split(" ")[0] || user.email?.split("@")[0]}
                  </span>
                  <span style={{ fontSize: "10px", color: "#5a7a5a" }}>▼</span>
                </button>
                {showDropdown && (
                  <div className="dropdown">
                    <div style={{ padding: "8px 14px 10px", fontSize: "11px", color: "#9ca3af", borderBottom: "1px solid #f0f0f0", marginBottom: "4px" }}>
                      {user.email}
                    </div>
                    <Link href="/dashboard" className="dropdown-item" style={{ color: "#1a2e1a" }} onClick={() => setShowDropdown(false)}>
                      🏠 Dashboard
                    </Link>
                    <button className="dropdown-item dropdown-item-red" onClick={handleLogout}>
                      🚪 Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <button className="btn-login" onClick={() => openAuth("login")}>Login</button>
                <button className="btn-signup" onClick={() => openAuth("signup")}>Get Started</button>
              </>
            )}
          </div>
        </nav>

        {/* Hero */}
        <section className="hero">
          <p className="hero-tag">🌱 Welcome to Vasu Agents</p>
          <h1 className="hero-title">Coming Soon</h1>
          <p className="hero-sub">Something beautiful is growing here.</p>

        {/* Agents Section */}
<section style={{
  position: "relative", zIndex: 10,
  padding: "80px 24px",
  maxWidth: "1100px",
  margin: "0 auto"
}}>
  <div style={{ textAlign: "center", marginBottom: "50px" }}>
    <p style={{
      fontSize: "12px", fontWeight: "600", letterSpacing: "3px",
      textTransform: "uppercase", color: "#2d6a2d", marginBottom: "12px"
    }}>🤖 Our AI Agents</p>
    <h2 style={{
      fontFamily: "'Playfair Display', serif",
      fontSize: "clamp(28px, 5vw, 48px)",
      fontWeight: "700", color: "#1a2e1a"
    }}>Agents for Every Business</h2>
  </div>

  <div style={{
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "24px"
  }}>
    {[
      {
        icon: "💬",
        name: "WhatsApp AI Agent",
        desc: "Auto-reply to customer messages, send offers, handle queries 24/7 on WhatsApp.",
        tag: "Most Popular",
        slug: "whatsapp-agent",
        color: "#25D366"
      }
    ].map((agent) => (
      <div
        key={agent.slug}
        onClick={() => user ? window.location.href = `/agents/${agent.slug}` : openAuth("signup")}
        style={{
          background: "rgba(255,255,255,0.65)",
          backdropFilter: "blur(12px)",
          border: "1.5px solid rgba(255,255,255,0.85)",
          borderRadius: "24px",
          padding: "32px",
          cursor: "pointer",
          transition: "all 0.3s",
          position: "relative",
          boxShadow: "0 4px 20px rgba(45,90,39,0.08)"
        }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = "translateY(-6px)";
          e.currentTarget.style.boxShadow = "0 16px 40px rgba(45,90,39,0.18)";
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "0 4px 20px rgba(45,90,39,0.08)";
        }}
      >
        {agent.tag && (
          <span style={{
            position: "absolute", top: "16px", right: "16px",
            background: agent.color, color: "white",
            fontSize: "11px", fontWeight: "600",
            padding: "4px 10px", borderRadius: "50px"
          }}>{agent.tag}</span>
        )}
        <div style={{
          width: "56px", height: "56px",
          background: "rgba(255,255,255,0.9)",
          borderRadius: "16px",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "28px", marginBottom: "16px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
        }}>{agent.icon}</div>
        <h3 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "50px", fontWeight: "700",
          color: "#1a2e1a", marginBottom: "10px"
        }}>{agent.name}</h3>
        <p style={{
          color: "#5a7a5a", fontSize: "14px",
          lineHeight: "1.6", marginBottom: "20px"
        }}>{agent.desc}</p>
        <div style={{
          display: "flex", alignItems: "center",
          color: "#2d5a27", fontSize: "13px", fontWeight: "600", gap: "6px"
        }}>
          {user ? "Try Free →" : "Sign up to try →"}
        </div>
      </div>
    ))}
  </div>
</section>    

          {!user ? (
            <div className="hero-buttons">
              <button className="btn-hero-primary" onClick={() => openAuth("signup")}>
                Get Started Free 🌿
              </button>
              <button className="btn-hero-secondary" onClick={() => openAuth("login")}>
                Login
              </button>
            </div>
          ) : (
            <div className="hero-buttons" style={{ opacity: 1, animation: "none" }}>
              <Link href="/dashboard" className="btn-hero-primary" style={{ textDecoration: "none", display: "inline-block" }}>
                Go to Dashboard 🌿
              </Link>
            </div>
          )}
        </section>
      </div>

      {/* Auth Modal */}
      <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} defaultTab={authTab} />

      {showDropdown && (
        <div style={{ position: "fixed", inset: 0, zIndex: 40 }} onClick={() => setShowDropdown(false)} />
      )}
    </>
  );
}