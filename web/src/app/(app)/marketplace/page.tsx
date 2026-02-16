"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import DealCard from "@/components/marketplace/DealCard";

// Dynamically import MapView (Leaflet needs window)
const MapView = dynamic(() => import("@/components/marketplace/MapView"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center" style={{ backgroundColor: "var(--brix-bg)" }}>
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-[#D4A843]" />
        <span className="text-sm" style={{ color: "var(--brix-fg-muted)" }}>Loading map...</span>
      </div>
    </div>
  ),
});

/* ─── Approximate geocoding for map markers ─── */
const CITY_COORDS: Record<string, { lat: number; lng: number }> = {
  "charlotte,nc": { lat: 35.2271, lng: -80.8431 },
  "raleigh,nc": { lat: 35.7796, lng: -78.6382 },
  "greenville,sc": { lat: 34.8526, lng: -82.3940 },
  "tampa,fl": { lat: 27.9506, lng: -82.4572 },
  "charleston,sc": { lat: 32.7765, lng: -79.9311 },
  "atlanta,ga": { lat: 33.8444, lng: -84.3627 },
  "jacksonville,fl": { lat: 30.2866, lng: -81.3960 },
  "mooresville,nc": { lat: 35.5849, lng: -80.8101 },
  "durham,nc": { lat: 35.9940, lng: -78.8986 },
  "greensboro,nc": { lat: 36.0726, lng: -79.7920 },
  "columbia,sc": { lat: 34.0007, lng: -81.0348 },
  "miami,fl": { lat: 25.7617, lng: -80.1918 },
  "orlando,fl": { lat: 28.5383, lng: -81.3792 },
  "savannah,ga": { lat: 32.0809, lng: -81.0912 },
};

function getCityCoords(city: string, state: string): { lat: number; lng: number } {
  const key = `${city},${state}`.toLowerCase().replace(/\s+/g, "");
  if (CITY_COORDS[key]) return CITY_COORDS[key];
  // Fallback: slight random offset from Charlotte
  const hash = (city + state).split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  return { lat: 34.5 + (hash % 30) / 10, lng: -81 + (hash % 20) / 10 };
}

/* ─── Normalize API response to frontend deal shape ─── */
interface MarketplaceDeal {
  id: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  county: string;
  type: string;
  capitalNeeded: number;
  askingPrice: number;
  arv: number;
  funded: number;
  roi: number;
  timeline: string;
  beds: number;
  baths: number;
  sqft: number;
  status: string;
  listedDate: string;
  lat: number;
  lng: number;
  imageUrl: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeDeal(raw: any): MarketplaceDeal {
  const totalCapital = raw.totalCapitalNeeded || raw.total_capital_needed || 0;
  const fundedAmount = raw.fundedAmount || raw.funded_amount || 0;
  const fundedPct = totalCapital > 0 ? Math.round((fundedAmount / totalCapital) * 100) : 0;
  const city = raw.city || "";
  const state = raw.state || "";
  const coords = getCityCoords(city, state);
  const photos = raw.photos || [];

  return {
    id: raw.id || "",
    address: raw.address || "",
    city,
    state,
    zip: raw.zip || "",
    county: raw.county || "",
    type: raw.propertyType || raw.property_type || "Flip",
    capitalNeeded: totalCapital,
    askingPrice: raw.askingPrice || raw.asking_price || 0,
    arv: raw.arv || 0,
    funded: fundedPct,
    roi: raw.projectedROI || raw.projected_roi || 0,
    timeline: raw.projectedTimeline || raw.projected_timeline || "",
    beds: raw.beds || 0,
    baths: raw.baths || 0,
    sqft: raw.sqft || 0,
    status: raw.status || "Open",
    listedDate: raw.listedDate || raw.listed_date || new Date().toISOString(),
    lat: coords.lat,
    lng: coords.lng,
    imageUrl: photos[0] || raw.imageUrl || raw.image_url || "",
  };
}

type SortOption = "newest" | "roi" | "funded" | "price-low" | "price-high";
type ViewMode = "split" | "map" | "grid";

export default function MarketplacePage() {
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [deals, setDeals] = useState<MarketplaceDeal[]>([]);
  const [loading, setLoading] = useState(true);

  // Read initial search query from URL
  useEffect(() => {
    const q = searchParams.get("q");
    if (q) setSearchQuery(q);
  }, [searchParams]);

  // Fetch deals from API
  useEffect(() => {
    let cancelled = false;
    async function fetchDeals() {
      try {
        const res = await fetch("/api/deals");
        if (res.ok) {
          const data = await res.json();
          if (!cancelled && Array.isArray(data)) {
            setDeals(data.map(normalizeDeal));
          }
        }
      } catch {
        // API unavailable — deals remain empty
      }
      if (!cancelled) setLoading(false);
    }
    fetchDeals();
    return () => { cancelled = true; };
  }, []);

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
  }, [deals, searchQuery, propertyType, priceRange, bedsFilter, statusFilter, sortBy]);

  const activeDealId = selectedDealId || hoveredDealId;

  const handleDealSelect = useCallback((dealId: string) => {
    setSelectedDealId(dealId);
    const el = document.getElementById(`deal-card-${dealId}`);
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, []);

  const activeFilterCount = [propertyType, priceRange, bedsFilter, statusFilter].filter(
    (f) => f !== "All"
  ).length;

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-[#D4A843]" />
          <span className="text-sm" style={{ color: "var(--brix-fg-muted)" }}>Loading deals...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col overflow-hidden">
      {/* ── Top Filter Bar ── */}
      <div
        className="flex-shrink-0 border-b border-[var(--brix-border)] px-4 py-3"
        style={{ backgroundColor: "var(--brix-surface)" }}
      >
        {/* Row 1: Search + View Toggle */}
        <div className="flex items-center gap-3 mb-3">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
              style={{ color: "var(--brix-fg-muted)" }}
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
            <label htmlFor="marketplace-search" className="sr-only">Search deals by location</label>
            <input
              id="marketplace-search"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="State, County, City or Zip"
              className="w-full rounded-lg border border-[var(--brix-border)] py-2 pl-10 pr-4 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-[#D4A843]"
              style={{ backgroundColor: "var(--brix-bg)" }}
            />
          </div>

          {/* Deal count */}
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-sm text-white">
              <span className="font-semibold">{filteredDeals.length}</span>{" "}
              <span className="text-xs" style={{ color: "var(--brix-fg-muted)" }}>deals found</span>
            </span>
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="rounded-lg border border-[var(--brix-border)] px-3 py-2 text-xs text-white focus:outline-none"
            style={{ backgroundColor: "var(--brix-bg)" }}
          >
            <option value="newest">Newest First</option>
            <option value="roi">Highest ROI</option>
            <option value="funded">Most Funded</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>

          {/* View toggle */}
          <div className="flex rounded-lg overflow-hidden border border-[var(--brix-border)]">
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
                aria-label={mode.charAt(0).toUpperCase() + mode.slice(1) + " view"}
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
            className="rounded-full border border-[var(--brix-border)] px-3 py-1.5 text-xs text-white focus:outline-none"
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
            className="rounded-full border border-[var(--brix-border)] px-3 py-1.5 text-xs text-white focus:outline-none"
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
            className="rounded-full border border-[var(--brix-border)] px-3 py-1.5 text-xs text-white focus:outline-none"
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
            className="rounded-full border border-[var(--brix-border)] px-3 py-1.5 text-xs text-white focus:outline-none"
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
            style={{ backgroundColor: "var(--brix-bg)" }}
          >
            <MapView
              deals={filteredDeals}
              onDealSelect={handleDealSelect}
              selectedDealId={activeDealId}
            />
            {/* Deal count overlay on map-only mode */}
            {viewMode === "map" && (
              <div
                className="absolute top-4 left-4 z-[1000] rounded-lg border border-[var(--brix-border)] px-3 py-2"
                style={{ backgroundColor: "#1A1A2Eee" }}
              >
                <span className="text-sm font-semibold text-white">{filteredDeals.length}</span>
                <span className="text-xs ml-1.5" style={{ color: "var(--brix-fg-muted)" }}>
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
            style={{ backgroundColor: "var(--brix-bg)" }}
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
                <svg className="w-16 h-16 mb-4" style={{ color: "var(--brix-fg-muted)" }} fill="none" stroke="currentColor" strokeWidth={1} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <p className="text-lg font-semibold text-white mb-1">No deals found</p>
                <p className="text-sm mb-4" style={{ color: "var(--brix-fg-muted)" }}>
                  Try adjusting your filters or search query
                </p>
                <button
                  onClick={() => {
                    setPropertyType("All");
                    setPriceRange("All");
                    setBedsFilter("All");
                    setStatusFilter("All");
                    setSearchQuery("");
                  }}
                  className="rounded-lg px-5 py-2.5 text-sm font-semibold transition-colors hover:opacity-90"
                  style={{ backgroundColor: "#D4A843", color: "#0D0D1A" }}
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
