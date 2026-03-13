"use client";
import { useState, useEffect } from "react";

export default function CookieConsent() {
  const [show, setShow] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      // Small delay taaki page load ke baad smoothly aaye
      setTimeout(() => {
        setShow(true);
        setTimeout(() => setVisible(true), 50);
      }, 1500);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookie-consent", "accepted");
    localStorage.setItem("cookie-consent-date", new Date().toISOString());
    // Analytics enable karo (future use)
    dismiss();
  };

  const handleDecline = () => {
    localStorage.setItem("cookie-consent", "declined");
    localStorage.setItem("cookie-consent-date", new Date().toISOString());
    dismiss();
  };

  const dismiss = () => {
    setVisible(false);
    setTimeout(() => setShow(false), 400);
  };

  if (!show) return null;

  return (
    <>
      <style>{`
        .cc-wrap {
          position: fixed;
          bottom: 24px;
          right: 24px;
          z-index: 9999;
          max-width: 380px;
          width: calc(100vw - 48px);
          transform: translateY(${visible ? "0" : "20px"});
          opacity: ${visible ? "1" : "0"};
          transition: transform 0.4s cubic-bezier(0.16,1,0.3,1), opacity 0.4s ease;
        }
        .cc-card {
          background: #0a0a0a;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 20px;
          padding: 22px;
          box-shadow: 0 24px 64px rgba(0,0,0,0.25), 0 0 0 1px rgba(255,255,255,0.05);
        }
        .cc-top {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          margin-bottom: 18px;
        }
        .cc-icon {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: rgba(124,58,237,0.2);
          border: 1px solid rgba(124,58,237,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          flex-shrink: 0;
          margin-top: 1px;
        }
        .cc-title {
          font-size: 14px;
          font-weight: 600;
          color: white;
          margin-bottom: 5px;
          font-family: 'Geist', sans-serif;
          letter-spacing: -0.2px;
        }
        .cc-desc {
          font-size: 12px;
          color: rgba(255,255,255,0.45);
          line-height: 1.6;
          font-family: 'Geist', sans-serif;
        }
        .cc-btns {
          display: flex;
          gap: 8px;
        }
        .cc-accept {
          flex: 1;
          padding: 10px;
          border-radius: 10px;
          background: white;
          color: #0a0a0a;
          font-size: 13px;
          font-weight: 600;
          border: none;
          cursor: pointer;
          font-family: 'Geist', sans-serif;
          transition: all 0.15s;
        }
        .cc-accept:hover {
          background: #f4f4f5;
          transform: translateY(-1px);
        }
        .cc-decline {
          flex: 1;
          padding: 10px;
          border-radius: 10px;
          background: rgba(255,255,255,0.07);
          color: rgba(255,255,255,0.55);
          font-size: 13px;
          font-weight: 500;
          border: 1px solid rgba(255,255,255,0.08);
          cursor: pointer;
          font-family: 'Geist', sans-serif;
          transition: all 0.15s;
        }
        .cc-decline:hover {
          background: rgba(255,255,255,0.12);
          color: rgba(255,255,255,0.8);
        }
        @media (max-width: 480px) {
          .cc-wrap {
            bottom: 16px;
            right: 12px;
            left: 12px;
            max-width: 100%;
            width: auto;
          }
        }
      `}</style>

      <div className="cc-wrap">
        <div className="cc-card">
          <div className="cc-top">
            <div className="cc-icon">🍪</div>
            <div>
              <div className="cc-title">We use cookies</div>
              <div className="cc-desc">
                We use cookies to improve your experience and analyze traffic.
                Your data is never sold to third parties.
              </div>
            </div>
          </div>
          <div className="cc-btns">
            <button className="cc-accept" onClick={handleAccept}>Accept All</button>
            <button className="cc-decline" onClick={handleDecline}>Decline</button>
          </div>
        </div>
      </div>
    </>
  );
}