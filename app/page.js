import Link from "next/link";

const agents = [
  {
    icon: "💬",
    title: "Chat Agent",
    description: "24/7 AI customer support for your website. Answers customer queries instantly.",
    status: "live",
    slug: "chat-agent",
    color: "from-violet-600 to-purple-600",
  },
  {
    icon: "📱",
    title: "WhatsApp Agent",
    description: "Auto-reply to WhatsApp messages. Every Indian business needs this.",
    status: "live",
    slug: "whatsapp-agent",
    color: "from-green-600 to-emerald-600",
  },
  {
    icon: "📞",
    title: "Voice Call Agent",
    description: "AI picks up calls, answers queries, transfers important calls to owner.",
    status: "coming",
    slug: "voice-agent",
    color: "from-blue-600 to-cyan-600",
  },
  {
    icon: "📧",
    title: "Email Agent",
    description: "Reads and replies to emails automatically 24/7.",
    status: "coming",
    slug: "email-agent",
    color: "from-orange-600 to-amber-600",
  },
  {
    icon: "📅",
    title: "Appointment Agent",
    description: "Customers book appointments automatically without calling.",
    status: "coming",
    slug: "appointment-agent",
    color: "from-pink-600 to-rose-600",
  },
  {
    icon: "🛒",
    title: "Order Taking Agent",
    description: "Takes orders from customers automatically through chat.",
    status: "coming",
    slug: "order-agent",
    color: "from-red-600 to-orange-600",
  },
];

const plans = [
  {
    name: "Starter",
    price: "₹1,999",
    period: "month",
    features: [
      "1 AI Agent",
      "500 conversations/month",
      "Basic analytics",
      "Email support",
    ],
    highlighted: false,
  },
  {
    name: "Pro",
    price: "₹3,999",
    period: "month",
    features: [
      "3 AI Agents",
      "2000 conversations/month",
      "Advanced analytics",
      "Priority support",
      "Custom branding",
    ],
    highlighted: true,
  },
  {
    name: "Business",
    price: "₹7,999",
    period: "month",
    features: [
      "Unlimited Agents",
      "Unlimited conversations",
      "Full analytics",
      "24/7 support",
      "Custom branding",
      "API access",
    ],
    highlighted: false,
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white">

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0f]/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🤖</span>
            <span className="text-xl font-bold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
              AgentFlow
            </span>
          </div>
          <div className="hidden md:flex gap-8 text-sm text-gray-400">
            <a href="#agents" className="hover:text-white transition">Agents</a>
            <a href="#pricing" className="hover:text-white transition">Pricing</a>
            <a href="#how-it-works" className="hover:text-white transition">How It Works</a>
          </div>
          <div className="flex gap-3">
            <Link href="/login" className="px-4 py-2 text-sm text-gray-300 hover:text-white transition">
              Login
            </Link>
            <Link href="/signup" className="px-4 py-2 text-sm bg-violet-600 hover:bg-violet-500 rounded-lg transition">
              Get Started Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-violet-600/20 border border-violet-500/30 rounded-full px-4 py-2 text-sm text-violet-300 mb-8">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            AI Agents Live and Working Right Now
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Automate Your Business
            <span className="block bg-gradient-to-r from-violet-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              With AI Agents
            </span>
          </h1>
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
            Deploy AI agents that handle customer support, WhatsApp messages,
            phone calls and appointments — 24/7, automatically, for any business.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup" className="px-8 py-4 bg-violet-600 hover:bg-violet-500 rounded-xl text-lg font-semibold transition transform hover:scale-105">
              Start Free Trial 🚀
            </Link>
            <button className="px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-lg transition">
              Watch Demo ▶
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            No credit card required • Setup in 10 minutes • Cancel anytime
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 px-6 border-y border-white/10">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { number: "24/7", label: "Always Online" },
            { number: "<2s", label: "Response Time" },
            { number: "10min", label: "Setup Time" },
            { number: "₹0", label: "To Get Started" },
          ].map((stat, i) => (
            <div key={i}>
              <div className="text-3xl font-bold text-violet-400">{stat.number}</div>
              <div className="text-gray-500 text-sm mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Agents Section */}
      <section id="agents" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              All AI Agents
            </h2>
            <p className="text-gray-400 text-lg">
              Pick the agent your business needs. Deploy in minutes.
            </p>
          </div>

          {/* Big Agents Box */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {agents.map((agent, i) => (
                <div
                  key={i}
                  className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-violet-500/50 transition group cursor-pointer"
                >
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-4xl">{agent.icon}</span>
                    {agent.status === "live" ? (
                      <span className="flex items-center gap-1 text-xs bg-green-500/20 text-green-400 border border-green-500/30 px-2 py-1 rounded-full">
                        <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                        Live
                      </span>
                    ) : (
                      <span className="text-xs bg-white/10 text-gray-400 border border-white/20 px-2 py-1 rounded-full">
                        Coming Soon
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-violet-400 transition">
                    {agent.title}
                  </h3>
                  <p className="text-gray-400 text-sm mb-4">
                    {agent.description}
                  </p>
                  {agent.status === "live" ? (
                    <Link
                      href={`/agents/${agent.slug}`}
                      className="inline-flex items-center gap-2 text-sm text-violet-400 hover:text-violet-300 transition"
                    >
                      Learn More →
                    </Link>
                  ) : (
                    <span className="text-sm text-gray-600">
                      Notify me when ready
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-6 bg-white/2">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">How It Works</h2>
          <p className="text-gray-400 mb-16">Get your AI agent running in 3 simple steps</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Choose Your Agent", desc: "Pick the AI agent that fits your business needs from our collection." },
              { step: "02", title: "Add Your Info", desc: "Tell us about your business — timings, services, FAQs. Takes 5 minutes." },
              { step: "03", title: "Go Live!", desc: "Your AI agent is deployed and starts handling customers automatically." },
            ].map((item, i) => (
              <div key={i} className="relative">
                <div className="text-6xl font-bold text-white/5 mb-4">{item.step}</div>
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Simple Pricing</h2>
            <p className="text-gray-400">Start free. Pay only when you are ready.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, i) => (
              <div
                key={i}
                className={`rounded-2xl p-8 border ${
                  plan.highlighted
                    ? "bg-violet-600/20 border-violet-500 scale-105"
                    : "bg-white/5 border-white/10"
                }`}
              >
                {plan.highlighted && (
                  <div className="text-xs text-violet-300 bg-violet-600/30 rounded-full px-3 py-1 inline-block mb-4">
                    Most Popular
                  </div>
                )}
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="text-4xl font-bold text-violet-400 mb-1">
                  {plan.price}
                </div>
                <div className="text-gray-500 text-sm mb-6">per {plan.period}</div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm text-gray-300">
                      <span className="text-green-400">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <button
                  className={`w-full py-3 rounded-xl font-semibold transition ${
                    plan.highlighted
                      ? "bg-violet-600 hover:bg-violet-500"
                      : "bg-white/10 hover:bg-white/20"
                  }`}
                >
                  Get Started
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🤖</span>
            <span className="text-xl font-bold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
              AgentFlow
            </span>
          </div>
          <p className="text-gray-500 text-sm">
            © 2026 AgentFlow. Built with ❤️ for Indian businesses.
          </p>
          <div className="flex gap-6 text-sm text-gray-500">
            <a href="#" className="hover:text-white transition">Privacy</a>
            <a href="#" className="hover:text-white transition">Terms</a>
            <a href="#" className="hover:text-white transition">Contact</a>
          </div>
        </div>
      </footer>

    </main>
  );
}