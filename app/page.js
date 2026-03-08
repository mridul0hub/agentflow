"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import AuthModal from "./components/AuthModal";
import Link from "next/link";

export default function Home() {
  const [user, setUser] = useState(null);
  const [showAuth, setShowAuth] = useState(false);
  const [authTab, setAuthTab] = useState("login");
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };
    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setShowDropdown(false);
  };

  const openAuth = (tab) => {
    setAuthTab(tab);
    setShowAuth(true);
  };

  return (
    <main style={{ minHeight: "100vh", background: "linear-gradient(180deg, #c9e8f5 0%, #e8f4f0 40%, #d4edda 100%)" }}>

      {/* Nature Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
        {/* Sun */}
        <div style={{
          position: "absolute", top: "60px", right: "15%",
          width: "120px", height: "120px",
          background: "radial-gradient(circle, #fff9c4, #ffd54f, rgba(255,213,79,0))",
          borderRadius: "50%",
          animation: "pulse 4s ease-in-out infinite"
        }} />
        {/* Clouds */}
        {[
          { top: "8%", left: "5%", width: "200px", opacity: 0.9, delay: "0s" },
          { top: "12%", left: "30%", width: "150px", opacity: 0.7, delay: "2s" },
          { top: "6%", right: "25%", width: "180px", opacity: 0.8, delay: "1s" },
        ].map((cloud, i) => (
          <div key={i} style={{
            position: "absolute",
            top: cloud.top, left: cloud.left, right: cloud.right,
            width: cloud.width,
            height: "60px",
            background: `rgba(255,255,255,${cloud.opacity})`,
            borderRadius: "50px",
            filter: "blur(8px)",
            animation: `float ${6 + i}s ease-in-out infinite`,
            animationDelay: cloud.delay
          }} />
        ))}
        {/* Mountains */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          height: "35vh",
          background: "linear-gradient(180deg, transparent, #2d5a27)",
          clipPath: "polygon(0% 100%, 0% 60%, 8% 30%, 16% 55%, 24% 20%, 32% 50%, 40% 15%, 48% 45%, 56% 25%, 64% 50%, 72% 20%, 80% 45%, 88% 30%, 96% 55%, 100% 35%, 100% 100%)"
        }} />
        {/* Forest layer */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          height: "20vh",
          background: "linear-gradient(180deg, #3d7a35, #1a4a15)",
          clipPath: "polygon(0% 100%, 0% 70%, 3% 40%, 6% 65%, 9% 35%, 12% 60%, 15% 30%, 18% 55%, 21% 25%, 24% 50%, 27% 35%, 30% 55%, 33% 20%, 36% 50%, 39% 30%, 42% 55%, 45% 25%, 48% 50%, 51% 35%, 54% 55%, 57% 20%, 60% 50%, 63% 30%, 66% 55%, 69% 25%, 72% 50%, 75% 35%, 78% 55%, 81% 20%, 84% 50%, 87% 30%, 90% 55%, 93% 25%, 96% 50%, 100% 35%, 100% 100%)"
        }} />
        {/* Birds */}
        {[20, 35, 50, 65, 80].map((left, i) => (
          <div key={i} style={{
            position: "absolute",
            top: `${15 + i * 3}%`,
            left: `${left}%`,
            fontSize: "16px",
            animation: `fly ${8 + i * 2}s linear infinite`,
            animationDelay: `${i * 1.5}s`,
            opacity: 0.7
          }}>🐦</div>
        ))}
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          33% { transform: translateY(-15px) translateX(10px); }
          66% { transform: translateY(-8px) translateX(-5px); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.9; }
        }
        @keyframes fly {
          0% { transform: translateX(-50px); opacity: 0; }
          10% { opacity: 0.7; }
          90% { opacity: 0.7; }
          100% { transform: translateX(200px); opacity: 0; }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 0.8s ease forwards; }
        .fade-up-2 { animation: fadeUp 0.8s ease 0.2s forwards; opacity: 0; }
        .fade-up-3 { animation: fadeUp 0.8s ease 0.4s forwards; opacity: 0; }
      `}</style>

      {/* Navbar */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: "rgba(255,255,255,0.3)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255,255,255,0.5)",
        padding: "16px 32px",
        display: "flex", justifyContent: "space-between", alignItems: "center"
      }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "24px" }}>🌿</span>
          <span style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "20px", fontWeight: "700",
            color: "#1a2e1a"
          }}>VASU AGENTS</span>
        </div>

        {/* Auth Section */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {user ? (
            <div style={{ position: "relative" }}>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                style={{
                  display: "flex", alignItems: "center", gap: "8px",
                  background: "rgba(255,255,255,0.8)",
                  border: "1.5px solid rgba(255,255,255,0.9)",
                  borderRadius: "50px", padding: "6px 14px 6px 6px",
                  cursor: "pointer", transition: "all 0.2s"
                }}
              >
                <img
                  src={user.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.user_metadata?.full_name || user.email)}&background=2d5a27&color=fff&size=32`}
                  style={{ width: "32px", height: "32px", borderRadius: "50%", objectFit: "cover" }}
                />
                <span style={{ fontSize: "13px", fontWeight: "500", color: "#1a2e1a" }}>
                  {user.user_metadata?.full_name?.split(" ")[0] || user.email?.split("@")[0]}
                </span>
                <span style={{ fontSize: "10px", color: "#5a7a5a" }}>▼</span>
              </button>

              {/* Dropdown */}
              {showDropdown && (
                <div style={{
                  position: "absolute", top: "50px", right: 0,
                  background: "rgba(255,255,255,0.95)",
                  borderRadius: "16px", padding: "8px",
                  boxShadow: "0 10px 40px rgba(0,0,0,0.15)",
                  border: "1px solid rgba(255,255,255,0.9)",
                  minWidth: "160px", zIndex: 200
                }}>
                  <Link
                    href="/dashboard"
                    onClick={() => setShowDropdown(false)}
                    style={{
                      display: "block", padding: "10px 14px",
                      borderRadius: "10px", fontSize: "13px",
                      color: "#1a2e1a", textDecoration: "none",
                      transition: "background 0.2s"
                    }}
                    onMouseEnter={e => e.target.style.background = "#f0f7f0"}
                    onMouseLeave={e => e.target.style.background = "transparent"}
                  >
                    🏠 Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    style={{
                      display: "block", width: "100%", textAlign: "left",
                      padding: "10px 14px", borderRadius: "10px",
                      fontSize: "13px", color: "#c0392b",
                      background: "transparent", border: "none",
                      cursor: "pointer", transition: "background 0.2s"
                    }}
                    onMouseEnter={e => e.target.style.background = "#fff5f5"}
                    onMouseLeave={e => e.target.style.background = "transparent"}
                  >
                    🚪 Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <button
                onClick={() => openAuth("login")}
                style={{
                  padding: "8px 20px", borderRadius: "50px",
                  background: "rgba(255,255,255,0.6)",
                  border: "1.5px solid rgba(255,255,255,0.8)",
                  color: "#1a2e1a", fontSize: "13px", fontWeight: "500",
                  cursor: "pointer", transition: "all 0.2s"
                }}
              >
                Login
              </button>
              <button
                onClick={() => openAuth("signup")}
                style={{
                  padding: "8px 20px", borderRadius: "50px",
                  background: "linear-gradient(135deg, #2d5a27, #4a7c59)",
                  border: "none", color: "white",
                  fontSize: "13px", fontWeight: "500",
                  cursor: "pointer", transition: "all 0.2s"
                }}
              >
                Get Started
              </button>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{
        position: "relative", zIndex: 1,
        minHeight: "100vh",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        textAlign: "center", padding: "120px 24px 200px"
      }}>
        <p className="fade-up" style={{
          fontSize: "13px", fontWeight: "500", letterSpacing: "3px",
          textTransform: "uppercase", color: "#4a7c59", marginBottom: "16px"
        }}>
          🌱 Welcome to VASU AGENTS
        </p>
        <h1 className="fade-up-2" style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "clamp(40px, 8vw, 80px)",
          fontWeight: "700", lineHeight: "1.1",
          color: "#1a2e1a", marginBottom: "24px"
        }}>
          Coming Soon
        </h1>
        <p className="fade-up-3" style={{
          fontSize: "clamp(16px, 2vw, 20px)",
          color: "#5a7a5a", maxWidth: "500px",
          lineHeight: "1.6", marginBottom: "40px"
        }}>
          Something beautiful is growing here.
        </p>

        {!user && (
          <div className="fade-up-3" style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center" }}>
            <button
              onClick={() => openAuth("signup")}
              style={{
                padding: "14px 32px", borderRadius: "50px",
                background: "linear-gradient(135deg, #2d5a27, #4a7c59)",
                border: "none", color: "white",
                fontSize: "15px", fontWeight: "600",
                cursor: "pointer",
                boxShadow: "0 8px 24px rgba(45,90,39,0.3)"
              }}
            >
              Get Started Free 🌿
            </button>
            <button
              onClick={() => openAuth("login")}
              style={{
                padding: "14px 32px", borderRadius: "50px",
                background: "rgba(255,255,255,0.7)",
                border: "1.5px solid rgba(255,255,255,0.9)",
                color: "#1a2e1a", fontSize: "15px", fontWeight: "600",
                cursor: "pointer"
              }}
            >
              Login
            </button>
          </div>
        )}

        {user && (
          <div className="fade-up-3">
            <Link
              href="/dashboard"
              style={{
                padding: "14px 32px", borderRadius: "50px",
                background: "linear-gradient(135deg, #2d5a27, #4a7c59)",
                color: "white", fontSize: "15px", fontWeight: "600",
                textDecoration: "none",
                boxShadow: "0 8px 24px rgba(45,90,39,0.3)",
                display: "inline-block"
              }}
            >
              Go to Dashboard 🌿
            </Link>
          </div>
        )}
      </section>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuth}
        onClose={() => setShowAuth(false)}
        defaultTab={authTab}
      />

      {/* Click outside dropdown */}
      {showDropdown && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowDropdown(false)}
        />
      )}

    </main>
  );
}