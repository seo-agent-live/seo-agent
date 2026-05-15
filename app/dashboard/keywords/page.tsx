'use client';
import { useState } from 'react';

export default function KeywordTrackerPage() {
  const [url, setUrl] = useState('');
  const [keywords, setKeywords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newKeyword, setNewKeyword] = useState('');

  const tracked = [
    { keyword: 'ai seo tools', position: 3, change: +2, volume: '12,100', difficulty: 38 },
    { keyword: 'seo content generator', position: 7, change: +5, volume: '9,900', difficulty: 42 },
    { keyword: 'keyword research ai', position: 12, change: -1, volume: '6,600', difficulty: 55 },
    { keyword: 'competitor analysis tool', position: 5, change: +3, volume: '4,400', difficulty: 61 },
    { keyword: 'bulk article generator', position: 18, change: +8, volume: '2,900', difficulty: 33 },
  ];

  return (
    <div style={{ padding: '28px', background: '#161F35', minHeight: '100vh', fontFamily: 'Inter,-apple-system,sans-serif' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '20px', fontWeight: '700', color: '#E8EDF8', marginBottom: '4px' }}>Keyword Tracker</h1>
        <p style={{ fontSize: '13px', color: '#7B8DB0' }}>Monitor your keyword rankings and track position changes over time.</p>
      </div>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
        <input value={newKeyword} onChange={e => setNewKeyword(e.target.value)} placeholder="Add a keyword to track..." style={{ flex: 1, padding: '10px 14px', background: '#1A2540', border: '1px solid #1E2D5A', borderRadius: '8px', color: '#E8EDF8', fontSize: '13px', fontFamily: 'inherit', outline: 'none' }} />
        <button style={{ padding: '10px 20px', background: '#4F7CFF', border: 'none', borderRadius: '8px', color: 'white', fontSize: '13px', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit' }}>+ Track Keyword</button>
      </div>
      <div style={{ background: '#1A2540', border: '1px solid #1E2D5A', borderRadius: '12px', overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr', padding: '12px 20px', borderBottom: '1px solid #1E2D5A', background: 'rgba(255,255,255,0.02)' }}>
          {['Keyword', 'Position', 'Change', 'Volume', 'Difficulty'].map(h => (
            <span key={h} style={{ fontSize: '11px', fontWeight: '600', color: '#7B8DB0', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</span>
          ))}
        </div>
        {tracked.map((r, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr', padding: '14px 20px', borderBottom: i < tracked.length - 1 ? '1px solid #1E2D5A' : 'none', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', color: '#E8EDF8', fontWeight: '500' }}>{r.keyword}</span>
            <span style={{ fontSize: '13px', color: '#E8EDF8', fontWeight: '600' }}>#{r.position}</span>
            <span style={{ fontSize: '12px', fontWeight: '600', color: r.change > 0 ? '#1DB8A0' : '#E24B4A' }}>{r.change > 0 ? '+' : ''}{r.change}</span>
            <span style={{ fontSize: '13px', color: '#7B8DB0' }}>{r.volume}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '50px', height: '4px', borderRadius: '2px', background: '#1E2D5A', overflow: 'hidden' }}>
                <div style={{ width: `${r.difficulty}%`, height: '100%', background: r.difficulty < 40 ? '#1DB8A0' : r.difficulty < 60 ? '#F59E0B' : '#E24B4A', borderRadius: '2px' }} />
              </div>
              <span style={{ fontSize: '11px', color: '#7B8DB0' }}>{r.difficulty}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}