"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CallLogsPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [calls, setCalls] = useState([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push("/"); return; }
      setUser(session.user);
      await loadCalls(session.user.id);
      setLoading(false);
    };
    init();
  }, [router]);

  const loadCalls = async (userId) => {
    try {
      const { data } = await supabase
        .from("call_logs")
        .select("*")
        .eq("user_id", userId)
        .order("started_at", { ascending: false })
        .limit(100);
      setCalls(data || []);
    } catch (err) { console.error(err); }
  };

  const formatDuration = (s) => {
    if (!s) return "—";
    if (s < 60) return `${s}s`;
    return `${Math.floor(s / 60)}m ${s % 60}s`;
  };

  const formatTime = (d) => {
    if (!d) return "—";
    return new Date(d).toLocaleString("en-US", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
  };

  const filtered = calls.filter(c => {
    const matchFilter = filter === "all" || (filter === "scam" && c.is_scam) || (filter === "completed" && c.status === "completed") || (filter === "missed" && c.status !== "completed");
    const matchSearch = !search || [c.customer_number, c.business_number, c.summary].some(v => v?.toLowerCase().includes(search.toLowerCase()));
    return matchFilter && matchSearch;
  });

  const counts = {
    all: calls.length,
    completed: calls.filter(c => c.status === "completed").length,
    scam: calls.filter(c => c.is_scam).length,
    missed: calls.filter(c => c.status !== "completed").length,
  };

  const sentimentColor = (s) => {
    if (s === "Positive") return "#4ade80";
    if (s === "Negative") return "#f87171";
    return "#9898c0";
  };

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#0d0d14", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Montserrat, sans-serif" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ width: "40px", height: "40px", border: "3px solid rgba(124,58,237,0.2)", borderTop: "3px solid #7c3aed", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 16px" }} />
        <p style={{ color: "#9898c0", fontSize: "14px", fontWeight: "500" }}>Loading call logs...</p>
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
        .content { padding: 32px; max-width: 1000px; }

        /* STATS */
        .stats-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 24px; }
        .stat-card { background: var(--bg-2); border: 1px solid var(--border); border-radius: 16px; padding: 20px; box-shadow: var(--sh-card); cursor: pointer; transition: all 0.2s; }
        .stat-card:hover, .stat-card.active { border-color: var(--border-2); background: var(--bg-3); }
        .stat-card.active { border-color: var(--p3); }
        .stat-val { font-size: 28px; font-weight: 800; color: var(--text); letter-spacing: -1px; margin-bottom: 4px; }
        .stat-label { font-size: 12px; font-weight: 600; color: var(--text-4); text-transform: uppercase; letter-spacing: 0.5px; }

        /* TOOLBAR */
        .toolbar { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; flex-wrap: wrap; }
        .search-input { flex: 1; min-width: 200px; padding: 10px 16px; border-radius: 10px; border: 1px solid var(--border); background: var(--bg-2); color: var(--text); font-size: 14px; font-family: 'Montserrat', sans-serif; outline: none; transition: all 0.15s; font-weight: 400; }
        .search-input:focus { border-color: var(--border-2); box-shadow: 0 0 0 3px rgba(124,58,237,0.1); }
        .search-input::placeholder { color: var(--text-4); }

        /* LAYOUT */
        .page-grid { display: grid; grid-template-columns: 1fr 380px; gap: 16px; }

        /* CALL LIST */
        .call-list { background: var(--bg-2); border: 1px solid var(--border); border-radius: 20px; overflow: hidden; box-shadow: var(--sh-card); }
        .call-row { display: flex; align-items: center; gap: 12px; padding: 16px 20px; border-bottom: 1px solid var(--border); cursor: pointer; transition: all 0.15s; }
        .call-row:last-child { border-bottom: none; }
        .call-row:hover { background: var(--bg-3); }
        .call-row.selected { background: var(--p-soft); border-left: 3px solid var(--p3); }
        .call-icon { width: 40px; height: 40px; border-radius: 11px; display: flex; align-items: center; justify-content: center; font-size: 18px; flex-shrink: 0; border: 1px solid var(--border); }
        .call-number { font-size: 13px; font-weight: 600; color: var(--text); }
        .call-time { font-size: 11px; color: var(--text-4); margin-top: 2px; font-weight: 400; }
        .call-duration { font-size: 12px; font-weight: 600; color: var(--p3); margin-left: auto; }
        .call-scam { font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 50px; background: rgba(248,113,113,0.1); color: #f87171; border: 1px solid rgba(248,113,113,0.2); margin-left: 6px; }

        /* CALL DETAIL */
        .call-detail { background: var(--bg-2); border: 1px solid var(--border); border-radius: 20px; padding: 24px; box-shadow: var(--sh-card); height: fit-content; position: sticky; top: 80px; }
        .detail-title { font-size: 14px; font-weight: 700; color: var(--text); margin-bottom: 20px; }
        .detail-row { display: flex; justify-content: space-between; align-items: flex-start; padding: 10px 0; border-bottom: 1px solid var(--border); gap: 12px; }
        .detail-row:last-of-type { border-bottom: none; }
        .detail-key { font-size: 11px; font-weight: 600; color: var(--text-4); text-transform: uppercase; letter-spacing: 0.5px; flex-shrink: 0; }
        .detail-val { font-size: 13px; color: var(--text-2); font-weight: 500; text-align: right; }
        .transcript-box { background: var(--bg-3); border: 1px solid var(--border); border-radius: 12px; padding: 14px; margin-top: 16px; max-height: 200px; overflow-y: auto; font-size: 12px; color: var(--text-3); line-height: 1.7; font-weight: 400; }
        .transcript-box::-webkit-scrollbar { width: 4px; }
        .transcript-box::-webkit-scrollbar-track { background: transparent; }
        .transcript-box::-webkit-scrollbar-thumb { background: var(--border-2); border-radius: 2px; }

        /* EMPTY */
        .empty { text-align: center; padding: 64px 24px; }
        .empty-icon { font-size: 48px; margin-bottom: 16px; opacity: 0.3; }
        .empty-title { font-size: 16px; font-weight: 700; color: var(--text-2); margin-bottom: 8px; }
        .empty-sub { font-size: 14px; color: var(--text-4); font-weight: 400; }

        .mob-topbar { display: none; position: fixed; top: 0; left: 0; right: 0; z-index: 200; height: 58px; background: var(--bg-2); border-bottom: 1px solid var(--border); padding: 0 16px; align-items: center; justify-content: space-between; }

        @keyframes fadeUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
        .f1 { animation: fadeUp 0.5s ease both; }
        .f2 { animation: fadeUp 0.5s ease 0.07s both; }
        .f3 { animation: fadeUp 0.5s ease 0.14s both; }

        @media (max-width: 1024px) { .page-grid { grid-template-columns: 1fr; } .call-detail { position: static; } }
        @media (max-width: 768px) {
          .sidebar { display: none; }
          .main { margin-left: 0; padding-top: 58px; }
          .mob-topbar { display: flex; }
          .topbar { display: none; }
          .content { padding: 20px 16px; }
          .stats-row { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>

      {/* MOBILE TOPBAR */}
      <div className="mob-topbar">
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none" }}>
          <img src="/logo.png" style={{ height: "50px", borderRadius: "30px", background: "#ffffff", padding: "2px" }} />
          <span style={{ fontSize: "13px", fontWeight: "700", color: "var(--text)", letterSpacing: "1px", textTransform: "uppercase" }}>AEZIO AI</span>
        </Link>
        <Link href="/dashboard" className="back-btn">← Back</Link>
      </div>

      <div className="wrap">
        {/* SIDEBAR */}
        <aside className="sidebar">
          <Link href="/" className="sb-logo">
            <img src="/logo.png" style={{ height: "50px", borderRadius: "30px", background: "#ffffff", padding: "2px" }} />
            <span className="sb-logo-text">AEZIO AI</span>
          </Link>
          <div className="sb-divider" />
          <div className="sb-label">Overview</div>
          <Link href="/dashboard" className="sb-link"><span className="sb-link-icon">⊞</span> Dashboard</Link>
          <div style={{ marginTop: "12px" }} />
          <div className="sb-label">Agents</div>
          <Link href="/dashboard/whatsapp-setup" className="sb-link">
            <span className="sb-link-icon"><img src="/whatsappsvg.png" style={{ height: "16px", width: "16px" }} /></span> WhatsApp Agent
          </Link>
          <Link href="/dashboard/email-setup" className="sb-link"><span className="sb-link-icon">📧</span> Email Agent</Link>
          <Link href="/dashboard/voice-setup" className="sb-link"><span className="sb-link-icon">📞</span> Voice Agent</Link>
          <div style={{ marginTop: "12px" }} />
          <div className="sb-label">Data</div>
          <Link href="/dashboard/appointments" className="sb-link"><span className="sb-link-icon">📅</span> Appointments</Link>
          <Link href="/dashboard/call-logs" className="sb-link active"><span className="sb-link-icon">📋</span> Call Logs</Link>
          <div style={{ marginTop: "12px" }} />
          <div className="sb-label">Account</div>
          <Link href="/pricing" className="sb-link"><span className="sb-link-icon">⬆</span> Upgrade Plan</Link>
          <Link href="/" className="sb-link"><span className="sb-link-icon">←</span> Back to Website</Link>
          <div className="sb-bottom">
            <button className="sb-logout" onClick={async () => { await supabase.auth.signOut(); router.push("/"); }}>
              <span>⊗</span> Logout
            </button>
          </div>
        </aside>

        {/* MAIN */}
        <main className="main">
          <div className="topbar">
            <div className="topbar-left">
              <Link href="/dashboard" className="back-btn">← Dashboard</Link>
              <span style={{ color: "var(--text-4)", fontSize: "14px" }}>/</span>
              <span className="topbar-title">Call Logs</span>
            </div>
            <img src={avatarUrl} style={{ width: "36px", height: "36px", borderRadius: "10px", objectFit: "cover", border: "1px solid var(--border)" }} />
          </div>

          <div className="content">
            {/* HEADER */}
            <div style={{ marginBottom: "24px" }} className="f1">
              <h1 style={{ fontSize: "28px", fontWeight: "800", color: "var(--text)", letterSpacing: "-0.5px", marginBottom: "6px" }}>Call Logs</h1>
              <p style={{ fontSize: "14px", color: "var(--text-4)", fontWeight: "400" }}>Complete history of all calls handled by your Voice AI agent.</p>
            </div>

            {/* STATS */}
            <div className="stats-row f1">
              {[
                { label: "Total Calls", val: counts.all, filter: "all" },
                { label: "Completed", val: counts.completed, filter: "completed" },
                { label: "Missed", val: counts.missed, filter: "missed" },
                { label: "Scam Flagged", val: counts.scam, filter: "scam" },
              ].map(s => (
                <div key={s.filter} className={`stat-card ${filter === s.filter ? "active" : ""}`} onClick={() => setFilter(s.filter)}>
                  <div className="stat-val">{s.val}</div>
                  <div className="stat-label">{s.label}</div>
                </div>
              ))}
            </div>

            {/* TOOLBAR */}
            <div className="toolbar f2">
              <input className="search-input" placeholder="Search by number or summary..." value={search} onChange={e => setSearch(e.target.value)} />
              <button onClick={() => loadCalls(user.id)} style={{ padding: "10px 18px", borderRadius: "10px", border: "1px solid var(--border)", background: "var(--p-soft)", color: "var(--p3)", font: "600 13px Montserrat", cursor: "pointer", whiteSpace: "nowrap" }}>
                ↻ Refresh
              </button>
            </div>

            {/* MAIN GRID */}
            <div className="page-grid f3">
              {/* CALL LIST */}
              <div className="call-list">
                {filtered.length > 0 ? filtered.map(c => (
                  <div key={c.id} className={`call-row ${selected?.id === c.id ? "selected" : ""}`} onClick={() => setSelected(c)}>
                    <div className="call-icon" style={{ background: c.is_scam ? "rgba(248,113,113,0.1)" : "var(--p-soft)" }}>
                      {c.is_scam ? "⚠️" : "📞"}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <span className="call-number">{c.customer_number || "Unknown"}</span>
                        {c.is_scam && <span className="call-scam">SCAM</span>}
                      </div>
                      <div className="call-time">{formatTime(c.started_at)}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div className="call-duration">{formatDuration(c.duration_seconds)}</div>
                      <div style={{ fontSize: "11px", color: sentimentColor(c.sentiment), marginTop: "2px", fontWeight: "500" }}>{c.sentiment || ""}</div>
                    </div>
                  </div>
                )) : (
                  <div className="empty">
                    <div className="empty-icon">📞</div>
                    <div className="empty-title">No call logs yet</div>
                    <div className="empty-sub">Voice agent calls will appear here once activated.</div>
                  </div>
                )}
              </div>

              {/* CALL DETAIL */}
              {selected ? (
                <div className="call-detail">
                  <div className="detail-title">Call Details</div>
                  {[
                    { key: "From", val: selected.customer_number || "—" },
                    { key: "To", val: selected.business_number || "—" },
                    { key: "Duration", val: formatDuration(selected.duration_seconds) },
                    { key: "Status", val: selected.status || "—" },
                    { key: "Started", val: formatTime(selected.started_at) },
                    { key: "Ended", val: formatTime(selected.ended_at) },
                    { key: "Sentiment", val: selected.sentiment || "—" },
                    { key: "Intent", val: selected.call_intent || "—" },
                    { key: "End Reason", val: selected.ended_reason || "—" },
                    { key: "Scam", val: selected.is_scam ? `Yes — ${selected.scam_reason || "Suspicious"}` : "No" },
                  ].map(r => (
                    <div key={r.key} className="detail-row">
                      <span className="detail-key">{r.key}</span>
                      <span className="detail-val" style={{ color: r.key === "Scam" && selected.is_scam ? "#f87171" : "var(--text-2)" }}>{r.val}</span>
                    </div>
                  ))}
                  {selected.summary && (
                    <>
                      <div style={{ fontSize: "11px", fontWeight: "700", color: "var(--text-4)", textTransform: "uppercase", letterSpacing: "0.5px", marginTop: "16px", marginBottom: "8px" }}>Summary</div>
                      <div className="transcript-box">{selected.summary}</div>
                    </>
                  )}
                  {selected.transcript && (
                    <>
                      <div style={{ fontSize: "11px", fontWeight: "700", color: "var(--text-4)", textTransform: "uppercase", letterSpacing: "0.5px", marginTop: "14px", marginBottom: "8px" }}>Transcript</div>
                      <div className="transcript-box">{selected.transcript}</div>
                    </>
                  )}
                </div>
              ) : (
                <div className="call-detail" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "200px" }}>
                  <div style={{ fontSize: "32px", marginBottom: "12px", opacity: 0.3 }}>📋</div>
                  <div style={{ fontSize: "13px", color: "var(--text-4)", fontWeight: "500", textAlign: "center" }}>Select a call to<br />view details</div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}