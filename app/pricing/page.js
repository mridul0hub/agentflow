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
      icon: <img src="/whatsappsvg.png" style={{ height: "34px", width: "34px" }} />,
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
        "20 free credits on signup",
        "Live within 24 hours",
      ],
      cta: "Start WhatsApp Agent",
      slug: "whatsapp-setup",
    },
    {
      name: "WhatsApp + Email",
      icon: "✦",
      desc: "Both agents combined — maximum coverage and best value for growing businesses.",
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
        "Works with any email",
        "Full email history",
        "Priority activation",
        "Dedicated support",
      ],
      cta: "Get Both Agents",
      slug: "whatsapp-setup",
    },
    {
      name: "Email Agent",
      icon: <img src="/mail.png" style={{height: "40px"}}/>,
      desc: "AI agent that replies to every customer email professionally and instantly.",
      monthlyPrice: 999,
      yearlyPrice: 8990,
      tag: null,
      tagColor: null,
      featured: false,
      features: [
        "Instant email replies",
        "Professional tone always",
        "Works with any email",
        "Full email history",
        "Business context aware",
        "Custom knowledge base",
        "20 free credits on signup",
        "Live within 24 hours",
      ],
      cta: "Start Email Agent",
      slug: "email-setup",
    },
  ];

  const faqs = [
    { q: "Do I need any technical knowledge?", a: "None at all. Simply complete a short form about your business — timings, services, pricing, location. Our team handles the full setup within 24 hours." },
    { q: "How do the 20 free credits work?", a: "Upon signup, you receive 20 complimentary credits to explore the platform. Credits are consumed based on agent usage, so you experience the full product before committing." },
    { q: "Will customers see my business name?", a: "Yes. Your AI agent operates through your actual WhatsApp Business number or email address, so customers interact with your brand directly — not ours." },
    { q: "Can I cancel anytime?", a: "Monthly plans may be cancelled at any time with immediate effect. Annual plans are billed once and remain active for the full subscription period." },
    { q: "What if my business information changes?", a: "Your agent's knowledge base can be updated at any time — new timings, services, or pricing. Simply contact us and changes go live within 24 hours." },
    { q: "Is my data secure?", a: "Absolutely. All business data and customer conversations are encrypted and stored securely. Your data is never shared with third parties under any circumstances." },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { background: #0d0d14; color: #e8e8f0; font-family: 'Montserrat', sans-serif; overflow-x: hidden; }

        :root {
          --bg: #0d0d14;
          --bg-2: #11111c;
          --bg-3: #16162a;
          --bg-4: #1c1c30;
          --border: rgba(124,58,237,0.15);
          --border-2: rgba(124,58,237,0.25);
          --border-3: rgba(124,58,237,0.4);
          --p: #7c3aed;
          --p2: #8b5cf6;
          --p3: #a78bfa;
          --p-soft: rgba(124,58,237,0.08);
          --p-mid: rgba(124,58,237,0.15);
          --text: #e8e8f0;
          --text-2: #c8c8e0;
          --text-3: #9898c0;
          --text-4: #606080;
          --sh-p: 0 0 24px rgba(124,58,237,0.25), 0 4px 12px rgba(124,58,237,0.15);
          --sh-p-lg: 0 0 48px rgba(124,58,237,0.3), 0 8px 24px rgba(124,58,237,0.2);
          --sh-p-xl: 0 0 80px rgba(124,58,237,0.35), 0 16px 40px rgba(124,58,237,0.25);
          --sh-card: 0 2px 16px rgba(0,0,0,0.4), 0 0 0 1px var(--border);
          --sh-card-hover: 0 8px 40px rgba(0,0,0,0.5), 0 0 0 1px var(--border-2), 0 0 32px rgba(124,58,237,0.15);
        }

        /* NAVBAR */
        .nb { position: fixed; top: 0; left: 0; right: 0; z-index: 200; height: 64px; display: flex; align-items: center; justify-content: space-between; padding: 0 40px; transition: all 0.35s; }
        .nb.s { background: rgba(13,13,20,0.95); backdrop-filter: blur(28px); border-bottom: 1px solid var(--border); box-shadow: 0 4px 32px rgba(0,0,0,0.4); }
        .nb-logo { display: flex; align-items: center; gap: 12px; text-decoration: none; flex-shrink: 0; }
        .nb-logo-text { font-family: 'Montserrat', sans-serif; font-size: 16px; font-weight: 700; color: var(--text); letter-spacing: 1.5px; text-transform: uppercase; white-space: nowrap; }
        .nb-links { display: flex; align-items: center; gap: 2px; }
        .nb-link { padding: 7px 16px; border-radius: 8px; font-size: 14px; font-weight: 500; color: var(--text-3); text-decoration: none; transition: all 0.15s; font-family: 'Montserrat', sans-serif; }
        .nb-link:hover { background: var(--p-soft); color: var(--text); }
        .nb-link.active { color: var(--p3); background: var(--p-soft); }
        .nb-actions { display: flex; align-items: center; gap: 10px; flex-shrink: 0; }
        .btn-ghost { padding: 8px 18px; border-radius: 8px; border: none; background: transparent; font-size: 14px; font-weight: 600; color: var(--text-3); cursor: pointer; font-family: 'Montserrat', sans-serif; transition: all 0.15s; }
        .btn-ghost:hover { background: var(--p-soft); color: var(--text); }
        .btn-dark { padding: 8px 22px; border-radius: 8px; border: 1px solid var(--border-2); background: var(--p-soft); font-size: 14px; font-weight: 600; color: var(--p3); cursor: pointer; font-family: 'Montserrat', sans-serif; transition: all 0.2s; box-shadow: var(--sh-p); }
        .btn-dark:hover { background: var(--p-mid); border-color: var(--border-3); color: white; transform: translateY(-1px); }

        .hb { display: none; flex-direction: column; gap: 5px; background: none; border: none; cursor: pointer; padding: 6px; }
        .hb span { display: block; width: 22px; height: 2px; background: var(--text-2); border-radius: 2px; transition: all 0.25s; }
        .hb.open span:nth-child(1) { transform: rotate(45deg) translate(5px, 5px); }
        .hb.open span:nth-child(2) { opacity: 0; }
        .hb.open span:nth-child(3) { transform: rotate(-45deg) translate(5px, -5px); }

        .mob-menu { display: none; position: fixed; top: 64px; left: 0; right: 0; background: var(--bg-2); border-bottom: 1px solid var(--border); padding: 16px; z-index: 199; flex-direction: column; gap: 4px; box-shadow: 0 20px 60px rgba(0,0,0,0.6); }
        .mob-menu.open { display: flex; }
        .mob-link { padding: 13px 16px; border-radius: 10px; font-size: 15px; font-weight: 500; color: var(--text-2); text-decoration: none; display: block; transition: all 0.15s; background: none; border: none; cursor: pointer; font-family: 'Montserrat', sans-serif; text-align: left; width: 100%; }
        .mob-link:hover { background: var(--p-soft); color: var(--text); }
        .mob-divider { height: 1px; background: var(--border); margin: 6px 0; }
        .mob-btn { width: 100%; padding: 14px; border-radius: 10px; background: var(--p); color: white; border: none; font-size: 15px; font-weight: 700; cursor: pointer; font-family: 'Montserrat', sans-serif; margin-top: 4px; box-shadow: var(--sh-p-lg); }

        .av-btn { display: flex; align-items: center; gap: 8px; background: var(--bg-3); border: 1px solid var(--border); border-radius: 8px; padding: 5px 12px 5px 6px; cursor: pointer; }
        .av-img { width: 28px; height: 28px; border-radius: 6px; object-fit: cover; }
        .av-name { font-size: 13px; font-weight: 600; color: var(--text); white-space: nowrap; }
        .dropdown { position: absolute; top: 48px; right: 0; background: var(--bg-3); border-radius: 16px; padding: 6px; box-shadow: 0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px var(--border); min-width: 190px; z-index: 300; }
        .dd-email { padding: 8px 12px 10px; font-size: 11px; color: var(--text-3); border-bottom: 1px solid var(--border); margin-bottom: 4px; }
        .dd-item { display: block; width: 100%; text-align: left; padding: 9px 12px; border-radius: 8px; font-size: 13px; background: transparent; border: none; cursor: pointer; font-family: 'Montserrat', sans-serif; color: var(--text-2); text-decoration: none; transition: all 0.15s; }
        .dd-item:hover { background: var(--p-soft); color: var(--text); }

        /* PAGE */
        .page { padding-top: 64px; }

        /* HERO */
        .p-hero { background: var(--bg-2); padding: 96px 24px; text-align: center; position: relative; overflow: hidden; border-bottom: 1px solid var(--border); }
        .p-hero-grid { position: absolute; inset: 0; background-image: linear-gradient(rgba(124,58,237,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(124,58,237,0.05) 1px, transparent 1px); background-size: 40px 40px; pointer-events: none; }
        .p-hero-glow { position: absolute; inset: 0; background: radial-gradient(ellipse 80% 60% at 50% -10%, rgba(124,58,237,0.2) 0%, transparent 65%); pointer-events: none; }
        .p-hero-inner { position: relative; z-index: 1; max-width: 600px; margin: 0 auto; }
        .p-tag { font-size: 11px; font-weight: 700; letter-spacing: 2.5px; text-transform: uppercase; color: var(--p3); margin-bottom: 18px; display: block; }
        .p-title { font-family: 'Montserrat', sans-serif; font-size: clamp(32px, 5.5vw, 56px); font-weight: 800; color: var(--text); line-height: 1.1; letter-spacing: -1px; margin-bottom: 18px; }
        .p-title em { font-style: normal; color: var(--p3); filter: drop-shadow(0 0 20px rgba(124,58,237,0.5)); }
        .p-sub { font-size: clamp(14px, 1.8vw, 16px); color: var(--text-3); line-height: 1.8; margin-bottom: 36px; font-weight: 400; }

        /* BILLING TOGGLE */
        .billing { display: inline-flex; background: rgba(255,255,255,0.04); border: 1px solid var(--border-2); border-radius: 12px; padding: 4px; }
        .b-btn { padding: 9px 24px; border-radius: 9px; border: none; font-size: 14px; font-weight: 600; cursor: pointer; font-family: 'Montserrat', sans-serif; background: transparent; color: var(--text-3); transition: all 0.2s; white-space: nowrap; }
        .b-btn.on { background: var(--p); color: white; box-shadow: var(--sh-p); }
        .yr-badge { font-size: 10px; background: rgba(34,197,94,0.15); color: #4ade80; padding: 2px 7px; border-radius: 50px; margin-left: 6px; font-weight: 700; border: 1px solid rgba(34,197,94,0.2); }

        /* PRICING CARDS */
        .pricing-sec { padding: 96px 24px; background: var(--bg); }
        .pricing-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; max-width: 1020px; margin: 0 auto; }

        .pc { background: var(--bg-3); border: 1px solid var(--border); border-radius: 24px; padding: 34px; transition: all 0.3s cubic-bezier(0.16,1,0.3,1); position: relative; display: flex; flex-direction: column; box-shadow: var(--sh-card); }
        .pc:hover { transform: translateY(-6px); box-shadow: var(--sh-card-hover); border-color: var(--border-2); }
        .pc.featured { background: var(--p); border-color: var(--p); transform: scale(1.02); box-shadow: var(--sh-p-xl); }
        .pc.featured:hover { transform: scale(1.02) translateY(-6px); }

        .pc-tag { display: inline-block; padding: 4px 12px; border-radius: 50px; font-size: 11px; font-weight: 700; color: white; margin-bottom: 22px; align-self: flex-start; letter-spacing: 0.3px; text-transform: uppercase; }
        .pc-icon { font-size: 28px; margin-bottom: 16px; }
        .pc-name { font-size: 17px; font-weight: 700; color: var(--text); margin-bottom: 10px; letter-spacing: -0.2px; }
        .pc.featured .pc-name { color: white; }
        .pc-desc { font-size: 13px; color: var(--text-3); line-height: 1.7; margin-bottom: 26px; font-weight: 400; }
        .pc.featured .pc-desc { color: rgba(255,255,255,0.65); }

        .pc-price { margin-bottom: 6px; display: flex; align-items: baseline; gap: 4px; }
        .pc-amount { font-family: 'Montserrat', sans-serif; font-size: 44px; font-weight: 800; color: var(--text); line-height: 1; letter-spacing: -1px; }
        .pc.featured .pc-amount { color: white; }
        .pc-period { font-size: 14px; color: var(--text-3); font-weight: 500; }
        .pc.featured .pc-period { color: rgba(255,255,255,0.5); }
        .pc-savings { font-size: 12px; color: #4ade80; font-weight: 600; margin-bottom: 26px; min-height: 18px; }
        .pc.featured .pc-savings { color: #86efac; }

        .pc-divider { height: 1px; background: var(--border); margin-bottom: 24px; }
        .pc.featured .pc-divider { background: rgba(255,255,255,0.2); }

        .pc-feats { display: flex; flex-direction: column; gap: 11px; margin-bottom: 30px; flex: 1; }
        .pc-feat { display: flex; align-items: flex-start; gap: 10px; font-size: 13px; color: var(--text-2); font-weight: 400; }
        .pc.featured .pc-feat { color: rgba(255,255,255,0.85); }
        .pc-check { color: var(--p3); font-size: 13px; margin-top: 1px; flex-shrink: 0; font-weight: 700; }
        .pc.featured .pc-check { color: rgba(255,255,255,0.9); }

        .pc-btn { width: 100%; padding: 13px; border-radius: 11px; font-size: 14px; font-weight: 700; cursor: pointer; font-family: 'Montserrat', sans-serif; transition: all 0.2s; border: 1px solid var(--border-2); background: var(--p-soft); color: var(--p3); letter-spacing: 0.2px; }
        .pc-btn:hover { background: var(--p-mid); transform: translateY(-1px); box-shadow: var(--sh-p); }
        .pc-btn.featured { background: white; color: var(--p); border-color: white; box-shadow: 0 4px 16px rgba(0,0,0,0.2); }
        .pc-btn.featured:hover { background: rgba(255,255,255,0.92); transform: translateY(-2px); }

        /* FAQ */
        .faq-sec { padding: 96px 24px; background: var(--bg-2); }
        .con { max-width: 900px; margin: 0 auto; }
        .sec-tag { font-size: 11px; font-weight: 700; letter-spacing: 2.5px; text-transform: uppercase; color: var(--p2); margin-bottom: 14px; display: block; }
        .sec-title { font-family: 'Montserrat', sans-serif; font-size: clamp(26px, 4vw, 44px); font-weight: 800; line-height: 1.1; letter-spacing: -0.8px; color: var(--text); margin-bottom: 48px; }
        .sec-title em { font-style: normal; color: var(--p3); filter: drop-shadow(0 0 12px rgba(124,58,237,0.4)); }

        .faq-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        .faq-card { background: var(--bg-3); border: 1px solid var(--border); border-radius: 18px; padding: 26px; transition: all 0.25s; box-shadow: var(--sh-card); }
        .faq-card:hover { border-color: var(--border-2); background: var(--bg-4); box-shadow: var(--sh-card-hover); }
        .faq-q { font-size: 14px; font-weight: 700; color: var(--text); margin-bottom: 10px; letter-spacing: -0.1px; }
        .faq-a { font-size: 13px; color: var(--text-3); line-height: 1.75; font-weight: 400; }

        /* CTA */
        .cta { background: var(--bg); border-top: 1px solid var(--border); padding: 112px 24px; text-align: center; position: relative; overflow: hidden; }
        .cta-mesh { position: absolute; inset: 0; background: radial-gradient(ellipse 60% 80% at 50% 50%, rgba(124,58,237,0.1) 0%, transparent 60%); pointer-events: none; }
        .cta-t { font-family: 'Montserrat', sans-serif; font-size: clamp(30px, 5vw, 56px); font-weight: 800; color: var(--text); line-height: 1.1; letter-spacing: -1px; margin-bottom: 18px; position: relative; }
        .cta-t em { font-style: normal; color: var(--p3); filter: drop-shadow(0 0 24px rgba(124,58,237,0.6)); }
        .cta-s { font-size: 16px; color: var(--text-3); margin-bottom: 40px; max-width: 440px; margin-left: auto; margin-right: auto; line-height: 1.8; position: relative; font-weight: 400; }
        .btn-cta { padding: 15px 40px; border-radius: 10px; background: var(--p); color: white; font-size: 15px; font-weight: 700; border: none; cursor: pointer; font-family: 'Montserrat', sans-serif; transition: all 0.25s; text-decoration: none; display: inline-block; box-shadow: var(--sh-p-lg); position: relative; letter-spacing: 0.2px; }
        .btn-cta:hover { background: var(--p2); transform: translateY(-3px); box-shadow: var(--sh-p-xl); }

        /* FOOTER */
        .ft { background: var(--bg); border-top: 1px solid var(--border); padding: 36px 24px; }
        .ft-bot { max-width: 900px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px; }
        .ft-copy { font-size: 13px; color: var(--text-4); font-family: 'Montserrat', sans-serif; }

        @keyframes fadeUp { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }
        .f1 { animation: fadeUp 0.7s ease both; }
        .f2 { animation: fadeUp 0.7s ease 0.1s both; }

        /* RESPONSIVE */
        @media (max-width: 900px) {
          .nb { padding: 0 20px; }
          .nb-links, .btn-ghost { display: none; }
          .hb { display: flex; }
          .pricing-grid { grid-template-columns: 1fr; max-width: 480px; margin: 0 auto; }
          .pc.featured { transform: scale(1); }
          .pc.featured:hover { transform: translateY(-6px); }
          .faq-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 600px) {
          .nb { padding: 0 16px; height: 56px; }
          .mob-menu { top: 56px; }
          .p-hero { padding: 72px 16px; }
          .billing { width: 100%; }
          .b-btn { flex: 1; text-align: center; }
          .pricing-sec { padding: 64px 16px; }
          .pricing-grid { max-width: 100%; }
          .pc { padding: 26px 20px; }
          .faq-sec { padding: 64px 16px; }
          .faq-card { padding: 20px 16px; }
          .cta { padding: 80px 16px; }
          .ft { padding: 28px 16px; }
          .ft-bot { flex-direction: column; text-align: center; }
        }
      `}</style>

      {/* NAVBAR */}
      <nav className={`nb ${scrolled ? "s" : ""}`}>
        <Link href="/" className="nb-logo">
          <img src="/logo.png" style={{ height: "40px", borderRadius: "30px", background: "#ffffff", padding: "2px" }} />
          <span className="nb-logo-text">AEZIO AI AGENTS</span>
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
                <span style={{ fontSize: "10px", color: "var(--text-3)" }}>▼</span>
              </button>
              {showDropdown && (
                <div className="dropdown">
                  <div className="dd-email">{user.email}</div>
                  <Link href="/dashboard" className="dd-item" onClick={() => setShowDropdown(false)}>Dashboard</Link>
                  <button className="dd-item" style={{ color: "#f87171" }} onClick={handleLogout}>Logout</button>
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
            <button className="mob-link" style={{ color: "#f87171" }} onClick={() => { handleLogout(); setMobileMenu(false); }}>Logout</button>
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
            <span className="p-tag">Pricing</span>
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
                    {plan.cta} 
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        {/* FAQ */}
        <section className="faq-sec">
          <div className="con">
            <span className="sec-tag">FAQ</span>
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
          <div className="cta-mesh" />
          <div className="con" style={{ textAlign: "center", position: "relative" }}>
            <h2 className="cta-t">Start with<br /><em>20 free credits</em></h2>
            <p className="cta-s">No credit card required. Your AI agent live within 24 hours.</p>
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
            <span className="ft-copy">© 2025 AEZIO AI Agents. All rights reserved.</span>
            <span className="ft-copy">Building the future of business automation.</span>
          </div>
        </footer>
      </div>

      <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} defaultTab={authTab} />
      {(showDropdown || mobileMenu) && <div style={{ position: "fixed", inset: 0, zIndex: 198 }} onClick={() => { setShowDropdown(false); setMobileMenu(false); }} />}
    </>
  );
}