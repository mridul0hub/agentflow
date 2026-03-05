"use client";
import { useState, useEffect } from "react";

export default function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) setShow(true);
  }, []);

  const acceptAll = () => {
    localStorage.setItem("cookie-consent", "accepted");
    setShow(false);
  };

  const declineAll = () => {
    localStorage.setItem("cookie-consent", "declined");
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-6 left-6 right-6 md:left-auto md:right-6 md:max-w-md z-50">
      <div className="bg-[#1a1a2e] border border-white/20 rounded-2xl p-6 shadow-2xl">
        <div className="flex items-start gap-3 mb-4">
          <span className="text-2xl">🍪</span>
          <div>
            <h3 className="font-bold text-white mb-1">We use cookies</h3>
            <p className="text-gray-400 text-sm">
              We use cookies to improve your experience and analyze website traffic.
              By accepting, you agree to our use of cookies.
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={acceptAll}
            className="flex-1 py-2 bg-violet-600 hover:bg-violet-500 rounded-xl text-sm font-semibold transition"
          >
            Accept All
          </button>
          <button
            onClick={declineAll}
            className="flex-1 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-sm transition"
          >
            Decline
          </button>
        </div>
      </div>
    </div>
  );
}