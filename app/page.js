"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import AuthModal from "./components/AuthModal";
import CookieConsent from "./components/CookieConsent";
import Link from "next/link";

export default function Home() {
  const [user, setUser] = useState(null);
  const [showAuth, setShowAuth] = useState(false);
  const [authTab, setAuthTab] = useState("login");
  const [showDropdown, setShowDropdown] = useState(false);
  const [billing, setBilling] = useState("monthly");
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

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

  const waPrice = billing === "monthly" ? "₹1,999" : "₹17,990";
  const emPrice = billing === "monthly" ? "₹999" : "₹8,990";
  const voPrice = billing === "monthly" ? "₹2,499" : "₹21,990";
  const period = billing === "monthly" ? "/mo" : "/yr";

  const testimonials = [
    { name: "Dr. Priya Sharma", role: "Pediatrician, Jaipur", text: "My clinic used to miss 20+ calls daily. Now the WhatsApp agent handles everything. Appointments are up 40%.", avatar: "PS" },
    { name: "Ramesh Gupta", role: "Restaurant Owner, Kota", text: "Customers get instant replies even at midnight. The AI knows our full menu and handles reservations perfectly.", avatar: "RG" },
    { name: "Neha Agarwal", role: "Salon Owner, Udaipur", text: "I was skeptical at first but this is genuinely magic. My customers think I have a full-time receptionist now.", avatar: "NA" },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Geist:wght@300;400;500;600;700&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { background: #fafafa; color: #0a0a0a; font-family: 'Geist', sans-serif; overflow-x: hidden; max-width: 100vw; }

        :root {
          --purple: #7c3aed; --purple-light: #8b5cf6;
          --purple-soft: #f5f3ff; --purple-dim: #ede9fe;
          --black: #0a0a0a; --grey-1: #18181b; --grey-2: #3f3f46;
          --grey-3: #71717a; --grey-4: #a1a1aa; --grey-5: #d4d4d8;
          --grey-6: #e4e4e7; --grey-7: #f4f4f5; --white: #ffffff;
        }

        /* ── NAVBAR ── */
        .nb { position: fixed; top: 0; left: 0; right: 0; z-index: 200; height: 60px; display: flex; align-items: center; justify-content: space-between; padding: 0 32px; transition: all 0.3s; }
        .nb.s { background: rgba(250,250,250,0.92); backdrop-filter: blur(20px); border-bottom: 1px solid var(--grey-6); }
        .nb-logo { display: flex; align-items: center; gap: 10px; text-decoration: none; flex-shrink: 0; }
        .nb-logo-icon { width: 32px; height: 32px; border-radius: 8px; background: linear-gradient(135deg, var(--purple), #a855f7); display: flex; align-items: center; justify-content: center; font-size: 16px; color: white; flex-shrink: 0; }
        .nb-logo-text { font-size: 15px; font-weight: 600; color: var(--black); letter-spacing: -0.3px; white-space: nowrap; }
        .nb-links { display: flex; align-items: center; gap: 4px; }
        .nb-link { padding: 6px 14px; border-radius: 8px; font-size: 14px; font-weight: 500; color: var(--grey-2); text-decoration: none; transition: all 0.15s; white-space: nowrap; }
        .nb-link:hover { background: var(--grey-7); color: var(--black); }
        .nb-actions { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }
        .btn-ghost { padding: 7px 16px; border-radius: 8px; border: none; background: transparent; font-size: 14px; font-weight: 500; color: var(--grey-2); cursor: pointer; font-family: 'Geist', sans-serif; white-space: nowrap; }
        .btn-ghost:hover { background: var(--grey-7); }
        .btn-dark { padding: 7px 16px; border-radius: 8px; border: none; background: var(--black); font-size: 14px; font-weight: 500; color: white; cursor: pointer; font-family: 'Geist', sans-serif; white-space: nowrap; transition: all 0.2s; }
        .btn-dark:hover { background: var(--grey-1); }

        .hb { display: none; flex-direction: column; gap: 5px; background: none; border: none; cursor: pointer; padding: 6px; }
        .hb span { display: block; width: 22px; height: 2px; background: var(--black); border-radius: 2px; transition: all 0.25s; }
        .hb.open span:nth-child(1) { transform: rotate(45deg) translate(5px, 5px); }
        .hb.open span:nth-child(2) { opacity: 0; }
        .hb.open span:nth-child(3) { transform: rotate(-45deg) translate(5px, -5px); }

        .mob-menu { display: none; position: fixed; top: 60px; left: 0; right: 0; background: #fff; border-bottom: 1px solid var(--grey-6); padding: 12px 16px 20px; z-index: 199; flex-direction: column; gap: 4px; box-shadow: 0 8px 24px rgba(0,0,0,0.08); }
        .mob-menu.open { display: flex; }
        .mob-link { padding: 12px 16px; border-radius: 10px; font-size: 15px; font-weight: 500; color: var(--black); text-decoration: none; display: block; transition: background 0.15s; background: none; border: none; cursor: pointer; font-family: 'Geist', sans-serif; text-align: left; width: 100%; }
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

        /* ── HERO ── */
        .hero { min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 100px 24px 80px; position: relative; overflow: hidden; }
        .hero-bg { position: absolute; inset: 0; background: radial-gradient(ellipse 80% 50% at 50% -10%, rgba(124,58,237,0.08) 0%, transparent 70%); }
        .hero-grid { position: absolute; inset: 0; background-image: linear-gradient(rgba(124,58,237,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(124,58,237,0.04) 1px, transparent 1px); background-size: 40px 40px; mask-image: radial-gradient(ellipse 80% 60% at 50% 0%, black 0%, transparent 100%); }
        .hero-inner { position: relative; z-index: 1; display: flex; flex-direction: column; align-items: center; width: 100%; max-width: 760px; }
        .hero-badge { display: inline-flex; align-items: center; gap: 8px; padding: 6px 14px; border-radius: 50px; border: 1px solid var(--grey-6); background: var(--white); font-size: 12px; font-weight: 500; color: var(--grey-2); margin-bottom: 28px; box-shadow: 0 1px 4px rgba(0,0,0,0.06); animation: fadeUp 0.6s ease both; }
        .badge-dot { width: 6px; height: 6px; border-radius: 50%; background: #22c55e; box-shadow: 0 0 0 3px rgba(34,197,94,0.2); animation: glow 2s infinite; }
        @keyframes glow { 0%,100%{box-shadow:0 0 0 3px rgba(34,197,94,0.2)} 50%{box-shadow:0 0 0 6px rgba(34,197,94,0.1)} }
        .hero-title { font-family: 'Instrument Serif', serif; font-size: clamp(40px, 8vw, 84px); font-weight: 400; line-height: 1.05; letter-spacing: -2px; color: var(--black); margin-bottom: 24px; animation: fadeUp 0.6s ease 0.1s both; }
        .hero-title em { font-style: italic; background: linear-gradient(135deg, var(--purple), #a855f7); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .hero-sub { font-size: clamp(15px, 2vw, 18px); color: var(--grey-3); max-width: 500px; line-height: 1.7; margin-bottom: 40px; animation: fadeUp 0.6s ease 0.2s both; }
        .hero-btns { display: flex; gap: 12px; flex-wrap: wrap; justify-content: center; margin-bottom: 56px; animation: fadeUp 0.6s ease 0.3s both; }
        .btn-hp { padding: 12px 28px; border-radius: 10px; background: var(--black); color: white; font-size: 15px; font-weight: 500; border: none; cursor: pointer; font-family: 'Geist', sans-serif; transition: all 0.2s; text-decoration: none; display: inline-block; box-shadow: 0 4px 16px rgba(0,0,0,0.15); white-space: nowrap; }
        .btn-hp:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.2); }
        .btn-hs { padding: 12px 28px; border-radius: 10px; background: var(--white); color: var(--black); font-size: 15px; font-weight: 500; border: 1px solid var(--grey-6); cursor: pointer; font-family: 'Geist', sans-serif; transition: all 0.2s; white-space: nowrap; }
        .btn-hs:hover { background: var(--grey-7); }

        .stats { display: flex; border: 1px solid var(--grey-6); border-radius: 16px; background: var(--white); overflow: hidden; box-shadow: 0 1px 8px rgba(0,0,0,0.06); animation: fadeUp 0.6s ease 0.4s both; width: 100%; max-width: 600px; }
        .stat { flex: 1; padding: 20px 16px; text-align: center; border-right: 1px solid var(--grey-6); }
        .stat:last-child { border-right: none; }
        .stat-v { font-family: 'Instrument Serif', serif; font-size: 26px; color: var(--black); line-height: 1; margin-bottom: 4px; }
        .stat-l { font-size: 11px; color: var(--grey-4); font-weight: 500; }

        /* ── SECTIONS ── */
        .sec { padding: 96px 24px; }
        .sec-alt { padding: 96px 24px; background: var(--grey-7); }
        .con { max-width: 1080px; margin: 0 auto; }
        .sec-tag { font-size: 12px; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase; color: var(--purple); margin-bottom: 14px; display: block; }
        .sec-title { font-family: 'Instrument Serif', serif; font-size: clamp(30px, 5vw, 50px); font-weight: 400; line-height: 1.1; letter-spacing: -1px; color: var(--black); margin-bottom: 14px; }
        .sec-title em { font-style: italic; color: var(--purple); }
        .sec-sub { font-size: 16px; color: var(--grey-3); max-width: 480px; line-height: 1.7; }

        .billing { display: inline-flex; background: var(--grey-7); border: 1px solid var(--grey-6); border-radius: 10px; padding: 4px; margin-top: 24px; }
        .b-btn { padding: 8px 20px; border-radius: 8px; border: none; font-size: 14px; font-weight: 500; cursor: pointer; font-family: 'Geist', sans-serif; background: transparent; color: var(--grey-3); transition: all 0.2s; white-space: nowrap; }
        .b-btn.on { background: var(--white); color: var(--black); box-shadow: 0 1px 4px rgba(0,0,0,0.1); }
        .yr-badge { font-size: 10px; background: #dcfce7; color: #16a34a; padding: 2px 7px; border-radius: 50px; margin-left: 6px; font-weight: 700; }

        /* agent cards — 3 columns now */
        .agents { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-top: 40px; }
        .ac { background: var(--white); border: 1px solid var(--grey-6); border-radius: 24px; padding: 32px; cursor: pointer; transition: all 0.25s; position: relative; overflow: hidden; }
        .ac::before { content:''; position: absolute; top: 0; left: 0; right: 0; height: 3px; background: linear-gradient(90deg, var(--purple), #a855f7); opacity: 0; transition: opacity 0.25s; }
        .ac:hover { transform: translateY(-4px); box-shadow: 0 20px 48px rgba(0,0,0,0.1); border-color: var(--grey-5); }
        .ac:hover::before { opacity: 1; }
        .ac-tag { display: inline-block; padding: 3px 10px; border-radius: 50px; font-size: 11px; font-weight: 600; color: white; margin-bottom: 18px; }
        .ac-icon { width: 52px; height: 52px; border-radius: 14px; background: var(--purple-soft); display: flex; align-items: center; justify-content: center; font-size: 24px; margin-bottom: 18px; }
        .ac-name { font-size: 19px; font-weight: 600; color: var(--black); margin-bottom: 10px; letter-spacing: -0.3px; }
        .ac-desc { font-size: 13px; color: var(--grey-3); line-height: 1.7; margin-bottom: 20px; }
        .ac-feats { display: flex; flex-wrap: wrap; gap: 7px; margin-bottom: 24px; }
        .ac-feat { padding: 4px 11px; border-radius: 50px; background: var(--purple-soft); font-size: 12px; font-weight: 500; color: var(--purple); }
        .ac-price { display: flex; align-items: baseline; gap: 3px; margin-bottom: 14px; }
        .ac-pv { font-family: 'Instrument Serif', serif; font-size: 32px; color: var(--black); }
        .ac-pp { font-size: 14px; color: var(--grey-4); }
        .ac-cta { font-size: 14px; font-weight: 500; color: var(--purple); }
        /* NEW badge on voice card */
        .ac-new { position: absolute; top: 20px; right: 20px; background: linear-gradient(135deg, var(--purple), #a855f7); color: white; font-size: 10px; font-weight: 700; padding: 3px 9px; border-radius: 50px; letter-spacing: 0.5px; }

        .steps { display: grid; grid-template-columns: repeat(4, 1fr); gap: 2px; margin-top: 52px; background: var(--grey-6); border-radius: 20px; overflow: hidden; border: 1px solid var(--grey-6); }
        .sc { background: var(--white); padding: 32px 24px; }
        .sc-n { font-family: 'Instrument Serif', serif; font-size: 44px; color: var(--grey-6); line-height: 1; margin-bottom: 18px; }
        .sc-i { font-size: 26px; margin-bottom: 12px; }
        .sc-t { font-size: 15px; font-weight: 600; color: var(--black); margin-bottom: 8px; }
        .sc-d { font-size: 13px; color: var(--grey-3); line-height: 1.65; }

        .biz { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-top: 44px; }
        .bc { background: var(--white); border: 1px solid var(--grey-6); border-radius: 14px; padding: 22px 12px; text-align: center; transition: all 0.2s; }
        .bc:hover { border-color: var(--purple-dim); background: var(--purple-soft); transform: translateY(-2px); }
        .bc-i { font-size: 26px; margin-bottom: 8px; }
        .bc-n { font-size: 12px; font-weight: 500; color: var(--grey-2); }

        .testi { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; margin-top: 52px; }
        .tc { background: var(--white); border: 1px solid var(--grey-6); border-radius: 20px; padding: 26px; transition: all 0.25s; }
        .tc:hover { transform: translateY(-3px); box-shadow: 0 12px 32px rgba(0,0,0,0.08); }
        .tc-stars { color: #f59e0b; font-size: 13px; margin-bottom: 14px; }
        .tc-text { font-size: 14px; color: var(--grey-2); line-height: 1.7; margin-bottom: 18px; font-style: italic; }
        .tc-auth { display: flex; align-items: center; gap: 10px; }
        .tc-av { width: 36px; height: 36px; border-radius: 50%; background: linear-gradient(135deg, var(--purple), #a855f7); display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 600; color: white; flex-shrink: 0; }
        .tc-name { font-size: 13px; font-weight: 600; color: var(--black); }
        .tc-role { font-size: 11px; color: var(--grey-4); }

        .cta { background: var(--black); padding: 100px 24px; text-align: center; }
        .cta-t { font-family: 'Instrument Serif', serif; font-size: clamp(32px, 6vw, 60px); color: white; line-height: 1.1; letter-spacing: -1.5px; margin-bottom: 18px; }
        .cta-t em { font-style: italic; color: #a78bfa; }
        .cta-s { font-size: 16px; color: rgba(255,255,255,0.5); margin-bottom: 36px; max-width: 440px; margin-left: auto; margin-right: auto; line-height: 1.65; }
        .btn-cta { padding: 14px 36px; border-radius: 10px; background: white; color: var(--black); font-size: 15px; font-weight: 600; border: none; cursor: pointer; font-family: 'Geist', sans-serif; transition: all 0.2s; text-decoration: none; display: inline-block; }
        .btn-cta:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(255,255,255,0.2); }

        .ft { background: var(--grey-7); border-top: 1px solid var(--grey-6); padding: 60px 24px 28px; }
        .ft-grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 44px; margin-bottom: 44px; }
        .ft-desc { font-size: 14px; color: var(--grey-3); line-height: 1.7; margin-top: 12px; max-width: 250px; }
        .ft-loc { font-size: 12px; color: var(--grey-5); margin-top: 12px; }
        .ft-h { font-size: 13px; font-weight: 600; color: var(--black); margin-bottom: 14px; }
        .ft-link { display: block; font-size: 14px; color: var(--grey-3); text-decoration: none; margin-bottom: 9px; transition: color 0.15s; background: none; border: none; cursor: pointer; font-family: 'Geist', sans-serif; padding: 0; text-align: left; }
        .ft-link:hover { color: var(--black); }
        .ft-bot { border-top: 1px solid var(--grey-6); padding-top: 20px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px; }
        .ft-copy { font-size: 13px; color: var(--grey-4); }

        @keyframes fadeUp { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }

        @media (max-width: 900px) {
          .nb { padding: 0 20px; }
          .nb-links { display: none; }
          .btn-ghost { display: none; }
          .hb { display: flex; }
          .hero { padding: 80px 20px 60px; min-height: auto; padding-top: 100px; }
          .agents { grid-template-columns: 1fr; }
          .steps { grid-template-columns: repeat(2, 1fr); }
          .biz { grid-template-columns: repeat(4, 1fr); }
          .testi { grid-template-columns: 1fr; }
          .ft-grid { grid-template-columns: 1fr 1fr; gap: 32px; }
        }

        @media (max-width: 600px) {
          .nb { padding: 0 14px; height: 54px; }
          .nb-logo-text { font-size: 14px; }
          .btn-dark { padding: 6px 12px; font-size: 13px; }
          .mob-menu { top: 54px; }
          .hero { padding: 88px 16px 48px; }
          .hero-badge { font-size: 11px; }
          .hero-btns { flex-direction: column; width: 100%; max-width: 320px; }
          .btn-hp, .btn-hs { text-align: center; width: 100%; }
          .stats { flex-wrap: wrap; max-width: 100%; }
          .stat { flex: 1 1 50%; min-width: 0; }
          .stat:nth-child(1) { border-bottom: 1px solid var(--grey-6); }
          .stat:nth-child(2) { border-bottom: 1px solid var(--grey-6); border-right: none; }
          .stat:nth-child(3) { border-right: 1px solid var(--grey-6); }
          .stat:nth-child(4) { border-right: none; }
          .sec { padding: 60px 16px; }
          .sec-alt { padding: 60px 16px; }
          .billing { width: 100%; justify-content: center; }
          .ac { padding: 24px 18px; }
          .steps { grid-template-columns: 1fr; }
          .sc { padding: 24px 18px; }
          .biz { grid-template-columns: repeat(2, 1fr); gap: 10px; }
          .bc { padding: 18px 10px; }
          .tc { padding: 20px 16px; }
          .cta { padding: 72px 16px; }
          .ft { padding: 48px 16px 24px; }
          .ft-grid { grid-template-columns: 1fr; gap: 28px; }
          .ft-bot { flex-direction: column; text-align: center; }
          .dropdown { right: -10px; }
        }

        @media (max-width: 380px) {
          .nb-logo-text { font-size: 13px; }
          .nb-logo-icon { width: 28px; height: 28px; font-size: 14px; }
          .biz { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>

      {/* ── NAVBAR ── */}
      <nav className={`nb ${scrolled ? "s" : ""}`}>
        <Link href="/" className="nb-logo">
          <img src="/logo.png" style={{ height: "30px", width: "30px", borderRadius: "8px", background: "transparent", mixBlendMode: "multiply" }} />
          <span className="nb-logo-text">Soni AI Agents</span>
        </Link>
        <div className="nb-links">
          <Link href="/about" className="nb-link">About</Link>
          <Link href="/pricing" className="nb-link">Pricing</Link>
        </div>
        <div className="nb-actions">
          {user ? (
            <div style={{ position: "relative" }}>
              <button className="av-btn" onClick={() => setShowDropdown(!showDropdown)}>
                <img className="av-img" src={user.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.user_metadata?.full_name || user.email)}&background=7c3aed&color=fff&size=32`} alt="avatar" />
                <span className="av-name">{user.user_metadata?.full_name?.split(" ")[0] || user.email?.split("@")[0]}</span>
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
          <button className={`hb ${mobileMenu ? "open" : ""}`} onClick={() => setMobileMenu(!mobileMenu)} aria-label="Menu">
            <span /><span /><span />
          </button>
        </div>
      </nav>

      {/* ── MOBILE MENU ── */}
      <div className={`mob-menu ${mobileMenu ? "open" : ""}`}>
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

      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-grid" />
        <div className="hero-inner">
          <div className="hero-badge">
            <div className="badge-dot" />
            <span>AI Agents for Indian Businesses</span>
          </div>
          <h1 className="hero-title">Your business,<br /><em>always awake</em></h1>
          <p className="hero-sub">While you sleep, your AI agent replies to customers, answers calls, and books appointments — automatically. No missed leads, ever.</p>
          <div className="hero-btns">
            {!user ? (
              <>
                <button className="btn-hp" onClick={() => openAuth("signup")}>Start for free →</button>
                <button className="btn-hs" onClick={() => openAuth("login")}>Login</button>
              </>
            ) : (
              <Link href="/dashboard" className="btn-hp">Go to Dashboard →</Link>
            )}
          </div>
          <div className="stats">
            {[["24/7","Always online"],["<2s","Reply speed"],["100%","Queries handled"],["₹0","Per reply"]].map(([v,l]) => (
              <div key={l} className="stat">
                <div className="stat-v">{v}</div>
                <div className="stat-l">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AGENTS ── */}
      <section className="sec">
        <div className="con">
          <span className="sec-tag">Our Agents</span>
          <h2 className="sec-title">Pick your agent,<br /><em>we do the rest</em></h2>
          <p className="sec-sub">Set up once, run forever. Your customers get instant replies day and night.</p>
          <div className="billing">
            <button className={`b-btn ${billing === "monthly" ? "on" : ""}`} onClick={() => setBilling("monthly")}>Monthly</button>
            <button className={`b-btn ${billing === "yearly" ? "on" : ""}`} onClick={() => setBilling("yearly")}>
              Yearly <span className="yr-badge">3 months free</span>
            </button>
          </div>
          <div className="agents">
            {[
              { icon:<img src="/whatsappsvg.png" style={{ height: "35px", width: "35px"}} />, name:"WhatsApp Agent", tag:"Most Popular", tagColor:"#25D366", desc:"Customers message your WhatsApp — AI replies instantly. Handles FAQs, bookings, timings, and more. Works 24/7 so you never miss a lead.", feats:["Auto-replies 24/7","Answers any FAQ","Books appointments","Hindi & English"], price: waPrice, slug:"whatsapp-setup", isNew: false },
              { icon:"📧", name:"Email Agent", tag:"Smart", tagColor:"#7c3aed", desc:"Every customer email gets a smart, professional reply in seconds. No backlogs, no missed inquiries — AI handles it all.", feats:["Instant replies","Professional tone","Works with Gmail","Full history"], price: emPrice, slug:"email-setup", isNew: false },
              { icon:"📞", name:"Voice Agent", tag:"Coming Soon", tagColor:"#f59e0b", desc:"Customers call your Indian number — AI answers, speaks in Hinglish, gives info and books appointments. Scam calls auto-detected.", feats:["Indian phone number","Hinglish voice","Books appointments","Scam detection"], price: voPrice, slug:"voice-setup", isNew: true },
            ].map((a) => (
              <div key={a.slug} className="ac" onClick={() => user ? window.location.href=`/dashboard/${a.slug}` : openAuth("signup")}>
                {a.isNew && <div className="ac-new">NEW ✦</div>}
                <span className="ac-tag" style={{ background: a.tagColor }}>{a.tag}</span>
                <div className="ac-icon">{a.icon}</div>
                <div className="ac-name">{a.name}</div>
                <p className="ac-desc">{a.desc}</p>
                <div className="ac-feats">{a.feats.map(f => <span key={f} className="ac-feat">✓ {f}</span>)}</div>
                <div className="ac-price"><span className="ac-pv">{a.price}</span><span className="ac-pp">{period}</span></div>
                <div className="ac-cta">{user ? "Set up now" : "Get started"} →</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="sec-alt">
        <div className="con">
          <span className="sec-tag">✦ How It Works</span>
          <h2 className="sec-title">Up and running<br /><em>in minutes</em></h2>
          <p className="sec-sub">No technical knowledge needed. We handle setup, you handle your business.</p>
          <div className="steps">
            {[
              {n:"01",i:"📝",t:"Fill the form",d:"Tell us about your business — timings, services, pricing, location. Takes 3 minutes."},
              {n:"02",i:"⚙️",t:"We activate",d:"Our team sets up your AI agent within 24 hours. Zero technical work from your end."},
              {n:"03",i:<img src="/ailogo.jpg" style={{ height: "50px", width: "50px"}} />,t:"AI goes live",d:"Your agent starts replying to customers automatically — any time, any day."},
              {n:"04",i:"📈",t:"You grow",d:"Focus on your actual work. Every customer query is handled, every lead is captured."},
            ].map(s => (
              <div key={s.n} className="sc">
                <div className="sc-n">{s.n}</div>
                <div className="sc-i">{s.i}</div>
                <div className="sc-t">{s.t}</div>
                <div className="sc-d">{s.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHO IS IT FOR ── */}
      <section className="sec">
        <div className="con">
          <span className="sec-tag">✦ Who It's For</span>
          <h2 className="sec-title">Built for real<br /><em>Indian businesses</em></h2>
          <div className="biz">
            {[["🏥","Clinics & Doctors"],["🍽️","Restaurants"],["💇","Salons & Spas"],["🏠","Real Estate"],["📚","Coaching Centers"],["🛍️","Online Stores"],["🏋️","Gyms & Fitness"],["🔧","Service Shops"]].map(([i,n]) => (
              <div key={n} className="bc">
                <div className="bc-i">{i}</div>
                <div className="bc-n">{n}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="sec-alt">
        <div className="con">
          <span className="sec-tag">✦ Testimonials</span>
          <h2 className="sec-title">Trusted by businesses<br /><em>across India</em></h2>
          <div className="testi">
            {testimonials.map(t => (
              <div key={t.name} className="tc">
                <div className="tc-stars">★★★★★</div>
                <p className="tc-text">"{t.text}"</p>
                <div className="tc-auth">
                  <div className="tc-av">{t.avatar}</div>
                  <div>
                    <div className="tc-name">{t.name}</div>
                    <div className="tc-role">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="cta">
        <div className="con" style={{ textAlign: "center" }}>
          <h2 className="cta-t">Ready to stop<br /><em>missing customers?</em></h2>
          <p className="cta-s">Join businesses that never miss a customer inquiry — even at 2am.</p>
          {!user ? (
            <button className="btn-cta" onClick={() => openAuth("signup")}>Start for free →</button>
          ) : (
            <Link href="/dashboard" className="btn-cta">Go to Dashboard →</Link>
          )}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="ft">
        <div className="con">
          <div className="ft-grid">
            <div>
              <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
                <img src="/logo.png" style={{ height: "30px", width: "30px", borderRadius: "8px", background: "transparent", mixBlendMode: "multiply" }} />
                <span style={{ fontSize:"15px", fontWeight:"600", color:"var(--black)" }}>Soni AI Agents</span>
              </div>
              <p className="ft-desc">AI agents for Indian businesses. Set up once, run forever. Your customers get instant replies — even at 2am.</p>
              <p className="ft-loc">Kota, Rajasthan, India</p>
            </div>
            <div>
              <div className="ft-h">Product</div>
              <Link href="/agents/whatsapp-agent" className="ft-link">WhatsApp Agent</Link>
              <Link href="/agents/email-agent" className="ft-link">Email Agent</Link>
              <Link href="/agents/voice-agent" className="ft-link">Voice Agent</Link>
              <Link href="/pricing" className="ft-link">Pricing</Link>
            </div>
            <div>
              <div className="ft-h">Company</div>
              <Link href="/about" className="ft-link">About</Link>
              <a href="mailto:vasusoni1068@gmail.com" className="ft-link">Contact</a>
            </div>
            <div>
              <div className="ft-h">Account</div>
              {user ? (
                <Link href="/dashboard" className="ft-link">Dashboard</Link>
              ) : (
                <>
                  <button onClick={() => openAuth("login")} className="ft-link">Login</button>
                  <button onClick={() => openAuth("signup")} className="ft-link">Sign Up Free</button>
                </>
              )}
            </div>
          </div>
          <div className="ft-bot">
            <span className="ft-copy">© 2025 Soni AI Agents. All rights reserved.</span>
            <span className="ft-copy">Made with ❤️ in Kota, India</span>
          </div>
        </div>
      </footer>

      <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} defaultTab={authTab} />
      <CookieConsent />
      {(showDropdown || mobileMenu) && <div style={{ position:"fixed", inset:0, zIndex:198 }} onClick={() => { setShowDropdown(false); setMobileMenu(false); }} />}
    </>
  );
}