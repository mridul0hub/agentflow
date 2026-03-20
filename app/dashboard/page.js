"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mobOpen, setMobOpen] = useState(false);
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
    <div style={{ minHeight: "100vh", background: "#0d0d14", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Montserrat, sans-serif" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ width: "40px", height: "40px", border: "3px solid rgba(124,58,237,0.2)", borderTop: "3px solid #7c3aed", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 16px" }} />
        <p style={{ color: "#9898c0", fontSize: "14px", fontWeight: "500" }}>Loading dashboard...</p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  const firstName = user?.user_metadata?.full_name?.split(" ")[0] || user?.email?.split("@")[0] || "there";
  const avatarUrl = user?.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.user_metadata?.full_name || user?.email)}&background=7c3aed&color=fff&size=40`;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0d0d14; font-family: 'Montserrat', sans-serif; overflow-x: hidden; }

        :root {
          --bg: #0d0d14; --bg-2: #11111c; --bg-3: #16162a; --bg-4: #1c1c30;
          --border: rgba(124,58,237,0.15); --border-2: rgba(124,58,237,0.25);
          --p: #7c3aed; --p2: #8b5cf6; --p3: #a78bfa;
          --p-soft: rgba(124,58,237,0.08); --p-mid: rgba(124,58,237,0.15);
          --text: #e8e8f0; --text-2: #c8c8e0; --text-3: #9898c0; --text-4: #606080;
          --sh-p: 0 0 24px rgba(124,58,237,0.25), 0 4px 12px rgba(124,58,237,0.15);
          --sh-card: 0 2px 16px rgba(0,0,0,0.4), 0 0 0 1px var(--border);
          --sh-card-hover: 0 8px 40px rgba(0,0,0,0.5), 0 0 0 1px var(--border-2), 0 0 32px rgba(124,58,237,0.15);
        }

        /* LAYOUT */
        .db-wrap { display: flex; min-height: 100vh; }

        /* SIDEBAR */
        .sidebar { width: 248px; flex-shrink: 0; background: var(--bg-2); border-right: 1px solid var(--border); display: flex; flex-direction: column; position: fixed; top: 0; left: 0; bottom: 0; z-index: 100; transition: transform 0.3s; }
        .sb-logo { display: flex; align-items: center; gap: 10px; padding: 22px 20px 0; text-decoration: none; }
        .sb-logo-text { font-size: 13px; font-weight: 700; color: var(--text); letter-spacing: 1.5px; text-transform: uppercase; }
        .sb-divider { height: 1px; background: var(--border); margin: 18px 20px; }
        .sb-label { font-size: 10px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: var(--text-4); padding: 0 20px 8px; }
        .sb-link { display: flex; align-items: center; gap: 10px; padding: 10px 14px; font-size: 13px; font-weight: 500; color: var(--text-3); text-decoration: none; transition: all 0.15s; margin: 1px 8px; border-radius: 10px; }
        .sb-link:hover { background: var(--p-soft); color: var(--text-2); }
        .sb-link.active { background: var(--p-mid); color: var(--p3); border: 1px solid var(--border); }
        .sb-link-icon { width: 18px; text-align: center; font-size: 15px; flex-shrink: 0; }
        .sb-bottom { margin-top: auto; padding: 14px 8px; border-top: 1px solid var(--border); }
        .sb-user { display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: 10px; margin-bottom: 4px; }
        .sb-av { width: 32px; height: 32px; border-radius: 8px; object-fit: cover; flex-shrink: 0; border: 1px solid var(--border); }
        .sb-uname { font-size: 12px; font-weight: 600; color: var(--text-2); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; flex: 1; min-width: 0; }
        .sb-uemail { font-size: 10px; color: var(--text-4); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .sb-logout { display: flex; align-items: center; gap: 8px; padding: 9px 12px; border-radius: 10px; font-size: 13px; color: rgba(248,113,113,0.6); background: none; border: none; cursor: pointer; font-family: 'Montserrat', sans-serif; width: 100%; transition: all 0.15s; font-weight: 500; }
        .sb-logout:hover { background: rgba(248,113,113,0.08); color: #f87171; }

        /* MAIN */
        .db-main { flex: 1; margin-left: 248px; min-height: 100vh; background: var(--bg); }

        /* TOPBAR */
        .db-topbar { background: var(--bg-2); border-bottom: 1px solid var(--border); padding: 0 32px; height: 64px; display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; z-index: 50; }
        .db-topbar-title { font-size: 15px; font-weight: 700; color: var(--text); letter-spacing: -0.2px; }
        .db-topbar-sub { font-size: 12px; color: var(--text-4); margin-top: 2px; font-weight: 400; }
        .db-topbar-right { display: flex; align-items: center; gap: 10px; }
        .topbar-badge { display: flex; align-items: center; gap: 6px; padding: 7px 14px; border-radius: 8px; background: var(--p-soft); border: 1px solid var(--border); font-size: 12px; color: var(--p3); font-weight: 600; }
        .topbar-dot { width: 6px; height: 6px; border-radius: 50%; background: #22c55e; box-shadow: 0 0 0 2px rgba(34,197,94,0.2); }

        /* CONTENT */
        .db-content { padding: 28px 32px; max-width: 1100px; }

        /* STAT CARDS */
        .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 20px; }
        .sc { background: var(--bg-2); border: 1px solid var(--border); border-radius: 18px; padding: 22px; transition: all 0.25s; box-shadow: var(--sh-card); }
        .sc:hover { transform: translateY(-3px); box-shadow: var(--sh-card-hover); border-color: var(--border-2); }
        .sc-icon { width: 40px; height: 40px; border-radius: 11px; display: flex; align-items: center; justify-content: center; font-size: 18px; margin-bottom: 16px; border: 1px solid var(--border); }
        .sc-val { font-family: 'Montserrat', sans-serif; font-size: 32px; font-weight: 800; color: var(--text); line-height: 1; margin-bottom: 6px; letter-spacing: -1px; }
        .sc-label { font-size: 13px; font-weight: 600; color: var(--text-2); margin-bottom: 2px; }
        .sc-sub { font-size: 11px; color: var(--text-4); font-weight: 400; }

        /* MAIN GRID */
        .main-grid { display: grid; grid-template-columns: 1.2fr 1fr; gap: 16px; margin-bottom: 16px; }

        /* CARDS */
        .card { background: var(--bg-2); border: 1px solid var(--border); border-radius: 20px; padding: 26px; box-shadow: var(--sh-card); }
        .card-title { font-size: 14px; font-weight: 700; color: var(--text); margin-bottom: 20px; display: flex; align-items: center; justify-content: space-between; letter-spacing: 0.1px; }
        .card-badge { font-size: 11px; font-weight: 600; padding: 3px 10px; border-radius: 50px; }

        /* AGENT ROWS */
        .ag-row { display: flex; align-items: center; gap: 12px; padding: 13px; border-radius: 12px; text-decoration: none; transition: all 0.2s; margin-bottom: 8px; border: 1px solid var(--border); background: var(--bg-3); }
        .ag-row:last-of-type { margin-bottom: 0; }
        .ag-row:hover { background: var(--bg-4); border-color: var(--border-2); transform: translateX(3px); }
        .ag-icon { width: 40px; height: 40px; border-radius: 11px; display: flex; align-items: center; justify-content: center; font-size: 18px; flex-shrink: 0; border: 1px solid var(--border); }
        .ag-name { font-size: 13px; font-weight: 600; color: var(--text); }
        .ag-sub { font-size: 11px; color: var(--text-4); margin-top: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-weight: 400; }
        .ag-status { font-size: 11px; font-weight: 600; padding: 4px 11px; border-radius: 50px; white-space: nowrap; flex-shrink: 0; }

        /* ACTIVITY */
        .act-row { display: flex; align-items: flex-start; gap: 10px; padding: 11px 0; border-bottom: 1px solid var(--border); }
        .act-row:last-child { border-bottom: none; padding-bottom: 0; }
        .act-icon { width: 32px; height: 32px; border-radius: 9px; display: flex; align-items: center; justify-content: center; font-size: 13px; flex-shrink: 0; border: 1px solid var(--border); }
        .act-msg { font-size: 12px; font-weight: 600; color: var(--text-2); margin-bottom: 2px; }
        .act-text { font-size: 11px; color: var(--text-4); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 180px; font-weight: 400; }
        .act-time { font-size: 10px; color: var(--text-4); flex-shrink: 0; margin-left: auto; font-weight: 500; }

        /* QUICK ACTIONS */
        .qa-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
        .qa-item { display: flex; flex-direction: column; align-items: center; gap: 10px; padding: 20px 12px; border-radius: 16px; border: 1px solid var(--border); background: var(--bg-3); text-decoration: none; color: var(--text); transition: all 0.25s; cursor: pointer; box-shadow: var(--sh-card); }
        .qa-item:hover { border-color: var(--border-2); background: var(--bg-4); transform: translateY(-3px); box-shadow: var(--sh-card-hover); }
        .qa-icon { width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 20px; border: 1px solid var(--border); }
        .qa-label { font-size: 12px; font-weight: 600; color: var(--text-2); text-align: center; line-height: 1.4; }

        /* UPGRADE BANNER */
        .upgrade-banner { background: var(--bg-2); border: 1px solid var(--border-2); border-radius: 20px; padding: 24px 28px; display: flex; align-items: center; justify-content: space-between; gap: 16px; margin-top: 16px; flex-wrap: wrap; box-shadow: var(--sh-p); position: relative; overflow: hidden; }
        .upgrade-banner::before { content: ''; position: absolute; inset: 0; background: radial-gradient(ellipse 60% 80% at 100% 50%, rgba(124,58,237,0.1) 0%, transparent 60%); pointer-events: none; }
        .upgrade-title { font-size: 18px; font-weight: 700; color: var(--text); margin-bottom: 5px; letter-spacing: -0.2px; position: relative; }
        .upgrade-sub { font-size: 13px; color: var(--text-4); font-weight: 400; position: relative; }
        .upgrade-btn { padding: 12px 28px; border-radius: 10px; background: var(--p); color: white; border: none; font-size: 14px; font-weight: 700; cursor: pointer; font-family: 'Montserrat', sans-serif; white-space: nowrap; transition: all 0.2s; text-decoration: none; display: inline-block; box-shadow: var(--sh-p); letter-spacing: 0.2px; position: relative; }
        .upgrade-btn:hover { background: var(--p2); transform: translateY(-2px); }

        /* MOBILE */
        .mob-topbar { display: none; position: fixed; top: 0; left: 0; right: 0; z-index: 200; height: 58px; background: var(--bg-2); border-bottom: 1px solid var(--border); padding: 0 16px; align-items: center; justify-content: space-between; }
        .hb { display: flex; flex-direction: column; gap: 5px; background: none; border: none; cursor: pointer; padding: 4px; }
        .hb span { display: block; width: 20px; height: 2px; background: var(--text-2); border-radius: 2px; transition: all 0.25s; }
        .hb.open span:nth-child(1) { transform: rotate(45deg) translate(5px, 5px); }
        .hb.open span:nth-child(2) { opacity: 0; }
        .hb.open span:nth-child(3) { transform: rotate(-45deg) translate(5px, -5px); }
        .sb-overlay { display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.6); z-index: 99; backdrop-filter: blur(4px); }

        @keyframes fadeUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
        .f1 { animation: fadeUp 0.5s ease both; }
        .f2 { animation: fadeUp 0.5s ease 0.07s both; }
        .f3 { animation: fadeUp 0.5s ease 0.14s both; }
        .f4 { animation: fadeUp 0.5s ease 0.21s both; }
        .f5 { animation: fadeUp 0.5s ease 0.28s both; }

        @media (max-width: 1024px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr); }
          .main-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 768px) {
          .sidebar { transform: translateX(-100%); }
          .sidebar.mob-open { transform: translateX(0); }
          .sb-overlay.mob-open { display: block; }
          .db-main { margin-left: 0; padding-top: 58px; }
          .mob-topbar { display: flex; }
          .db-topbar { display: none; }
          .db-content { padding: 20px 16px; }
          .stats-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; }
          .sc { padding: 18px; }
          .sc-val { font-size: 26px; }
          .qa-grid { grid-template-columns: repeat(2, 1fr); }
          .upgrade-banner { flex-direction: column; align-items: flex-start; }
          .upgrade-btn { width: 100%; text-align: center; }
        }
        @media (max-width: 480px) {
          .act-text { max-width: 120px; }
        }
      `}</style>

      {/* MOBILE TOPBAR */}
      <div className="mob-topbar">
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none" }}>
          <img src="/logo.png" style={{ height: "40px", borderRadius: "30px", background: "#ffffff", padding: "2px" }} />
          <span style={{ fontSize: "13px", fontWeight: "700", color: "var(--text)", letterSpacing: "1px", textTransform: "uppercase" }}>AEZIO</span>
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <img src={avatarUrl} style={{ height: "40px", borderRadius: "30px", objectFit: "cover", border: "1px solid var(--border)" }} />
          <button className={`hb ${mobOpen ? "open" : ""}`} onClick={() => setMobOpen(!mobOpen)}>
            <span /><span /><span />
          </button>
        </div>
      </div>

      {/* SIDEBAR OVERLAY */}
      <div className={`sb-overlay ${mobOpen ? "mob-open" : ""}`} onClick={() => setMobOpen(false)} />

      <div className="db-wrap">
        {/* SIDEBAR */}
        <aside className={`sidebar ${mobOpen ? "mob-open" : ""}`}>
          <Link href="/" className="sb-logo">
            <img src="/logo.png" style={{ height: "40px", borderRadius: "30px", background: "#ffffff", padding: "2px" }} />
            <span className="sb-logo-text">AEZIO AI AGENT</span>
          </Link>

          <div className="sb-divider" />
          <div className="sb-label">Overview</div>
          <Link href="/dashboard" className="sb-link active" onClick={() => setMobOpen(false)}>
            <span className="sb-link-icon">⊞</span> Dashboard
          </Link>

          <div style={{ marginTop: "14px" }} />
          <div className="sb-label">Agents</div>
          <Link href="/dashboard/whatsapp-setup" className="sb-link" onClick={() => setMobOpen(false)}>
            <span className="sb-link-icon"><img src="/whatsappsvg.png" style={{ height: "20px"}} /></span> WhatsApp Agent
          </Link>
          <Link href="/dashboard/email-setup" className="sb-link" onClick={() => setMobOpen(false)}>
            <span className="sb-link-icon">📧</span> Email Agent
          </Link>
          <Link href="/dashboard/voice-setup" className="sb-link" onClick={() => setMobOpen(false)}>
            <span className="sb-link-icon">📞</span> Voice Agent
          </Link>

          <div style={{ marginTop: "14px" }} />
<div className="sb-label">Data</div>
<Link href="/dashboard/appointments" className="sb-link" onClick={() => setMobOpen(false)}>
  <span className="sb-link-icon">📅</span> Appointments
</Link>
<Link href="/dashboard/call-logs" className="sb-link" onClick={() => setMobOpen(false)}>
  <span className="sb-link-icon">📋</span> Call Logs
</Link>

          <div style={{ marginTop: "14px" }} />
          <div className="sb-label">Account</div>
          <Link href="/dashboard/credits" className="sb-link" onClick={() => setMobOpen(false)}>
            <span className="sb-link-icon">💎</span> Credits
          </Link>
          <Link href="/pricing" className="sb-link" onClick={() => setMobOpen(false)}>
            <span className="sb-link-icon">⬆</span> Upgrade Plan
          </Link>
          <Link href="/" className="sb-link" onClick={() => setMobOpen(false)}>
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
              Logout
            </button>
          </div>
        </aside>

        {/* MAIN */}
        <main className="db-main">
          {/* TOPBAR */}
          <div className="db-topbar">
            <div>
              <div className="db-topbar-title">{getGreeting()}, {firstName}!</div>
              <div className="db-topbar-sub">Here's your AI agent overview</div>
            </div>
            <div className="db-topbar-right">
              <div className="topbar-badge">
                <div className="topbar-dot" />
                {stats.activeAgents > 0 ? `${stats.activeAgents} agent${stats.activeAgents > 1 ? "s" : ""} live` : "No agents active"}
              </div>
              <img src={avatarUrl} style={{ width: "36px", height: "36px", borderRadius: "10px", objectFit: "cover", border: "1px solid var(--border)" }} />
            </div>
          </div>

          {/* CONTENT */}
          <div className="db-content">

            {/* STATS */}
            <div className="stats-grid f1">
              {[
                { icon: <img src="/whatsappsvg.png" style={{ height: "40px", width: "40px"}} />, bg: "rgba(37,211,102,0.1)", val: stats.whatsappMessages, label: "WhatsApp Replies", sub: "AI replies sent" },
                { icon: "📧", bg: "rgba(74,158,255,0.1)", val: stats.emailMessages, label: "Email Replies", sub: "AI replies sent" },
                { icon: "⚡", bg: "rgba(124,58,237,0.1)", val: stats.activeAgents, label: "Active Agents", sub: "Running now" },
                { icon: "👥", bg: "rgba(245,158,11,0.1)", val: stats.totalCustomers, label: "Customers Served", sub: "Unique contacts" },
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
                  <span className="card-badge" style={{ background: stats.activeAgents > 0 ? "rgba(34,197,94,0.1)" : "var(--p-soft)", color: stats.activeAgents > 0 ? "#4ade80" : "var(--p3)", border: `1px solid ${stats.activeAgents > 0 ? "rgba(34,197,94,0.2)" : "var(--border)"}` }}>
                    {stats.activeAgents} active
                  </span>
                </div>
                {[
                  { icon: <img src="/whatsappsvg.png" style={{ height: "40px", width: "40px"}} />, bg: "rgba(37,211,102,0.1)", name: "WhatsApp Agent", sub: whatsappAgent?.business_name || "Not configured", agent: whatsappAgent, href: "/dashboard/whatsapp-setup" },
                  { icon: "📧", bg: "rgba(74,158,255,0.1)", name: "Email Agent", sub: emailAgent?.business_name || "Not configured", agent: emailAgent, href: "/dashboard/email-setup" },
                  { icon: "📞", bg: "rgba(124,58,237,0.1)", name: "Voice Agent", sub: "AI call answering", agent: null, href: "/dashboard/voice-setup" },
                ].map((a) => (
                  <Link key={a.name} href={a.href} className="ag-row">
                    <div className="ag-icon" style={{ background: a.bg }}>{a.icon}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="ag-name">{a.name}</div>
                      <div className="ag-sub">{a.sub}</div>
                    </div>
                    <span className="ag-status" style={{
                      background: a.agent?.is_active ? "rgba(34,197,94,0.1)" : a.agent ? "rgba(245,158,11,0.1)" : "var(--p-soft)",
                      color: a.agent?.is_active ? "#4ade80" : a.agent ? "#fbbf24" : "var(--p3)",
                      border: `1px solid ${a.agent?.is_active ? "rgba(34,197,94,0.2)" : a.agent ? "rgba(245,158,11,0.2)" : "var(--border)"}`
                    }}>
                      {a.agent ? (a.agent.is_active ? "● Active" : "● Pending") : "Setup →"}
                    </span>
                  </Link>
                ))}
                <div style={{ textAlign: "center", padding: "14px 0 0", fontSize: "11px", color: "var(--text-4)", fontWeight: "500", letterSpacing: "0.3px" }}>
                  More agents coming soon
                </div>
              </div>

              {/* Activity */}
              <div className="card">
                <div className="card-title">Recent Activity</div>
                {recentActivity.length > 0 ? (
                  recentActivity.map((item, i) => (
                    <div key={i} className="act-row">
                      <div className="act-icon" style={{ background: item.role === "user" ? "rgba(74,158,255,0.1)" : "var(--p-soft)" }}>
                        {item.role === "user" ? "👤" : "⚡"}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div className="act-msg">{item.role === "user" ? "Customer message" : "AI replied"}</div>
                        <div className="act-text">{item.message?.slice(0, 40)}{item.message?.length > 40 ? "..." : ""}</div>
                      </div>
                      <div className="act-time">{timeAgo(item.created_at)}</div>
                    </div>
                  ))
                ) : (
                  <div style={{ textAlign: "center", padding: "36px 0" }}>
                    <div style={{ fontSize: "32px", marginBottom: "12px", opacity: 0.4 }}>⚡</div>
                    <p style={{ color: "var(--text-4)", fontSize: "13px", lineHeight: 1.7, fontWeight: "500" }}>No activity yet.<br />Set up your first agent!</p>
                  </div>
                )}
              </div>
            </div>

            {/* QUICK ACTIONS */}
            <div className="card f3" style={{ marginBottom: "16px" }}>
              <div className="card-title">Quick Actions</div>
              <div className="qa-grid">
                {[
                  { icon: <img src="/whatsappsvg.png" style={{ height: "40px", width: "40px"}} />, label: "WhatsApp Setup", href: "/dashboard/whatsapp-setup", bg: "rgba(37,211,102,0.1)" },
                  { icon: "📧", label: "Email Setup", href: "/dashboard/email-setup", bg: "rgba(74,158,255,0.1)" },
                  { icon: "📞", label: "Voice Setup", href: "/dashboard/voice-setup", bg: "rgba(124,58,237,0.1)" },
                  { icon: "💎", label: "Upgrade Plan", href: "/pricing", bg: "rgba(245,158,11,0.1)" },
                ].map((a) => (
                  <Link key={a.label} href={a.href} className="qa-item">
                    <div className="qa-icon" style={{ background: a.bg }}>{a.icon}</div>
                    <span className="qa-label">{a.label}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* UPGRADE BANNER */}
            <div className="upgrade-banner f4">
              <div>
                <div className="upgrade-title">Upgrade your plan</div>
                <div className="upgrade-sub">Unlock unlimited agents, priority support & full analytics.</div>
              </div>
              <Link href="/pricing" className="upgrade-btn">View Plans →</Link>
            </div>

          </div>
        </main>
      </div>
    </>
  );
}