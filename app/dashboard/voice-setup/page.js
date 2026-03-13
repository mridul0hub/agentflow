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
    business_name: "",
    phone_number: "",
    client_whatsapp: "",
    timings: "",
    services: "",
    fees: "",
    location: "",
    extra_info: "",
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
        setForm({
          business_name: data.business_name || "",
          phone_number: data.phone_number || "",
          client_whatsapp: data.client_whatsapp || "",
          timings: data.timings || "",
          services: data.services || "",
          fees: data.fees || "",
          location: data.location || "",
          extra_info: data.extra_info || "",
        });
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
    <div style={{ minHeight: "100vh", background: "#fafafa", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Geist, sans-serif" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ width: "40px", height: "40px", border: "3px solid #e4e4e7", borderTop: "3px solid #7c3aed", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 16px" }} />
        <p style={{ color: "#71717a", fontSize: "14px" }}>Loading...</p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Geist:wght@300;400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #fafafa; font-family: 'Geist', sans-serif; overflow-x: hidden; }
        :root { --purple: #7c3aed; --purple-soft: #f5f3ff; --purple-dim: #ede9fe; --black: #0a0a0a; --grey-2: #3f3f46; --grey-3: #71717a; --grey-4: #a1a1aa; --grey-6: #e4e4e7; --grey-7: #f4f4f5; --white: #ffffff; }

        .wrap { display: flex; min-height: 100vh; }

        /* SIDEBAR */
        .sidebar { width: 240px; flex-shrink: 0; background: var(--black); display: flex; flex-direction: column; position: fixed; top: 0; left: 0; bottom: 0; z-index: 100; }
        .sb-logo { display: flex; align-items: center; gap: 10px; padding: 20px 20px 0; text-decoration: none; }
        .sb-logo-icon { width: 32px; height: 32px; border-radius: 8px; background: linear-gradient(135deg, var(--purple), #a855f7); display: flex; align-items: center; justify-content: center; font-size: 16px; color: white; flex-shrink: 0; }
        .sb-logo-text { font-size: 14px; font-weight: 600; color: white; letter-spacing: -0.3px; }
        .sb-divider { height: 1px; background: rgba(255,255,255,0.08); margin: 16px 20px; }
        .sb-label { font-size: 10px; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase; color: rgba(255,255,255,0.25); padding: 0 20px 8px; }
        .sb-link { display: flex; align-items: center; gap: 10px; padding: 10px 20px; font-size: 13px; font-weight: 500; color: rgba(255,255,255,0.55); text-decoration: none; transition: all 0.15s; margin: 1px 10px; border-radius: 8px; }
        .sb-link:hover { background: rgba(255,255,255,0.06); color: rgba(255,255,255,0.9); }
        .sb-link.active { background: rgba(124,58,237,0.25); color: white; }
        .sb-link-icon { width: 18px; text-align: center; font-size: 15px; flex-shrink: 0; }
        .sb-bottom { margin-top: auto; padding: 16px 10px; border-top: 1px solid rgba(255,255,255,0.08); }
        .sb-logout { display: flex; align-items: center; gap: 8px; padding: 9px 10px; border-radius: 8px; font-size: 13px; color: rgba(255,100,100,0.7); background: none; border: none; cursor: pointer; font-family: 'Geist', sans-serif; width: 100%; transition: all 0.15s; }
        .sb-logout:hover { background: rgba(255,100,100,0.08); color: #f87171; }

        /* MAIN */
        .main { flex: 1; margin-left: 240px; background: var(--grey-7); min-height: 100vh; }

        /* TOPBAR */
        .topbar { background: var(--white); border-bottom: 1px solid var(--grey-6); padding: 0 32px; height: 60px; display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; z-index: 50; }
        .back-btn { display: flex; align-items: center; gap: 6px; padding: 7px 14px; border-radius: 8px; border: 1px solid var(--grey-6); background: var(--white); font-size: 13px; font-weight: 500; color: var(--grey-2); text-decoration: none; transition: all 0.15s; }
        .back-btn:hover { background: var(--grey-7); }
        .topbar-title { font-size: 15px; font-weight: 600; color: var(--black); }

        /* CONTENT */
        .content { padding: 32px; max-width: 760px; }

        /* PAGE HEADER */
        .page-icon { width: 52px; height: 52px; border-radius: 14px; background: rgba(124,58,237,0.1); display: flex; align-items: center; justify-content: center; font-size: 26px; margin-bottom: 16px; }
        .page-title { font-family: 'Instrument Serif', serif; font-size: 32px; color: var(--black); letter-spacing: -0.8px; margin-bottom: 6px; }
        .page-sub { font-size: 14px; color: var(--grey-3); line-height: 1.6; }
        .status-badge { display: inline-flex; align-items: center; gap: 7px; padding: 6px 14px; border-radius: 50px; font-size: 12px; font-weight: 600; margin-top: 14px; }

        /* HOW IT WORKS BANNER */
        .how-banner { background: var(--black); border-radius: 16px; padding: 20px 24px; margin-bottom: 20px; display: flex; gap: 32px; flex-wrap: wrap; }
        .how-step { display: flex; align-items: flex-start; gap: 10px; flex: 1; min-width: 160px; }
        .how-num { width: 26px; height: 26px; border-radius: 50%; background: rgba(124,58,237,0.4); border: 1px solid rgba(124,58,237,0.6); display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; color: #a78bfa; flex-shrink: 0; margin-top: 1px; }
        .how-text { font-size: 12px; color: rgba(255,255,255,0.55); line-height: 1.6; }
        .how-text strong { color: white; display: block; margin-bottom: 2px; font-size: 13px; }

        /* FORM */
        .form-card { background: var(--white); border: 1px solid var(--grey-6); border-radius: 20px; padding: 32px; margin-bottom: 16px; }
        .form-section-title { font-size: 13px; font-weight: 600; color: var(--black); margin-bottom: 18px; padding-bottom: 12px; border-bottom: 1px solid var(--grey-6); display: flex; align-items: center; gap: 8px; }
        .form-group { margin-bottom: 18px; }
        .form-label { display: block; font-size: 13px; font-weight: 500; color: var(--grey-2); margin-bottom: 6px; }
        .form-label span { color: #dc2626; margin-left: 2px; }
        .form-input { width: 100%; padding: 11px 14px; border-radius: 10px; border: 1px solid var(--grey-6); background: var(--white); color: var(--black); font-size: 14px; font-family: 'Geist', sans-serif; outline: none; transition: all 0.15s; resize: vertical; }
        .form-input:focus { border-color: var(--purple); box-shadow: 0 0 0 3px rgba(124,58,237,0.1); }
        .form-input::placeholder { color: var(--grey-4); }
        .form-hint { font-size: 11px; color: var(--grey-4); margin-top: 5px; line-height: 1.5; }

        /* ALERTS */
        .alert-err { background: #fef2f2; border: 1px solid #fecaca; color: #dc2626; padding: 11px 14px; border-radius: 10px; margin-bottom: 20px; font-size: 13px; }
        .alert-ok { background: #f0fdf4; border: 1px solid #bbf7d0; color: #16a34a; padding: 11px 14px; border-radius: 10px; margin-bottom: 20px; font-size: 13px; font-weight: 600; }
        .alert-info { background: var(--purple-soft); border: 1px solid var(--purple-dim); color: var(--purple); padding: 11px 14px; border-radius: 10px; margin-bottom: 20px; font-size: 13px; }

        /* SAVE BTN */
        .save-btn { width: 100%; padding: 13px; border-radius: 11px; border: none; background: var(--black); color: white; font-size: 14px; font-weight: 600; cursor: pointer; font-family: 'Geist', sans-serif; transition: all 0.2s; margin-top: 4px; }
        .save-btn:hover:not(:disabled) { background: #1a1a1a; transform: translateY(-1px); box-shadow: 0 4px 14px rgba(0,0,0,0.15); }
        .save-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        /* INFO CARDS */
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .info-card { background: var(--white); border: 1px solid var(--grey-6); border-radius: 14px; padding: 18px; transition: all 0.2s; }
        .info-card:hover { border-color: var(--purple-dim); background: var(--purple-soft); }

        /* MOBILE */
        .mob-topbar { display: none; position: fixed; top: 0; left: 0; right: 0; z-index: 200; height: 56px; background: var(--white); border-bottom: 1px solid var(--grey-6); padding: 0 16px; align-items: center; justify-content: space-between; }

        @keyframes fadeUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
        .f1 { animation: fadeUp 0.5s ease both; }
        .f2 { animation: fadeUp 0.5s ease 0.08s both; }
        .f3 { animation: fadeUp 0.5s ease 0.16s both; }
        .f4 { animation: fadeUp 0.5s ease 0.24s both; }

        @media (max-width: 768px) {
          .sidebar { display: none; }
          .main { margin-left: 0; padding-top: 56px; }
          .mob-topbar { display: flex; }
          .topbar { display: none; }
          .content { padding: 20px 16px; }
          .form-card { padding: 22px 18px; }
          .page-title { font-size: 26px; }
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
          <img src="/logo.png" style={{ height: "30px", width: "30px", borderRadius: "8px", background: "transparent", mixBlendMode: "multiply" }} />
          <span style={{ fontSize: "14px", fontWeight: "600", color: "var(--black)" }}>Soni AI Agents</span>
        </Link>
        <Link href="/dashboard" className="back-btn">← Dashboard</Link>
      </div>

      <div className="wrap">
        {/* SIDEBAR */}
        <aside className="sidebar">
          <Link href="/" className="sb-logo">
            <img src="/logo.png" style={{ height: "30px", width: "30px", borderRadius: "8px", background: "transparent", mixBlendMode: "multiply" }} />
            <span className="sb-logo-text">Soni AI Agents</span>
          </Link>
          <div className="sb-divider" />
          <div className="sb-label">Overview</div>
          <Link href="/dashboard" className="sb-link"><span className="sb-link-icon">⊞</span> Dashboard</Link>
          <div style={{ marginTop: "12px" }} />
          <div className="sb-label">Agents</div>
          <Link href="/dashboard/whatsapp-setup" className="sb-link"><img src="/whatsappsvg.png" style={{ height: "20px", width: "20px"}} /> WhatsApp Agent</Link>
          <Link href="/dashboard/email-setup" className="sb-link"><span className="sb-link-icon">📧</span> Email Agent</Link>
          <Link href="/dashboard/voice-setup" className="sb-link active"><span className="sb-link-icon">📞</span> Voice Agent</Link>
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
          {/* TOPBAR */}
          <div className="topbar">
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <Link href="/dashboard" className="back-btn">← Dashboard</Link>
              <span style={{ color: "var(--grey-4)", fontSize: "14px" }}>/</span>
              <span className="topbar-title">Voice Agent Setup</span>
            </div>
            {existingAgent && (
              <span className="status-badge" style={{ background: existingAgent.is_active ? "rgba(34,197,94,0.1)" : "rgba(245,158,11,0.1)", color: existingAgent.is_active ? "#16a34a" : "#d97706" }}>
                <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "currentColor", display: "inline-block" }} />
                {existingAgent.is_active ? "Agent Active" : "Pending Activation"}
              </span>
            )}
          </div>

          {/* CONTENT */}
          <div className="content">

            {/* PAGE HEADER */}
            <div style={{ marginBottom: "24px" }} className="f1">
              <div className="page-icon">📞</div>
              <h1 className="page-title">Voice Agent Setup</h1>
              <p className="page-sub">Your AI agent will automatically answer customer calls, give information, and book appointments — 24/7.</p>
              {existingAgent && (
                <span className="status-badge" style={{ background: existingAgent.is_active ? "rgba(34,197,94,0.1)" : "rgba(245,158,11,0.1)", color: existingAgent.is_active ? "#16a34a" : "#d97706" }}>
                  <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "currentColor", display: "inline-block" }} />
                  {existingAgent.is_active ? "Agent is Active" : "Waiting for activation"}
                </span>
              )}
            </div>

            {/* HOW IT WORKS */}
            <div className="how-banner f2">
              {[
                { n: "1", title: "Fill the form", text: "Add your business info below" },
                { n: "2", title: "We assign a number", text: "Dedicated Indian phone number for your business" },
                { n: "3", title: "Customers call", text: "AI answers, informs & books appointments" },
                { n: "4", title: "You get alerts", text: "Scam calls detected — instant WhatsApp alert to you" },
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
              <div className="alert-info">💡 After saving, our team will assign a dedicated Indian phone number and activate your agent within 24 hours.</div>

              <div className="form-section-title"><span>🏢</span> Business Information</div>

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
                <input className="form-input" name="location" value={form.location} onChange={handleChange} placeholder="e.g. Near City Mall, Kota, Rajasthan" />
              </div>

              <div style={{ height: "1px", background: "var(--grey-6)", margin: "22px 0" }} />
              <div className="form-section-title"><span>💼</span> Services & Pricing</div>

              <div className="form-group">
                <label className="form-label">Services Offered</label>
                <textarea className="form-input" name="services" value={form.services} onChange={handleChange} placeholder="e.g. Acne treatment, Hair fall, Skin allergy, Pigmentation" rows={3} />
                <p className="form-hint">AI will answer service questions using this</p>
              </div>

              <div className="form-group">
                <label className="form-label">Fees / Pricing</label>
                <textarea className="form-input" name="fees" value={form.fees} onChange={handleChange} placeholder="e.g. Consultation ₹500, Follow-up ₹300" rows={2} />
              </div>

              <div style={{ height: "1px", background: "var(--grey-6)", margin: "22px 0" }} />
              <div className="form-section-title"><span>📝</span> Extra Information</div>

              <div className="form-group">
                <label className="form-label">Other Important Information</label>
                <textarea className="form-input" name="extra_info" value={form.extra_info} onChange={handleChange} placeholder="e.g. We accept Cash and UPI. Parking available. Home visits on request." rows={4} />
                <p className="form-hint">Anything else you want your AI to tell callers</p>
              </div>

              <button className="save-btn" onClick={handleSave} disabled={saving}>
                {saving ? "Saving..." : existingAgent ? "Update Voice Agent →" : "Save & Request Activation →"}
              </button>
              <p style={{ textAlign: "center", color: "var(--grey-4)", fontSize: "12px", marginTop: "14px", lineHeight: "1.6" }}>
                We'll assign a dedicated Indian phone number and activate within 24 hours.<br />
                You'll be notified on your registered email.
              </p>
            </div>

            {/* INFO CARDS */}
            <div className="info-grid f4">
              {[
                { icon: "📞", title: "Indian Phone Number", text: "Dedicated number assigned — customers pay normal call rates" },
                { icon: <img src="/ailogo.png" style={{ height: "20px", width: "20px"}} />, title: "Gemini AI Powered", text: "Natural Hinglish conversation — sounds human" },
                { icon: "📅", title: "Auto Appointments", text: "Books appointments directly — saves to your dashboard" },
                { icon: "⚠️", title: "Scam Detection", text: "Suspicious calls flagged — instant WhatsApp alert to you" },
              ].map((item) => (
                <div key={item.title} className="info-card">
                  <div style={{ fontSize: "22px", marginBottom: "10px" }}>{item.icon}</div>
                  <div style={{ fontSize: "13px", fontWeight: "600", color: "var(--black)", marginBottom: "4px" }}>{item.title}</div>
                  <div style={{ fontSize: "12px", color: "var(--grey-3)", lineHeight: "1.6" }}>{item.text}</div>
                </div>
              ))}
            </div>

          </div>
        </main>
      </div>
    </>
  );
}