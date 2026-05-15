'use client'
import { useRouter } from 'next/navigation'

export default function ProductsPage() {
  const router = useRouter()

  return (
    <div style={{ color: "#fff", fontFamily: "Inter, sans-serif" }}>
      <h1 style={{ fontSize: "28px", fontWeight: 700, marginBottom: "8px", background: "linear-gradient(135deg, #fff, #94a3b8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Products</h1>
      <p style={{ color: "#64748b", marginBottom: "32px", fontSize: "15px" }}>All SEOAgent features and their current status</p>

      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {[
          { name: "AI Article Generator", status: "Live", description: "Generate full SEO articles using Groq + Serper in seconds", plan: "All Plans", href: "/" },
          { name: "SEO Score Checker", status: "Live", description: "Score any article for on-page SEO quality instantly", plan: "Pro+", href: "/" },
          { name: "Competitor Analysis", status: "Live", description: "Analyse top 10 ranking competitors for any keyword", plan: "Agency", href: "/" },
          { name: "Bulk Article Generator", status: "Live", description: "Generate 10+ articles from a keyword list automatically", plan: "Agency", href: "/" },
          { name: "WordPress Publisher", status: "Live", description: "Publish generated articles directly to WordPress", plan: "Pro+", href: "/" },
        ].map((product) => (
          <div key={product.name} style={{
            background: "linear-gradient(135deg, rgba(99,102,241,0.08), rgba(15,23,42,0.9))",
            border: "1px solid rgba(99,102,241,0.15)",
            borderRadius: "16px",
            padding: "24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
                <h2 style={{ fontSize: "17px", fontWeight: 600, color: "#e2e8f0", margin: 0 }}>{product.name}</h2>
                <span style={{ backgroundColor: "rgba(16,185,129,0.1)", color: "#10b981", padding: "3px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: 600 }}>{product.status}</span>
              </div>
              <p style={{ color: "#64748b", fontSize: "14px", margin: "0 0 8px" }}>{product.description}</p>
              <span style={{ color: "#475569", fontSize: "13px" }}>Available on: <span style={{ color: "#6366f1" }}>{product.plan}</span></span>
            </div>
            <button
              onClick={() => router.push(product.href)}
              style={{
                padding: "10px 24px",
                backgroundColor: "#6366f1",
                border: "none",
                borderRadius: "8px",
                color: "#fff",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: 600,
                whiteSpace: "nowrap",
                boxShadow: "0 0 20px rgba(99,102,241,0.3)",
                transition: "all 0.2s",
              }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = "0 0 30px rgba(99,102,241,0.6)"}
              onMouseLeave={e => e.currentTarget.style.boxShadow = "0 0 20px rgba(99,102,241,0.3)"}
            >
              Launch →
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}