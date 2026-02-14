"use client";

import { useState } from "react";
import Link from "next/link";
import { t, type Lang } from "@/lib/i18n";

/* ────────────────────────────────────────────────────────────────────────── */
/*  Language Toggle                                                          */
/* ────────────────────────────────────────────────────────────────────────── */
function LangToggle({
  lang,
  setLang,
}: {
  lang: Lang;
  setLang: (l: Lang) => void;
}) {
  return (
    <button
      onClick={() => setLang(lang === "en" ? "es" : "en")}
      className="fixed top-4 right-4 z-50 flex items-center gap-1.5 rounded-full border border-[#D4A843]/40 bg-[#1A1A2E]/90 px-4 py-2 text-sm font-semibold text-[#D4A843] backdrop-blur-sm transition-all hover:border-[#D4A843] hover:bg-[#1A1A2E]"
      aria-label="Toggle language"
    >
      <svg
        className="h-4 w-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
        />
      </svg>
      {t("global.langToggle", lang)}
    </button>
  );
}

/* ────────────────────────────────────────────────────────────────────────── */
/*  Hero Section                                                             */
/* ────────────────────────────────────────────────────────────────────────── */
function Hero({ lang }: { lang: Lang }) {
  return (
    <section className="relative min-h-[90vh] overflow-hidden bg-[#0D0D1A]">
      {/* Construction-themed gradient/pattern background */}
      <div className="absolute inset-0">
        {/* Diagonal gradient stripes */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, transparent, transparent 35px, #D4A843 35px, #D4A843 36px)",
          }}
        />
        {/* Grid pattern simulating blueprint */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(to right, #2B4C7E 1px, transparent 1px), linear-gradient(to bottom, #2B4C7E 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        {/* Radial glow */}
        <div className="absolute top-1/4 left-1/2 h-[600px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#D4A843]/[0.06] blur-[120px]" />
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#0D0D1A] to-transparent" />
      </div>

      {/* Floating construction elements */}
      <div className="absolute top-[15%] left-[10%] h-8 w-14 rotate-6 rounded-sm bg-[#E8632B]/10 animate-float-brick" />
      <div className="absolute top-[30%] right-[15%] h-8 w-14 -rotate-3 rounded-sm bg-[#D4A843]/10 animate-float-brick-slow" />
      <div className="absolute bottom-[25%] left-[20%] h-8 w-14 rotate-12 rounded-sm bg-[#2B4C7E]/10 animate-float-brick-reverse" />

      <div className="relative mx-auto flex min-h-[90vh] max-w-5xl flex-col items-center justify-center px-5 py-20 text-center">
        {/* Badge */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#D4A843]/30 bg-[#D4A843]/10 px-4 py-1.5 text-sm font-medium text-[#D4A843]">
          <span className="h-2 w-2 rounded-full bg-[#2ECC71] animate-pulse" />
          {t("global.forContractors", lang)}
        </div>

        <h1 className="mb-6 max-w-3xl text-4xl font-extrabold leading-tight tracking-tight text-[#F8F6F0] md:text-5xl lg:text-6xl">
          {t("landing.hero.headline", lang)}
        </h1>

        <p className="mb-10 max-w-2xl text-lg leading-relaxed text-[#F8F6F0]/70 md:text-xl">
          {t("landing.hero.subheadline", lang)}
        </p>

        <Link
          href="/contractors/onboarding"
          className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#D4A843] to-[#E8C76A] px-8 py-4 text-lg font-bold text-[#0D0D1A] shadow-lg transition-all hover:shadow-[0_0_30px_rgba(212,168,67,0.4)] hover:scale-[1.02] active:scale-[0.98]"
        >
          {t("landing.hero.cta", lang)}
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </Link>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────────────────── */
/*  Steps Section                                                            */
/* ────────────────────────────────────────────────────────────────────────── */
function Steps({ lang }: { lang: Lang }) {
  const steps = [
    {
      num: "01",
      icon: (
        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      title: t("landing.steps.step1.title", lang),
      desc: t("landing.steps.step1.desc", lang),
    },
    {
      num: "02",
      icon: (
        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      ),
      title: t("landing.steps.step2.title", lang),
      desc: t("landing.steps.step2.desc", lang),
    },
    {
      num: "03",
      icon: (
        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: t("landing.steps.step3.title", lang),
      desc: t("landing.steps.step3.desc", lang),
    },
  ];

  return (
    <section className="bg-[#1A1A2E] py-20 md:py-28">
      <div className="mx-auto max-w-5xl px-5">
        <h2 className="mb-14 text-center text-3xl font-bold text-[#F8F6F0] md:text-4xl">
          {t("landing.steps.title", lang)}
        </h2>

        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((step, i) => (
            <div key={i} className="group relative">
              {/* Connector line (hidden on mobile, visible md+) */}
              {i < steps.length - 1 && (
                <div className="absolute top-10 left-[calc(50%+40px)] right-0 hidden h-[2px] translate-x-4 bg-gradient-to-r from-[#D4A843]/40 to-transparent md:block" />
              )}

              <div className="flex flex-col items-center text-center">
                {/* Step number + icon */}
                <div className="relative mb-5">
                  <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-[#D4A843]/20 bg-[#0D0D1A] text-[#D4A843] transition-all group-hover:border-[#D4A843]/50 group-hover:shadow-[0_0_20px_rgba(212,168,67,0.15)]">
                    {step.icon}
                  </div>
                  <span className="absolute -top-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full bg-[#D4A843] text-xs font-bold text-[#0D0D1A]">
                    {step.num}
                  </span>
                </div>

                <h3 className="mb-2 text-xl font-bold text-[#F8F6F0]">
                  {step.title}
                </h3>
                <p className="max-w-xs text-[#F8F6F0]/60">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────────────────── */
/*  Benefits Cards                                                           */
/* ────────────────────────────────────────────────────────────────────────── */
function Benefits({ lang }: { lang: Lang }) {
  const cards = [
    {
      icon: (
        <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
      title: t("landing.benefits.card1.title", lang),
      desc: t("landing.benefits.card1.desc", lang),
      accent: "#D4A843",
    },
    {
      icon: (
        <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: t("landing.benefits.card2.title", lang),
      desc: t("landing.benefits.card2.desc", lang),
      accent: "#2ECC71",
    },
    {
      icon: (
        <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      ),
      title: t("landing.benefits.card3.title", lang),
      desc: t("landing.benefits.card3.desc", lang),
      accent: "#2B4C7E",
    },
  ];

  return (
    <section className="bg-[#0D0D1A] py-20 md:py-28">
      <div className="mx-auto max-w-5xl px-5">
        <h2 className="mb-14 text-center text-3xl font-bold text-[#F8F6F0] md:text-4xl">
          {t("landing.benefits.title", lang)}
        </h2>

        <div className="grid gap-6 md:grid-cols-3">
          {cards.map((card, i) => (
            <div
              key={i}
              className="group rounded-2xl border border-[#F8F6F0]/[0.06] bg-[#1A1A2E]/60 p-7 transition-all hover:border-[#F8F6F0]/[0.12] hover:bg-[#1A1A2E]"
            >
              <div
                className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl"
                style={{
                  backgroundColor: `${card.accent}15`,
                  color: card.accent,
                }}
              >
                {card.icon}
              </div>

              <h3 className="mb-3 text-xl font-bold text-[#F8F6F0]">
                {card.title}
              </h3>
              <p className="leading-relaxed text-[#F8F6F0]/60">{card.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────────────────── */
/*  Testimonials                                                             */
/* ────────────────────────────────────────────────────────────────────────── */
function Testimonials({ lang }: { lang: Lang }) {
  const testimonials = [
    {
      quote: t("landing.testimonials.t1.quote", lang),
      name: t("landing.testimonials.t1.name", lang),
      trade: t("landing.testimonials.t1.trade", lang),
      initials: "MJ",
    },
    {
      quote: t("landing.testimonials.t2.quote", lang),
      name: t("landing.testimonials.t2.name", lang),
      trade: t("landing.testimonials.t2.trade", lang),
      initials: "CM",
    },
    {
      quote: t("landing.testimonials.t3.quote", lang),
      name: t("landing.testimonials.t3.name", lang),
      trade: t("landing.testimonials.t3.trade", lang),
      initials: "JW",
    },
  ];

  return (
    <section className="bg-[#1A1A2E] py-20 md:py-28">
      <div className="mx-auto max-w-5xl px-5">
        <h2 className="mb-14 text-center text-3xl font-bold text-[#F8F6F0] md:text-4xl">
          {t("landing.testimonials.title", lang)}
        </h2>

        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((item, i) => (
            <div
              key={i}
              className="relative rounded-2xl border border-[#F8F6F0]/[0.06] bg-[#0D0D1A]/60 p-7"
            >
              {/* Quote mark */}
              <div className="mb-4 text-3xl font-serif text-[#D4A843]/30">
                &ldquo;
              </div>

              <p className="mb-6 leading-relaxed text-[#F8F6F0]/70">
                {item.quote}
              </p>

              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#D4A843] to-[#E8632B] text-sm font-bold text-[#0D0D1A]">
                  {item.initials}
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#F8F6F0]">
                    {item.name}
                  </p>
                  <p className="text-xs text-[#F8F6F0]/50">{item.trade}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────────────────── */
/*  Video Placeholder                                                        */
/* ────────────────────────────────────────────────────────────────────────── */
function VideoSection({ lang }: { lang: Lang }) {
  return (
    <section className="bg-[#0D0D1A] py-20 md:py-28">
      <div className="mx-auto max-w-4xl px-5">
        <h2 className="mb-4 text-center text-3xl font-bold text-[#F8F6F0] md:text-4xl">
          {t("landing.video.title", lang)}
        </h2>
        <p className="mb-10 text-center text-lg text-[#F8F6F0]/60">
          {t("landing.video.desc", lang)}
        </p>

        {/* Video placeholder */}
        <div className="group relative mx-auto aspect-video max-w-3xl cursor-pointer overflow-hidden rounded-2xl border border-[#F8F6F0]/[0.08] bg-[#1A1A2E]">
          {/* Blueprint pattern background */}
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage:
                "linear-gradient(to right, #2B4C7E 1px, transparent 1px), linear-gradient(to bottom, #2B4C7E 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />

          {/* Center play button */}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#D4A843] shadow-[0_0_40px_rgba(212,168,67,0.3)] transition-all group-hover:scale-110 group-hover:shadow-[0_0_60px_rgba(212,168,67,0.5)]">
              <svg className="ml-1 h-8 w-8 text-[#0D0D1A]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
            <span className="text-sm font-medium text-[#F8F6F0]/60">
              {t("landing.video.play", lang)}
            </span>
          </div>

          {/* Decorative corner elements */}
          <div className="absolute top-4 left-4 h-8 w-8 border-l-2 border-t-2 border-[#D4A843]/20" />
          <div className="absolute top-4 right-4 h-8 w-8 border-r-2 border-t-2 border-[#D4A843]/20" />
          <div className="absolute bottom-4 left-4 h-8 w-8 border-l-2 border-b-2 border-[#D4A843]/20" />
          <div className="absolute bottom-4 right-4 h-8 w-8 border-r-2 border-b-2 border-[#D4A843]/20" />
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────────────────── */
/*  Final CTA                                                                */
/* ────────────────────────────────────────────────────────────────────────── */
function FinalCTA({ lang }: { lang: Lang }) {
  return (
    <section className="relative overflow-hidden bg-[#1A1A2E] py-20 md:py-28">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 h-[500px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#D4A843]/[0.06] blur-[100px]" />

      <div className="relative mx-auto max-w-3xl px-5 text-center">
        <h2 className="mb-4 text-3xl font-extrabold text-[#F8F6F0] md:text-4xl lg:text-5xl">
          {t("landing.cta.headline", lang)}
        </h2>

        <p className="mb-10 text-lg text-[#F8F6F0]/60">
          {t("landing.cta.subtext", lang)}
        </p>

        <Link
          href="/contractors/onboarding"
          className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#D4A843] to-[#E8C76A] px-10 py-5 text-lg font-bold text-[#0D0D1A] shadow-[0_0_30px_rgba(212,168,67,0.3)] transition-all hover:shadow-[0_0_50px_rgba(212,168,67,0.5)] hover:scale-[1.02] active:scale-[0.98]"
        >
          {t("landing.cta.button", lang)}
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </Link>

        {/* Trust indicators */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm text-[#F8F6F0]/40">
          <span className="flex items-center gap-1.5">
            <svg className="h-4 w-4 text-[#2ECC71]" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            {lang === "en" ? "Free to join" : "Gratis para unirse"}
          </span>
          <span className="flex items-center gap-1.5">
            <svg className="h-4 w-4 text-[#2ECC71]" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            {lang === "en" ? "No crypto knowledge needed" : "No necesitas saber de cripto"}
          </span>
          <span className="flex items-center gap-1.5">
            <svg className="h-4 w-4 text-[#2ECC71]" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            {lang === "en" ? "2-minute signup" : "Registro en 2 minutos"}
          </span>
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────────────────── */
/*  Footer                                                                   */
/* ────────────────────────────────────────────────────────────────────────── */
function Footer({ lang }: { lang: Lang }) {
  return (
    <footer className="border-t border-[#F8F6F0]/[0.06] bg-[#0D0D1A] py-10">
      <div className="mx-auto max-w-5xl px-5 text-center">
        <p className="text-sm text-[#F8F6F0]/30">
          &copy; {new Date().getFullYear()} BrixUp &mdash; brixups.com
          {" | "}
          <Link
            href="/contractors/learn"
            className="text-[#D4A843]/60 hover:text-[#D4A843] transition-colors"
          >
            {lang === "en" ? "Learn about $BRIX" : "Aprende sobre $BRIX"}
          </Link>
        </p>
      </div>
    </footer>
  );
}

/* ────────────────────────────────────────────────────────────────────────── */
/*  Page Component                                                           */
/* ────────────────────────────────────────────────────────────────────────── */
export default function ContractorsPage() {
  const [lang, setLang] = useState<Lang>("en");

  return (
    <div className="min-h-screen bg-[#0D0D1A] text-[#F8F6F0]">
      <LangToggle lang={lang} setLang={setLang} />
      <Hero lang={lang} />
      <Steps lang={lang} />
      <Benefits lang={lang} />
      <Testimonials lang={lang} />
      <VideoSection lang={lang} />
      <FinalCTA lang={lang} />
      <Footer lang={lang} />
    </div>
  );
}
