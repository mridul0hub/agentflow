"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function AboutPage() {
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };
    getUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setShowDropdown(false);
  };

  const firstName = user?.user_metadata?.full_name?.split(" ")[0] || user?.email?.split("@")[0] || "";
  const avatarUrl = user?.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.user_metadata?.full_name || user?.email || "U")}&background=2d5a27&color=fff&size=32`;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        html, body { margin: 0; padding: 0; overflow-x: hidden; }
        * { box-sizing: border-box; }

        .about-page {
          min-height: 100vh;
          background: linear-gradient(180deg, #87CEEB 0%, #b8e4f7 20%, #c8ecd8 55%, #a8d5b5 100%);
          position: relative;
          overflow: hidden;
          font-family: 'DM Sans', sans-serif;
        }

        .sun {
          position: absolute; top: 50px; right: 10%;
          width: 90px; height: 90px;
          background: radial-gradient(circle, #fff9c4 30%, #ffd54f 60%, rgba(255,213,79,0) 100%);
          border-radius: 50%;
          animation: sunPulse 4s ease-in-out infinite;
          box-shadow: 0 0 60px rgba(255,213,79,0.6);
          pointer-events: none;
        }
        @keyframes sunPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.08); }
        }

        .cloud {
          position: absolute; background: rgba(255,255,255,0.8);
          border-radius: 50px; filter: blur(5px); pointer-events: none;
        }
        .c1 { top: 7%; left: 4%; width: 160px; height: 50px; animation: cf 8s ease-in-out infinite; }
        .c2 { top: 12%; left: 30%; width: 120px; height: 40px; animation: cf 11s ease-in-out infinite 2s; }
        .c3 { top: 5%; right: 22%; width: 180px; height: 55px; animation: cf 9s ease-in-out infinite 1s; }
        @keyframes cf { 0%, 100% { transform: translateX(0); } 50% { transform: translateX(18px); } }

        .mountains-back {
          position: absolute; bottom: 0; left: 0; right: 0; height: 35vh;
          background: linear-gradient(180deg, #4a8a4a 0%, #2d6a2d 100%);
          clip-path: polygon(0% 100%, 0% 65%, 5% 40%, 10% 60%, 15% 30%, 20% 55%, 25% 25%, 30% 50%, 35% 20%, 40% 48%, 45% 28%, 50% 52%, 55% 22%, 60% 48%, 65% 25%, 70% 50%, 75% 22%, 80% 48%, 85% 30%, 90% 55%, 95% 35%, 100% 55%, 100% 100%);
          pointer-events: none;
        }
        .mountains-front {
          position: absolute; bottom: 0; left: 0; right: 0; height: 22vh;
          background: linear-gradient(180deg, #2d5a27 0%, #1a3d1a 100%);
          clip-path: polygon(0% 100%, 0% 70%, 4% 45%, 8% 65%, 12% 35%, 16% 60%, 20% 30%, 24% 55%, 28% 25%, 32% 52%, 36% 32%, 40% 55%, 44% 20%, 48% 50%, 52% 28%, 56% 52%, 60% 22%, 64% 50%, 68% 30%, 72% 55%, 76% 25%, 80% 52%, 84% 32%, 88% 58%, 92% 35%, 96% 58%, 100% 40%, 100% 100%);
          pointer-events: none;
        }
        .trees {
          position: absolute; bottom: 0; left: 0; right: 0; height: 12vh;
          background: linear-gradient(180deg, #1a4a15 0%, #0f2e0f 100%);
          clip-path: polygon(0% 100%, 0% 75%, 2% 50%, 4% 70%, 6% 40%, 8% 65%, 10% 35%, 12% 60%, 14% 30%, 16% 55%, 18% 40%, 20% 60%, 22% 25%, 24% 55%, 26% 35%, 28% 58%, 30% 28%, 32% 55%, 34% 38%, 36% 60%, 38% 22%, 40% 55%, 42% 32%, 44% 58%, 46% 28%, 48% 52%, 50% 35%, 52% 58%, 54% 25%, 56% 52%, 58% 35%, 60% 58%, 62% 22%, 64% 52%, 66% 35%, 68% 58%, 70% 28%, 72% 52%, 74% 35%, 76% 58%, 78% 25%, 80% 52%, 82% 32%, 84% 58%, 86% 28%, 88% 52%, 90% 38%, 92% 60%, 94% 30%, 96% 55%, 98% 40%, 100% 60%, 100% 100%);
          pointer-events: none;
        }

        .navbar {
          position: sticky; top: 0; z-index: 100;
          display: flex; justify-content: space-between; align-items: center;
          padding: 15px 32px;
          background: rgba(255,255,255,0.3);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255,255,255,0.5);
        }

        .glass {
          background: rgba(255,255,255,0.65);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(255,255,255,0.85);
          border-radius: 20px;
        }

        .card-hover {
          transition: all 0.3s;
        }
        .card-hover:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 40px rgba(45,90,39,0.14);
          background: rgba(255,255,255,0.82) !important;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .f1 { animation: fadeUp 0.6s ease forwards; }
        .f2 { animation: fadeUp 0.6s ease 0.1s forwards; opacity: 0; }
        .f3 { animation: fadeUp 0.6s ease 0.2s forwards; opacity: 0; }
        .f4 { animation: fadeUp 0.6s ease 0.3s forwards; opacity: 0; }
        .f5 { animation: fadeUp 0.6s ease 0.4s forwards; opacity: 0; }

        .contact-link {
          display: flex; align-items: center; gap: 12px;
          padding: 16px 20px;
          background: rgba(255,255,255,0.55);
          border: 1px solid rgba(255,255,255,0.8);
          border-radius: 14px;
          text-decoration: none;
          color: #1a2e1a;
          transition: all 0.3s;
        }
        .contact-link:hover {
          background: rgba(255,255,255,0.85);
          transform: translateX(5px);
        }

        @media(max-width: 768px) {
          .navbar { padding: 12px 16px; }
          .page-content { padding: 28px 16px 280px !important; }
          .two-col { grid-template-columns: 1fr !important; }
          .three-col { grid-template-columns: 1fr !important; }
          .hero-title { font-size: 34px !important; }
        }
      `}</style>

      <div className="about-page">
        <div className="sun" />
        <div className="cloud c1" /><div className="cloud c2" /><div className="cloud c3" />
        <div className="mountains-back" />
        <div className="mountains-front" />
        <div className="trees" />

        {/* Navbar */}
        <nav className="navbar">
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none" }}>
            <span style={{ fontSize: "24px" }}>🌿</span>
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "20px", fontWeight: "700", color: "#1a2e1a" }}>Vasu Agents</span>
          </Link>

          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Link href="/" style={{ padding: "8px 18px", borderRadius: "50px", background: "rgba(255,255,255,0.65)", border: "1.5px solid rgba(255,255,255,0.9)", color: "#1a2e1a", fontSize: "13px", fontWeight: "500", textDecoration: "none" }}>
              Home
            </Link>
            {user ? (
              <div style={{ position: "relative" }}>
                <button onClick={() => setShowDropdown(!showDropdown)} style={{
                  display: "flex", alignItems: "center", gap: "8px",
                  background: "rgba(255,255,255,0.7)", border: "1.5px solid rgba(255,255,255,0.9)",
                  borderRadius: "50px", padding: "6px 12px 6px 6px", cursor: "pointer"
                }}>
                  <img src={avatarUrl} style={{ width: "28px", height: "28px", borderRadius: "50%", objectFit: "cover" }} />
                  <span style={{ fontSize: "13px", fontWeight: "600", color: "#1a2e1a" }}>{firstName}</span>
                  <span style={{ fontSize: "10px", color: "#5a7a5a" }}>▼</span>
                </button>
                {showDropdown && (
                  <div style={{
                    position: "absolute", top: "46px", right: 0,
                    background: "rgba(255,255,255,0.98)", borderRadius: "16px", padding: "8px",
                    boxShadow: "0 10px 40px rgba(45,90,39,0.2)", minWidth: "170px", zIndex: 200,
                    border: "1px solid rgba(255,255,255,0.9)"
                  }}>
                    <Link href="/dashboard" onClick={() => setShowDropdown(false)}
                      style={{ display: "block", padding: "10px 14px", borderRadius: "10px", fontSize: "13px", color: "#1a2e1a", textDecoration: "none" }}>
                      Dashboard
                    </Link>
                    <button onClick={handleLogout} style={{
                      display: "block", width: "100%", textAlign: "left", padding: "10px 14px",
                      borderRadius: "10px", fontSize: "13px", color: "#dc2626",
                      background: "transparent", border: "none", cursor: "pointer", fontFamily: "'DM Sans', sans-serif"
                    }}>Logout</button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/" style={{ padding: "8px 18px", borderRadius: "50px", background: "linear-gradient(135deg, #2d5a27, #4a7c59)", color: "white", fontSize: "13px", fontWeight: "600", textDecoration: "none" }}>
                Get Started
              </Link>
            )}
          </div>
        </nav>

        {/* Page Content */}
        <div className="page-content" style={{ padding: "50px 24px 300px", maxWidth: "1000px", margin: "0 auto", position: "relative", zIndex: 10 }}>

          {/* Hero */}
          <div className="f1" style={{ textAlign: "center", marginBottom: "60px" }}>
            <p style={{ fontSize: "12px", fontWeight: "600", letterSpacing: "3px", textTransform: "uppercase", color: "#2d6a2d", marginBottom: "14px" }}>
              About Us
            </p>
            <h1 className="hero-title" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(32px, 6vw, 54px)", fontWeight: "700", color: "#1a2e1a", marginBottom: "18px", lineHeight: 1.1 }}>
              We make AI work<br />for real businesses
            </h1>
            <p style={{ color: "#3d5a3d", fontSize: "17px", maxWidth: "520px", margin: "0 auto", lineHeight: 1.75 }}>
              Vasu Agents was built with one goal — help Indian businesses stop missing customers and start growing, without any technical hassle.
            </p>
          </div>

          {/* Mission + Vision */}
          <div className="f2 two-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px", marginBottom: "24px" }}>
            <div className="glass card-hover" style={{ padding: "30px" }}>
              <div style={{ fontSize: "32px", marginBottom: "14px" }}>🎯</div>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "22px", color: "#1a2e1a", marginBottom: "12px" }}>Our Mission</h2>
              <p style={{ color: "#5a7a5a", fontSize: "15px", lineHeight: 1.75, margin: 0 }}>
                To make AI accessible for every small and medium business in India — not just big corporations with big budgets. Every shop, clinic, and coaching center deserves a smart assistant that works 24/7.
              </p>
            </div>
            <div className="glass card-hover" style={{ padding: "30px" }}>
              <div style={{ fontSize: "32px", marginBottom: "14px" }}>🔭</div>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "22px", color: "#1a2e1a", marginBottom: "12px" }}>Our Vision</h2>
              <p style={{ color: "#5a7a5a", fontSize: "15px", lineHeight: 1.75, margin: 0 }}>
                A future where no customer inquiry goes unanswered, no lead is lost because the owner was busy, and every Indian business — big or small — has an AI teammate they can count on.
              </p>
            </div>
          </div>

          {/* Why Vasu Agents */}
          <div className="f3 glass" style={{ padding: "30px", marginBottom: "24px" }}>
            <p style={{ fontSize: "12px", fontWeight: "600", letterSpacing: "3px", textTransform: "uppercase", color: "#2d6a2d", marginBottom: "10px" }}>Why Us</p>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "24px", color: "#1a2e1a", marginBottom: "24px" }}>Why Vasu Agents?</h2>
            <div className="three-col" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
              {[
                { icon: "🇮🇳", title: "Built for India", desc: "We understand Indian businesses — Hindi support, local pricing, and agents that actually fit how things work here." },
                { icon: "⚡", title: "Set up in minutes", desc: "No developer needed. Just fill a form, tell us about your business, and your AI agent is live within 24 hours." },
                { icon: "🔒", title: "You stay in control", desc: "All your data stays secure. You can update your agent anytime, and we activate nothing without your approval." },
                { icon: "🌙", title: "Works while you sleep", desc: "Your agent replies to customers at 2am, on Sundays, and on holidays — exactly when you can't." },
                { icon: "💰", title: "Affordable pricing", desc: "We priced Vasu Agents so that even a small clinic or tutor in Tier-2 cities can afford it without thinking twice." },
                { icon: "🤝", title: "Real support", desc: "We are a small, focused team. When you reach out, you talk to a real person — not a bot." },
              ].map((item) => (
                <div key={item.title} style={{ background: "rgba(255,255,255,0.5)", borderRadius: "14px", padding: "20px", border: "1px solid rgba(255,255,255,0.7)" }}>
                  <div style={{ fontSize: "26px", marginBottom: "10px" }}>{item.icon}</div>
                  <div style={{ fontSize: "14px", fontWeight: "700", color: "#1a2e1a", marginBottom: "6px" }}>{item.title}</div>
                  <div style={{ fontSize: "13px", color: "#5a7a5a", lineHeight: 1.65 }}>{item.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Founder */}
          <div className="f4 glass" style={{ padding: "30px", marginBottom: "24px" }}>
            <p style={{ fontSize: "12px", fontWeight: "600", letterSpacing: "3px", textTransform: "uppercase", color: "#2d6a2d", marginBottom: "10px" }}>Founder</p>
            <div style={{ display: "flex", alignItems: "flex-start", gap: "20px", flexWrap: "wrap" }}>
              <div style={{ width: "72px", height: "72px", borderRadius: "50%", background: "linear-gradient(135deg, #2d5a27, #4a7c59)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "30px", flexShrink: 0, border: "3px solid rgba(255,255,255,0.8)" }}>
                M
              </div>
              <div style={{ flex: 1, minWidth: "200px" }}>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "22px", color: "#1a2e1a", margin: "0 0 4px" }}>Mridul Soni</h3>
                <p style={{ color: "#4a7c59", fontSize: "13px", fontWeight: "600", margin: "0 0 14px", letterSpacing: "0.5px" }}>Founder, Vasu Agents — Kota, Rajasthan</p>
                <p style={{ color: "#5a7a5a", fontSize: "15px", lineHeight: 1.75, margin: 0 }}>
                  Vasu Agents started from a simple observation — most small businesses in India miss dozens of customer messages every day just because no one is available to reply. Mridul built Vasu Agents to fix that, combining AI with a deep understanding of how Indian businesses actually operate.
                </p>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="f5 glass" style={{ padding: "30px" }}>
            <p style={{ fontSize: "12px", fontWeight: "600", letterSpacing: "3px", textTransform: "uppercase", color: "#2d6a2d", marginBottom: "10px" }}>Get In Touch</p>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "24px", color: "#1a2e1a", marginBottom: "8px" }}>Contact Us</h2>
            <p style={{ color: "#5a7a5a", fontSize: "15px", marginBottom: "22px", lineHeight: 1.7 }}>
              Have a question or want to know if Vasu Agents is right for your business? Just reach out — we reply fast.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", maxWidth: "420px" }}>
              <a href="mailto:vasusoni1068@gmail.com" className="contact-link">
                <div style={{ width: "40px", height: "40px", background: "rgba(74,158,255,0.1)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", flexShrink: 0 }}>
                  📧
                </div>
                <div>
                  <div style={{ fontSize: "12px", color: "#5a7a5a", marginBottom: "2px" }}>Email us at</div>
                  <div style={{ fontSize: "14px", fontWeight: "600", color: "#1a2e1a" }}>vasusoni1068@gmail.com</div>
                </div>
              </a>
              <a href="https://linkedin.com" target="_blank" className="contact-link">
                <div style={{ width: "40px", height: "40px", background: "rgba(10,102,194,0.1)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", flexShrink: 0 }}>
                  💼
                </div>
                <div>
                  <div style={{ fontSize: "12px", color: "#5a7a5a", marginBottom: "2px" }}>Connect on</div>
                  <div style={{ fontSize: "14px", fontWeight: "600", color: "#1a2e1a" }}>LinkedIn — Coming soon</div>
                </div>
              </a>
              <div className="contact-link" style={{ cursor: "default" }}>
                <div style={{ width: "40px", height: "40px", background: "rgba(45,90,39,0.1)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", flexShrink: 0 }}>
                  📍
                </div>
                <div>
                  <div style={{ fontSize: "12px", color: "#5a7a5a", marginBottom: "2px" }}>Based in</div>
                  <div style={{ fontSize: "14px", fontWeight: "600", color: "#1a2e1a" }}>Kota, Rajasthan, India</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {showDropdown && <div style={{ position: "fixed", inset: 0, zIndex: 40 }} onClick={() => setShowDropdown(false)} />}
    </>
  );
}