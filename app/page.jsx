"use client";

import { useEffect, useMemo, useRef, useState } from "react";

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function markdownWordCount(markdown) {
  const stripped = (markdown || "")
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/\[([^\]]+)\]\(([^)]*)\)/g, "$1 ")
    .replace(/^#+\s/gm, " ")
    .replace(/[#*_>`|\-]/g, " ")
    .replace(/\|/g, " ");
  const words = stripped.trim().split(/\s+/).filter(Boolean);
  return words.length;
}

function stripMarkdownRough(markdown) {
  return (markdown || "")
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/\[([^\]]+)\]\(([^)]*)\)/g, "$1 ")
    .replace(/^#+\s/gm, " ")
    .replace(/[#*_|`]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function countH2(markdown) {
  const md = markdown || "";
  const matches = md.match(/^## .+$/gm);
  return (matches || []).filter((line) => !/^###/.test(line)).length;
}

function countPhraseOccurrences(haystack, phrase) {
  const p = phrase.trim().toLowerCase();
  const h = (haystack || "").toLowerCase();
  if (!p || !h) return 0;
  const escapedPattern = escapeRegExp(p).replace(/\s+/g, "\\s+");
  const re = new RegExp(escapedPattern, "gi");
  const matches = h.match(re);
  return matches ? matches.length : 0;
}

function introContainsKeyword(markdown, keyword) {
  const intro = stripMarkdownRough(markdown).toLowerCase();
  const needle = keyword.trim().toLowerCase();
  if (!needle) return false;
  const wordsIntro = intro.split(/\s+/).slice(0, 140).join(" ");
  return wordsIntro.includes(needle);
}

function hasMetaDescriptionLine(markdown) {
  const m = markdown || "";
  if (/meta description/i.test(m.slice(0, 1800))) return true;
  return /^#\s+(meta\s*description\b)/im.test(m) || /^\*\*\s*meta description/i.test(m);
}

function hasFaq(markdown) {
  return /\bFAQ\b/i.test(markdown || "");
}

function hasConclusion(markdown) {
  return /\b(conclusion)\b/i.test(markdown || "");
}

function readabilityLabel(markdown) {
  const plain = stripMarkdownRough(markdown);
  const words = plain.replace(/[^\w\s']/g, " ").trim().split(/\s+/).filter(Boolean);
  if (words.length < 26) return "easy";
  const sentences = plain
    .split(/[.!?]+/)
    .map((s) => s.trim())
    .filter(Boolean);
  const avgWordsPerSentence =
    words.length / Math.max(sentences.length, Math.ceil(words.length / 25));
  const longWords = words.filter((w) => w.replace(/\d/g, "").length >= 11).length;
  const pctLong = longWords / Math.max(words.length, 1);
  if (avgWordsPerSentence <= 17 && pctLong <= 0.16) return "easy";
  if (avgWordsPerSentence <= 24 && pctLong <= 0.22) return "medium";
  return "hard";
}

function computeSeoScore({ wordCount, h2Count, density, kw, introOk, checklist }) {
  let score = 0;
  if (wordCount >= 1500) score += 20;
  else if (wordCount >= 900) score += 16;
  else if (wordCount >= 600) score += 12;
  else if (wordCount >= 350) score += 7;
  else score += 3;

  if (h2Count >= 4) score += 22;
  else if (h2Count >= 2) score += 16;
  else if (h2Count >= 1) score += 9;

  const hasKw = !!(kw || "").trim();
  if (hasKw) {
    if (density >= 0.012 && density <= 0.034) score += 20;
    else if (density >= 0.006 && density <= 0.046) score += 14;
    else if (density > 0.055) score += Math.max(6, 22 - Math.round(density * 160));
    else score += density > 0 ? 8 : 3;
  } else {
    score += 5;
  }

  if (hasKw && introOk) score += 12;

  checklist.forEach(({ ok, weight }) => {
    if (ok) score += weight;
  });

  return Math.max(0, Math.min(100, Math.round(score)));
}

function buildSeoReport(article, keyword) {
  const kw = keyword.trim();
  const wordCount = markdownWordCount(article);

  let density = 0;
  let occurrences = 0;
  if (kw && wordCount > 0) {
    occurrences = countPhraseOccurrences(article || "", kw);
    const phraseWords = kw.split(/\s+/).filter(Boolean).length;
    density = occurrences > 0 ? (occurrences * phraseWords) / wordCount : 0;
  }

  const h2Count = countH2(article);
  const introOk = !!(kw && introContainsKeyword(article, kw));

  const hasTopHeading = /^#\s+\S+/m.test((article || "").trim());

  const flatArticle = String(article || "").replace(/\n/g, " ");
  const hasInternalLinkMarkdown = new RegExp(
    "\\[[^\\]]+\\]\\((?!https?:\\/\\/)[^\\s)]+\\)",
    "i"
  ).test(flatArticle);

  const hasExternalLinkMarkdown = new RegExp(
    "\\[[^\\]]+\\]\\(\\s*https?:\\/\\/[^)]*\\)",
    "im"
  ).test(String(article || ""));

  const checklist = [
    {
      label: "Meta description is present",
      ok: hasMetaDescriptionLine(article),
      weight: 9,
      hint:
        !hasMetaDescriptionLine(article) &&
        `Add lines like "**Meta Description:** …" soon after your title.`,
    },
    {
      label: `At least 2 structured H2 sections (found ${h2Count})`,
      ok: h2Count >= 2,
      weight: 14,
      hint: !(h2Count >= 2) && "Use Markdown headings (`## Heading`) throughout the middle of the draft.",
    },
    {
      label: kw
        ? "Keyword appears in the introduction segment"
        : "Enter a target keyword above to optimize against",
      ok: !kw ? false : introOk,
      weight: kw ? 8 : 0,
      hint: kw && !introOk && `Weave '${kw}' naturally in the first paragraphs.`,
    },
    {
      label: "FAQ section detected",
      ok: hasFaq(article),
      weight: 7,
      hint: !hasFaq(article) && `Add an FAQ heading (e.g. "## FAQ").`,
    },
    {
      label: "Closing / conclusion section detected",
      ok: hasConclusion(article),
      weight: 6,
      hint: !hasConclusion(article) && `Add "## Conclusion" or similar.`,
    },
    {
      label: 'Top-level H1 title detected (Markdown "# Title")',
      ok: hasTopHeading,
      weight: 10,
      hint: !hasTopHeading && `Start with a Markdown H1 (\`#\`) title line.`,
    },
    {
      label: "Outbound reference link detected",
      ok: hasExternalLinkMarkdown,
      weight: 4,
      hint: !hasExternalLinkMarkdown && `Add at least one link like [source](https://example.com).`,
    },
    {
      label: "Internal-style links or CTAs formatted as Markdown links",
      ok: hasInternalLinkMarkdown,
      weight: 3,
      hint: !hasInternalLinkMarkdown && "Optional but ideal: markdown links pointing to onsite paths.",
    },
  ];

  const seoScore = computeSeoScore({
    wordCount,
    h2Count,
    density,
    kw,
    introOk,
    checklist,
  });

  const readability = readabilityLabel(article);

  return {
    wordCount,
    densityPercent: wordCount === 0 || !kw ? 0 : density * 100,
    occurrences,
    readability,
    seoScore,
    checklist,
  };
}

function titleToSuggestedKeyword(title, fallbackKw) {
  const left = title.split("|")[0].trim();
  const cleaned = left.replace(/[^\w\s'-]/g, " ").replace(/\s+/g, " ").trim();
  if (cleaned.length < 4) return (fallbackKw || "").trim();
  return cleaned.length > 80 ? cleaned.slice(0, 77).trim() + "…" : cleaned;
}

export default function HomePage() {
  const [keyword, setKeyword] = useState("");
  const [article, setArticle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [hoverGenerate, setHoverGenerate] = useState(false);
  const [hoverGetStarted, setHoverGetStarted] = useState(false);
  const [visibleSections, setVisibleSections] = useState({});
  const [checkoutLoading, setCheckoutLoading] = useState(null);
  const [checkoutError, setCheckoutError] = useState("");
  const [featureHover, setFeatureHover] = useState(null);
  const [activeFeaturePanel, setActiveFeaturePanel] = useState(null);
  const [seoPasteDraft, setSeoPasteDraft] = useState("");
  const [seoAnalyzeKeyword, setSeoAnalyzeKeyword] = useState("");
  const [seoReport, setSeoReport] = useState(null);
  const [seoAnalyzeError, setSeoAnalyzeError] = useState("");
  const [competitorPanelKeyword, setCompetitorPanelKeyword] = useState("");
  const [competitors, setCompetitors] = useState([]);
  const [competitorsLoading, setCompetitorsLoading] = useState(false);
  const [competitorsError, setCompetitorsError] = useState("");
  const sectionRefs = useRef({});
  const keywordInputRef = useRef(null);
  const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

  const features = useMemo(
    () => [
      {
        id: "feature-1",
        title: "AI Article Generator",
        desc: "Turn one keyword into long-form, human-readable, SERP-informed content.",
        icon: "A",
        action: "generator",
      },
      {
        id: "feature-2",
        title: "SEO Score Checker",
        desc: "Review keyword coverage, structure, and readability before publishing.",
        icon: "S",
        action: "seo",
      },
      {
        id: "feature-3",
        title: "Competitor Analysis",
        desc: "Extract top competitor insights from live search results in seconds.",
        icon: "C",
        action: "competitors",
      },
    ],
    []
  );

  const plans = useMemo(
    () => [
      {
        id: "plan-free",
        name: "Free",
        price: "$0",
        period: "/month",
        description: "Perfect for trying the workflow.",
        points: ["3 articles/day", "Basic SEO insights", "Community support"],
        recommended: false,
        checkoutSlug: null,
      },
      {
        id: "plan-pro",
        name: "Pro",
        price: "$49",
        period: "/month",
        description: "Built for creators and marketers.",
        points: [
          "Unlimited articles",
          "Advanced SEO scoring",
          "Priority generation speed",
        ],
        recommended: true,
        checkoutSlug: "pro",
      },
      {
        id: "plan-agency",
        name: "Agency",
        price: "$99",
        period: "/month",
        description: "Scale content operations for teams.",
        points: ["Multi-user seats", "Competitor snapshots", "Premium support"],
        recommended: false,
        checkoutSlug: "agency",
      },
    ],
    []
  );

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("data-reveal-id");
            if (id) {
              setVisibleSections((prev) => ({ ...prev, [id]: true }));
            }
          }
        });
      },
      { threshold: 0.2 }
    );

    const refs = Object.values(sectionRefs.current);
    refs.forEach((node) => {
      if (node) observer.observe(node);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToGenerator = () => {
    window.setTimeout(() => {
      document.getElementById("article-generator")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      const el = keywordInputRef.current;
      if (el && typeof el.focus === "function") {
        try {
          el.focus({ preventScroll: true });
        } catch {
          el.focus();
        }
      }
    }, 40);
  };

  const fetchCompetitorsForPanel = async (kw) => {
    const trimmed = String(kw || "").trim();
    if (!trimmed) {
      setCompetitorsLoading(false);
      setCompetitorsError("Enter a keyword to search Google results.");
      setCompetitors([]);
      return;
    }

    setCompetitorsLoading(true);
    setCompetitorsError("");
    try {
      const response = await fetch("/api/competitors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword: trimmed }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Could not fetch competitors.");
      }
      setCompetitors(Array.isArray(data.results) ? data.results : []);
    } catch (err) {
      setCompetitorsError(err.message || "Something went wrong.");
      setCompetitors([]);
    } finally {
      setCompetitorsLoading(false);
    }
  };

  const scrollToFeaturePanels = () => {
    window.setTimeout(() => {
      document.getElementById("feature-tool-panels")?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }, 60);
  };

  const handleSeoAnalyze = () => {
    setSeoAnalyzeError("");
    if (!seoPasteDraft.trim()) {
      setSeoAnalyzeError("Paste an article into the text area before analyzing.");
      return;
    }
    setSeoReport(buildSeoReport(seoPasteDraft, seoAnalyzeKeyword));
  };

  const handleFeatureActivation = async (feature) => {
    if (!feature.action) return;
    setCompetitorsError("");
    if (feature.action === "generator") {
      setActiveFeaturePanel(null);
      scrollToGenerator();
      return;
    }
    if (feature.action === "seo") {
      setActiveFeaturePanel("seo");
      setSeoReport(null);
      setSeoAnalyzeError("");
      setSeoAnalyzeKeyword(keyword);
      setSeoPasteDraft((prev) =>
        prev.trim() ? prev : article.trim() ? article : ""
      );
      scrollToFeaturePanels();
      return;
    }
    if (feature.action === "competitors") {
      setActiveFeaturePanel("competitors");
      setCompetitorPanelKeyword(keyword.trim());
      setCompetitors([]);
      scrollToFeaturePanels();
    }
  };

  const handleBeatArticle = (competitorTitle) => {
    setKeyword(titleToSuggestedKeyword(competitorTitle || "", keyword));
  };

  const handleGenerate = async () => {
    if (!keyword.trim()) {
      setError("Please enter a keyword first.");
      return;
    }

    setLoading(true);
    setError("");
    setArticle("");

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword: keyword.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate article.");
      }

      setArticle(data.article || "");
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handlePlanCheckout = async (checkoutSlug) => {
    setCheckoutError("");

    if (!stripePublishableKey?.trim()) {
      setCheckoutError(
        "Missing NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY. Add it to your environment configuration."
      );
      return;
    }

    setCheckoutLoading(checkoutSlug);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: checkoutSlug }),
      });

      const data = await response.json();

      if (!response.ok || !data?.url) {
        throw new Error(data.error || "Could not start checkout.");
      }

      window.location.href = data.url;
    } catch (err) {
      setCheckoutError(err.message || "Checkout failed.");
    } finally {
      setCheckoutLoading(null);
    }
  };

  const handleCopy = async () => {
    if (!article) return;

    try {
      await navigator.clipboard.writeText(article);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setError("Failed to copy article.");
    }
  };

  const revealStyle = (id, delay = "0s") => ({
    opacity: visibleSections[id] ? 1 : 0,
    transform: visibleSections[id] ? "translateY(0px)" : "translateY(24px)",
    transition: `opacity 700ms ease ${delay}, transform 700ms ease ${delay}`,
  });

  const cardBase = {
    background: "rgba(17, 24, 39, 0.72)",
    border: "1px solid rgba(129, 140, 248, 0.26)",
    borderRadius: "18px",
    boxShadow: "0 20px 40px rgba(8, 10, 24, 0.45)",
    backdropFilter: "blur(10px)",
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        color: "#e5e7eb",
        position: "relative",
        overflowX: "hidden",
        background:
          "linear-gradient(120deg, #030712 0%, #0f172a 35%, #1e1b4b 65%, #1d4ed8 100%)",
        backgroundSize: "220% 220%",
        animation: "bgShift 20s ease infinite",
        fontFamily:
          'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      <style>{`
        html { scroll-behavior: smooth; }
        @keyframes bgShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes glowPulse {
          0% { text-shadow: 0 0 14px rgba(129,140,248,0.20); }
          50% { text-shadow: 0 0 28px rgba(96,165,250,0.45); }
          100% { text-shadow: 0 0 14px rgba(129,140,248,0.20); }
        }
        @keyframes featurePanelSlide {
          from { opacity: 0; transform: translateY(-16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 900px) {
          .grid-3 { grid-template-columns: 1fr !important; }
          .tool-row { flex-direction: column !important; }
        }
      `}</style>

      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background:
            "radial-gradient(circle at 20% 20%, rgba(168,85,247,0.2) 0%, rgba(168,85,247,0) 40%), radial-gradient(circle at 80% 30%, rgba(59,130,246,0.25) 0%, rgba(59,130,246,0) 38%), radial-gradient(circle at 50% 85%, rgba(99,102,241,0.2) 0%, rgba(99,102,241,0) 40%)",
        }}
      />

      <div style={{ maxWidth: "1160px", margin: "0 auto", padding: "22px 20px 48px" }}>
        <nav
          ref={(el) => {
            sectionRefs.current.nav = el;
          }}
          data-reveal-id="nav"
          style={{
            ...revealStyle("nav"),
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "14px 16px",
            borderRadius: "14px",
            border: "1px solid rgba(129, 140, 248, 0.25)",
            backgroundColor: "rgba(10, 15, 35, 0.7)",
            backdropFilter: "blur(8px)",
            position: "sticky",
            top: "14px",
            zIndex: 20,
          }}
        >
          <div style={{ fontSize: "22px", fontWeight: 800, letterSpacing: "0.3px" }}>
            SEOAgent
          </div>
          <button
            type="button"
            onClick={() => window.location.href = '/sign-in'}
            onMouseEnter={() => setHoverGetStarted(true)}
            onMouseLeave={() => setHoverGetStarted(false)}
            style={{
              border: "1px solid rgba(129, 140, 248, 0.5)",
              borderRadius: "10px",
              padding: "10px 16px",
              color: "#fff",
              fontWeight: 700,
              background: hoverGetStarted
                ? "linear-gradient(120deg, #6366f1, #3b82f6)"
                : "rgba(30, 41, 59, 0.8)",
              boxShadow: hoverGetStarted
                ? "0 0 25px rgba(99, 102, 241, 0.5)"
                : "none",
              cursor: "pointer",
              transition: "all 220ms ease",
            }}
          >
            Get Started
          </button>
        </nav>

        <section
          ref={(el) => {
            sectionRefs.current.hero = el;
          }}
          data-reveal-id="hero"
          style={{
            ...revealStyle("hero", "0.1s"),
            textAlign: "center",
            padding: "88px 10px 54px",
          }}
        >
          <h1
            style={{
              margin: 0,
              fontSize: "clamp(2.2rem, 6vw, 4rem)",
              lineHeight: 1.08,
              letterSpacing: "-1.3px",
              fontWeight: 800,
              color: "#f8fafc",
            }}
          >
            Generate SEO Articles in Seconds
          </h1>
          <p
            style={{
              margin: "18px auto 0",
              maxWidth: "780px",
              fontSize: "clamp(1rem, 2.1vw, 1.3rem)",
              color: "#cbd5e1",
              animation: "glowPulse 4.5s ease-in-out infinite",
            }}
          >
            Research live SERPs, analyze competitor angles, and publish
            conversion-focused content faster than ever.
          </p>
        </section>

        <section
          ref={(el) => {
            sectionRefs.current.features = el;
          }}
          data-reveal-id="features"
          style={{ ...revealStyle("features", "0.12s"), marginBottom: "46px" }}
        >
          <h2 style={{ margin: "0 0 20px", fontSize: "28px", color: "#f1f5f9" }}>
            Features
          </h2>
          <div
            className="grid-3"
            style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "14px" }}
          >
            {features.map((item, idx) => (
              <article
                key={item.id}
                tabIndex={0}
                role="button"
                onClick={() => handleFeatureActivation(item)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleFeatureActivation(item);
                  }
                }}
                onMouseEnter={() => setFeatureHover(item.id)}
                onMouseLeave={() => setFeatureHover((current) => (current === item.id ? null : current))}
                style={{
                  ...cardBase,
                  ...revealStyle("features", `${0.14 + idx * 0.1}s`),
                  padding: "22px",
                  cursor: "pointer",
                  outline: "none",
                  transform:
                    featureHover === item.id ? "translateY(-3px)" : "translateY(0)",
                  transition: "transform 200ms ease, border-color 220ms ease, box-shadow 220ms ease",
                  border:
                    featureHover === item.id
                      ? "1px solid rgba(168,85,247,0.58)"
                      : "1px solid rgba(129, 140, 248, 0.26)",
                  boxShadow:
                    featureHover === item.id ? "0 24px 50px rgba(99,102,241,0.35)" : cardBase.boxShadow,
                }}
                aria-label={`Open ${item.title}`}
              >
                <div
                  style={{
                    width: "38px",
                    height: "38px",
                    borderRadius: "11px",
                    display: "grid",
                    placeItems: "center",
                    color: "#dbeafe",
                    fontWeight: 800,
                    marginBottom: "12px",
                    background:
                      "linear-gradient(130deg, rgba(99,102,241,0.9), rgba(59,130,246,0.9))",
                    boxShadow: "0 0 24px rgba(96, 165, 250, 0.35)",
                  }}
                >
                  {item.icon}
                </div>
                <h3 style={{ margin: "0 0 8px", fontSize: "20px", color: "#f8fafc" }}>
                  {item.title}
                </h3>
                <p style={{ margin: 0, color: "#94a3b8", lineHeight: 1.6 }}>
                  {item.desc}
                </p>
                <span
                  style={{
                    display: "inline-block",
                    marginTop: "14px",
                    fontSize: "13px",
                    fontWeight: 700,
                    color: "#c7d2fe",
                  }}
                >
                  Tap to open →
                </span>
              </article>
            ))}
          </div>

          {activeFeaturePanel ? (
            <div
              id="feature-tool-panels"
              style={{
                marginTop: "22px",
                borderRadius: "16px",
                border: "1px solid rgba(129, 140, 248, 0.32)",
                backgroundColor: "rgba(10, 15, 35, 0.9)",
                boxShadow: "0 28px 50px rgba(8,10,26,0.55)",
                backdropFilter: "blur(12px)",
                padding: "22px",
                animation: "featurePanelSlide 0.45s ease forwards",
              }}
            >
              {activeFeaturePanel === "seo" ? (
                <>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: "12px",
                      flexWrap: "wrap",
                      alignItems: "flex-start",
                      marginBottom: "18px",
                    }}
                  >
                    <div>
                      <h3 style={{ margin: "0 0 6px", color: "#f8fafc", fontSize: "22px" }}>
                        SEO Score Checker
                      </h3>
                      <div style={{ color: "#94a3b8", fontSize: "13px", maxWidth: "640px" }}>
                        Paste any draft below, set your focus keyword, then run analysis.
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveFeaturePanel(null);
                        setSeoReport(null);
                      }}
                      style={{
                        border: "1px solid rgba(148,163,184,0.35)",
                        backgroundColor: "rgba(30,41,59,0.85)",
                        color: "#e2e8f0",
                        borderRadius: "10px",
                        padding: "8px 14px",
                        cursor: "pointer",
                        fontSize: "13px",
                        fontWeight: 600,
                      }}
                    >
                      Close
                    </button>
                  </div>

                  <label style={{ display: "block", color: "#cbd5e1", fontSize: "13px", marginBottom: "8px", fontWeight: 600 }}>
                    Focus keyword (for density & checklist)
                  </label>
                  <input
                    type="text"
                    value={seoAnalyzeKeyword}
                    onChange={(e) => setSeoAnalyzeKeyword(e.target.value)}
                    placeholder="Matches the main keyword you target in search"
                    style={{
                      width: "100%",
                      boxSizing: "border-box",
                      marginBottom: "16px",
                      borderRadius: "12px",
                      padding: "12px 14px",
                      fontSize: "15px",
                      color: "#e2e8f0",
                      border: "1px solid rgba(99, 102, 241, 0.45)",
                      background: "rgba(2, 6, 23, 0.9)",
                      outline: "none",
                    }}
                  />

                  <label style={{ display: "block", color: "#cbd5e1", fontSize: "13px", marginBottom: "8px", fontWeight: 600 }}>
                    Article (Markdown or plain text)
                  </label>
                  <textarea
                    value={seoPasteDraft}
                    onChange={(e) => setSeoPasteDraft(e.target.value)}
                    placeholder="Paste your full article here..."
                    rows={14}
                    style={{
                      width: "100%",
                      boxSizing: "border-box",
                      minHeight: "220px",
                      borderRadius: "12px",
                      padding: "14px",
                      fontSize: "14px",
                      lineHeight: 1.55,
                      color: "#e2e8f0",
                      border: "1px solid rgba(148, 163, 184, 0.28)",
                      background: "rgba(2, 6, 23, 0.85)",
                      outline: "none",
                      resize: "vertical",
                      fontFamily: "inherit",
                      marginBottom: "14px",
                    }}
                  />

                  {seoAnalyzeError ? (
                    <p
                      style={{
                        marginTop: 0,
                        marginBottom: "12px",
                        borderRadius: "10px",
                        border: "1px solid rgba(239, 68, 68, 0.5)",
                        backgroundColor: "rgba(127, 29, 29, 0.35)",
                        color: "#fecaca",
                        padding: "10px 12px",
                        fontSize: "14px",
                      }}
                    >
                      {seoAnalyzeError}
                    </p>
                  ) : null}

                  <button
                    type="button"
                    onClick={handleSeoAnalyze}
                    style={{
                      border: "none",
                      borderRadius: "12px",
                      padding: "12px 20px",
                      fontWeight: 700,
                      color: "#fff",
                      cursor: "pointer",
                      marginBottom: "20px",
                      background: "linear-gradient(130deg, #6366f1, #2563eb)",
                      boxShadow: "0 0 22px rgba(99, 102, 241, 0.45)",
                    }}
                  >
                    Analyze
                  </button>

                  {seoReport ? (
                    <>
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "repeat(auto-fit, minmax(160px,1fr))",
                          gap: "12px",
                          marginBottom: "14px",
                        }}
                      >
                        {[
                          { label: "Word count", value: seoReport.wordCount.toLocaleString() },
                          {
                            label: "Keyword density",
                            value:
                              seoAnalyzeKeyword.trim() && seoReport.wordCount > 0
                                ? `${seoReport.densityPercent.toFixed(2)}% (${seoReport.occurrences} mentions)`
                                : "Add a focus keyword above",
                          },
                          {
                            label: "Readability",
                            value:
                              seoReport.readability.charAt(0).toUpperCase() +
                              seoReport.readability.slice(1),
                          },
                          { label: "SEO score", value: `${seoReport.seoScore} / 100` },
                        ].map((item) => (
                          <div
                            key={item.label}
                            style={{
                              borderRadius: "12px",
                              border: "1px solid rgba(99,102,241,0.35)",
                              padding: "12px",
                              backgroundColor: "rgba(2,6,23,0.72)",
                              minHeight: "88px",
                            }}
                          >
                            <div
                              style={{
                                color: "#94a3b8",
                                fontSize: "12px",
                                marginBottom: "6px",
                                letterSpacing: "0.4px",
                              }}
                            >
                              {item.label}
                            </div>
                            <div style={{ fontSize: "18px", fontWeight: 800, color: "#f1f5f9" }}>
                              {item.value}
                            </div>
                          </div>
                        ))}
                      </div>

                      {!seoAnalyzeKeyword.trim() ? (
                        <p style={{ margin: "0 0 12px", color: "#fbbf24", fontSize: "13px" }}>
                          No focus keyword set — density and some checklist items stay generic.
                        </p>
                      ) : null}

                      <div style={{ color: "#e2e8f0", fontWeight: 700, marginBottom: "8px" }}>
                        Missing elements checklist
                      </div>
                      <ul style={{ padding: "0", margin: 0, listStyle: "none" }}>
                        {seoReport.checklist.map((rule) => (
                          <li
                            key={rule.label}
                            style={{
                              borderRadius: "10px",
                              border: rule.ok
                                ? "1px solid rgba(34,197,94,0.35)"
                                : "1px solid rgba(248,113,113,0.35)",
                              backgroundColor: rule.ok
                                ? "rgba(6,95,70,0.25)"
                                : "rgba(127,29,29,0.25)",
                              padding: "10px 12px",
                              marginBottom: "8px",
                              color: "#e2e8f0",
                              fontSize: "14px",
                              display: "flex",
                              gap: "10px",
                              alignItems: "flex-start",
                            }}
                          >
                            <span
                              style={{
                                fontWeight: 800,
                                color: rule.ok ? "#86efac" : "#fecaca",
                              }}
                            >
                              {rule.ok ? "✓" : "!"}
                            </span>
                            <span>
                              {rule.label}
                              {!rule.ok && rule.hint ? (
                                <span
                                  style={{
                                    display: "block",
                                    marginTop: "6px",
                                    color: "#cbd5e1",
                                    fontSize: "13px",
                                  }}
                                >
                                  {rule.hint}
                                </span>
                              ) : null}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </>
                  ) : (
                    <p style={{ margin: 0, color: "#64748b", fontSize: "14px" }}>
                      Run Analyze to score this draft.
                    </p>
                  )}
                </>
              ) : (
                <>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: "12px",
                      flexWrap: "wrap",
                      alignItems: "flex-start",
                      marginBottom: "18px",
                    }}
                  >
                    <div>
                      <h3 style={{ margin: "0 0 6px", color: "#f8fafc", fontSize: "22px" }}>
                        Competitor Analysis
                      </h3>
                      <div style={{ color: "#94a3b8", fontSize: "13px" }}>
                        Search live Google SERPs via Serper and review the organic top five.
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveFeaturePanel(null)}
                      style={{
                        border: "1px solid rgba(148,163,184,0.35)",
                        backgroundColor: "rgba(30,41,59,0.85)",
                        color: "#e2e8f0",
                        borderRadius: "10px",
                        padding: "8px 14px",
                        cursor: "pointer",
                        fontSize: "13px",
                        fontWeight: 600,
                      }}
                    >
                      Close
                    </button>
                  </div>

                  <label style={{ display: "block", color: "#cbd5e1", fontSize: "13px", marginBottom: "8px", fontWeight: 600 }}>
                    Keyword
                  </label>
                  <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "16px" }}>
                    <input
                      type="text"
                      value={competitorPanelKeyword}
                      onChange={(e) => setCompetitorPanelKeyword(e.target.value)}
                      placeholder="e.g. ai writing tools"
                      style={{
                        flex: "1 1 260px",
                        minWidth: "200px",
                        borderRadius: "12px",
                        padding: "12px 14px",
                        fontSize: "15px",
                        color: "#e2e8f0",
                        border: "1px solid rgba(59, 130, 246, 0.45)",
                        background: "rgba(2, 6, 23, 0.9)",
                        outline: "none",
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => fetchCompetitorsForPanel(competitorPanelKeyword)}
                      disabled={competitorsLoading}
                      style={{
                        border: "none",
                        borderRadius: "12px",
                        padding: "12px 20px",
                        fontWeight: 700,
                        color: "#0f172a",
                        cursor: competitorsLoading ? "wait" : "pointer",
                        background: "linear-gradient(120deg,#a855f7,#2563eb)",
                        boxShadow: "0 0 18px rgba(99,102,241,0.35)",
                        opacity: competitorsLoading ? 0.75 : 1,
                      }}
                    >
                      {competitorsLoading ? "Analyzing..." : "Analyze Competitors"}
                    </button>
                  </div>

                  {competitorsError ? (
                    <p
                      style={{
                        marginTop: 0,
                        marginBottom: "14px",
                        borderRadius: "10px",
                        border: "1px solid rgba(239, 68, 68, 0.5)",
                        backgroundColor: "rgba(127, 29, 29, 0.35)",
                        color: "#fecaca",
                        padding: "10px 12px",
                      }}
                    >
                      {competitorsError}
                    </p>
                  ) : null}

                  {competitorsLoading ? (
                    <div style={{ color: "#cbd5e1", fontSize: "14px" }}>Fetching SERP competitors…</div>
                  ) : (
                    <div style={{ display: "grid", gap: "12px" }}>
                      {competitors.length === 0 && !competitorsError ? (
                        <div style={{ color: "#94a3b8", fontSize: "14px" }}>
                          Run Analyze Competitors to load the top Google results here.
                        </div>
                      ) : null}
                      {competitors.map((comp, index) => (
                        <div
                          key={comp.link || `row-${index}`}
                          style={{
                            borderRadius: "12px",
                            border: "1px solid rgba(148,163,184,0.28)",
                            backgroundColor: "rgba(2,6,23,0.65)",
                            padding: "14px",
                          }}
                        >
                          <div style={{ color: "#f8fafc", fontWeight: 800, marginBottom: "6px" }}>
                            {comp.title}
                          </div>
                          <a
                            href={comp.link}
                            target="_blank"
                            rel="noreferrer"
                            style={{
                              color: "#93c5fd",
                              fontSize: "13px",
                              wordBreak: "break-all",
                              display: "block",
                            }}
                          >
                            {comp.link}
                          </a>
                          <p
                            style={{
                              margin: "10px 0 12px",
                              color: "#cbd5e1",
                              fontSize: "14px",
                              lineHeight: 1.55,
                            }}
                          >
                            {comp.snippet}
                          </p>
                          <button
                            type="button"
                            onClick={() => handleBeatArticle(comp.title)}
                            style={{
                              border: "none",
                              borderRadius: "10px",
                              padding: "8px 14px",
                              fontWeight: 700,
                              color: "#fff",
                              cursor: "pointer",
                              background: "linear-gradient(130deg,#f97316,#db2777)",
                              boxShadow: "0 0 18px rgba(236,72,153,0.35)",
                            }}
                          >
                            Beat this article
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          ) : null}
        </section>

        <section
          id="article-generator"
          ref={(el) => {
            sectionRefs.current.tool = el;
          }}
          data-reveal-id="tool"
          style={{
            ...revealStyle("tool", "0.15s"),
            ...cardBase,
            marginBottom: "48px",
            padding: "22px",
          }}
        >
          <h2 style={{ marginTop: 0, marginBottom: "14px", fontSize: "28px", color: "#f8fafc" }}>
            Main Tool
          </h2>

          <div className="tool-row" style={{ display: "flex", gap: "12px", marginBottom: "14px" }}>
            <input
              ref={keywordInputRef}
              type="text"
              placeholder="Type your primary keyword..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              style={{
                flex: 1,
                borderRadius: "12px",
                padding: "14px 15px",
                fontSize: "15px",
                color: "#e2e8f0",
                border: "1px solid rgba(99, 102, 241, 0.45)",
                background: "rgba(2, 6, 23, 0.9)",
                outline: "none",
              }}
            />
            <button
              onClick={handleGenerate}
              onMouseEnter={() => setHoverGenerate(true)}
              onMouseLeave={() => setHoverGenerate(false)}
              disabled={loading}
              style={{
                border: "none",
                borderRadius: "12px",
                padding: "14px 20px",
                fontWeight: 700,
                color: "#fff",
                cursor: loading ? "not-allowed" : "pointer",
                background:
                  loading || !hoverGenerate
                    ? "linear-gradient(130deg, #4f46e5, #2563eb)"
                    : "linear-gradient(130deg, #6366f1, #3b82f6)",
                boxShadow: loading
                  ? "none"
                  : hoverGenerate
                    ? "0 0 28px rgba(99, 102, 241, 0.65)"
                    : "0 0 18px rgba(59, 130, 246, 0.35)",
                transition: "all 250ms ease",
              }}
            >
              {loading ? "Generating..." : "Generate"}
            </button>
          </div>

          {error ? (
            <p
              style={{
                marginTop: 0,
                marginBottom: "14px",
                borderRadius: "10px",
                border: "1px solid rgba(239, 68, 68, 0.5)",
                backgroundColor: "rgba(127, 29, 29, 0.35)",
                color: "#fecaca",
                padding: "10px 12px",
              }}
            >
              {error}
            </p>
          ) : null}

          <div
            style={{
              borderRadius: "14px",
              border: "1px solid rgba(148, 163, 184, 0.28)",
              backgroundColor: "rgba(2, 6, 23, 0.8)",
              padding: "14px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "10px",
              }}
            >
              <strong style={{ color: "#e2e8f0", fontSize: "14px", letterSpacing: "0.3px" }}>
                Generated Output
              </strong>
              <button
                onClick={handleCopy}
                disabled={!article}
                style={{
                  border: "1px solid rgba(148, 163, 184, 0.35)",
                  borderRadius: "8px",
                  backgroundColor: article ? "rgba(30, 41, 59, 0.8)" : "rgba(30, 41, 59, 0.4)",
                  color: article ? "#e2e8f0" : "#64748b",
                  padding: "7px 11px",
                  fontSize: "13px",
                  cursor: article ? "pointer" : "not-allowed",
                }}
              >
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
            <div
              style={{
                minHeight: "280px",
                color: "#cbd5e1",
                whiteSpace: "pre-wrap",
                lineHeight: 1.65,
                fontSize: "15px",
              }}
            >
              {article || "Your generated SEO article will appear here..."}
            </div>
          </div>
        </section>

        <section
          id="pricing"
          ref={(el) => {
            sectionRefs.current.pricing = el;
          }}
          data-reveal-id="pricing"
          style={{ ...revealStyle("pricing", "0.16s"), marginBottom: "50px" }}
        >
          <h2 style={{ margin: "0 0 20px", fontSize: "28px", color: "#f8fafc" }}>Pricing</h2>
          {checkoutError ? (
            <p
              style={{
                marginTop: 0,
                marginBottom: "16px",
                borderRadius: "10px",
                border: "1px solid rgba(239, 68, 68, 0.5)",
                backgroundColor: "rgba(127, 29, 29, 0.35)",
                color: "#fecaca",
                padding: "10px 12px",
              }}
            >
              {checkoutError}
            </p>
          ) : null}
          <div
            className="grid-3"
            style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "14px" }}
          >
            {plans.map((plan) => (
              <article
                key={plan.id}
                style={{
                  ...cardBase,
                  padding: "22px",
                  border: plan.recommended
                    ? "1px solid rgba(129, 140, 248, 0.9)"
                    : "1px solid rgba(129, 140, 248, 0.28)",
                  boxShadow: plan.recommended
                    ? "0 0 35px rgba(99, 102, 241, 0.34)"
                    : cardBase.boxShadow,
                  position: "relative",
                }}
              >
                {plan.recommended ? (
                  <span
                    style={{
                      position: "absolute",
                      top: "12px",
                      right: "12px",
                      borderRadius: "999px",
                      background: "linear-gradient(130deg, #6366f1, #3b82f6)",
                      color: "#fff",
                      padding: "5px 10px",
                      fontSize: "12px",
                      fontWeight: 700,
                    }}
                  >
                    Recommended
                  </span>
                ) : null}
                <h3 style={{ marginTop: 0, marginBottom: "8px", fontSize: "23px", color: "#f8fafc" }}>
                  {plan.name}
                </h3>
                <p style={{ marginTop: 0, marginBottom: "12px", color: "#94a3b8" }}>
                  {plan.description}
                </p>
                <p style={{ marginTop: 0, marginBottom: "14px" }}>
                  <span style={{ fontSize: "34px", fontWeight: 800, color: "#e2e8f0" }}>
                    {plan.price}
                  </span>
                  <span style={{ color: "#94a3b8" }}>{plan.period}</span>
                </p>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, color: "#cbd5e1" }}>
                  {plan.points.map((point) => (
                    <li key={point} style={{ marginBottom: "8px" }}>
                      - {point}
                    </li>
                  ))}
                </ul>
                {plan.checkoutSlug ? (
                  <button
                    type="button"
                    onClick={() => handlePlanCheckout(plan.checkoutSlug)}
                    disabled={checkoutLoading !== null}
                    style={{
                      marginTop: "18px",
                      width: "100%",
                      border: "none",
                      borderRadius: "10px",
                      padding: "12px 14px",
                      fontWeight: 700,
                      color: "#fff",
                      cursor: checkoutLoading ? "wait" : "pointer",
                      background:
                        checkoutLoading === plan.checkoutSlug
                          ? "linear-gradient(130deg, #4338ca, #1d4ed8)"
                          : "linear-gradient(130deg, #6366f1, #2563eb)",
                      boxShadow: "0 0 22px rgba(99, 102, 241, 0.45)",
                      transition: "all 220ms ease",
                      opacity: checkoutLoading && checkoutLoading !== plan.checkoutSlug ? 0.6 : 1,
                    }}
                  >
                    {checkoutLoading === plan.checkoutSlug ? "Redirecting..." : "Get Started"}
                  </button>
                ) : (
                  <button
  type="button"
  onClick={scrollToGenerator}
  style={{
    marginTop: "18px",
    width: "100%",
    border: "none",
    borderRadius: "10px",
    padding: "12px 14px",
    fontWeight: 700,
    color: "#fff",
    cursor: "pointer",
    background: "linear-gradient(130deg, #6366f1, #2563eb)",
    boxShadow: "0 0 22px rgba(99, 102, 241, 0.45), 0 0 40px rgba(99, 102, 241, 0.25)",
    transition: "all 220ms ease",
    animation: "glowPulse 2.5s ease-in-out infinite",
  }}
>
  Get Started
</button>
                )}
              </article>
            ))}
          </div>
        </section>

        <footer
          ref={(el) => {
            sectionRefs.current.footer = el;
          }}
          data-reveal-id="footer"
          style={{
            ...revealStyle("footer", "0.18s"),
            ...cardBase,
            padding: "20px",
            display: "flex",
            justifyContent: "space-between",
            gap: "10px",
            flexWrap: "wrap",
          }}
        >
          <div style={{ color: "#94a3b8" }}>SEOAgent - AI-first SEO content workflow</div>
          <div style={{ display: "flex", gap: "14px", color: "#cbd5e1" }}>
            <a href="#" style={{ color: "inherit", textDecoration: "none" }}>
              Docs
            </a>
            <a href="#" style={{ color: "inherit", textDecoration: "none" }}>
              Privacy
            </a>
            <a href="#" style={{ color: "inherit", textDecoration: "none" }}>
              Terms
            </a>
            <a href="#" style={{ color: "inherit", textDecoration: "none" }}>
              Contact
            </a>
          </div>
        </footer>
      </div>
    </main>
  );
}