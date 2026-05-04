'use client'

import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const router = useRouter()

  return (
    <div style={{ color: "#fff", fontFamily: "Inter, sans-serif" }}>
      <h1 style={{ fontSize: "24px", fontWeight: 700, marginBottom: "8px" }}>Dashboard</h1>
      <p style={{ color: "#94a3b8", marginBottom: "32px" }}>Welcome back to SEOAgent</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "32px" }}>
        {[
          { label: "Total Articles", value: "0", change: "+0 this week" },
          { label: "Total Users", value: "0", change: "+0 this week" },
          { label: "Revenue", value: "$0", change: "+$0 this month" },
          { label: "Active Plans", value: "0", change: "0 pro, 0 agency" },
        ].map((stat) => (
          <div key={stat.label} style={{
            background: "linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.05))",
            border: "1px solid rgba(99,102,241,0.3)",
            borderRadius: "12px",
            padding: "20px",
            boxShadow: "0 0 20px rgba(99,102,241,0.1)",
          }}>
            <div style={{ color: "#94a3b8", fontSize: "13px", marginBottom: "8px" }}>{stat.label}</div>
            <div style={{ fontSize: "28px", fontWeight: 700, marginBottom: "4px" }}>{stat.value}</div>
            <div style={{ color: "#6366f1", fontSize: "12px" }}>{stat.change}</div>
          </div>
        ))}
      </div>
      <div style={{
        background: "linear-gradient(135deg, rgba(99,102,241,0.1), rgba(139,92,246,0.05))",
        border: "1px solid rgba(99,102,241,0.2)",
        borderRadius: "12px",
        padding: "24px",
        boxShadow: "0 0 20px rgba(99,102,241,0.1)",
      }}>
        <h2 style={{ fontSize: "16px", fontWeight: 600, marginBottom: "16px" }}>Quick Actions</h2>
        <div style={{ display: "flex", gap: "12px" }}>
          {[
            { label: "Generate Article", color: "#6366f1", shadow: "0 0 20px rgba(99,102,241,0.5)", href: "/" },
            { label: "View Analytics", color: "transparent", shadow: "0 0 20px rgba(99,102,241,0.2)", href: "/dashboard/analytics" },
            { label: "Manage Users", color: "transparent", shadow: "0 0 20px rgba(99,102,241,0.2)", href: "/dashboard/users" },
          ].map((action) => (
            <button
              key={action.label}
              onClick={() => router.push(action.href)}
              style={{
                padding: "10px 20px",
                backgroundColor: action.color,
                border: "1px solid rgba(99,102,241,0.4)",
                borderRadius: "8px",
                color: "#fff",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: 500,
                boxShadow: action.shadow,
                transition: "all 0.2s",
              }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = "0 0 30px rgba(99,102,241,0.7)"}
              onMouseLeave={e => e.currentTarget.style.boxShadow = action.shadow}
            >
              {action.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}