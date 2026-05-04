'use client'
import { useState, useEffect } from 'react'
import { useUser, useClerk } from '@clerk/nextjs'

export default function SettingsPage() {
  const { user, isLoaded } = useUser()
  const { signOut } = useClerk()
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (isLoaded && user) {
      setFirstName(user.firstName || '')
      setLastName(user.lastName || '')
      setEmail(user.primaryEmailAddress?.emailAddress || '')
    }
  }, [isLoaded, user])

  const handleSave = async () => {
    try {
      await user.update({ firstName, lastName })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (err) {
      alert('Error saving: ' + err.message)
    }
  }

  if (!isLoaded) return <p style={{ color: '#94a3b8' }}>Loading...</p>

  return (
    <div style={{ color: "#fff", fontFamily: "Inter, sans-serif" }}>
      <h1 style={{ fontSize: "28px", fontWeight: 700, marginBottom: "8px", background: "linear-gradient(135deg, #fff, #94a3b8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Settings</h1>
      <p style={{ color: "#64748b", marginBottom: "32px", fontSize: "15px" }}>Manage your account and preferences</p>

      {/* Profile */}
      <div style={{ background: "linear-gradient(135deg, rgba(99,102,241,0.08), rgba(15,23,42,0.9))", border: "1px solid rgba(99,102,241,0.15)", borderRadius: "16px", padding: "28px", marginBottom: "24px" }}>
        <h2 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "20px", color: "#e2e8f0" }}>Profile</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
          <div>
            <label style={{ color: "#64748b", fontSize: "13px", display: "block", marginBottom: "8px" }}>First Name</label>
            <input value={firstName} onChange={e => setFirstName(e.target.value)} style={{ width: "100%", padding: "10px 14px", backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "#fff", fontSize: "14px", outline: "none", boxSizing: "border-box" }} />
          </div>
          <div>
            <label style={{ color: "#64748b", fontSize: "13px", display: "block", marginBottom: "8px" }}>Last Name</label>
            <input value={lastName} onChange={e => setLastName(e.target.value)} style={{ width: "100%", padding: "10px 14px", backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "#fff", fontSize: "14px", outline: "none", boxSizing: "border-box" }} />
          </div>
        </div>
        <div style={{ marginBottom: "20px" }}>
          <label style={{ color: "#64748b", fontSize: "13px", display: "block", marginBottom: "8px" }}>Email</label>
          <input value={email} disabled style={{ width: "100%", padding: "10px 14px", backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "#64748b", fontSize: "14px", outline: "none", boxSizing: "border-box" }} />
        </div>
        <button onClick={handleSave} style={{ padding: "10px 24px", backgroundColor: saved ? "#10b981" : "#6366f1", border: "none", borderRadius: "8px", color: "#fff", cursor: "pointer", fontSize: "14px", fontWeight: 600, transition: "all 0.2s" }}>
          {saved ? "✓ Saved!" : "Save Changes"}
        </button>
      </div>

      {/* Sign Out */}
      <div style={{ background: "linear-gradient(135deg, rgba(99,102,241,0.08), rgba(15,23,42,0.9))", border: "1px solid rgba(99,102,241,0.15)", borderRadius: "16px", padding: "28px" }}>
        <h2 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "8px", color: "#e2e8f0" }}>Sign Out</h2>
        <p style={{ color: "#64748b", fontSize: "14px", marginBottom: "20px" }}>Sign out of your account on this device.</p>
        <button onClick={() => signOut({ redirectUrl: '/' })} style={{ padding: "10px 24px", backgroundColor: "transparent", border: "1px solid rgba(99,102,241,0.4)", borderRadius: "8px", color: "#6366f1", cursor: "pointer", fontSize: "14px", fontWeight: 500 }}>
          Sign Out
        </button>
      </div>
    </div>
  )
}