"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login");
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
      <main className="min-h-screen bg-[#0a0a0f] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-spin">⚙️</div>
          <p className="text-gray-400">Loading your dashboard...</p>
        </div>
      </main>
    );
  }

  const agents = [
    {
      icon: "💬",
      title: "Chat Agent",
      status: "active",
      conversations: 0,
      color: "violet",
      slug: "chat-agent"
    },
    {
      icon: "📱",
      title: "WhatsApp Agent",
      status: "active",
      conversations: 0,
      color: "green",
      slug: "whatsapp-agent"
    },
    {
      icon: "📞",
      title: "Voice Agent",
      status: "coming",
      conversations: 0,
      color: "blue",
      slug: "voice-agent"
    },
    {
      icon: "📧",
      title: "Email Agent",
      status: "coming",
      conversations: 0,
      color: "orange",
      slug: "email-agent"
    },
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
              {user?.email}
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
            Welcome back! 👋
          </h1>
          <p className="text-gray-400">
            Manage your AI agents and monitor their performance.
          </p>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { icon: "🤖", label: "Active Agents", value: "2" },
            { icon: "💬", label: "Total Conversations", value: "0" },
            { icon: "⚡", label: "Avg Response Time", value: "<2s" },
            { icon: "📈", label: "Satisfaction Rate", value: "100%" },
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-white/5 border border-white/10 rounded-2xl p-5"
            >
              <div className="text-2xl mb-2">{stat.icon}</div>
              <div className="text-2xl font-bold text-violet-400">
                {stat.value}
              </div>
              <div className="text-gray-500 text-sm mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* My Agents */}
        <div className="mb-10">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">My Agents</h2>
            <Link
              href="/#agents"
              className="text-sm text-violet-400 hover:text-violet-300 transition"
            >
              Add New Agent +
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {agents.map((agent, i) => (
              <div
                key={i}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-violet-500/50 transition"
              >
                <div className="flex justify-between items-start mb-4">
                  <span className="text-3xl">{agent.icon}</span>
                  {agent.status === "active" ? (
                    <span className="flex items-center gap-1 text-xs bg-green-500/20 text-green-400 border border-green-500/30 px-2 py-1 rounded-full">
                      <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                      Active
                    </span>
                  ) : (
                    <span className="text-xs bg-white/10 text-gray-400 border border-white/20 px-2 py-1 rounded-full">
                      Coming Soon
                    </span>
                  )}
                </div>
                <h3 className="font-bold mb-1">{agent.title}</h3>
                <p className="text-gray-500 text-sm mb-4">
                  {agent.conversations} conversations
                </p>
                {agent.status === "active" && (
                  <Link
                    href={`/agents/${agent.slug}`}
                    className="text-xs text-violet-400 hover:text-violet-300 transition"
                  >
                    View Agent →
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                icon: "📝",
                title: "Edit Knowledge Base",
                desc: "Update your business information",
                action: "Edit"
              },
              {
                icon: "📊",
                title: "View Analytics",
                desc: "See conversation statistics",
                action: "View"
              },
              {
                icon: "⚙️",
                title: "Account Settings",
                desc: "Manage your account details",
                action: "Settings"
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 flex justify-between items-center hover:border-violet-500/50 transition cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <span className="text-3xl">{item.icon}</span>
                  <div>
                    <h3 className="font-bold text-sm">{item.title}</h3>
                    <p className="text-gray-500 text-xs">{item.desc}</p>
                  </div>
                </div>
                <span className="text-xs text-violet-400 border border-violet-500/30 px-3 py-1 rounded-full">
                  {item.action}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Upgrade Banner */}
        <div className="bg-gradient-to-r from-violet-600/20 to-purple-600/20 border border-violet-500/30 rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold mb-2">
            Upgrade to Pro 🚀
          </h3>
          <p className="text-gray-400 mb-6">
            Get 3 agents, advanced analytics and priority support
          </p>
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