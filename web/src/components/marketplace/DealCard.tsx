"use client";

import Link from "next/link";
import { useState } from "react";

interface Deal {
  id: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  county: string;
  type: string;
  capitalNeeded: number;
  arv: number;
  askingPrice: number;
  funded: number;
  roi: number;
  timeline: string;
  beds: number;
  baths: number;
  sqft: number;
  status: string;
  imageUrl?: string;
  listedDate: string;
}

interface DealCardProps {
  deal: Deal;
  isSelected?: boolean;
  onHover?: (dealId: string | null) => void;
}

const TYPE_COLORS: Record<string, { bg: string; text: string }> = {
  Flip: { bg: "#E8632B", text: "#FFFFFF" },
  "New Build": { bg: "#2B4C7E", text: "#FFFFFF" },
  "Value-Add": { bg: "#2ECC71", text: "#0D0D1A" },
  Wholesale: { bg: "#D4A843", text: "#0D0D1A" },
  Land: { bg: "#8B5CF6", text: "#FFFFFF" },
};

function isNewlyListed(dateStr: string) {
  const listed = new Date(dateStr);
  const now = new Date();
  const daysDiff = (now.getTime() - listed.getTime()) / (1000 * 60 * 60 * 24);
  return daysDiff <= 7;
}

export default function DealCard({ deal, isSelected, onHover }: DealCardProps) {
  const [liked, setLiked] = useState(false);
  const badge = TYPE_COLORS[deal.type] || { bg: "#D4A843", text: "#0D0D1A" };
  const isNew = isNewlyListed(deal.listedDate);

  return (
    <Link
      href={`/marketplace/${deal.id}`}
      className="group block overflow-hidden rounded-xl border transition-all duration-200"
      style={{
        backgroundColor: "#1A1A2E",
        borderColor: isSelected ? "#D4A843" : "rgba(255,255,255,0.08)",
        boxShadow: isSelected ? "0 0 0 1px #D4A843" : "none",
      }}
      onMouseEnter={() => onHover?.(deal.id)}
      onMouseLeave={() => onHover?.(null)}
    >
      {/* Property Image */}
      <div className="relative h-44 overflow-hidden">
        {deal.imageUrl ? (
          <img
            src={deal.imageUrl}
            alt={deal.address}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div
            className="flex h-full w-full items-center justify-center"
            style={{
              background: `linear-gradient(135deg, ${badge.bg}33 0%, #1A1A2E 100%)`,
            }}
          >
            <svg className="w-16 h-16 text-white/10" fill="currentColor" viewBox="0 0 24 24">
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
            </svg>
          </div>
        )}

        {/* Top badges row */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-start justify-between">
          <div className="flex flex-wrap items-center gap-1.5">
            {/* Status badge */}
            <span
              className="rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider"
              style={{ backgroundColor: "#0D0D1Acc", color: "#F8F6F0", backdropFilter: "blur(4px)" }}
            >
              {deal.status === "Open" ? "For Sale" : deal.status}
            </span>
            {/* New listing tag */}
            {isNew && (
              <span
                className="rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider"
                style={{ backgroundColor: "#2ECC71", color: "#0D0D1A" }}
              >
                Just Listed
              </span>
            )}
          </div>
          {/* Favorite button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setLiked(!liked);
            }}
            className="flex h-8 w-8 items-center justify-center rounded-full transition-colors"
            style={{ backgroundColor: "#0D0D1Acc", backdropFilter: "blur(4px)" }}
          >
            <svg
              className="h-4 w-4"
              fill={liked ? "#E8632B" : "none"}
              stroke={liked ? "#E8632B" : "#F8F6F0"}
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </button>
        </div>

        {/* ROI badge bottom-left */}
        <div className="absolute bottom-2.5 left-2.5">
          <span
            className="rounded-md px-2 py-0.5 text-xs font-bold"
            style={{ backgroundColor: "#2ECC71dd", color: "#FFFFFF" }}
          >
            {deal.roi}% ROI
          </span>
        </div>

        {/* Type badge bottom-right */}
        <div className="absolute bottom-2.5 right-2.5">
          <span
            className="rounded-md px-2 py-0.5 text-xs font-semibold"
            style={{ backgroundColor: badge.bg, color: badge.text }}
          >
            {deal.type}
          </span>
        </div>

        {/* Funding progress bar at bottom of image */}
        <div className="absolute bottom-0 left-0 right-0 h-1" style={{ backgroundColor: "#0D0D1A66" }}>
          <div
            className="h-full transition-all"
            style={{ width: `${deal.funded}%`, backgroundColor: "#D4A843" }}
          />
        </div>
      </div>

      {/* Card Body */}
      <div className="p-3.5 space-y-2.5">
        {/* Price row */}
        <div className="flex items-baseline justify-between">
          <span className="text-lg font-bold text-white">
            ${deal.askingPrice.toLocaleString()}
          </span>
          <span className="text-xs" style={{ color: "#4A4A5A" }}>
            ARV: ${deal.arv.toLocaleString()}
          </span>
        </div>

        {/* Location */}
        <div>
          <p className="text-sm font-medium text-white/90 truncate">{deal.address}</p>
          <p className="text-xs truncate" style={{ color: "#4A4A5A" }}>
            {deal.county} County &middot; {deal.city}, {deal.state} {deal.zip}
          </p>
        </div>

        {/* Specs row */}
        <div className="flex items-center gap-3 pt-1 border-t border-white/5">
          <div className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5" style={{ color: "#4A4A5A" }} fill="currentColor" viewBox="0 0 24 24">
              <path d="M7 13c1.66 0 3-1.34 3-3S8.66 7 7 7s-3 1.34-3 3 1.34 3 3 3zm12-6h-8v7H3V7H1v10h2v-3h18v3h2V11c0-2.21-1.79-4-4-4z" />
            </svg>
            <span className="text-xs font-medium text-white/80">{deal.beds} bd</span>
          </div>
          <div className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5" style={{ color: "#4A4A5A" }} fill="currentColor" viewBox="0 0 24 24">
              <path d="M7 7c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zM3 17v2h4v-2c0-1.1-.9-2-2-2s-2 .9-2 2zm14-6c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm4 6v2h-4v-2c0-1.1.9-2 2-2s2 .9 2 2z" />
            </svg>
            <span className="text-xs font-medium text-white/80">{deal.baths} ba</span>
          </div>
          <div className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5" style={{ color: "#4A4A5A" }} fill="currentColor" viewBox="0 0 24 24">
              <path d="M17 11V3H7v4H3v14h8v-4h2v4h8V11h-4zM7 19H5v-2h2v2zm0-4H5v-2h2v2zm0-4H5V9h2v2zm4 4H9v-2h2v2zm0-4H9V9h2v2zm0-4H9V5h2v2zm4 8h-2v-2h2v2zm0-4h-2V9h2v2zm0-4h-2V5h2v2zm4 12h-2v-2h2v2zm0-4h-2v-2h2v2z" />
            </svg>
            <span className="text-xs font-medium text-white/80">{deal.sqft.toLocaleString()} sqft</span>
          </div>
          <div className="ml-auto flex items-center gap-1">
            <svg className="w-3.5 h-3.5" style={{ color: "#4A4A5A" }} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-xs" style={{ color: "#4A4A5A" }}>{deal.timeline}</span>
          </div>
        </div>

        {/* Funding bar */}
        <div className="flex items-center gap-2.5">
          <div className="flex-1 h-1.5 rounded-full" style={{ backgroundColor: "#0D0D1A" }}>
            <div
              className="h-full rounded-full"
              style={{ width: `${deal.funded}%`, backgroundColor: "#D4A843" }}
            />
          </div>
          <span className="text-xs font-semibold" style={{ color: "#D4A843" }}>
            {deal.funded}%
          </span>
        </div>
      </div>
    </Link>
  );
}
