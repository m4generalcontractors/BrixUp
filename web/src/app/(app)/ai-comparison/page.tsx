"use client";

import { useState, useMemo } from "react";

/* ─── AI Model Data ─── */

interface AIModel {
  id: string;
  name: string;
  provider: string;
  logo: string;
  color: string;
  description: string;
  releaseDate: string;
  pricing: string;
  contextWindow: string;
  strengths: string[];
  weaknesses: string[];
  bestFor: string[];
  ratings: {
    reasoning: number;
    coding: number;
    creativity: number;
    speed: number;
    accuracy: number;
    multimodal: number;
    costEfficiency: number;
  };
}

const aiModels: AIModel[] = [
  {
    id: "claude",
    name: "Claude (Anthropic)",
    provider: "Anthropic",
    logo: "C",
    color: "#D4A843",
    description:
      "Claude is Anthropic's flagship AI assistant known for safety, nuance, and extended context handling. Excels at complex reasoning and long-form content.",
    releaseDate: "2025",
    pricing: "$15 / 1M input tokens (Opus)",
    contextWindow: "1M tokens",
    strengths: [
      "Superior reasoning and nuance",
      "Massive 1M token context window",
      "Strong safety alignment",
      "Excellent at code generation and review",
      "Great at following complex instructions",
      "Honest about uncertainty",
    ],
    weaknesses: [
      "Can be overly cautious at times",
      "Limited real-time data access",
      "Smaller plugin/tool ecosystem than OpenAI",
    ],
    bestFor: [
      "Complex analysis",
      "Long document processing",
      "Code development",
      "Research",
    ],
    ratings: {
      reasoning: 97,
      coding: 95,
      creativity: 90,
      speed: 80,
      accuracy: 96,
      multimodal: 85,
      costEfficiency: 75,
    },
  },
  {
    id: "gpt4",
    name: "GPT-4o (OpenAI)",
    provider: "OpenAI",
    logo: "G",
    color: "#10A37F",
    description:
      "GPT-4o is OpenAI's multimodal flagship model. It handles text, images, audio, and video with fast response times and a massive ecosystem of plugins.",
    releaseDate: "2024",
    pricing: "$5 / 1M input tokens",
    contextWindow: "128K tokens",
    strengths: [
      "Strong multimodal capabilities (text, image, audio, video)",
      "Large plugin and tool ecosystem",
      "Fast response times",
      "Widely adopted with lots of integrations",
      "Good at creative writing",
      "Strong general knowledge",
    ],
    weaknesses: [
      "Tends to hallucinate more than Claude",
      "Smaller context window than Claude",
      "Can be verbose without adding value",
      "Safety alignment less transparent",
    ],
    bestFor: [
      "Multimodal tasks",
      "Creative writing",
      "General-purpose chat",
      "Plugin integrations",
    ],
    ratings: {
      reasoning: 90,
      coding: 90,
      creativity: 92,
      speed: 90,
      accuracy: 88,
      multimodal: 95,
      costEfficiency: 85,
    },
  },
  {
    id: "gemini",
    name: "Gemini 2.5 (Google)",
    provider: "Google",
    logo: "Ge",
    color: "#4285F4",
    description:
      "Google's Gemini 2.5 Pro offers strong multimodal reasoning, deep Google ecosystem integration, and a massive context window of up to 1M tokens.",
    releaseDate: "2025",
    pricing: "$7 / 1M input tokens",
    contextWindow: "1M tokens",
    strengths: [
      "Massive 1M token context",
      "Deep Google Workspace integration",
      "Strong multimodal (text, image, video, audio)",
      "Excellent at factual/scientific tasks",
      "Competitive pricing",
      "Strong reasoning with 'thinking' mode",
    ],
    weaknesses: [
      "Can lag behind in creative writing quality",
      "Ecosystem lock-in with Google products",
      "Availability varies by region",
      "Less consistent instruction following",
    ],
    bestFor: [
      "Google Workspace users",
      "Scientific research",
      "Video/image analysis",
      "Large document analysis",
    ],
    ratings: {
      reasoning: 92,
      coding: 88,
      creativity: 85,
      speed: 88,
      accuracy: 90,
      multimodal: 94,
      costEfficiency: 88,
    },
  },
  {
    id: "llama",
    name: "Llama 4 (Meta)",
    provider: "Meta",
    logo: "Ll",
    color: "#0668E1",
    description:
      "Meta's open-source Llama 4 family of models offers competitive performance with full transparency and customizability. Available for free to self-host.",
    releaseDate: "2025",
    pricing: "Free (self-hosted) / varies via providers",
    contextWindow: "128K tokens",
    strengths: [
      "Fully open-source and free to use",
      "Can be self-hosted for data privacy",
      "Strong multilingual performance",
      "Highly customizable / fine-tunable",
      "Large community and ecosystem",
      "No vendor lock-in",
    ],
    weaknesses: [
      "Requires technical expertise to deploy",
      "Self-hosting has infrastructure costs",
      "Not as strong as top closed models on complex reasoning",
      "Limited official support",
    ],
    bestFor: [
      "Privacy-sensitive applications",
      "Custom fine-tuning",
      "On-premise deployment",
      "Research and experimentation",
    ],
    ratings: {
      reasoning: 82,
      coding: 80,
      creativity: 80,
      speed: 85,
      accuracy: 82,
      multimodal: 75,
      costEfficiency: 95,
    },
  },
  {
    id: "mistral",
    name: "Mistral Large (Mistral AI)",
    provider: "Mistral AI",
    logo: "M",
    color: "#FF7000",
    description:
      "Mistral AI's flagship model offers strong European-built AI with great multilingual support, efficiency, and competitive pricing.",
    releaseDate: "2025",
    pricing: "$8 / 1M input tokens",
    contextWindow: "128K tokens",
    strengths: [
      "Excellent multilingual support (EU languages)",
      "Strong code generation",
      "EU data sovereignty compliance (GDPR)",
      "Efficient inference",
      "Good function calling",
      "Competitive pricing",
    ],
    weaknesses: [
      "Smaller ecosystem than OpenAI/Google",
      "Less established track record",
      "Fewer integrations available",
      "Multimodal capabilities still developing",
    ],
    bestFor: [
      "European businesses",
      "Multilingual applications",
      "Code generation",
      "Cost-effective deployment",
    ],
    ratings: {
      reasoning: 85,
      coding: 87,
      creativity: 82,
      speed: 90,
      accuracy: 85,
      multimodal: 70,
      costEfficiency: 90,
    },
  },
  {
    id: "deepseek",
    name: "DeepSeek V3 (DeepSeek)",
    provider: "DeepSeek",
    logo: "D",
    color: "#5B6EF5",
    description:
      "DeepSeek V3 is a Chinese AI model that has surprised the industry with strong reasoning and coding capabilities at a fraction of the cost of competitors.",
    releaseDate: "2025",
    pricing: "$0.27 / 1M input tokens",
    contextWindow: "128K tokens",
    strengths: [
      "Extremely low pricing",
      "Strong math and coding performance",
      "Open-source weights available",
      "Competitive reasoning with top models",
      "Efficient architecture (MoE)",
      "Great cost-to-performance ratio",
    ],
    weaknesses: [
      "Chinese government data concerns",
      "Censored on sensitive topics",
      "Limited multimodal capabilities",
      "Less refined instruction following",
      "Availability concerns outside China",
    ],
    bestFor: [
      "Budget-conscious projects",
      "Math and science",
      "Coding tasks",
      "High-volume applications",
    ],
    ratings: {
      reasoning: 88,
      coding: 90,
      creativity: 75,
      speed: 85,
      accuracy: 86,
      multimodal: 60,
      costEfficiency: 98,
    },
  },
  {
    id: "grok",
    name: "Grok 3 (xAI)",
    provider: "xAI",
    logo: "X",
    color: "#1DA1F2",
    description:
      "xAI's Grok 3 integrates with X (Twitter) for real-time information. Known for a more unfiltered personality and strong reasoning.",
    releaseDate: "2025",
    pricing: "$10 / 1M input tokens",
    contextWindow: "128K tokens",
    strengths: [
      "Real-time data from X/Twitter",
      "Less restrictive content policies",
      "Strong mathematical reasoning",
      "Fast inference speeds",
      "Good at current events",
      "Strong personality and humor",
    ],
    weaknesses: [
      "Tied to xAI/X ecosystem",
      "Smaller developer ecosystem",
      "Can be unreliable on factual claims",
      "Limited enterprise adoption",
      "Multimodal still developing",
    ],
    bestFor: [
      "Real-time information",
      "Social media analysis",
      "Unfiltered conversations",
      "Math and reasoning",
    ],
    ratings: {
      reasoning: 87,
      coding: 82,
      creativity: 85,
      speed: 88,
      accuracy: 80,
      multimodal: 72,
      costEfficiency: 78,
    },
  },
  {
    id: "copilot",
    name: "GitHub Copilot (Microsoft)",
    provider: "Microsoft / OpenAI",
    logo: "Co",
    color: "#6E40C9",
    description:
      "GitHub Copilot is the leading AI coding assistant, powered by OpenAI models and deeply integrated into VS Code, JetBrains, and GitHub workflows.",
    releaseDate: "2024",
    pricing: "$10-39/month (subscription)",
    contextWindow: "Varies by model",
    strengths: [
      "Best-in-class IDE integration",
      "Understands full project context",
      "Multi-file editing capabilities",
      "GitHub ecosystem integration",
      "Code review and PR assistance",
      "Workspace-aware suggestions",
    ],
    weaknesses: [
      "Subscription-based pricing only",
      "Limited to coding tasks",
      "Depends on OpenAI backend",
      "Privacy concerns with code training",
      "Not a general-purpose AI",
    ],
    bestFor: [
      "Professional developers",
      "Team coding workflows",
      "Code review",
      "GitHub-centric projects",
    ],
    ratings: {
      reasoning: 75,
      coding: 94,
      creativity: 60,
      speed: 92,
      accuracy: 85,
      multimodal: 40,
      costEfficiency: 80,
    },
  },
];

const ratingLabels: Record<string, string> = {
  reasoning: "Razonamiento",
  coding: "Programacion",
  creativity: "Creatividad",
  speed: "Velocidad",
  accuracy: "Precision",
  multimodal: "Multimodal",
  costEfficiency: "Costo-Beneficio",
};

const categoryOptions = [
  { value: "all", label: "Todas las categorias" },
  { value: "reasoning", label: "Razonamiento" },
  { value: "coding", label: "Programacion" },
  { value: "creativity", label: "Creatividad" },
  { value: "speed", label: "Velocidad" },
  { value: "accuracy", label: "Precision" },
  { value: "multimodal", label: "Multimodal" },
  { value: "costEfficiency", label: "Costo-Beneficio" },
];

/* ─── Rating Bar Component ─── */

function RatingBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="flex items-center gap-3">
      <span
        className="w-28 text-xs font-medium shrink-0"
        style={{ color: "var(--brix-fg-muted)" }}
      >
        {label}
      </span>
      <div
        className="flex-1 h-2.5 rounded-full overflow-hidden"
        style={{ backgroundColor: "var(--brix-border)" }}
      >
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{ width: `${value}%`, backgroundColor: color }}
        />
      </div>
      <span
        className="w-8 text-xs font-bold text-right"
        style={{ color: "var(--brix-fg)" }}
      >
        {value}
      </span>
    </div>
  );
}

/* ─── Strength/Weakness Pill ─── */

function Tag({ text, variant }: { text: string; variant: "strength" | "weakness" }) {
  const isStrength = variant === "strength";
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium"
      style={{
        backgroundColor: isStrength ? "rgba(46, 204, 113, 0.12)" : "rgba(232, 99, 43, 0.12)",
        color: isStrength ? "var(--color-success-500)" : "var(--color-safety-400)",
      }}
    >
      <span>{isStrength ? "+" : "-"}</span>
      {text}
    </span>
  );
}

/* ─── Model Card Component ─── */

function ModelCard({
  model,
  expanded,
  onToggle,
}: {
  model: AIModel;
  expanded: boolean;
  onToggle: () => void;
}) {
  const avgRating = Math.round(
    Object.values(model.ratings).reduce((a, b) => a + b, 0) /
      Object.values(model.ratings).length
  );

  return (
    <div
      className="rounded-2xl border transition-all duration-300"
      style={{
        backgroundColor: "var(--brix-surface)",
        borderColor: expanded ? model.color : "var(--brix-border)",
        boxShadow: expanded ? `0 0 20px ${model.color}25, 0 4px 20px rgba(0,0,0,0.1)` : "var(--shadow-card)",
      }}
    >
      {/* Header */}
      <button
        onClick={onToggle}
        className="w-full px-6 py-5 flex items-center gap-4 text-left"
      >
        {/* Logo */}
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold text-white shrink-0"
          style={{ backgroundColor: model.color }}
        >
          {model.logo}
        </div>

        {/* Name & Provider */}
        <div className="flex-1 min-w-0">
          <h3
            className="text-base font-bold truncate"
            style={{ color: "var(--brix-fg)" }}
          >
            {model.name}
          </h3>
          <p className="text-xs mt-0.5" style={{ color: "var(--brix-fg-muted)" }}>
            {model.pricing} &middot; Contexto: {model.contextWindow}
          </p>
        </div>

        {/* Average Score */}
        <div className="text-right shrink-0">
          <div
            className="text-2xl font-black"
            style={{ color: model.color }}
          >
            {avgRating}
          </div>
          <div className="text-[10px] uppercase tracking-wider" style={{ color: "var(--brix-fg-muted)" }}>
            Promedio
          </div>
        </div>

        {/* Chevron */}
        <svg
          className={`w-5 h-5 shrink-0 transition-transform duration-300 ${expanded ? "rotate-180" : ""}`}
          style={{ color: "var(--brix-fg-muted)" }}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Expanded Content */}
      {expanded && (
        <div className="px-6 pb-6 space-y-5 border-t" style={{ borderColor: "var(--brix-border)" }}>
          {/* Description */}
          <p className="text-sm pt-5 leading-relaxed" style={{ color: "var(--brix-fg-muted)" }}>
            {model.description}
          </p>

          {/* Ratings */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--brix-fg)" }}>
              Puntuaciones
            </h4>
            {Object.entries(model.ratings).map(([key, value]) => (
              <RatingBar
                key={key}
                label={ratingLabels[key] || key}
                value={value}
                color={model.color}
              />
            ))}
          </div>

          {/* Strengths */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "var(--color-success-500)" }}>
              Fortalezas
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {model.strengths.map((s) => (
                <Tag key={s} text={s} variant="strength" />
              ))}
            </div>
          </div>

          {/* Weaknesses */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "var(--color-safety-400)" }}>
              Debilidades
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {model.weaknesses.map((w) => (
                <Tag key={w} text={w} variant="weakness" />
              ))}
            </div>
          </div>

          {/* Best For */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "var(--brix-fg)" }}>
              Ideal para
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {model.bestFor.map((b) => (
                <span
                  key={b}
                  className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium"
                  style={{
                    backgroundColor: `${model.color}18`,
                    color: model.color,
                  }}
                >
                  {b}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Comparison Table ─── */

function ComparisonTable({
  models,
  category,
}: {
  models: AIModel[];
  category: string;
}) {
  const ratingKeys =
    category === "all"
      ? Object.keys(models[0].ratings)
      : [category];

  return (
    <div className="overflow-x-auto rounded-xl border" style={{ borderColor: "var(--brix-border)" }}>
      <table className="w-full text-sm">
        <thead>
          <tr style={{ backgroundColor: "var(--brix-surface)" }}>
            <th
              className="text-left px-4 py-3 font-bold text-xs uppercase tracking-wider sticky left-0 z-10"
              style={{ color: "var(--brix-fg)", backgroundColor: "var(--brix-surface)" }}
            >
              Modelo
            </th>
            {ratingKeys.map((key) => (
              <th
                key={key}
                className="text-center px-3 py-3 font-bold text-xs uppercase tracking-wider"
                style={{ color: "var(--brix-fg-muted)" }}
              >
                {ratingLabels[key] || key}
              </th>
            ))}
            <th
              className="text-center px-3 py-3 font-bold text-xs uppercase tracking-wider"
              style={{ color: "var(--color-gold-500)" }}
            >
              Promedio
            </th>
          </tr>
        </thead>
        <tbody>
          {models.map((model, idx) => {
            const avg = Math.round(
              ratingKeys.reduce(
                (sum, key) => sum + model.ratings[key as keyof typeof model.ratings],
                0
              ) / ratingKeys.length
            );
            return (
              <tr
                key={model.id}
                className="border-t transition-colors"
                style={{
                  borderColor: "var(--brix-border)",
                  backgroundColor: idx % 2 === 0 ? "transparent" : "var(--brix-surface)",
                }}
              >
                <td
                  className="px-4 py-3 font-medium whitespace-nowrap sticky left-0 z-10"
                  style={{ color: "var(--brix-fg)", backgroundColor: idx % 2 === 0 ? "var(--brix-bg)" : "var(--brix-surface)" }}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold text-white shrink-0"
                      style={{ backgroundColor: model.color }}
                    >
                      {model.logo}
                    </div>
                    <span className="truncate max-w-[140px]">{model.name}</span>
                  </div>
                </td>
                {ratingKeys.map((key) => {
                  const val = model.ratings[key as keyof typeof model.ratings];
                  return (
                    <td key={key} className="text-center px-3 py-3">
                      <span
                        className="inline-flex items-center justify-center w-10 h-7 rounded-md text-xs font-bold"
                        style={{
                          backgroundColor:
                            val >= 90
                              ? "rgba(46, 204, 113, 0.15)"
                              : val >= 80
                              ? "rgba(212, 168, 67, 0.15)"
                              : "rgba(232, 99, 43, 0.12)",
                          color:
                            val >= 90
                              ? "var(--color-success-500)"
                              : val >= 80
                              ? "var(--color-gold-500)"
                              : "var(--color-safety-400)",
                        }}
                      >
                        {val}
                      </span>
                    </td>
                  );
                })}
                <td className="text-center px-3 py-3">
                  <span
                    className="inline-flex items-center justify-center w-10 h-7 rounded-md text-xs font-extrabold"
                    style={{
                      backgroundColor: `${model.color}20`,
                      color: model.color,
                    }}
                  >
                    {avg}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/* ─── Main Page ─── */

type ViewMode = "cards" | "table";

export default function AIComparisonPage() {
  const [expandedId, setExpandedId] = useState<string | null>("claude");
  const [viewMode, setViewMode] = useState<ViewMode>("cards");
  const [sortBy, setSortBy] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const sortedModels = useMemo(() => {
    let filtered = aiModels.filter(
      (m) =>
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.provider.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (sortBy !== "all") {
      filtered = [...filtered].sort(
        (a, b) =>
          b.ratings[sortBy as keyof AIModel["ratings"]] -
          a.ratings[sortBy as keyof AIModel["ratings"]]
      );
    } else {
      filtered = [...filtered].sort((a, b) => {
        const avgA =
          Object.values(a.ratings).reduce((s, v) => s + v, 0) /
          Object.values(a.ratings).length;
        const avgB =
          Object.values(b.ratings).reduce((s, v) => s + v, 0) /
          Object.values(b.ratings).length;
        return avgB - avgA;
      });
    }

    return filtered;
  }, [sortBy, searchQuery]);

  return (
    <div
      className="min-h-screen pb-12"
      style={{ backgroundColor: "var(--brix-bg)" }}
    >
      {/* Header */}
      <div className="px-4 sm:px-6 lg:px-8 pt-8 pb-6 max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h1
              className="text-2xl sm:text-3xl font-black tracking-tight"
              style={{ color: "var(--brix-fg)" }}
            >
              Comparador de{" "}
              <span
                style={{
                  background: "var(--gradient-gold-shine)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Inteligencias Artificiales
              </span>
            </h1>
            <p className="mt-2 text-sm" style={{ color: "var(--brix-fg-muted)" }}>
              Analiza y compara las principales IAs del mercado: fortalezas, debilidades y puntuaciones.
            </p>
          </div>

          {/* View Toggle */}
          <div
            className="inline-flex rounded-lg border p-0.5 shrink-0"
            style={{ borderColor: "var(--brix-border)" }}
          >
            <button
              onClick={() => setViewMode("cards")}
              className="px-3 py-1.5 rounded-md text-xs font-semibold transition-colors"
              style={{
                backgroundColor: viewMode === "cards" ? "var(--color-gold-500)" : "transparent",
                color: viewMode === "cards" ? "#fff" : "var(--brix-fg-muted)",
              }}
            >
              Tarjetas
            </button>
            <button
              onClick={() => setViewMode("table")}
              className="px-3 py-1.5 rounded-md text-xs font-semibold transition-colors"
              style={{
                backgroundColor: viewMode === "table" ? "var(--color-gold-500)" : "transparent",
                color: viewMode === "table" ? "#fff" : "var(--brix-fg-muted)",
              }}
            >
              Tabla
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="mt-5 flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
              style={{ color: "var(--brix-fg-muted)" }}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Buscar por nombre o proveedor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm outline-none transition-colors"
              style={{
                backgroundColor: "var(--brix-surface)",
                borderColor: "var(--brix-border)",
                color: "var(--brix-fg)",
              }}
            />
          </div>

          {/* Sort By Category */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2.5 rounded-xl border text-sm font-medium outline-none cursor-pointer"
            style={{
              backgroundColor: "var(--brix-surface)",
              borderColor: "var(--brix-border)",
              color: "var(--brix-fg)",
            }}
          >
            {categoryOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                Ordenar: {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        {sortedModels.length === 0 ? (
          <div
            className="text-center py-16 rounded-2xl border"
            style={{
              backgroundColor: "var(--brix-surface)",
              borderColor: "var(--brix-border)",
            }}
          >
            <p className="text-lg font-semibold" style={{ color: "var(--brix-fg)" }}>
              No se encontraron resultados
            </p>
            <p className="text-sm mt-1" style={{ color: "var(--brix-fg-muted)" }}>
              Intenta con otra busqueda.
            </p>
          </div>
        ) : viewMode === "cards" ? (
          <div className="space-y-3">
            {sortedModels.map((model) => (
              <ModelCard
                key={model.id}
                model={model}
                expanded={expandedId === model.id}
                onToggle={() =>
                  setExpandedId(expandedId === model.id ? null : model.id)
                }
              />
            ))}
          </div>
        ) : (
          <ComparisonTable models={sortedModels} category={sortBy} />
        )}
      </div>

      {/* Legend */}
      <div className="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto mt-8">
        <div
          className="rounded-xl border px-5 py-4"
          style={{
            backgroundColor: "var(--brix-surface)",
            borderColor: "var(--brix-border)",
          }}
        >
          <h4 className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: "var(--brix-fg)" }}>
            Guia de puntuaciones
          </h4>
          <div className="flex flex-wrap gap-4 text-xs" style={{ color: "var(--brix-fg-muted)" }}>
            <div className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-sm"
                style={{ backgroundColor: "var(--color-success-500)" }}
              />
              <span>90-100: Excelente</span>
            </div>
            <div className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-sm"
                style={{ backgroundColor: "var(--color-gold-500)" }}
              />
              <span>80-89: Bueno</span>
            </div>
            <div className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-sm"
                style={{ backgroundColor: "var(--color-safety-400)" }}
              />
              <span>&lt;80: Promedio</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
