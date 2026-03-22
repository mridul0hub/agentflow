"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

const ADMIN_EMAILS = ["vasusoni1068@gmail.com"];
const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || "https://agentflow-backend-production-34e2.up.railway.app";

export default function AdminPanel() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({});
  const [selected, setSelected] = useState(null);
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [creditAmount, setCreditAmount] = useState("");
  const [creditNote, setCreditNote] = useState("");
  const [actionMsg, setActionMsg] = useState("");
  const [tab, setTab] = useState("users");
  const router = useRouter();

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push("/"); return; }
      if (!ADMIN_EMAILS.includes(session.user.email)) { router.push("/dashboard"); return; }
      setUser(session.user);
      await Promise.all([loadUsers(session.user.email), loadStats(session.user.email)]);
      setLoading(false);
    };
    init();
  }, [router]);

  const loadUsers = async (adminEmail) => {
    try {
      const res = await fetch(`${BACKEND}/admin/users?admin_email=${adminEmail}`);
      const data = await res.json();
      setUsers(data.users || []);
    } catch (e) { console.error(e); }
  };

  const loadStats = async (adminEmail) => {
    try {
      const res = await fetch(`${BACKEND}/admin/stats?admin_email=${adminEmail}`);
      const data = await res.json();
      setStats(data);
    } catch (e) { console.error(e); }
  };

  const loadUserDetail = async (userId) => {
    setDetailLoading(true);
    try {
      const res = await fetch(`${BACKEND}/admin/user/${userId}?admin_email=${user.email}`);
      const data = await res.json();
      setSelectedDetail(data);
    } catch (e) { console.error(e); }
    setDetailLoading(false);
  };

  const selectUser = (u) => {
    setSelected(u);
    setSelectedDetail(null);
    setCreditAmount("");
    setCreditNote("");
    setActionMsg("");
    loadUserDetail(u.id);
  };

  const toggleAgent = async (userId, agentType, currentState) => {
    try {
      const res = await fetch(`${BACKEND}/admin/toggle-agent`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ admin_email: user.email, user_id: userId, agent_type: agentType, is_active: !currentState })
      });
      const data = await res.json();
      if (data.status === "ok") {
        setActionMsg(`✅ ${agentType} agent ${!currentState ? "activated" : "deactivated"}`);
        await loadUserDetail(userId);
        await loadUsers(user.email);
        setTimeout(() => setActionMsg(""), 3000);
      }
    } catch (e) { setActionMsg("❌ Error"); }
  };

  const adjustCredits = async () => {
    const amount = parseInt(creditAmount);
    if (!amount || isNaN(amount)) { setActionMsg("❌ Enter valid amount"); return; }
    try {
      const res = await fetch(`${BACKEND}/admin/credits`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ admin_email: user.email, user_id: selected.id, amount, note: creditNote || "Admin adjustment" })
      });
      const data = await res.json();
      if (data.status === "ok") {
        setActionMsg(`✅ ${amount > 0 ? "Added" : "Removed"} ${Math.abs(amount)} credits`);
        setCreditAmount("");
        setCreditNote("");
        await loadUserDetail(selected.id);
        await loadUsers(user.email);
        setTimeout(() => setActionMsg(""), 3000);
      }
    } catch (e) { setActionMsg("❌ Error adjusting credits"); }
  };

  const formatDate = (d) => d ? new Date(d).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" }) : "—";

  const filtered = users.filter(u =>
    !search || u.email?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#0d0d14", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Montserrat, sans-serif" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ width: "40px", height: "40px", border: "3px solid rgba(124,58,237,0.2)", borderTop: "3px solid #7c3aed", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 16px" }} />
        <p style={{ color: "#9898c0", fontSize: "14px", fontWeight: "500" }}>Loading admin panel...</p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

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

        .wrap { display: flex; min-height: 100vh; }

        /* SIDEBAR */
        .sidebar { width: 240px; flex-shrink: 0; background: var(--bg-2); border-right: 1px solid var(--border); display: flex; flex-direction: column; position: fixed; top: 0; left: 0; bottom: 0; z-index: 100; }
        .sb-logo { display: flex; align-items: center; gap: 10px; padding: 22px 20px 0; text-decoration: none; }
        .sb-logo-text { font-size: 12px; font-weight: 700; color: var(--text); letter-spacing: 1.5px; text-transform: uppercase; }
        .sb-admin-badge { display: inline-block; padding: 2px 8px; border-radius: 50px; background: rgba(248,113,113,0.15); color: #f87171; font-size: 10px; font-weight: 700; border: 1px solid rgba(248,113,113,0.2); margin: 12px 20px 0; letter-spacing: 0.5px; }
        .sb-divider { height: 1px; background: var(--border); margin: 14px 20px; }
        .sb-label { font-size: 10px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: var(--text-4); padding: 0 20px 8px; }
        .sb-link { display: flex; align-items: center; gap: 10px; padding: 10px 14px; font-size: 13px; font-weight: 500; color: var(--text-3); text-decoration: none; transition: all 0.15s; margin: 1px 8px; border-radius: 10px; cursor: pointer; background: none; border: none; width: calc(100% - 16px); font-family: 'Montserrat', sans-serif; }
        .sb-link:hover { background: var(--p-soft); color: var(--text-2); }
        .sb-link.active { background: var(--p-mid); color: var(--p3); border: 1px solid var(--border); }
        .sb-link-icon { width: 18px; text-align: center; font-size: 15px; flex-shrink: 0; }
        .sb-bottom { margin-top: auto; padding: 14px 8px; border-top: 1px solid var(--border); }
        .sb-logout { display: flex; align-items: center; gap: 8px; padding: 9px 12px; border-radius: 10px; font-size: 13px; color: rgba(248,113,113,0.6); background: none; border: none; cursor: pointer; font-family: 'Montserrat', sans-serif; width: 100%; transition: all 0.15s; font-weight: 500; }
        .sb-logout:hover { background: rgba(248,113,113,0.08); color: #f87171; }

        /* MAIN */
        .main { flex: 1; margin-left: 240px; background: var(--bg); min-height: 100vh; }
        .topbar { background: var(--bg-2); border-bottom: 1px solid var(--border); padding: 0 28px; height: 64px; display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; z-index: 50; }
        .topbar-title { font-size: 15px; font-weight: 700; color: var(--text); }
        .admin-pill { padding: 5px 14px; border-radius: 50px; background: rgba(248,113,113,0.1); color: #f87171; font-size: 11px; font-weight: 700; border: 1px solid rgba(248,113,113,0.2); }

        /* CONTENT */
        .content { padding: 28px; }

        /* STATS */
        .stats-row { display: grid; grid-template-columns: repeat(5, 1fr); gap: 12px; margin-bottom: 24px; }
        .stat-card { background: var(--bg-2); border: 1px solid var(--border); border-radius: 16px; padding: 18px; box-shadow: var(--sh-card); }
        .stat-val { font-size: 26px; font-weight: 800; color: var(--text); letter-spacing: -1px; margin-bottom: 4px; }
        .stat-label { font-size: 11px; font-weight: 600; color: var(--text-4); text-transform: uppercase; letter-spacing: 0.5px; }

        /* LAYOUT */
        .panel-grid { display: grid; grid-template-columns: 1fr 400px; gap: 16px; }

        /* USER LIST */
        .user-list { background: var(--bg-2); border: 1px solid var(--border); border-radius: 20px; overflow: hidden; box-shadow: var(--sh-card); }
        .list-header { padding: 16px 20px; border-bottom: 1px solid var(--border); display: flex; align-items: center; gap: 12px; }
        .search-input { flex: 1; padding: 9px 14px; border-radius: 9px; border: 1px solid var(--border); background: var(--bg-3); color: var(--text); font-size: 13px; font-family: 'Montserrat', sans-serif; outline: none; }
        .search-input:focus { border-color: var(--border-2); }
        .search-input::placeholder { color: var(--text-4); }
        .refresh-btn { padding: 9px 14px; border-radius: 9px; border: 1px solid var(--border); background: var(--p-soft); color: var(--p3); font-size: 13px; font-weight: 600; cursor: pointer; font-family: 'Montserrat', sans-serif; white-space: nowrap; }

        .user-row { display: flex; align-items: center; gap: 12px; padding: 14px 20px; border-bottom: 1px solid var(--border); cursor: pointer; transition: all 0.15s; }
        .user-row:last-child { border-bottom: none; }
        .user-row:hover { background: var(--bg-3); }
        .user-row.selected { background: var(--p-soft); border-left: 3px solid var(--p3); }
        .user-av { width: 36px; height: 36px; border-radius: 10px; background: linear-gradient(135deg, var(--p), #1e1b4b); display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 700; color: white; flex-shrink: 0; }
        .user-email { font-size: 13px; font-weight: 600; color: var(--text); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .user-meta { font-size: 11px; color: var(--text-4); margin-top: 2px; font-weight: 400; }
        .credit-pill { padding: 3px 10px; border-radius: 50px; font-size: 11px; font-weight: 700; margin-left: auto; flex-shrink: 0; }

        /* USER DETAIL */
        .detail-panel { background: var(--bg-2); border: 1px solid var(--border); border-radius: 20px; box-shadow: var(--sh-card); height: fit-content; position: sticky; top: 80px; overflow: hidden; }
        .detail-header { padding: 20px; border-bottom: 1px solid var(--border); background: var(--bg-3); }
        .detail-email { font-size: 14px; font-weight: 700; color: var(--text); margin-bottom: 4px; word-break: break-all; }
        .detail-joined { font-size: 11px; color: var(--text-4); font-weight: 400; }
        .detail-body { padding: 20px; }
        .section-title { font-size: 11px; font-weight: 700; color: var(--text-4); text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 12px; }

        /* AGENT TOGGLES */
        .agent-toggle-row { display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; background: var(--bg-3); border: 1px solid var(--border); border-radius: 10px; margin-bottom: 8px; }
        .agent-toggle-name { font-size: 13px; font-weight: 600; color: var(--text-2); }
        .toggle-btn { padding: 5px 14px; border-radius: 7px; font-size: 11px; font-weight: 700; border: none; cursor: pointer; font-family: 'Montserrat', sans-serif; transition: all 0.15s; }
        .toggle-btn.activate { background: rgba(34,197,94,0.1); color: #4ade80; border: 1px solid rgba(34,197,94,0.2); }
        .toggle-btn.activate:hover { background: rgba(34,197,94,0.2); }
        .toggle-btn.deactivate { background: rgba(248,113,113,0.1); color: #f87171; border: 1px solid rgba(248,113,113,0.2); }
        .toggle-btn.deactivate:hover { background: rgba(248,113,113,0.2); }
        .toggle-btn.setup { background: var(--p-soft); color: var(--p3); border: 1px solid var(--border); }
        .status-dot { width: 6px; height: 6px; border-radius: 50%; display: inline-block; margin-right: 6px; }

        /* CREDITS ADJUST */
        .credits-section { margin-top: 16px; padding-top: 16px; border-top: 1px solid var(--border); }
        .credit-balance-display { font-size: 36px; font-weight: 800; color: var(--p3); letter-spacing: -1.5px; margin-bottom: 4px; }
        .credit-used { font-size: 12px; color: var(--text-4); font-weight: 500; margin-bottom: 14px; }
        .credit-input { width: 100%; padding: 10px 14px; border-radius: 9px; border: 1px solid var(--border); background: var(--bg-3); color: var(--text); font-size: 14px; font-family: 'Montserrat', sans-serif; outline: none; margin-bottom: 8px; font-weight: 600; }
        .credit-input:focus { border-color: var(--border-2); }
        .credit-input::placeholder { color: var(--text-4); font-weight: 400; }
        .credit-btns { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 8px; }
        .quick-btn { padding: 8px; border-radius: 8px; border: 1px solid var(--border); background: var(--p-soft); color: var(--p3); font-size: 12px; font-weight: 700; cursor: pointer; font-family: 'Montserrat', sans-serif; transition: all 0.15s; }
        .quick-btn:hover { background: var(--p-mid); }
        .apply-btn { width: 100%; padding: 11px; border-radius: 9px; background: var(--p); color: white; font-size: 13px; font-weight: 700; border: none; cursor: pointer; font-family: 'Montserrat', sans-serif; transition: all 0.2s; margin-top: 4px; box-shadow: var(--sh-p); }
        .apply-btn:hover { background: var(--p2); transform: translateY(-1px); }

        /* ACTION MSG */
        .action-msg { padding: 10px 14px; border-radius: 9px; font-size: 13px; font-weight: 600; margin-bottom: 12px; background: rgba(34,197,94,0.1); color: #4ade80; border: 1px solid rgba(34,197,94,0.2); }

        /* EMPTY */
        .empty-detail { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 48px 24px; text-align: center; }

        .mob-topbar { display: none; }

        @keyframes fadeUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
        .f1 { animation: fadeUp 0.5s ease both; }
        .f2 { animation: fadeUp 0.5s ease 0.07s both; }
        .f3 { animation: fadeUp 0.5s ease 0.14s both; }

        @media (max-width: 1100px) { .panel-grid { grid-template-columns: 1fr; } .detail-panel { position: static; } }
        @media (max-width: 900px) { .stats-row { grid-template-columns: repeat(3, 1fr); } }
        @media (max-width: 768px) {
          .sidebar { display: none; }
          .main { margin-left: 0; }
          .content { padding: 16px; }
          .stats-row { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>

      <div className="wrap">
        {/* SIDEBAR */}
        <aside className="sidebar">
          <Link href="/" className="sb-logo">
            <img src="/logo.png" style={{ height: "40px", borderRadius: "30px", background: "#ffffff", padding: "2px" }} />
            <span className="sb-logo-text">AEZIO AI</span>
          </Link>
          <div className="sb-admin-badge">ADMIN PANEL</div>
          <div className="sb-divider" />
          <div className="sb-label">Admin</div>
          <button className={`sb-link ${tab === "users" ? "active" : ""}`} onClick={() => setTab("users")}>
            <span className="sb-link-icon"><img src="/customer.png" style={{height: "40px"}}/></span> All Users
          </button>
          <button className={`sb-link ${tab === "stats" ? "active" : ""}`} onClick={() => setTab("stats")}>
            <span className="sb-link-icon"><img src="/growth.png" style={{height: "40px"}}/></span> Overview Stats
          </button>
          <div style={{ marginTop: "12px" }} />
          <div className="sb-label">Navigation</div>
          <Link href="/dashboard" className="sb-link">
            <span className="sb-link-icon"></span> Dashboard
          </Link>
          <Link href="/" className="sb-link">
            <span className="sb-link-icon"></span> Back to Website
          </Link>
          <div className="sb-bottom">
            <div style={{ padding: "8px 12px 12px", fontSize: "11px", color: "var(--text-4)" }}>{user?.email}</div>
            <button className="sb-logout" onClick={async () => { await supabase.auth.signOut(); router.push("/"); }}>
              <span></span> Logout
            </button>
          </div>
        </aside>

        {/* MAIN */}
        <main className="main">
          <div className="topbar">
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span className="topbar-title">Admin Panel</span>
              <span className="admin-pill">Admin Access</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontSize: "12px", color: "var(--text-4)" }}>{user?.email}</span>
              <img src={user?.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=Admin&background=7c3aed&color=fff`} style={{ width: "34px", height: "34px", borderRadius: "9px", objectFit: "cover", border: "1px solid var(--border)" }} />
            </div>
          </div>

          <div className="content">
            {/* STATS ROW */}
            <div className="stats-row f1">
              {[
                { label: "Total Users", val: stats.total_users || 0 },
                { label: "Total Replies", val: stats.total_replies || 0 },
                { label: "WhatsApp Active", val: stats.whatsapp_agents_active || 0 },
                { label: "Email Active", val: stats.email_agents_active || 0 },
                { label: "Voice Active", val: stats.voice_agents_active || 0 },
              ].map(s => (
                <div key={s.label} className="stat-card">
                  <div className="stat-val">{s.val}</div>
                  <div className="stat-label">{s.label}</div>
                </div>
              ))}
            </div>

            {/* MAIN PANEL */}
            <div className="panel-grid f2">
              {/* USER LIST */}
              <div className="user-list">
                <div className="list-header">
                  <input className="search-input" placeholder="Search by email..." value={search} onChange={e => setSearch(e.target.value)} />
                  <button className="refresh-btn" onClick={() => loadUsers(user.email)}>↻ Refresh</button>
                </div>
                {filtered.length > 0 ? filtered.map(u => {
                  const balance = u.credits_balance ?? 0;
                  const balColor = balance > 20 ? "#4ade80" : balance > 5 ? "#fbbf24" : "#f87171";
                  return (
                    <div key={u.id} className={`user-row ${selected?.id === u.id ? "selected" : ""}`} onClick={() => selectUser(u)}>
                      <div className="user-av">{u.email?.[0]?.toUpperCase()}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div className="user-email">{u.email}</div>
                        <div className="user-meta">
                          Joined {formatDate(u.created_at)} ·{" "}
                          {u.whatsapp_active ? "✓WA " : ""}{u.email_active ? "✓EM " : ""}{u.voice_active ? "✓VO" : ""}
                        </div>
                      </div>
                      <span className="credit-pill" style={{ background: `${balColor}15`, color: balColor, border: `1px solid ${balColor}30` }}>
                        {balance} cr
                      </span>
                    </div>
                  );
                }) : (
                  <div style={{ textAlign: "center", padding: "40px", color: "var(--text-4)", fontSize: "14px" }}>No users found</div>
                )}
              </div>

              {/* DETAIL PANEL */}
              <div className="detail-panel">
                {selected ? (
                  <>
                    <div className="detail-header">
                      <div className="detail-email">{selected.email}</div>
                      <div className="detail-joined">Joined {formatDate(selected.created_at)}</div>
                    </div>
                    <div className="detail-body">
                      {actionMsg && <div className="action-msg">{actionMsg}</div>}

                      {detailLoading ? (
                        <div style={{ textAlign: "center", padding: "24px" }}>
                          <div style={{ width: "28px", height: "28px", border: "3px solid rgba(124,58,237,0.2)", borderTop: "3px solid #7c3aed", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto" }} />
                        </div>
                      ) : selectedDetail ? (
                        <>
                          {/* AGENTS */}
                          <div className="section-title">Agents</div>
                          {[
                            { key: "whatsapp_agent", label: "WhatsApp Agent", type: "whatsapp" },
                            { key: "email_agent", label: "Email Agent", type: "email" },
                            { key: "voice_agent", label: "Voice Agent", type: "voice" },
                          ].map(a => {
                            const agent = selectedDetail[a.key];
                            return (
                              <div key={a.type} className="agent-toggle-row">
                                <div>
                                  <div className="agent-toggle-name">
                                    <span className="status-dot" style={{ background: agent?.is_active ? "#4ade80" : agent ? "#fbbf24" : "var(--text-4)" }} />
                                    {a.label}
                                  </div>
                                  {agent && <div style={{ fontSize: "11px", color: "var(--text-4)", marginTop: "2px" }}>{agent.business_name || "—"}</div>}
                                </div>
                                {agent ? (
                                  <button
                                    className={`toggle-btn ${agent.is_active ? "deactivate" : "activate"}`}
                                    onClick={() => toggleAgent(selected.id, a.type, agent.is_active)}
                                  >
                                    {agent.is_active ? "Deactivate" : "Activate"}
                                  </button>
                                ) : (
                                  <span className="toggle-btn setup">Not Setup</span>
                                )}
                              </div>
                            );
                          })}

                          {/* CREDITS */}
                          <div className="credits-section">
                            <div className="section-title">Credits</div>
                            <div className="credit-balance-display">{selectedDetail.credits?.balance ?? 0}</div>
                            <div className="credit-used">Total used: {selectedDetail.credits?.total_used ?? 0} credits</div>

                            <div style={{ fontSize: "11px", color: "var(--text-4)", marginBottom: "8px", fontWeight: "600" }}>Quick Add</div>
                            <div className="credit-btns">
                              {[20, 50, 100, 500].map(n => (
                                <button key={n} className="quick-btn" onClick={() => setCreditAmount(String(n))}>+{n}</button>
                              ))}
                            </div>

                            <input
                              className="credit-input"
                              placeholder="Amount (+ to add, - to remove)"
                              value={creditAmount}
                              onChange={e => setCreditAmount(e.target.value)}
                              type="number"
                            />
                            <input
                              className="credit-input"
                              placeholder="Note (optional)"
                              value={creditNote}
                              onChange={e => setCreditNote(e.target.value)}
                            />
                            <button className="apply-btn" onClick={adjustCredits}>
                              Apply Credit Adjustment 
                            </button>
                          </div>
                        </>
                      ) : null}
                    </div>
                  </>
                ) : (
                  <div className="empty-detail">
                    <div style={{ fontSize: "40px", marginBottom: "12px", opacity: 0.3 }}>⬆</div>
                    <div style={{ fontSize: "14px", fontWeight: "600", color: "var(--text-3)" }}>Select a user</div>
                    <div style={{ fontSize: "12px", color: "var(--text-4)", marginTop: "4px" }}>Click any user to manage</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}