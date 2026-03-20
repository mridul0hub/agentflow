"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import AuthModal from "../components/AuthModal";

export default function AboutPage() {
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [authTab, setAuthTab] = useState("login");

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
        .page { padding-top: 64px; min-height: 100vh; }

        /* HERO */
        .about-hero { background: var(--bg-2); padding: 96px 24px 96px; text-align: center; position: relative; overflow: hidden; border-bottom: 1px solid var(--border); }
        .about-hero-grid { position: absolute; inset: 0; background-image: linear-gradient(rgba(124,58,237,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(124,58,237,0.05) 1px, transparent 1px); background-size: 40px 40px; pointer-events: none; }
        .about-hero-glow { position: absolute; inset: 0; background: radial-gradient(ellipse 80% 60% at 50% -10%, rgba(124,58,237,0.2) 0%, transparent 65%); pointer-events: none; }
        .about-hero-inner { position: relative; z-index: 1; max-width: 680px; margin: 0 auto; }
        .about-tag { display: inline-block; font-size: 11px; font-weight: 700; letter-spacing: 2.5px; text-transform: uppercase; color: var(--p3); margin-bottom: 20px; }
        .about-title { font-family: 'Montserrat', sans-serif; font-size: clamp(32px, 5.5vw, 58px); font-weight: 800; color: var(--text); line-height: 1.1; letter-spacing: -1px; margin-bottom: 20px; }
        .about-title em { font-style: normal; color: var(--p3); filter: drop-shadow(0 0 20px rgba(124,58,237,0.5)); }
        .about-sub { font-size: clamp(14px, 1.8vw, 16px); color: var(--text-3); line-height: 1.8; max-width: 540px; margin: 0 auto; font-weight: 400; }

        /* SECTIONS */
        .sec { padding: 96px 24px; background: var(--bg); }
        .sec-alt { padding: 96px 24px; background: var(--bg-2); }
        .con { max-width: 1000px; margin: 0 auto; }
        .sec-tag { font-size: 11px; font-weight: 700; letter-spacing: 2.5px; text-transform: uppercase; color: var(--p2); margin-bottom: 14px; display: block; }
        .sec-title { font-family: 'Montserrat', sans-serif; font-size: clamp(26px, 4vw, 44px); font-weight: 800; line-height: 1.1; letter-spacing: -0.8px; color: var(--text); margin-bottom: 14px; }
        .sec-title em { font-style: normal; color: var(--p3); filter: drop-shadow(0 0 12px rgba(124,58,237,0.4)); }
        .sec-sub { font-size: 16px; color: var(--text-3); line-height: 1.8; max-width: 520px; font-weight: 400; }

        /* MISSION VISION */
        .mv-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; margin-top: 48px; }
        .mv-card { background: var(--bg-3); border: 1px solid var(--border); border-radius: 20px; padding: 36px; transition: all 0.3s; box-shadow: var(--sh-card); }
        .mv-card:hover { transform: translateY(-4px); box-shadow: var(--sh-card-hover); border-color: var(--border-2); }
        .mv-icon { font-size: 32px; margin-bottom: 18px; }
        .mv-title { font-size: 18px; font-weight: 700; color: var(--text); margin-bottom: 14px; letter-spacing: -0.2px; }
        .mv-text { font-size: 14px; color: var(--text-3); line-height: 1.85; font-weight: 400; }

        /* WHY GRID */
        .why-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin-top: 48px; }
        .why-card { background: var(--bg-3); border: 1px solid var(--border); border-radius: 16px; padding: 26px; transition: all 0.25s; box-shadow: var(--sh-card); }
        .why-card:hover { border-color: var(--border-2); background: var(--bg-4); transform: translateY(-3px); box-shadow: var(--sh-card-hover); }
        .why-icon { font-size: 26px; margin-bottom: 14px; }
        .why-title { font-size: 14px; font-weight: 700; color: var(--text); margin-bottom: 8px; letter-spacing: -0.1px; }
        .why-text { font-size: 13px; color: var(--text-3); line-height: 1.75; font-weight: 400; }

        /* FOUNDER */
        .founder-card { background: var(--bg-3); border: 1px solid var(--border); border-radius: 22px; padding: 40px; margin-top: 48px; display: flex; align-items: flex-start; gap: 28px; box-shadow: var(--sh-card); transition: all 0.3s; }
        .founder-card:hover { box-shadow: var(--sh-card-hover); border-color: var(--border-2); }
        .founder-av { width: 76px; height: 76px; border-radius: 50%; background: linear-gradient(135deg, var(--p), #1e1b4b); display: flex; align-items: center; justify-content: center; font-family: 'Montserrat', sans-serif; font-size: 26px; font-weight: 800; color: white; flex-shrink: 0; box-shadow: var(--sh-p-lg); }
        .founder-name { font-size: 24px; font-weight: 800; color: var(--text); margin-bottom: 5px; letter-spacing: -0.3px; }
        .founder-role { font-size: 12px; color: var(--p3); font-weight: 600; margin-bottom: 18px; letter-spacing: 0.5px; text-transform: uppercase; }
        .founder-text { font-size: 15px; color: var(--text-3); line-height: 1.85; font-weight: 400; }

        /* CONTACT */
        .contact-grid { display: flex; flex-direction: column; gap: 12px; max-width: 480px; margin-top: 36px; }
        .contact-item { display: flex; align-items: center; gap: 16px; padding: 18px 20px; background: var(--bg-3); border: 1px solid var(--border); border-radius: 16px; text-decoration: none; color: var(--text); transition: all 0.25s; box-shadow: var(--sh-card); }
        .contact-item:hover { border-color: var(--border-2); background: var(--bg-4); transform: translateX(5px); box-shadow: var(--sh-card-hover); }
        .contact-icon { width: 44px; height: 44px; border-radius: 12px; background: var(--p-soft); border: 1px solid var(--border-2); display: flex; align-items: center; justify-content: center; font-size: 20px; flex-shrink: 0; }
        .contact-label { font-size: 11px; color: var(--text-4); margin-bottom: 3px; font-weight: 600; letter-spacing: 0.5px; text-transform: uppercase; }
        .contact-value { font-size: 14px; font-weight: 600; color: var(--text-2); }

        /* FOOTER */
        .ft { background: var(--bg); border-top: 1px solid var(--border); padding: 40px 24px 24px; }
        .ft-bot { max-width: 1000px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px; }
        .ft-copy { font-size: 13px; color: var(--text-4); font-family: 'Montserrat', sans-serif; }

        @keyframes fadeUp { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }
        .f1 { animation: fadeUp 0.7s ease both; }
        .f2 { animation: fadeUp 0.7s ease 0.1s both; }
        .f3 { animation: fadeUp 0.7s ease 0.2s both; }
        .f4 { animation: fadeUp 0.7s ease 0.3s both; }

        /* RESPONSIVE */
        @media (max-width: 900px) {
          .nb { padding: 0 20px; }
          .nb-links, .btn-ghost { display: none; }
          .hb { display: flex; }
          .why-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 600px) {
          .nb { padding: 0 16px; height: 56px; }
          .mob-menu { top: 56px; }
          .about-hero { padding: 72px 16px; }
          .sec, .sec-alt { padding: 64px 16px; }
          .mv-grid { grid-template-columns: 1fr; }
          .mv-card { padding: 26px 20px; }
          .why-grid { grid-template-columns: 1fr 1fr; gap: 10px; }
          .why-card { padding: 20px 14px; }
          .founder-card { flex-direction: column; padding: 28px 22px; gap: 18px; }
          .founder-av { width: 64px; height: 64px; font-size: 22px; }
          .ft { padding: 32px 16px 20px; }
          .ft-bot { flex-direction: column; text-align: center; }
        }
        @media (max-width: 380px) {
          .why-grid { grid-template-columns: 1fr; }
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
          <Link href="/" className="nb-link">Home</Link>
          <Link href="/about" className="nb-link active">About</Link>
          <Link href="/pricing" className="nb-link">Pricing</Link>
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
          <button className={`hb ${mobileMenu ? "open" : ""}`} onClick={() => setMobileMenu(!mobileMenu)} aria-label="Menu">
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
        <div className="about-hero">
          <div className="about-hero-grid" />
          <div className="about-hero-glow" />
          <div className="about-hero-inner f1">
            <span className="about-tag">About Us</span>
            <h1 className="about-title">We make AI work<br />for <em>every business</em></h1>
            <p className="about-sub">AEZIO AI Agents was built with a singular purpose — to give businesses of every size access to intelligent automation that works around the clock, without complexity or compromise.</p>
          </div>
        </div>

        {/* MISSION + VISION */}
        <section className="sec">
          <div className="con">
            <div className="f2">
              <span className="sec-tag">What Drives Us</span>
              <h2 className="sec-title">Our mission &<br /><em>vision</em></h2>
            </div>
            <div className="mv-grid f2">
              <div className="mv-card">
                <div className="mv-icon">🎯</div>
                <div className="mv-title">Our Mission</div>
                <p className="mv-text">To democratize intelligent automation — making enterprise-grade AI agents accessible to every business, regardless of size, budget, or technical expertise. We believe every business deserves a smart assistant that never sleeps.</p>
              </div>
              <div className="mv-card">
                <div className="mv-icon">🔭</div>
                <div className="mv-title">Our Vision</div>
                <p className="mv-text">A world where no customer inquiry goes unanswered, no lead is lost due to unavailability, and every business — from a local clinic to a global enterprise — operates with the efficiency of a fully staffed AI team.</p>
              </div>
            </div>
          </div>
        </section>

        {/* WHY US */}
        <section className="sec-alt">
          <div className="con f3">
            <span className="sec-tag">Why Us</span>
            <h2 className="sec-title">Why <em>AEZIO</em><br />AI Agents?</h2>
            <p className="sec-sub">Purpose-built for real-world business operations — not a generic product.</p>
            <div className="why-grid">
              {[
                { icon: "🌍", title: "Built for Everyone", text: "Multilingual support, global reach, and agents designed to fit how businesses actually operate worldwide." },
                { icon: "⚡", title: "Live in Minutes", text: "No developer required. Complete your setup form and your AI agent goes live within 24 hours." },
                { icon: "🔒", title: "You Stay in Control", text: "Your data is encrypted and secure. Nothing is activated without your explicit approval." },
                { icon: "🌙", title: "Always On", text: "Replies at 2am, on weekends, on public holidays — precisely when your team cannot." },
                { icon: "💎", title: "Transparent Pricing", text: "Credit-based pricing that scales with your usage. Only pay for what you actually use." },
                { icon: "🤝", title: "Human Support", text: "When you reach out, you speak with a real person committed to your success — not a chatbot." },
              ].map((w) => (
                <div key={w.title} className="why-card">
                  <div className="why-icon">{w.icon}</div>
                  <div className="why-title">{w.title}</div>
                  <div className="why-text">{w.text}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FOUNDER */}
        <section className="sec">
          <div className="con f4">
            <span className="sec-tag">The Founder</span>
            <h2 className="sec-title">The person<br /><em>behind it</em></h2>
            <div className="founder-card">
              <div className="founder-av">M</div>
              <div>
                <div className="founder-name">Mridul Soni</div>
                <div className="founder-role">Founder & CEO — AEZIO AI Agents</div>
                <p className="founder-text">AEZIO AI Agents was founded on a straightforward observation: businesses across the world lose significant revenue every day simply because no one is available to respond to customer inquiries in time. Mridul built AEZIO to solve that — combining cutting-edge AI with deep operational insight to create agents that are genuinely useful, not just technically impressive. His conviction is simple: intelligent automation should be accessible to every business, not just those with large budgets and dedicated engineering teams.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section className="sec-alt">
          <div className="con f4">
            <span className="sec-tag">Get In Touch</span>
            <h2 className="sec-title">Let's<br /><em>connect</em></h2>
            <p className="sec-sub">Have a question or want to explore how AEZIO can work for your business? We respond promptly.</p>
            <div className="contact-grid">
              <a href="mailto:vasusoni1068@gmail.com" className="contact-item">
                <div className="contact-icon">📧</div>
                <div>
                  <div className="contact-label">Email</div>
                  <div className="contact-value">vasusoni1068@gmail.com</div>
                </div>
              </a>
              <a href="https://linkedin.com" target="_blank" className="contact-item">
                <div className="contact-icon">💼</div>
                <div>
                  <div className="contact-label">LinkedIn</div>
                  <div className="contact-value">Coming soon</div>
                </div>
              </a>
            </div>
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