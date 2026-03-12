"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import AuthModal from "../components/AuthModal";

export default function PricingPage() {
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [authTab, setAuthTab] = useState("login");
  const [billing, setBilling] = useState("monthly");

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };
    getUser();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => { subscription.unsubscribe(); window.removeEventListener("scroll", handleScroll); };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setShowDropdown(false);
  };

  const openAuth = (tab) => { setAuthTab(tab); setShowAuth(true); };

  const firstName = user?.user_metadata?.full_name?.split(" ")[0] || user?.email?.split("@")[0] || "";
  const avatarUrl = user?.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.user_metadata?.full_name || user?.email || "U")}&background=7c3aed&color=fff&size=32`;

  const plans = [
    {
      name: "WhatsApp Agent",
      icon: "💬",
      desc: "AI agent that replies to your customers on WhatsApp — 24/7, instantly.",
      monthlyPrice: 1999,
      yearlyPrice: 17990,
      tag: "Most Popular",
      tagColor: "#25D366",
      featured: false,
      features: [
        "Auto-replies 24/7",
        "Answers FAQs instantly",
        "Books appointments",
        "Hindi & English support",
        "Full chat history",
        "Business profile setup",
        "1-day free trial",
        "Activate within 24 hours",
      ],
      cta: "Start WhatsApp Agent",
      slug: "whatsapp-setup",
    },
    {
      name: "WhatsApp + Email",
      icon: "✦",
      desc: "Get both agents — maximum coverage, best value for growing businesses.",
      monthlyPrice: 2699,
      yearlyPrice: 23990,
      tag: "Best Value",
      tagColor: "#7c3aed",
      featured: true,
      features: [
        "Everything in WhatsApp Agent",
        "Email Agent included",
        "Instant email replies",
        "Professional email tone",
        "Works with any Gmail",
        "Email conversation history",
        "Priority activation",
        "Dedicated support",
      ],
      cta: "Get Both Agents",
      slug: "whatsapp-setup",
    },
    {
      name: "Email Agent",
      icon: "📧",
      desc: "AI agent that replies to every customer email professionally and instantly.",
      monthlyPrice: 999,
      yearlyPrice: 8990,
      tag: null,
      tagColor: null,
      featured: false,
      features: [
        "Instant email replies",
        "Professional tone always",
        "Works with Gmail",
        "Full email history",
        "Business context aware",
        "Custom knowledge base",
        "1-day free trial",
        "Activate within 24 hours",
      ],
      cta: "Start Email Agent",
      slug: "email-setup",
    },
  ];

  const faqs = [
    { q: "Do I need any technical knowledge?", a: "None at all. Just fill a simple form about your business — timings, services, pricing, location. Our team sets everything up within 24 hours." },
    { q: "How does the 1-day free trial work?", a: "Sign up, fill in your business details, and we activate your agent for 1 full day at no cost. If you like it, you can subscribe. No credit card needed upfront." },
    { q: "Will customers see my business name and photo?", a: "Yes. Your AI agent uses your actual WhatsApp Business number or email, so customers see your brand — not ours. Full trust maintained." },
    { q: "Can I cancel anytime?", a: "Yes, monthly plans can be cancelled anytime. Yearly plans are billed once and run for the full year." },
    { q: "What if my business needs change?", a: "You can update your agent's knowledge base anytime — new timings, new services, new pricing. Just contact us and we update it within 24 hours." },
    { q: "Is my data secure?", a: "Yes. All your business data and customer conversations are stored securely. We never share your data with anyone." },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Geist:wght@300;400;500;600;700&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { background: #fafafa; color: #0a0a0a; font-family: 'Geist', sans-serif; overflow-x: hidden; }

        :root {
          --purple: #7c3aed; --purple-light: #8b5cf6;
          --purple-soft: #f5f3ff; --purple-dim: #ede9fe;
          --black: #0a0a0a; --grey-1: #18181b; --grey-2: #3f3f46;
          --grey-3: #71717a; --grey-4: #a1a1aa; --grey-5: #d4d4d8;
          --grey-6: #e4e4e7; --grey-7: #f4f4f5; --white: #ffffff;
        }

        /* NAVBAR */
        .nb { position: fixed; top: 0; left: 0; right: 0; z-index: 200; height: 60px; display: flex; align-items: center; justify-content: space-between; padding: 0 32px; transition: all 0.3s; }
        .nb.s { background: rgba(250,250,250,0.92); backdrop-filter: blur(20px); border-bottom: 1px solid var(--grey-6); }
        .nb-logo { display: flex; align-items: center; gap: 10px; text-decoration: none; flex-shrink: 0; }
        .nb-logo-icon { width: 32px; height: 32px; border-radius: 8px; background: linear-gradient(135deg, var(--purple), #a855f7); display: flex; align-items: center; justify-content: center; font-size: 16px; color: white; flex-shrink: 0; }
        .nb-logo-text { font-size: 15px; font-weight: 600; color: var(--black); letter-spacing: -0.3px; white-space: nowrap; }
        .nb-links { display: flex; align-items: center; gap: 4px; }
        .nb-link { padding: 6px 14px; border-radius: 8px; font-size: 14px; font-weight: 500; color: var(--grey-2); text-decoration: none; transition: all 0.15s; }
        .nb-link:hover { background: var(--grey-7); color: var(--black); }
        .nb-link.active { color: var(--black); background: var(--grey-7); }
        .nb-actions { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }
        .btn-ghost { padding: 7px 16px; border-radius: 8px; border: none; background: transparent; font-size: 14px; font-weight: 500; color: var(--grey-2); cursor: pointer; font-family: 'Geist', sans-serif; }
        .btn-ghost:hover { background: var(--grey-7); }
        .btn-dark { padding: 7px 16px; border-radius: 8px; border: none; background: var(--black); font-size: 14px; font-weight: 500; color: white; cursor: pointer; font-family: 'Geist', sans-serif; transition: all 0.2s; }
        .btn-dark:hover { background: var(--grey-1); }

        .hb { display: none; flex-direction: column; gap: 5px; background: none; border: none; cursor: pointer; padding: 6px; }
        .hb span { display: block; width: 22px; height: 2px; background: var(--black); border-radius: 2px; transition: all 0.25s; }
        .hb.open span:nth-child(1) { transform: rotate(45deg) translate(5px, 5px); }
        .hb.open span:nth-child(2) { opacity: 0; }
        .hb.open span:nth-child(3) { transform: rotate(-45deg) translate(5px, -5px); }

        .mob-menu { display: none; position: fixed; top: 60px; left: 0; right: 0; background: #fff; border-bottom: 1px solid var(--grey-6); padding: 12px 16px 20px; z-index: 199; flex-direction: column; gap: 4px; box-shadow: 0 8px 24px rgba(0,0,0,0.08); }
        .mob-menu.open { display: flex; }
        .mob-link { padding: 12px 16px; border-radius: 10px; font-size: 15px; font-weight: 500; color: var(--black); text-decoration: none; display: block; background: none; border: none; cursor: pointer; font-family: 'Geist', sans-serif; text-align: left; width: 100%; transition: background 0.15s; }
        .mob-link:hover { background: var(--grey-7); }
        .mob-divider { height: 1px; background: var(--grey-6); margin: 6px 0; }
        .mob-btn { width: 100%; padding: 13px; border-radius: 10px; background: var(--black); color: white; border: none; font-size: 15px; font-weight: 600; cursor: pointer; font-family: 'Geist', sans-serif; margin-top: 4px; }

        .av-btn { display: flex; align-items: center; gap: 8px; background: var(--white); border: 1px solid var(--grey-6); border-radius: 8px; padding: 5px 12px 5px 6px; cursor: pointer; }
        .av-img { width: 28px; height: 28px; border-radius: 6px; object-fit: cover; }
        .av-name { font-size: 13px; font-weight: 500; color: var(--black); white-space: nowrap; }
        .dropdown { position: absolute; top: 44px; right: 0; background: var(--white); border-radius: 14px; padding: 6px; box-shadow: 0 8px 32px rgba(0,0,0,0.12); min-width: 180px; z-index: 300; border: 1px solid var(--grey-6); }
        .dd-email { padding: 8px 12px 10px; font-size: 11px; color: var(--grey-4); border-bottom: 1px solid var(--grey-6); margin-bottom: 4px; }
        .dd-item { display: block; width: 100%; text-align: left; padding: 9px 12px; border-radius: 8px; font-size: 13px; background: transparent; border: none; cursor: pointer; font-family: 'Geist', sans-serif; color: var(--black); text-decoration: none; transition: background 0.15s; }
        .dd-item:hover { background: var(--grey-7); }

        /* PAGE */
        .page { padding-top: 60px; }

        /* HERO */
        .p-hero { background: linear-gradient(135deg, #0a0a0a 0%, #1a0a2e 100%); padding: 80px 24px; text-align: center; position: relative; overflow: hidden; }
        .p-hero-grid { position: absolute; inset: 0; background-image: linear-gradient(rgba(124,58,237,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(124,58,237,0.06) 1px, transparent 1px); background-size: 40px 40px; }
        .p-hero-glow { position: absolute; inset: 0; background: radial-gradient(ellipse 80% 60% at 50% -10%, rgba(124,58,237,0.35) 0%, transparent 70%); }
        .p-hero-inner { position: relative; z-index: 1; max-width: 600px; margin: 0 auto; }
        .p-tag { font-size: 12px; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase; color: #a78bfa; margin-bottom: 16px; display: block; }
        .p-title { font-family: 'Instrument Serif', serif; font-size: clamp(36px, 6vw, 60px); font-weight: 400; color: white; line-height: 1.1; letter-spacing: -1.5px; margin-bottom: 16px; }
        .p-title em { font-style: italic; color: #a78bfa; }
        .p-sub { font-size: clamp(14px, 2vw, 16px); color: rgba(255,255,255,0.5); line-height: 1.7; margin-bottom: 32px; }

        /* BILLING TOGGLE */
        .billing { display: inline-flex; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.12); border-radius: 12px; padding: 4px; }
        .b-btn { padding: 9px 22px; border-radius: 9px; border: none; font-size: 14px; font-weight: 500; cursor: pointer; font-family: 'Geist', sans-serif; background: transparent; color: rgba(255,255,255,0.5); transition: all 0.2s; white-space: nowrap; }
        .b-btn.on { background: white; color: var(--black); box-shadow: 0 2px 8px rgba(0,0,0,0.2); }
        .yr-badge { font-size: 10px; background: #dcfce7; color: #16a34a; padding: 2px 7px; border-radius: 50px; margin-left: 6px; font-weight: 700; }

        /* PRICING CARDS */
        .pricing-sec { padding: 80px 24px; background: var(--grey-7); }
        .pricing-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; max-width: 1020px; margin: 0 auto; }

        .pc { background: var(--white); border: 1px solid var(--grey-6); border-radius: 24px; padding: 32px; transition: all 0.25s; position: relative; display: flex; flex-direction: column; }
        .pc:hover { transform: translateY(-4px); box-shadow: 0 20px 48px rgba(0,0,0,0.1); }
        .pc.featured { background: var(--black); border-color: var(--black); transform: scale(1.02); box-shadow: 0 20px 60px rgba(0,0,0,0.25); }
        .pc.featured:hover { transform: scale(1.02) translateY(-4px); }

        .pc-tag { display: inline-block; padding: 3px 11px; border-radius: 50px; font-size: 11px; font-weight: 600; color: white; margin-bottom: 20px; align-self: flex-start; }
        .pc-icon { font-size: 28px; margin-bottom: 14px; }
        .pc-name { font-size: 16px; font-weight: 600; color: var(--black); margin-bottom: 8px; }
        .pc.featured .pc-name { color: white; }
        .pc-desc { font-size: 13px; color: var(--grey-3); line-height: 1.65; margin-bottom: 24px; }
        .pc.featured .pc-desc { color: rgba(255,255,255,0.5); }

        .pc-price { margin-bottom: 6px; display: flex; align-items: baseline; gap: 3px; }
        .pc-amount { font-family: 'Instrument Serif', serif; font-size: 44px; color: var(--black); line-height: 1; }
        .pc.featured .pc-amount { color: white; }
        .pc-period { font-size: 14px; color: var(--grey-4); }
        .pc.featured .pc-period { color: rgba(255,255,255,0.4); }
        .pc-savings { font-size: 12px; color: #16a34a; font-weight: 600; margin-bottom: 24px; min-height: 18px; }
        .pc.featured .pc-savings { color: #86efac; }

        .pc-divider { height: 1px; background: var(--grey-6); margin-bottom: 22px; }
        .pc.featured .pc-divider { background: rgba(255,255,255,0.1); }

        .pc-feats { display: flex; flex-direction: column; gap: 10px; margin-bottom: 28px; flex: 1; }
        .pc-feat { display: flex; align-items: flex-start; gap: 10px; font-size: 13px; color: var(--grey-2); }
        .pc.featured .pc-feat { color: rgba(255,255,255,0.8); }
        .pc-check { color: var(--purple); font-size: 13px; margin-top: 1px; flex-shrink: 0; }
        .pc.featured .pc-check { color: #a78bfa; }

        .pc-btn { width: 100%; padding: 13px; border-radius: 11px; font-size: 14px; font-weight: 600; cursor: pointer; font-family: 'Geist', sans-serif; transition: all 0.2s; border: 1px solid var(--grey-6); background: var(--grey-7); color: var(--black); }
        .pc-btn:hover { background: var(--grey-6); transform: translateY(-1px); }
        .pc-btn.featured { background: var(--purple); color: white; border-color: var(--purple); box-shadow: 0 4px 16px rgba(124,58,237,0.4); }
        .pc-btn.featured:hover { background: var(--purple-light); }

        /* COMPARE */
        .compare-sec { padding: 80px 24px; }
        .con { max-width: 900px; margin: 0 auto; }
        .sec-tag { font-size: 12px; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase; color: var(--purple); margin-bottom: 12px; display: block; }
        .sec-title { font-family: 'Instrument Serif', serif; font-size: clamp(28px, 4vw, 44px); font-weight: 400; line-height: 1.1; letter-spacing: -0.8px; color: var(--black); margin-bottom: 40px; }
        .sec-title em { font-style: italic; color: var(--purple); }

        .compare-table { width: 100%; border-collapse: collapse; background: var(--white); border-radius: 16px; overflow: hidden; border: 1px solid var(--grey-6); }
        .ct-head { background: var(--grey-7); }
        .ct-head th { padding: 16px 20px; font-size: 13px; font-weight: 600; color: var(--black); text-align: left; border-bottom: 1px solid var(--grey-6); }
        .ct-head th:not(:first-child) { text-align: center; }
        .ct-row td { padding: 14px 20px; font-size: 13px; color: var(--grey-2); border-bottom: 1px solid var(--grey-6); }
        .ct-row:last-child td { border-bottom: none; }
        .ct-row td:not(:first-child) { text-align: center; }
        .ct-row:hover td { background: var(--grey-7); }
        .ct-yes { color: var(--purple); font-size: 16px; }
        .ct-no { color: var(--grey-5); font-size: 16px; }
        .ct-feat { font-weight: 500; color: var(--black); }

        /* FAQ */
        .faq-sec { padding: 80px 24px; background: var(--grey-7); }
        .faq-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-top: 44px; }
        .faq-card { background: var(--white); border: 1px solid var(--grey-6); border-radius: 16px; padding: 24px; transition: all 0.2s; }
        .faq-card:hover { border-color: var(--purple-dim); }
        .faq-q { font-size: 14px; font-weight: 600; color: var(--black); margin-bottom: 10px; }
        .faq-a { font-size: 13px; color: var(--grey-3); line-height: 1.7; }

        /* CTA */
        .cta { background: var(--black); padding: 96px 24px; text-align: center; }
        .cta-t { font-family: 'Instrument Serif', serif; font-size: clamp(30px, 5vw, 56px); color: white; line-height: 1.1; letter-spacing: -1.5px; margin-bottom: 16px; }
        .cta-t em { font-style: italic; color: #a78bfa; }
        .cta-s { font-size: 16px; color: rgba(255,255,255,0.5); margin-bottom: 36px; max-width: 440px; margin-left: auto; margin-right: auto; line-height: 1.65; }
        .btn-cta { padding: 14px 36px; border-radius: 10px; background: white; color: var(--black); font-size: 15px; font-weight: 600; border: none; cursor: pointer; font-family: 'Geist', sans-serif; transition: all 0.2s; text-decoration: none; display: inline-block; }
        .btn-cta:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(255,255,255,0.2); }

        /* FOOTER */
        .ft { background: var(--grey-7); border-top: 1px solid var(--grey-6); padding: 32px 24px; }
        .ft-bot { max-width: 900px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px; }
        .ft-copy { font-size: 13px; color: var(--grey-4); }

        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        .f1 { animation: fadeUp 0.6s ease both; }
        .f2 { animation: fadeUp 0.6s ease 0.1s both; }

        /* RESPONSIVE */
        @media (max-width: 900px) {
          .nb { padding: 0 20px; }
          .nb-links { display: none; }
          .btn-ghost { display: none; }
          .hb { display: flex; }
          .pricing-grid { grid-template-columns: 1fr; max-width: 480px; }
          .pc.featured { transform: scale(1); }
          .pc.featured:hover { transform: translateY(-4px); }
          .faq-grid { grid-template-columns: 1fr; }
          .compare-table { font-size: 12px; }
          .ct-head th, .ct-row td { padding: 12px 14px; }
        }

        @media (max-width: 600px) {
          .nb { padding: 0 14px; height: 54px; }
          .nb-logo-text { font-size: 14px; }
          .btn-dark { padding: 6px 12px; font-size: 13px; }
          .mob-menu { top: 54px; }

          .p-hero { padding: 60px 16px; }
          .billing { width: 100%; justify-content: center; }
          .b-btn { flex: 1; text-align: center; }

          .pricing-sec { padding: 56px 16px; }
          .pricing-grid { max-width: 100%; }
          .pc { padding: 24px 20px; }

          .compare-sec { padding: 56px 16px; }
          .compare-table { display: none; }

          .faq-sec { padding: 56px 16px; }
          .faq-card { padding: 18px 16px; }

          .cta { padding: 72px 16px; }
          .ft { padding: 24px 16px; }
          .ft-bot { flex-direction: column; text-align: center; }
        }
      `}</style>

      {/* NAVBAR */}
      <nav className={`nb ${scrolled ? "s" : ""}`}>
        <Link href="/" className="nb-logo">
          <div className="nb-logo-icon">✦</div>
          <span className="nb-logo-text">Soni AI Agents</span>
        </Link>
        <div className="nb-links">
          <Link href="/" className="nb-link">Home</Link>
          <Link href="/about" className="nb-link">About</Link>
          <Link href="/pricing" className="nb-link active">Pricing</Link>
        </div>
        <div className="nb-actions">
          {user ? (
            <div style={{ position: "relative" }}>
              <button className="av-btn" onClick={() => setShowDropdown(!showDropdown)}>
                <img className="av-img" src={avatarUrl} alt="avatar" />
                <span className="av-name">{firstName}</span>
                <span style={{ fontSize: "10px", color: "var(--grey-4)" }}>▼</span>
              </button>
              {showDropdown && (
                <div className="dropdown">
                  <div className="dd-email">{user.email}</div>
                  <Link href="/dashboard" className="dd-item" onClick={() => setShowDropdown(false)}>Dashboard</Link>
                  <button className="dd-item" style={{ color: "#dc2626" }} onClick={handleLogout}>Logout</button>
                </div>
              )}
            </div>
          ) : (
            <>
              <button className="btn-ghost" onClick={() => openAuth("login")}>Login</button>
              <button className="btn-dark" onClick={() => openAuth("signup")}>Get Started</button>
            </>
          )}
          <button className={`hb ${mobileMenu ? "open" : ""}`} onClick={() => setMobileMenu(!mobileMenu)}>
            <span /><span /><span />
          </button>
        </div>
      </nav>

      {/* MOBILE MENU */}
      <div className={`mob-menu ${mobileMenu ? "open" : ""}`}>
        <Link href="/" className="mob-link" onClick={() => setMobileMenu(false)}>Home</Link>
        <Link href="/about" className="mob-link" onClick={() => setMobileMenu(false)}>About</Link>
        <Link href="/pricing" className="mob-link" onClick={() => setMobileMenu(false)}>Pricing</Link>
        <div className="mob-divider" />
        {user ? (
          <>
            <Link href="/dashboard" className="mob-link" onClick={() => setMobileMenu(false)}>Dashboard</Link>
            <button className="mob-link" style={{ color: "#dc2626" }} onClick={() => { handleLogout(); setMobileMenu(false); }}>Logout</button>
          </>
        ) : (
          <>
            <button className="mob-link" onClick={() => { openAuth("login"); setMobileMenu(false); }}>Login</button>
            <button className="mob-btn" onClick={() => { openAuth("signup"); setMobileMenu(false); }}>Get Started Free</button>
          </>
        )}
      </div>

      <div className="page">

        {/* HERO */}
        <div className="p-hero">
          <div className="p-hero-grid" />
          <div className="p-hero-glow" />
          <div className="p-hero-inner f1">
            <span className="p-tag">✦ Pricing</span>
            <h1 className="p-title">Simple pricing,<br /><em>per agent</em></h1>
            <p className="p-sub">Pay only for the agents you need. No hidden fees, no setup charges. Cancel anytime.</p>
            <div className="billing">
              <button className={`b-btn ${billing === "monthly" ? "on" : ""}`} onClick={() => setBilling("monthly")}>Monthly</button>
              <button className={`b-btn ${billing === "yearly" ? "on" : ""}`} onClick={() => setBilling("yearly")}>
                Yearly <span className="yr-badge">3 months free</span>
              </button>
            </div>
          </div>
        </div>

        {/* PRICING CARDS */}
        <section className="pricing-sec">
          <div className="pricing-grid f2">
            {plans.map((plan) => {
              const price = billing === "monthly" ? plan.monthlyPrice : plan.yearlyPrice;
              const period = billing === "monthly" ? "/month" : "/year";
              const savings = billing === "yearly" ? `Save ₹${(plan.monthlyPrice * 12 - plan.yearlyPrice).toLocaleString()} vs monthly` : "";
              return (
                <div key={plan.name} className={`pc ${plan.featured ? "featured" : ""}`}>
                  {plan.tag && <span className="pc-tag" style={{ background: plan.tagColor }}>{plan.tag}</span>}
                  <div className="pc-icon">{plan.icon}</div>
                  <div className="pc-name">{plan.name}</div>
                  <p className="pc-desc">{plan.desc}</p>
                  <div className="pc-price">
                    <span className="pc-amount">₹{price.toLocaleString()}</span>
                    <span className="pc-period">{period}</span>
                  </div>
                  <div className="pc-savings">{savings}</div>
                  <div className="pc-divider" />
                  <div className="pc-feats">
                    {plan.features.map((f) => (
                      <div key={f} className="pc-feat">
                        <span className="pc-check">✓</span>
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                  <button
                    className={`pc-btn ${plan.featured ? "featured" : ""}`}
                    onClick={() => user ? window.location.href = `/dashboard/${plan.slug}` : openAuth("signup")}
                  >
                    {plan.cta} →
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        {/* COMPARE TABLE */}
        <section className="compare-sec">
          <div className="con">
            <span className="sec-tag">✦ Compare</span>
            <h2 className="sec-title">What's included in<br /><em>each plan</em></h2>
            <table className="compare-table">
              <thead className="ct-head">
                <tr>
                  <th>Feature</th>
                  <th>WhatsApp Agent</th>
                  <th>Email Agent</th>
                  <th>Both Agents</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Auto-replies 24/7", true, true, true],
                  ["Hindi & English support", true, false, true],
                  ["WhatsApp Business number", true, false, true],
                  ["Email replies", false, true, true],
                  ["Appointment booking", true, false, true],
                  ["Custom knowledge base", true, true, true],
                  ["Full chat/email history", true, true, true],
                  ["1-day free trial", true, true, true],
                  ["Priority support", false, false, true],
                  ["Activate within 24 hours", true, true, true],
                ].map(([feat, wa, em, both]) => (
                  <tr key={feat} className="ct-row">
                    <td className="ct-feat">{feat}</td>
                    <td>{wa ? <span className="ct-yes">✓</span> : <span className="ct-no">–</span>}</td>
                    <td>{em ? <span className="ct-yes">✓</span> : <span className="ct-no">–</span>}</td>
                    <td>{both ? <span className="ct-yes">✓</span> : <span className="ct-no">–</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* FAQ */}
        <section className="faq-sec">
          <div className="con">
            <span className="sec-tag">✦ FAQ</span>
            <h2 className="sec-title">Common<br /><em>questions</em></h2>
            <div className="faq-grid">
              {faqs.map((faq) => (
                <div key={faq.q} className="faq-card">
                  <div className="faq-q">{faq.q}</div>
                  <div className="faq-a">{faq.a}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="cta">
          <div className="con" style={{ textAlign: "center" }}>
            <h2 className="cta-t">Start your<br /><em>free trial today</em></h2>
            <p className="cta-s">1 day free. No credit card needed. Your AI agent live within 24 hours.</p>
            {!user ? (
              <button className="btn-cta" onClick={() => openAuth("signup")}>Get Started Free →</button>
            ) : (
              <Link href="/dashboard" className="btn-cta">Go to Dashboard →</Link>
            )}
          </div>
        </section>

        {/* FOOTER */}
        <footer className="ft">
          <div className="ft-bot">
            <span className="ft-copy">© 2025 Soni AI Agents. All rights reserved.</span>
            <span className="ft-copy">Made with ✦ in Kota, India</span>
          </div>
        </footer>
      </div>

      <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} defaultTab={authTab} />
      {(showDropdown || mobileMenu) && <div style={{ position: "fixed", inset: 0, zIndex: 198 }} onClick={() => { setShowDropdown(false); setMobileMenu(false); }} />}
    </>
  );
}