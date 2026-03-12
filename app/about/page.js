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
        .btn-ghost { padding: 7px 16px; border-radius: 8px; border: none; background: transparent; font-size: 14px; font-weight: 500; color: var(--grey-2); cursor: pointer; font-family: 'Geist', sans-serif; white-space: nowrap; }
        .btn-ghost:hover { background: var(--grey-7); }
        .btn-dark { padding: 7px 16px; border-radius: 8px; border: none; background: var(--black); font-size: 14px; font-weight: 500; color: white; cursor: pointer; font-family: 'Geist', sans-serif; white-space: nowrap; transition: all 0.2s; }
        .btn-dark:hover { background: var(--grey-1); }

        /* hamburger */
        .hb { display: none; flex-direction: column; gap: 5px; background: none; border: none; cursor: pointer; padding: 6px; }
        .hb span { display: block; width: 22px; height: 2px; background: var(--black); border-radius: 2px; transition: all 0.25s; }
        .hb.open span:nth-child(1) { transform: rotate(45deg) translate(5px, 5px); }
        .hb.open span:nth-child(2) { opacity: 0; }
        .hb.open span:nth-child(3) { transform: rotate(-45deg) translate(5px, -5px); }

        /* mobile drawer */
        .mob-menu { display: none; position: fixed; top: 60px; left: 0; right: 0; background: #fff; border-bottom: 1px solid var(--grey-6); padding: 12px 16px 20px; z-index: 199; flex-direction: column; gap: 4px; box-shadow: 0 8px 24px rgba(0,0,0,0.08); }
        .mob-menu.open { display: flex; }
        .mob-link { padding: 12px 16px; border-radius: 10px; font-size: 15px; font-weight: 500; color: var(--black); text-decoration: none; display: block; background: none; border: none; cursor: pointer; font-family: 'Geist', sans-serif; text-align: left; width: 100%; transition: background 0.15s; }
        .mob-link:hover { background: var(--grey-7); }
        .mob-divider { height: 1px; background: var(--grey-6); margin: 6px 0; }
        .mob-btn { width: 100%; padding: 13px; border-radius: 10px; background: var(--black); color: white; border: none; font-size: 15px; font-weight: 600; cursor: pointer; font-family: 'Geist', sans-serif; margin-top: 4px; }

        /* avatar */
        .av-btn { display: flex; align-items: center; gap: 8px; background: var(--white); border: 1px solid var(--grey-6); border-radius: 8px; padding: 5px 12px 5px 6px; cursor: pointer; }
        .av-img { width: 28px; height: 28px; border-radius: 6px; object-fit: cover; }
        .av-name { font-size: 13px; font-weight: 500; color: var(--black); white-space: nowrap; }
        .dropdown { position: absolute; top: 44px; right: 0; background: var(--white); border-radius: 14px; padding: 6px; box-shadow: 0 8px 32px rgba(0,0,0,0.12); min-width: 180px; z-index: 300; border: 1px solid var(--grey-6); }
        .dd-email { padding: 8px 12px 10px; font-size: 11px; color: var(--grey-4); border-bottom: 1px solid var(--grey-6); margin-bottom: 4px; }
        .dd-item { display: block; width: 100%; text-align: left; padding: 9px 12px; border-radius: 8px; font-size: 13px; background: transparent; border: none; cursor: pointer; font-family: 'Geist', sans-serif; color: var(--black); text-decoration: none; transition: background 0.15s; }
        .dd-item:hover { background: var(--grey-7); }

        /* PAGE */
        .page { padding-top: 60px; min-height: 100vh; background: #fafafa; }

        /* ABOUT HERO */
        .about-hero {
          background: linear-gradient(135deg, #0a0a0a 0%, #1a0a2e 100%);
          padding: 80px 24px 80px;
          text-align: center;
          position: relative; overflow: hidden;
        }
        .about-hero-grid {
          position: absolute; inset: 0;
          background-image: linear-gradient(rgba(124,58,237,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(124,58,237,0.06) 1px, transparent 1px);
          background-size: 40px 40px;
        }
        .about-hero-glow {
          position: absolute; inset: 0;
          background: radial-gradient(ellipse 80% 60% at 50% -10%, rgba(124,58,237,0.35) 0%, transparent 70%);
        }
        .about-hero-inner { position: relative; z-index: 1; max-width: 640px; margin: 0 auto; }
        .about-tag { display: inline-block; font-size: 12px; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase; color: #a78bfa; margin-bottom: 18px; }
        .about-title { font-family: 'Instrument Serif', serif; font-size: clamp(36px, 6vw, 62px); font-weight: 400; color: white; line-height: 1.1; letter-spacing: -1.5px; margin-bottom: 18px; }
        .about-title em { font-style: italic; color: #a78bfa; }
        .about-sub { font-size: clamp(15px, 2vw, 17px); color: rgba(255,255,255,0.55); line-height: 1.7; max-width: 500px; margin: 0 auto; }

        /* SECTIONS */
        .sec { padding: 80px 24px; }
        .sec-alt { padding: 80px 24px; background: var(--grey-7); }
        .con { max-width: 1000px; margin: 0 auto; }
        .sec-tag { font-size: 12px; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase; color: var(--purple); margin-bottom: 12px; display: block; }
        .sec-title { font-family: 'Instrument Serif', serif; font-size: clamp(28px, 4vw, 44px); font-weight: 400; line-height: 1.1; letter-spacing: -0.8px; color: var(--black); margin-bottom: 14px; }
        .sec-title em { font-style: italic; color: var(--purple); }
        .sec-sub { font-size: 16px; color: var(--grey-3); line-height: 1.7; max-width: 520px; }

        /* MISSION VISION */
        .mv-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; margin-top: 44px; }
        .mv-card { background: var(--white); border: 1px solid var(--grey-6); border-radius: 20px; padding: 32px; transition: all 0.25s; }
        .mv-card:hover { transform: translateY(-3px); box-shadow: 0 12px 32px rgba(0,0,0,0.08); }
        .mv-icon { font-size: 32px; margin-bottom: 16px; }
        .mv-title { font-family: 'Instrument Serif', serif; font-size: 22px; color: var(--black); margin-bottom: 12px; }
        .mv-text { font-size: 15px; color: var(--grey-3); line-height: 1.75; }

        /* WHY GRID */
        .why-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin-top: 44px; }
        .why-card { background: var(--white); border: 1px solid var(--grey-6); border-radius: 16px; padding: 24px; transition: all 0.2s; }
        .why-card:hover { border-color: var(--purple-dim); background: var(--purple-soft); transform: translateY(-2px); }
        .why-icon { font-size: 26px; margin-bottom: 12px; }
        .why-title { font-size: 14px; font-weight: 600; color: var(--black); margin-bottom: 7px; }
        .why-text { font-size: 13px; color: var(--grey-3); line-height: 1.65; }

        /* FOUNDER */
        .founder-card { background: var(--white); border: 1px solid var(--grey-6); border-radius: 20px; padding: 36px; margin-top: 44px; display: flex; align-items: flex-start; gap: 24px; }
        .founder-av { width: 72px; height: 72px; border-radius: 50%; background: linear-gradient(135deg, var(--purple), #a855f7); display: flex; align-items: center; justify-content: center; font-family: 'Instrument Serif', serif; font-size: 28px; color: white; flex-shrink: 0; box-shadow: 0 4px 16px rgba(124,58,237,0.3); }
        .founder-name { font-family: 'Instrument Serif', serif; font-size: 26px; color: var(--black); margin-bottom: 4px; }
        .founder-role { font-size: 13px; color: var(--purple); font-weight: 600; margin-bottom: 16px; letter-spacing: 0.3px; }
        .founder-text { font-size: 15px; color: var(--grey-3); line-height: 1.75; }

        /* CONTACT */
        .contact-grid { display: flex; flex-direction: column; gap: 12px; max-width: 460px; margin-top: 32px; }
        .contact-item { display: flex; align-items: center; gap: 14px; padding: 16px 18px; background: var(--white); border: 1px solid var(--grey-6); border-radius: 14px; text-decoration: none; color: var(--black); transition: all 0.2s; }
        .contact-item:hover { border-color: var(--purple-dim); background: var(--purple-soft); transform: translateX(4px); }
        .contact-icon { width: 42px; height: 42px; border-radius: 11px; background: var(--purple-soft); display: flex; align-items: center; justify-content: center; font-size: 20px; flex-shrink: 0; }
        .contact-label { font-size: 11px; color: var(--grey-4); margin-bottom: 2px; }
        .contact-value { font-size: 14px; font-weight: 600; color: var(--black); }

        /* FOOTER */
        .ft { background: var(--grey-7); border-top: 1px solid var(--grey-6); padding: 48px 24px 24px; }
        .ft-bot { max-width: 1000px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px; }
        .ft-copy { font-size: 13px; color: var(--grey-4); }

        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        .f1 { animation: fadeUp 0.6s ease both; }
        .f2 { animation: fadeUp 0.6s ease 0.1s both; }
        .f3 { animation: fadeUp 0.6s ease 0.2s both; }
        .f4 { animation: fadeUp 0.6s ease 0.3s both; }

        /* RESPONSIVE */
        @media (max-width: 900px) {
          .nb { padding: 0 20px; }
          .nb-links { display: none; }
          .btn-ghost { display: none; }
          .hb { display: flex; }
          .why-grid { grid-template-columns: repeat(2, 1fr); }
        }

        @media (max-width: 600px) {
          .nb { padding: 0 14px; height: 54px; }
          .nb-logo-text { font-size: 14px; }
          .btn-dark { padding: 6px 12px; font-size: 13px; }
          .mob-menu { top: 54px; }

          .about-hero { padding: 60px 16px; }

          .sec { padding: 56px 16px; }
          .sec-alt { padding: 56px 16px; }

          .mv-grid { grid-template-columns: 1fr; }
          .mv-card { padding: 24px 20px; }

          .why-grid { grid-template-columns: 1fr 1fr; gap: 10px; }
          .why-card { padding: 18px 14px; }

          .founder-card { flex-direction: column; padding: 24px 20px; gap: 16px; }
          .founder-av { width: 60px; height: 60px; font-size: 24px; }

          .contact-item { padding: 14px 16px; }

          .ft { padding: 32px 16px 20px; }
          .ft-bot { flex-direction: column; text-align: center; }
        }

        @media (max-width: 380px) {
          .why-grid { grid-template-columns: 1fr; }
          .nb-logo-text { font-size: 13px; }
        }
      `}</style>

      {/* NAVBAR */}
      <nav className={`nb ${scrolled ? "s" : ""}`}>
        <Link href="/" className="nb-logo">
          <img src="/logo.png" style={{ height: "30px", width: "30px", borderRadius: "8px" }} />
          <span className="nb-logo-text">Soni AI Agents</span>
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
        <div className="about-hero">
          <div className="about-hero-grid" />
          <div className="about-hero-glow" />
          <div className="about-hero-inner f1">
            <span className="about-tag">✦ About Us</span>
            <h1 className="about-title">We make AI work<br /><em>for real businesses</em></h1>
            <p className="about-sub">Soni AI Agents was built with one goal — help Indian businesses stop missing customers and start growing, without any technical hassle.</p>
          </div>
        </div>

        {/* MISSION + VISION */}
        <section className="sec">
          <div className="con">
            <div className="f2">
              <span className="sec-tag">✦ What Drives Us</span>
              <h2 className="sec-title">Our mission &<br /><em>vision</em></h2>
            </div>
            <div className="mv-grid f2">
              <div className="mv-card">
                <div className="mv-icon">🎯</div>
                <div className="mv-title">Our Mission</div>
                <p className="mv-text">To make AI accessible for every small and medium business in India — not just big corporations with big budgets. Every shop, clinic, and coaching center deserves a smart assistant that works 24/7.</p>
              </div>
              <div className="mv-card">
                <div className="mv-icon">🔭</div>
                <div className="mv-title">Our Vision</div>
                <p className="mv-text">A future where no customer inquiry goes unanswered, no lead is lost because the owner was busy, and every Indian business — big or small — has an AI teammate they can count on.</p>
              </div>
            </div>
          </div>
        </section>

        {/* WHY US */}
        <section className="sec-alt">
          <div className="con f3">
            <span className="sec-tag">✦ Why Us</span>
            <h2 className="sec-title">Why Soni<br /><em>AI Agents?</em></h2>
            <p className="sec-sub">We built this for India — not a copy-paste of some foreign product.</p>
            <div className="why-grid">
              {[
                { icon: "🇮🇳", title: "Built for India", text: "Hindi support, local pricing, and agents that fit how Indian businesses actually work." },
                { icon: "⚡", title: "Set up in minutes", text: "No developer needed. Fill a form, and your AI agent is live within 24 hours." },
                { icon: "🔒", title: "You stay in control", text: "Your data stays secure. We activate nothing without your approval." },
                { icon: "🌙", title: "Works while you sleep", text: "Replies at 2am, on Sundays, on holidays — exactly when you can't." },
                { icon: "💰", title: "Affordable pricing", text: "Priced so even a small clinic or tutor in Tier-2 cities can afford it." },
                { icon: "🤝", title: "Real support", text: "When you reach out, you talk to a real person — not a bot." },
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
            <span className="sec-tag">✦ The Founder</span>
            <h2 className="sec-title">The person<br /><em>behind it</em></h2>
            <div className="founder-card">
              <div className="founder-av">M</div>
              <div>
                <div className="founder-name">Mridul Soni</div>
                <div className="founder-role">Founder, Soni AI Agents — Kota, Rajasthan</div>
                <p className="founder-text">Soni AI Agents started from a simple observation — most small businesses in India miss dozens of customer messages every day just because no one is available to reply. Mridul built this to fix that, combining AI with a deep understanding of how Indian businesses actually operate. His goal: ₹1,50,000/month revenue by age 20, by genuinely helping people.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section className="sec-alt">
          <div className="con f4">
            <span className="sec-tag">✦ Get In Touch</span>
            <h2 className="sec-title">Let's<br /><em>talk</em></h2>
            <p className="sec-sub">Have a question or want to know if Soni AI Agents is right for your business? Just reach out — we reply fast.</p>
            <div className="contact-grid">
              <a href="mailto:vasusoni1068@gmail.com" className="contact-item">
                <div className="contact-icon">📧</div>
                <div>
                  <div className="contact-label">Email us at</div>
                  <div className="contact-value">vasusoni1068@gmail.com</div>
                </div>
              </a>
              <a href="https://linkedin.com" target="_blank" className="contact-item">
                <div className="contact-icon">💼</div>
                <div>
                  <div className="contact-label">Connect on</div>
                  <div className="contact-value">LinkedIn — Coming soon</div>
                </div>
              </a>
              <div className="contact-item" style={{ cursor: "default" }}>
                <div className="contact-icon">📍</div>
                <div>
                  <div className="contact-label">Based in</div>
                  <div className="contact-value">Kota, Rajasthan, India</div>
                </div>
              </div>
            </div>
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