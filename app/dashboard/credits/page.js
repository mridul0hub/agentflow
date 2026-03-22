"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CreditsPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [credits, setCredits] = useState({ balance: 0, total_used: 0 });
  const [transactions, setTransactions] = useState([]);
  const router = useRouter();

  const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || "https://agentflow-backend-production-34e2.up.railway.app";

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push("/"); return; }
      setUser(session.user);
      await loadCredits(session.user.id);
      setLoading(false);
    };
    init();
  }, [router]);

  const loadCredits = async (userId) => {
    try {
      const [balRes, txRes] = await Promise.all([
        fetch(`${BACKEND}/credits/balance/${userId}`),
        fetch(`${BACKEND}/credits/transactions/${userId}`)
      ]);
      const balData = await balRes.json();
      const txData = await txRes.json();
      setCredits(balData);
      setTransactions(txData.transactions || []);
    } catch (err) { console.error(err); }
  };

  const formatDate = (d) => {
    if (!d) return "—";
    return new Date(d).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
  };

  const getBalanceColor = (b) => {
    if (b > 20) return "#4ade80";
    if (b > 5) return "#fbbf24";
    return "#f87171";
  };

  const getBalanceLabel = (b) => {
    if (b > 20) return "Healthy";
    if (b > 5) return "Running Low";
    return "Critical";
  };

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#0d0d14", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Montserrat, sans-serif" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ width: "40px", height: "40px", border: "3px solid rgba(124,58,237,0.2)", borderTop: "3px solid #7c3aed", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 16px" }} />
        <p style={{ color: "#9898c0", fontSize: "14px", fontWeight: "500" }}>Loading credits...</p>
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
          --border: rgba(124,58,237,0.15); --border-2: rgba(124,58,237,0.25); --border-3: rgba(124,58,237,0.4);
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
        .content { padding: 32px; max-width: 900px; }

        /* CREDIT HERO CARD */
        .credit-hero { background: var(--bg-2); border: 1px solid var(--border-2); border-radius: 24px; padding: 36px; margin-bottom: 20px; display: flex; align-items: center; justify-content: space-between; gap: 24px; flex-wrap: wrap; box-shadow: var(--sh-p); position: relative; overflow: hidden; }
        .credit-hero::before { content: ''; position: absolute; inset: 0; background: radial-gradient(ellipse 60% 80% at 100% 50%, rgba(124,58,237,0.08) 0%, transparent 60%); pointer-events: none; }
        .credit-balance { font-size: 80px; font-weight: 800; line-height: 1; letter-spacing: -3px; position: relative; }
        .credit-label { font-size: 12px; font-weight: 700; color: var(--text-4); text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 8px; }
        .credit-status { display: inline-flex; align-items: center; gap: 6px; padding: 5px 14px; border-radius: 50px; font-size: 12px; font-weight: 700; margin-top: 10px; }
        .credit-status-dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; }

        /* STATS ROW */
        .stats-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin-bottom: 20px; }
        .stat-card { background: var(--bg-2); border: 1px solid var(--border); border-radius: 18px; padding: 22px; box-shadow: var(--sh-card); }
        .stat-val { font-size: 28px; font-weight: 800; color: var(--text); letter-spacing: -1px; margin-bottom: 6px; }
        .stat-label { font-size: 12px; font-weight: 600; color: var(--text-4); text-transform: uppercase; letter-spacing: 0.5px; }

        /* BUY CREDITS */
        .buy-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin-bottom: 20px; }
        .buy-card { background: var(--bg-2); border: 1px solid var(--border); border-radius: 18px; padding: 24px; text-align: center; transition: all 0.25s; box-shadow: var(--sh-card); cursor: pointer; text-decoration: none; display: block; }
        .buy-card:hover { border-color: var(--border-2); background: var(--bg-3); transform: translateY(-4px); box-shadow: var(--sh-card-hover); }
        .buy-card.featured { border-color: var(--border-2); background: var(--p-soft); box-shadow: var(--sh-p); }
        .buy-credits { font-size: 32px; font-weight: 800; color: var(--p3); letter-spacing: -1px; margin-bottom: 4px; }
        .buy-credits-label { font-size: 11px; color: var(--text-4); font-weight: 600; text-transform: uppercase; margin-bottom: 14px; }
        .buy-price { font-size: 22px; font-weight: 800; color: var(--text); margin-bottom: 4px; }
        .buy-per { font-size: 11px; color: var(--text-4); margin-bottom: 16px; font-weight: 500; }
        .buy-btn { width: 100%; padding: 11px; border-radius: 9px; border: 1px solid var(--border-2); background: var(--p-soft); color: var(--p3); font-size: 13px; font-weight: 700; cursor: pointer; font-family: 'Montserrat', sans-serif; transition: all 0.15s; }
        .buy-btn:hover { background: var(--p-mid); }
        .buy-btn.featured { background: var(--p); color: white; border-color: var(--p); }
        .buy-btn.featured:hover { background: var(--p2); }
        .buy-badge { display: inline-block; padding: 3px 10px; border-radius: 50px; font-size: 10px; font-weight: 700; background: var(--p); color: white; margin-bottom: 12px; }

        /* TRANSACTIONS */
        .table-card { background: var(--bg-2); border: 1px solid var(--border); border-radius: 20px; overflow: hidden; box-shadow: var(--sh-card); }
        .table-header { display: grid; grid-template-columns: 2fr 1fr 1fr 1.5fr; gap: 12px; padding: 14px 20px; border-bottom: 1px solid var(--border); font-size: 11px; font-weight: 700; color: var(--text-4); text-transform: uppercase; letter-spacing: 1px; }
        .table-row { display: grid; grid-template-columns: 2fr 1fr 1fr 1.5fr; gap: 12px; padding: 14px 20px; border-bottom: 1px solid var(--border); align-items: center; transition: background 0.15s; }
        .table-row:last-child { border-bottom: none; }
        .table-row:hover { background: var(--bg-3); }
        .tx-desc { font-size: 13px; font-weight: 500; color: var(--text-2); }
        .tx-agent { font-size: 11px; color: var(--text-4); margin-top: 2px; font-weight: 400; text-transform: capitalize; }
        .tx-amount { font-size: 14px; font-weight: 800; }
        .tx-type { font-size: 11px; font-weight: 600; padding: 3px 10px; border-radius: 50px; }
        .tx-date { font-size: 11px; color: var(--text-4); font-weight: 400; }

        /* EMPTY */
        .empty { text-align: center; padding: 48px 24px; }
        .empty-icon { font-size: 40px; margin-bottom: 12px; opacity: 0.3; }

        /* MOBILE */
        .mob-topbar { display: none; position: fixed; top: 0; left: 0; right: 0; z-index: 200; height: 58px; background: var(--bg-2); border-bottom: 1px solid var(--border); padding: 0 16px; align-items: center; justify-content: space-between; }

        @keyframes fadeUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
        .f1 { animation: fadeUp 0.5s ease both; }
        .f2 { animation: fadeUp 0.5s ease 0.07s both; }
        .f3 { animation: fadeUp 0.5s ease 0.14s both; }
        .f4 { animation: fadeUp 0.5s ease 0.21s both; }

        @media (max-width: 900px) {
          .stats-row { grid-template-columns: repeat(3, 1fr); }
          .buy-grid { grid-template-columns: 1fr 1fr 1fr; }
          .table-header { display: none; }
          .table-row { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 768px) {
          .sidebar { display: none; }
          .main { margin-left: 0; padding-top: 58px; }
          .mob-topbar { display: flex; }
          .topbar { display: none; }
          .content { padding: 20px 16px; }
          .credit-balance { font-size: 56px; }
          .stats-row { grid-template-columns: repeat(3, 1fr); gap: 10px; }
          .buy-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 480px) {
          .stats-row { grid-template-columns: 1fr 1fr; }
          .buy-grid { grid-template-columns: 1fr; }
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
          <Link href="/dashboard/appointments" className="sb-link"><span className="sb-link-icon">📅</span> Appointments</Link>
          <Link href="/dashboard/call-logs" className="sb-link"><span className="sb-link-icon">📋</span> Call Logs</Link>
          <div style={{ marginTop: "12px" }} />
          <div className="sb-label">Account</div>
          <Link href="/dashboard/credits" className="sb-link active"><span className="sb-link-icon"><img src="/coin.png" style={{height: "20px"}}/></span> Credits</Link>
          <Link href="/pricing" className="sb-link">Upgrade Plan</Link>
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
              <Link href="/dashboard" className="back-btn">← Dashboard</Link>
              <span style={{ color: "var(--text-4)", fontSize: "14px" }}>/</span>
              <span className="topbar-title">Credits</span>
            </div>
            <img src={avatarUrl} style={{ width: "36px", height: "36px", borderRadius: "10px", objectFit: "cover", border: "1px solid var(--border)" }} />
          </div>

          <div className="content">

            {/* HEADER */}
            <div style={{ marginBottom: "24px" }} className="f1">
              <h1 style={{ fontSize: "28px", fontWeight: "800", color: "var(--text)", letterSpacing: "-0.5px", marginBottom: "6px" }}>Credits</h1>
              <p style={{ fontSize: "14px", color: "var(--text-4)", fontWeight: "400" }}>1 credit = 1 AI reply. Each WhatsApp, Email or Voice response uses 1 credit.</p>
            </div>

            {/* CREDIT HERO */}
            <div className="credit-hero f1">
              <div>
                <div className="credit-label">Current Balance</div>
                <div className="credit-balance" style={{ color: getBalanceColor(credits.balance) }}>
                  {credits.balance}
                </div>
                <div className="credit-status" style={{ background: `${getBalanceColor(credits.balance)}15`, color: getBalanceColor(credits.balance), border: `1px solid ${getBalanceColor(credits.balance)}30` }}>
                  <span className="credit-status-dot" />
                  {getBalanceLabel(credits.balance)}
                </div>
              </div>
              <div style={{ textAlign: "right", position: "relative" }}>
                <div style={{ fontSize: "13px", color: "var(--text-4)", marginBottom: "8px", fontWeight: "500" }}>Total replies sent</div>
                <div style={{ fontSize: "40px", fontWeight: "800", color: "var(--text)", letterSpacing: "-1.5px" }}>{credits.total_used}</div>
                <Link href="/pricing" style={{ display: "inline-block", marginTop: "12px", padding: "11px 24px", borderRadius: "10px", background: "var(--p)", color: "white", textDecoration: "none", fontSize: "13px", fontWeight: "700", boxShadow: "var(--sh-p)" }}>
                  Buy Credits →
                </Link>
              </div>
            </div>

            {/* STATS */}
            <div className="stats-row f2">
              {[
                { label: "Credits Used Today", val: transactions.filter(t => new Date(t.created_at).toDateString() === new Date().toDateString() && t.amount < 0).length },
                { label: "WhatsApp Replies", val: transactions.filter(t => t.agent_type === "whatsapp" && t.amount < 0).length },
                { label: "Email Replies", val: transactions.filter(t => t.agent_type === "email" && t.amount < 0).length },
              ].map(s => (
                <div key={s.label} className="stat-card">
                  <div className="stat-val">{s.val}</div>
                  <div className="stat-label">{s.label}</div>
                </div>
              ))}
            </div>

            {/* BUY CREDITS */}
            <div style={{ marginBottom: "8px" }} className="f3">
              <h2 style={{ fontSize: "16px", fontWeight: "700", color: "var(--text)", marginBottom: "14px" }}>Buy More Credits</h2>
              <div className="buy-grid">
                {[
                  { credits: 100, price: "₹299", per: "₹2.99 per credit", featured: false },
                  { credits: 500, price: "₹999", per: "₹1.99 per credit", featured: true, badge: "Best Value" },
                  { credits: 1000, price: "₹1,799", per: "₹1.79 per credit", featured: false },
                ].map(p => (
                  <div key={p.credits} className={`buy-card ${p.featured ? "featured" : ""}`}>
                    {p.badge && <div className="buy-badge">{p.badge}</div>}
                    <div className="buy-credits">{p.credits}</div>
                    <div className="buy-credits-label">Credits</div>
                    <div className="buy-price">{p.price}</div>
                    <div className="buy-per">{p.per}</div>
                    <button className={`buy-btn ${p.featured ? "featured" : ""}`} onClick={() => window.location.href = "/pricing"}>
                      Buy Now 
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* TRANSACTION HISTORY */}
            <div className="f4">
              <h2 style={{ fontSize: "16px", fontWeight: "700", color: "var(--text)", marginBottom: "14px", marginTop: "8px" }}>Transaction History</h2>
              <div className="table-card">
                {transactions.length > 0 ? (
                  <>
                    <div className="table-header">
                      <span>Description</span>
                      <span>Agent</span>
                      <span>Amount</span>
                      <span>Date</span>
                    </div>
                    {transactions.map((tx) => (
                      <div key={tx.id} className="table-row">
                        <div>
                          <div className="tx-desc">{tx.description || "—"}</div>
                          <div className="tx-agent">{tx.agent_type || "—"}</div>
                        </div>
                        <div>
                          <span className="tx-type" style={{ background: tx.type === "topup" ? "rgba(34,197,94,0.1)" : "rgba(124,58,237,0.1)", color: tx.type === "topup" ? "#4ade80" : "var(--p3)", border: `1px solid ${tx.type === "topup" ? "rgba(34,197,94,0.2)" : "var(--border)"}` }}>
                            {tx.type === "topup" ? "Top Up" : "Used"}
                          </span>
                        </div>
                        <div className="tx-amount" style={{ color: tx.amount > 0 ? "#4ade80" : "#f87171" }}>
                          {tx.amount > 0 ? `+${tx.amount}` : tx.amount}
                        </div>
                        <div className="tx-date">{formatDate(tx.created_at)}</div>
                      </div>
                    ))}
                  </>
                ) : (
                  <div className="empty">
                    <div className="empty-icon"><img src="/coin.png" style={{height: "40px"}}/></div>
                    <div style={{ fontSize: "14px", fontWeight: "600", color: "var(--text-3)", marginBottom: "6px" }}>No transactions yet</div>
                    <div style={{ fontSize: "13px", color: "var(--text-4)" }}>Credits will be deducted as your agents reply to customers.</div>
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