"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";

interface Deal {
  id: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  type: string;
}

const allDeals: Deal[] = [
  { id: "deal-001", address: "1847 Oakwood Dr", city: "Charlotte", state: "NC", zip: "28205", type: "Flip" },
  { id: "deal-002", address: "412 Magnolia Ln", city: "Raleigh", state: "NC", zip: "27601", type: "New Build" },
  { id: "deal-003", address: "903 Pine Valley Rd", city: "Greenville", state: "SC", zip: "29601", type: "Value-Add" },
  { id: "deal-004", address: "2215 Bayshore Blvd", city: "Tampa", state: "FL", zip: "33611", type: "Flip" },
  { id: "deal-005", address: "567 Elm Creek Way", city: "Charlotte", state: "NC", zip: "28202", type: "New Build" },
  { id: "deal-006", address: "1100 Riverside Ave", city: "Raleigh", state: "NC", zip: "27603", type: "Value-Add" },
  { id: "deal-007", address: "824 Palmetto St", city: "Charleston", state: "SC", zip: "29401", type: "Flip" },
  { id: "deal-008", address: "3301 Peachtree Rd", city: "Atlanta", state: "GA", zip: "30326", type: "New Build" },
  { id: "deal-009", address: "156 Ocean Blvd", city: "Jacksonville", state: "FL", zip: "32250", type: "Value-Add" },
  { id: "deal-010", address: "2900 Lake Norman Dr", city: "Mooresville", state: "NC", zip: "28117", type: "Wholesale" },
];

interface SearchResult {
  type: "deal" | "location";
  label: string;
  sub: string;
  href: string;
}

export default function GlobalSearch({ placeholder }: { placeholder: string }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounce 300ms
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(timer);
  }, [query]);

  // Search logic
  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([]);
      return;
    }
    const q = debouncedQuery.toLowerCase();
    const matched: SearchResult[] = [];
    const seenLocations = new Set<string>();

    // Search deals
    for (const deal of allDeals) {
      if (matched.length >= 8) break;
      const matchesAddress = deal.address.toLowerCase().includes(q);
      const matchesCity = deal.city.toLowerCase().includes(q);
      const matchesState = deal.state.toLowerCase().includes(q);
      const matchesType = deal.type.toLowerCase().includes(q);
      const matchesZip = deal.zip.includes(q);

      if (matchesAddress || matchesCity || matchesState || matchesType || matchesZip) {
        matched.push({
          type: "deal",
          label: deal.address,
          sub: `${deal.type} · ${deal.city}, ${deal.state}`,
          href: `/marketplace/${deal.id}`,
        });
      }

      // Collect unique locations
      const loc = `${deal.city}, ${deal.state}`;
      if ((matchesCity || matchesState) && !seenLocations.has(loc)) {
        seenLocations.add(loc);
      }
    }

    // Add location results (filtered marketplace)
    for (const loc of seenLocations) {
      if (matched.length >= 8) break;
      matched.push({
        type: "location",
        label: loc,
        sub: "View all deals in this area",
        href: `/marketplace?q=${encodeURIComponent(loc.split(",")[0].trim())}`,
      });
    }

    setResults(matched);
    setActiveIndex(-1);
  }, [debouncedQuery]);

  // Close on click outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const navigate = useCallback((href: string) => {
    setIsOpen(false);
    setQuery("");
    router.push(href);
  }, [router]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsOpen(false);
      inputRef.current?.blur();
      return;
    }
    if (!isOpen || results.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      navigate(results[activeIndex].href);
    }
  };

  const dealResults = results.filter((r) => r.type === "deal");
  const locationResults = results.filter((r) => r.type === "location");

  return (
    <div ref={containerRef} className="relative flex-1 max-w-md">
      <svg
        className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
        style={{ color: "var(--brix-fg-muted)" }}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <label htmlFor="global-search" className="sr-only">Search deals, builders, locations</label>
      <input
        ref={inputRef}
        id="global-search"
        type="text"
        value={query}
        onChange={(e) => { setQuery(e.target.value); setIsOpen(true); }}
        onFocus={() => { if (query.trim()) setIsOpen(true); }}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="w-full rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-[#D4A843]"
        style={{
          backgroundColor: "var(--brix-surface)",
          color: "var(--brix-fg)",
          border: "1px solid var(--brix-border)",
        }}
        role="combobox"
        aria-expanded={isOpen && results.length > 0}
        aria-controls="search-results"
        aria-activedescendant={activeIndex >= 0 ? `search-result-${activeIndex}` : undefined}
        autoComplete="off"
      />

      {/* Dropdown */}
      {isOpen && query.trim() && (
        <div
          id="search-results"
          role="listbox"
          className="absolute left-0 right-0 top-full mt-1 z-50 max-h-96 overflow-y-auto rounded-xl shadow-2xl"
          style={{ backgroundColor: "var(--brix-surface)", border: "1px solid var(--brix-border)" }}
        >
          {results.length === 0 && debouncedQuery.trim() && (
            <div className="px-4 py-6 text-center text-sm" style={{ color: "var(--brix-fg-muted)" }}>
              No results found for &ldquo;{debouncedQuery}&rdquo;
            </div>
          )}

          {dealResults.length > 0 && (
            <div>
              <div className="px-3 pt-2 pb-1 text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--brix-fg-muted)" }}>Deals</div>
              {dealResults.map((result, i) => {
                const globalIdx = results.indexOf(result);
                return (
                  <button
                    key={result.href}
                    id={`search-result-${globalIdx}`}
                    role="option"
                    aria-selected={activeIndex === globalIdx}
                    onClick={() => navigate(result.href)}
                    className="flex w-full items-center gap-3 px-3 py-2 text-left transition-colors"
                    style={{ backgroundColor: activeIndex === globalIdx ? "rgba(212,168,67,0.1)" : "transparent" }}
                    onMouseEnter={() => setActiveIndex(globalIdx)}
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg" style={{ backgroundColor: "#D4A84320" }}>
                      <svg className="w-4 h-4" style={{ color: "#D4A843" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-white truncate">{result.label}</p>
                      <p className="text-xs truncate" style={{ color: "var(--brix-fg-muted)" }}>{result.sub}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {locationResults.length > 0 && (
            <div>
              <div className="px-3 pt-2 pb-1 text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--brix-fg-muted)", borderTop: dealResults.length > 0 ? "1px solid var(--brix-border)" : "none" }}>Locations</div>
              {locationResults.map((result) => {
                const globalIdx = results.indexOf(result);
                return (
                  <button
                    key={result.href}
                    id={`search-result-${globalIdx}`}
                    role="option"
                    aria-selected={activeIndex === globalIdx}
                    onClick={() => navigate(result.href)}
                    className="flex w-full items-center gap-3 px-3 py-2 text-left transition-colors"
                    style={{ backgroundColor: activeIndex === globalIdx ? "rgba(212,168,67,0.1)" : "transparent" }}
                    onMouseEnter={() => setActiveIndex(globalIdx)}
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg" style={{ backgroundColor: "#2B4C7E20" }}>
                      <svg className="w-4 h-4" style={{ color: "#2B4C7E" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-white truncate">{result.label}</p>
                      <p className="text-xs truncate" style={{ color: "var(--brix-fg-muted)" }}>{result.sub}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
