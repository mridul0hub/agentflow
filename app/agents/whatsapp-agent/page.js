"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import AuthModal from "@/app/components/AuthModal";

const NICHES = [
  {
    icon: "🏥",
    title: "Doctor / Clinic",
    desc: "Patients send symptoms on WhatsApp. AI replies with appointment slots, medicine reminders, and follow-up messages automatically.",
    features: ["Auto appointment booking", "Medicine reminders", "Patient query replies", "Emergency routing"]
  },
  {
    icon: "🛒",
    title: "Online Store",
    desc: "Customer adds product to cart but doesn't buy? AI sends reminder with discount offer on WhatsApp within minutes.",
    features: ["Abandoned cart recovery", "Order status updates", "Discount offers", "Product recommendations"]
  },
  {
    icon: "🍕",
    title: "Restaurant / Food",
    desc: "Customers order food, ask menu questions, get delivery updates — all on WhatsApp automatically.",
    features: ["Menu sharing", "Order taking", "Delivery updates", "Daily specials"]
  },
  {
    icon: "💇",
    title: "Salon / Spa",
    desc: "Clients book appointments, get reminders, and receive special offers on WhatsApp without any manual work.",
    features: ["Appointment booking", "Reminder messages", "Special offers", "Service menu"]
  },
  {
    icon: "🏠",
    title: "Real Estate",
    desc: "Buyers and renters send property queries. AI replies with details, photos, and schedules site visits automatically.",
    features: ["Property details", "Site visit booking", "Price negotiation", "Document requests"]
  },
  {
    icon: "📚",
    title: "Coaching / Education",
    desc: "Students ask doubts, get study materials, exam reminders and fee payment links on WhatsApp automatically.",
    features: ["Doubt solving", "Study materials", "Exam reminders", "Fee collection"]
  }
];

export default function WhatsAppAgentPage() {
  const [user, setUser] = useState(null);
  const [showAuth, setShowAuth] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user || null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setShowDropdown(false);
  };

  return (
    <>
      <style>{`
        html, body { margin: 0; padding: 0; overflow-x: hidden; }
        .wa-page {
          min-height: 100vh;
          background: linear-gradient(180deg, #87CEEB 0%, #b8e4f7 20%, #c8ecd8 60%, #a8d5b5 100%);
          position: relative;
          overflow: hidden;
        }
        .sun { position: absolute; top: 60px; right: 12%; width: 90px; height: 90px; background: radial-gradient(circle, #fff9c4 30%, #ffd54f 60%, rgba(255,213,79,0) 100%); border-radius: 50%; box-shadow: 0 0 60px rgba(255,213,79,0.5); animation: sunPulse 4s ease-in-out infinite; }
        @keyframes sunPulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.08)} }
        .cloud { position: absolute; background: rgba(255,255,255,0.8); border-radius: 50px; filter: blur(6px); animation: cloudFloat 9s ease-in-out infinite; }
        @keyframes cloudFloat { 0%,100%{transform:translateX(0)} 50%{transform:translateX(18px)} }
        .mountains { position: absolute; bottom: 0; left: 0; right: 0; height: 35vh; background: linear-gradient(180deg, #2d5a27 0%, #1a3d1a 100%); clip-path: polygon(0% 100%, 0% 65%, 5% 40%, 10% 60%, 15% 30%, 20% 55%, 25% 22%, 30% 50%, 35% 20%, 40% 48%, 45% 28%, 50% 52%, 55% 22%, 60% 48%, 65% 25%, 70% 50%, 75% 22%, 80% 48%, 85% 30%, 90% 55%, 95% 35%, 100% 55%, 100% 100%); }
        .trees { position: absolute; bottom: 0; left: 0; right: 0; height: 14vh; background: #1a4a15; clip-path: polygon(0% 100%, 0% 75%, 3% 45%, 6% 68%, 9% 38%, 12% 62%, 15% 32%, 18% 58%, 21% 28%, 24% 55%, 27% 38%, 30% 60%, 33% 22%, 36% 55%, 39% 32%, 42% 58%, 45% 25%, 48% 52%, 51% 35%, 54% 58%, 57% 22%, 60% 52%, 63% 35%, 66% 58%, 69% 25%, 72% 52%, 75% 35%, 78% 58%, 81% 25%, 84% 52%, 87% 35%, 90% 58%, 93% 28%, 96% 55%, 100% 38%, 100% 100%); }
        .navbar { position: fixed; top: 0; left: 0; right: 0; z-index: 100; display: flex; justify-content: space-between; align-items: center; padding: 16px 32px; background: rgba(255,255,255,0.25); backdrop-filter: blur(20px); border-bottom: 1px solid rgba(255,255,255,0.4); }
        .niche-card { background: rgba(255,255,255,0.65); backdrop-filter: blur(12px); border: 1.5px solid rgba(255,255,255,0.85); border-radius: 22px; padding: 28px; transition: all 0.3s; }
        .niche-card:hover { transform: translateY(-5px); box-shadow: 0 16px 40px rgba(45,90,39,0.15); }
        .feature-pill { display: inline-block; background: rgba(45,90,39,0.08); color: #2d5a27; border-radius: 50px; padding: 4px 12px; font-size: 12px; font-weight: 500; margin: 3px; }
        .try-btn { padding: 14px 32px; border-radius: 50px; background: linear-gradient(135deg, #25D366, #128C7E); border: none; color: white; font-size: 15px; font-weight: 600; cursor: pointer; box-shadow: 0 8px 30px rgba(37,211,102,0.35); transition: all 0.2s; font-family: 'DM Sans', sans-serif; }
        .try-btn:hover { transform: translateY(-2px); box-shadow: 0 12px 35px rgba(37,211,102,0.45); }
        @media(max-width:640px){ .navbar{padding:14px 20px;} .niche-grid{grid-template-columns:1fr !important;} }
      `}</style>

      <div className="wa-page">
        <div className="sun" />
        <div className="cloud" style={{ top: "8%", left: "5%", width: "170px", height: "50px" }} />
        <div className="cloud" style={{ top: "13%", left: "30%", width: "130px", height: "42px", animationDelay: "2s" }} />
        <div className="cloud" style={{ top: "7%", right: "22%", width: "190px", height: "55px", animationDelay: "1s" }} />
        <div className="mountains" />
        <div className="trees" />

        {/* Navbar */}
        <nav className="navbar">
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none" }}>
            <span style={{ fontSize: "22px" }}>🌿</span>
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "18px", fontWeight: "700", color: "#1a2e1a" }}>Vasu Agents</span>
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {user ? (
              <div style={{ position: "relative" }}>
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  style={{ display: "flex", alignItems: "center", gap: "8px", background: "rgba(255,255,255,0.8)", border: "1.5px solid rgba(255,255,255,0.9)", borderRadius: "50px", padding: "6px 14px 6px 6px", cursor: "pointer" }}
                >
                  <img src={user.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.user_metadata?.full_name || user.email)}&background=2d5a27&color=fff&size=32`} style={{ width: "32px", height: "32px", borderRadius: "50%" }} />
                  <span style={{ fontSize: "13px", fontWeight: "500", color: "#1a2e1a" }}>{user.user_metadata?.full_name?.split(" ")[0] || user.email?.split("@")[0]}</span>
                  <span style={{ fontSize: "10px", color: "#5a7a5a" }}>▼</span>
                </button>
                {showDropdown && (
                  <div style={{ position: "absolute", top: "50px", right: 0, background: "rgba(255,255,255,0.97)", borderRadius: "16px", padding: "8px", boxShadow: "0 10px 40px rgba(0,0,0,0.15)", minWidth: "160px", zIndex: 200 }}>
                    <Link href="/dashboard" style={{ display: "block", padding: "10px 14px", borderRadius: "10px", fontSize: "13px", color: "#1a2e1a", textDecoration: "none" }} onClick={() => setShowDropdown(false)}>🏠 Dashboard</Link>
                    <button onClick={handleLogout} style={{ display: "block", width: "100%", textAlign: "left", padding: "10px 14px", borderRadius: "10px", fontSize: "13px", color: "#dc2626", background: "transparent", border: "none", cursor: "pointer" }}>🚪 Logout</button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <button onClick={() => setShowAuth(true)} style={{ padding: "8px 22px", borderRadius: "50px", background: "rgba(255,255,255,0.7)", border: "1.5px solid rgba(255,255,255,0.9)", color: "#1a2e1a", fontSize: "14px", fontWeight: "500", cursor: "pointer" }}>Login</button>
                <button onClick={() => setShowAuth(true)} style={{ padding: "8px 22px", borderRadius: "50px", background: "linear-gradient(135deg, #2d5a27, #4a7c59)", border: "none", color: "white", fontSize: "14px", fontWeight: "500", cursor: "pointer" }}>Get Started</button>
              </>
            )}
          </div>
        </nav>

        {/* Content */}
        <div style={{ position: "relative", zIndex: 10, padding: "120px 24px 280px", maxWidth: "1100px", margin: "0 auto" }}>

          {/* Hero */}
          <div style={{ textAlign: "center", marginBottom: "70px" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "10px", background: "rgba(37,211,102,0.12)", border: "1px solid rgba(37,211,102,0.25)", borderRadius: "50px", padding: "8px 20px", marginBottom: "20px" }}>
              <img src="/whatsappsvg.png" style={{ height: "20px", width: "20px"}} />
              <span style={{ fontSize: "13px", fontWeight: "600", color: "#128C7E" }}>WhatsApp AI Agent</span>
            </div>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(32px, 6vw, 60px)", fontWeight: "700", color: "#1a2e1a", marginBottom: "16px", lineHeight: "1.1" }}>
              Your Business on WhatsApp,<br />Running 24/7 on Autopilot
            </h1>
            <p style={{ fontSize: "clamp(15px, 2vw, 18px)", color: "#3d5a3d", maxWidth: "560px", margin: "0 auto 36px", lineHeight: "1.7" }}>
              AI automatically replies to every customer message, sends offers, recovers lost sales, and handles queries — without you lifting a finger.
            </p>
            <button className="try-btn" onClick={() => {
  if (user) {
    window.location.href = "/dashboard/whatsapp-setup";
  } else {
    setShowAuth(true);
  }
}}>
  {user ? "🚀 Get Started Now" : "Try WhatsApp Agent Free"}
</button>
          </div>

          {/* How it works */}
          <div style={{ background: "rgba(255,255,255,0.6)", backdropFilter: "blur(12px)", border: "1.5px solid rgba(255,255,255,0.85)", borderRadius: "24px", padding: "40px", marginBottom: "50px" }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "26px", color: "#1a2e1a", marginBottom: "30px", textAlign: "center" }}>How It Works</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "24px" }}>
              {[
                { step: "01", title: "Customer Messages", desc: "Someone sends a message to your WhatsApp business number" },
                { step: "02", title: "AI Understands", desc: "Our AI reads the message and understands what the customer needs" },
                { step: "03", title: "Instant Reply", desc: "AI sends a perfect reply in seconds — 24/7, even at 3am" },
                { step: "04", title: "You Get Sales", desc: "Customers are happy, queries are solved, sales happen automatically" }
              ].map((item) => (
                <div key={item.step} style={{ textAlign: "center" }}>
                  <div style={{ width: "48px", height: "48px", background: "linear-gradient(135deg, #2d5a27, #4a7c59)", borderRadius: "14px", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px", color: "white", fontSize: "13px", fontWeight: "700" }}>{item.step}</div>
                  <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: "16px", color: "#1a2e1a", marginBottom: "6px" }}>{item.title}</h4>
                  <p style={{ fontSize: "13px", color: "#5a7a5a", lineHeight: "1.5" }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Niches */}
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(24px, 4vw, 36px)", color: "#1a2e1a", textAlign: "center", marginBottom: "12px" }}>
            Works for Every Business
          </h2>
          <p style={{ color: "#5a7a5a", textAlign: "center", marginBottom: "36px", fontSize: "15px" }}>
            No matter what you sell — our AI agent handles it all
          </p>

          <div className="niche-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "20px", marginBottom: "60px" }}>
            {NICHES.map((niche) => (
              <div key={niche.title} className="niche-card">
                <div style={{ fontSize: "32px", marginBottom: "12px" }}>{niche.icon}</div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "18px", color: "#1a2e1a", marginBottom: "8px" }}>{niche.title}</h3>
                <p style={{ fontSize: "13px", color: "#5a7a5a", lineHeight: "1.6", marginBottom: "14px" }}>{niche.desc}</p>
                <div>
                  {niche.features.map(f => (
                    <span key={f} className="feature-pill">✓ {f}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div style={{ textAlign: "center", background: "rgba(255,255,255,0.65)", backdropFilter: "blur(12px)", border: "1.5px solid rgba(255,255,255,0.85)", borderRadius: "28px", padding: "50px 30px" }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(24px, 4vw, 38px)", color: "#1a2e1a", marginBottom: "14px" }}>
              Ready to Automate Your WhatsApp?
            </h2>
            <p style={{ color: "#5a7a5a", marginBottom: "28px", fontSize: "15px" }}>
              Join businesses already saving hours every day with Vasu Agents
            </p>
            <button className="try-btn" onClick={() => {
  if (user) {
    window.location.href = "/dashboard/whatsapp-setup";
  } else {
    setShowAuth(true);
  }
}}>
  {user ? "🚀 Get Started Now" : "Try WhatsApp Agent Free"}
</button>
          </div>

        </div>
      </div>

      <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} defaultTab="signup" redirectTo="/dashboard/whatsapp-setup" />
      {showDropdown && <div style={{ position: "fixed", inset: 0, zIndex: 40 }} onClick={() => setShowDropdown(false)} />}
    </>
  );
}