import Link from "next/link";

const agentData = {
  "chat-agent": {
    icon: "💬",
    title: "Chat Agent",
    tagline: "24/7 AI Customer Support for Your Website",
    description: "Deploy an AI agent on your website that instantly answers customer questions, remembers conversations and never sleeps.",
    status: "live",
    features: [
      { icon: "⚡", title: "Instant Replies", desc: "Responds to customers in under 2 seconds, 24/7" },
      { icon: "🧠", title: "Smart Memory", desc: "Remembers full conversation context like a human" },
      { icon: "🌐", title: "Any Language", desc: "Replies in Hindi, English or any language customer uses" },
      { icon: "📊", title: "Analytics", desc: "See every conversation and what customers ask most" },
      { icon: "🔧", title: "Easy Setup", desc: "Just paste one line of code on your website" },
      { icon: "🎯", title: "Your Knowledge", desc: "Trained on your business info, products and FAQs" },
    ],
    useCases: [
      "🏥 Clinics — Answer patient queries about timings and fees",
      "🛒 Shops — Tell customers about products and availability",
      "🍕 Restaurants — Share menu, timings and take reservations",
      "💇 Salons — Book appointments and answer service queries",
      "🏫 Coaching — Answer admission and fee queries",
    ],
    monthly: "₹1,999",
    yearly: "₹19,999",
    demo: "https://your-streamlit-app.streamlit.app",
  },
  "whatsapp-agent": {
    icon: "📱",
    title: "WhatsApp Agent",
    tagline: "Auto-Reply to WhatsApp Messages 24/7",
    description: "Your business WhatsApp number gets an AI brain. Every customer message gets an instant intelligent reply automatically.",
    status: "live",
    features: [
      { icon: "⚡", title: "Instant Replies", desc: "Every message answered in seconds automatically" },
      { icon: "🧠", title: "Smart Memory", desc: "Handles full back and forth conversations naturally" },
      { icon: "🌐", title: "Hindi + English", desc: "Understands and replies in customer language" },
      { icon: "📞", title: "Owner Alerts", desc: "Notifies you for important queries" },
      { icon: "👥", title: "Multiple Customers", desc: "Handles hundreds of customers simultaneously" },
      { icon: "🎯", title: "Your Business Info", desc: "Knows your products, timings, prices and FAQs" },
    ],
    useCases: [
      "🏥 Doctors — Patients ask about appointments on WhatsApp",
      "🛒 Shops — Customers ask about products and prices",
      "🍕 Restaurants — Take orders and answer menu queries",
      "💇 Salons — Book appointments via WhatsApp",
      "🏠 Real Estate — Answer property queries instantly",
    ],
    monthly: "₹1,999",
    yearly: "₹19,999",
    demo: null,
  },
};

export default async function AgentPage({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const agent = agentData[slug];

  if (!agent) {
    return (
      <main className="min-h-screen bg-[#0a0a0f] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🤖</div>
          <h1 className="text-3xl font-bold mb-4">Agent Coming Soon!</h1>
          <p className="text-gray-400 mb-8">We are building this agent. Check back soon!</p>
          <Link href="/" className="px-6 py-3 bg-violet-600 rounded-xl hover:bg-violet-500 transition">
            Back to Home
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white">

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0f]/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🤖</span>
            <span className="text-xl font-bold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
              AgentFlow
            </span>
          </Link>
          <Link href="/" className="text-gray-400 hover:text-white transition text-sm">
            Back to All Agents
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="text-8xl mb-6">{agent.icon}</div>
          {agent.status === "live" && (
            <div className="inline-flex items-center gap-2 bg-green-500/20 border border-green-500/30 rounded-full px-4 py-2 text-sm text-green-300 mb-6">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              Live and Ready to Deploy
            </div>
          )}
          <h1 className="text-5xl md:text-6xl font-bold mb-4">{agent.title}</h1>
          <p className="text-2xl text-violet-400 mb-6">{agent.tagline}</p>
          <p className="text-gray-400 text-lg mb-10 max-w-2xl mx-auto">{agent.description}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-violet-600 hover:bg-violet-500 rounded-xl text-lg font-semibold transition">
              Get Started — {agent.monthly}/month
            </button>
            {agent.demo && (
              <a
                href={agent.demo}
                target="_blank"
                rel="noreferrer"
                className="px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-lg transition"
              >
                Try Live Demo
              </a>
            )}
          </div>
          <p className="text-sm text-gray-500 mt-4">
            30 day free trial • No credit card required • Setup in 10 minutes
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Everything Included</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agent.features.map((feature, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-violet-500/50 transition">
                <div className="text-3xl mb-3">{feature.icon}</div>
                <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      {/* Changed bg-white/2 to bg-white/[0.02] here */}
      <section className="py-20 px-6 bg-white/[0.02]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Perfect For Every Business</h2>
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 space-y-4">
            {agent.useCases.map((useCase, i) => (
              <div key={i} className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/10">
                <span className="text-lg">{useCase}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-12">Simple Pricing</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
              <h3 className="text-xl font-bold mb-2">Monthly</h3>
              <div className="text-4xl font-bold text-violet-400 mb-1">{agent.monthly}</div>
              <div className="text-gray-500 text-sm mb-6">per month</div>
              <button className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl transition">
                Get Started
              </button>
            </div>
            <div className="bg-violet-600/20 border border-violet-500 rounded-2xl p-8">
              <div className="text-xs text-violet-300 bg-violet-600/30 rounded-full px-3 py-1 inline-block mb-3">
                Save ₹4,000
              </div>
              <h3 className="text-xl font-bold mb-2">Yearly</h3>
              <div className="text-4xl font-bold text-violet-400 mb-1">{agent.yearly}</div>
              <div className="text-gray-500 text-sm mb-6">per year</div>
              <button className="w-full py-3 bg-violet-600 hover:bg-violet-500 rounded-xl transition">
                Get Started
              </button>
            </div>
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
          <p className="text-gray-500 text-sm">2026 AgentFlow. Built for Indian businesses.</p>
        </div>
      </footer>

    </main>
  );
}