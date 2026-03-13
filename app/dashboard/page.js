"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  const [stats, setStats] = useState({ whatsappMessages: 0, emailMessages: 0, activeAgents: 0, totalCustomers: 0 });
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
  }, [router]);

  const loadDashboardData = async (userId) => {
    try {
      const { data: waAgent } = await supabase.from("whatsapp_agents").select("*").eq("user_id", userId).single();
      setWhatsappAgent(waAgent);
      const { data: emAgent } = await supabase.from("email_agents").select("*").eq("user_id", userId).single();
      setEmailAgent(emAgent);

      let waMessages = 0;
      if (waAgent?.whatsapp_number) {
        const { count } = await supabase.from("chat_history").select("*", { count: "exact", head: true }).eq("business_number", waAgent.whatsapp_number).eq("role", "assistant");
        waMessages = count || 0;
      }
      let emMessages = 0;
      if (emAgent?.business_email) {
        const { count } = await supabase.from("email_history").select("*", { count: "exact", head: true }).eq("business_email", emAgent.business_email).eq("role", "assistant");
        emMessages = count || 0;
      }
      let uniqueCustomers = 0;
      if (waAgent?.whatsapp_number) {
        const { data: customers } = await supabase.from("chat_history").select("customer_number").eq("business_number", waAgent.whatsapp_number);
        if (customers) uniqueCustomers = new Set(customers.map(c => c.customer_number)).size;
      }
      const activeCount = (waAgent?.is_active ? 1 : 0) + (emAgent?.is_active ? 1 : 0);
      setStats({ whatsappMessages: waMessages, emailMessages: emMessages, activeAgents: activeCount, totalCustomers: uniqueCustomers });

      if (waAgent?.whatsapp_number) {
        const { data: recent } = await supabase.from("chat_history").select("*").eq("business_number", waAgent.whatsapp_number).order("created_at", { ascending: false }).limit(5);
        setRecentActivity(recent || []);
      }
    } catch (err) { console.error("Dashboard load error:", err); }
  };

  const handleLogout = async () => { await supabase.auth.signOut(); router.push("/"); };

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  const timeAgo = (dateStr) => {
    const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#fafafa", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Geist, sans-serif" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ width: "40px", height: "40px", border: "3px solid #e4e4e7", borderTop: "3px solid #7c3aed", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 16px" }} />
        <p style={{ color: "#71717a", fontSize: "14px" }}>Loading your dashboard...</p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  const firstName = user?.user_metadata?.full_name?.split(" ")[0] || user?.email?.split("@")[0] || "there";
  const avatarUrl = user?.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.user_metadata?.full_name || user?.email)}&background=7c3aed&color=fff&size=40`;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Geist:wght@300;400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #fafafa; font-family: 'Geist', sans-serif; overflow-x: hidden; }

        :root {
          --purple: #7c3aed; --purple-light: #8b5cf6;
          --purple-soft: #f5f3ff; --purple-dim: #ede9fe;
          --black: #0a0a0a; --grey-1: #18181b; --grey-2: #3f3f46;
          --grey-3: #71717a; --grey-4: #a1a1aa; --grey-5: #d4d4d8;
          --grey-6: #e4e4e7; --grey-7: #f4f4f5; --white: #ffffff;
        }

        /* LAYOUT */
        .db-wrap { display: flex; min-height: 100vh; }

        /* SIDEBAR */
        .sidebar {
          width: 240px; flex-shrink: 0;
          background: var(--black);
          display: flex; flex-direction: column;
          padding: 0; position: fixed; top: 0; left: 0; bottom: 0;
          z-index: 100; transition: transform 0.3s;
        }
        .sb-logo { display: flex; align-items: center; gap: 10px; padding: 20px 20px 0; text-decoration: none; }
        .sb-logo-icon { width: 32px; height: 32px; border-radius: 8px; background: linear-gradient(135deg, var(--purple), #a855f7); display: flex; align-items: center; justify-content: center; font-size: 16px; color: white; flex-shrink: 0; }
        .sb-logo-text { font-size: 14px; font-weight: 600; color: white; letter-spacing: -0.3px; }
        .sb-divider { height: 1px; background: rgba(255,255,255,0.08); margin: 16px 20px; }
        .sb-label { font-size: 10px; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase; color: rgba(255,255,255,0.25); padding: 0 20px 8px; }
        .sb-link { display: flex; align-items: center; gap: 10px; padding: 10px 20px; border-radius: 0; font-size: 13px; font-weight: 500; color: rgba(255,255,255,0.55); text-decoration: none; transition: all 0.15s; margin: 1px 10px; border-radius: 8px; }
        .sb-link:hover { background: rgba(255,255,255,0.06); color: rgba(255,255,255,0.9); }
        .sb-link.active { background: rgba(124,58,237,0.25); color: white; }
        .sb-link-icon { width: 18px; text-align: center; font-size: 15px; flex-shrink: 0; }
        .sb-bottom { margin-top: auto; padding: 16px 10px; border-top: 1px solid rgba(255,255,255,0.08); }
        .sb-user { display: flex; align-items: center; gap: 10px; padding: 10px; border-radius: 8px; cursor: pointer; transition: background 0.15s; }
        .sb-user:hover { background: rgba(255,255,255,0.06); }
        .sb-av { width: 32px; height: 32px; border-radius: 8px; object-fit: cover; flex-shrink: 0; }
        .sb-uname { font-size: 13px; font-weight: 500; color: white; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; flex: 1; min-width: 0; }
        .sb-uemail { font-size: 11px; color: rgba(255,255,255,0.35); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .sb-logout { display: flex; align-items: center; gap: 8px; padding: 9px 10px; border-radius: 8px; font-size: 13px; color: rgba(255,100,100,0.7); background: none; border: none; cursor: pointer; font-family: 'Geist', sans-serif; width: 100%; transition: all 0.15s; margin-top: 2px; }
        .sb-logout:hover { background: rgba(255,100,100,0.08); color: #f87171; }

        /* MAIN */
        .db-main { flex: 1; margin-left: 240px; min-height: 100vh; background: var(--grey-7); }

        /* TOP BAR */
        .db-topbar { background: var(--white); border-bottom: 1px solid var(--grey-6); padding: 0 32px; height: 60px; display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; z-index: 50; }
        .db-topbar-left { display: flex; flex-direction: column; }
        .db-topbar-title { font-size: 15px; font-weight: 600; color: var(--black); }
        .db-topbar-sub { font-size: 12px; color: var(--grey-4); }
        .db-topbar-right { display: flex; align-items: center; gap: 10px; }
        .topbar-badge { display: flex; align-items: center; gap: 6px; padding: 6px 12px; border-radius: 8px; background: var(--grey-7); border: 1px solid var(--grey-6); font-size: 12px; color: var(--grey-2); font-weight: 500; }
        .topbar-dot { width: 6px; height: 6px; border-radius: 50%; background: #22c55e; box-shadow: 0 0 0 2px rgba(34,197,94,0.2); }

        /* CONTENT */
        .db-content { padding: 28px 32px; max-width: 1100px; }

        /* STAT CARDS */
        .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 24px; }
        .sc { background: var(--white); border: 1px solid var(--grey-6); border-radius: 16px; padding: 22px; transition: all 0.2s; }
        .sc:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.07); }
        .sc-icon { width: 38px; height: 38px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 18px; margin-bottom: 14px; }
        .sc-val { font-family: 'Instrument Serif', serif; font-size: 32px; color: var(--black); line-height: 1; margin-bottom: 4px; }
        .sc-label { font-size: 13px; font-weight: 500; color: var(--black); margin-bottom: 2px; }
        .sc-sub { font-size: 11px; color: var(--grey-4); }

        /* MAIN GRID */
        .main-grid { display: grid; grid-template-columns: 1.2fr 1fr; gap: 16px; margin-bottom: 16px; }

        /* CARDS */
        .card { background: var(--white); border: 1px solid var(--grey-6); border-radius: 18px; padding: 24px; }
        .card-title { font-size: 15px; font-weight: 600; color: var(--black); margin-bottom: 18px; display: flex; align-items: center; justify-content: space-between; }
        .card-badge { font-size: 11px; font-weight: 600; padding: 3px 10px; border-radius: 50px; }

        /* AGENT ROWS */
        .ag-row { display: flex; align-items: center; gap: 12px; padding: 12px; border-radius: 12px; text-decoration: none; transition: all 0.2s; margin-bottom: 8px; border: 1px solid var(--grey-6); }
        .ag-row:last-of-type { margin-bottom: 0; }
        .ag-row:hover { background: var(--grey-7); transform: translateX(3px); }
        .ag-icon { width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 18px; flex-shrink: 0; }
        .ag-name { font-size: 13px; font-weight: 600; color: var(--black); }
        .ag-sub { font-size: 11px; color: var(--grey-4); margin-top: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .ag-status { font-size: 11px; font-weight: 600; padding: 3px 10px; border-radius: 50px; white-space: nowrap; flex-shrink: 0; }

        /* ACTIVITY */
        .act-row { display: flex; align-items: flex-start; gap: 10px; padding: 10px 0; border-bottom: 1px solid var(--grey-6); }
        .act-row:last-child { border-bottom: none; padding-bottom: 0; }
        .act-icon { width: 30px; height: 30px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 13px; flex-shrink: 0; }
        .act-msg { font-size: 12px; font-weight: 600; color: var(--black); margin-bottom: 2px; }
        .act-text { font-size: 11px; color: var(--grey-4); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 180px; }
        .act-time { font-size: 10px; color: var(--grey-5); flex-shrink: 0; margin-left: auto; }

        /* QUICK ACTIONS */
        .qa-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
        .qa-item { display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 18px 12px; border-radius: 14px; border: 1px solid var(--grey-6); background: var(--white); text-decoration: none; color: var(--black); transition: all 0.2s; cursor: pointer; }
        .qa-item:hover { border-color: var(--purple-dim); background: var(--purple-soft); transform: translateY(-2px); }
        .qa-icon { width: 40px; height: 40px; border-radius: 11px; display: flex; align-items: center; justify-content: center; font-size: 20px; }
        .qa-label { font-size: 12px; font-weight: 600; color: var(--black); text-align: center; line-height: 1.3; }

        /* PLAN BANNER */
        .plan-banner { background: var(--black); border-radius: 18px; padding: 22px 28px; display: flex; align-items: center; justify-content: space-between; gap: 16px; margin-top: 16px; flex-wrap: wrap; }
        .plan-title { font-family: 'Instrument Serif', serif; font-size: 20px; color: white; margin-bottom: 4px; }
        .plan-sub { font-size: 13px; color: rgba(255,255,255,0.45); }
        .plan-btn { padding: 11px 24px; border-radius: 10px; background: var(--purple); color: white; border: none; font-size: 14px; font-weight: 600; cursor: pointer; font-family: 'Geist', sans-serif; white-space: nowrap; transition: all 0.2s; text-decoration: none; display: inline-block; }
        .plan-btn:hover { background: var(--purple-light); transform: translateY(-1px); }

        /* MOBILE TOPBAR */
        .mob-topbar { display: none; position: fixed; top: 0; left: 0; right: 0; z-index: 200; height: 56px; background: var(--white); border-bottom: 1px solid var(--grey-6); padding: 0 16px; align-items: center; justify-content: space-between; }
        .hb { display: flex; flex-direction: column; gap: 5px; background: none; border: none; cursor: pointer; padding: 4px; }
        .hb span { display: block; width: 20px; height: 2px; background: var(--black); border-radius: 2px; transition: all 0.25s; }
        .hb.open span:nth-child(1) { transform: rotate(45deg) translate(5px, 5px); }
        .hb.open span:nth-child(2) { opacity: 0; }
        .hb.open span:nth-child(3) { transform: rotate(-45deg) translate(5px, -5px); }
        .sb-overlay { display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 99; }

        @keyframes fadeUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
        .f1 { animation: fadeUp 0.5s ease both; }
        .f2 { animation: fadeUp 0.5s ease 0.07s both; }
        .f3 { animation: fadeUp 0.5s ease 0.14s both; }
        .f4 { animation: fadeUp 0.5s ease 0.21s both; }
        .f5 { animation: fadeUp 0.5s ease 0.28s both; }

        /* ── RESPONSIVE ── */
        @media (max-width: 1024px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr); }
          .main-grid { grid-template-columns: 1fr; }
          .qa-grid { grid-template-columns: repeat(4, 1fr); }
        }

        @media (max-width: 768px) {
          .sidebar { transform: translateX(-100%); }
          .sidebar.mob-open { transform: translateX(0); }
          .sb-overlay.mob-open { display: block; }
          .db-main { margin-left: 0; padding-top: 56px; }
          .mob-topbar { display: flex; }
          .db-topbar { display: none; }
          .db-content { padding: 20px 16px; }
          .stats-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; }
          .sc { padding: 16px; }
          .sc-val { font-size: 26px; }
          .qa-grid { grid-template-columns: repeat(2, 1fr); }
          .plan-banner { flex-direction: column; align-items: flex-start; }
          .plan-btn { width: 100%; text-align: center; }
        }

        @media (max-width: 480px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr); }
          .act-text { max-width: 120px; }
        }
      `}</style>

      {/* MOBILE TOPBAR */}
      <div className="mob-topbar">
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none" }}>
          <img src="/logo.png" style={{ height: "30px", width: "30px", borderRadius: "8px", background: "transparent", mixBlendMode: "multiply" }} />
          <span style={{ fontSize: "14px", fontWeight: "600", color: "var(--black)" }}>Soni AI Agents</span>
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <img src={avatarUrl} style={{ width: "30px", height: "30px", borderRadius: "8px", objectFit: "cover" }} />
          <button className={`hb ${showDropdown ? "open" : ""}`} onClick={() => setShowDropdown(!showDropdown)}>
            <span /><span /><span />
          </button>
        </div>
      </div>

      {/* MOBILE DROPDOWN */}
      {showDropdown && (
        <div style={{ position: "fixed", top: "56px", right: "16px", background: "var(--white)", border: "1px solid var(--grey-6)", borderRadius: "14px", padding: "8px", boxShadow: "0 8px 32px rgba(0,0,0,0.12)", minWidth: "200px", zIndex: 300 }}>
          <div style={{ padding: "8px 12px 10px", fontSize: "11px", color: "var(--grey-4)", borderBottom: "1px solid var(--grey-6)", marginBottom: "4px" }}>{user?.email}</div>
          <Link href="/dashboard" style={{ display: "block", padding: "9px 12px", borderRadius: "8px", fontSize: "13px", color: "var(--black)", textDecoration: "none" }} onClick={() => setShowDropdown(false)}>Dashboard</Link>
          <Link href="/" style={{ display: "block", padding: "9px 12px", borderRadius: "8px", fontSize: "13px", color: "var(--black)", textDecoration: "none" }} onClick={() => setShowDropdown(false)}>Home</Link>
          <button onClick={handleLogout} style={{ display: "block", width: "100%", textAlign: "left", padding: "9px 12px", borderRadius: "8px", fontSize: "13px", color: "#dc2626", background: "none", border: "none", cursor: "pointer", fontFamily: "Geist, sans-serif" }}>Logout</button>
        </div>
      )}

      <div className="db-wrap">
        {/* SIDEBAR */}
        <aside className="sidebar">
          <Link href="/" className="sb-logo">
            <img src="/logo.png" style={{ height: "30px", width: "30px"}} />
            <span className="sb-logo-text">Soni AI Agents</span>
          </Link>

          <div className="sb-divider" />

          <div className="sb-label">Overview</div>
          <Link href="/dashboard" className="sb-link active">
            <span className="sb-link-icon">⊞</span> Dashboard
          </Link>

          <div style={{ marginTop: "12px" }} />
          <div className="sb-label">Agents</div>
          <Link href="/dashboard/whatsapp-setup" className="sb-link">
            <span className="sb-link-icon"><img src="/whatsappsvg.png" style={{ height: "20px", width: "20px"}} /></span> WhatsApp Agent
          </Link>
          <Link href="/dashboard/email-setup" className="sb-link">
            <span className="sb-link-icon">📧</span> Email Agent
          </Link>

          <div style={{ marginTop: "12px" }} />
          <div className="sb-label">Account</div>
          <Link href="/pricing" className="sb-link">
            <span className="sb-link-icon">⬆</span> Upgrade Plan
          </Link>
          <Link href="/" className="sb-link">
            <span className="sb-link-icon">←</span> Back to Website
          </Link>

          <div className="sb-bottom">
            <div className="sb-user">
              <img src={avatarUrl} className="sb-av" alt="avatar" />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="sb-uname">{firstName}</div>
                <div className="sb-uemail">{user?.email}</div>
              </div>
            </div>
            <button className="sb-logout" onClick={handleLogout}>
              <span>⊗</span> Logout
            </button>
          </div>
        </aside>

        {/* MAIN */}
        <main className="db-main">

          {/* TOP BAR */}
          <div className="db-topbar">
            <div className="db-topbar-left">
              <span className="db-topbar-title">{getGreeting()}, {firstName}!</span>
              <span className="db-topbar-sub">Here's your AI agent overview</span>
            </div>
            <div className="db-topbar-right">
              <div className="topbar-badge">
                <div className="topbar-dot" />
                {stats.activeAgents > 0 ? `${stats.activeAgents} agent${stats.activeAgents > 1 ? "s" : ""} live` : "No agents active"}
              </div>
              <img src={avatarUrl} style={{ width: "34px", height: "34px", borderRadius: "9px", objectFit: "cover", border: "2px solid var(--grey-6)" }} />
            </div>
          </div>

          {/* CONTENT */}
          <div className="db-content">

            {/* STATS */}
            <div className="stats-grid f1">
              {[
                { icon: "💬", bg: "rgba(37,211,102,0.1)", val: stats.whatsappMessages, label: "WhatsApp Replies", sub: "AI replies sent" },
                { icon: "📧", bg: "rgba(74,158,255,0.1)", val: stats.emailMessages, label: "Email Replies", sub: "AI replies sent" },
                { icon: "🤖", bg: "rgba(124,58,237,0.1)", val: stats.activeAgents, label: "Active Agents", sub: "Running now" },
                { icon: "👥", bg: "rgba(245,158,11,0.1)", val: stats.totalCustomers, label: "Customers Served", sub: "Unique on WhatsApp" },
              ].map((s) => (
                <div key={s.label} className="sc">
                  <div className="sc-icon" style={{ background: s.bg }}>{s.icon}</div>
                  <div className="sc-val">{s.val}</div>
                  <div className="sc-label">{s.label}</div>
                  <div className="sc-sub">{s.sub}</div>
                </div>
              ))}
            </div>

            {/* AGENTS + ACTIVITY */}
            <div className="main-grid f2">
              {/* Agents */}
              <div className="card">
                <div className="card-title">
                  My Agents
                  <span className="card-badge" style={{ background: stats.activeAgents > 0 ? "rgba(34,197,94,0.1)" : "var(--grey-7)", color: stats.activeAgents > 0 ? "#16a34a" : "var(--grey-3)" }}>
                    {stats.activeAgents} active
                  </span>
                </div>

                <Link href="/dashboard/whatsapp-setup" className="ag-row">
                  <div className="ag-icon" style={{ background: "rgba(37,211,102,0.1)" }}>💬</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="ag-name">WhatsApp Agent</div>
                    <div className="ag-sub">{whatsappAgent?.business_name || "Not set up yet"}</div>
                  </div>
                  <span className="ag-status" style={{
                    background: whatsappAgent?.is_active ? "rgba(34,197,94,0.1)" : whatsappAgent ? "rgba(245,158,11,0.1)" : "var(--grey-7)",
                    color: whatsappAgent?.is_active ? "#16a34a" : whatsappAgent ? "#d97706" : "var(--grey-3)"
                  }}>
                    {whatsappAgent ? (whatsappAgent.is_active ? "● Active" : "● Pending") : "Setup →"}
                  </span>
                </Link>

                <Link href="/dashboard/email-setup" className="ag-row">
                  <div className="ag-icon" style={{ background: "rgba(74,158,255,0.1)" }}>📧</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="ag-name">Email Agent</div>
                    <div className="ag-sub">{emailAgent?.business_name || "Not set up yet"}</div>
                  </div>
                  <span className="ag-status" style={{
                    background: emailAgent?.is_active ? "rgba(34,197,94,0.1)" : emailAgent ? "rgba(245,158,11,0.1)" : "var(--grey-7)",
                    color: emailAgent?.is_active ? "#16a34a" : emailAgent ? "#d97706" : "var(--grey-3)"
                  }}>
                    {emailAgent ? (emailAgent.is_active ? "● Active" : "● Pending") : "Setup →"}
                  </span>
                </Link>

                <Link href="/dashboard/voice-setup" className="ag-row">
                  <div className="ag-icon" style={{ background: "rgba(124,58,237,0.1)" }}>📞</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="ag-name">Voice Agent</div>
                    <div className="ag-sub">AI call answering</div>
                  </div>
                  <span className="ag-status" style={{ background: "var(--grey-7)", color: "var(--grey-3)" }}>
                    Setup →
                  </span>
                </Link>

                <div style={{ textAlign: "center", padding: "14px 0 0", fontSize: "12px", color: "var(--grey-4)" }}>
                  More agents coming soon 
                </div>
              </div>

              {/* Activity */}
              <div className="card">
                <div className="card-title">Recent Activity</div>
                {recentActivity.length > 0 ? (
                  recentActivity.map((item, i) => (
                    <div key={i} className="act-row">
                      <div className="act-icon" style={{ background: item.role === "user" ? "rgba(74,158,255,0.1)" : "rgba(124,58,237,0.1)" }}>
                        {item.role === "user" ? "👤" : "🤖"}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div className="act-msg">{item.role === "user" ? "Customer message" : "AI replied"}</div>
                        <div className="act-text">{item.message?.slice(0, 40)}{item.message?.length > 40 ? "..." : ""}</div>
                      </div>
                      <div className="act-time">{timeAgo(item.created_at)}</div>
                    </div>
                  ))
                ) : (
                  <div style={{ textAlign: "center", padding: "32px 0" }}>
                    <img src="/logo.png" style={{ height: "30px", width: "30px", borderRadius: "8px", background: "transparent", mixBlendMode: "multiply" }} />
                    <p style={{ color: "var(--grey-4)", fontSize: "13px", lineHeight: 1.7 }}>No activity yet.<br />Set up your first agent!</p>
                  </div>
                )}
              </div>
            </div>

            {/* QUICK ACTIONS */}
            <div className="card f3" style={{ marginBottom: "16px" }}>
              <div className="card-title">Quick Actions</div>
              <div className="qa-grid">
                {[
                  { icon: "💬", label: "WhatsApp Setup", href: "/dashboard/whatsapp-setup", bg: "rgba(37,211,102,0.1)" },
                  { icon: "📧", label: "Email Setup", href: "/dashboard/email-setup", bg: "rgba(74,158,255,0.1)" },
                  { icon: "💰", label: "Upgrade Plan", href: "/pricing", bg: "rgba(124,58,237,0.1)" },
                  { icon: "🏠", label: "Back to Home", href: "/", bg: "rgba(245,158,11,0.1)" },
                ].map((a) => (
                  <Link key={a.label} href={a.href} className="qa-item">
                    <div className="qa-icon" style={{ background: a.bg }}>{a.icon}</div>
                    <span className="qa-label">{a.label}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* PLAN BANNER */}
            <div className="plan-banner f4">
              <div>
                <div className="plan-title">Upgrade your plan</div>
                <div className="plan-sub">Get unlimited agents, priority support & full analytics.</div>
              </div>
              <Link href="/pricing" className="plan-btn">View Plans →</Link>
            </div>

          </div>
        </main>
      </div>

      {(showDropdown) && <div style={{ position: "fixed", inset: 0, zIndex: 198 }} onClick={() => setShowDropdown(false)} />}
    </>
  );
}