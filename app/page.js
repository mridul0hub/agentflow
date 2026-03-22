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

  const testimonials = [
    { name: "Dr. Priya Sharma", role: "Pediatrician, Jaipur", text: "My clinic used to miss 20+ calls daily. Now the WhatsApp agent handles everything. Appointments are up 40%.", avatar: "PS" },
    { name: "Ramesh Gupta", role: "Restaurant Owner", text: "Customers get instant replies even at midnight. The AI knows our full menu and handles reservations perfectly.", avatar: "RG" },
    { name: "Neha Agarwal", role: "Salon Owner, Udaipur", text: "I was skeptical at first but this is genuinely magic. My customers think I have a full-time receptionist now.", avatar: "NA" },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=Montserrat:wght@300;400;500;600;700&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { background: #0d0d14; color: #e8e8f0; font-family: 'Montserrat', sans-serif; overflow-x: hidden; }

        :root {
          --bg: #0d0d14; --bg-2: #11111c; --bg-3: #16162a; --bg-4: #1c1c30; --bg-5: #22223a;
          --border: rgba(124,58,237,0.15); --border-2: rgba(124,58,237,0.25); --border-3: rgba(124,58,237,0.4);
          --p: #7c3aed; --p2: #8b5cf6; --p3: #a78bfa;
          --p-soft: rgba(124,58,237,0.08); --p-mid: rgba(124,58,237,0.15);
          --text: #e8e8f0; --text-2: #c8c8e0; --text-3: #9898c0; --text-4: #606080;
          --sh-p: 0 0 24px rgba(124,58,237,0.25), 0 4px 12px rgba(124,58,237,0.15);
          --sh-p-lg: 0 0 48px rgba(124,58,237,0.3), 0 8px 24px rgba(124,58,237,0.2);
          --sh-p-xl: 0 0 80px rgba(124,58,237,0.35), 0 16px 40px rgba(124,58,237,0.25);
          --sh-card: 0 2px 16px rgba(0,0,0,0.4), 0 0 0 1px var(--border);
          --sh-card-hover: 0 8px 40px rgba(0,0,0,0.5), 0 0 0 1px var(--border-2), 0 0 32px rgba(124,58,237,0.15);
        }

        .nb { position: fixed; top: 0; left: 0; right: 0; z-index: 200; height: 64px; display: flex; align-items: center; justify-content: space-between; padding: 0 40px; transition: all 0.35s; }
        .nb.s { background: rgba(13,13,20,0.92); backdrop-filter: blur(28px); border-bottom: 1px solid var(--border); box-shadow: 0 4px 32px rgba(0,0,0,0.4); }
        .nb-logo { display: flex; align-items: center; gap: 12px; text-decoration: none; flex-shrink: 0; }
        .nb-logo-text { font-family: 'Montserrat', sans-serif; font-size: 16px; font-weight: 700; color: var(--text); letter-spacing: 1.5px; text-transform: uppercase; white-space: nowrap; }
        .nb-links { display: flex; align-items: center; gap: 2px; }
        .nb-link { padding: 7px 16px; border-radius: 8px; font-size: 14px; font-weight: 500; color: var(--text-3); text-decoration: none; transition: all 0.15s; }
        .nb-link:hover { background: var(--p-soft); color: var(--text); }
        .nb-actions { display: flex; align-items: center; gap: 10px; flex-shrink: 0; }
        .btn-ghost { padding: 8px 18px; border-radius: 8px; border: none; background: transparent; font-size: 14px; font-weight: 600; color: var(--text-3); cursor: pointer; font-family: 'Montserrat', sans-serif; transition: all 0.15s; }
        .btn-ghost:hover { background: var(--p-soft); color: var(--text); }
        .btn-dark { padding: 8px 22px; border-radius: 8px; border: 1px solid var(--border-2); background: var(--p-soft); font-size: 14px; font-weight: 600; color: var(--p3); cursor: pointer; font-family: 'Montserrat', sans-serif; transition: all 0.2s; box-shadow: var(--sh-p); }
        .btn-dark:hover { background: var(--p-mid); border-color: var(--border-3); box-shadow: var(--sh-p-lg); color: white; transform: translateY(-1px); }

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

        .hero { min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 120px 24px 100px; position: relative; overflow: hidden; background: var(--bg); }
        .hero-mesh { position: absolute; inset: 0; background: radial-gradient(ellipse 70% 60% at 50% 0%, rgba(124,58,237,0.12) 0%, transparent 60%), radial-gradient(ellipse 50% 40% at 20% 80%, rgba(91,33,182,0.08) 0%, transparent 50%), radial-gradient(ellipse 40% 50% at 80% 60%, rgba(139,92,246,0.06) 0%, transparent 50%); pointer-events: none; }
        .hero-grid { position: absolute; inset: 0; background-image: linear-gradient(rgba(124,58,237,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(124,58,237,0.04) 1px, transparent 1px); background-size: 48px 48px; mask-image: radial-gradient(ellipse 80% 70% at 50% 0%, black 0%, transparent 100%); pointer-events: none; }
        .hero-inner { position: relative; z-index: 1; display: flex; flex-direction: column; align-items: center; width: 100%; max-width: 860px; }
        .hero-badge { display: inline-flex; align-items: center; gap: 8px; padding: 8px 18px; border-radius: 50px; border: 1px solid var(--border-2); background: var(--p-soft); font-size: 12px; font-weight: 700; color: var(--p3); margin-bottom: 36px; letter-spacing: 0.5px; box-shadow: var(--sh-p); animation: fadeUp 0.7s ease both; text-transform: uppercase; }
        .badge-dot { width: 7px; height: 7px; border-radius: 50%; background: #22c55e; box-shadow: 0 0 0 3px rgba(34,197,94,0.2); animation: glow 2s infinite; }
        @keyframes glow { 0%,100%{box-shadow:0 0 0 3px rgba(34,197,94,0.15)} 50%{box-shadow:0 0 0 8px rgba(34,197,94,0.06)} }
        .hero-title { font-family: 'Cormorant Garamond', serif; font-size: clamp(52px, 10vw, 108px); font-weight: 600; line-height: 0.97; letter-spacing: -2px; color: var(--text); margin-bottom: 30px; animation: fadeUp 0.7s ease 0.1s both; }
        .hero-title em { font-style: italic; font-weight: 400; color: var(--p3); filter: drop-shadow(0 0 24px rgba(124,58,237,0.6)); }
        .hero-sub { font-size: clamp(15px, 2vw, 18px); color: var(--text-3); max-width: 520px; line-height: 1.8; margin-bottom: 48px; font-weight: 400; animation: fadeUp 0.7s ease 0.2s both; }
        .hero-btns { display: flex; gap: 14px; flex-wrap: wrap; justify-content: center; margin-bottom: 72px; animation: fadeUp 0.7s ease 0.3s both; }
        .btn-hp { padding: 14px 36px; border-radius: 10px; background: var(--p); color: white; font-size: 15px; font-weight: 700; border: none; cursor: pointer; font-family: 'Montserrat', sans-serif; transition: all 0.25s; text-decoration: none; display: inline-block; box-shadow: var(--sh-p-lg); }
        .btn-hp:hover { background: var(--p2); transform: translateY(-3px); box-shadow: var(--sh-p-xl); }
        .btn-hs { padding: 14px 36px; border-radius: 10px; background: transparent; color: var(--text-2); font-size: 15px; font-weight: 600; border: 1px solid var(--border-2); cursor: pointer; font-family: 'Montserrat', sans-serif; transition: all 0.25s; }
        .btn-hs:hover { background: var(--p-soft); border-color: var(--border-3); color: var(--text); box-shadow: var(--sh-p); }

        .stats { display: flex; border: 1px solid var(--border-2); border-radius: 20px; background: var(--bg-3); overflow: hidden; box-shadow: var(--sh-card), 0 0 40px rgba(124,58,237,0.1); animation: fadeUp 0.7s ease 0.4s both; width: 100%; max-width: 660px; }
        .stat { flex: 1; padding: 28px 20px; text-align: center; border-right: 1px solid var(--border); }
        .stat:last-child { border-right: none; }
        .stat-v { font-family: 'Cormorant Garamond', serif; font-size: 36px; font-weight: 700; color: var(--p3); line-height: 1; margin-bottom: 6px; filter: drop-shadow(0 0 12px rgba(124,58,237,0.4)); }
        .stat-l { font-size: 11px; color: var(--text-3); font-weight: 600; letter-spacing: 0.5px; text-transform: uppercase; }

        .sec { padding: 112px 24px; background: var(--bg); }
        .sec-alt { padding: 112px 24px; background: var(--bg-2); }
        .con { max-width: 1100px; margin: 0 auto; }
        .sec-tag { font-size: 11px; font-weight: 700; letter-spacing: 2.5px; text-transform: uppercase; color: var(--p2); margin-bottom: 16px; display: block; }
        .sec-title { font-family: 'Cormorant Garamond', serif; font-size: clamp(36px, 5.5vw, 62px); font-weight: 600; line-height: 1.06; letter-spacing: -1.5px; color: var(--text); margin-bottom: 16px; }
        .sec-title em { font-style: italic; font-weight: 400; color: var(--p3); filter: drop-shadow(0 0 16px rgba(124,58,237,0.4)); }
        .sec-sub { font-size: 17px; color: var(--text-3); max-width: 480px; line-height: 1.8; font-weight: 400; }

        /* AGENTS — 4 columns */
        .agents { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-top: 52px; }
        .ac { background: var(--bg-3); border: 1px solid var(--border); border-radius: 24px; padding: 32px; cursor: pointer; transition: all 0.3s cubic-bezier(0.16,1,0.3,1); position: relative; overflow: hidden; box-shadow: var(--sh-card); }
        .ac::before { content:''; position: absolute; top: 0; left: 0; right: 0; height: 1px; background: linear-gradient(90deg, transparent, var(--p3), transparent); opacity: 0; transition: opacity 0.3s; }
        .ac:hover { transform: translateY(-8px); box-shadow: var(--sh-card-hover); border-color: var(--border-2); }
        .ac:hover::before { opacity: 1; }
        .ac-tag { display: inline-block; padding: 4px 12px; border-radius: 50px; font-size: 11px; font-weight: 700; color: white; margin-bottom: 20px; letter-spacing: 0.5px; text-transform: uppercase; }
        .ac-icon { width: 52px; height: 52px; border-radius: 14px; background: var(--bg-4); border: 1px solid var(--border-2); display: flex; align-items: center; justify-content: center; font-size: 24px; margin-bottom: 18px; box-shadow: var(--sh-p); }
        .ac-name { font-family: 'Cormorant Garamond', serif; font-size: 22px; font-weight: 600; color: var(--text); margin-bottom: 10px; letter-spacing: -0.3px; }
        .ac-desc { font-size: 13px; color: var(--text-3); line-height: 1.75; margin-bottom: 20px; }
        .ac-feats { display: flex; flex-wrap: wrap; gap: 7px; margin-bottom: 24px; }
        .ac-feat { padding: 4px 11px; border-radius: 50px; background: var(--p-soft); font-size: 11px; font-weight: 600; color: var(--p3); border: 1px solid var(--border); }
        .ac-cta { font-size: 13px; font-weight: 700; color: var(--p3); }

        .steps { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1px; margin-top: 56px; background: var(--border); border-radius: 22px; overflow: hidden; box-shadow: var(--sh-card); }
        .sc { background: var(--bg-3); padding: 38px 28px; transition: all 0.25s; }
        .sc:hover { background: var(--bg-4); }
        .sc-n { font-family: 'Cormorant Garamond', serif; font-size: 56px; color: var(--text-4); line-height: 1; margin-bottom: 22px; font-weight: 600; }
        .sc-i { font-size: 28px; margin-bottom: 14px; }
        .sc-t { font-size: 16px; font-weight: 700; color: var(--text); margin-bottom: 10px; }
        .sc-d { font-size: 13px; color: var(--text-2); line-height: 1.75; }

        .biz { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-top: 52px; }
        .bc { background: var(--bg-3); border: 1px solid var(--border); border-radius: 18px; padding: 26px 14px; text-align: center; transition: all 0.25s; box-shadow: var(--sh-card); }
        .bc:hover { border-color: var(--border-2); background: var(--bg-4); transform: translateY(-4px); box-shadow: var(--sh-card-hover); }
        .bc-i { font-size: 28px; margin-bottom: 10px; }
        .bc-n { font-size: 13px; font-weight: 600; color: var(--text-2); }

        .testi { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-top: 56px; }
        .tc { background: var(--bg-3); border: 1px solid var(--border); border-radius: 24px; padding: 32px; transition: all 0.3s; box-shadow: var(--sh-card); position: relative; overflow: hidden; }
        .tc::before { content: '"'; font-family: 'Cormorant Garamond', serif; font-size: 120px; color: var(--p-soft); position: absolute; top: -10px; right: 20px; line-height: 1; pointer-events: none; }
        .tc:hover { transform: translateY(-6px); box-shadow: var(--sh-card-hover); border-color: var(--border-2); }
        .tc-stars { color: var(--p3); font-size: 14px; margin-bottom: 16px; letter-spacing: 3px; filter: drop-shadow(0 0 6px rgba(124,58,237,0.4)); }
        .tc-text { font-family: 'Cormorant Garamond', serif; font-size: 17px; color: var(--text-2); line-height: 1.7; margin-bottom: 24px; font-style: italic; }
        .tc-auth { display: flex; align-items: center; gap: 12px; }
        .tc-av { width: 42px; height: 42px; border-radius: 50%; background: linear-gradient(135deg, var(--p), #1e1b4b); display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 700; color: white; flex-shrink: 0; box-shadow: var(--sh-p); }
        .tc-name { font-size: 14px; font-weight: 700; color: var(--text); }
        .tc-role { font-size: 12px; color: var(--text-3); margin-top: 2px; }

        .cta { padding: 128px 24px; text-align: center; position: relative; overflow: hidden; background: var(--bg-2); border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); }
        .cta-mesh { position: absolute; inset: 0; background: radial-gradient(ellipse 60% 80% at 50% 50%, rgba(124,58,237,0.12) 0%, transparent 60%); pointer-events: none; }
        .cta-t { font-family: 'Cormorant Garamond', serif; font-size: clamp(40px, 6.5vw, 72px); color: var(--text); line-height: 1.05; letter-spacing: -1.5px; margin-bottom: 22px; position: relative; font-weight: 600; }
        .cta-t em { font-style: italic; font-weight: 400; color: var(--p3); filter: drop-shadow(0 0 24px rgba(124,58,237,0.6)); }
        .cta-s { font-size: 17px; color: var(--text-3); margin-bottom: 44px; max-width: 440px; margin-left: auto; margin-right: auto; line-height: 1.8; position: relative; }
        .btn-cta { padding: 16px 44px; border-radius: 10px; background: var(--p); color: white; font-size: 15px; font-weight: 700; border: none; cursor: pointer; font-family: 'Montserrat', sans-serif; transition: all 0.25s; text-decoration: none; display: inline-block; box-shadow: var(--sh-p-lg); position: relative; }
        .btn-cta:hover { background: var(--p2); transform: translateY(-3px); box-shadow: var(--sh-p-xl); }

        .ft { background: var(--bg); border-top: 1px solid var(--border); padding: 72px 24px 32px; }
        .ft-grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 52px; margin-bottom: 52px; }
        .ft-desc { font-size: 14px; color: var(--text-2); line-height: 1.8; margin-top: 14px; max-width: 260px; }
        .ft-h { font-size: 11px; font-weight: 700; color: var(--text-2); margin-bottom: 18px; letter-spacing: 2px; text-transform: uppercase; }
        .ft-link { display: block; font-size: 14px; color: var(--text-3); text-decoration: none; margin-bottom: 10px; transition: color 0.15s; background: none; border: none; cursor: pointer; font-family: 'Montserrat', sans-serif; padding: 0; text-align: left; }
        .ft-link:hover { color: var(--p3); }
        .ft-bot { border-top: 1px solid var(--border); padding-top: 24px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px; }
        .ft-copy { font-size: 13px; color: var(--text-4); }

        @keyframes fadeUp { from { opacity: 0; transform: translateY(22px); } to { opacity: 1; transform: translateY(0); } }

        @media (max-width: 1100px) { .agents { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 900px) {
          .nb { padding: 0 20px; }
          .nb-links, .btn-ghost { display: none; }
          .hb { display: flex; }
          .hero { padding: 100px 20px 72px; }
          .agents { grid-template-columns: repeat(2, 1fr); }
          .steps { grid-template-columns: repeat(2, 1fr); }
          .testi { grid-template-columns: 1fr; }
          .ft-grid { grid-template-columns: 1fr 1fr; gap: 32px; }
        }
        @media (max-width: 600px) {
          .nb { padding: 0 16px; height: 56px; }
          .mob-menu { top: 56px; }
          .hero { padding: 88px 16px 56px; }
          .hero-btns { flex-direction: column; width: 100%; max-width: 320px; }
          .btn-hp, .btn-hs { text-align: center; width: 100%; }
          .stats { flex-wrap: wrap; }
          .stat { flex: 1 1 50%; }
          .stat:nth-child(1), .stat:nth-child(2) { border-bottom: 1px solid var(--border); }
          .stat:nth-child(2), .stat:nth-child(4) { border-right: none; }
          .sec, .sec-alt { padding: 72px 16px; }
          .agents { grid-template-columns: 1fr; }
          .biz { grid-template-columns: repeat(2, 1fr); }
          .steps { grid-template-columns: 1fr; }
          .sc { padding: 28px 20px; }
          .ac { padding: 24px 18px; }
          .cta { padding: 80px 16px; }
          .ft { padding: 56px 16px 28px; }
          .ft-grid { grid-template-columns: 1fr; gap: 28px; }
          .ft-bot { flex-direction: column; text-align: center; }
        }
        @media (max-width: 380px) {
          .hero-title { letter-spacing: -1px; }
          .nb-logo-text { font-size: 13px; letter-spacing: 0.8px; }
        }
      `}</style>

      {/* NAVBAR */}
      <nav className={`nb ${scrolled ? "s" : ""}`}>
        <Link href="/" className="nb-logo">
          <img src="/logo.png" style={{ height: "40px", borderRadius: "30px", background: "#ffffff", padding: "2px" }} />
          <span className="nb-logo-text">AEZIO AI AGENTS</span>
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
          <button className={`hb ${mobileMenu ? "open" : ""}`} onClick={() => setMobileMenu(!mobileMenu)} aria-label="Menu">
            <span /><span /><span />
          </button>
        </div>
      </nav>

      {/* MOBILE MENU */}
      <div className={`mob-menu ${mobileMenu ? "open" : ""}`}>
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

      {/* HERO */}
      <section className="hero">
        <div className="hero-mesh" />
        <div className="hero-grid" />
        <div className="hero-inner">
          <div className="hero-badge">
            <div className="badge-dot" />
            <span>AI Agents for Global Businesses</span>
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
            {[["24/7","Always online"],["< 2s","Reply speed"],["100%","Queries handled"],["₹0","Per reply"]].map(([v,l]) => (
              <div key={l} className="stat">
                <div className="stat-v">{v}</div>
                <div className="stat-l">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AGENTS */}
      <section className="sec-alt">
        <div className="con">
          <span className="sec-tag">Our Agents</span>
          <h2 className="sec-title">Pick your agent,<br /><em>we do the rest</em></h2>
          <p className="sec-sub">Set up once, run forever. Your customers get instant replies day and night.</p>
          <div className="agents">
            {[
              { icon: <img src="/whatsappsvg.png" style={{ height: "40px"}} />, name: "WhatsApp Agent", tag: "Most Popular", tagColor: "#25D366", desc: "Customers message your WhatsApp — AI replies instantly. Handles FAQs, bookings, timings, and more. Works 24/7.", feats: ["Auto-replies 24/7", "Answers any FAQ", "Books appointments", "Multilingual"], slug: "whatsapp-setup" },
              { icon: <img src="/mail.png" style={{ height: "40px"}} />, name: "Email Agent", tag: "Smart", tagColor: "#7c3aed", desc: "Every customer email gets a smart, professional reply in seconds. No backlogs, no missed inquiries.", feats: ["Instant replies", "Professional tone", "Works with Gmail", "Full history"], slug: "email-setup" },
              { icon: <img src="/voice.png" style={{ height: "40px"}} />, name: "Voice Agent", tag: "Beta", tagColor: "#6d28d9", desc: "Customers call your number — AI answers, speaks naturally, gives info and books appointments. Scam calls auto-detected.", feats: ["Dedicated phone number", "Natural voice", "Books appointments", "Scam detection"], slug: "voice-setup" },
              { icon: <img src="/calendar.png" style={{ height: "40px"}} />, name: "Appointment Agent", tag: "New", tagColor: "#0ea5e9", desc: "AI automatically schedules, confirms and manages appointments across WhatsApp, Email and Voice — all in one place.", feats: ["Auto scheduling", "Confirmation alerts", "Reschedule & cancel", "All channels"], slug: "appointments" },
            ].map((a) => (
              <div key={a.slug} className="ac" onClick={() => user ? window.location.href=`/dashboard/${a.slug}` : openAuth("signup")}>
                <span className="ac-tag" style={{ background: a.tagColor }}>{a.tag}</span>
                <div className="ac-icon">{a.icon}</div>
                <div className="ac-name">{a.name}</div>
                <p className="ac-desc">{a.desc}</p>
                <div className="ac-feats">{a.feats.map(f => <span key={f} className="ac-feat">✓ {f}</span>)}</div>
                <div className="ac-cta">{user ? "Set up now" : "Get started"} →</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="sec">
        <div className="con">
          <span className="sec-tag">How It Works</span>
          <h2 className="sec-title">Up and running<br /><em>in minutes</em></h2>
          <p className="sec-sub">No technical knowledge needed. We handle setup, you handle your business.</p>
          <div className="steps">
            {[
              { n: "01", i: <img src="/form.png" style={{height: "40px"}}/>, t: "Fill the form", d: "Tell us about your business — timings, services, pricing, location. Takes 3 minutes." },
              { n: "02", i: <img src="/activate.png" style={{height: "45px"}}/>, t: "We activate", d: "Our team sets up your AI agent within 24 hours. Zero technical work from your end." },
              { n: "03", i: <img src="/ailogo.png" style={{height: "50px"}}/>, t: "AI goes live", d: "Your agent starts replying to customers automatically — any time, any day." },
              { n: "04", i: <img src="/growth.png" style={{height: "40px"}}/>, t: "You grow", d: "Focus on your actual work. Every customer query is handled, every lead is captured." },
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

      {/* WHO IS IT FOR */}
      <section className="sec-alt">
        <div className="con">
          <span className="sec-tag">Who It's For</span>
          <h2 className="sec-title">Built for real<br /><em>businesses</em></h2>
          <div className="biz">
            {[[<img src="/hospital.png" style={{height: "40px"}}/>,"Clinics & Doctors"],[<img src="/restaurant.png" style={{height: "40px"}}/>,"Restaurants"],[<img src="/salon.png" style={{height: "40px"}}/>,"Salons & Spas"],[<img src="/real-estate.png" style={{height: "45px"}}/>,"Real Estate"],[<img src="/school.png" style={{height: "40px"}}/>,"Coaching Centers"],[<img src="/online-store.png" style={{height: "40px"}}/>,"Online Stores"],[<img src="/gym.png" style={{height: "40px"}}/>,"Gyms & Fitness"],[<img src="/repair.png" style={{height: "40px"}}/>,"Service Shops"]].map(([i,n]) => (
              <div key={n} className="bc">
                <div className="bc-i">{i}</div>
                <div className="bc-n">{n}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="sec">
        <div className="con">
          <span className="sec-tag">Testimonials</span>
          <h2 className="sec-title">Trusted by businesses<br /><em>across the world</em></h2>
          <div className="testi">
            {testimonials.map(t => (
              <div key={t.name} className="tc">
                <div className="tc-stars">★★★★★</div>
                <p className="tc-text">{t.text}</p>
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

      {/* CTA */}
      <section className="cta">
        <div className="cta-mesh" />
        <div className="con" style={{ position: "relative" }}>
          <h2 className="cta-t">Ready to stop<br /><em>missing customers?</em></h2>
          <p className="cta-s">Join businesses that never miss a customer inquiry — even at 2am.</p>
          {!user ? (
            <button className="btn-cta" onClick={() => openAuth("signup")}>Start for free →</button>
          ) : (
            <Link href="/dashboard" className="btn-cta">Go to Dashboard →</Link>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="ft">
        <div className="con">
          <div className="ft-grid">
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <img src="/logo.png" style={{ height: "50px", borderRadius: "30px", background: "#ffffff", padding: "2px" }} />
                <span style={{ fontSize: "15px", fontWeight: "700", color: "var(--text)", fontFamily: "'Montserrat', sans-serif", letterSpacing: "1px", textTransform: "uppercase" }}>AEZIO AI AGENTS</span>
              </div>
              <p className="ft-desc">AI agents for businesses worldwide. Set up once, run forever. Your customers get instant replies — even at 2am.</p>
            </div>
            <div>
              <div className="ft-h">Product</div>
              <Link href="/agents/whatsapp-agent" className="ft-link">WhatsApp Agent</Link>
              <Link href="/agents/email-agent" className="ft-link">Email Agent</Link>
              <Link href="/agents/voice-agent" className="ft-link">Voice Agent</Link>
              <Link href="/dashboard/appointments" className="ft-link">Appointment Agent</Link>
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
            <span className="ft-copy">© 2025 AEZIO AI Agents. All rights reserved.</span>
            <span className="ft-copy">Building the future of business automation.</span>
          </div>
        </div>
      </footer>

      <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} defaultTab={authTab} />
      <CookieConsent />
      {(showDropdown || mobileMenu) && <div style={{ position: "fixed", inset: 0, zIndex: 198 }} onClick={() => { setShowDropdown(false); setMobileMenu(false); }} />}
    </>
  );
}