"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AppointmentsPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push("/"); return; }
      setUser(session.user);
      await loadAppointments(session.user.id);
      setLoading(false);
    };
    init();
  }, [router]);

  const loadAppointments = async (userId) => {
    try {
      const { data } = await supabase
        .from("appointments")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });
      setAppointments(data || []);
    } catch (err) { console.error(err); }
  };

  const updateStatus = async (id, status) => {
    await supabase.from("appointments").update({ status }).eq("id", id);
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a));
    if (selected?.id === id) setSelected(prev => ({ ...prev, status }));
  };

  const formatDate = (d) => {
    if (!d) return "—";
    return new Date(d).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
  };

  const statusColor = (s) => {
    if (s === "confirmed") return { bg: "rgba(34,197,94,0.1)", color: "#4ade80", border: "rgba(34,197,94,0.2)" };
    if (s === "cancelled") return { bg: "rgba(248,113,113,0.1)", color: "#f87171", border: "rgba(248,113,113,0.2)" };
    return { bg: "rgba(245,158,11,0.1)", color: "#fbbf24", border: "rgba(245,158,11,0.2)" };
  };

  const filtered = appointments.filter(a => {
    const matchFilter = filter === "all" || a.status === filter;
    const matchSearch = !search || [a.customer_name, a.customer_number, a.purpose, a.customer_email, a.notes].some(v => v?.toLowerCase().includes(search.toLowerCase()));
    return matchFilter && matchSearch;
  });

  const counts = {
    all: appointments.length,
    pending: appointments.filter(a => a.status === "pending").length,
    confirmed: appointments.filter(a => a.status === "confirmed").length,
    cancelled: appointments.filter(a => a.status === "cancelled").length
  };

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#0d0d14", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Montserrat, sans-serif" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ width: "40px", height: "40px", border: "3px solid rgba(124,58,237,0.2)", borderTop: "3px solid #7c3aed", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 16px" }} />
        <p style={{ color: "#9898c0", fontSize: "14px", fontWeight: "500" }}>Loading appointments...</p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

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

        .wrap { display: flex; min-height: 100vh; }

        /* SIDEBAR */
        .sidebar { width: 248px; flex-shrink: 0; background: var(--bg-2); border-right: 1px solid var(--border); display: flex; flex-direction: column; position: fixed; top: 0; left: 0; bottom: 0; z-index: 100; }
        .sb-logo { display: flex; align-items: center; gap: 10px; padding: 22px 20px 0; text-decoration: none; }
        .sb-logo-text { font-size: 13px; font-weight: 700; color: var(--text); letter-spacing: 1.5px; text-transform: uppercase; }
        .sb-divider { height: 1px; background: var(--border); margin: 18px 20px; }
        .sb-label { font-size: 10px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: var(--text-4); padding: 0 20px 8px; }
        .sb-link { display: flex; align-items: center; gap: 10px; padding: 10px 14px; font-size: 13px; font-weight: 500; color: var(--text-3); text-decoration: none; transition: all 0.15s; margin: 1px 8px; border-radius: 10px; }
        .sb-link:hover { background: var(--p-soft); color: var(--text-2); }
        .sb-link.active { background: var(--p-mid); color: var(--p3); border: 1px solid var(--border); }
        .sb-link-icon { width: 18px; text-align: center; font-size: 15px; flex-shrink: 0; }
        .sb-bottom { margin-top: auto; padding: 14px 8px; border-top: 1px solid var(--border); }
        .sb-logout { display: flex; align-items: center; gap: 8px; padding: 9px 12px; border-radius: 10px; font-size: 13px; color: rgba(248,113,113,0.6); background: none; border: none; cursor: pointer; font-family: 'Montserrat', sans-serif; width: 100%; transition: all 0.15s; font-weight: 500; }
        .sb-logout:hover { background: rgba(248,113,113,0.08); color: #f87171; }

        /* MAIN */
        .main { flex: 1; margin-left: 248px; background: var(--bg); min-height: 100vh; }
        .topbar { background: var(--bg-2); border-bottom: 1px solid var(--border); padding: 0 32px; height: 64px; display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; z-index: 50; }
        .topbar-left { display: flex; align-items: center; gap: 10px; }
        .back-btn { display: flex; align-items: center; gap: 6px; padding: 8px 16px; border-radius: 9px; border: 1px solid var(--border); background: var(--p-soft); font-size: 13px; font-weight: 600; color: var(--p3); text-decoration: none; transition: all 0.15s; }
        .back-btn:hover { background: var(--p-mid); border-color: var(--border-2); }
        .topbar-title { font-size: 15px; font-weight: 700; color: var(--text); }

        /* CONTENT */
        .content { padding: 32px; max-width: 1100px; }

        /* STATS */
        .stats-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 24px; }
        .stat-card { background: var(--bg-2); border: 1px solid var(--border); border-radius: 16px; padding: 20px; box-shadow: var(--sh-card); cursor: pointer; transition: all 0.2s; }
        .stat-card:hover, .stat-card.active { border-color: var(--border-2); background: var(--bg-3); box-shadow: var(--sh-card-hover); }
        .stat-card.active { border-color: var(--p3); }
        .stat-val { font-size: 28px; font-weight: 800; color: var(--text); letter-spacing: -1px; margin-bottom: 4px; }
        .stat-label { font-size: 12px; font-weight: 600; color: var(--text-4); text-transform: uppercase; letter-spacing: 0.5px; }

        /* TOOLBAR */
        .toolbar { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; flex-wrap: wrap; }
        .search-input { flex: 1; min-width: 200px; padding: 10px 16px; border-radius: 10px; border: 1px solid var(--border); background: var(--bg-2); color: var(--text); font-size: 14px; font-family: 'Montserrat', sans-serif; outline: none; transition: all 0.15s; font-weight: 400; }
        .search-input:focus { border-color: var(--border-2); box-shadow: 0 0 0 3px rgba(124,58,237,0.1); }
        .search-input::placeholder { color: var(--text-4); }

        /* PAGE GRID */
        .page-grid { display: grid; grid-template-columns: 1fr 340px; gap: 16px; }

        /* TABLE */
        .table-card { background: var(--bg-2); border: 1px solid var(--border); border-radius: 20px; overflow: hidden; box-shadow: var(--sh-card); }
        .table-header { display: grid; grid-template-columns: 2fr 1.5fr 1fr 1fr 1fr; gap: 12px; padding: 14px 20px; border-bottom: 1px solid var(--border); font-size: 11px; font-weight: 700; color: var(--text-4); text-transform: uppercase; letter-spacing: 1px; }
        .table-row { display: grid; grid-template-columns: 2fr 1.5fr 1fr 1fr 1fr; gap: 12px; padding: 16px 20px; border-bottom: 1px solid var(--border); align-items: center; transition: background 0.15s; cursor: pointer; }
        .table-row:last-child { border-bottom: none; }
        .table-row:hover { background: var(--bg-3); }
        .table-row.selected { background: var(--p-soft); border-left: 3px solid var(--p3); }
        .customer-name { font-size: 13px; font-weight: 600; color: var(--text); }
        .customer-number { font-size: 11px; color: var(--text-4); margin-top: 2px; font-weight: 400; }
        .td { font-size: 13px; color: var(--text-3); font-weight: 400; }
        .status-badge { display: inline-flex; align-items: center; gap: 5px; padding: 4px 10px; border-radius: 50px; font-size: 11px; font-weight: 600; border: 1px solid; }
        .status-dot { width: 5px; height: 5px; border-radius: 50%; background: currentColor; }
        .action-btn { padding: 5px 12px; border-radius: 7px; font-size: 11px; font-weight: 600; border: 1px solid var(--border); background: var(--p-soft); color: var(--p3); cursor: pointer; font-family: 'Montserrat', sans-serif; transition: all 0.15s; }
        .action-btn:hover { background: var(--p-mid); border-color: var(--border-2); }
        .action-btn.confirm { background: rgba(34,197,94,0.1); color: #4ade80; border-color: rgba(34,197,94,0.2); }
        .action-btn.confirm:hover { background: rgba(34,197,94,0.2); }
        .action-btn.cancel { background: rgba(248,113,113,0.1); color: #f87171; border-color: rgba(248,113,113,0.2); }
        .action-btn.cancel:hover { background: rgba(248,113,113,0.2); }

        /* DETAIL PANEL */
        .detail-panel { background: var(--bg-2); border: 1px solid var(--border); border-radius: 20px; box-shadow: var(--sh-card); height: fit-content; position: sticky; top: 80px; overflow: hidden; }
        .detail-header { padding: 18px 20px; border-bottom: 1px solid var(--border); background: var(--bg-3); }
        .detail-name { font-size: 15px; font-weight: 700; color: var(--text); margin-bottom: 6px; }
        .detail-body { padding: 16px 20px; }
        .detail-row { display: flex; justify-content: space-between; align-items: flex-start; padding: 9px 0; border-bottom: 1px solid var(--border); gap: 12px; }
        .detail-row:last-of-type { border-bottom: none; }
        .detail-key { font-size: 11px; font-weight: 700; color: var(--text-4); text-transform: uppercase; letter-spacing: 0.5px; flex-shrink: 0; }
        .detail-val { font-size: 12px; color: var(--text-2); font-weight: 500; text-align: right; word-break: break-word; max-width: 180px; }
        .extra-box { background: var(--bg-3); border: 1px solid var(--border); border-radius: 10px; padding: 12px; margin-top: 10px; }
        .extra-item { display: flex; justify-content: space-between; gap: 8px; margin-bottom: 7px; font-size: 11px; }
        .extra-item:last-child { margin-bottom: 0; }
        .extra-key { color: var(--text-4); font-weight: 600; text-transform: capitalize; }
        .extra-val { color: var(--text-2); font-weight: 500; text-align: right; }
        .detail-action-btns { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 14px; }
        .detail-action-btn { padding: 9px; border-radius: 9px; font-size: 12px; font-weight: 700; border: none; cursor: pointer; font-family: 'Montserrat', sans-serif; transition: all 0.15s; }

        /* EMPTY */
        .empty { text-align: center; padding: 64px 24px; }
        .empty-icon { font-size: 48px; margin-bottom: 16px; opacity: 0.3; }
        .empty-title { font-size: 16px; font-weight: 700; color: var(--text-2); margin-bottom: 8px; }
        .empty-sub { font-size: 14px; color: var(--text-4); font-weight: 400; }

        /* MOBILE */
        .mob-topbar { display: none; position: fixed; top: 0; left: 0; right: 0; z-index: 200; height: 58px; background: var(--bg-2); border-bottom: 1px solid var(--border); padding: 0 16px; align-items: center; justify-content: space-between; }

        @keyframes fadeUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
        .f1 { animation: fadeUp 0.5s ease both; }
        .f2 { animation: fadeUp 0.5s ease 0.07s both; }
        .f3 { animation: fadeUp 0.5s ease 0.14s both; }

        @media (max-width: 1100px) { .page-grid { grid-template-columns: 1fr; } .detail-panel { position: static; } }
        @media (max-width: 900px) {
          .stats-row { grid-template-columns: repeat(2, 1fr); }
          .table-header { display: none; }
          .table-row { grid-template-columns: 1fr 1fr; gap: 8px; }
        }
        @media (max-width: 768px) {
          .sidebar { display: none; }
          .main { margin-left: 0; padding-top: 58px; }
          .mob-topbar { display: flex; }
          .topbar { display: none; }
          .content { padding: 20px 16px; }
        }
      `}</style>

      {/* MOBILE TOPBAR */}
      <div className="mob-topbar">
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none" }}>
          <img src="/logo.png" style={{ height: "50px", borderRadius: "30px", background: "#ffffff", padding: "2px" }} />
          <span style={{ fontSize: "13px", fontWeight: "700", color: "var(--text)", letterSpacing: "1px", textTransform: "uppercase" }}>AEZIO AI</span>
        </Link>
        <Link href="/dashboard" className="back-btn">Back</Link>
      </div>

      <div className="wrap">
        {/* SIDEBAR */}
        <aside className="sidebar">
          <Link href="/" className="sb-logo">
            <img src="/logo.png" style={{ height: "50px", borderRadius: "30px", background: "#ffffff", padding: "2px" }} />
            <span className="sb-logo-text">AEZIO AI AGENTS</span>
          </Link>
          <div className="sb-divider" />
          <div className="sb-label">Overview</div>
          <Link href="/dashboard" className="sb-link">Dashboard</Link>
          <div style={{ marginTop: "12px" }} />
          <div className="sb-label">Agents</div>
          <Link href="/dashboard/whatsapp-setup" className="sb-link">
            <span className="sb-link-icon"><img src="/whatsappsvg.png" style={{ height: "20px"}} /></span> WhatsApp Agent
          </Link>
          <Link href="/dashboard/email-setup" className="sb-link"><span className="sb-link-icon"><img src="/mail.png" style={{height: "20px"}}/></span> Email Agent</Link>
          <Link href="/dashboard/voice-setup" className="sb-link"><span className="sb-link-icon"><img src="/voice.png" style={{height: "20px"}}/></span> Voice Agent</Link>
          <div style={{ marginTop: "12px" }} />
          <div className="sb-label">Data</div>
          <Link href="/dashboard/appointments" className="sb-link active"><span className="sb-link-icon">📅</span> Appointments</Link>
          <Link href="/dashboard/call-logs" className="sb-link"><span className="sb-link-icon">📋</span> Call Logs</Link>
          <div style={{ marginTop: "12px" }} />
          <div className="sb-label">Account</div>
          <Link href="/pricing" className="sb-link"><img src="/upgrade.png" style={{height: "20px"}}/>Upgrade Plan</Link>
          <Link href="/" className="sb-link">Back to Website</Link>
          <div className="sb-bottom">
            <button className="sb-logout" onClick={async () => { await supabase.auth.signOut(); router.push("/"); }}>
               Logout
            </button>
          </div>
        </aside>

        {/* MAIN */}
        <main className="main">
          <div className="topbar">
            <div className="topbar-left">
              <Link href="/dashboard" className="back-btn">Dashboard</Link>
              <span style={{ color: "var(--text-4)", fontSize: "14px" }}>/</span>
              <span className="topbar-title">Appointments</span>
            </div>
            <img src={avatarUrl} style={{ width: "36px", height: "36px", borderRadius: "10px", objectFit: "cover", border: "1px solid var(--border)" }} />
          </div>

          <div className="content">
            {/* HEADER */}
            <div style={{ marginBottom: "24px" }} className="f1">
              <h1 style={{ fontSize: "28px", fontWeight: "800", color: "var(--text)", letterSpacing: "-0.5px", marginBottom: "6px" }}>Appointments</h1>
              <p style={{ fontSize: "14px", color: "var(--text-4)", fontWeight: "400" }}>All appointments booked by your AI agents across WhatsApp, Email and Voice.</p>
            </div>

            {/* STATS */}
            <div className="stats-row f1">
              {[
                { label: "Total", val: counts.all, filter: "all" },
                { label: "Pending", val: counts.pending, filter: "pending" },
                { label: "Confirmed", val: counts.confirmed, filter: "confirmed" },
                { label: "Cancelled", val: counts.cancelled, filter: "cancelled" },
              ].map(s => (
                <div key={s.filter} className={`stat-card ${filter === s.filter ? "active" : ""}`} onClick={() => setFilter(s.filter)}>
                  <div className="stat-val">{s.val}</div>
                  <div className="stat-label">{s.label}</div>
                </div>
              ))}
            </div>

            {/* TOOLBAR */}
            <div className="toolbar f2">
              <input className="search-input" placeholder="Search by name, number, purpose..." value={search} onChange={e => setSearch(e.target.value)} />
              <button onClick={() => loadAppointments(user.id)} style={{ padding: "10px 18px", borderRadius: "10px", border: "1px solid var(--border)", background: "var(--p-soft)", color: "var(--p3)", font: "600 13px Montserrat", cursor: "pointer", transition: "all 0.15s", whiteSpace: "nowrap" }}>
                ↻ Refresh
              </button>
            </div>

            {/* PAGE GRID — Table + Detail Panel */}
            <div className="page-grid f3">

              {/* TABLE */}
              <div className="table-card">
                {filtered.length > 0 ? (
                  <>
                    <div className="table-header">
                      <span>Customer</span>
                      <span>Appointment</span>
                      <span>Purpose</span>
                      <span>Status</span>
                      <span>Actions</span>
                    </div>
                    {filtered.map(a => {
                      const sc = statusColor(a.status);
                      return (
                        <div key={a.id} className={`table-row ${selected?.id === a.id ? "selected" : ""}`} onClick={() => setSelected(a)}>
                          <div>
                            <div className="customer-name">{a.customer_name || "Unknown"}</div>
                            <div className="customer-number">{a.customer_number || a.customer_email || "—"}</div>
                          </div>
                          <div>
                            <div className="td" style={{ fontWeight: "500", color: "var(--text-2)" }}>{a.appointment_date || "—"}</div>
                            <div className="td" style={{ fontSize: "11px", marginTop: "2px" }}>{a.appointment_time || "—"}</div>
                          </div>
                          <div className="td">{a.purpose || a.notes || "General"}</div>
                          <div>
                            <span className="status-badge" style={{ background: sc.bg, color: sc.color, borderColor: sc.border }}>
                              <span className="status-dot" />
                              {a.status || "pending"}
                            </span>
                          </div>
                          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                            {a.status !== "confirmed" && (
                              <button className="action-btn confirm" onClick={(e) => { e.stopPropagation(); updateStatus(a.id, "confirmed"); }}>✓</button>
                            )}
                            {a.status !== "cancelled" && (
                              <button className="action-btn cancel" onClick={(e) => { e.stopPropagation(); updateStatus(a.id, "cancelled"); }}>✕</button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </>
                ) : (
                  <div className="empty">
                    <div className="empty-icon">📅</div>
                    <div className="empty-title">No appointments yet</div>
                    <div className="empty-sub">Appointments booked by your AI agents will appear here.</div>
                  </div>
                )}
              </div>

              {/* DETAIL PANEL */}
              {selected ? (
                <div className="detail-panel">
                  <div className="detail-header">
                    <div className="detail-name">{selected.customer_name || "Unknown"}</div>
                    <span className="status-badge" style={{ background: statusColor(selected.status).bg, color: statusColor(selected.status).color, borderColor: statusColor(selected.status).border }}>
                      <span className="status-dot" /> {selected.status || "pending"}
                    </span>
                  </div>
                  <div className="detail-body">
                    {[
                      { key: "Phone", val: selected.customer_number },
                      { key: "Email", val: selected.customer_email },
                      { key: "Date", val: selected.appointment_date },
                      { key: "Time", val: selected.appointment_time },
                      { key: "Purpose", val: selected.purpose },
                      { key: "Notes", val: selected.notes },
                      { key: "Agent", val: selected.agent_type },
                      { key: "Booked", val: formatDate(selected.created_at) },
                    ].filter(r => r.val).map(r => (
                      <div key={r.key} className="detail-row">
                        <span className="detail-key">{r.key}</span>
                        <span className="detail-val">{r.val}</span>
                      </div>
                    ))}

                    {/* Extra info — any niche specific data */}
                    {selected.extra_info && Object.keys(selected.extra_info).length > 0 && (
                      <>
                        <div style={{ fontSize: "11px", fontWeight: "700", color: "var(--text-4)", textTransform: "uppercase", letterSpacing: "0.5px", marginTop: "12px", marginBottom: "8px" }}>
                          Additional Info
                        </div>
                        <div className="extra-box">
                          {Object.entries(selected.extra_info).map(([key, val]) => (
                            <div key={key} className="extra-item">
                              <span className="extra-key">{key.replace(/_/g, " ")}</span>
                              <span className="extra-val">{String(val)}</span>
                            </div>
                          ))}
                        </div>
                      </>
                    )}

                    {/* Action buttons */}
                    <div className="detail-action-btns">
                      {selected.status !== "confirmed" && (
                        <button className="detail-action-btn" style={{ background: "rgba(34,197,94,0.1)", color: "#4ade80", border: "1px solid rgba(34,197,94,0.2)" }} onClick={() => updateStatus(selected.id, "confirmed")}>
                          ✓ Confirm
                        </button>
                      )}
                      {selected.status !== "cancelled" && (
                        <button className="detail-action-btn" style={{ background: "rgba(248,113,113,0.1)", color: "#f87171", border: "1px solid rgba(248,113,113,0.2)" }} onClick={() => updateStatus(selected.id, "cancelled")}>
                          ✕ Cancel
                        </button>
                      )}
                      {selected.status === "confirmed" && (
                        <button className="detail-action-btn" style={{ background: "rgba(245,158,11,0.1)", color: "#fbbf24", border: "1px solid rgba(245,158,11,0.2)" }} onClick={() => updateStatus(selected.id, "pending")}>
                          ↺ Reset
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="detail-panel" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "220px" }}>
                  <div style={{ fontSize: "36px", marginBottom: "10px", opacity: 0.3 }}>📅</div>
                  <div style={{ fontSize: "13px", color: "var(--text-4)", fontWeight: "500", textAlign: "center" }}>Click any row<br />to see details</div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}