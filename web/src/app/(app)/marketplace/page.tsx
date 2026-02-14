"use client";

import { useState } from "react";
import Link from "next/link";

const deals = [
  {
    id: "deal-001",
    address: "1847 Oakwood Dr",
    city: "Charlotte",
    state: "NC",
    type: "Flip",
    capitalNeeded: 285000,
    funded: 67,
    roi: 22,
    timeline: "6 months",
    gradient: "from-[#2B4C7E] to-[#1A1A2E]",
  },
  {
    id: "deal-002",
    address: "412 Magnolia Ln",
    city: "Raleigh",
    state: "NC",
    type: "New Build",
    capitalNeeded: 520000,
    funded: 43,
    roi: 28,
    timeline: "12 months",
    gradient: "from-[#D4A843] to-[#E8632B]",
  },
  {
    id: "deal-003",
    address: "903 Pine Valley Rd",
    city: "Greenville",
    state: "SC",
    type: "Value-Add",
    capitalNeeded: 175000,
    funded: 89,
    roi: 16,
    timeline: "4 months",
    gradient: "from-[#2ECC71] to-[#2B4C7E]",
  },
  {
    id: "deal-004",
    address: "2215 Bayshore Blvd",
    city: "Tampa",
    state: "FL",
    type: "Flip",
    capitalNeeded: 340000,
    funded: 52,
    roi: 25,
    timeline: "8 months",
    gradient: "from-[#E8632B] to-[#D4A843]",
  },
  {
    id: "deal-005",
    address: "567 Elm Creek Way",
    city: "Charlotte",
    state: "NC",
    type: "New Build",
    capitalNeeded: 450000,
    funded: 31,
    roi: 30,
    timeline: "14 months",
    gradient: "from-[#1A1A2E] to-[#2B4C7E]",
  },
  {
    id: "deal-006",
    address: "1100 Riverside Ave",
    city: "Raleigh",
    state: "NC",
    type: "Value-Add",
    capitalNeeded: 210000,
    funded: 75,
    roi: 19,
    timeline: "5 months",
    gradient: "from-[#2B4C7E] to-[#2ECC71]",
  },
];

const typeBadgeColors: Record<string, { bg: string; text: string }> = {
  Flip: { bg: "#E8632B", text: "#FFFFFF" },
  "New Build": { bg: "#2B4C7E", text: "#FFFFFF" },
  "Value-Add": { bg: "#2ECC71", text: "#0D0D1A" },
};

export default function MarketplacePage() {
  const [location, setLocation] = useState("All");
  const [propertyType, setPropertyType] = useState("All");
  const [sortBy, setSortBy] = useState("newest");

  const filteredDeals = deals.filter((deal) => {
    if (location !== "All" && `${deal.city}, ${deal.state}` !== location) return false;
    if (propertyType !== "All" && deal.type !== propertyType) return false;
    return true;
  });

  const sortedDeals = [...filteredDeals].sort((a, b) => {
    if (sortBy === "roi") return b.roi - a.roi;
    if (sortBy === "funded") return b.funded - a.funded;
    if (sortBy === "capital-low") return a.capitalNeeded - b.capitalNeeded;
    if (sortBy === "capital-high") return b.capitalNeeded - a.capitalNeeded;
    return 0;
  });

  return (
    <div>
      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Deal Marketplace</h1>
        <p className="mt-1 text-sm" style={{ color: "#4A4A5A" }}>
          Browse verified real estate investment opportunities
        </p>
      </div>

      {/* Filter bar */}
      <div
        className="mb-6 flex flex-wrap items-center gap-3 rounded-xl border border-white/10 p-4"
        style={{ backgroundColor: "#1A1A2E" }}
      >
        {/* Location */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium" style={{ color: "#4A4A5A" }}>
            Location
          </label>
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="rounded-lg border border-white/10 px-3 py-2 text-sm text-white focus:outline-none focus:ring-1"
            style={{ backgroundColor: "#0D0D1A", borderColor: "rgba(255,255,255,0.1)" }}
          >
            <option value="All">All Locations</option>
            <option value="Charlotte, NC">Charlotte, NC</option>
            <option value="Raleigh, NC">Raleigh, NC</option>
            <option value="Greenville, SC">Greenville, SC</option>
            <option value="Tampa, FL">Tampa, FL</option>
          </select>
        </div>

        {/* Property Type */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium" style={{ color: "#4A4A5A" }}>
            Property Type
          </label>
          <select
            value={propertyType}
            onChange={(e) => setPropertyType(e.target.value)}
            className="rounded-lg border border-white/10 px-3 py-2 text-sm text-white focus:outline-none focus:ring-1"
            style={{ backgroundColor: "#0D0D1A", borderColor: "rgba(255,255,255,0.1)" }}
          >
            <option value="All">All Types</option>
            <option value="Flip">Flip</option>
            <option value="New Build">New Build</option>
            <option value="Value-Add">Value-Add</option>
          </select>
        </div>

        {/* Min Investment */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium" style={{ color: "#4A4A5A" }}>
            Min Investment
          </label>
          <input
            type="text"
            placeholder="$0"
            className="w-28 rounded-lg border border-white/10 px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-1"
            style={{ backgroundColor: "#0D0D1A", borderColor: "rgba(255,255,255,0.1)" }}
          />
        </div>

        {/* Max Investment */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium" style={{ color: "#4A4A5A" }}>
            Max Investment
          </label>
          <input
            type="text"
            placeholder="$1,000,000"
            className="w-28 rounded-lg border border-white/10 px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-1"
            style={{ backgroundColor: "#0D0D1A", borderColor: "rgba(255,255,255,0.1)" }}
          />
        </div>

        {/* Sort by */}
        <div className="flex flex-col gap-1 ml-auto">
          <label className="text-xs font-medium" style={{ color: "#4A4A5A" }}>
            Sort By
          </label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="rounded-lg border border-white/10 px-3 py-2 text-sm text-white focus:outline-none focus:ring-1"
            style={{ backgroundColor: "#0D0D1A", borderColor: "rgba(255,255,255,0.1)" }}
          >
            <option value="newest">Newest First</option>
            <option value="roi">Highest ROI</option>
            <option value="funded">Most Funded</option>
            <option value="capital-low">Capital: Low to High</option>
            <option value="capital-high">Capital: High to Low</option>
          </select>
        </div>
      </div>

      {/* Deal cards grid */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {sortedDeals.map((deal) => {
          const badge = typeBadgeColors[deal.type];
          return (
            <div
              key={deal.id}
              className="overflow-hidden rounded-xl border border-white/10 transition-transform hover:scale-[1.02]"
              style={{ backgroundColor: "#1A1A2E" }}
            >
              {/* Property photo placeholder */}
              <div
                className={`relative flex h-44 items-center justify-center bg-gradient-to-br ${deal.gradient}`}
              >
                <svg className="w-16 h-16 text-white/20" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
                </svg>
                {/* Type badge */}
                <span
                  className="absolute top-3 left-3 rounded-full px-3 py-1 text-xs font-semibold"
                  style={{ backgroundColor: badge.bg, color: badge.text }}
                >
                  {deal.type}
                </span>
              </div>

              {/* Card content */}
              <div className="p-4 space-y-3">
                {/* Location */}
                <div>
                  <h3 className="text-base font-semibold text-white">{deal.address}</h3>
                  <p className="text-sm" style={{ color: "#4A4A5A" }}>
                    {deal.city}, {deal.state}
                  </p>
                </div>

                {/* Capital needed */}
                <div className="flex items-center justify-between">
                  <span className="text-xs" style={{ color: "#4A4A5A" }}>
                    Capital Needed
                  </span>
                  <span className="text-sm font-semibold text-white">
                    ${deal.capitalNeeded.toLocaleString()}
                  </span>
                </div>

                {/* Funded progress */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs" style={{ color: "#4A4A5A" }}>
                      Funded
                    </span>
                    <span className="text-xs font-semibold" style={{ color: "#D4A843" }}>
                      {deal.funded}%
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full" style={{ backgroundColor: "#0D0D1A" }}>
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${deal.funded}%`,
                        backgroundColor: "#D4A843",
                      }}
                    />
                  </div>
                </div>

                {/* ROI and Timeline */}
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-1.5">
                    <svg className="w-4 h-4" style={{ color: "#2ECC71" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                    <span className="text-sm font-semibold" style={{ color: "#2ECC71" }}>
                      {deal.roi}% ROI
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <svg className="w-4 h-4" style={{ color: "#4A4A5A" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm" style={{ color: "#4A4A5A" }}>
                      {deal.timeline}
                    </span>
                  </div>
                </div>

                {/* View Deal button */}
                <Link
                  href={`/marketplace/${deal.id}`}
                  className="mt-2 flex w-full items-center justify-center rounded-lg py-2.5 text-sm font-semibold transition-colors hover:opacity-90"
                  style={{ backgroundColor: "#D4A843", color: "#0D0D1A" }}
                >
                  View Deal
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
