"use client";

import { useState } from "react";
import Link from "next/link";
import { t, type Lang } from "@/lib/i18n";

/* ────────────────────────────────────────────────────────────────────────── */
/*  Trade rate map for the calculator                                        */
/* ────────────────────────────────────────────────────────────────────────── */
const TRADE_RATES: Record<string, number> = {
  "trade.electrical": 160,
  "trade.plumbing": 150,
  "trade.hvac": 155,
  "trade.framing": 120,
  "trade.roofing": 130,
  "trade.concrete": 125,
  "trade.painting": 100,
  "trade.drywall": 110,
  "trade.tile": 115,
  "trade.generalLabor": 90,
  "trade.other": 100,
};

const TRADE_KEYS = Object.keys(TRADE_RATES);

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
      className="fixed top-4 right-4 z-50 flex items-center gap-1.5 rounded-full border border-[#D4A843]/40 bg-[#1A1A2E]/90 px-3 py-1.5 text-xs font-semibold text-[#D4A843] backdrop-blur-sm transition-all hover:border-[#D4A843]"
      aria-label="Toggle language"
    >
      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
      </svg>
      {t("global.langToggle", lang)}
    </button>
  );
}

/* ────────────────────────────────────────────────────────────────────────── */
/*  Section 1: What is $BRIX?                                                */
/* ────────────────────────────────────────────────────────────────────────── */
function WhatIsBrix({ lang }: { lang: Lang }) {
  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-3xl px-5">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-[#D4A843]/10 px-4 py-1.5 text-sm font-medium text-[#D4A843]">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#D4A843] text-xs font-bold text-[#0D0D1A]">
            1
          </span>
          {t("learn.s1.title", lang)}
        </div>

        {/* Analogy callout */}
        <div className="mb-8 rounded-2xl border border-[#D4A843]/20 bg-gradient-to-br from-[#D4A843]/10 to-[#D4A843]/[0.02] p-6 md:p-8">
          <div className="mb-3 text-3xl">&#128161;</div>
          <p className="text-lg font-semibold leading-relaxed text-[#F8F6F0] md:text-xl">
            &ldquo;{t("learn.s1.analogy", lang)}&rdquo;
          </p>
        </div>

        <div className="space-y-4 text-[#F8F6F0]/70 leading-relaxed">
          <p>{t("learn.s1.p1", lang)}</p>
          <p>{t("learn.s1.p2", lang)}</p>
        </div>

        {/* Visual: Token illustration */}
        <div className="mt-8 flex items-center justify-center gap-4">
          <div className="flex flex-col items-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#D4A843] to-[#E8C76A] text-xl font-extrabold text-[#0D0D1A] shadow-[0_0_20px_rgba(212,168,67,0.3)]">
              B
            </div>
            <span className="mt-2 text-xs font-medium text-[#D4A843]">$BRIX</span>
          </div>
          <svg className="h-6 w-6 text-[#F8F6F0]/20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
          <div className="flex flex-col items-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#2ECC71] to-[#27B062] text-xl font-extrabold text-white shadow-[0_0_20px_rgba(46,204,113,0.2)]">
              $
            </div>
            <span className="mt-2 text-xs font-medium text-[#2ECC71]">USDC</span>
          </div>
          <svg className="h-6 w-6 text-[#F8F6F0]/20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
          <div className="flex flex-col items-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#2B4C7E] to-[#244068] text-xl font-extrabold text-white shadow-[0_0_20px_rgba(43,76,126,0.2)]">
              <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
              </svg>
            </div>
            <span className="mt-2 text-xs font-medium text-[#2B4C7E]" style={{ color: "#6b9fd4" }}>
              {lang === "en" ? "Bank" : "Banco"}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────────────────── */
/*  Section 2: Convert to Cash                                               */
/* ────────────────────────────────────────────────────────────────────────── */
function ConvertToCash({ lang }: { lang: Lang }) {
  const steps = [
    {
      num: "1",
      title: t("learn.s2.step1.title", lang),
      desc: t("learn.s2.step1.desc", lang),
      icon: (
        <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3" />
        </svg>
      ),
    },
    {
      num: "2",
      title: t("learn.s2.step2.title", lang),
      desc: t("learn.s2.step2.desc", lang),
      icon: (
        <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
        </svg>
      ),
    },
    {
      num: "3",
      title: t("learn.s2.step3.title", lang),
      desc: t("learn.s2.step3.desc", lang),
      icon: (
        <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V13.5zm0 2.25h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V18zm2.498-6.75h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V13.5zm0 2.25h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V18zm2.504-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V13.5zm0 2.25h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V18zm2.498-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V13.5zM8.25 6h7.5v2.25h-7.5V6zM12 2.25c-1.892 0-3.758.11-5.593.322C5.307 2.7 4.5 3.65 4.5 4.757V19.5a2.25 2.25 0 002.25 2.25h10.5a2.25 2.25 0 002.25-2.25V4.757c0-1.108-.806-2.057-1.907-2.185A48.507 48.507 0 0012 2.25z" />
        </svg>
      ),
    },
    {
      num: "4",
      title: t("learn.s2.step4.title", lang),
      desc: t("learn.s2.step4.desc", lang),
      icon: (
        <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
        </svg>
      ),
    },
  ];

  return (
    <section className="border-t border-[#F8F6F0]/[0.06] bg-[#1A1A2E]/40 py-16 md:py-24">
      <div className="mx-auto max-w-3xl px-5">
        <div className="mb-10 inline-flex items-center gap-2 rounded-full bg-[#2ECC71]/10 px-4 py-1.5 text-sm font-medium text-[#2ECC71]">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#2ECC71] text-xs font-bold text-[#0D0D1A]">
            2
          </span>
          {t("learn.s2.title", lang)}
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {steps.map((step, i) => (
            <div
              key={i}
              className="relative rounded-xl border border-[#F8F6F0]/[0.06] bg-[#0D0D1A]/40 p-5"
            >
              {/* Step number */}
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2ECC71]/10 text-[#2ECC71]">
                  {step.icon}
                </div>
                <span className="text-2xl font-extrabold text-[#F8F6F0]/10">
                  {step.num}
                </span>
              </div>

              <h3 className="mb-2 text-lg font-bold text-[#F8F6F0]">
                {step.title}
              </h3>
              <p className="text-sm leading-relaxed text-[#F8F6F0]/50">
                {step.desc}
              </p>

              {/* Arrow connector (for sm+ horizontal) */}
              {i < steps.length - 1 && i % 2 === 0 && (
                <div className="absolute top-1/2 -right-3 hidden -translate-y-1/2 text-[#F8F6F0]/10 sm:block">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────────────────── */
/*  Section 3: Profit Share Calculator                                       */
/* ────────────────────────────────────────────────────────────────────────── */
function ProfitCalculator({ lang }: { lang: Lang }) {
  const [trade, setTrade] = useState("trade.electrical");
  const [hours, setHours] = useState("40");
  const [weeks, setWeeks] = useState("8");
  const [calculated, setCalculated] = useState(false);

  const brixRate = TRADE_RATES[trade] || 100;
  const totalHours = (parseInt(hours) || 0) * (parseInt(weeks) || 0);
  const totalBrix = totalHours * brixRate;
  const cashValue = totalBrix * 0.1; // $0.10 per BRIX
  const profitShareBonus = cashValue * 0.15; // 15% bonus estimate
  const totalEarnings = cashValue + profitShareBonus;

  const handleCalculate = () => {
    setCalculated(true);
  };

  return (
    <section className="border-t border-[#F8F6F0]/[0.06] py-16 md:py-24">
      <div className="mx-auto max-w-3xl px-5">
        <div className="mb-10 inline-flex items-center gap-2 rounded-full bg-[#E8632B]/10 px-4 py-1.5 text-sm font-medium text-[#E8632B]">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#E8632B] text-xs font-bold text-white">
            3
          </span>
          {t("learn.s3.title", lang)}
        </div>

        <p className="mb-8 text-[#F8F6F0]/60">
          {t("learn.s3.desc", lang)}
        </p>

        <div className="rounded-2xl border border-[#F8F6F0]/[0.08] bg-[#1A1A2E]/60 p-6 md:p-8">
          {/* Inputs */}
          <div className="mb-6 grid gap-4 sm:grid-cols-3">
            {/* Trade select */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[#F8F6F0]/70">
                {t("learn.s3.yourTrade", lang)}
              </label>
              <select
                value={trade}
                onChange={(e) => {
                  setTrade(e.target.value);
                  setCalculated(false);
                }}
                className="w-full appearance-none rounded-lg border border-[#F8F6F0]/10 bg-[#0D0D1A]/60 px-3 py-2.5 text-sm text-[#F8F6F0] outline-none focus:border-[#D4A843]/50 focus:ring-2 focus:ring-[#D4A843]/20"
              >
                {TRADE_KEYS.map((key) => (
                  <option key={key} value={key} className="bg-[#1A1A2E]">
                    {t(key, lang)}
                  </option>
                ))}
              </select>
            </div>

            {/* Hours */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[#F8F6F0]/70">
                {t("learn.s3.hoursPerWeek", lang)}
              </label>
              <input
                type="number"
                value={hours}
                onChange={(e) => {
                  setHours(e.target.value);
                  setCalculated(false);
                }}
                min="1"
                max="80"
                className="w-full rounded-lg border border-[#F8F6F0]/10 bg-[#0D0D1A]/60 px-3 py-2.5 text-sm text-[#F8F6F0] outline-none focus:border-[#D4A843]/50 focus:ring-2 focus:ring-[#D4A843]/20"
              />
            </div>

            {/* Weeks */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[#F8F6F0]/70">
                {t("learn.s3.weeks", lang)}
              </label>
              <input
                type="number"
                value={weeks}
                onChange={(e) => {
                  setWeeks(e.target.value);
                  setCalculated(false);
                }}
                min="1"
                max="52"
                className="w-full rounded-lg border border-[#F8F6F0]/10 bg-[#0D0D1A]/60 px-3 py-2.5 text-sm text-[#F8F6F0] outline-none focus:border-[#D4A843]/50 focus:ring-2 focus:ring-[#D4A843]/20"
              />
            </div>
          </div>

          {/* Base rate display */}
          <div className="mb-6 rounded-lg bg-[#D4A843]/[0.06] px-4 py-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#F8F6F0]/50">
                {t("learn.s3.baseRate", lang)}
              </span>
              <span className="font-bold text-[#D4A843]">
                {brixRate} $BRIX {t("learn.s3.perHour", lang)}
              </span>
            </div>
          </div>

          {/* Calculate button */}
          <button
            onClick={handleCalculate}
            className="mb-6 w-full rounded-lg bg-gradient-to-r from-[#D4A843] to-[#E8C76A] px-6 py-3 font-bold text-[#0D0D1A] transition-all hover:shadow-[0_0_20px_rgba(212,168,67,0.3)]"
          >
            {t("learn.s3.calculate", lang)}
          </button>

          {/* Results */}
          {calculated && (
            <div className="space-y-3 animate-count-up">
              <div className="flex items-center justify-between rounded-lg bg-[#0D0D1A]/40 px-4 py-3">
                <span className="text-sm text-[#F8F6F0]/50">
                  {t("learn.s3.totalBrix", lang)}
                </span>
                <span className="text-lg font-bold text-[#D4A843]">
                  {totalBrix.toLocaleString()} $BRIX
                </span>
              </div>

              <div className="flex items-center justify-between rounded-lg bg-[#0D0D1A]/40 px-4 py-3">
                <span className="text-sm text-[#F8F6F0]/50">
                  {t("learn.s3.cashValue", lang)}
                </span>
                <span className="text-lg font-bold text-[#2ECC71]">
                  ${cashValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>

              <div className="flex items-center justify-between rounded-lg bg-[#0D0D1A]/40 px-4 py-3">
                <span className="text-sm text-[#F8F6F0]/50">
                  {t("learn.s3.profitShare", lang)}
                </span>
                <span className="text-lg font-bold text-[#E8632B]">
                  +${profitShareBonus.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>

              <div className="flex items-center justify-between rounded-xl border border-[#D4A843]/30 bg-gradient-to-r from-[#D4A843]/10 to-[#D4A843]/[0.03] px-4 py-4">
                <span className="font-semibold text-[#F8F6F0]">
                  {t("learn.s3.totalEarnings", lang)}
                </span>
                <span className="text-2xl font-extrabold text-[#D4A843]">
                  ${totalEarnings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>

              <p className="pt-2 text-center text-xs text-[#F8F6F0]/30">
                {t("learn.s3.disclaimer", lang)}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────────────────── */
/*  Section 4: FAQ                                                           */
/* ────────────────────────────────────────────────────────────────────────── */
function FAQ({ lang }: { lang: Lang }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const questions = Array.from({ length: 8 }, (_, i) => ({
    q: t(`learn.faq.q${i + 1}.q`, lang),
    a: t(`learn.faq.q${i + 1}.a`, lang),
  }));

  return (
    <section className="border-t border-[#F8F6F0]/[0.06] bg-[#1A1A2E]/40 py-16 md:py-24">
      <div className="mx-auto max-w-3xl px-5">
        <div className="mb-10 inline-flex items-center gap-2 rounded-full bg-[#2B4C7E]/10 px-4 py-1.5 text-sm font-medium" style={{ color: "#6b9fd4" }}>
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#2B4C7E] text-xs font-bold text-white">
            4
          </span>
          {t("learn.faq.title", lang)}
        </div>

        <div className="space-y-3">
          {questions.map((item, i) => {
            const isOpen = openIndex === i;

            return (
              <div
                key={i}
                className={`overflow-hidden rounded-xl border transition-all ${
                  isOpen
                    ? "border-[#D4A843]/20 bg-[#0D0D1A]/60"
                    : "border-[#F8F6F0]/[0.06] bg-[#0D0D1A]/30"
                }`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                >
                  <span
                    className={`text-sm font-semibold transition-colors md:text-base ${
                      isOpen ? "text-[#D4A843]" : "text-[#F8F6F0]/80"
                    }`}
                  >
                    {item.q}
                  </span>
                  <svg
                    className={`h-5 w-5 shrink-0 transition-transform duration-300 ${
                      isOpen
                        ? "rotate-180 text-[#D4A843]"
                        : "text-[#F8F6F0]/30"
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {isOpen && (
                  <div className="border-t border-[#F8F6F0]/[0.04] px-5 pb-5 pt-3">
                    <p className="text-sm leading-relaxed text-[#F8F6F0]/60">
                      {item.a}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────────────────── */
/*  Main Learn Page                                                          */
/* ────────────────────────────────────────────────────────────────────────── */
export default function LearnPage() {
  const [lang, setLang] = useState<Lang>("en");

  return (
    <div className="min-h-screen bg-[#0D0D1A] text-[#F8F6F0]">
      <LangToggle lang={lang} setLang={setLang} />

      {/* Header */}
      <header className="border-b border-[#F8F6F0]/[0.06] bg-[#1A1A2E]/60 backdrop-blur-sm">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-4">
          <Link
            href="/contractors"
            className="flex items-center gap-2 text-sm font-bold text-[#D4A843]"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            BrixUp
          </Link>
          <span className="text-sm text-[#F8F6F0]/40">
            {t("learn.title", lang)}
          </span>
        </div>
      </header>

      {/* Page title */}
      <div className="relative overflow-hidden bg-[#0D0D1A] py-12 md:py-16">
        {/* Subtle background */}
        <div className="absolute top-0 left-1/2 h-[300px] w-[500px] -translate-x-1/2 rounded-full bg-[#D4A843]/[0.04] blur-[100px]" />

        <div className="relative mx-auto max-w-3xl px-5 text-center">
          <h1 className="text-3xl font-extrabold text-[#F8F6F0] md:text-4xl">
            {t("learn.title", lang)}
          </h1>
          <p className="mt-3 text-[#F8F6F0]/50">
            {lang === "en"
              ? "Everything you need to know about earning with BrixUp."
              : "Todo lo que necesitas saber sobre ganar con BrixUp."}
          </p>
        </div>
      </div>

      <WhatIsBrix lang={lang} />
      <ConvertToCash lang={lang} />
      <ProfitCalculator lang={lang} />
      <FAQ lang={lang} />

      {/* CTA at bottom */}
      <section className="border-t border-[#F8F6F0]/[0.06] py-16">
        <div className="mx-auto max-w-3xl px-5 text-center">
          <h2 className="mb-4 text-2xl font-bold text-[#F8F6F0] md:text-3xl">
            {lang === "en" ? "Ready to Start Earning?" : "¿Listo para Empezar a Ganar?"}
          </h2>
          <p className="mb-8 text-[#F8F6F0]/50">
            {lang === "en"
              ? "Join thousands of builders who are earning $BRIX and building real wealth."
              : "Únete a miles de constructores que están ganando $BRIX y construyendo riqueza real."}
          </p>
          <Link
            href="/contractors/onboarding"
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#D4A843] to-[#E8C76A] px-8 py-4 text-lg font-bold text-[#0D0D1A] shadow-lg transition-all hover:shadow-[0_0_30px_rgba(212,168,67,0.4)] hover:scale-[1.02] active:scale-[0.98]"
          >
            {t("landing.cta.button", lang)}
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#F8F6F0]/[0.06] py-8">
        <div className="mx-auto max-w-3xl px-5 text-center text-sm text-[#F8F6F0]/30">
          &copy; {new Date().getFullYear()} BrixUp &mdash; brixups.com
        </div>
      </footer>
    </div>
  );
}
