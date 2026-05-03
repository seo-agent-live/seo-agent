"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const questions = [
  {
    id: 1,
    question: "Which of these describes your business best?",
    options: ["Affiliate Marketer", "Professional Services", "Tech Company", "E-commerce", "Blogger", "Freelancer", "Marketing / SEO Agency", "Local Business", "Other"],
  },
  {
    id: 2,
    question: "What is your main goal with SEO?",
    options: ["Get more traffic", "Generate leads", "Increase sales", "Build brand awareness", "Rank for keywords", "Other"],
  },
  {
    id: 3,
    question: "How many websites do you manage?",
    options: ["Just 1", "2-5", "6-10", "10+"],
  },
  {
    id: 4,
    question: "What is your current SEO experience?",
    options: ["Complete beginner", "Some experience", "Intermediate", "Advanced", "Expert"],
  },
  {
    id: 5,
    question: "How did you hear about SEOAgent?",
    options: ["Google Search", "Social Media", "Friend / Referral", "YouTube", "Other"],
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [selected, setSelected] = useState<string | null>(null);

  const handleNext = () => {
    if (!selected) return;
    const newAnswers = [...answers, selected];
    setAnswers(newAnswers);
    setSelected(null);
    if (current + 1 < questions.length) {
      setCurrent(current + 1);
    } else {
      router.push("/dashboard");
    }
  };

  const q = questions[current];

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#0f0f0f",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    }}>
      <div style={{
        backgroundColor: "#1a1a1a",
        borderRadius: "20px",
        padding: "40px",
        width: "100%",
        maxWidth: "640px",
        boxShadow: "0 25px 50px rgba(0,0,0,0.5)"
      }}>
        {/* Progress */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
          <div style={{ display: "flex", gap: "6px", flex: 1 }}>
            {questions.map((_, i) => (
              <div key={i} style={{
                height: "4px",
                flex: 1,
                borderRadius: "99px",
                backgroundColor: i <= current ? "#8b5cf6" : "#333"
              }} />
            ))}
          </div>
          <span style={{ color: "#888", fontSize: "14px", marginLeft: "16px", whiteSpace: "nowrap" }}>
            {current + 1} of {questions.length}
          </span>
        </div>

        {/* Question */}
        <h2 style={{
          color: "#ffffff",
          fontSize: "24px",
          fontWeight: "700",
          marginBottom: "32px",
          lineHeight: "1.3"
        }}>
          {q.question}
        </h2>

        {/* Options */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "12px",
          marginBottom: "32px"
        }}>
          {q.options.map((option) => (
            <button
              key={option}
              onClick={() => setSelected(option)}
              style={{
                padding: "16px",
                borderRadius: "12px",
                border: selected === option ? "2px solid #8b5cf6" : "2px solid #333",
                backgroundColor: selected === option ? "rgba(139,92,246,0.15)" : "#252525",
                color: selected === option ? "#ffffff" : "#aaaaaa",
                fontSize: "14px",
                fontWeight: "500",
                textAlign: "left",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              <span style={{ marginRight: "8px" }}>○</span>
              {option}
            </button>
          ))}
        </div>

        {/* Next Button */}
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button
            onClick={handleNext}
            disabled={!selected}
            style={{
              padding: "14px 32px",
              backgroundColor: selected ? "#8b5cf6" : "#444",
              color: "#ffffff",
              border: "none",
              borderRadius: "12px",
              fontSize: "16px",
              fontWeight: "600",
              cursor: selected ? "pointer" : "not-allowed",
              transition: "all 0.2s"
            }}
          >
            {current + 1 === questions.length ? "Finish →" : "Next →"}
          </button>
        </div>
      </div>
    </div>
  );
}