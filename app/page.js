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
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        html, body { margin: 0; padding: 0; overflow-x: hidden; }
        * { box-sizing: border-box; }

        .nature-bg {
          min-height: 100vh; position: relative; overflow: hidden;
          background: linear-gradient(180deg, #87CEEB 0%, #b8e4f7 25%, #c8ecd8 60%, #a8d5b5 100%);
          font-family: 'DM Sans', sans-serif;
        }

        .sun { position: absolute; top: 60px; right: 12%; width: 100px; height: 100px; background: radial-gradient(circle, #fff9c4 30%, #ffd54f 60%, rgba(255,213,79,0) 100%); border-radius: 50%; animation: sunPulse 4s ease-in-out infinite; box-shadow: 0 0 60px rgba(255,213,79,0.6); }
        @keyframes sunPulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.08); } }

        .cloud { position: absolute; background: rgba(255,255,255,0.85); border-radius: 50px; filter: blur(6px); }
        .cloud-1 { top: 8%; left: 5%; width: 180px; height: 55px; animation: cloudFloat 8s ease-in-out infinite; }
        .cloud-2 { top: 14%; left: 28%; width: 140px; height: 45px; animation: cloudFloat 11s ease-in-out infinite 2s; }
        .cloud-3 { top: 6%; right: 20%; width: 200px; height: 60px; animation: cloudFloat 9s ease-in-out infinite 1s; }
        .cloud-4 { top: 18%; right: 8%; width: 120px; height: 40px; animation: cloudFloat 10s ease-in-out infinite 3s; }
        @keyframes cloudFloat { 0%, 100% { transform: translateX(0px); } 50% { transform: translateX(20px); } }

        .bird { position: absolute; font-size: 18px; animation: birdFly linear infinite; opacity: 0; }
        .bird-1 { top: 15%; animation-duration: 12s; }
        .bird-2 { top: 20%; animation-duration: 16s; animation-delay: 3s; }
        .bird-3 { top: 12%; animation-duration: 14s; animation-delay: 6s; }
        .bird-4 { top: 25%; animation-duration: 18s; animation-delay: 1s; }
        @keyframes birdFly { 0% { transform: translateX(-80px); opacity: 0; } 5% { opacity: 1; } 95% { opacity: 1; } 100% { transform: translateX(110vw); opacity: 0; } }

        .mountains-back { position: absolute; bottom: 0; left: 0; right: 0; height: 40vh; background: linear-gradient(180deg, #4a8a4a 0%, #2d6a2d 100%); clip-path: polygon(0% 100%, 0% 65%, 5% 40%, 10% 60%, 15% 30%, 20% 55%, 25% 25%, 30% 50%, 35% 20%, 40% 48%, 45% 28%, 50% 52%, 55% 22%, 60% 48%, 65% 25%, 70% 50%, 75% 22%, 80% 48%, 85% 30%, 90% 55%, 95% 35%, 100% 55%, 100% 100%); }
        .mountains-front { position: absolute; bottom: 0; left: 0; right: 0; height: 28vh; background: linear-gradient(180deg, #2d5a27 0%, #1a3d1a 100%); clip-path: polygon(0% 100%, 0% 70%, 4% 45%, 8% 65%, 12% 35%, 16% 60%, 20% 30%, 24% 55%, 28% 25%, 32% 52%, 36% 32%, 40% 55%, 44% 20%, 48% 50%, 52% 28%, 56% 52%, 60% 22%, 64% 50%, 68% 30%, 72% 55%, 76% 25%, 80% 52%, 84% 32%, 88% 58%, 92% 35%, 96% 58%, 100% 40%, 100% 100%); }
        .trees { position: absolute; bottom: 0; left: 0; right: 0; height: 15vh; background: linear-gradient(180deg, #1a4a15 0%, #0f2e0f 100%); clip-path: polygon(0% 100%, 0% 75%, 2% 50%, 4% 70%, 6% 40%, 8% 65%, 10% 35%, 12% 60%, 14% 30%, 16% 55%, 18% 40%, 20% 60%, 22% 25%, 24% 55%, 26% 35%, 28% 58%, 30% 28%, 32% 55%, 34% 38%, 36% 60%, 38% 22%, 40% 55%, 42% 32%, 44% 58%, 46% 28%, 48% 52%, 50% 35%, 52% 58%, 54% 25%, 56% 52%, 58% 35%, 60% 58%, 62% 22%, 64% 52%, 66% 35%, 68% 58%, 70% 28%, 72% 52%, 74% 35%, 76% 58%, 78% 25%, 80% 52%, 82% 32%, 84% 58%, 86% 28%, 88% 52%, 90% 38%, 92% 60%, 94% 30%, 96% 55%, 98% 40%, 100% 60%, 100% 100%); }
        .grass { position: absolute; bottom: 0; left: 0; right: 0; height: 6vh; background: linear-gradient(180deg, #2d7a2d, #1a4a1a); }

        .navbar { position: fixed; top: 0; left: 0; right: 0; z-index: 100; display: flex; justify-content: space-between; align-items: center; padding: 16px 32px; background: rgba(255,255,255,0.25); backdrop-filter: blur(20px); border-bottom: 1px solid rgba(255,255,255,0.4); }

        .nav-link { padding: 7px 16px; border-radius: 50px; background: rgba(255,255,255,0.55); border: 1px solid rgba(255,255,255,0.8); color: #1a2e1a; font-size: 13px; font-weight: 500; text-decoration: none; transition: all 0.2s; }
        .nav-link:hover { background: rgba(255,255,255,0.85); }

        .btn-login { padding: 8px 20px; border-radius: 50px; background: rgba(255,255,255,0.7); border: 1.5px solid rgba(255,255,255,0.9); color: #1a2e1a; font-size: 14px; font-weight: 500; cursor: pointer; transition: all 0.2s; font-family: 'DM Sans', sans-serif; }
        .btn-login:hover { background: rgba(255,255,255,0.9); }
        .btn-signup { padding: 8px 20px; border-radius: 50px; background: linear-gradient(135deg, #2d5a27, #4a7c59); border: none; color: white; font-size: 14px; font-weight: 500; cursor: pointer; transition: all 0.2s; font-family: 'DM Sans', sans-serif; box-shadow: 0 4px 15px rgba(45,90,39,0.3); }
        .btn-signup:hover { transform: translateY(-1px); }

        .hero { position: relative; z-index: 10; min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 120px 24px 280px; }

        .btn-hero-primary { padding: 15px 36px; border-radius: 50px; background: linear-gradient(135deg, #2d5a27, #4a7c59); border: none; color: white; font-size: 15px; font-weight: 600; cursor: pointer; box-shadow: 0 8px 30px rgba(45,90,39,0.35); transition: all 0.2s; font-family: 'DM Sans', sans-serif; text-decoration: none; display: inline-block; }
        .btn-hero-primary:hover { transform: translateY(-2px); }
        .btn-hero-secondary { padding: 15px 36px; border-radius: 50px; background: rgba(255,255,255,0.75); border: 1.5px solid rgba(255,255,255,0.9); color: #1a2e1a; font-size: 15px; font-weight: 600; cursor: pointer; backdrop-filter: blur(10px); transition: all 0.2s; font-family: 'DM Sans', sans-serif; }
        .btn-hero-secondary:hover { background: rgba(255,255,255,0.9); }

        .avatar-btn { display: flex; align-items: center; gap: 8px; background: rgba(255,255,255,0.8); border: 1.5px solid rgba(255,255,255,0.9); border-radius: 50px; padding: 6px 14px 6px 6px; cursor: pointer; }
        .dropdown { position: absolute; top: 52px; right: 0; background: rgba(255,255,255,0.97); border-radius: 16px; padding: 8px; box-shadow: 0 10px 40px rgba(0,0,0,0.15); min-width: 170px; z-index: 200; }
        .dropdown-item { display: block; width: 100%; text-align: left; padding: 10px 14px; border-radius: 10px; font-size: 13px; background: transparent; border: none; cursor: pointer; font-family: 'DM Sans', sans-serif; text-decoration: none; }
        .dropdown-item:hover { background: #f0f7f0; }

        .section-bg { position: relative; z-index: 10; background: rgba(255,255,255,0.15); backdrop-filter: blur(8px); padding: 80px 24px; }

        .agent-card { background: rgba(255,255,255,0.65); backdrop-filter: blur(12px); border: 1.5px solid rgba(255,255,255,0.85); border-radius: 24px; padding: 32px; cursor: pointer; transition: all 0.3s; position: relative; box-shadow: 0 4px 20px rgba(45,90,39,0.08); }
        .agent-card:hover { transform: translateY(-6px); box-shadow: 0 16px 40px rgba(45,90,39,0.18); }

        .feature-card { background: rgba(255,255,255,0.6); backdrop-filter: blur(12px); border: 1px solid rgba(255,255,255,0.8); border-radius: 20px; padding: 28px; transition: all 0.3s; }
        .feature-card:hover { background: rgba(255,255,255,0.8); transform: translateY(-4px); }

        .footer { position: relative; z-index: 10; background: rgba(26,46,26,0.94); backdrop-filter: blur(20px); padding: 50px 24px 28px; }
        .footer-link { color: rgba(255,255,255,0.6); font-size: 14px; text-decoration: none; transition: color 0.2s; display: block; margin-bottom: 10px; background: none; border: none; cursor: pointer; font-family: 'DM Sans', sans-serif; padding: 0; text-align: left; }
        .footer-link:hover { color: white; }

        @keyframes fadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }

        @media(max-width: 768px) {
          .navbar { padding: 14px 16px; }
          .nav-links { display: none !important; }
          .hero { padding: 100px 20px 220px; }
          .sun { width: 70px; height: 70px; right: 8%; top: 80px; }
          .stats-mini { grid-template-columns: 1fr 1fr !important; }
          .footer-grid { grid-template-columns: 1fr 1fr !important; gap: 28px !important; }
          .footer-bottom { flex-direction: column !important; text-align: center; }
        }
        @media(max-width: 480px) {
          .stats-mini { grid-template-columns: 1fr 1fr !important; }
          .footer-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <div className="nature-bg">
        <div className="sun" />
        <div className="cloud cloud-1" /><div className="cloud cloud-2" />
        <div className="cloud cloud-3" /><div className="cloud cloud-4" />
        <div className="bird bird-1">🐦</div><div className="bird bird-2">🐦</div>
        <div className="bird bird-3">🐦</div><div className="bird bird-4">🐦</div>
        <div className="mountains-back" /><div className="mountains-front" />
        <div className="trees" /><div className="grass" />

        {/* Navbar */}
        <nav className="navbar">
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "24px" }}>🌿</span>
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "20px", fontWeight: "700", color: "#1a2e1a" }}>Vasu Agents</span>
          </div>

          <div className="nav-links" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Link href="/about" className="nav-link">About</Link>
            <Link href="/pricing" className="nav-link">Pricing</Link>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {user ? (
              <div style={{ position: "relative" }}>
                <button className="avatar-btn" onClick={() => setShowDropdown(!showDropdown)}>
                  <img src={user.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.user_metadata?.full_name || user.email)}&background=2d5a27&color=fff&size=32`} style={{ width: "32px", height: "32px", borderRadius: "50%", objectFit: "cover" }} />
                  <span style={{ fontSize: "13px", fontWeight: "500", color: "#1a2e1a" }}>{user.user_metadata?.full_name?.split(" ")[0] || user.email?.split("@")[0]}</span>
                  <span style={{ fontSize: "10px", color: "#5a7a5a" }}>▼</span>
                </button>
                {showDropdown && (
                  <div className="dropdown">
                    <div style={{ padding: "8px 14px 10px", fontSize: "11px", color: "#9ca3af", borderBottom: "1px solid #f0f0f0", marginBottom: "4px" }}>{user.email}</div>
                    <Link href="/dashboard" className="dropdown-item" style={{ color: "#1a2e1a" }} onClick={() => setShowDropdown(false)}>Dashboard</Link>
                    <button className="dropdown-item" style={{ color: "#dc2626" }} onClick={handleLogout}>Logout</button>
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
          <p style={{ fontSize: "12px", fontWeight: "600", letterSpacing: "3px", textTransform: "uppercase", color: "#2d6a2d", marginBottom: "16px", animation: "fadeUp 0.8s ease forwards" }}>
            🌱 AI Agents for Indian Businesses
          </p>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(42px, 9vw, 88px)", fontWeight: "700", lineHeight: 1.05, color: "#1a2e1a", marginBottom: "20px", textShadow: "0 2px 20px rgba(255,255,255,0.5)", animation: "fadeUp 0.8s ease 0.15s forwards", opacity: 0 }}>
            Your Business,<br />Always Awake
          </h1>
          <p style={{ fontSize: "clamp(15px, 2vw, 19px)", color: "#3d5a3d", maxWidth: "540px", lineHeight: 1.7, marginBottom: "40px", animation: "fadeUp 0.8s ease 0.3s forwards", opacity: 0 }}>
            While you sleep, your AI agent replies to customers, answers questions, and books appointments — automatically. No extra effort, no missed leads.
          </p>
          {!user ? (
            <div style={{ display: "flex", gap: "14px", flexWrap: "wrap", justifyContent: "center", animation: "fadeUp 0.8s ease 0.45s forwards", opacity: 0 }}>
              <button className="btn-hero-primary" onClick={() => openAuth("signup")}>Start Free 🌿</button>
              <button className="btn-hero-secondary" onClick={() => openAuth("login")}>Login</button>
            </div>
          ) : (
            <div style={{ display: "flex", gap: "14px", flexWrap: "wrap", justifyContent: "center" }}>
              <Link href="/dashboard" className="btn-hero-primary">Go to Dashboard 🌿</Link>
            </div>
          )}
        </section>

        {/* Stats */}
        <div style={{ position: "relative", zIndex: 10, padding: "0 24px 60px" }}>
          <div className="stats-mini" style={{ maxWidth: "900px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px" }}>
            {[
              { value: "24/7", label: "Always online", icon: "🌙" },
              { value: "<2s", label: "Reply time", icon: "⚡" },
              { value: "100%", label: "Queries handled", icon: "✅" },
              { value: "₹0", label: "Per reply cost", icon: "💰" },
            ].map((stat) => (
              <div key={stat.label} style={{ background: "rgba(255,255,255,0.6)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.8)", borderRadius: "18px", padding: "22px", textAlign: "center" }}>
                <div style={{ fontSize: "22px", marginBottom: "8px" }}>{stat.icon}</div>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "26px", fontWeight: "700", color: "#1a2e1a" }}>{stat.value}</div>
                <div style={{ fontSize: "12px", color: "#5a7a5a", marginTop: "4px" }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Agents */}
        <div className="section-bg">
          <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: "50px" }}>
              <p style={{ fontSize: "12px", fontWeight: "600", letterSpacing: "3px", textTransform: "uppercase", color: "#2d6a2d", marginBottom: "12px" }}>Our AI Agents</p>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(28px, 5vw, 46px)", fontWeight: "700", color: "#1a2e1a", marginBottom: "14px" }}>Pick Your Agent, We Do the Rest</h2>
              <p style={{ color: "#5a7a5a", fontSize: "16px", maxWidth: "500px", margin: "0 auto", lineHeight: 1.7 }}>Set it up once and let AI handle your customers around the clock.</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px" }}>
              {[
                { icon: "💬", name: "WhatsApp Agent", desc: "Customers message you on WhatsApp — AI replies instantly. Handles queries, timings, bookings, and everything in between. Works round the clock so you don't have to.", tag: "Most Popular", tagColor: "#25D366", slug: "whatsapp-setup", features: ["Auto-replies 24/7", "Answers FAQs", "Books appointments", "Hindi & English"] },
                { icon: "📧", name: "Email Agent", desc: "Every customer email gets a smart, professional reply within seconds. No more long email backlogs or missed inquiries — your AI handles it all.", tag: "New", tagColor: "#4a9eff", slug: "email-setup", features: ["Instant email replies", "Professional tone", "Any email service", "Conversation history"] },
              ].map((agent) => (
                <div key={agent.slug} className="agent-card" onClick={() => user ? window.location.href = `/dashboard/${agent.slug}` : openAuth("signup")}>
                  {agent.tag && <span style={{ position: "absolute", top: "16px", right: "16px", background: agent.tagColor, color: "white", fontSize: "11px", fontWeight: "600", padding: "4px 12px", borderRadius: "50px" }}>{agent.tag}</span>}
                  <div style={{ width: "56px", height: "56px", background: "rgba(255,255,255,0.9)", borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px", marginBottom: "16px", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}>{agent.icon}</div>
                  <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "24px", fontWeight: "700", color: "#1a2e1a", marginBottom: "10px" }}>{agent.name}</h3>
                  <p style={{ color: "#5a7a5a", fontSize: "14px", lineHeight: 1.7, marginBottom: "20px" }}>{agent.desc}</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "20px" }}>
                    {agent.features.map((f) => <span key={f} style={{ background: "rgba(45,90,39,0.08)", color: "#2d5a27", fontSize: "12px", fontWeight: "500", padding: "4px 10px", borderRadius: "50px" }}>✓ {f}</span>)}
                  </div>
                  <div style={{ color: "#2d5a27", fontSize: "13px", fontWeight: "600" }}>{user ? "Set it up →" : "Sign up to try →"}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div style={{ position: "relative", zIndex: 10, padding: "80px 24px" }}>
          <div style={{ maxWidth: "900px", margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: "50px" }}>
              <p style={{ fontSize: "12px", fontWeight: "600", letterSpacing: "3px", textTransform: "uppercase", color: "#2d6a2d", marginBottom: "12px" }}>How It Works</p>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(28px, 5vw, 42px)", fontWeight: "700", color: "#1a2e1a" }}>Up and running in minutes</h2>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px" }}>
              {[
                { step: "01", icon: "📝", title: "Fill the form", desc: "Tell us about your business — timings, services, pricing, location." },
                { step: "02", icon: "⚙️", title: "We set it up", desc: "Our team activates your agent within 24 hours. No technical work needed." },
                { step: "03", icon: "🤖", title: "AI goes live", desc: "Your agent starts replying to customers automatically — day and night." },
                { step: "04", icon: "📈", title: "You grow", desc: "Focus on your actual work while AI handles all incoming queries." },
              ].map((item) => (
                <div key={item.step} className="feature-card">
                  <div style={{ fontSize: "11px", fontWeight: "700", color: "#4a7c59", letterSpacing: "2px", marginBottom: "12px" }}>STEP {item.step}</div>
                  <div style={{ fontSize: "28px", marginBottom: "12px" }}>{item.icon}</div>
                  <div style={{ fontSize: "15px", fontWeight: "700", color: "#1a2e1a", marginBottom: "8px" }}>{item.title}</div>
                  <div style={{ fontSize: "13px", color: "#5a7a5a", lineHeight: 1.6 }}>{item.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Who Is It For */}
        <div className="section-bg">
          <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: "50px" }}>
              <p style={{ fontSize: "12px", fontWeight: "600", letterSpacing: "3px", textTransform: "uppercase", color: "#2d6a2d", marginBottom: "12px" }}>Who Uses Vasu Agents</p>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(28px, 5vw, 42px)", fontWeight: "700", color: "#1a2e1a" }}>Built for real Indian businesses</h2>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "16px" }}>
              {[
                { icon: "🏥", name: "Clinics & Doctors" },
                { icon: "🍽️", name: "Restaurants" },
                { icon: "💇", name: "Salons & Spas" },
                { icon: "🏠", name: "Real Estate" },
                { icon: "📚", name: "Coaching Centers" },
                { icon: "🛍️", name: "Online Stores" },
              ].map((biz) => (
                <div key={biz.name} style={{ background: "rgba(255,255,255,0.6)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.8)", borderRadius: "18px", padding: "24px 16px", textAlign: "center" }}>
                  <div style={{ fontSize: "32px", marginBottom: "10px" }}>{biz.icon}</div>
                  <div style={{ fontSize: "13px", fontWeight: "600", color: "#1a2e1a" }}>{biz.name}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div style={{ position: "relative", zIndex: 10, padding: "80px 24px 100px", textAlign: "center" }}>
          <div style={{ maxWidth: "600px", margin: "0 auto" }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(28px, 5vw, 46px)", fontWeight: "700", color: "#1a2e1a", marginBottom: "16px" }}>Ready to stop missing customers?</h2>
            <p style={{ color: "#5a7a5a", fontSize: "16px", lineHeight: 1.7, marginBottom: "36px" }}>Join businesses that never miss a customer inquiry — even at 2am.</p>
            {!user ? (
              <button className="btn-hero-primary" onClick={() => openAuth("signup")} style={{ fontSize: "16px", padding: "16px 44px" }}>Get Started Free 🌿</button>
            ) : (
              <Link href="/dashboard" className="btn-hero-primary" style={{ fontSize: "16px", padding: "16px 44px" }}>Go to Dashboard 🌿</Link>
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className="footer">
          <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
            <div className="footer-grid" style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: "40px", marginBottom: "40px" }}>

              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
                  <span style={{ fontSize: "22px" }}>🌿</span>
                  <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "20px", fontWeight: "700", color: "white" }}>Vasu Agents</span>
                </div>
                <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "14px", lineHeight: 1.75, margin: "0 0 12px", maxWidth: "260px" }}>
                  AI agents for Indian businesses. Set up once, run forever. Your customers get instant replies — even at 2am.
                </p>
                <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "12px", margin: 0 }}>Kota, Rajasthan, India</p>
              </div>

              <div>
                <p style={{ color: "white", fontSize: "13px", fontWeight: "700", marginBottom: "14px" }}>Product</p>
                <Link href="/agents/whatsapp-agent" className="footer-link">WhatsApp Agent</Link>
                <Link href="/agents/email-agent" className="footer-link">Email Agent</Link>
                <Link href="/pricing" className="footer-link">Pricing</Link>
              </div>

              <div>
                <p style={{ color: "white", fontSize: "13px", fontWeight: "700", marginBottom: "14px" }}>Company</p>
                <Link href="/about" className="footer-link">About Us</Link>
                <a href="mailto:vasusoni1068@gmail.com" className="footer-link">Contact</a>
              </div>

              <div>
                <p style={{ color: "white", fontSize: "13px", fontWeight: "700", marginBottom: "14px" }}>Account</p>
                {user ? (
                  <Link href="/dashboard" className="footer-link">Dashboard</Link>
                ) : (
                  <>
                    <button onClick={() => openAuth("login")} className="footer-link">Login</button>
                    <button onClick={() => openAuth("signup")} className="footer-link">Sign Up Free</button>
                  </>
                )}
              </div>
            </div>

            <div className="footer-bottom" style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "20px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
              <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "13px", margin: 0 }}>2025 Vasu Agents. All rights reserved.</p>
              <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "13px", margin: 0 }}>Made with 🌿 in Kota, India</p>
            </div>
          </div>
        </footer>

      </div>

      <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} defaultTab={authTab} />
      {showDropdown && <div style={{ position: "fixed", inset: 0, zIndex: 40 }} onClick={() => setShowDropdown(false)} />}
    </>
  );
}