'use client'

import { useEffect, useState } from 'react'

export default function UsersPage() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetch('/api/users')
      .then(r => r.json())
      .then(data => {
        if (data.users) setUsers(data.users)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const filtered = users.filter(u =>
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.name.toLowerCase().includes(search.toLowerCase())
  )

  const totalUsers = users.length
  const proUsers = users.filter(u => u.plan === 'Pro').length
  const agencyUsers = users.filter(u => u.plan === 'Agency').length

  return (
    <div style={{ color: "#fff", fontFamily: "Inter, sans-serif" }}>
      <h1 style={{ fontSize: "28px", fontWeight: 700, marginBottom: "8px", background: "linear-gradient(135deg, #fff, #94a3b8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Users</h1>
      <p style={{ color: "#64748b", marginBottom: "32px", fontSize: "15px" }}>Manage your SEOAgent user base</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "32px" }}>
        {[
          { label: "Total Users", value: totalUsers, color: "#6366f1" },
          { label: "Pro Users", value: proUsers, color: "#10b981" },
          { label: "Agency Users", value: agencyUsers, color: "#f59e0b" },
        ].map((stat) => (
          <div key={stat.label} style={{
            background: "linear-gradient(135deg, rgba(99,102,241,0.1), rgba(15,23,42,0.8))",
            border: "1px solid rgba(99,102,241,0.2)",
            borderRadius: "16px",
            padding: "24px",
          }}>
            <div style={{ color: "#64748b", fontSize: "13px", marginBottom: "12px", textTransform: "uppercase", letterSpacing: "0.05em" }}>{stat.label}</div>
            <div style={{ fontSize: "32px", fontWeight: 700, color: stat.color }}>{stat.value}</div>
          </div>
        ))}
      </div>

      <div style={{ background: "linear-gradient(135deg, rgba(99,102,241,0.08), rgba(15,23,42,0.9))", border: "1px solid rgba(99,102,241,0.15)", borderRadius: "16px", padding: "28px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h2 style={{ fontSize: "18px", fontWeight: 600, color: "#e2e8f0" }}>All Users</h2>
          <input
            placeholder="Search users..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ padding: "8px 16px", backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "#fff", fontSize: "14px", outline: "none", width: "200px" }}
          />
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
            {loading ? (
              <tr><td colSpan={5} style={{ padding: "40px 16px", textAlign: "center", color: "#475569" }}>Loading users...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={5} style={{ padding: "40px 16px", textAlign: "center", color: "#475569" }}>No users yet — share your app to get your first signup! 🚀</td></tr>
            ) : (
              filtered.map(u => (
                <tr key={u.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                  <td style={{ padding: "14px 16px", color: "#e2e8f0" }}>{u.name}</td>
                  <td style={{ padding: "14px 16px", color: "#94a3b8" }}>{u.email}</td>
                  <td style={{ padding: "14px 16px" }}>
                    <span style={{
                      background: u.plan === 'Pro' ? 'rgba(16,185,129,0.2)' : u.plan === 'Agency' ? 'rgba(245,158,11,0.2)' : 'rgba(148,163,184,0.2)',
                      color: u.plan === 'Pro' ? '#10b981' : u.plan === 'Agency' ? '#f59e0b' : '#94a3b8',
                      padding: '3px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: 600
                    }}>{u.plan}</span>
                  </td>
                  <td style={{ padding: "14px 16px", color: "#94a3b8" }}>{u.joined}</td>
                  <td style={{ padding: "14px 16px" }}>
                    <span style={{
                      background: 'rgba(16,185,129,0.2)', color: '#10b981',
                      padding: '3px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: 600
                    }}>Active</span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}