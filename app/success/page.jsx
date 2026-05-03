"use client";

import { useEffect } from "react";

export default function SuccessPage() {
  useEffect(() => {
    const pk = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    if (!pk || typeof window === "undefined") return;

    const existing = document.querySelector('script[src="https://js.stripe.com/v3/"]');
    if (existing) {
      return;
    }

    const script = document.createElement("script");
    script.src = "https://js.stripe.com/v3/";
    script.async = true;
    script.onload = () => {
      if (window.Stripe) {
        window.Stripe(pk);
      }
    };
    document.body.appendChild(script);
  }, []);

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: "32px 20px",
        background:
          "linear-gradient(130deg, #030712 0%, #111827 42%, #1e1b4b 74%, #1d4ed8 100%)",
        color: "#e2e8f0",
        fontFamily:
          'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      <div
        style={{
          maxWidth: "520px",
          textAlign: "center",
          borderRadius: "18px",
          padding: "32px",
          border: "1px solid rgba(129, 140, 248, 0.35)",
          backgroundColor: "rgba(17, 24, 39, 0.85)",
          boxShadow: "0 28px 50px rgba(8, 10, 24, 0.55)",
        }}
      >
        <div
          style={{
            margin: "0 auto 16px",
            width: "56px",
            height: "56px",
            borderRadius: "16px",
            display: "grid",
            placeItems: "center",
            background:
              "linear-gradient(135deg, rgba(129,140,248,0.95), rgba(59,130,246,0.92))",
            fontSize: "28px",
            fontWeight: 800,
          }}
          aria-hidden="true"
        >
          ✓
        </div>
        <h1 style={{ margin: "0 0 12px", fontSize: "28px", color: "#f8fafc" }}>
          Payment successful! Welcome to SEOAgent
        </h1>
        <p style={{ margin: 0, lineHeight: 1.6, color: "#94a3b8", fontSize: "15px" }}>
          Thank you for subscribing. Your account benefits are linked to Stripe — you can
          return to the app anytime to generate content.
        </p>
        <a
          href="/"
          style={{
            marginTop: "22px",
            display: "inline-block",
            textDecoration: "none",
            fontWeight: 700,
            color: "#e0e7ff",
            border: "1px solid rgba(129,140,248,0.55)",
            borderRadius: "10px",
            padding: "10px 18px",
            transition: "all 220ms ease",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.boxShadow = "0 0 20px rgba(99,102,241,0.45)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          Back to home
        </a>
      </div>
    </main>
  );
}
