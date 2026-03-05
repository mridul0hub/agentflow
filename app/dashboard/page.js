"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const getData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login");
        return;
      }

      setUser(session.user);

      // Get profile
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();
      setProfile(profileData);

      // Get agents
      const { data: agentsData } = await supabase
        .from("agents")
        .select("*")
        .eq("user_id", session.user.id);
      setAgents(agentsData || []);

      setLoading(false);
    };
    getData();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#0a0a0f] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-spin">⚙️</div>
          <p className="text-gray-400">Loading your dashboard...</p>
        </div>
      </main>
    );
  }

  const allAgents = [
    { icon: "💬", title: "Chat Agent", type: "chat-agent", status: "live" },
    { icon: "📱", title: "WhatsApp Agent", type: "whatsapp-agent", status: "live" },
    { icon: "📞", title: "Voice Agent", type: "voice-agent", status: "coming" },
    { icon: "📧", title: "Email Agent", type: "email-agent", status: "coming" },
  ];

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white">

      {/* Navbar */}
      <nav className="bg-[#0a0a0f]/80 backdrop-blur-md border-b border-white/10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🤖</span>
            <span className="text-xl font-bold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
              AgentFlow
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-gray-400 text-sm hidden md:block">
              {profile?.full_name || user?.email}
            </span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm bg-white/10 hover:bg-white/20 rounded-lg transition"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* Welcome */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold mb-2">
            Welcome, {profile?.full_name || "there"}! 👋
          </h1>
          <p className="text-gray-400">
            Manage your AI agents from your dashboard.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { icon: "🤖", label: "Active Agents", value: agents.length || "0" },
            { icon: "💬", label: "Conversations", value: "0" },
            { icon: "⚡", label: "Response Time", value: "<2s" },
            { icon: "📦", label: "Current Plan", value: profile?.plan || "Free" },
          ].map((stat, i) => (
            <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-5">
              <div className="text-2xl mb-2">{stat.icon}</div>
              <div className="text-2xl font-bold text-violet-400">{stat.value}</div>
              <div className="text-gray-500 text-sm mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Agents */}
        <div className="mb-10">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">All Agents</h2>
            <Link href="/#agents" className="text-sm text-violet-400 hover:text-violet-300">
              Explore Agents +
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {allAgents.map((agent, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-violet-500/50 transition">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-3xl">{agent.icon}</span>
                  {agent.status === "live" ? (
                    <span className="flex items-center gap-1 text-xs bg-green-500/20 text-green-400 border border-green-500/30 px-2 py-1 rounded-full">
                      <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                      Live
                    </span>
                  ) : (
                    <span className="text-xs bg-white/10 text-gray-400 border border-white/20 px-2 py-1 rounded-full">
                      Soon
                    </span>
                  )}
                </div>
                <h3 className="font-bold mb-3">{agent.title}</h3>
                {agent.status === "live" ? (
                  <Link
                    href={`/agents/${agent.type}`}
                    className="text-xs text-violet-400 hover:text-violet-300 transition"
                  >
                    Open Agent →
                  </Link>
                ) : (
                  <span className="text-xs text-gray-600">Coming Soon</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Upgrade Banner */}
        <div className="bg-gradient-to-r from-violet-600/20 to-purple-600/20 border border-violet-500/30 rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold mb-2">Upgrade to Pro 🚀</h3>
          <p className="text-gray-400 mb-6">Get unlimited agents and advanced analytics</p>
          <Link
            href="/#pricing"
            className="px-8 py-3 bg-violet-600 hover:bg-violet-500 rounded-xl font-semibold transition inline-block"
          >
            View Plans
          </Link>
        </div>

      </div>
    </main>
  );
}