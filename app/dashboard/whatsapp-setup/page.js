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
    business_name: "",
    whatsapp_number: "",
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

      // Check if agent already exists
      const { data } = await supabase
        .from("whatsapp_agents")
        .select("*")
        .eq("user_id", session.user.id)
        .single();

      if (data) {
        setExistingAgent(data);
        setForm({
          business_name: data.business_name || "",
          whatsapp_number: data.whatsapp_number || "",
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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSave = async () => {
    if (!form.business_name.trim()) { setError("Business name required!"); return; }
    if (!form.whatsapp_number.trim()) { setError("WhatsApp number required!"); return; }

    setSaving(true);
    setError("");

    try {
      if (existingAgent) {
        // Update existing
        const { error } = await supabase
          .from("whatsapp_agents")
          .update({ ...form })
          .eq("id", existingAgent.id);

        if (error) throw error;
      } else {
        // Insert new
        const { error } = await supabase
          .from("whatsapp_agents")
          .insert([{ ...form, user_id: user.id, is_active: false }]);

        if (error) throw error;
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);

      // Refresh
      const { data } = await supabase
        .from("whatsapp_agents")
        .select("*")
        .eq("user_id", user.id)
        .single();
      setExistingAgent(data);

    } catch (err) {
      setError(err.message || "Something went wrong!");
    }

    setSaving(false);
  };

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(160deg, #e8f5e1 0%, #c8edb8 100%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "40px", marginBottom: "12px" }}>💬</div>
        <p style={{ color: "#2d5a27", fontFamily: "'DM Sans', sans-serif" }}>Loading...</p>
      </div>
    </div>
  );

  return (
    <>
      <style>{`
        html, body { margin: 0; padding: 0; overflow-x: hidden; }

        .setup-page {
          min-height: 100vh;
          background: linear-gradient(160deg, #e8f5e1 0%, #c8edb8 30%, #a8d890 60%, #c8edb8 100%);
          position: relative;
        }

        .sun-glow {
          position: fixed; top: -80px; left: 50%;
          transform: translateX(-50%);
          width: 600px; height: 300px;
          background: radial-gradient(ellipse, rgba(255,220,80,0.2) 0%, rgba(255,220,80,0) 70%);
          pointer-events: none;
          animation: glowPulse 5s ease-in-out infinite;
        }
        @keyframes glowPulse {
          0%, 100% { opacity: 0.7; } 50% { opacity: 1; }
        }

        .navbar {
          position: sticky; top: 0; z-index: 100;
          display: flex; justify-content: space-between; align-items: center;
          padding: 14px 32px;
          background: rgba(255,255,255,0.5);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255,255,255,0.7);
        }

        .form-card {
          background: rgba(255,255,255,0.7);
          backdrop-filter: blur(16px);
          border: 1.5px solid rgba(255,255,255,0.9);
          border-radius: 24px;
          padding: 36px;
          box-shadow: 0 8px 32px rgba(45,90,39,0.1);
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-label {
          display: block;
          font-size: 13px;
          font-weight: 600;
          color: #1a2e1a;
          margin-bottom: 8px;
          font-family: 'DM Sans', sans-serif;
        }

        .form-label span {
          color: #dc2626;
          margin-left: 2px;
        }

        .form-input {
          width: 100%;
          padding: 12px 16px;
          border-radius: 14px;
          border: 1.5px solid rgba(45,90,39,0.15);
          background: rgba(255,255,255,0.8);
          color: #1a2e1a;
          font-size: 14px;
          font-family: 'DM Sans', sans-serif;
          outline: none;
          transition: all 0.2s;
          box-sizing: border-box;
          resize: vertical;
        }
        .form-input:focus {
          border-color: #4a7c59;
          background: rgba(255,255,255,0.95);
          box-shadow: 0 0 0 3px rgba(74,124,89,0.1);
        }
        .form-input::placeholder { color: #9ca3af; }

        .form-hint {
          font-size: 11px;
          color: #5a7a5a;
          margin-top: 5px;
          font-family: 'DM Sans', sans-serif;
        }

        .save-btn {
          width: 100%;
          padding: 14px;
          border-radius: 14px;
          border: none;
          background: linear-gradient(135deg, #2d5a27, #4a7c59);
          color: white;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          transition: all 0.2s;
          box-shadow: 0 4px 15px rgba(45,90,39,0.25);
        }
        .save-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(45,90,39,0.3); }
        .save-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 14px;
          border-radius: 50px;
          font-size: 12px;
          font-weight: 600;
          font-family: 'DM Sans', sans-serif;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 0.5s ease forwards; }

        @media(max-width: 768px) {
          .navbar { padding: 12px 16px; }
          .setup-content { padding: 20px 16px !important; }
          .form-card { padding: 24px 20px; }
        }
      `}</style>

      <div className="setup-page">
        <div className="sun-glow" />

        {/* Navbar */}
        <nav className="navbar">
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
            <span style={{ fontSize: "26px" }}>🌿</span>
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "24px", fontWeight: "700", color: "#1a2e1a" }}>Vasu Agents</span>
          </Link>
          <Link href="/dashboard" style={{
            display: "flex", alignItems: "center", gap: "6px",
            padding: "8px 18px", borderRadius: "50px",
            background: "rgba(255,255,255,0.7)",
            border: "1.5px solid rgba(255,255,255,0.9)",
            color: "#1a2e1a", fontSize: "13px", fontWeight: "600",
            textDecoration: "none"
          }}>
            ← Dashboard
          </Link>
        </nav>

        {/* Content */}
        <div className="setup-content fade-up" style={{ padding: "40px 32px", maxWidth: "720px", margin: "0 auto" }}>

          {/* Header */}
          <div style={{ marginBottom: "32px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
              <div style={{ width: "48px", height: "48px", background: "rgba(37,211,102,0.15)", borderRadius: "14px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "26px" }}>💬</div>
              <div>
                <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "28px", color: "#1a2e1a", margin: 0 }}>
                  WhatsApp Agent Setup
                </h1>
                <p style={{ color: "#5a7a5a", fontSize: "14px", margin: "3px 0 0" }}>
                  Fill in your business details — AI will use this to reply to customers
                </p>
              </div>
            </div>

            {/* Status */}
            {existingAgent && (
              <div style={{ marginTop: "16px" }}>
                <span className="status-badge" style={{
                  background: existingAgent.is_active ? "rgba(37,211,102,0.12)" : "rgba(255,165,0,0.12)",
                  color: existingAgent.is_active ? "#16a34a" : "#e6900a"
                }}>
                  <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "currentColor", display: "inline-block" }} />
                  {existingAgent.is_active ? "Agent Active" : "Agent Inactive — Waiting for activation"}
                </span>
              </div>
            )}
          </div>

          {/* Form */}
          <div className="form-card">

            {/* Error */}
            {error && (
              <div style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", padding: "12px 16px", borderRadius: "12px", marginBottom: "20px", fontSize: "13px" }}>
                ⚠️ {error}
              </div>
            )}

            {/* Success */}
            {saved && (
              <div style={{ background: "rgba(37,211,102,0.1)", border: "1px solid rgba(37,211,102,0.3)", color: "#16a34a", padding: "12px 16px", borderRadius: "12px", marginBottom: "20px", fontSize: "13px", fontWeight: "600" }}>
                ✅ Agent details saved successfully!
              </div>
            )}

            {/* Business Name */}
            <div className="form-group">
              <label className="form-label">
                Business Name <span>*</span>
              </label>
              <input
                className="form-input"
                name="business_name"
                value={form.business_name}
                onChange={handleChange}
                placeholder="e.g. Dr. Sharma Skin Clinic"
              />
              <p className="form-hint">This is how AI will introduce your business to customers</p>
            </div>

            {/* WhatsApp Number */}
            <div className="form-group">
              <label className="form-label">
                WhatsApp Business Number <span>*</span>
              </label>
              <input
                className="form-input"
                name="whatsapp_number"
                value={form.whatsapp_number}
                onChange={handleChange}
                placeholder="e.g. +919876543210"
              />
              <p className="form-hint">Include country code. This number must be verified on Twilio</p>
            </div>

            {/* Timings */}
            <div className="form-group">
              <label className="form-label">Business Timings</label>
              <input
                className="form-input"
                name="timings"
                value={form.timings}
                onChange={handleChange}
                placeholder="e.g. Monday to Saturday 10am - 8pm, Sunday Closed"
              />
              <p className="form-hint">AI will tell customers when you are open</p>
            </div>

            {/* Services */}
            <div className="form-group">
              <label className="form-label">Services Offered</label>
              <textarea
                className="form-input"
                name="services"
                value={form.services}
                onChange={handleChange}
                placeholder="e.g. Acne treatment, Hair fall, Skin allergy, Pigmentation"
                rows={3}
              />
              <p className="form-hint">List all services — AI will answer service-related queries</p>
            </div>

            {/* Fees */}
            <div className="form-group">
              <label className="form-label">Fees / Pricing</label>
              <textarea
                className="form-input"
                name="fees"
                value={form.fees}
                onChange={handleChange}
                placeholder="e.g. Consultation ₹500, Follow-up ₹300, Facial ₹1000"
                rows={2}
              />
              <p className="form-hint">AI will share pricing when customers ask</p>
            </div>

            {/* Location */}
            <div className="form-group">
              <label className="form-label">Location / Address</label>
              <input
                className="form-input"
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="e.g. Near City Mall, Kota, Rajasthan"
              />
              <p className="form-hint">AI will share this when customers ask for directions</p>
            </div>

            {/* Extra Info */}
            <div className="form-group">
              <label className="form-label">Other Important Information</label>
              <textarea
                className="form-input"
                name="extra_info"
                value={form.extra_info}
                onChange={handleChange}
                placeholder="e.g. We accept Cash and UPI. Parking available. Home visits available on request. WhatsApp booking available."
                rows={4}
              />
              <p className="form-hint">Add anything else you want AI to know — offers, policies, special instructions</p>
            </div>

            {/* Divider */}
            <div style={{ height: "1px", background: "rgba(45,90,39,0.1)", margin: "24px 0" }} />

            {/* Save Button */}
            <button
              className="save-btn"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? "Saving..." : existingAgent ? "💾 Update Agent Details" : "🚀 Save & Setup Agent"}
            </button>

            {/* Note */}
            <p style={{ textAlign: "center", color: "#5a7a5a", fontSize: "12px", marginTop: "16px", lineHeight: "1.6" }}>
              After saving, our team will activate your agent within 24 hours.<br />
              You will be notified on your registered email.
            </p>

          </div>

          {/* Info Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginTop: "24px" }}>
            {[
              { icon: "🤖", title: "AI Powered", desc: "Gemini AI replies to every customer message instantly" },
              { icon: "💬", title: "WhatsApp Native", desc: "Customers chat on their regular WhatsApp — no app needed" },
              { icon: "🌙", title: "24/7 Active", desc: "Agent works day and night — even when you're sleeping" },
              { icon: "🔒", title: "Secure", desc: "All data encrypted and stored securely on our servers" },
            ].map((item) => (
              <div key={item.title} style={{
                background: "rgba(255,255,255,0.6)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(255,255,255,0.8)",
                borderRadius: "16px",
                padding: "18px"
              }}>
                <div style={{ fontSize: "22px", marginBottom: "8px" }}>{item.icon}</div>
                <div style={{ fontSize: "13px", fontWeight: "700", color: "#1a2e1a", marginBottom: "4px" }}>{item.title}</div>
                <div style={{ fontSize: "12px", color: "#5a7a5a", lineHeight: "1.5" }}>{item.desc}</div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </>
  );
}