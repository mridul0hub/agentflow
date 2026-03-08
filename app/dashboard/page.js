"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  const [currentTime, setCurrentTime] = useState("");
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push("/"); } else { setUser(session.user); }
      setLoading(false);
    };
    getUser();

    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }));
    };
    updateTime();
    const timer = setInterval(updateTime, 60000);
    return () => clearInterval(timer);
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #1a4a15 0%, #2d6a20 50%, #1a3d10 100%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "48px", marginBottom: "16px", animation: "spin 2s linear infinite" }}>🌿</div>
        <p style={{ color: "rgba(255,255,255,0.7)", fontFamily: "'DM Sans', sans-serif" }}>Loading your dashboard...</p>
      </div>
      <style>{`@keyframes spin { 0%{transform:rotate(0deg)} 100%{transform:rotate(360deg)} }`}</style>
    </div>
  );

  const firstName = user?.user_metadata?.full_name?.split(" ")[0] || user?.email?.split("@")[0] || "there";
  const avatarUrl = user?.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.user_metadata?.full_name || user?.email)}&background=2d5a27&color=fff&size=40`;

  return (
    <>
      <style>{`
        html, body { margin: 0; padding: 0; overflow-x: hidden; }

        .db-page {
          min-height: 100vh;
          background: linear-gradient(160deg, #e8f5e1 0%, #c8edb8 30%, #a8d890 60%, #c8edb8 100%);
          position: relative;
          overflow: hidden;
        }

        /* Sunlight rays */
        .ray {
          position: fixed;
          top: -10%;
          width: 3px;
          height: 120vh;
          background: linear-gradient(180deg, rgba(255,220,100,0.25) 0%, rgba(255,220,100,0) 100%);
          transform-origin: top center;
          pointer-events: none;
        }
        .ray-1 { left: 15%; transform: rotate(-8deg); animation: rayPulse 4s ease-in-out infinite; }
        .ray-2 { left: 25%; transform: rotate(-4deg); width: 5px; animation: rayPulse 5s ease-in-out infinite 1s; background: linear-gradient(180deg, rgba(255,220,100,0.18) 0%, rgba(255,220,100,0) 100%); }
        .ray-3 { left: 35%; transform: rotate(2deg); animation: rayPulse 6s ease-in-out infinite 0.5s; }
        .ray-4 { left: 50%; transform: rotate(6deg); width: 4px; animation: rayPulse 4.5s ease-in-out infinite 2s; background: linear-gradient(180deg, rgba(255,220,100,0.15) 0%, rgba(255,220,100,0) 100%); }
        .ray-5 { left: 65%; transform: rotate(10deg); animation: rayPulse 5.5s ease-in-out infinite 1.5s; }
        .ray-6 { left: 78%; transform: rotate(14deg); width: 2px; animation: rayPulse 4s ease-in-out infinite 3s; }

        @keyframes rayPulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }

        /* Floating leaves */
        .leaf {
          position: fixed;
          font-size: 16px;
          pointer-events: none;
          animation: leafFall linear infinite;
          opacity: 0;
        }
        @keyframes leafFall {
          0% { transform: translateY(-20px) rotate(0deg); opacity: 0; }
          10% { opacity: 0.7; }
          90% { opacity: 0.5; }
          100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
        }

        /* Top sunlight glow */
        .sun-glow {
          position: fixed;
          top: -80px;
          left: 50%;
          transform: translateX(-50%);
          width: 600px;
          height: 300px;
          background: radial-gradient(ellipse, rgba(255,220,80,0.2) 0%, rgba(255,220,80,0) 70%);
          pointer-events: none;
          animation: glowPulse 5s ease-in-out infinite;
        }
        @keyframes glowPulse {
          0%, 100% { opacity: 0.7; transform: translateX(-50%) scale(1); }
          50% { opacity: 1; transform: translateX(-50%) scale(1.1); }
        }

        /* Navbar */
        .glass-card {
          background: rgba(255,255,255,0.6);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(255,255,255,0.8);
          border-radius: 20px;
          transition: all 0.3s;
        }
        .glass-card:hover {
          background: rgba(255,255,255,0.75);
          border-color: rgba(255,255,255,0.9);
          transform: translateY(-3px);
          box-shadow: 0 12px 30px rgba(45,90,39,0.12);
        }

        .stat-card {
          background: rgba(255,255,255,0.6);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(255,255,255,0.8);
          border-radius: 18px;
          padding: 24px;
          transition: all 0.3s;
        }
        .stat-card:hover { background: rgba(255,255,255,0.75); transform: translateY(-3px); box-shadow: 0 12px 30px rgba(45,90,39,0.12); }

        .agent-card {
          background: rgba(255,255,255,0.5);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(255,255,255,0.7);
          border-radius: 18px;
          padding: 22px;
          display: flex;
          align-items: center;
          gap: 16px;
          transition: all 0.3s;
          cursor: pointer;
          text-decoration: none;
        }
        .agent-card:hover { background: rgba(255,255,255,0.7); transform: translateX(4px); }

        .action-btn {
          background: rgba(255,255,255,0.5);
          border: 1px solid rgba(255,255,255,0.7);
          border-radius: 14px;
          padding: 16px;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s;
          color: #1a2e1a;
          text-decoration: none;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }
        .action-btn:hover { background: rgba(255,255,255,0.75); transform: translateY(-3px); }

        .activity-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 0;
          border-bottom: 1px solid rgba(45,90,39,0.1);
        }
        .activity-item:last-child { border-bottom: none; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-1 { animation: fadeUp 0.6s ease forwards; }
        .fade-2 { animation: fadeUp 0.6s ease 0.1s forwards; opacity: 0; }
        .fade-3 { animation: fadeUp 0.6s ease 0.2s forwards; opacity: 0; }
        .fade-4 { animation: fadeUp 0.6s ease 0.3s forwards; opacity: 0; }
        .fade-5 { animation: fadeUp 0.6s ease 0.4s forwards; opacity: 0; }

        @media(max-width: 768px) {
          .db-navbar { padding: 12px 16px; }
          .db-content { padding: 20px 16px !important; }
          .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .actions-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>

      <div className="db-page">

        {/* Background Effects */}
        <div className="sun-glow" />
        <div className="ray ray-1" />
        <div className="ray ray-2" />
        <div className="ray ray-3" />
        <div className="ray ray-4" />
        <div className="ray ray-5" />
        <div className="ray ray-6" />

        {/* Floating Leaves */}
        {["🍃", "🌿", "🍀", "🌱"].map((leaf, i) => (
          <div key={i} className="leaf" style={{
            left: `${20 + i * 20}%`,
            animationDuration: `${8 + i * 3}s`,
            animationDelay: `${i * 2}s`,
            fontSize: `${14 + i * 2}px`
          }}>{leaf}</div>
        ))}

        {/* Navbar */}
        <nav className="db-navbar">
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none" }}>
            <span style={{ fontSize: "22px" }}>🌿</span>
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "18px", fontWeight: "700", color: "#1a2e1a" }}>Vasu Agents</span>
          </Link>

          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <span style={{ color: "#5a7a5a", fontSize: "13px" }}>{currentTime}</span>
            <div style={{ position: "relative" }}>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                style={{ display: "flex", alignItems: "center", gap: "8px", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "50px", padding: "6px 14px 6px 6px", cursor: "pointer" }}
              >
                <img src={avatarUrl} style={{ width: "32px", height: "32px", borderRadius: "50%", objectFit: "cover" }} />
                <span style={{ fontSize: "13px", fontWeight: "500", color: "#1a2e1a" }}>{firstName}</span>
                <span style={{ fontSize: "10px", color: "#5a7a5a" }}>▼</span>
              </button>
              {showDropdown && (
                <div style={{ position: "absolute", top: "50px", right: 0, background: "rgba(15,35,12,0.97)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "16px", padding: "8px", boxShadow: "0 10px 40px rgba(0,0,0,0.4)", minWidth: "180px", zIndex: 200 }}>
                  <div style={{ padding: "8px 14px 10px", fontSize: "11px", color: "rgba(255,255,255,0.4)", borderBottom: "1px solid rgba(255,255,255,0.08)", marginBottom: "4px" }}>{user?.email}</div>
                  <button onClick={handleLogout} style={{ display: "block", width: "100%", textAlign: "left", padding: "10px 14px", borderRadius: "10px", fontSize: "13px", color: "#ff6b6b", background: "transparent", border: "none", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>🚪 Logout</button>
                </div>
              )}
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <div className="db-content" style={{ padding: "32px 32px", maxWidth: "1200px", margin: "0 auto" }}>

          {/* Welcome Header */}
          <div className="fade-1" style={{ marginBottom: "32px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
              <img src={avatarUrl} style={{ width: "56px", height: "56px", borderRadius: "50%", border: "2px solid rgba(255,255,255,0.2)" }} />
              <div>
                <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(22px, 4vw, 32px)", color: "#1a2e1a", margin: 0 }}>
                  {getGreeting()}, {firstName}! 🌿
                </h1>
                <p style={{ color: "#5a7a5a", fontSize: "14px", margin: "4px 0 0" }}>
                  Here's what's happening with your agents today
                </p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="fade-2 stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "28px" }}>
            {[
              { icon: "💬", label: "Messages Handled", value: "0", sub: "This month", color: "#25D366" },
              { icon: "🤖", label: "Active Agents", value: "0", sub: "Running now", color: "#4a9eff" },
              { icon: "⚡", label: "Avg Response", value: "—", sub: "Response time", color: "#ffd54f" },
              { icon: "😊", label: "Happy Customers", value: "0", sub: "Satisfied users", color: "#ff7043" },
            ].map((stat) => (
              <div key={stat.label} className="stat-card">
                <div style={{ fontSize: "28px", marginBottom: "10px" }}>{stat.icon}</div>
                <div style={{ fontSize: "28px", fontWeight: "700", color: stat.color, fontFamily: "'Playfair Display', serif", marginBottom: "4px" }}>{stat.value}</div>
                <div style={{ fontSize: "13px", fontWeight: "600", color: "#1a2e1a", marginBottom: "2px" }}>{stat.label}</div>
                <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)" }}>{stat.sub}</div>
              </div>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "28px" }}>

            {/* My Agents */}
            <div className="fade-3 glass-card" style={{ padding: "24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "18px", color: "#1a2e1a", margin: 0 }}>My Agents</h2>
                <span style={{ background: "rgba(255,255,255,0.08)", color: "#5a7a5a", fontSize: "12px", padding: "4px 10px", borderRadius: "50px" }}>0 active</span>
              </div>
              <Link href="/agents/whatsapp-agent" className="agent-card" style={{ marginBottom: "10px" }}>
                <div style={{ width: "44px", height: "44px", background: "rgba(37,211,102,0.15)", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", flexShrink: 0 }}>💬</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "14px", fontWeight: "600", color: "#1a2e1a" }}>WhatsApp Agent</div>
                  <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", marginTop: "2px" }}>Auto-reply to customers</div>
                </div>
                <span style={{ fontSize: "11px", background: "rgba(255,165,0,0.15)", color: "#ffa500", padding: "3px 10px", borderRadius: "50px", flexShrink: 0 }}>Setup</span>
              </Link>
              <div style={{ textAlign: "center", padding: "20px", color: "rgba(255,255,255,0.3)", fontSize: "13px" }}>
                More agents coming soon 🌱
              </div>
            </div>

            {/* Recent Activity */}
            <div className="fade-3 glass-card" style={{ padding: "24px" }}>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "18px", color: "#1a2e1a", margin: "0 0 20px" }}>Recent Activity</h2>
              <div style={{ textAlign: "center", padding: "30px 20px" }}>
                <div style={{ fontSize: "36px", marginBottom: "12px" }}>🌱</div>
                <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px", lineHeight: "1.6" }}>
                  No activity yet.<br />Set up your first agent to get started!
                </p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="fade-4 glass-card" style={{ padding: "24px", marginBottom: "28px" }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "18px", color: "#1a2e1a", margin: "0 0 20px" }}>Quick Actions</h2>
            <div className="actions-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px" }}>
              {[
                { icon: "💬", label: "Setup WhatsApp Agent", href: "/agents/whatsapp-agent" },
                { icon: "📊", label: "View Analytics", href: "#" },
                { icon: "⚙️", label: "Settings", href: "#" },
                { icon: "🆘", label: "Get Support", href: "#" },
              ].map((action) => (
                <Link key={action.label} href={action.href} className="action-btn">
                  <span style={{ fontSize: "26px" }}>{action.icon}</span>
                  <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.7)", fontWeight: "500", fontFamily: "'DM Sans', sans-serif" }}>{action.label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Plan Banner */}
          <div className="fade-5" style={{
            background: "linear-gradient(135deg, rgba(45,90,39,0.4), rgba(74,124,89,0.3))",
            border: "1px solid rgba(74,124,89,0.4)",
            borderRadius: "20px",
            padding: "24px 28px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "16px"
          }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                <span style={{ fontSize: "18px" }}>🌿</span>
                <span style={{ color: "#1a2e1a", fontWeight: "600", fontSize: "15px" }}>Free Plan</span>
                <span style={{ background: "rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.7)", fontSize: "11px", padding: "2px 8px", borderRadius: "50px" }}>Current</span>
              </div>
              <p style={{ color: "#5a7a5a", fontSize: "13px", margin: 0 }}>
                Upgrade to unlock unlimited agents, analytics & priority support
              </p>
            </div>
            <button style={{
              padding: "10px 24px", borderRadius: "50px",
              background: "linear-gradient(135deg, #2d5a27, #4a7c59)",
              border: "none", color: "#1a2e1a",
              fontSize: "13px", fontWeight: "600",
              cursor: "pointer", whiteSpace: "nowrap",
              fontFamily: "'DM Sans', sans-serif"
            }}>
              Upgrade Plan 🚀
            </button>
          </div>

        </div>
      </div>

      {showDropdown && <div style={{ position: "fixed", inset: 0, zIndex: 40 }} onClick={() => setShowDropdown(false)} />}
    </>
  );
}