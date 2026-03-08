"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/");
      } else {
        setUser(session.user);
      }
      setLoading(false);
    };
    getUser();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  if (loading) {
    return (
      <main style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #c9e8f5 0%, #e8f4f0 100%)",
        display: "flex", alignItems: "center", justifyContent: "center"
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "40px", marginBottom: "16px" }}>🌿</div>
          <p style={{ color: "#4a7c59", fontFamily: "'DM Sans', sans-serif" }}>Loading...</p>
        </div>
      </main>
    );
  }

  return (
    <main style={{
      minHeight: "100vh",
      background: "linear-gradient(180deg, #c9e8f5 0%, #e8f4f0 40%, #d4edda 100%)"
    }}>

      {/* Navbar */}
      <nav style={{
        background: "rgba(255,255,255,0.4)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255,255,255,0.5)",
        padding: "16px 32px",
        display: "flex", justifyContent: "space-between", alignItems: "center"
      }}>
        <Link href="/" style={{
          display: "flex", alignItems: "center", gap: "8px",
          textDecoration: "none"
        }}>
          <span style={{ fontSize: "24px" }}>🌿</span>
          <span style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "20px", fontWeight: "700", color: "#1a2e1a"
          }}>VASU AGENTS</span>
        </Link>

        {/* User Avatar */}
        <div style={{ position: "relative" }}>
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            style={{
              display: "flex", alignItems: "center", gap: "8px",
              background: "rgba(255,255,255,0.8)",
              border: "1.5px solid rgba(255,255,255,0.9)",
              borderRadius: "50px", padding: "6px 14px 6px 6px",
              cursor: "pointer"
            }}
          >
            <img
              src={user?.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.user_metadata?.full_name || user?.email)}&background=2d5a27&color=fff&size=32`}
              style={{ width: "32px", height: "32px", borderRadius: "50%" }}
            />
            <span style={{ fontSize: "13px", fontWeight: "500", color: "#1a2e1a" }}>
              {user?.user_metadata?.full_name?.split(" ")[0] || user?.email?.split("@")[0]}
            </span>
            <span style={{ fontSize: "10px", color: "#5a7a5a" }}>▼</span>
          </button>

          {showDropdown && (
            <div style={{
              position: "absolute", top: "50px", right: 0,
              background: "rgba(255,255,255,0.95)",
              borderRadius: "16px", padding: "8px",
              boxShadow: "0 10px 40px rgba(0,0,0,0.15)",
              minWidth: "160px", zIndex: 200
            }}>
              <div style={{ padding: "10px 14px", fontSize: "12px", color: "#5a7a5a", borderBottom: "1px solid #f0f0f0", marginBottom: "4px" }}>
                {user?.email}
              </div>
              <button
                onClick={handleLogout}
                style={{
                  display: "block", width: "100%", textAlign: "left",
                  padding: "10px 14px", borderRadius: "10px",
                  fontSize: "13px", color: "#c0392b",
                  background: "transparent", border: "none",
                  cursor: "pointer"
                }}
              >
                🚪 Logout
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Dashboard Content */}
      <div style={{ padding: "40px 32px", maxWidth: "1200px", margin: "0 auto" }}>
        <h1 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "32px", color: "#1a2e1a", marginBottom: "8px"
        }}>
          Welcome, {user?.user_metadata?.full_name?.split(" ")[0] || "there"}! 👋
        </h1>
        <p style={{ color: "#5a7a5a", marginBottom: "40px" }}>
          Your dashboard is ready.
        </p>

        {/* Empty Dashboard — content added later */}
        <div style={{
          background: "rgba(255,255,255,0.6)",
          backdropFilter: "blur(10px)",
          border: "1.5px solid rgba(255,255,255,0.8)",
          borderRadius: "24px",
          padding: "60px",
          textAlign: "center"
        }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>🌱</div>
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "24px", color: "#1a2e1a", marginBottom: "8px"
          }}>
            Something is growing here
          </h2>
          <p style={{ color: "#5a7a5a" }}>
            Your content will appear here soon.
          </p>
        </div>
      </div>

      {showDropdown && (
        <div className="fixed inset-0 z-40" onClick={() => setShowDropdown(false)} />
      )}
    </main>
  );
}