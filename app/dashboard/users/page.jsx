'use client'

export default function UsersPage() {
  return (
    <div style={{ color: "#fff", fontFamily: "Inter, sans-serif" }}>
      <h1 style={{ fontSize: "28px", fontWeight: 700, marginBottom: "8px", background: "linear-gradient(135deg, #fff, #94a3b8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Users</h1>
      <p style={{ color: "#64748b", marginBottom: "32px", fontSize: "15px" }}>Manage your SEOAgent user base</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "32px" }}>
        {[
          { label: "Total Users", value: "0", color: "#6366f1" },
          { label: "Pro Users", value: "0", color: "#10b981" },
          { label: "Agency Users", value: "0", color: "#f59e0b" },
        ].map((stat) => (
          <div key={stat.label} style={{
            background: "linear-gradient(135deg, rgba(99,102,241,0.1), rgba(15,23,42,0.8))",
            border: "1px solid rgba(99,102,241,0.2)",
            borderRadius: "16px",
            padding: "24px",
            boxShadow: "0 4px 24px rgba(0,0,0,0.2)",
          }}>
            <div style={{ color: "#64748b", fontSize: "13px", marginBottom: "12px", textTransform: "uppercase", letterSpacing: "0.05em" }}>{stat.label}</div>
            <div style={{ fontSize: "32px", fontWeight: 700, color: stat.color }}>{stat.value}</div>
          </div>
        ))}
      </div>

      <div style={{ background: "linear-gradient(135deg, rgba(99,102,241,0.08), rgba(15,23,42,0.9))", border: "1px solid rgba(99,102,241,0.15)", borderRadius: "16px", padding: "28px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h2 style={{ fontSize: "18px", fontWeight: 600, color: "#e2e8f0" }}>All Users</h2>
          <input placeholder="Search users..." style={{ padding: "8px 16px", backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "#fff", fontSize: "14px", outline: "none", width: "200px" }} />
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
              {["User", "Email", "Plan", "Joined", "Status"].map(h => (
                <th key={h} style={{ padding: "12px 16px", textAlign: "left", color: "#64748b", fontSize: "13px", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={5} style={{ padding: "40px 16px", textAlign: "center", color: "#475569", fontSize: "15px" }}>
                No users yet — share your app to get your first signup! 🚀
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}