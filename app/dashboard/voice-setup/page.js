"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function VoiceSetup() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [existingAgent, setExistingAgent] = useState(null);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    business_name: "", phone_number: "", client_whatsapp: "",
    timings: "", services: "", fees: "", location: "", extra_info: "",
  });

  const router = useRouter();

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push("/"); return; }
      setUser(session.user);
      const { data } = await supabase.from("voice_agents").select("*").eq("user_id", session.user.id).single();
      if (data) {
        setExistingAgent(data);
        setForm({ business_name: data.business_name || "", phone_number: data.phone_number || "", client_whatsapp: data.client_whatsapp || "", timings: data.timings || "", services: data.services || "", fees: data.fees || "", location: data.location || "", extra_info: data.extra_info || "" });
      }
      setLoading(false);
    };
    init();
  }, [router]);

  const handleChange = (e) => { setForm({ ...form, [e.target.name]: e.target.value }); setError(""); };

  const handleSave = async () => {
    if (!form.business_name.trim()) { setError("Business name required!"); return; }
    if (!form.client_whatsapp.trim()) { setError("Your WhatsApp number required for scam alerts!"); return; }
    setSaving(true); setError("");
    try {
      if (existingAgent) {
        const { error } = await supabase.from("voice_agents").update({ ...form }).eq("id", existingAgent.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("voice_agents").insert([{ ...form, user_id: user.id, is_active: false }]);
        if (error) throw error;
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      const { data } = await supabase.from("voice_agents").select("*").eq("user_id", user.id).single();
      setExistingAgent(data);
    } catch (err) { setError(err.message || "Something went wrong!"); }
    setSaving(false);
  };

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#0d0d14", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Montserrat, sans-serif" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ width: "40px", height: "40px", border: "3px solid rgba(124,58,237,0.2)", borderTop: "3px solid #7c3aed", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 16px" }} />
        <p style={{ color: "#9898c0", fontSize: "14px", fontWeight: "500" }}>Loading...</p>
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
        .back-btn { display: flex; align-items: center; gap: 6px; padding: 8px 16px; border-radius: 9px; border: 1px solid var(--border); background: var(--p-soft); font-size: 13px; font-weight: 600; color: var(--p3); text-decoration: none; transition: all 0.15s; }
        .back-btn:hover { background: var(--p-mid); border-color: var(--border-2); }
        .topbar-title { font-size: 15px; font-weight: 700; color: var(--text); letter-spacing: -0.2px; }

        /* CONTENT */
        .content { padding: 32px; max-width: 760px; }
        .page-icon { width: 54px; height: 54px; border-radius: 15px; background: var(--p-soft); border: 1px solid var(--border-2); display: flex; align-items: center; justify-content: center; font-size: 26px; margin-bottom: 18px; }
        .page-title { font-family: 'Montserrat', sans-serif; font-size: 30px; font-weight: 800; color: var(--text); letter-spacing: -0.8px; margin-bottom: 8px; }
        .page-sub { font-size: 14px; color: var(--text-3); line-height: 1.7; font-weight: 400; }
        .status-badge { display: inline-flex; align-items: center; gap: 7px; padding: 6px 14px; border-radius: 50px; font-size: 12px; font-weight: 600; margin-top: 14px; }

        /* HOW IT WORKS */
        .how-banner { background: var(--bg-2); border: 1px solid var(--border-2); border-radius: 18px; padding: 22px 26px; margin-bottom: 20px; display: flex; gap: 28px; flex-wrap: wrap; box-shadow: var(--sh-p); position: relative; overflow: hidden; }
        .how-banner::before { content: ''; position: absolute; inset: 0; background: radial-gradient(ellipse 60% 80% at 100% 50%, rgba(124,58,237,0.08) 0%, transparent 60%); pointer-events: none; }
        .how-step { display: flex; align-items: flex-start; gap: 10px; flex: 1; min-width: 160px; position: relative; }
        .how-num { width: 26px; height: 26px; border-radius: 50%; background: var(--p-mid); border: 1px solid var(--border-2); display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; color: var(--p3); flex-shrink: 0; margin-top: 1px; }
        .how-text { font-size: 12px; color: var(--text-3); line-height: 1.6; font-weight: 400; }
        .how-text strong { color: var(--text); display: block; margin-bottom: 2px; font-size: 13px; font-weight: 600; }

        /* FORM */
        .form-card { background: var(--bg-2); border: 1px solid var(--border); border-radius: 22px; padding: 32px; margin-bottom: 16px; box-shadow: var(--sh-card); }
        .form-section-title { font-size: 12px; font-weight: 700; color: var(--text-2); margin-bottom: 20px; padding-bottom: 14px; border-bottom: 1px solid var(--border); display: flex; align-items: center; gap: 8px; letter-spacing: 0.3px; text-transform: uppercase; }
        .form-group { margin-bottom: 18px; }
        .form-label { display: block; font-size: 12px; font-weight: 600; color: var(--text-3); margin-bottom: 7px; letter-spacing: 0.5px; text-transform: uppercase; }
        .form-label span { color: #f87171; margin-left: 2px; }
        .form-input { width: 100%; padding: 12px 15px; border-radius: 10px; border: 1px solid var(--border); background: var(--bg-3); color: var(--text); font-size: 14px; font-family: 'Montserrat', sans-serif; outline: none; transition: all 0.15s; resize: vertical; font-weight: 400; }
        .form-input:focus { border-color: var(--border-3); box-shadow: 0 0 0 3px rgba(124,58,237,0.1); background: var(--bg-4); }
        .form-input::placeholder { color: var(--text-4); }
        .form-hint { font-size: 11px; color: var(--text-4); margin-top: 6px; line-height: 1.5; font-weight: 400; }

        .alert-err { background: rgba(220,38,38,0.1); border: 1px solid rgba(220,38,38,0.25); color: #f87171; padding: 11px 14px; border-radius: 10px; margin-bottom: 20px; font-size: 13px; font-weight: 500; }
        .alert-ok { background: rgba(34,197,94,0.1); border: 1px solid rgba(34,197,94,0.25); color: #4ade80; padding: 11px 14px; border-radius: 10px; margin-bottom: 20px; font-size: 13px; font-weight: 600; }
        .alert-info { background: var(--p-soft); border: 1px solid var(--border-2); color: var(--p3); padding: 11px 14px; border-radius: 10px; margin-bottom: 20px; font-size: 13px; font-weight: 500; }

        .save-btn { width: 100%; padding: 14px; border-radius: 11px; border: none; background: var(--p); color: white; font-size: 14px; font-weight: 700; cursor: pointer; font-family: 'Montserrat', sans-serif; transition: all 0.2s; margin-top: 4px; letter-spacing: 0.2px; box-shadow: var(--sh-p); }
        .save-btn:hover:not(:disabled) { background: var(--p2); transform: translateY(-2px); box-shadow: 0 0 32px rgba(124,58,237,0.4), 0 8px 20px rgba(124,58,237,0.3); }
        .save-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .info-card { background: var(--bg-2); border: 1px solid var(--border); border-radius: 16px; padding: 20px; transition: all 0.2s; box-shadow: var(--sh-card); }
        .info-card:hover { border-color: var(--border-2); background: var(--bg-3); box-shadow: var(--sh-card-hover); }

        .mob-topbar { display: none; position: fixed; top: 0; left: 0; right: 0; z-index: 200; height: 58px; background: var(--bg-2); border-bottom: 1px solid var(--border); padding: 0 16px; align-items: center; justify-content: space-between; }

        @keyframes fadeUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
        .f1 { animation: fadeUp 0.5s ease both; }
        .f2 { animation: fadeUp 0.5s ease 0.08s both; }
        .f3 { animation: fadeUp 0.5s ease 0.16s both; }
        .f4 { animation: fadeUp 0.5s ease 0.24s both; }

        @media (max-width: 768px) {
          .sidebar { display: none; }
          .main { margin-left: 0; padding-top: 58px; }
          .mob-topbar { display: flex; }
          .topbar { display: none; }
          .content { padding: 20px 16px; }
          .form-card { padding: 22px 18px; }
          .page-title { font-size: 24px; }
          .how-banner { gap: 16px; }
        }
        @media (max-width: 480px) {
          .info-grid { grid-template-columns: 1fr; }
          .how-step { min-width: 100%; }
        }
      `}</style>

      {/* MOBILE TOPBAR */}
      <div className="mob-topbar">
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none" }}>
          <img src="/logo.png" style={{ height: "50px", borderRadius: "30px", background: "#ffffff", padding: "2px" }} />
          <span style={{ fontSize: "13px", fontWeight: "700", color: "var(--text)", letterSpacing: "1px", textTransform: "uppercase" }}>AEZIO AI</span>
        </Link>
        <Link href="/dashboard" className="back-btn">Dashboard</Link>
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
          <Link href="/dashboard/voice-setup" className="sb-link active"><span className="sb-link-icon"><img src="/phone.png" style={{height: "20px"}}/></span> Voice Agent</Link>
          <div style={{ marginTop: "12px" }} />
          <div className="sb-label">Account</div>
          <Link href="/pricing" className="sb-link"><span className="sb-link-icon"><img src="/upgrade.png" style={{height: "20px"}}/></span> Upgrade Plan</Link>
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
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <Link href="/dashboard" className="back-btn">Dashboard</Link>
              <span style={{ color: "var(--text-4)", fontSize: "14px" }}>/</span>
              <span className="topbar-title">Voice Agent Setup</span>
            </div>
            {existingAgent && (
              <span className="status-badge" style={{ background: existingAgent.is_active ? "rgba(34,197,94,0.1)" : "rgba(245,158,11,0.1)", color: existingAgent.is_active ? "#4ade80" : "#fbbf24", border: `1px solid ${existingAgent.is_active ? "rgba(34,197,94,0.2)" : "rgba(245,158,11,0.2)"}` }}>
                <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "currentColor", display: "inline-block" }} />
                {existingAgent.is_active ? "Agent Active" : "Pending Activation"}
              </span>
            )}
          </div>

          <div className="content">
            <div style={{ marginBottom: "24px" }} className="f1">
              <div className="page-icon"><img src="/voice.png" style={{height: "40px"}}/></div>
              <h1 className="page-title">Voice Agent Setup</h1>
              <p className="page-sub">Your AI agent will automatically answer customer calls, give information, and book appointments — 24/7.</p>
              {existingAgent && (
                <span className="status-badge" style={{ background: existingAgent.is_active ? "rgba(34,197,94,0.1)" : "rgba(245,158,11,0.1)", color: existingAgent.is_active ? "#4ade80" : "#fbbf24", border: `1px solid ${existingAgent.is_active ? "rgba(34,197,94,0.2)" : "rgba(245,158,11,0.2)"}` }}>
                  <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "currentColor", display: "inline-block" }} />
                  {existingAgent.is_active ? "Agent is Active" : "Waiting for activation"}
                </span>
              )}
            </div>

            {/* HOW IT WORKS */}
            <div className="how-banner f2">
              {[
                { n: "1", title: "Fill the form", text: "Add your business info below" },
                { n: "2", title: "We assign a number", text: "Dedicated phone number for your business" },
                { n: "3", title: "Customers call", text: "AI answers, informs & books appointments" },
                { n: "4", title: "You get alerts", text: "Scam calls detected — instant WhatsApp alert" },
              ].map((s) => (
                <div key={s.n} className="how-step">
                  <div className="how-num">{s.n}</div>
                  <div className="how-text"><strong>{s.title}</strong>{s.text}</div>
                </div>
              ))}
            </div>

            {/* FORM */}
            <div className="form-card f3">
              {error && <div className="alert-err">⚠ {error}</div>}
              {saved && <div className="alert-ok">✓ Voice agent details saved! We'll activate within 24 hours.</div>}
              <div className="alert-info">After saving, our team will assign a dedicated phone number and activate your agent within 24 hours.</div>

              <div className="form-section-title"><span><img src="/real-estate.png" style={{height: "30px"}}/></span> Business Information</div>

              <div className="form-group">
                <label className="form-label">Business Name <span>*</span></label>
                <input className="form-input" name="business_name" value={form.business_name} onChange={handleChange} placeholder="e.g. Dr. Sharma Skin Clinic" />
                <p className="form-hint">AI will greet callers with this name</p>
              </div>

              <div className="form-group">
                <label className="form-label">Your WhatsApp Number <span>*</span></label>
                <input className="form-input" name="client_whatsapp" value={form.client_whatsapp} onChange={handleChange} placeholder="e.g. +919876543210" />
                <p className="form-hint">You'll receive scam alerts + appointment notifications on this number</p>
              </div>

              <div className="form-group">
                <label className="form-label">Business Timings</label>
                <input className="form-input" name="timings" value={form.timings} onChange={handleChange} placeholder="e.g. Mon–Sat 10am–8pm, Sunday Closed" />
                <p className="form-hint">AI will inform callers about your working hours</p>
              </div>

              <div className="form-group">
                <label className="form-label">Location / Address</label>
                <input className="form-input" name="location" value={form.location} onChange={handleChange} placeholder="e.g. Near City Mall" />
              </div>

              <div style={{ height: "1px", background: "var(--border)", margin: "24px 0" }} />
              <div className="form-section-title">Services & Pricing</div>

              <div className="form-group">
                <label className="form-label">Services Offered</label>
                <textarea className="form-input" name="services" value={form.services} onChange={handleChange} placeholder="e.g. Acne treatment, Hair fall, Skin allergy, Pigmentation" rows={3} />
                <p className="form-hint">AI will answer service questions using this</p>
              </div>

              <div className="form-group">
                <label className="form-label">Fees / Pricing</label>
                <textarea className="form-input" name="fees" value={form.fees} onChange={handleChange} placeholder="e.g. Consultation ₹500, Follow-up ₹300" rows={2} />
              </div>

              <div style={{ height: "1px", background: "var(--border)", margin: "24px 0" }} />
              <div className="form-section-title">Extra Information</div>

              <div className="form-group">
                <label className="form-label">Other Important Information</label>
                <textarea className="form-input" name="extra_info" value={form.extra_info} onChange={handleChange} placeholder="e.g. We accept Cash and UPI. Parking available. Home visits on request." rows={4} />
                <p className="form-hint">Anything else you want your AI to tell callers</p>
              </div>

              <button className="save-btn" onClick={handleSave} disabled={saving}>
                {saving ? "Saving..." : existingAgent ? "Update Voice Agent →" : "Save & Request Activation →"}
              </button>
              <p style={{ textAlign: "center", color: "var(--text-4)", fontSize: "12px", marginTop: "14px", lineHeight: "1.6", fontWeight: "400" }}>
                We'll assign a dedicated phone number and activate within 24 hours.<br />
                You'll be notified on your registered email.
              </p>
            </div>

            {/* INFO CARDS */}
            <div className="info-grid f4">
              {[
                { icon: <img src="/phone.png" style={{height: "40px"}}/>, title: "Dedicated Phone Number", text: "Customers pay normal call rates — no extra charges" },
                { icon: <img src="/ailogo.png" style={{ height: "40px"}} />, title: "AEZIO AI Powered", text: "Natural conversation — sounds human" },
                { icon: "📅", title: "Auto Appointments", text: "Books appointments directly — saves to your dashboard" },
                { icon: "⚠️", title: "Scam Detection", text: "Suspicious calls flagged — instant WhatsApp alert to you" },
              ].map((item) => (
                <div key={item.title} className="info-card">
                  <div style={{ fontSize: "22px", marginBottom: "10px" }}>{item.icon}</div>
                  <div style={{ fontSize: "13px", fontWeight: "600", color: "var(--text-2)", marginBottom: "5px" }}>{item.title}</div>
                  <div style={{ fontSize: "12px", color: "var(--text-4)", lineHeight: "1.6", fontWeight: "400" }}>{item.text}</div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}