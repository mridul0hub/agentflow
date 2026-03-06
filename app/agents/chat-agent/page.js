"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";

const KNOWLEDGE = `
Business Name: TechShop India
What we sell: Laptops, phones, accessories
Shipping: 3-5 business days across India
Return Policy: 7 days return, product must be unused
Payment Methods: UPI, Credit Card, Debit Card, COD
Support Email: support@techshopindia.com
Working Hours: 10am - 7pm Monday to Saturday
`;

export default function ChatAgentPage() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "👋 Hello! I am TechShop AI support agent. How can I help you today?"
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId] = useState(() => Math.random().toString(36).substring(7));
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setLoading(true);

    try {
      const BACKEND_URL = "https://web-production-b673d.up.railway.app";
      const response = await fetch(`${BACKEND_URL}/chat/message`, {
        
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: sessionId,
          message: userMessage,
          knowledge: KNOWLEDGE
        })
      });

      const data = await response.json();
      setMessages(prev => [...prev, { role: "assistant", content: data.reply }]);
    } catch (error) {
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "Sorry, I am having trouble connecting. Please try again!"
      }]);
    }

    setLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white flex flex-col">

      {/* Navbar */}
      <nav className="bg-[#0a0a0f]/80 backdrop-blur-md border-b border-white/10 px-6 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">🤖</span>
          <span className="text-xl font-bold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
            AgentFlow
          </span>
        </Link>
        <div className="flex items-center gap-2 text-sm text-green-400">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
          AI Agent Online
        </div>
      </nav>

      {/* Chat Header */}
      <div className="bg-gradient-to-r from-violet-600/20 to-purple-600/20 border-b border-white/10 px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center gap-4">
          <div className="text-4xl">💬</div>
          <div>
            <h1 className="text-xl font-bold">TechShop Support Agent</h1>
            <p className="text-gray-400 text-sm">Powered by AgentFlow AI • Replies instantly</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="max-w-3xl mx-auto space-y-4">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-3 rounded-2xl text-sm ${
                  msg.role === "user"
                    ? "bg-violet-600 text-white rounded-br-none"
                    : "bg-white/10 text-gray-100 rounded-bl-none border border-white/10"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-white/10 border border-white/10 px-4 py-3 rounded-2xl rounded-bl-none">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: "0.1s"}}></span>
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: "0.2s"}}></span>
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-white/10 px-6 py-4 bg-[#0a0a0f]">
        <div className="max-w-3xl mx-auto flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 transition"
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className="px-6 py-3 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-semibold transition"
          >
            Send
          </button>
        </div>
        <p className="text-center text-gray-600 text-xs mt-2">
          Powered by AgentFlow AI
        </p>
      </div>

    </main>
  );
}
