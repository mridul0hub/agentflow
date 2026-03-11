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
  const [stats, setStats] = useState({
    whatsappMessages: 0,
    emailMessages: 0,
    activeAgents: 0,
    totalCustomers: 0,
  });
  const [whatsappAgent, setWhatsappAgent] = useState(null);
  const [emailAgent, setEmailAgent] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push("/"); return; }
      setUser(session.user);
      await loadDashboardData(session.user.id);
      setLoading(false);
    };
    init();

    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }));
    };
    updateTime();
    const timer = setInterval(updateTime, 60000);
    return () => clearInterval(timer);
  }, [router]);

  const loadDashboardData = async (userId) => {
    try {
      // Load WhatsApp agent
      const { data: waAgent } = await supabase
        .from("whatsapp_agents")
        .select("*")
        .eq("user_id", userId)
        .single();
      setWhatsappAgent(waAgent);

      // Load Email agent
      const { data: emAgent } = await supabase
        .from("email_agents")
        .select("*")
        .eq("user_id", userId)
        .single();
      setEmailAgent(emAgent);

      // Count WhatsApp AI replies
      let waMessages = 0;
      if (waAgent?.whatsapp_number) {
        const { count } = await supabase
          .from("chat_history")
          .select("*", { count: "exact", head: true })
          .eq("business_number", waAgent.whatsapp_number)
          .eq("role", "assistant");
        waMessages = count || 0;
      }

      // Count Email AI replies
      let emMessages = 0;
      if (emAgent?.business_email) {
        const { count } = await supabase
          .from("email_history")
          .select("*", { count: "exact", head: true })
          .eq("business_email", emAgent.business_email)
          .eq("role", "assistant");
        emMessages = count || 0;
      }

      // Unique customers on WhatsApp
      let uniqueCustomers = 0;
      if (waAgent?.whatsapp_number) {
        const { data: customers } = await supabase
          .from("chat_history")
          .select("customer_number")
          .eq("business_number", waAgent.whatsapp_number);
        if (customers) {
          uniqueCustomers = new Set(customers.map(c => c.customer_number)).size;
        }
      }

      const activeCount = (waAgent?.is_active ? 1 : 0) + (emAgent?.is_active ? 1 : 0);
      setStats({ whatsappMessages: waMessages, emailMessages: emMessages, activeAgents: activeCount, totalCustomers: uniqueCustomers });

      // Recent activity
      if (waAgent?.whatsapp_number) {
        const { data: recent } = await supabase
          .from("chat_history")
          .select("*")
          .eq("business_number", waAgent.whatsapp_number)
          .order("created_at", { ascending: false })
          .limit(5);
        setRecentActivity(recent || []);
      }

    } catch (err) {
      console.error("Dashboard load error:", err);
    }
  };

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

  const timeAgo = (dateStr) => {
    const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #e8f5e1 0%, #c8edb8 100%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "48px", marginBottom: "16px", animation: "spin 2s linear infinite" }}>🌿</div>
        <p style={{ color: "#2d5a27", fontFamily: "'DM Sans', sans-serif", fontSize: "16px" }}>Loading your dashboard...</p>
      </div>
      <style>{`@keyframes spin { 0%{transform:rotate(0deg)} 100%{transform:rotate(360deg)} }`}</style>
    </div>
  );

  const firstName = user?.user_metadata?.full_name?.split(" ")[0] || user?.email?.split("@")[0] || "there";
  const avatarUrl = user?.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.user_metadata?.full_name || user?.email)}&background=2d5a27&color=fff&size=40`;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        html, body { margin: 0; padding: 0; overflow-x: hidden; }
        * { box-sizing: border-box; }

        .db-page {
          min-height: 100vh;
          background: linear-gradient(160deg, #e8f5e1 0%, #c8edb8 30%, #a8d890 60%, #c8edb8 100%);
          position: relative; overflow-x: hidden;
          font-family: 'DM Sans', sans-serif;
        }

        .ray { position: fixed; top: -10%; width: 3px; height: 120vh; background: linear-gradient(180deg, rgba(255,220,100,0.25) 0%, rgba(255,220,100,0) 100%); transform-origin: top center; pointer-events: none; }
        .ray-1 { left: 15%; transform: rotate(-8deg); animation: rayPulse 4s ease-in-out infinite; }
        .ray-2 { left: 25%; transform: rotate(-4deg); width: 5px; animation: rayPulse 5s ease-in-out infinite 1s; background: linear-gradient(180deg, rgba(255,220,100,0.18) 0%, rgba(255,220,100,0) 100%); }
        .ray-3 { left: 35%; transform: rotate(2deg); animation: rayPulse 6s ease-in-out infinite 0.5s; }
        .ray-4 { left: 50%; transform: rotate(6deg); width: 4px; animation: rayPulse 4.5s ease-in-out infinite 2s; background: linear-gradient(180deg, rgba(255,220,100,0.15) 0%, rgba(255,220,100,0) 100%); }
        .ray-5 { left: 65%; transform: rotate(10deg); animation: rayPulse 5.5s ease-in-out infinite 1.5s; }
        .ray-6 { left: 78%; transform: rotate(14deg); width: 2px; animation: rayPulse 4s ease-in-out infinite 3s; }
        @keyframes rayPulse { 0%, 100% { opacity: 0.6; } 50% { opacity: 1; } }

        .leaf { position: fixed; pointer-events: none; animation: leafFall linear infinite; opacity: 0; }
        @keyframes leafFall {
          0% { transform: translateY(-20px) rotate(0deg); opacity: 0; }
          10% { opacity: 0.6; } 90% { opacity: 0.4; }
          100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
        }

        .sun-glow {
          position: fixed; top: -80px; left: 50%; transform: translateX(-50%);
          width: 600px; height: 300px;
          background: radial-gradient(ellipse, rgba(255,220,80,0.2) 0%, rgba(255,220,80,0) 70%);
          pointer-events: none; animation: glowPulse 5s ease-in-out infinite;
        }
        @keyframes glowPulse {
          0%, 100% { opacity: 0.7; transform: translateX(-50%) scale(1); }
          50% { opacity: 1; transform: translateX(-50%) scale(1.1); }
        }

        .db-navbar {
          position: sticky; top: 0; z-index: 100;
          display: flex; justify-content: space-between; align-items: center;
          padding: 14px 32px;
          background: rgba(255,255,255,0.5);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255,255,255,0.7);
        }

        .glass-card {
          background: rgba(255,255,255,0.65);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(255,255,255,0.85);
          border-radius: 20px;
        }

        .stat-card {
          background: rgba(255,255,255,0.65);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(255,255,255,0.85);
          border-radius: 18px; padding: 22px;
          transition: all 0.3s;
        }
        .stat-card:hover {
          background: rgba(255,255,255,0.85);
          transform: translateY(-3px);
          box-shadow: 0 12px 30px rgba(45,90,39,0.12);
        }

        .agent-row {
          background: rgba(255,255,255,0.5);
          border: 1px solid rgba(255,255,255,0.75);
          border-radius: 16px; padding: 16px;
          display: flex; align-items: center; gap: 12px;
          transition: all 0.3s; cursor: pointer; text-decoration: none;
          margin-bottom: 10px;
        }
        .agent-row:hover { background: rgba(255,255,255,0.8); transform: translateX(4px); }
        .agent-row:last-of-type { margin-bottom: 0; }

        .action-btn {
          background: rgba(255,255,255,0.55);
          border: 1px solid rgba(255,255,255,0.75);
          border-radius: 14px; padding: 16px 10px;
          text-align: center; cursor: pointer; transition: all 0.3s;
          color: #1a2e1a; text-decoration: none;
          display: flex; flex-direction: column; align-items: center; gap: 8px;
        }
        .action-btn:hover { background: rgba(255,255,255,0.85); transform: translateY(-3px); box-shadow: 0 8px 20px rgba(45,90,39,0.1); }

        .activity-row {
          display: flex; align-items: flex-start; gap: 12px;
          padding: 11px 0; border-bottom: 1px solid rgba(45,90,39,0.08);
        }
        .activity-row:last-child { border-bottom: none; padding-bottom: 0; }

        .status-dot { width: 7px; height: 7px; border-radius: 50%; display: inline-block; margin-right: 5px; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-1 { animation: fadeUp 0.5s ease forwards; }
        .fade-2 { animation: fadeUp 0.5s ease 0.08s forwards; opacity: 0; }
        .fade-3 { animation: fadeUp 0.5s ease 0.16s forwards; opacity: 0; }
        .fade-4 { animation: fadeUp 0.5s ease 0.24s forwards; opacity: 0; }
        .fade-5 { animation: fadeUp 0.5s ease 0.32s forwards; opacity: 0; }

        /* ── RESPONSIVE ── */
        @media(max-width: 1024px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .main-grid { grid-template-columns: 1fr !important; }
          .actions-grid { grid-template-columns: repeat(4, 1fr) !important; }
        }
        @media(max-width: 768px) {
          .db-navbar { padding: 12px 16px; }
          .logo-text { font-size: 18px !important; }
          .db-content { padding: 16px !important; }
          .stats-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 12px !important; }
          .stat-card { padding: 16px !important; }
          .stat-value { font-size: 26px !important; }
          .actions-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .plan-banner { flex-direction: column !important; align-items: flex-start !important; }
          .upgrade-btn { width: 100% !important; text-align: center !important; }
          .navbar-time { display: none !important; }
        }
        @media(max-width: 480px) {
          .stats-grid { grid-template-columns: 1fr 1fr !important; }
          .actions-grid { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>

      <div className="db-page">
        <div className="sun-glow" />
        <div className="ray ray-1" /><div className="ray ray-2" />
        <div className="ray ray-3" /><div className="ray ray-4" />
        <div className="ray ray-5" /><div className="ray ray-6" />
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
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none" }}>
            <span style={{ fontSize: "24px" }}>🌿</span>
            <span className="logo-text" style={{ fontFamily: "'Playfair Display', serif", fontSize: "22px", fontWeight: "700", color: "#1a2e1a" }}>
              Vasu Agents
            </span>
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span className="navbar-time" style={{ color: "#1a2e1a", fontSize: "14px", fontWeight: "700", letterSpacing: "0.5px" }}>{currentTime}</span>
            <div style={{ position: "relative" }}>
              <button onClick={() => setShowDropdown(!showDropdown)} style={{
                display: "flex", alignItems: "center", gap: "8px",
                background: "rgba(255,255,255,0.7)", border: "1.5px solid rgba(255,255,255,0.9)",
                borderRadius: "50px", padding: "6px 12px 6px 6px", cursor: "pointer"
              }}>
                <img src={avatarUrl} style={{ width: "32px", height: "32px", borderRadius: "50%", objectFit: "cover" }} />
                <span style={{ fontSize: "13px", fontWeight: "600", color: "#1a2e1a" }}>{firstName}</span>
                <span style={{ fontSize: "10px", color: "#5a7a5a" }}>▼</span>
              </button>
              {showDropdown && (
                <div style={{
                  position: "absolute", top: "50px", right: 0,
                  background: "rgba(255,255,255,0.98)", border: "1px solid rgba(255,255,255,0.9)",
                  borderRadius: "16px", padding: "8px",
                  boxShadow: "0 10px 40px rgba(45,90,39,0.2)", minWidth: "190px", zIndex: 200
                }}>
                  <div style={{ padding: "8px 14px 10px", fontSize: "11px", color: "#9ca3af", borderBottom: "1px solid #f0f0f0", marginBottom: "4px" }}>
                    {user?.email}
                  </div>
                  <Link href="/dashboard" onClick={() => setShowDropdown(false)}
                    style={{ display: "block", padding: "10px 14px", borderRadius: "10px", fontSize: "13px", color: "#1a2e1a", textDecoration: "none" }}>
                    🏠 Dashboard
                  </Link>
                  <button onClick={handleLogout} style={{
                    display: "block", width: "100%", textAlign: "left", padding: "10px 14px",
                    borderRadius: "10px", fontSize: "13px", color: "#dc2626",
                    background: "transparent", border: "none", cursor: "pointer", fontFamily: "'DM Sans', sans-serif"
                  }}>🚪 Logout</button>
                </div>
              )}
            </div>
          </div>
        </nav>

        {/* Content */}
        <div className="db-content" style={{ padding: "28px 32px", maxWidth: "1200px", margin: "0 auto" }}>

          {/* Welcome */}
          <div className="fade-1" style={{ marginBottom: "24px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "14px", flexWrap: "wrap" }}>
              <img src={avatarUrl} style={{ width: "54px", height: "54px", borderRadius: "50%", border: "3px solid rgba(255,255,255,0.8)", boxShadow: "0 4px 12px rgba(45,90,39,0.15)", flexShrink: 0 }} />
              <div>
                <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(20px, 4vw, 32px)", color: "#1a2e1a", margin: 0, fontWeight: "700" }}>
                  {getGreeting()}, {firstName}! 🌿
                </h1>
                <p style={{ color: "#5a7a5a", fontSize: "14px", margin: "3px 0 0" }}>
                  Live overview of your AI agents
                </p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="fade-2 stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "14px", marginBottom: "20px" }}>
            {[
              { icon: "💬", label: "WhatsApp Replies", value: stats.whatsappMessages, sub: "Total AI replies sent", color: "#25D366" },
              { icon: "📧", label: "Email Replies", value: stats.emailMessages, sub: "Total AI replies sent", color: "#4a9eff" },
              { icon: "🤖", label: "Active Agents", value: stats.activeAgents, sub: "Running right now", color: "#9b59b6" },
              { icon: "👥", label: "Customers Served", value: stats.totalCustomers, sub: "Unique on WhatsApp", color: "#ff7043" },
            ].map((stat) => (
              <div key={stat.label} className="stat-card">
                <div style={{ fontSize: "24px", marginBottom: "10px" }}>{stat.icon}</div>
                <div className="stat-value" style={{ fontSize: "30px", fontWeight: "700", color: stat.color, fontFamily: "'Playfair Display', serif", lineHeight: 1 }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: "13px", fontWeight: "700", color: "#1a2e1a", margin: "6px 0 2px" }}>{stat.label}</div>
                <div style={{ fontSize: "11px", color: "#5a7a5a" }}>{stat.sub}</div>
              </div>
            ))}
          </div>

          {/* Main Grid — Agents + Activity */}
          <div className="main-grid" style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: "18px", marginBottom: "18px" }}>

            {/* My Agents */}
            <div className="fade-3 glass-card" style={{ padding: "22px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "19px", color: "#1a2e1a", margin: 0 }}>My Agents</h2>
                <span style={{
                  background: stats.activeAgents > 0 ? "rgba(37,211,102,0.12)" : "rgba(45,90,39,0.1)",
                  color: stats.activeAgents > 0 ? "#16a34a" : "#2d5a27",
                  fontSize: "12px", fontWeight: "600", padding: "4px 12px", borderRadius: "50px"
                }}>
                  {stats.activeAgents} active
                </span>
              </div>

              <Link href="/dashboard/whatsapp-setup" className="agent-row">
                <div style={{ width: "42px", height: "42px", background: "rgba(37,211,102,0.1)", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", flexShrink: 0 }}>💬</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: "14px", fontWeight: "700", color: "#1a2e1a" }}>WhatsApp Agent</div>
                  <div style={{ fontSize: "12px", color: "#5a7a5a", marginTop: "2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {whatsappAgent?.business_name || "Not set up yet"}
                  </div>
                </div>
                <span style={{
                  fontSize: "11px", fontWeight: "600", padding: "4px 10px", borderRadius: "50px", flexShrink: 0,
                  background: whatsappAgent?.is_active ? "rgba(37,211,102,0.12)" : "rgba(255,165,0,0.12)",
                  color: whatsappAgent?.is_active ? "#16a34a" : "#e6900a"
                }}>
                  <span className="status-dot" style={{ background: whatsappAgent?.is_active ? "#16a34a" : "#e6900a" }} />
                  {whatsappAgent ? (whatsappAgent.is_active ? "Active" : "Pending") : "Setup"}
                </span>
              </Link>

              <Link href="/dashboard/email-setup" className="agent-row">
                <div style={{ width: "42px", height: "42px", background: "rgba(74,158,255,0.1)", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", flexShrink: 0 }}>📧</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: "14px", fontWeight: "700", color: "#1a2e1a" }}>Email Agent</div>
                  <div style={{ fontSize: "12px", color: "#5a7a5a", marginTop: "2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {emailAgent?.business_name || "Not set up yet"}
                  </div>
                </div>
                <span style={{
                  fontSize: "11px", fontWeight: "600", padding: "4px 10px", borderRadius: "50px", flexShrink: 0,
                  background: emailAgent?.is_active ? "rgba(37,211,102,0.12)" : "rgba(255,165,0,0.12)",
                  color: emailAgent?.is_active ? "#16a34a" : "#e6900a"
                }}>
                  <span className="status-dot" style={{ background: emailAgent?.is_active ? "#16a34a" : "#e6900a" }} />
                  {emailAgent ? (emailAgent.is_active ? "Active" : "Pending") : "Setup"}
                </span>
              </Link>

              <div style={{ textAlign: "center", padding: "12px 0 2px", color: "#5a7a5a", fontSize: "12px" }}>
                More agents coming soon 🌱
              </div>
            </div>

            {/* Recent Activity */}
            <div className="fade-3 glass-card" style={{ padding: "22px" }}>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "19px", color: "#1a2e1a", margin: "0 0 16px" }}>Recent Activity</h2>
              {recentActivity.length > 0 ? (
                recentActivity.map((item, i) => (
                  <div key={i} className="activity-row">
                    <div style={{ width: "32px", height: "32px", background: item.role === "user" ? "rgba(74,158,255,0.1)" : "rgba(37,211,102,0.1)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", flexShrink: 0 }}>
                      {item.role === "user" ? "👤" : "🤖"}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: "12px", fontWeight: "600", color: "#1a2e1a", marginBottom: "2px" }}>
                        {item.role === "user" ? "Customer message" : "AI replied"}
                      </div>
                      <div style={{ fontSize: "11px", color: "#5a7a5a", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {item.message?.slice(0, 42)}{item.message?.length > 42 ? "..." : ""}
                      </div>
                    </div>
                    <div style={{ fontSize: "10px", color: "#9ca3af", flexShrink: 0 }}>{timeAgo(item.created_at)}</div>
                  </div>
                ))
              ) : (
                <div style={{ textAlign: "center", padding: "28px 0" }}>
                  <div style={{ fontSize: "34px", marginBottom: "10px" }}>🌱</div>
                  <p style={{ color: "#5a7a5a", fontSize: "13px", lineHeight: "1.7", margin: 0 }}>
                    No activity yet.<br />Set up your first agent!
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="fade-4 glass-card" style={{ padding: "22px", marginBottom: "18px" }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "19px", color: "#1a2e1a", margin: "0 0 14px" }}>Quick Actions</h2>
            <div className="actions-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px" }}>
              {[
                { icon: "💬", label: "WhatsApp Setup", href: "/dashboard/whatsapp-setup" },
                { icon: "📧", label: "Email Setup", href: "/dashboard/email-setup" },
                { icon: "📊", label: "Analytics", href: "#" },
                { icon: "⚙️", label: "Settings", href: "#" },
              ].map((action) => (
                <Link key={action.label} href={action.href} className="action-btn">
                  <span style={{ fontSize: "26px" }}>{action.icon}</span>
                  <span style={{ fontSize: "12px", color: "#1a2e1a", fontWeight: "600", textAlign: "center", lineHeight: "1.4" }}>{action.label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Plan Banner */}
          <div className="fade-5 plan-banner" style={{
            background: "rgba(255,255,255,0.55)",
            border: "1.5px solid rgba(255,255,255,0.8)",
            borderRadius: "20px", padding: "20px 26px",
            display: "flex", justifyContent: "space-between", alignItems: "center",
            flexWrap: "wrap", gap: "14px", backdropFilter: "blur(12px)"
          }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "5px" }}>
                <span style={{ fontSize: "18px" }}>🌿</span>
                <span style={{ color: "#1a2e1a", fontWeight: "700", fontSize: "16px", fontFamily: "'Playfair Display', serif" }}>Free Plan</span>
                <span style={{ background: "rgba(45,90,39,0.1)", color: "#4a7c59", fontSize: "11px", fontWeight: "600", padding: "3px 10px", borderRadius: "50px" }}>Current</span>
              </div>
              <p style={{ color: "#5a7a5a", fontSize: "13px", margin: 0 }}>
                Upgrade to unlock unlimited agents, real-time analytics & priority support
              </p>
            </div>
            <button className="upgrade-btn" style={{
              padding: "11px 26px", borderRadius: "50px",
              background: "linear-gradient(135deg, #2d5a27, #4a7c59)",
              border: "none", color: "white", fontSize: "14px", fontWeight: "600",
              cursor: "pointer", whiteSpace: "nowrap", fontFamily: "'DM Sans', sans-serif",
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
