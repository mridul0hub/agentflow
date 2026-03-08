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
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #e8f5e1 0%, #c8edb8 100%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "48px", marginBottom: "16px", animation: "spin 2s linear infinite" }}>🌿</div>
        <p style={{ color: "#2d5a27", fontFamily: "'DM Sans', sans-serif" }}>Loading your dashboard...</p>
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

        .leaf {
          position: fixed;
          pointer-events: none;
          animation: leafFall linear infinite;
          opacity: 0;
        }
        @keyframes leafFall {
          0% { transform: translateY(-20px) rotate(0deg); opacity: 0; }
          10% { opacity: 0.6; }
          90% { opacity: 0.4; }
          100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
        }

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
        .db-navbar {
          position: sticky;
          top: 0;
          z-index: 100;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 14px 32px;
          background: rgba(255,255,255,0.5);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255,255,255,0.7);
        }

        .glass-card {
          background: rgba(255,255,255,0.65);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(255,255,255,0.85);
          border-radius: 20px;
          transition: all 0.3s;
        }
        .glass-card:hover {
          background: rgba(255,255,255,0.8);
          border-color: rgba(255,255,255,0.95);
          transform: translateY(-3px);
          box-shadow: 0 12px 30px rgba(45,90,39,0.12);
        }

        .stat-card {
          background: rgba(255,255,255,0.65);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(255,255,255,0.85);
          border-radius: 18px;
          padding: 24px;
          transition: all 0.3s;
        }
        .stat-card:hover {
          background: rgba(255,255,255,0.8);
          transform: translateY(-3px);
          box-shadow: 0 12px 30px rgba(45,90,39,0.12);
        }

        .agent-card {
          background: rgba(255,255,255,0.55);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(255,255,255,0.75);
          border-radius: 18px;
          padding: 22px;
          display: flex;
          align-items: center;
          gap: 16px;
          transition: all 0.3s;
          cursor: pointer;
          text-decoration: none;
        }
        .agent-card:hover { background: rgba(255,255,255,0.75); transform: translateX(4px); }

        .action-btn {
          background: rgba(255,255,255,0.55);
          border: 1px solid rgba(255,255,255,0.75);
          border-radius: 14px;
          padding: 18px 12px;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s;
          color: #1a2e1a;
          text-decoration: none;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
        }
        .action-btn:hover { background: rgba(255,255,255,0.8); transform: translateY(-3px); box-shadow: 0 8px 20px rgba(45,90,39,0.1); }

        .activity-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 0;
          border-bottom: 1px solid rgba(45,90,39,0.08);
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
          .agents-activity-grid { grid-template-columns: 1fr !important; }
          .actions-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>

      <div className="db-page">

        <div className="sun-glow" />
        <div className="ray ray-1" />
        <div className="ray ray-2" />
        <div className="ray ray-3" />
        <div className="ray ray-4" />
        <div className="ray ray-5" />
        <div className="ray ray-6" />

        {["🍃", "🌿", "🍀", "🌱"].map((leaf, i) => (
          <div key={i} className="leaf" style={{
            left: `${15 + i * 22}%`,
            animationDuration: `${8 + i * 3}s`,
            animationDelay: `${i * 2}s`,
            fontSize: `${14 + i * 2}px`
          }}>{leaf}</div>
        ))}

        {/* Navbar */}
        <nav className="db-navbar">
          {/* Logo - LEFT */}
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
            <span style={{ fontSize: "28px" }}>🌿</span>
            <span style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "28px",
              fontWeight: "700",
              color: "#1a2e1a",
              letterSpacing: "-0.5px"
            }}>Vasu Agents</span>
          </Link>

          {/* Time + Avatar - RIGHT */}
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <span style={{
              color: "#1a2e1a",
              fontSize: "15px",
              fontWeight: "800",
              fontFamily: "'DM Sans', sans-serif",
              letterSpacing: "0.5px"
            }}>{currentTime}</span>

            <div style={{ position: "relative" }}>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                style={{
                  display: "flex", alignItems: "center", gap: "8px",
                  background: "rgba(255,255,255,0.7)",
                  border: "1.5px solid rgba(255,255,255,0.9)",
                  borderRadius: "50px", padding: "6px 14px 6px 6px",
                  cursor: "pointer", transition: "all 0.2s"
                }}
              >
                <img src={avatarUrl} style={{ width: "34px", height: "34px", borderRadius: "50%", objectFit: "cover" }} />
                <span style={{ fontSize: "14px", fontWeight: "600", color: "#1a2e1a" }}>{firstName}</span>
                <span style={{ fontSize: "10px", color: "#5a7a5a" }}>▼</span>
              </button>

              {showDropdown && (
                <div style={{
                  position: "absolute", top: "52px", right: 0,
                  background: "rgba(255,255,255,0.97)",
                  border: "1px solid rgba(255,255,255,0.9)",
                  borderRadius: "16px", padding: "8px",
                  boxShadow: "0 10px 40px rgba(45,90,39,0.2)",
                  minWidth: "190px", zIndex: 200
                }}>
                  <div style={{ padding: "8px 14px 10px", fontSize: "11px", color: "#9ca3af", borderBottom: "1px solid #f0f0f0", marginBottom: "4px" }}>
                    {user?.email}
                  </div>
                  <Link
                    href="/dashboard"
                    onClick={() => setShowDropdown(false)}
                    style={{ display: "block", padding: "10px 14px", borderRadius: "10px", fontSize: "13px", color: "#1a2e1a", textDecoration: "none" }}
                  >
                    🏠 Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    style={{ display: "block", width: "100%", textAlign: "left", padding: "10px 14px", borderRadius: "10px", fontSize: "13px", color: "#dc2626", background: "transparent", border: "none", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}
                  >
                    🚪 Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <div className="db-content" style={{ padding: "36px 32px", maxWidth: "1200px", margin: "0 auto" }}>

          {/* Welcome Header */}
          <div className="fade-1" style={{ marginBottom: "32px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "18px", flexWrap: "wrap" }}>
              <img src={avatarUrl} style={{ width: "60px", height: "60px", borderRadius: "50%", border: "3px solid rgba(255,255,255,0.8)", boxShadow: "0 4px 12px rgba(45,90,39,0.15)" }} />
              <div>
                <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(26px, 4vw, 38px)", color: "#1a2e1a", margin: 0, fontWeight: "700" }}>
                  {getGreeting()}, {firstName}! 🌿
                </h1>
                <p style={{ color: "#5a7a5a", fontSize: "15px", margin: "5px 0 0", fontWeight: "400" }}>
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
              { icon: "⚡", label: "Avg Response", value: "—", sub: "Response time", color: "#d4a017" },
              { icon: "😊", label: "Happy Customers", value: "0", sub: "Satisfied users", color: "#ff7043" },
            ].map((stat) => (
              <div key={stat.label} className="stat-card">
                <div style={{ fontSize: "30px", marginBottom: "12px" }}>{stat.icon}</div>
                <div style={{ fontSize: "34px", fontWeight: "700", color: stat.color, fontFamily: "'Playfair Display', serif", marginBottom: "6px" }}>{stat.value}</div>
                <div style={{ fontSize: "15px", fontWeight: "700", color: "#1a2e1a", marginBottom: "3px" }}>{stat.label}</div>
                <div style={{ fontSize: "12px", color: "#5a7a5a", fontWeight: "500" }}>{stat.sub}</div>
              </div>
            ))}
          </div>

          {/* My Agents + Recent Activity */}
          <div className="agents-activity-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "28px" }}>

            {/* My Agents */}
            <div className="fade-3 glass-card" style={{ padding: "26px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "22px", color: "#1a2e1a", margin: 0 }}>My Agents</h2>
                <span style={{ background: "rgba(45,90,39,0.1)", color: "#2d5a27", fontSize: "12px", fontWeight: "600", padding: "4px 12px", borderRadius: "50px" }}>0 active</span>
              </div>
              <Link href="/agents/whatsapp-agent" className="agent-card" style={{ marginBottom: "12px" }}>
                <div style={{ width: "46px", height: "46px", background: "rgba(37,211,102,0.12)", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px", flexShrink: 0 }}>💬</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "15px", fontWeight: "700", color: "#1a2e1a" }}>WhatsApp Agent</div>
                  <div style={{ fontSize: "13px", color: "#5a7a5a", marginTop: "3px" }}>Auto-reply to customers</div>
                </div>
                <span style={{ fontSize: "11px", background: "rgba(255,165,0,0.12)", color: "#e6900a", padding: "4px 12px", borderRadius: "50px", flexShrink: 0, fontWeight: "600" }}>Setup</span>
              </Link>
              <div style={{ textAlign: "center", padding: "20px", color: "#5a7a5a", fontSize: "14px", fontWeight: "500" }}>
                More agents coming soon 🌱
              </div>
            </div>

            {/* Recent Activity */}
            <div className="fade-3 glass-card" style={{ padding: "26px" }}>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "22px", color: "#1a2e1a", margin: "0 0 20px" }}>Recent Activity</h2>
              <div style={{ textAlign: "center", padding: "30px 20px" }}>
                <div style={{ fontSize: "40px", marginBottom: "14px" }}>🌱</div>
                <p style={{ color: "#5a7a5a", fontSize: "14px", lineHeight: "1.7", fontWeight: "500", margin: 0 }}>
                  No activity yet.<br />Set up your first agent to get started!
                </p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="fade-4 glass-card" style={{ padding: "26px", marginBottom: "28px" }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "22px", color: "#1a2e1a", margin: "0 0 20px" }}>Quick Actions</h2>
            <div className="actions-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "14px" }}>
              {[
                { icon: "💬", label: "Setup WhatsApp Agent", href: "/agents/whatsapp-agent" },
                { icon: "📊", label: "View Analytics", href: "#" },
                { icon: "⚙️", label: "Settings", href: "#" },
                { icon: "🆘", label: "Get Support", href: "#" },
              ].map((action) => (
                <Link key={action.label} href={action.href} className="action-btn">
                  <span style={{ fontSize: "30px" }}>{action.icon}</span>
                  <span style={{ fontSize: "13px", color: "#1a2e1a", fontWeight: "600", fontFamily: "'DM Sans', sans-serif", textAlign: "center", lineHeight: "1.4" }}>{action.label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Plan Banner */}
          <div className="fade-5" style={{
            background: "rgba(255,255,255,0.55)",
            border: "1.5px solid rgba(255,255,255,0.8)",
            borderRadius: "20px",
            padding: "24px 28px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "16px",
            backdropFilter: "blur(12px)"
          }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                <span style={{ fontSize: "20px" }}>🌿</span>
                <span style={{ color: "#1a2e1a", fontWeight: "300", fontSize: "18px", fontFamily: "'Playfair Display', serif" }}>Free Plan</span>
                <span style={{ background: "rgba(45,90,39,0.1)", color: "#4a7c59", fontSize: "11px", fontWeight: "500", padding: "3px 10px", borderRadius: "50px" }}>Current</span>
              </div>
              <p style={{ color: "#5a7a5a", fontSize: "13px", margin: 0, fontWeight: "300" }}>
                Upgrade to unlock unlimited agents, analytics & priority support
              </p>
            </div>
            <button style={{
              padding: "12px 28px", borderRadius: "50px",
              background: "linear-gradient(135deg, #2d5a27, #4a7c59)",
              border: "none", color: "white",
              fontSize: "14px", fontWeight: "600",
              cursor: "pointer", whiteSpace: "nowrap",
              fontFamily: "'DM Sans', sans-serif",
              boxShadow: "0 4px 15px rgba(45,90,39,0.25)"
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