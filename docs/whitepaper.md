# $BRXU: The Build Token — Whitepaper v1.0

## BrixUp Technologies LLC | 2026

**Document Version:** 1.0
**Last Updated:** February 2026
**Website:** [https://brixups.com](https://brixups.com)
**Contact:** miguel@brixups.com

---

## Table of Contents

1. [Abstract](#1-abstract)
2. [Introduction: The Problem](#2-introduction-the-problem)
3. [Market Opportunity](#3-market-opportunity)
4. [The BrixUp Solution](#4-the-brixup-solution)
5. [$BRXU Token: Utility, Economics, and Governance](#5-brix-token-utility-economics-and-governance)
6. [Smart Contract Architecture](#6-smart-contract-architecture)
7. [Deal Lifecycle](#7-deal-lifecycle)
8. [Sweat Equity Tokenization](#8-sweat-equity-tokenization)
9. [Draw Schedule Protocol](#9-draw-schedule-protocol)
10. [Security, Compliance, and Regulatory Framework](#10-security-compliance-and-regulatory-framework)
11. [Technology Stack](#11-technology-stack)
12. [Revenue Model](#12-revenue-model)
13. [Roadmap 2026-2028](#13-roadmap-2026-2028)
14. [Team](#14-team)
15. [Risk Factors](#15-risk-factors)
16. [Conclusion](#16-conclusion)
17. [References](#17-references)

---

## 1. Abstract

BrixUp is a tokenized real estate development marketplace that unites investors, builders, and dealmakers under a unified smart contract framework, creating the first vertically integrated platform where capital meets construction at the point of execution. The $BRXU token (ERC-20, deployed on Base L2) serves as the utility and governance backbone of the platform, enabling deal participation, staking, fee reduction, reputation scoring, and community governance across every phase of the real estate development lifecycle.

The United States residential construction market exceeds $1.3 trillion annually, yet the participants who create the most value — contractors, tradespeople, and small-scale developers — remain systematically excluded from the profit upside of the projects they build. Meanwhile, real estate crowdfunding has surpassed $300 billion in total addressable market, but existing platforms operate as institutional gatekeepers that ignore the builders, wholesalers, and local operators who originate and execute deals on the ground. BrixUp bridges this gap by tokenizing the entire deal lifecycle: from deal origination and investor funding through active construction, milestone-based draw schedules, and automated profit distribution.

The platform introduces the concept of "Sweat Equity Tokenization," enabling contractors to commit labor commitments to a deal and receive tokenized profit participation alongside cash-paying investors — a mechanism that has never existed in either traditional construction finance or the tokenized asset ecosystem. Each deal on BrixUp is encapsulated in its own smart contract (a "Brix Box"), creating transparent, auditable, and enforceable agreements between all parties without the friction, opacity, or counterparty risk of traditional construction draws and handshake deals.

BrixUp is headquartered in Charlotte, North Carolina, and is led by Miguel Perez, a licensed general contractor with 15+ years of experience in residential construction across North Carolina, South Carolina, and Florida. The platform's first cohort of deals will source from the existing pipeline of M4 Development Holdings, Perez's established construction and development firm, providing immediate deal flow and proof of concept in a live market.

---

## 2. Introduction: The Problem

Real estate development is one of the largest wealth-creation engines in the American economy, yet it remains one of the most fragmented, opaque, and inaccessible industries for the participants who drive it. The $1.3 trillion U.S. residential construction market operates on a patchwork of handshake agreements, paper-based draw schedules, and opaque profit-sharing arrangements that create friction, mistrust, and inefficiency at every level of the value chain.

**Contractors get paid last.** In the traditional construction payment hierarchy, general contractors and subcontractors sit at the bottom of a waterfall that flows from lender to developer to GC to sub. Payment delays of 60-90 days are standard. Mechanic's lien filings exceed 500,000 annually in the United States, representing billions in disputed payments. The construction industry experiences the highest rate of business failure of any sector, with cash flow problems cited as the primary cause in over 80% of contractor bankruptcies. Despite creating 100% of the physical value in a development project, contractors typically receive zero equity participation in the profits their work generates.

**Investors can't access small deals.** The democratization of real estate investing through platforms like Fundrise, CrowdStreet, and RealtyMogul has opened institutional-scale deals to retail investors, but these platforms focus exclusively on large, stabilized assets or institutional-grade developments. A $250,000 fix-and-flip in Charlotte, a $400,000 ground-up duplex in Greenville, or a $150,000 BRRRR deal in Columbia — the bread-and-butter transactions that generate 20-40% annualized returns — remain invisible to the crowdfunding ecosystem. There is no platform where an investor can deploy $1,000 into a single-family renovation alongside the contractor who will swing the hammer.

**Wholesalers and dealmakers lack capital partners.** The real estate wholesaling market has exploded over the past decade, with an estimated 200,000+ active wholesalers in the United States. These dealmakers identify undervalued properties, negotiate purchase contracts, and create value through deal origination — but the vast majority lack the capital, contractor relationships, or platform to execute beyond a simple assignment fee. The typical wholesaler earns $5,000-$15,000 per assignment while the end buyer captures $50,000-$150,000 in renovation profit. BrixUp enables wholesalers to transform from transaction brokers into deal sponsors who retain meaningful equity participation in the projects they source.

**The trust deficit.** Construction is a relationship business built on trust, but trust doesn't scale. A contractor in Charlotte trusts the five developers he's worked with for a decade, but has no mechanism to evaluate or participate in deals from investors he hasn't met. An investor in California wants exposure to Southeast fix-and-flips but has no way to verify contractor quality, project progress, or profit calculations. Every deal requires a new web of relationships, references, and legal agreements — creating enormous transaction costs that make small deals economically unviable for institutional platforms.

**The technology gap.** While fintech has revolutionized payments, lending, and investing across nearly every sector, construction finance remains stubbornly analog. Draw requests are submitted on paper. Inspections are scheduled by phone. Profit distributions are calculated in spreadsheets and wired manually. The construction industry's technology adoption rate lags every other major sector by 5-10 years, creating an enormous opportunity for a platform that brings smart contract automation, transparent escrow, and tokenized participation to the people who build America's homes.

---

## 3. Market Opportunity

BrixUp operates at the intersection of three massive, converging markets — each independently large enough to support a multi-billion-dollar platform, and collectively representing one of the largest untapped opportunities in the fintech and proptech landscape.

### Residential Construction: $1.3 Trillion

The U.S. residential construction market generated approximately $1.3 trillion in activity in 2025, encompassing new home construction, renovation, and value-add rehabilitation. Within this market, fix-and-flip activity alone accounts for over $80 billion annually, with approximately 350,000 homes flipped per year. The average flip generates gross profits of $67,000-$73,000, with the most active markets (Charlotte, Atlanta, Phoenix, Dallas, Tampa) consistently producing 25-40% gross margins on well-executed projects.

### Real Estate Crowdfunding: $300B+ TAM

The global real estate crowdfunding market has grown at a compound annual rate exceeding 35% since 2018, reaching a total addressable market estimated at $300 billion or more. Platforms like Fundrise ($3.3B AUM), CrowdStreet ($4.1B invested), and RealtyMogul ($1B+ invested) have demonstrated massive demand for retail-accessible real estate investing. However, these platforms focus exclusively on institutional-grade assets and ignore the sub-$1M deal segment entirely — a segment that represents the majority of transactions and the highest risk-adjusted returns.

### Tokenized Real Estate: $16B+ by 2030

The tokenization of real-world assets (RWAs) has emerged as one of the most significant trends in blockchain technology. Boston Consulting Group projects that tokenized real assets will exceed $16 trillion by 2030, with real estate representing the largest single asset class. Early movers like RealT, Lofty, and Propy have demonstrated demand for tokenized property ownership, but none have addressed the construction and development lifecycle — the phase where the most value is created and the most capital is deployed.

### The Labor Shortage Multiplier

The U.S. construction industry faces a shortage of over 500,000 skilled tradespeople, a gap that is widening annually as experienced workers retire and younger workers choose other careers. There are 12 million construction workers in the United States, and the industry adds 300,000-400,000 new positions annually that go unfilled. BrixUp's Sweat Equity Tokenization model directly addresses this shortage by offering contractors something no traditional employer can: ownership participation in the projects they build. By converting labor into equity, BrixUp creates a powerful retention and recruitment mechanism that transforms the contractor-developer relationship from adversarial to aligned.

### Target Market Segments

| Segment | Size | BrixUp Value Proposition |
|---------|------|--------------------------|
| Fix-and-flip operators | 350K+ active in US | Deal funding, contractor matching, transparent draws |
| Licensed general contractors | 700K+ active licenses | Sweat equity participation, deal flow, payment certainty |
| Real estate wholesalers | 200K+ active | Capital partners, execution platform, profit participation |
| Retail RE investors | 15M+ accounts on existing platforms | Access to small deals, transparent returns, $BRXU staking |
| Construction subcontractors | 2M+ firms | Payment guarantee, profit sharing, reputation building |

---

## 4. The BrixUp Solution

BrixUp is best understood as the convergence of three platforms that have never been integrated: **Fundrise** (real estate crowdfunding for capital formation), **Angi** (contractor marketplace for builder matching), and **OpenSea** (tokenized asset marketplace for transparent ownership and trading). By unifying these functions under a single smart contract framework, BrixUp eliminates the friction, opacity, and counterparty risk that plague traditional real estate development.

### Platform Overview

BrixUp is a two-sided marketplace with four distinct participant types, each incentivized through the $BRXU token ecosystem:

**Dealmakers** are the originators — wholesalers, real estate agents, developers, and scouts who source undervalued properties and structure renovation or development deals. Dealmakers list projects on BrixUp with detailed scopes of work, budgets, timelines, and profit projections. They earn origination fees and retain equity participation in the deals they sponsor. The platform provides dealmakers with capital access they cannot find through traditional channels, transforming them from transaction intermediaries into deal sponsors.

**Builders** are the executors — licensed general contractors and specialty subcontractors who commit to constructing or renovating the property. Builders can participate through traditional cash compensation (funded through the draw schedule), Sweat Equity Tokenization (contributing labor in exchange for profit participation), or a hybrid of both. The platform provides builders with deal flow, payment certainty through smart contract escrow, and for the first time, an opportunity to share in the upside of the projects they build.

**Investors** are the capital providers — retail and accredited individuals who fund deals through USDC contributions to deal-specific smart contracts. Investors can browse active deals, review scopes of work and budgets, evaluate builder credentials and track records, and deploy capital in amounts as low as $100. Returns are distributed automatically through the smart contract upon deal completion, with full transparency into the capital stack, draw schedule, and profit waterfall.

**The Platform** (BrixUp Technologies LLC) serves as the infrastructure provider, compliance layer, and dispute resolution mechanism. The platform earns fees on deal origination, draw processing, and secondary market transactions while maintaining the smart contract infrastructure, KYC/AML compliance, and quality assurance processes that enable trustless transactions between strangers.

### Core Features

- **Deal Marketplace:** Browse, filter, and invest in tokenized real estate deals across multiple markets, property types, and return profiles
- **Brix Box Smart Contracts:** Each deal deploys its own escrow smart contract with customized terms, milestones, and distribution waterfalls
- **Draw Schedule Automation:** Milestone-based fund releases triggered by inspector verification, replacing manual draw request processes
- **Sweat Equity Engine:** Contractors register trade commitments, log hours, and earn tokenized profit participation
- **Reputation System:** On-chain track record for builders, dealmakers, and investors based on completed deals, on-time delivery, and return performance
- **$BRXU Staking:** Stake tokens for fee discounts, priority deal access, governance voting, and enhanced reputation scores
- **Secondary Market:** Trade deal participation tokens before project completion, providing liquidity to traditionally illiquid investments

---

## 5. $BRXU Token: Utility, Economics, and Governance

### Token Overview

| Parameter | Value |
|-----------|-------|
| Token Name | BrixUp Token |
| Symbol | $BRXU |
| Standard | ERC-20 |
| Network | Base L2 (Ethereum) |
| Total Supply | 1,000,000,000 (1 Billion) |
| Decimals | 18 |
| Initial Circulating Supply | ~50,000,000 (5%) |

### Token Allocation

| Allocation | Percentage | Tokens | Vesting |
|------------|-----------|--------|---------|
| Treasury / Ecosystem | 40% | 400,000,000 | 4-year linear unlock, 6-month cliff |
| Community Rewards | 20% | 200,000,000 | Released via staking, deals, and incentives |
| Team & Advisors | 15% | 150,000,000 | 4-year vesting, 12-month cliff |
| Liquidity Pool | 10% | 100,000,000 | 50% at TGE, 50% over 6 months |
| Marketing & Partnerships | 10% | 100,000,000 | 2-year linear unlock |
| Pre-Sale | 5% | 50,000,000 | 3-month cliff, 9-month linear unlock |

### Utility Functions

$BRXU is designed as a utility token with seven core functions within the BrixUp ecosystem:

1. **Deal Access:** Holding or staking $BRXU is required to access premium deal listings, early funding windows, and exclusive deal categories. Tiered access levels (Bronze, Silver, Gold, Platinum) unlock progressively better deal flow based on staking thresholds.

2. **Fee Reduction:** $BRXU holders receive fee discounts proportional to their staking tier. Bronze (1,000 $BRXU staked) receives a 10% discount on platform fees; Silver (10,000) receives 20%; Gold (50,000) receives 30%; Platinum (250,000) receives 50%.

3. **Reputation Weighting:** $BRXU staking contributes to a participant's reputation score, which affects deal visibility, builder matching priority, and investor confidence signals. Staking demonstrates commitment to the platform and aligns long-term incentives.

4. **Governance Voting:** $BRXU holders vote on platform governance proposals including fee structure changes, new market expansion, feature prioritization, treasury disbursements, and dispute resolution policies. Voting power is proportional to staked tokens with a quadratic weighting mechanism to prevent plutocratic capture.

5. **Contractor Staking (Bond):** Builders stake $BRXU as a performance bond when committing to deals. If the builder fails to meet milestones or abandons the project, a portion of their staked tokens is slashed and distributed to affected investors and dealmakers. This creates a powerful accountability mechanism that replaces traditional surety bonds.

6. **Reward Distribution:** Community rewards, referral bonuses, and platform incentives are denominated and distributed in $BRXU. Early adopters, high-performing builders, and active investors earn $BRXU through platform engagement.

7. **Secondary Market Currency:** Deal participation shares can be listed and traded on BrixUp's secondary market, with $BRXU serving as one side of the trading pair alongside USDC.

### Governance Framework

BrixUp governance operates through a DAO-lite structure during the initial launch phase, transitioning to full DAO governance as the platform matures:

- **Phase 1 (2026):** Advisory governance. $BRXU holders submit and vote on proposals, but the core team retains veto authority for compliance and operational reasons.
- **Phase 2 (2027):** Hybrid governance. Community votes are binding for fee changes, market expansion, and treasury allocation above $100,000. Core team retains veto only for legal and compliance matters.
- **Phase 3 (2028+):** Full DAO governance. All platform decisions governed by $BRXU holder votes with a multi-sig execution committee elected by token holders.

---

## 6. Smart Contract Architecture

BrixUp's smart contract system is built on a modular architecture deployed on Base L2, Coinbase's Ethereum layer-2 network selected for its low gas costs (~$0.01-0.05 per transaction), fast finality (~2 seconds), and native integration with Coinbase Smart Wallet for seamless fiat-to-crypto onboarding.

### Core Contracts

**BrixToken.sol** — The ERC-20 token contract for $BRXU. Implements standard ERC-20 functionality with additional modules for vesting schedules (team, treasury, pre-sale), pausability (emergency circuit breaker), and snapshot functionality for governance voting. The contract is deployed once and serves as the canonical $BRXU token across the entire platform.

**BrixDeal.sol** — The per-deal escrow contract, referred to as a "Brix Box." Each deal listed on BrixUp deploys a new instance of BrixDeal with customized parameters including funding target, draw milestones, profit distribution waterfall, builder commitments, and timeline. The Brix Box holds all investor funds in USDC, releases draws upon verified milestone completion, and automatically distributes profits upon deal completion. Key functions include:

- `invest(uint256 amount)` — Investors deposit USDC into the deal escrow
- `requestDraw(uint256 milestoneId, string calldata evidence)` — Builder submits draw request with documentation
- `approveDraw(uint256 milestoneId)` — Admin/inspector approves milestone and triggers fund release
- `completeDeal(uint256 salePrice)` — Finalizes the deal and triggers profit distribution
- `claimProfit()` — Participants withdraw their share of profits
- `emergencyPause()` — Circuit breaker for disputes or compliance issues

**BrixFactory.sol** — The factory contract that deploys new BrixDeal instances. The factory ensures consistent contract creation, maintains a registry of all active deals, and enforces platform-wide parameters such as minimum funding thresholds, maximum deal sizes, and approved builder requirements. The factory pattern enables gas-efficient deployment while maintaining upgradeability through proxy patterns.

**BrixStaking.sol** — The staking contract for $BRXU tokens. Manages staking positions, calculates tier levels (Bronze through Platinum), tracks staking duration for governance weight, and handles slashing events for builder performance bonds. The staking contract integrates with the reputation system to provide on-chain credibility scoring.

### The "Brix Box" Concept

The Brix Box is BrixUp's signature innovation — a self-contained smart contract that encapsulates every financial relationship in a single real estate deal. When a dealmaker lists a project, the BrixFactory deploys a new Brix Box with the following embedded logic:

- **Capital Stack:** Defines the total funding requirement, investor allocation, builder sweat equity allocation, and dealmaker equity position
- **Milestone Schedule:** Encodes the draw schedule (Foundation, Framing, MEP, Finishes, Certificate of Occupancy) with percentage allocations and verification requirements
- **Profit Waterfall:** Specifies the distribution order upon completion — return of investor capital first, then platform fees, then profit split among investors, builder, and dealmaker according to pre-agreed percentages
- **Dispute Resolution:** Includes timeout mechanisms, escalation procedures, and emergency pause functionality to handle construction delays, budget overruns, or participant disputes

Each Brix Box operates independently, ensuring that the failure or delay of one deal has zero impact on any other deal on the platform. This isolation model provides investors with deal-level risk containment and builders with project-level accountability.

### Contract Security

All BrixUp smart contracts undergo three layers of security review:

1. **Internal Audit:** Line-by-line review by the BrixUp development team using Slither, Mythril, and manual analysis
2. **External Audit:** Engagement with a top-tier blockchain security firm (targeted: OpenZeppelin, Trail of Bits, or Certora) prior to mainnet deployment
3. **Bug Bounty:** Post-deployment bug bounty program on Immunefi with payouts up to $50,000 for critical vulnerabilities

---

## 7. Deal Lifecycle

Every deal on BrixUp follows a standardized lifecycle with six distinct phases, each governed by smart contract logic and platform verification processes.

### Phase 1: Listing

A dealmaker submits a deal proposal to the platform with comprehensive documentation:

- Property details (address, type, condition, photos, title status)
- Purchase price and acquisition terms (cash, hard money, seller finance)
- Scope of work with line-item budget
- After-repair value (ARV) supported by comparable sales analysis
- Projected timeline from acquisition to sale or refinance
- Proposed capital stack (equity split between investors, builder, dealmaker)
- Proposed draw schedule with milestone definitions

The BrixUp team reviews the submission for completeness, accuracy, and feasibility. Approved deals receive a Brix Score (1-100) based on market conditions, projected returns, dealmaker track record, and risk factors. The deal is then published to the marketplace and a Brix Box smart contract is deployed via BrixFactory.

### Phase 2: Funding

Once listed, the deal enters a funding window (typically 14-30 days). Investors browse the deal profile, review documentation, and commit USDC to the Brix Box. Key mechanics:

- **Minimum Investment:** $100 USDC per investor
- **Funding Target:** The total equity requirement defined in the deal terms
- **Overfunding Protection:** The Brix Box automatically rejects investments that exceed the funding target
- **Underfunding Refund:** If the deal fails to reach its funding target within the window, all investor funds are automatically returned

Builders who are participating through Sweat Equity also register their commitments during this phase, specifying their trade, labor hours, and requested profit participation percentage.

### Phase 3: Active Construction

Upon full funding, the deal transitions to Active Construction. The dealmaker acquires the property (if not already under contract), and the builder begins work according to the approved scope. During this phase:

- Builders log daily activity and progress photos to the platform
- Project timelines are tracked against the original schedule
- Change orders require dealmaker approval and investor notification (material changes require investor vote)
- The $BRXU reputation system records builder performance in real-time

### Phase 4: Draw Schedule

As construction progresses, the builder submits draw requests at pre-defined milestones. Each draw follows the Draw Schedule Protocol (detailed in Section 9):

1. Builder submits draw request with milestone evidence (photos, permits, inspector sign-offs)
2. Platform-approved inspector verifies milestone completion (physical or virtual inspection)
3. Admin approves the draw in the Brix Box smart contract
4. Funds are released to the builder's wallet automatically

### Phase 5: Completion

Upon final completion — defined as receipt of Certificate of Occupancy (for new construction) or completion of all scope items (for renovation) — the deal enters the Completion phase:

- Final inspection verifies scope completion against the original SOW
- Property is listed for sale or refinance
- Sale proceeds or refinance disbursement is deposited into the Brix Box as USDC

### Phase 6: Profit Distribution

The Brix Box automatically executes the profit distribution waterfall:

1. **Return of Capital:** Investors receive their original USDC investment back first
2. **Platform Fees:** BrixUp origination and processing fees are deducted
3. **Preferred Return (if applicable):** Investors may receive a preferred return (e.g., 8-12% annualized) before profit splitting
4. **Profit Split:** Remaining profits are distributed according to the pre-agreed waterfall:
   - Investors: typically 50-70% of profits
   - Builder (cash + sweat equity): typically 15-30% of profits
   - Dealmaker: typically 10-20% of profits

All distributions are executed on-chain, creating a permanent, auditable record of every dollar in and every dollar out.

---

## 8. Sweat Equity Tokenization

Sweat Equity Tokenization is BrixUp's most innovative feature and its strongest competitive moat. For the first time in the history of construction finance, contractors can convert their labor into tokenized profit participation — earning alongside investors rather than simply billing for services.

### How It Works

1. **Registration:** A licensed contractor registers on BrixUp, providing their license information, trade specialties, insurance documentation, and work history. The platform verifies credentials and creates an on-chain profile.

2. **Deal Commitment:** When a deal is listed that requires the contractor's trade, the builder reviews the scope and proposes a Sweat Equity commitment. For example: "I will provide all framing labor for this project (estimated 320 hours, valued at $38,400) in exchange for 12% of net profits."

3. **Smart Contract Escrow:** The Brix Box records the Sweat Equity commitment alongside cash investor positions. The builder's profit share is "escrowed" in the smart contract — it doesn't require upfront capital, but it creates an enforceable claim on future profits proportional to the labor committed.

4. **Labor Tracking:** As the builder works, they log hours and milestones through the BrixUp platform. Progress photos, permit inspections, and milestone completions create an on-chain record of labor delivery.

5. **Milestone Verification:** At each draw milestone, the inspector verifies not only that the work is complete, but that the Sweat Equity participant has delivered their committed labor. Verified milestones unlock progressive portions of the builder's profit participation.

6. **Profit Distribution:** Upon deal completion, the builder's Sweat Equity share is calculated and distributed alongside investor returns. The builder receives their profit share in USDC, having earned equity-like returns without investing cash.

### Why Sweat Equity Matters

The construction labor shortage is the single largest constraint on housing development in the United States. Over 500,000 skilled trade positions go unfilled annually, driving up costs, extending timelines, and reducing the number of homes built. Traditional compensation — hourly wages or project-based fees — fails to attract and retain talent because it offers no wealth-building pathway.

Sweat Equity Tokenization changes the equation. A framing contractor who earns $45/hour on a traditional job can earn the equivalent of $75-$120/hour on a BrixUp deal when profit participation is included. More importantly, the contractor begins building a portfolio of real estate equity positions — not just earning wages, but accumulating wealth through the same mechanism that has made real estate developers wealthy for generations.

This alignment of incentives also produces better outcomes for investors. A contractor who owns 10-15% of the profits has a fundamentally different motivation than one who is billing hourly. Quality improves. Timelines compress. Waste decreases. The contractor becomes a partner, not a vendor.

---

## 9. Draw Schedule Protocol

BrixUp's Draw Schedule Protocol mirrors the milestone-based funding mechanism used in traditional construction lending, but replaces manual processes, paper forms, and lender discretion with smart contract automation and verified inspections.

### Standard Milestones

| Milestone | % of Budget | Description | Verification |
|-----------|------------|-------------|--------------|
| Foundation / Demolition | 15% | Site prep, demolition, foundation pour | Permit + inspection |
| Framing / Structural | 25% | Rough framing, structural elements, roof | Photo + inspection |
| MEP Rough-In | 20% | Mechanical, electrical, plumbing rough | Permit + inspection |
| Finishes | 30% | Drywall, flooring, fixtures, paint, trim | Photo + walkthrough |
| Certificate of Occupancy | 10% | Final inspections, punch list, CO issued | CO document upload |

### Draw Request Process

1. **Builder Submission:** The builder initiates a draw request through the BrixUp platform, uploading milestone evidence including photographs, permit documentation, subcontractor lien waivers, and inspection reports. The draw request is timestamped and recorded on-chain.

2. **Inspector Verification:** A BrixUp-approved inspector (licensed home inspector, general contractor, or local code official) reviews the milestone evidence. For deals under $250,000, virtual inspections via video walkthrough and geotagged photographs are permitted. Deals above $250,000 require physical site inspection.

3. **Admin Approval:** Upon inspector verification, the BrixUp admin executes the `approveDraw()` function on the Brix Box smart contract. This is a multi-sig operation requiring two of three authorized signers (platform admin, deal-specific inspector, dealmaker) to prevent unilateral fund release.

4. **Automatic Disbursement:** Upon approval, the Brix Box automatically transfers the draw amount in USDC to the builder's registered wallet. The transaction is recorded on-chain with a permanent link to the milestone evidence stored on IPFS.

5. **Investor Notification:** All investors in the deal receive a notification with the draw details, milestone evidence, and updated project status. Investors can review all draw history and evidence through their dashboard at any time.

### Dispute Resolution

If an investor or dealmaker disputes a draw request, the following escalation process applies:

- **Level 1:** 48-hour review period where the builder can provide additional evidence
- **Level 2:** Independent third-party inspection ordered and funded from the deal's contingency allocation
- **Level 3:** Platform arbitration panel (three $BRXU-staked community members) renders binding decision
- **Level 4:** Off-chain legal remedies per the deal's governing law (North Carolina)

---

## 10. Security, Compliance, and Regulatory Framework

BrixUp operates within a carefully structured compliance framework designed to provide regulatory clarity while maximizing accessibility for all participant types.

### KYC/AML Compliance

All platform participants undergo identity verification through Persona, an enterprise-grade KYC/AML platform. Verification requirements include:

- **Individual Investors:** Government-issued ID, selfie verification, address confirmation, sanctions screening (OFAC, EU, UN lists)
- **Accredited Investors:** Additional income/net worth verification for Reg D 506(c) deals
- **Builders/Contractors:** Business entity verification, license verification, insurance confirmation
- **Dealmakers:** Business entity verification, real estate license verification (where applicable)

### Token Classification

$BRXU is structured as a utility token under U.S. securities law. Under the Howey Test analysis:

1. **Investment of Money:** $BRXU is acquired for platform utility, not as an investment of money for profit. Holders stake tokens for fee discounts, deal access, and governance — functional utilities within the platform.
2. **Common Enterprise:** $BRXU utility functions operate independently of BrixUp's financial performance. Fee discounts and governance rights have value regardless of platform profitability.
3. **Expectation of Profit:** The token is marketed and sold for its utility functions, not as a profit-generating investment. The platform does not promote $BRXU as an investment vehicle.
4. **Efforts of Others:** $BRXU utility derives from the holder's own actions (staking, governance participation, deal access) rather than the managerial efforts of BrixUp.

*Note: This analysis represents BrixUp's good-faith interpretation. Token holders should consult their own legal counsel regarding applicable securities laws in their jurisdiction.*

### Deal-Level Securities Compliance

Individual deal participation — where investors contribute capital and expect returns from real estate development — is structured as a security offering under applicable exemptions:

- **Reg D 506(c):** For accredited investor-only deals. Permits general solicitation with verified accreditation. No cap on raise amount. Available to U.S. accredited investors only.
- **Reg CF (Regulation Crowdfunding):** For deals open to all investors. Permits raises up to $5 million per 12-month period. Available to all U.S. investors with investment limits based on income/net worth.
- **Deal SPV Structure:** Each deal is structured as a Special Purpose Vehicle (LLC) with its own operating agreement, making each investment a discrete legal entity separate from BrixUp and from every other deal.

### Governing Law

All platform agreements, deal documentation, and dispute resolution are governed by the laws of the State of North Carolina. BrixUp Technologies LLC is organized as a North Carolina limited liability company.

---

## 11. Technology Stack

BrixUp's technology platform is built on a modern, scalable architecture designed for security, performance, and seamless user experience across web and mobile interfaces.

### Blockchain Layer

- **Network:** Base L2 (Coinbase's Ethereum Layer 2)
- **Rationale:** Low gas costs ($0.01-0.05/tx), 2-second finality, native Coinbase Smart Wallet integration, growing ecosystem, Ethereum security inheritance
- **Smart Contracts:** Solidity 0.8.x, compiled with Hardhat, tested with Foundry
- **Token Standard:** ERC-20 ($BRXU), ERC-1155 (deal participation tokens)
- **Storage:** IPFS via Pinata for deal documentation, milestone evidence, and inspection reports

### Application Layer

- **Frontend:** Next.js 14+ (React), TypeScript, Tailwind CSS, deployed on Vercel
- **Backend:** Next.js API routes + Supabase (PostgreSQL) for off-chain data, user profiles, and deal metadata
- **Authentication:** Coinbase Smart Wallet (primary), WalletConnect, email-based wallet creation for crypto-naive users
- **Payments:** Circle USDC integration for fiat on/off-ramp, direct USDC deposits from any wallet

### Infrastructure

- **Hosting:** Vercel (frontend), Supabase (database + auth + storage), Railway (background jobs)
- **Monitoring:** Sentry (error tracking), Datadog (performance), Tenderly (smart contract monitoring)
- **CI/CD:** GitHub Actions for automated testing, deployment, and contract verification
- **Security:** Rate limiting, CORS policies, input sanitization, CSP headers, regular penetration testing

### Third-Party Integrations

- **Persona:** KYC/AML identity verification
- **Circle:** USDC minting, redemption, and cross-chain transfers
- **Coinbase Commerce:** Fiat-to-crypto payment processing
- **Resend:** Transactional email and notifications
- **Twilio:** SMS notifications for draw approvals and deal updates

---

## 12. Revenue Model

BrixUp generates revenue through six complementary streams designed to align platform incentives with participant success.

### Revenue Stream 1: Origination Fee (2-3%)

Charged to the deal upon full funding. The origination fee (2-3% of total deal capitalization) is deducted from the funded amount before capital deployment. This fee compensates BrixUp for deal review, Brix Score rating, smart contract deployment, and ongoing deal administration.

**Projected Revenue (Year 1):** 20 deals x $250K avg = $5M GDV x 2.5% = **$125,000**

### Revenue Stream 2: Transaction Fee (0.5%)

Applied to all USDC deposits into and withdrawals from Brix Box contracts. This fee covers blockchain gas costs (subsidized by BrixUp), payment processing, and platform infrastructure.

**Projected Revenue (Year 1):** $5M GDV x 0.5% = **$25,000**

### Revenue Stream 3: Draw Processing Fee (0.25%)

Charged on each draw disbursement. This fee compensates BrixUp for inspector coordination, milestone verification, and draw administration.

**Projected Revenue (Year 1):** $5M x 0.25% = **$12,500**

### Revenue Stream 4: Premium Listings

Dealmakers can pay for enhanced deal visibility, featured placement on the marketplace, and priority notification to high-value investors. Premium listing packages range from $299 to $1,499 per deal.

**Projected Revenue (Year 1):** 10 premium listings x $500 avg = **$5,000**

### Revenue Stream 5: SaaS Subscription Tiers

BrixUp offers subscription plans for high-volume dealmakers and builders:

| Tier | Monthly Price | Features |
|------|--------------|----------|
| Starter | Free | 1 active deal, basic analytics, community support |
| Pro | $99/mo | 5 active deals, advanced analytics, priority support |
| Enterprise | $299/mo | Unlimited deals, API access, white-label options, dedicated support |

**Projected Revenue (Year 1):** 30 subscribers x $150 avg/mo x 12 = **$54,000**

### Revenue Stream 6: Secondary Market Fee (1%)

When deal participation tokens are traded on BrixUp's secondary market, a 1% fee is charged to the seller. This creates recurring revenue from deal liquidity and incentivizes the platform to facilitate active secondary trading.

**Projected Revenue (Year 1):** $500K secondary volume x 1% = **$5,000**

### Total Projected Revenue

| Year | Deals | GDV | Total Revenue |
|------|-------|-----|---------------|
| Year 1 | 20 | $5M | $226,500 |
| Year 2 | 100 | $30M | $1,350,000 |
| Year 3 | 500 | $175M | $7,500,000 |

---

## 13. Roadmap 2026-2028

### 2026 Q1: Foundation
- Finalize smart contract architecture and deploy to Base testnet
- Complete Persona KYC integration
- Launch brixups.com with deal marketplace MVP
- $BRXU token pre-sale to early supporters
- Onboard first 5 deals from M4 Development Holdings pipeline
- Engage external smart contract auditor

### 2026 Q2: Launch
- $BRXU Token Generation Event (TGE) on Base mainnet
- Launch Brix Box smart contracts on Base mainnet
- First 10 funded deals live on platform
- Coinbase Smart Wallet integration for seamless onboarding
- Staking contract live with Bronze-Platinum tiers
- Begin Reg D 506(c) deal offerings for accredited investors

### 2026 Q3: Growth
- Expand to 50+ active deals
- Launch Sweat Equity Tokenization module
- Secondary market for deal participation tokens
- Mobile-responsive PWA launch
- Onboard builders in FL, SC, and GA markets
- Integrate Circle USDC on/off-ramp

### 2026 Q4: Scale
- 100+ deals funded on platform
- Launch Reg CF offerings for non-accredited investors
- Governance voting portal live
- Builder reputation system with on-chain scoring
- Launch $BRXU rewards program for platform engagement
- Geographic expansion to TX, AZ, and TN markets

### 2027: Expansion
- 250+ deals per quarter
- Native mobile app (iOS and Android)
- API platform for third-party integrations (title companies, lenders, insurance)
- Ground-up new construction deal category
- Multi-family and small commercial deal categories
- International expansion feasibility study (Mexico, Colombia, DR)

### 2028: Maturity
- 500+ deals per quarter
- Full DAO governance transition
- Insurance and warranty products built on $BRXU staking
- Lending marketplace (construction loans originated through platform)
- White-label platform for regional operators
- $BRXU listed on major CEXs (Coinbase, Kraken)

---

## 14. Team

### Miguel Perez — Founder & CEO

Miguel Perez brings over 15 years of hands-on experience in residential construction, real estate development, and general contracting to BrixUp. As the founder and principal of M4 Development Holdings, Miguel has personally managed the construction and renovation of 100+ residential properties across North Carolina, South Carolina, and Florida.

Miguel holds active general contractor licenses in three states (NC, SC, FL), providing BrixUp with immediate credibility and regulatory compliance in some of the fastest-growing real estate markets in the United States. His career spans every aspect of the construction value chain — from swinging hammers as a framing carpenter in his early career to managing multi-million-dollar development projects as a licensed GC.

Most importantly, Miguel has lived the problems BrixUp solves. He has been the contractor who waited 90 days for payment. He has been the developer who couldn't find reliable subs. He has been the dealmaker who lacked capital partners to execute on opportunities. BrixUp is not a theoretical solution designed in a Silicon Valley conference room — it is a platform built by a builder, for builders.

### Advisory Board (Forming)

BrixUp is actively building an advisory board with expertise across:

- **Blockchain / Token Economics:** Former leadership from major L1/L2 protocols or tokenized asset platforms
- **Real Estate Finance:** Executives from RE crowdfunding platforms, construction lenders, or institutional RE firms
- **Securities Law:** Attorneys specializing in Reg D, Reg CF, and token regulatory compliance
- **Construction Technology:** Leaders from proptech, construction management software, or trades workforce platforms

### Hiring Plan

BrixUp's seed round will fund the following key hires:

- CTO / Lead Smart Contract Developer
- Full-Stack Web3 Developer
- Head of Compliance / General Counsel
- Head of Growth / Marketing
- Operations Manager / Deal Analyst

---

## 15. Risk Factors

Prospective participants in the BrixUp platform and holders of the $BRXU token should carefully consider the following risk factors:

**Market Risk:** Real estate markets are cyclical and subject to downturns. Property values may decline, construction costs may increase, and deal returns may underperform projections. BrixUp does not guarantee returns on any deal and past performance of similar deals is not indicative of future results.

**Regulatory Risk:** The regulatory environment for digital assets and tokenized securities is evolving rapidly. Changes in federal or state law may affect the legality, tax treatment, or operational requirements of $BRXU tokens, deal participation tokens, or the BrixUp platform. BrixUp may be required to modify its business model, restrict access to certain jurisdictions, or cease operations in response to regulatory changes.

**Smart Contract Risk:** Despite rigorous testing and external auditing, smart contracts may contain bugs, vulnerabilities, or logic errors that could result in loss of funds. The immutable nature of blockchain transactions means that errors cannot always be reversed. BrixUp mitigates this risk through multi-sig controls, emergency pause functionality, and bug bounty programs, but cannot guarantee zero-defect smart contract performance.

**Construction Risk:** Real estate construction projects are inherently risky. Deals may experience cost overruns, timeline delays, permitting issues, labor shortages, material price increases, weather delays, or total project failure. BrixUp's Brix Box structure isolates each deal from others, but investors in any individual deal may experience partial or total loss of capital.

**Liquidity Risk:** $BRXU tokens and deal participation tokens may have limited liquidity, particularly during the early stages of platform operation. There is no guarantee that a secondary market will develop, and token holders may be unable to sell their tokens at their desired price or at all.

**Counterparty Risk:** Despite KYC verification and reputation scoring, participants on the platform may fail to fulfill their obligations. Builders may abandon projects, dealmakers may provide inaccurate projections, and investors may fail to meet capital calls. BrixUp provides dispute resolution mechanisms but cannot guarantee participant performance.

**Technology Risk:** The platform depends on third-party infrastructure including Base L2, Ethereum mainnet, Supabase, Persona, and Circle. Outages, security breaches, or discontinuation of these services could affect platform operations.

---

## 16. Conclusion

BrixUp sits at the intersection of three powerful forces reshaping the American economy: the tokenization of real-world assets, the critical shortage of construction labor, and the democratization of real estate investing through crowdfunding technology. By building the first platform that unites these forces under a single smart contract framework, BrixUp creates a marketplace where every participant in the real estate development value chain — from the investor contributing $100 to the framing contractor committing 320 hours of labor — can participate transparently, equitably, and profitably.

The $BRXU token is the connective tissue of this marketplace, aligning incentives across all participant types through staking, governance, reputation, and fee mechanics that reward long-term commitment and quality execution. The Brix Box smart contract is the trust layer, replacing handshake deals, paper draws, and opaque profit sharing with auditable, enforceable, and automated financial logic.

BrixUp is not building technology for technology's sake. We are building the platform that Miguel Perez wished existed when he was a young contractor waiting 90 days for payment on a project that made the developer $200,000 in profit. We are building the marketplace that every wholesaler wishes existed when they assign a $300,000 deal for a $10,000 fee while someone else captures $80,000 in renovation profit. We are building the investment platform that every retail investor wishes existed when they want to put $1,000 into a real deal in a real neighborhood built by a real contractor — not another REIT share in a faceless institutional portfolio.

The tools exist. The market is ready. The builders are waiting. It is time to stack $BRXU.

**Join us at [brixups.com](https://brixups.com)**

---

## 17. References

1. U.S. Census Bureau. "Annual Value of Construction Put in Place." 2025. [census.gov](https://www.census.gov/construction/c30/c30index.html)

2. ATTOM Data Solutions. "U.S. Home Flipping Report." 2025. [attomdata.com](https://www.attomdata.com)

3. National Association of Home Builders. "Construction Labor Market Report." 2025. [nahb.org](https://www.nahb.org)

4. Associated Builders and Contractors. "Construction Workforce Shortage." 2025. [abc.org](https://www.abc.org)

5. Mordor Intelligence. "Real Estate Crowdfunding Market — Growth, Trends, and Forecast." 2025-2030. [mordorintelligence.com](https://www.mordorintelligence.com)

6. Boston Consulting Group. "Relevance of On-Chain Asset Tokenization in Crypto Winter." 2023. [bcg.com](https://www.bcg.com)

7. Grand View Research. "Tokenized Assets Market Size Report." 2024-2030. [grandviewresearch.com](https://www.grandviewresearch.com)

8. U.S. Bureau of Labor Statistics. "Industries at a Glance: Construction." 2025. [bls.gov](https://www.bls.gov/iag/tgs/iag23.htm)

9. Fundrise. "Annual Report and Platform Statistics." 2025. [fundrise.com](https://www.fundrise.com)

10. National Mechanics Lien Law. "Construction Payment Statistics." American Subcontractors Association. 2024. [asaonline.com](https://www.asaonline.com)

11. U.S. Securities and Exchange Commission. "Regulation D, Regulation CF, and Regulation A+ Frameworks." [sec.gov](https://www.sec.gov)

12. Coinbase. "Base L2: An Ethereum Layer 2 Network." 2024. [base.org](https://www.base.org)

---

**Disclaimer:** This whitepaper is provided for informational purposes only and does not constitute an offer to sell or a solicitation of an offer to buy any securities, tokens, or other financial instruments. The $BRXU token is a utility token designed for use within the BrixUp platform. Participation in the BrixUp platform and acquisition of $BRXU tokens involves significant risk. Prospective participants should consult their own legal, financial, and tax advisors before engaging with the platform. BrixUp Technologies LLC makes no guarantees regarding token value, platform performance, or deal returns.

**Copyright 2026 BrixUp Technologies LLC. All rights reserved.**
