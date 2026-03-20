"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function WhatsAppSetup() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [existingAgent, setExistingAgent] = useState(null);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    business_name: "", whatsapp_number: "", timings: "",
    services: "", fees: "", location: "", extra_info: "",
  });

  const router = useRouter();

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push("/"); return; }
      setUser(session.user);
      const { data } = await supabase.from("whatsapp_agents").select("*").eq("user_id", session.user.id).single();
      if (data) {
        setExistingAgent(data);
        setForm({ business_name: data.business_name || "", whatsapp_number: data.whatsapp_number || "", timings: data.timings || "", services: data.services || "", fees: data.fees || "", location: data.location || "", extra_info: data.extra_info || "" });
      }
      setLoading(false);
    };
    init();
  }, [router]);

  const handleChange = (e) => { setForm({ ...form, [e.target.name]: e.target.value }); setError(""); };

  const handleSave = async () => {
    if (!form.business_name.trim()) { setError("Business name required!"); return; }
    if (!form.whatsapp_number.trim()) { setError("WhatsApp number required!"); return; }
    setSaving(true); setError("");
    try {
      if (existingAgent) {
        const { error } = await supabase.from("whatsapp_agents").update({ ...form }).eq("id", existingAgent.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("whatsapp_agents").insert([{ ...form, user_id: user.id, is_active: false }]);
        if (error) throw error;
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      const { data } = await supabase.from("whatsapp_agents").select("*").eq("user_id", user.id).single();
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
        .topbar-left { display: flex; align-items: center; gap: 10px; }
        .back-btn { display: flex; align-items: center; gap: 6px; padding: 8px 16px; border-radius: 9px; border: 1px solid var(--border); background: var(--p-soft); font-size: 13px; font-weight: 600; color: var(--p3); text-decoration: none; transition: all 0.15s; }
        .back-btn:hover { background: var(--p-mid); border-color: var(--border-2); }
        .topbar-title { font-size: 15px; font-weight: 700; color: var(--text); letter-spacing: -0.2px; }

        /* CONTENT */
        .content { padding: 32px; max-width: 760px; }
        .page-header { margin-bottom: 28px; }
        .page-icon { width: 54px; height: 54px; border-radius: 15px; background: rgba(37,211,102,0.1); border: 1px solid rgba(37,211,102,0.2); display: flex; align-items: center; justify-content: center; font-size: 26px; margin-bottom: 18px; }
        .page-title { font-family: 'Montserrat', sans-serif; font-size: 30px; font-weight: 800; color: var(--text); letter-spacing: -0.8px; margin-bottom: 8px; }
        .page-sub { font-size: 14px; color: var(--text-3); line-height: 1.7; font-weight: 400; }
        .status-badge { display: inline-flex; align-items: center; gap: 7px; padding: 6px 14px; border-radius: 50px; font-size: 12px; font-weight: 600; margin-top: 14px; }
        .status-dot { width: 6px; height: 6px; border-radius: 50%; }

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

        .save-btn { width: 100%; padding: 14px; border-radius: 11px; border: none; background: var(--p); color: white; font-size: 14px; font-weight: 700; cursor: pointer; font-family: 'Montserrat', sans-serif; transition: all 0.2s; margin-top: 4px; letter-spacing: 0.2px; box-shadow: var(--sh-p); }
        .save-btn:hover:not(:disabled) { background: var(--p2); transform: translateY(-2px); box-shadow: 0 0 32px rgba(124,58,237,0.4), 0 8px 20px rgba(124,58,237,0.3); }
        .save-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .save-note { text-align: center; color: var(--text-4); font-size: 12px; margin-top: 14px; line-height: 1.6; font-weight: 400; }

        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .info-card { background: var(--bg-2); border: 1px solid var(--border); border-radius: 16px; padding: 20px; transition: all 0.2s; box-shadow: var(--sh-card); }
        .info-card:hover { border-color: var(--border-2); background: var(--bg-3); box-shadow: var(--sh-card-hover); }
        .info-icon { font-size: 22px; margin-bottom: 10px; }
        .info-title { font-size: 13px; font-weight: 600; color: var(--text-2); margin-bottom: 5px; }
        .info-text { font-size: 12px; color: var(--text-4); line-height: 1.6; font-weight: 400; }

        .mob-topbar { display: none; position: fixed; top: 0; left: 0; right: 0; z-index: 200; height: 58px; background: var(--bg-2); border-bottom: 1px solid var(--border); padding: 0 16px; align-items: center; justify-content: space-between; }

        @keyframes fadeUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
        .f1 { animation: fadeUp 0.5s ease both; }
        .f2 { animation: fadeUp 0.5s ease 0.08s both; }
        .f3 { animation: fadeUp 0.5s ease 0.16s both; }

        @media (max-width: 768px) {
          .sidebar { display: none; }
          .main { margin-left: 0; padding-top: 58px; }
          .mob-topbar { display: flex; }
          .topbar { display: none; }
          .content { padding: 20px 16px; }
          .form-card { padding: 22px 18px; }
          .page-title { font-size: 24px; }
        }
        @media (max-width: 480px) { .info-grid { grid-template-columns: 1fr; } }
      `}</style>

      {/* MOBILE TOPBAR */}
      <div className="mob-topbar">
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none" }}>
          <img src="/logo.png" style={{ height: "50px", borderRadius: "30px", background: "#ffffff", padding: "2px" }} />
          <span style={{ fontSize: "13px", fontWeight: "700", color: "var(--text)", letterSpacing: "1px", textTransform: "uppercase" }}>AEZIO AI</span>
        </Link>
        <Link href="/dashboard" className="back-btn">← Dashboard</Link>
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
          <Link href="/dashboard/whatsapp-setup" className="sb-link active">
            <span className="sb-link-icon"><img src="/whatsappsvg.png" style={{ height: "16px", width: "16px" }} /></span> WhatsApp Agent
          </Link>
          <Link href="/dashboard/email-setup" className="sb-link"><span className="sb-link-icon">📧</span> Email Agent</Link>
          <Link href="/dashboard/voice-setup" className="sb-link"><span className="sb-link-icon">📞</span> Voice Agent</Link>
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
              <span className="topbar-title">WhatsApp Agent Setup</span>
            </div>
            {existingAgent && (
              <span className="status-badge" style={{ background: existingAgent.is_active ? "rgba(34,197,94,0.1)" : "rgba(245,158,11,0.1)", color: existingAgent.is_active ? "#4ade80" : "#fbbf24", border: `1px solid ${existingAgent.is_active ? "rgba(34,197,94,0.2)" : "rgba(245,158,11,0.2)"}` }}>
                <span className="status-dot" style={{ background: "currentColor" }} />
                {existingAgent.is_active ? "Agent Active" : "Pending Activation"}
              </span>
            )}
          </div>

          <div className="content">
            <div className="page-header f1">
              <div className="page-icon">
                <img src="/whatsappsvg.png" style={{ height: "30px", width: "30px" }} />
              </div>
              <h1 className="page-title">WhatsApp Agent Setup</h1>
              <p className="page-sub">Fill in your business details — your AI agent will use this to reply to customers 24/7 on WhatsApp.</p>
              {existingAgent && (
                <span className="status-badge" style={{ background: existingAgent.is_active ? "rgba(34,197,94,0.1)" : "rgba(245,158,11,0.1)", color: existingAgent.is_active ? "#4ade80" : "#fbbf24", border: `1px solid ${existingAgent.is_active ? "rgba(34,197,94,0.2)" : "rgba(245,158,11,0.2)"}` }}>
                  <span className="status-dot" style={{ background: "currentColor" }} />
                  {existingAgent.is_active ? "Agent is Active" : "Waiting for activation"}
                </span>
              )}
            </div>

            <div className="form-card f2">
              {error && <div className="alert-err">⚠ {error}</div>}
              {saved && <div className="alert-ok">✓ Agent details saved successfully!</div>}

              <div className="form-section-title"><span>🏢</span> Business Information</div>

              <div className="form-group">
                <label className="form-label">Business Name <span>*</span></label>
                <input className="form-input" name="business_name" value={form.business_name} onChange={handleChange} placeholder="e.g. Dr. Sharma Skin Clinic" />
                <p className="form-hint">AI will introduce your business using this name</p>
              </div>

              <div className="form-group">
                <label className="form-label">WhatsApp Business Number <span>*</span></label>
                <input className="form-input" name="whatsapp_number" value={form.whatsapp_number} onChange={handleChange} placeholder="e.g. +919876543210" />
                <p className="form-hint">Include country code (+91 for India)</p>
              </div>

              <div className="form-group">
                <label className="form-label">Business Timings</label>
                <input className="form-input" name="timings" value={form.timings} onChange={handleChange} placeholder="e.g. Mon–Sat 10am–8pm, Sunday Closed" />
                <p className="form-hint">AI will tell customers your working hours</p>
              </div>

              <div className="form-group">
                <label className="form-label">Location / Address</label>
                <input className="form-input" name="location" value={form.location} onChange={handleChange} placeholder="e.g. Near City Mall" />
                <p className="form-hint">AI shares this when customers ask for directions</p>
              </div>

              <div style={{ height: "1px", background: "var(--border)", margin: "24px 0" }} />
              <div className="form-section-title"><span>💼</span> Services & Pricing</div>

              <div className="form-group">
                <label className="form-label">Services Offered</label>
                <textarea className="form-input" name="services" value={form.services} onChange={handleChange} placeholder="e.g. Acne treatment, Hair fall, Skin allergy, Pigmentation" rows={3} />
                <p className="form-hint">List all services — AI answers service-related queries using this</p>
              </div>

              <div className="form-group">
                <label className="form-label">Fees / Pricing</label>
                <textarea className="form-input" name="fees" value={form.fees} onChange={handleChange} placeholder="e.g. Consultation ₹500, Follow-up ₹300" rows={2} />
                <p className="form-hint">AI shares pricing when customers ask</p>
              </div>

              <div style={{ height: "1px", background: "var(--border)", margin: "24px 0" }} />
              <div className="form-section-title"><span>📝</span> Extra Information</div>

              <div className="form-group">
                <label className="form-label">Other Important Information</label>
                <textarea className="form-input" name="extra_info" value={form.extra_info} onChange={handleChange} placeholder="e.g. We accept Cash and UPI. Parking available. Home visits on request." rows={4} />
                <p className="form-hint">Offers, policies, special instructions — anything else for your AI</p>
              </div>

              <button className="save-btn" onClick={handleSave} disabled={saving}>
                {saving ? "Saving..." : existingAgent ? "Update Agent Details →" : "Save & Setup Agent →"}
              </button>
              <p className="save-note">
                After saving, our team activates your agent within 24 hours.<br />
                You'll be notified on your registered email.
              </p>
            </div>

            <div className="info-grid f3">
              {[
                { icon: <img src="/ailogo.jpg" style={{ height: "50px", width: "50px" }} />, title: "Gemini AI Powered", text: "Replies intelligently using your business context" },
                { icon: <img src="/whatsappsvg.png" style={{ height: "40px", width: "40px" }} />, title: "WhatsApp Native", text: "Customers chat on regular WhatsApp — no extra app" },
                { icon: "🌙", title: "Works 24/7", text: "Replies at 2am, on Sundays, on holidays" },
                { icon: "🔒", title: "Secure", text: "All data encrypted and stored securely" },
              ].map((item) => (
                <div key={item.title} className="info-card">
                  <div className="info-icon">{item.icon}</div>
                  <div className="info-title">{item.title}</div>
                  <div className="info-text">{item.text}</div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}