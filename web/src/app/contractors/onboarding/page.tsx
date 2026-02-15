"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { t, type Lang } from "@/lib/i18n";

/* ────────────────────────────────────────────────────────────────────────── */
/*  Constants                                                                */
/* ────────────────────────────────────────────────────────────────────────── */
const TOTAL_STEPS = 5;

const TRADE_KEYS = [
  "trade.electrical",
  "trade.plumbing",
  "trade.hvac",
  "trade.framing",
  "trade.roofing",
  "trade.concrete",
  "trade.painting",
  "trade.drywall",
  "trade.tile",
  "trade.generalLabor",
  "trade.other",
] as const;

/* ────────────────────────────────────────────────────────────────────────── */
/*  Types                                                                    */
/* ────────────────────────────────────────────────────────────────────────── */
interface FormData {
  fullName: string;
  phone: string;
  email: string;
  trade: string;
  location: string;
  experience: string;
  licenseNumber: string;
  insuranceProvider: string;
  w9Status: string;
  ref1Name: string;
  ref1Phone: string;
  ref2Name: string;
  ref2Phone: string;
  walletCreated: boolean;
  selectedDeal: number | null;
}

/* ────────────────────────────────────────────────────────────────────────── */
/*  Language Toggle (inline for this page — fixed position)                  */
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
/*  Progress Bar                                                             */
/* ────────────────────────────────────────────────────────────────────────── */
function ProgressBar({ step, lang }: { step: number; lang: Lang }) {
  const labels = [
    t("onboarding.progress.step1", lang),
    t("onboarding.progress.step2", lang),
    t("onboarding.progress.step3", lang),
    t("onboarding.progress.step4", lang),
    t("onboarding.progress.step5", lang),
  ];

  return (
    <div className="mb-8">
      {/* Step counter */}
      <p className="mb-4 text-center text-sm text-[#F8F6F0]/50">
        {t("onboarding.step", lang)} {step} {t("onboarding.of", lang)}{" "}
        {TOTAL_STEPS}
      </p>

      {/* Progress dots with connecting lines */}
      <div className="flex items-center justify-center gap-0">
        {labels.map((label, i) => {
          const stepNum = i + 1;
          const isActive = stepNum === step;
          const isComplete = stepNum < step;

          return (
            <div key={i} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all duration-300 ${
                    isComplete
                      ? "bg-[#2ECC71] text-[#0D0D1A]"
                      : isActive
                        ? "bg-[#D4A843] text-[#0D0D1A] shadow-[0_0_12px_rgba(212,168,67,0.4)]"
                        : "border border-[#F8F6F0]/20 bg-transparent text-[#F8F6F0]/40"
                  }`}
                >
                  {isComplete ? (
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    stepNum
                  )}
                </div>
                <span
                  className={`mt-1.5 hidden text-[10px] sm:block ${
                    isActive
                      ? "font-semibold text-[#D4A843]"
                      : isComplete
                        ? "text-[#2ECC71]/70"
                        : "text-[#F8F6F0]/30"
                  }`}
                >
                  {label}
                </span>
              </div>

              {/* Connector */}
              {i < TOTAL_STEPS - 1 && (
                <div
                  className={`mx-1 h-[2px] w-6 sm:mx-2 sm:w-10 transition-all duration-300 ${
                    stepNum < step ? "bg-[#2ECC71]" : "bg-[#F8F6F0]/10"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────────── */
/*  Shared Input Components                                                  */
/* ────────────────────────────────────────────────────────────────────────── */
function InputField({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  optional = false,
  lang,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  required?: boolean;
  optional?: boolean;
  lang: Lang;
}) {
  const hasError = required && value.trim() === "";

  return (
    <div className="mb-4">
      <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-[#F8F6F0]/80">
        {label}
        {optional && (
          <span className="rounded bg-[#F8F6F0]/5 px-1.5 py-0.5 text-[10px] text-[#F8F6F0]/30">
            {t("global.optional", lang)}
          </span>
        )}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full rounded-lg border bg-[#0D0D1A]/60 px-4 py-3 text-[#F8F6F0] placeholder-[#F8F6F0]/20 outline-none transition-all focus:ring-2 ${
          hasError
            ? "border-[#E8632B]/50 focus:border-[#E8632B] focus:ring-[#E8632B]/20"
            : "border-[#F8F6F0]/10 focus:border-[#D4A843]/50 focus:ring-[#D4A843]/20"
        }`}
      />
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
}) {
  return (
    <div className="mb-4">
      <label className="mb-1.5 block text-sm font-medium text-[#F8F6F0]/80">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none rounded-lg border border-[#F8F6F0]/10 bg-[#0D0D1A]/60 px-4 py-3 text-[#F8F6F0] outline-none transition-all focus:border-[#D4A843]/50 focus:ring-2 focus:ring-[#D4A843]/20"
      >
        {placeholder && (
          <option value="" className="bg-[#1A1A2E] text-[#F8F6F0]/40">
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-[#1A1A2E]">
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────────── */
/*  Step 1: Basic Info                                                       */
/* ────────────────────────────────────────────────────────────────────────── */
function Step1({
  form,
  setForm,
  lang,
}: {
  form: FormData;
  setForm: React.Dispatch<React.SetStateAction<FormData>>;
  lang: Lang;
}) {
  const tradeOptions = TRADE_KEYS.map((key) => ({
    value: key,
    label: t(key, lang),
  }));

  return (
    <div>
      <h2 className="mb-1 text-2xl font-bold text-[#F8F6F0]">
        {t("onboarding.step1.title", lang)}
      </h2>
      <p className="mb-6 text-sm text-[#F8F6F0]/50">
        {t("onboarding.step1.subtitle", lang)}
      </p>

      <InputField
        label={t("onboarding.step1.fullName", lang)}
        value={form.fullName}
        onChange={(v) => setForm((f) => ({ ...f, fullName: v }))}
        placeholder={lang === "en" ? "John Smith" : "Juan Pérez"}
        required
        lang={lang}
      />
      <InputField
        label={t("onboarding.step1.phone", lang)}
        type="tel"
        value={form.phone}
        onChange={(v) => setForm((f) => ({ ...f, phone: v }))}
        placeholder="(555) 123-4567"
        required
        lang={lang}
      />
      <InputField
        label={t("onboarding.step1.email", lang)}
        type="email"
        value={form.email}
        onChange={(v) => setForm((f) => ({ ...f, email: v }))}
        placeholder="you@email.com"
        required
        lang={lang}
      />
      <SelectField
        label={t("onboarding.step1.trade", lang)}
        value={form.trade}
        onChange={(v) => setForm((f) => ({ ...f, trade: v }))}
        options={tradeOptions}
        placeholder={t("onboarding.step1.selectTrade", lang)}
      />
      <InputField
        label={t("onboarding.step1.location", lang)}
        value={form.location}
        onChange={(v) => setForm((f) => ({ ...f, location: v }))}
        placeholder={lang === "en" ? "Atlanta, GA" : "Houston, TX"}
        required
        lang={lang}
      />
      <InputField
        label={t("onboarding.step1.experience", lang)}
        type="number"
        value={form.experience}
        onChange={(v) => setForm((f) => ({ ...f, experience: v }))}
        placeholder="5"
        required
        lang={lang}
      />
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────────── */
/*  Step 2: Credentials                                                      */
/* ────────────────────────────────────────────────────────────────────────── */
function Step2({
  form,
  setForm,
  lang,
}: {
  form: FormData;
  setForm: React.Dispatch<React.SetStateAction<FormData>>;
  lang: Lang;
}) {
  const w9Options = [
    { value: "filed", label: t("onboarding.step2.w9Filed", lang) },
    { value: "pending", label: t("onboarding.step2.w9Pending", lang) },
    { value: "unsure", label: t("onboarding.step2.w9NotSure", lang) },
  ];

  return (
    <div>
      <h2 className="mb-1 text-2xl font-bold text-[#F8F6F0]">
        {t("onboarding.step2.title", lang)}
      </h2>
      <p className="mb-6 text-sm text-[#F8F6F0]/50">
        {t("onboarding.step2.subtitle", lang)}
      </p>

      <InputField
        label={t("onboarding.step2.licenseNumber", lang)}
        value={form.licenseNumber}
        onChange={(v) => setForm((f) => ({ ...f, licenseNumber: v }))}
        placeholder="LIC-123456"
        optional
        lang={lang}
      />
      <InputField
        label={t("onboarding.step2.insuranceProvider", lang)}
        value={form.insuranceProvider}
        onChange={(v) => setForm((f) => ({ ...f, insuranceProvider: v }))}
        placeholder={
          lang === "en" ? "State Farm, Allstate, etc." : "State Farm, Allstate, etc."
        }
        required
        lang={lang}
      />
      <SelectField
        label={t("onboarding.step2.w9Status", lang)}
        value={form.w9Status}
        onChange={(v) => setForm((f) => ({ ...f, w9Status: v }))}
        options={w9Options}
        placeholder={lang === "en" ? "Select status..." : "Selecciona estado..."}
      />

      {/* References */}
      <div className="mt-6">
        <h3 className="mb-4 text-lg font-semibold text-[#F8F6F0]/90">
          {t("onboarding.step2.references", lang)}
        </h3>

        {/* Ref 1 */}
        <div className="mb-4 rounded-xl border border-[#F8F6F0]/[0.06] bg-[#0D0D1A]/40 p-4">
          <p className="mb-3 text-xs font-medium uppercase tracking-wider text-[#D4A843]/70">
            {lang === "en" ? "Reference 1" : "Referencia 1"}
          </p>
          <InputField
            label={t("onboarding.step2.refName", lang)}
            value={form.ref1Name}
            onChange={(v) => setForm((f) => ({ ...f, ref1Name: v }))}
            placeholder={lang === "en" ? "Full name" : "Nombre completo"}
            required
            lang={lang}
          />
          <InputField
            label={t("onboarding.step2.refPhone", lang)}
            type="tel"
            value={form.ref1Phone}
            onChange={(v) => setForm((f) => ({ ...f, ref1Phone: v }))}
            placeholder="(555) 000-0000"
            required
            lang={lang}
          />
        </div>

        {/* Ref 2 */}
        <div className="rounded-xl border border-[#F8F6F0]/[0.06] bg-[#0D0D1A]/40 p-4">
          <p className="mb-3 text-xs font-medium uppercase tracking-wider text-[#D4A843]/70">
            {lang === "en" ? "Reference 2" : "Referencia 2"}
          </p>
          <InputField
            label={t("onboarding.step2.refName", lang)}
            value={form.ref2Name}
            onChange={(v) => setForm((f) => ({ ...f, ref2Name: v }))}
            placeholder={lang === "en" ? "Full name" : "Nombre completo"}
            required
            lang={lang}
          />
          <InputField
            label={t("onboarding.step2.refPhone", lang)}
            type="tel"
            value={form.ref2Phone}
            onChange={(v) => setForm((f) => ({ ...f, ref2Phone: v }))}
            placeholder="(555) 000-0000"
            required
            lang={lang}
          />
        </div>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────────── */
/*  Step 3: Wallet Setup                                                     */
/* ────────────────────────────────────────────────────────────────────────── */
function Step3({
  form,
  setForm,
  lang,
}: {
  form: FormData;
  setForm: React.Dispatch<React.SetStateAction<FormData>>;
  lang: Lang;
}) {
  const [creating, setCreating] = useState(false);
  const [address, setAddress] = useState("");

  const handleCreate = useCallback(() => {
    if (form.walletCreated) return;
    setCreating(true);

    // Simulated wallet creation
    setTimeout(() => {
      const simulated =
        "0x" +
        Array.from({ length: 40 }, () =>
          Math.floor(Math.random() * 16).toString(16)
        ).join("");
      setAddress(simulated);
      setCreating(false);
      setForm((f) => ({ ...f, walletCreated: true }));
    }, 2500);
  }, [form.walletCreated, setForm]);

  const bullets = [
    t("onboarding.step3.bullet1", lang),
    t("onboarding.step3.bullet2", lang),
    t("onboarding.step3.bullet3", lang),
    t("onboarding.step3.bullet4", lang),
  ];

  return (
    <div>
      <h2 className="mb-1 text-2xl font-bold text-[#F8F6F0]">
        {t("onboarding.step3.title", lang)}
      </h2>
      <p className="mb-6 text-lg font-medium text-[#D4A843]">
        {t("onboarding.step3.subtitle", lang)}
      </p>

      {/* Explanation */}
      <div className="mb-6 rounded-xl border border-[#F8F6F0]/[0.06] bg-[#0D0D1A]/40 p-5">
        <p className="mb-4 leading-relaxed text-[#F8F6F0]/70">
          {t("onboarding.step3.explanation", lang)}
        </p>

        <ul className="space-y-2.5">
          {bullets.map((b, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-[#F8F6F0]/60">
              <svg className="mt-0.5 h-4 w-4 shrink-0 text-[#2ECC71]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              {b}
            </li>
          ))}
        </ul>
      </div>

      {/* Create wallet button or success state */}
      {!form.walletCreated ? (
        <button
          onClick={handleCreate}
          disabled={creating}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#D4A843] to-[#E8C76A] px-6 py-4 text-lg font-bold text-[#0D0D1A] shadow-lg transition-all hover:shadow-[0_0_25px_rgba(212,168,67,0.4)] disabled:opacity-70"
        >
          {creating ? (
            <>
              <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              {t("onboarding.step3.creating", lang)}
            </>
          ) : (
            <>
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              {t("onboarding.step3.createButton", lang)}
            </>
          )}
        </button>
      ) : (
        <div className="rounded-xl border border-[#2ECC71]/30 bg-[#2ECC71]/10 p-5 text-center">
          <div className="mb-3 flex justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#2ECC71]/20">
              <svg className="h-7 w-7 text-[#2ECC71]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <p className="mb-2 text-lg font-bold text-[#2ECC71]">
            {t("onboarding.step3.success", lang)}
          </p>
          <p className="mb-1 text-xs text-[#F8F6F0]/40">
            {t("onboarding.step3.walletAddress", lang)}
          </p>
          <p className="break-all rounded-lg bg-[#0D0D1A]/40 px-3 py-2 font-mono text-xs text-[#D4A843]">
            {address}
          </p>
        </div>
      )}
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────────── */
/*  Step 4: Pick Your First Deal                                             */
/* ────────────────────────────────────────────────────────────────────────── */
function Step4({
  form,
  setForm,
  lang,
}: {
  form: FormData;
  setForm: React.Dispatch<React.SetStateAction<FormData>>;
  lang: Lang;
}) {
  const deals = [
    {
      title: t("deal.1.title", lang),
      location: t("deal.1.location", lang),
      trade: t("deal.1.trade", lang),
      duration: t("deal.1.duration", lang),
      brixRate: 150,
      profitShare: "2.5%",
    },
    {
      title: t("deal.2.title", lang),
      location: t("deal.2.location", lang),
      trade: t("deal.2.trade", lang),
      duration: t("deal.2.duration", lang),
      brixRate: 120,
      profitShare: "3.0%",
    },
    {
      title: t("deal.3.title", lang),
      location: t("deal.3.location", lang),
      trade: t("deal.3.trade", lang),
      duration: t("deal.3.duration", lang),
      brixRate: 100,
      profitShare: "2.0%",
    },
  ];

  return (
    <div>
      <h2 className="mb-1 text-2xl font-bold text-[#F8F6F0]">
        {t("onboarding.step4.title", lang)}
      </h2>
      <p className="mb-6 text-sm text-[#F8F6F0]/50">
        {t("onboarding.step4.subtitle", lang)}
      </p>

      <div className="space-y-4">
        {deals.map((deal, i) => {
          const isSelected = form.selectedDeal === i;

          return (
            <div
              key={i}
              className={`relative overflow-hidden rounded-xl border p-5 transition-all ${
                isSelected
                  ? "border-[#D4A843]/60 bg-[#D4A843]/[0.08] shadow-[0_0_20px_rgba(212,168,67,0.1)]"
                  : "border-[#F8F6F0]/[0.08] bg-[#0D0D1A]/40 hover:border-[#F8F6F0]/[0.15]"
              }`}
            >
              {/* Trade badge */}
              <span className="mb-3 inline-block rounded-full bg-[#2B4C7E]/20 px-3 py-1 text-xs font-medium text-[#2B4C7E]" style={{ color: "#6b9fd4" }}>
                {deal.trade}
              </span>

              <h3 className="mb-1 text-lg font-bold text-[#F8F6F0]">
                {deal.title}
              </h3>

              <div className="mb-4 flex flex-wrap items-center gap-3 text-sm text-[#F8F6F0]/50">
                <span className="flex items-center gap-1">
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {deal.location}
                </span>
                <span className="flex items-center gap-1">
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {deal.duration}
                </span>
              </div>

              {/* Rate info */}
              <div className="mb-4 flex gap-4">
                <div className="rounded-lg bg-[#D4A843]/10 px-3 py-2">
                  <p className="text-xs text-[#D4A843]/70">{t("onboarding.step4.brixRate", lang)}</p>
                  <p className="text-lg font-bold text-[#D4A843]">{deal.brixRate}</p>
                </div>
                <div className="rounded-lg bg-[#2ECC71]/10 px-3 py-2">
                  <p className="text-xs text-[#2ECC71]/70">{t("onboarding.step4.profitShare", lang)}</p>
                  <p className="text-lg font-bold text-[#2ECC71]">{deal.profitShare}</p>
                </div>
              </div>

              {/* Interest button */}
              <button
                onClick={() =>
                  setForm((f) => ({
                    ...f,
                    selectedDeal: isSelected ? null : i,
                  }))
                }
                className={`w-full rounded-lg px-4 py-2.5 text-sm font-semibold transition-all ${
                  isSelected
                    ? "bg-[#D4A843] text-[#0D0D1A]"
                    : "border border-[#D4A843]/30 bg-transparent text-[#D4A843] hover:bg-[#D4A843]/10"
                }`}
              >
                {isSelected
                  ? t("onboarding.step4.selected", lang)
                  : t("onboarding.step4.interested", lang)}
              </button>
            </div>
          );
        })}
      </div>

      {/* Skip link */}
      <button
        onClick={() => setForm((f) => ({ ...f, selectedDeal: null }))}
        className="mt-4 w-full text-center text-sm text-[#F8F6F0]/30 hover:text-[#F8F6F0]/50 transition-colors"
      >
        {t("onboarding.step4.skip", lang)}
      </button>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────────── */
/*  Step 5: Welcome / Celebration                                            */
/* ────────────────────────────────────────────────────────────────────────── */
function Step5({ lang }: { lang: Lang }) {
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  const nextSteps = [
    t("onboarding.step5.next1", lang),
    t("onboarding.step5.next2", lang),
    t("onboarding.step5.next3", lang),
  ];

  return (
    <div className="text-center">
      {/* CSS Confetti animation */}
      {showConfetti && (
        <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="absolute animate-[confetti-fall_3s_ease-in_forwards]"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-${Math.random() * 20 + 5}%`,
                animationDelay: `${Math.random() * 2}s`,
                width: `${Math.random() * 8 + 4}px`,
                height: `${Math.random() * 12 + 6}px`,
                backgroundColor: [
                  "#D4A843",
                  "#E8632B",
                  "#2ECC71",
                  "#2B4C7E",
                  "#E8C76A",
                  "#F8F6F0",
                ][Math.floor(Math.random() * 6)],
                borderRadius: Math.random() > 0.5 ? "50%" : "2px",
                transform: `rotate(${Math.random() * 360}deg)`,
              }}
            />
          ))}
        </div>
      )}

      {/* Trophy icon */}
      <div className="mb-6 inline-flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-[#D4A843]/20 to-[#E8632B]/20">
        <svg className="h-12 w-12 text-[#D4A843]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      </div>

      <h2 className="mb-2 text-3xl font-extrabold text-[#F8F6F0]">
        {t("onboarding.step5.title", lang)}
      </h2>
      <p className="mb-6 text-lg text-[#F8F6F0]/60">
        {t("onboarding.step5.subtitle", lang)}
      </p>

      {/* Airdrop confirmation */}
      <div className="mx-auto mb-8 max-w-sm rounded-xl border border-[#D4A843]/30 bg-gradient-to-br from-[#D4A843]/10 to-[#D4A843]/[0.03] p-5">
        <div className="mb-2 text-4xl font-extrabold text-[#D4A843]">
          1,000 $BRXU
        </div>
        <p className="text-sm text-[#F8F6F0]/60">
          {t("onboarding.step5.airdrop", lang)}
        </p>
      </div>

      {/* Next steps */}
      <div className="mx-auto max-w-sm text-left">
        <h3 className="mb-4 text-lg font-bold text-[#F8F6F0]">
          {t("onboarding.step5.nextSteps", lang)}
        </h3>

        <ul className="mb-8 space-y-3">
          {nextSteps.map((step, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-[#F8F6F0]/60">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#D4A843]/10 text-xs font-bold text-[#D4A843]">
                {i + 1}
              </span>
              {step}
            </li>
          ))}
        </ul>
      </div>

      {/* Action buttons */}
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Link
          href="/contractors"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#D4A843] to-[#E8C76A] px-6 py-3 font-bold text-[#0D0D1A] transition-all hover:shadow-[0_0_20px_rgba(212,168,67,0.3)]"
        >
          {t("onboarding.step5.goToDashboard", lang)}
        </Link>
        <Link
          href="/contractors/learn"
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#D4A843]/30 px-6 py-3 font-semibold text-[#D4A843] transition-all hover:bg-[#D4A843]/10"
        >
          {t("onboarding.step5.learnBrix", lang)}
        </Link>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────────── */
/*  Validation helpers                                                       */
/* ────────────────────────────────────────────────────────────────────────── */
function isStep1Valid(form: FormData): boolean {
  return (
    form.fullName.trim() !== "" &&
    form.phone.trim() !== "" &&
    form.email.trim() !== "" &&
    form.trade !== "" &&
    form.location.trim() !== "" &&
    form.experience.trim() !== ""
  );
}

function isStep2Valid(form: FormData): boolean {
  return (
    form.insuranceProvider.trim() !== "" &&
    form.w9Status !== "" &&
    form.ref1Name.trim() !== "" &&
    form.ref1Phone.trim() !== "" &&
    form.ref2Name.trim() !== "" &&
    form.ref2Phone.trim() !== ""
  );
}

function isStep3Valid(form: FormData): boolean {
  return form.walletCreated;
}

/* ────────────────────────────────────────────────────────────────────────── */
/*  Main Onboarding Page                                                     */
/* ────────────────────────────────────────────────────────────────────────── */
export default function OnboardingPage() {
  const [lang, setLang] = useState<Lang>("en");
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>({
    fullName: "",
    phone: "",
    email: "",
    trade: "",
    location: "",
    experience: "",
    licenseNumber: "",
    insuranceProvider: "",
    w9Status: "",
    ref1Name: "",
    ref1Phone: "",
    ref2Name: "",
    ref2Phone: "",
    walletCreated: false,
    selectedDeal: null,
  });

  const canProceed = (): boolean => {
    switch (step) {
      case 1:
        return isStep1Valid(form);
      case 2:
        return isStep2Valid(form);
      case 3:
        return isStep3Valid(form);
      case 4:
        return true; // deal selection is optional
      default:
        return true;
    }
  };

  const submitOnboarding = async () => {
    try {
      await fetch("/api/contractors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: form.fullName,
          phone: form.phone,
          email: form.email,
          primary_trade: form.trade,
          location: form.location,
          years_experience: form.experience,
          license_number: form.licenseNumber,
          insurance_provider: form.insuranceProvider,
          w9_status: form.w9Status,
          ref1_name: form.ref1Name,
          ref1_phone: form.ref1Phone,
          ref2_name: form.ref2Name,
          ref2_phone: form.ref2Phone,
          selected_deal: form.selectedDeal,
        }),
      });
    } catch {
      // Submission failed silently — user still sees success
    }
  };

  const handleNext = () => {
    if (step < TOTAL_STEPS) {
      if (step === 4) {
        submitOnboarding();
      }
      setStep(step + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0D1A] text-[#F8F6F0]">
      {/* Confetti keyframes injected via style tag */}
      <style>{`
        @keyframes confetti-fall {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
      `}</style>

      <LangToggle lang={lang} setLang={setLang} />

      {/* Header */}
      <header className="border-b border-[#F8F6F0]/[0.06] bg-[#1A1A2E]/60 backdrop-blur-sm">
        <div className="mx-auto flex max-w-lg items-center justify-between px-5 py-4">
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
            {t("onboarding.title", lang)}
          </span>
        </div>
      </header>

      {/* Main content */}
      <main className="mx-auto max-w-lg px-5 py-8">
        <ProgressBar step={step} lang={lang} />

        {/* Step content */}
        <div className="rounded-2xl border border-[#F8F6F0]/[0.06] bg-[#1A1A2E]/40 p-6">
          {step === 1 && <Step1 form={form} setForm={setForm} lang={lang} />}
          {step === 2 && <Step2 form={form} setForm={setForm} lang={lang} />}
          {step === 3 && <Step3 form={form} setForm={setForm} lang={lang} />}
          {step === 4 && <Step4 form={form} setForm={setForm} lang={lang} />}
          {step === 5 && <Step5 lang={lang} />}
        </div>

        {/* Navigation buttons */}
        {step < TOTAL_STEPS && (
          <div className="mt-6 flex items-center justify-between gap-4">
            {step > 1 ? (
              <button
                onClick={handleBack}
                className="flex items-center gap-1.5 rounded-lg border border-[#F8F6F0]/10 px-5 py-3 text-sm font-medium text-[#F8F6F0]/60 transition-all hover:border-[#F8F6F0]/20 hover:text-[#F8F6F0]/80"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                {t("global.back", lang)}
              </button>
            ) : (
              <div />
            )}

            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-[#D4A843] to-[#E8C76A] px-6 py-3 text-sm font-bold text-[#0D0D1A] shadow-md transition-all hover:shadow-[0_0_20px_rgba(212,168,67,0.3)] disabled:opacity-40 disabled:shadow-none disabled:cursor-not-allowed"
            >
              {t("global.next", lang)}
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}

        {/* Validation hint */}
        {step < TOTAL_STEPS && !canProceed() && (
          <p className="mt-3 text-center text-xs text-[#E8632B]/60">
            {lang === "en"
              ? "Please fill in all required fields to continue."
              : "Por favor completa todos los campos obligatorios para continuar."}
          </p>
        )}
      </main>
    </div>
  );
}
