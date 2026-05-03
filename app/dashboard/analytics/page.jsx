'use client'

export default function AnalyticsPage() {
  return (
    <div style={{ color: "#fff", fontFamily: "Inter, sans-serif" }}>
      <h1 style={{ fontSize: "28px", fontWeight: 700, marginBottom: "8px", background: "linear-gradient(135deg, #fff, #94a3b8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Analytics</h1>
      <p style={{ color: "#64748b", marginBottom: "32px", fontSize: "15px" }}>Track your SEO performance over time</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "32px" }}>
        {[
          { label: "Total Articles Generated", value: "142", change: "+12 this week", color: "#6366f1" },
          { label: "Avg SEO Score", value: "87", change: "+3 vs last month", color: "#10b981" },
          { label: "Organic Impressions", value: "24.5k", change: "+18% this month", color: "#f59e0b" },
        ].map((stat) => (
          <div key={stat.label} style={{
            background: "linear-gradient(135deg, rgba(99,102,241,0.1), rgba(15,23,42,0.8))",
            border: "1px solid rgba(99,102,241,0.2)",
            borderRadius: "16px",
            padding: "24px",
            boxShadow: "0 4px 24px rgba(0,0,0,0.2)",
          }}>
            <div style={{ color: "#64748b", fontSize: "13px", marginBottom: "12px", textTransform: "uppercase", letterSpacing: "0.05em" }}>{stat.label}</div>
            <div style={{ fontSize: "32px", fontWeight: 700, marginBottom: "8px", color: stat.color }}>{stat.value}</div>
            <div style={{ color: "#10b981", fontSize: "13px" }}>↑ {stat.change}</div>
          </div>
        ))}
      </div>

      <div style={{ background: "linear-gradient(135deg, rgba(99,102,241,0.08), rgba(15,23,42,0.9))", border: "1px solid rgba(99,102,241,0.15)", borderRadius: "16px", padding: "28px" }}>
        <h2 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "20px", color: "#e2e8f0" }}>SEO Score Over Time</h2>
        <div style={{ display: "flex", gap: "8px", alignItems: "flex-end", height: "120px" }}>
          {[65, 72, 68, 80, 75, 87, 85, 90, 87, 92, 88, 95].map((val, i) => (
            <div key={i} style={{ flex: 1, backgroundColor: `rgba(99,102,241,${val/100})`, borderRadius: "4px 4px 0 0", height: `${val}%`, transition: "all 0.3s" }} />
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "8px", color: "#475569", fontSize: "12px" }}>
          {["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"].map(m => <span key={m}>{m}</span>)}
        </div>
      </div>
    </div>
  );
}