"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import DealCard from "@/components/marketplace/DealCard";

// Dynamically import MapView (Leaflet needs window)
const MapView = dynamic(() => import("@/components/marketplace/MapView"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center" style={{ backgroundColor: "#0D0D1A" }}>
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-[#D4A843]" />
        <span className="text-sm" style={{ color: "#4A4A5A" }}>Loading map...</span>
      </div>
    </div>
  ),
});

/* ─── Sample deal data with geolocation ─── */
const deals = [
  {
    id: "deal-001",
    address: "1847 Oakwood Dr",
    city: "Charlotte",
    state: "NC",
    zip: "28205",
    county: "Mecklenburg",
    type: "Flip",
    capitalNeeded: 285000,
    askingPrice: 195000,
    arv: 360000,
    funded: 67,
    roi: 22,
    timeline: "6 mo",
    beds: 3,
    baths: 2,
    sqft: 1850,
    status: "Open",
    listedDate: "2026-02-10",
    lat: 35.2271,
    lng: -80.8131,
    imageUrl: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600&h=400&fit=crop",
  },
  {
    id: "deal-002",
    address: "412 Magnolia Ln",
    city: "Raleigh",
    state: "NC",
    zip: "27601",
    county: "Wake",
    type: "New Build",
    capitalNeeded: 520000,
    askingPrice: 120000,
    arv: 680000,
    funded: 43,
    roi: 28,
    timeline: "12 mo",
    beds: 4,
    baths: 3,
    sqft: 2800,
    status: "Open",
    listedDate: "2026-02-08",
    lat: 35.7796,
    lng: -78.6382,
    imageUrl: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=400&fit=crop",
  },
  {
    id: "deal-003",
    address: "903 Pine Valley Rd",
    city: "Greenville",
    state: "SC",
    zip: "29601",
    county: "Greenville",
    type: "Value-Add",
    capitalNeeded: 175000,
    askingPrice: 135000,
    arv: 245000,
    funded: 89,
    roi: 16,
    timeline: "4 mo",
    beds: 2,
    baths: 1,
    sqft: 1200,
    status: "Funding",
    listedDate: "2026-01-28",
    lat: 34.8526,
    lng: -82.3940,
    imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&h=400&fit=crop",
  },
  {
    id: "deal-004",
    address: "2215 Bayshore Blvd",
    city: "Tampa",
    state: "FL",
    zip: "33611",
    county: "Hillsborough",
    type: "Flip",
    capitalNeeded: 340000,
    askingPrice: 245000,
    arv: 475000,
    funded: 52,
    roi: 25,
    timeline: "8 mo",
    beds: 4,
    baths: 2,
    sqft: 2100,
    status: "Open",
    listedDate: "2026-02-12",
    lat: 27.9506,
    lng: -82.4572,
    imageUrl: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=600&h=400&fit=crop",
  },
  {
    id: "deal-005",
    address: "567 Elm Creek Way",
    city: "Charlotte",
    state: "NC",
    zip: "28202",
    county: "Mecklenburg",
    type: "New Build",
    capitalNeeded: 450000,
    askingPrice: 95000,
    arv: 620000,
    funded: 31,
    roi: 30,
    timeline: "14 mo",
    beds: 5,
    baths: 4,
    sqft: 3200,
    status: "Open",
    listedDate: "2026-02-14",
    lat: 35.2401,
    lng: -80.8540,
    imageUrl: "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=600&h=400&fit=crop",
  },
  {
    id: "deal-006",
    address: "1100 Riverside Ave",
    city: "Raleigh",
    state: "NC",
    zip: "27603",
    county: "Wake",
    type: "Value-Add",
    capitalNeeded: 210000,
    askingPrice: 165000,
    arv: 310000,
    funded: 75,
    roi: 19,
    timeline: "5 mo",
    beds: 3,
    baths: 2,
    sqft: 1650,
    status: "Funding",
    listedDate: "2026-02-01",
    lat: 35.7596,
    lng: -78.6480,
    imageUrl: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&h=400&fit=crop",
  },
  {
    id: "deal-007",
    address: "824 Palmetto St",
    city: "Charleston",
    state: "SC",
    zip: "29401",
    county: "Charleston",
    type: "Flip",
    capitalNeeded: 310000,
    askingPrice: 210000,
    arv: 420000,
    funded: 58,
    roi: 24,
    timeline: "7 mo",
    beds: 3,
    baths: 2,
    sqft: 1780,
    status: "Open",
    listedDate: "2026-02-11",
    lat: 32.7765,
    lng: -79.9311,
    imageUrl: "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=600&h=400&fit=crop",
  },
  {
    id: "deal-008",
    address: "3301 Peachtree Rd",
    city: "Atlanta",
    state: "GA",
    zip: "30326",
    county: "Fulton",
    type: "New Build",
    capitalNeeded: 680000,
    askingPrice: 180000,
    arv: 920000,
    funded: 22,
    roi: 32,
    timeline: "16 mo",
    beds: 5,
    baths: 4,
    sqft: 3800,
    status: "Open",
    listedDate: "2026-02-13",
    lat: 33.8444,
    lng: -84.3627,
    imageUrl: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&h=400&fit=crop",
  },
  {
    id: "deal-009",
    address: "156 Ocean Blvd",
    city: "Jacksonville",
    state: "FL",
    zip: "32250",
    county: "Duval",
    type: "Value-Add",
    capitalNeeded: 245000,
    askingPrice: 189000,
    arv: 340000,
    funded: 61,
    roi: 18,
    timeline: "5 mo",
    beds: 3,
    baths: 2,
    sqft: 1500,
    status: "Open",
    listedDate: "2026-02-07",
    lat: 30.2866,
    lng: -81.3960,
    imageUrl: "https://images.unsplash.com/photo-1600566753086-00f18f6b6637?w=600&h=400&fit=crop",
  },
  {
    id: "deal-010",
    address: "2900 Lake Norman Dr",
    city: "Mooresville",
    state: "NC",
    zip: "28117",
    county: "Iredell",
    type: "Wholesale",
    capitalNeeded: 155000,
    askingPrice: 125000,
    arv: 220000,
    funded: 94,
    roi: 15,
    timeline: "3 mo",
    beds: 2,
    baths: 1,
    sqft: 1100,
    status: "Funding",
    listedDate: "2026-01-20",
    lat: 35.5849,
    lng: -80.8101,
    imageUrl: "https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?w=600&h=400&fit=crop",
  },
];

type SortOption = "newest" | "roi" | "funded" | "price-low" | "price-high";
type ViewMode = "split" | "map" | "grid";

export default function MarketplacePage() {
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");

  // Read initial search query from URL
  useEffect(() => {
    const q = searchParams.get("q");
    if (q) setSearchQuery(q);
  }, [searchParams]);
  const [propertyType, setPropertyType] = useState("All");
  const [priceRange, setPriceRange] = useState("All");
  const [bedsFilter, setBedsFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [viewMode, setViewMode] = useState<ViewMode>("split");
  const [selectedDealId, setSelectedDealId] = useState<string | null>(null);
  const [hoveredDealId, setHoveredDealId] = useState<string | null>(null);

  const filteredDeals = useMemo(() => {
    let result = [...deals];

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (d) =>
          d.address.toLowerCase().includes(q) ||
          d.city.toLowerCase().includes(q) ||
          d.state.toLowerCase().includes(q) ||
          d.zip.includes(q) ||
          d.county.toLowerCase().includes(q)
      );
    }

    // Property type
    if (propertyType !== "All") {
      result = result.filter((d) => d.type === propertyType);
    }

    // Price range
    if (priceRange !== "All") {
      const ranges: Record<string, [number, number]> = {
        "Under $200K": [0, 200000],
        "$200K - $400K": [200000, 400000],
        "$400K - $600K": [400000, 600000],
        "$600K+": [600000, Infinity],
      };
      const [min, max] = ranges[priceRange] || [0, Infinity];
      result = result.filter((d) => d.capitalNeeded >= min && d.capitalNeeded < max);
    }

    // Beds
    if (bedsFilter !== "All") {
      const minBeds = parseInt(bedsFilter);
      result = result.filter((d) => d.beds >= minBeds);
    }

    // Status
    if (statusFilter !== "All") {
      result = result.filter((d) => d.status === statusFilter);
    }

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case "roi":
          return b.roi - a.roi;
        case "funded":
          return b.funded - a.funded;
        case "price-low":
          return a.capitalNeeded - b.capitalNeeded;
        case "price-high":
          return b.capitalNeeded - a.capitalNeeded;
        default:
          return new Date(b.listedDate).getTime() - new Date(a.listedDate).getTime();
      }
    });

    return result;
  }, [searchQuery, propertyType, priceRange, bedsFilter, statusFilter, sortBy]);

  const activeDealId = selectedDealId || hoveredDealId;

  const handleDealSelect = useCallback((dealId: string) => {
    setSelectedDealId(dealId);
    const el = document.getElementById(`deal-card-${dealId}`);
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, []);

  const activeFilterCount = [propertyType, priceRange, bedsFilter, statusFilter].filter(
    (f) => f !== "All"
  ).length;

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col overflow-hidden">
      {/* ── Top Filter Bar ── */}
      <div
        className="flex-shrink-0 border-b border-white/10 px-4 py-3"
        style={{ backgroundColor: "#1A1A2E" }}
      >
        {/* Row 1: Search + View Toggle */}
        <div className="flex items-center gap-3 mb-3">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
              style={{ color: "#4A4A5A" }}
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="State, County, City or Zip"
              className="w-full rounded-lg border border-white/10 py-2 pl-10 pr-4 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-[#D4A843]"
              style={{ backgroundColor: "#0D0D1A" }}
            />
          </div>

          {/* Deal count */}
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-sm font-semibold text-white">{filteredDeals.length}</span>
            <span className="text-xs" style={{ color: "#4A4A5A" }}>
              deals found
            </span>
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="rounded-lg border border-white/10 px-3 py-2 text-xs text-white focus:outline-none"
            style={{ backgroundColor: "#0D0D1A" }}
          >
            <option value="newest">Newest First</option>
            <option value="roi">Highest ROI</option>
            <option value="funded">Most Funded</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>

          {/* View toggle */}
          <div className="flex rounded-lg overflow-hidden border border-white/10">
            {(
              [
                { mode: "split" as const, icon: "columns" },
                { mode: "map" as const, icon: "map" },
                { mode: "grid" as const, icon: "grid" },
              ] as const
            ).map(({ mode, icon }) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className="flex h-9 w-9 items-center justify-center transition-colors"
                style={{
                  backgroundColor: viewMode === mode ? "#D4A843" : "#0D0D1A",
                  color: viewMode === mode ? "#0D0D1A" : "#4A4A5A",
                }}
                title={mode.charAt(0).toUpperCase() + mode.slice(1) + " view"}
              >
                {icon === "columns" && (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M10 18h5V5h-5v13zm-6 0h5V5H4v13zM16 5v13h5V5h-5z" />
                  </svg>
                )}
                {icon === "map" && (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.5 3l-.16.03L15 5.1 9 3 3.36 4.9c-.21.07-.36.25-.36.48V20.5c0 .28.22.5.5.5l.16-.03L9 18.9l6 2.1 5.64-1.9c.21-.07.36-.25.36-.48V3.5c0-.28-.22-.5-.5-.5zM15 19l-6-2.11V5l6 2.11V19z" />
                  </svg>
                )}
                {icon === "grid" && (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 3v8h8V3H3zm6 6H5V5h4v4zm-6 4v8h8v-8H3zm6 6H5v-4h4v4zm4-16v8h8V3h-8zm6 6h-4V5h4v4zm-6 4v8h8v-8h-8zm6 6h-4v-4h4v4z" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Row 2: Filter chips — horizontally scrollable on mobile */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 -mb-1 scrollbar-hide">
          {/* Property Type */}
          <select
            value={propertyType}
            onChange={(e) => setPropertyType(e.target.value)}
            className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-white focus:outline-none"
            style={{
              backgroundColor: propertyType !== "All" ? "#D4A84320" : "#0D0D1A",
              borderColor: propertyType !== "All" ? "#D4A843" : "rgba(255,255,255,0.1)",
            }}
          >
            <option value="All">Home Type</option>
            <option value="Flip">Flip</option>
            <option value="New Build">New Build</option>
            <option value="Value-Add">Value-Add</option>
            <option value="Wholesale">Wholesale</option>
            <option value="Land">Land</option>
          </select>

          {/* Price Range */}
          <select
            value={priceRange}
            onChange={(e) => setPriceRange(e.target.value)}
            className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-white focus:outline-none"
            style={{
              backgroundColor: priceRange !== "All" ? "#D4A84320" : "#0D0D1A",
              borderColor: priceRange !== "All" ? "#D4A843" : "rgba(255,255,255,0.1)",
            }}
          >
            <option value="All">Price</option>
            <option value="Under $200K">Under $200K</option>
            <option value="$200K - $400K">$200K - $400K</option>
            <option value="$400K - $600K">$400K - $600K</option>
            <option value="$600K+">$600K+</option>
          </select>

          {/* Beds */}
          <select
            value={bedsFilter}
            onChange={(e) => setBedsFilter(e.target.value)}
            className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-white focus:outline-none"
            style={{
              backgroundColor: bedsFilter !== "All" ? "#D4A84320" : "#0D0D1A",
              borderColor: bedsFilter !== "All" ? "#D4A843" : "rgba(255,255,255,0.1)",
            }}
          >
            <option value="All">Beds / Baths</option>
            <option value="2">2+ Beds</option>
            <option value="3">3+ Beds</option>
            <option value="4">4+ Beds</option>
            <option value="5">5+ Beds</option>
          </select>

          {/* Status */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-white focus:outline-none"
            style={{
              backgroundColor: statusFilter !== "All" ? "#D4A84320" : "#0D0D1A",
              borderColor: statusFilter !== "All" ? "#D4A843" : "rgba(255,255,255,0.1)",
            }}
          >
            <option value="All">Available</option>
            <option value="Open">Open</option>
            <option value="Funding">Funding</option>
            <option value="Funded">Funded</option>
          </select>

          {/* Clear filters */}
          {activeFilterCount > 0 && (
            <button
              onClick={() => {
                setPropertyType("All");
                setPriceRange("All");
                setBedsFilter("All");
                setStatusFilter("All");
                setSearchQuery("");
              }}
              className="flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium transition-colors hover:bg-red-500/20"
              style={{ color: "#E8632B", borderColor: "#E8632B30", border: "1px solid" }}
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
              Clear {activeFilterCount}
            </button>
          )}
        </div>
      </div>

      {/* ── Main Content Area ── */}
      <div className="flex flex-1 flex-col lg:flex-row overflow-hidden">
        {/* Map Panel — hidden on mobile in split mode, show only in map mode */}
        {(viewMode === "split" || viewMode === "map") && (
          <div
            className={`relative flex-shrink-0 ${viewMode === "map" ? "w-full h-full" : "hidden lg:block lg:w-1/2 h-full"}`}
            style={{ backgroundColor: "#0D0D1A" }}
          >
            <MapView
              deals={filteredDeals}
              onDealSelect={handleDealSelect}
              selectedDealId={activeDealId}
            />
            {/* Deal count overlay on map-only mode */}
            {viewMode === "map" && (
              <div
                className="absolute top-4 left-4 z-[1000] rounded-lg border border-white/10 px-3 py-2"
                style={{ backgroundColor: "#1A1A2Eee" }}
              >
                <span className="text-sm font-semibold text-white">{filteredDeals.length}</span>
                <span className="text-xs ml-1.5" style={{ color: "#4A4A5A" }}>
                  deals
                </span>
              </div>
            )}
          </div>
        )}

        {/* Cards Panel — full width on mobile in split mode */}
        {(viewMode === "split" || viewMode === "grid") && (
          <div
            className={`${viewMode === "grid" ? "w-full" : "w-full lg:w-1/2"} overflow-y-auto`}
            style={{ backgroundColor: "#0D0D1A" }}
          >
            <div
              className={`grid gap-4 p-4 ${
                viewMode === "grid"
                  ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                  : "grid-cols-1 xl:grid-cols-2"
              }`}
            >
              {filteredDeals.map((deal) => (
                <div key={deal.id} id={`deal-card-${deal.id}`}>
                  <DealCard
                    deal={deal}
                    isSelected={activeDealId === deal.id}
                    onHover={setHoveredDealId}
                  />
                </div>
              ))}
            </div>

            {filteredDeals.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20">
                <svg className="w-16 h-16 mb-4" style={{ color: "#4A4A5A" }} fill="none" stroke="currentColor" strokeWidth={1} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <p className="text-lg font-semibold text-white mb-1">No deals found</p>
                <p className="text-sm" style={{ color: "#4A4A5A" }}>
                  Try adjusting your filters or search query
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
