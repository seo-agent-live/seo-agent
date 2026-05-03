'use client'

import { useState } from 'react'

export default function PaymentsPage() {
  const [loading, setLoading] = useState(false)

  const transactions = [
    { id: 'INV-001', date: 'May 1, 2025', plan: 'Pro', amount: '$49.00', status: 'Paid' },
    { id: 'INV-002', date: 'Apr 1, 2025', plan: 'Pro', amount: '$49.00', status: 'Paid' },
    { id: 'INV-003', date: 'Mar 1, 2025', plan: 'Agency', amount: '$99.00', status: 'Paid' },
    { id: 'INV-004', date: 'Feb 1, 2025', plan: 'Free', amount: '$0.00', status: 'Free' },
  ]

  const handleUpgrade = async (plan) => {
    setLoading(true)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        alert('Error: ' + data.error)
      }
    } catch (err) {
      alert('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ color: '#e2e8f0', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#fff', margin: '0 0 8px' }}>Payments</h1>
      <p style={{ color: '#94a3b8', margin: '0 0 32px' }}>Manage your billing and subscription.</p>

      <div style={{
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '16px',
        padding: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '24px',
      }}>
        <div>
          <p style={{ color: '#94a3b8', fontSize: '12px', margin: '0 0 6px', letterSpacing: '1px' }}>CURRENT PLAN</p>
          <p style={{ color: '#fff', fontSize: '24px', fontWeight: 700, margin: '0 0 4px' }}>Free — $0/mo</p>
          <p style={{ color: '#94a3b8', fontSize: '14px', margin: 0 }}>Upgrade anytime</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => handleUpgrade('pro')}
            disabled={loading}
            style={{
              background: 'linear-gradient(135deg, #10b981, #06b6d4)',
              border: 'none',
              borderRadius: '10px',
              padding: '12px 20px',
              color: '#000',
              fontWeight: 700,
              fontSize: '14px',
              cursor: loading ? 'wait' : 'pointer',
              opacity: loading ? 0.7 : 1,
            }}>
            {loading ? 'Loading...' : 'Upgrade to Pro — $49/mo'}
          </button>
          <button
            onClick={() => handleUpgrade('agency')}
            disabled={loading}
            style={{
              background: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
              border: 'none',
              borderRadius: '10px',
              padding: '12px 20px',
              color: '#fff',
              fontWeight: 700,
              fontSize: '14px',
              cursor: loading ? 'wait' : 'pointer',
              opacity: loading ? 0.7 : 1,
            }}>
            {loading ? 'Loading...' : 'Upgrade to Agency — $99/mo'}
          </button>
        </div>
      </div>

      <div style={{
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '16px',
        padding: '24px',
        marginBottom: '24px',
      }}>
        <h2 style={{ color: '#fff', fontSize: '18px', fontWeight: 600, margin: '0 0 20px' }}>Billing History</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              {['INVOICE', 'DATE', 'PLAN', 'AMOUNT', 'STATUS'].map(h => (
                <th key={h} style={{ color: '#94a3b8', fontWeight: 500, padding: '0 0 12px', textAlign: 'left', fontSize: '12px' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {transactions.map((t) => (
              <tr key={t.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: '14px 0', color: '#94a3b8', fontFamily: 'monospace', fontSize: '12px' }}>{t.id}</td>
                <td style={{ padding: '14px 0', color: '#e2e8f0' }}>{t.date}</td>
                <td style={{ padding: '14px 0', color: '#e2e8f0' }}>{t.plan}</td>
                <td style={{ padding: '14px 0', color: '#e2e8f0' }}>{t.amount}</td>
                <td style={{ padding: '14px 0' }}>
                  <span style={{
                    background: t.status === 'Paid' ? 'rgba(16,185,129,0.2)' : 'rgba(148,163,184,0.2)',
                    color: t.status === 'Paid' ? '#10b981' : '#94a3b8',
                    padding: '3px 10px',
                    borderRadius: '999px',
                    fontSize: '12px',
                    fontWeight: 600,
                  }}>{t.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '16px',
        padding: '24px',
      }}>
        <h2 style={{ color: '#fff', fontSize: '18px', fontWeight: 600, margin: '0 0 20px' }}>Payment Method</h2>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '6px',
              padding: '4px 8px',
              color: '#e2e8f0',
              fontSize: '12px',
              fontWeight: 700,
            }}>VISA</div>
            <span style={{ color: '#e2e8f0', fontSize: '14px' }}>•••• •••• •••• 4242</span>
            <span style={{ color: '#64748b', fontSize: '14px' }}>Expires 12/26</span>
          </div>
          <button style={{
            background: 'transparent',
            border: 'none',
            color: '#10b981',
            fontSize: '14px',
            cursor: 'pointer',
          }}>Update</button>
        </div>
      </div>
    </div>
  )
}