# BrixUp Deployment Guide

## Domain: brixups.com
## Hosting: Vercel
## Blockchain: Base L2 (Ethereum)

---

## Part 1: Deploy to Vercel

### Step 1 — Create Vercel Account & Import Project

1. Go to [vercel.com](https://vercel.com) and sign up (use GitHub login)
2. Click **"Add New Project"**
3. Import your GitHub repository: `m4generalcontractors/BrixUp`
4. Configure the project:
   - **Framework Preset:** Next.js
   - **Root Directory:** `web` (click "Edit" and type `web`)
   - **Build Command:** `npm run build` (default)
   - **Output Directory:** `.next` (default)
5. Click **Deploy**

### Step 2 — Set Environment Variables

In Vercel Dashboard → Settings → Environment Variables, add:

| Variable | Value | Environment |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | All |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key | All |
| `NEXT_PUBLIC_APP_URL` | `https://brixups.com` | Production |
| `NEXT_PUBLIC_APP_URL` | `https://staging.brixups.com` | Preview |
| `NEXT_PUBLIC_BRIX_TOKEN_ADDRESS` | Deployed contract address | All |
| `NEXT_PUBLIC_BRIX_FACTORY_ADDRESS` | Deployed contract address | All |
| `NEXT_PUBLIC_BRIX_STAKING_ADDRESS` | Deployed contract address | All |
| `NEXT_PUBLIC_CHAIN_ID` | `8453` (Base mainnet) | Production |
| `NEXT_PUBLIC_CHAIN_ID` | `84532` (Base Sepolia) | Preview |
| `NEXT_PUBLIC_COINBASE_APP_ID` | From Coinbase Developer Portal | All |
| `NEXT_PUBLIC_PERSONA_TEMPLATE_ID` | From Persona dashboard | All |

### Step 3 — Configure Domain in Vercel

1. Go to Vercel Dashboard → Your Project → **Settings** → **Domains**
2. Add domain: `brixups.com`
3. Also add: `www.brixups.com`
4. Vercel will show you the DNS records you need to configure (see Part 2)

---

## Part 2: Configure GoDaddy DNS for brixups.com

### Login to GoDaddy

1. Go to [godaddy.com](https://godaddy.com) → Sign In
2. Go to **My Products** → Find `brixups.com` → **DNS** (or **Manage DNS**)

### Delete Existing Records (if any)

Remove any default parking page records. Keep the NS (nameserver) records.

### Add These DNS Records

#### Option A: Use Vercel's Nameservers (Recommended)

This gives Vercel full DNS control — simplest setup:

1. In GoDaddy → Domain Settings → **Nameservers** → Click **Change**
2. Select **"I'll use my own nameservers"**
3. Enter Vercel's nameservers:
   ```
   ns1.vercel-dns.com
   ns2.vercel-dns.com
   ```
4. Save. Propagation takes 24-48 hours.
5. After propagation, manage all DNS from Vercel Dashboard → Domains.

#### Option B: Keep GoDaddy Nameservers (Add Records Manually)

If you want to keep GoDaddy managing DNS:

| Type | Name | Value | TTL |
|------|------|-------|-----|
| **A** | `@` | `76.76.21.21` | 600 |
| **CNAME** | `www` | `cname.vercel-dns.com` | 600 |

**Steps:**

1. In GoDaddy DNS Management, click **Add Record**
2. **A Record:**
   - Type: `A`
   - Name: `@`
   - Value: `76.76.21.21`
   - TTL: 600 seconds
   - Click **Save**
3. **CNAME Record:**
   - Type: `CNAME`
   - Name: `www`
   - Value: `cname.vercel-dns.com`
   - TTL: 600 seconds
   - Click **Save**

### Verify in Vercel

1. Go back to Vercel → Settings → Domains
2. Wait for DNS propagation (usually 5-30 minutes, up to 48 hours)
3. Vercel will show a green checkmark when the domain is verified
4. SSL certificate is auto-provisioned by Vercel (free, via Let's Encrypt)

### Email DNS Records (Optional — for miguel@brixups.com)

If using Google Workspace or another email provider, add MX records:

**Google Workspace MX Records:**

| Type | Name | Value | Priority | TTL |
|------|------|-------|----------|-----|
| MX | `@` | `aspmx.l.google.com` | 1 | 3600 |
| MX | `@` | `alt1.aspmx.l.google.com` | 5 | 3600 |
| MX | `@` | `alt2.aspmx.l.google.com` | 5 | 3600 |
| MX | `@` | `alt3.aspmx.l.google.com` | 10 | 3600 |
| MX | `@` | `alt4.aspmx.l.google.com` | 10 | 3600 |
| TXT | `@` | `v=spf1 include:_spf.google.com ~all` | - | 3600 |

---

## Part 3: Deploy Smart Contracts to Base

### Prerequisites

1. Install dependencies: `cd contracts && npm install`
2. Create `.env` from `.env.example`:
   ```bash
   cp .env.example .env
   ```
3. Fill in `.env`:
   ```
   BASE_SEPOLIA_RPC_URL=https://sepolia.base.org
   BASE_MAINNET_RPC_URL=https://mainnet.base.org
   PRIVATE_KEY=your_deployer_wallet_private_key
   BASESCAN_API_KEY=your_basescan_api_key
   INITIAL_OWNER=0xYourWalletAddress
   ```

### Get a Deployer Wallet

1. Create a new wallet in MetaMask or Coinbase Wallet
2. **Export the private key** (Settings → Security → Export Private Key)
3. Paste it into `.env` as `PRIVATE_KEY`
4. **Fund it with ETH on Base:**
   - Testnet: Get free ETH from [Base Sepolia Faucet](https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet)
   - Mainnet: Bridge ETH to Base via [bridge.base.org](https://bridge.base.org) (need ~0.01 ETH for deployment gas)

### Deploy to Testnet First

```bash
cd contracts
npx hardhat run scripts/deploy.ts --network baseSepolia
```

This will output:
```
BrixToken deployed to: 0x...
BrixFactory deployed to: 0x...
BrixStaking deployed to: 0x...
```

**Save these addresses!** You'll need them for the web app env variables.

### Verify Contracts on Basescan

```bash
npx hardhat verify --network baseSepolia <BrixToken_ADDRESS>
npx hardhat verify --network baseSepolia <BrixFactory_ADDRESS> <BrixToken_ADDRESS>
npx hardhat verify --network baseSepolia <BrixStaking_ADDRESS> <BrixToken_ADDRESS>
```

### Deploy to Mainnet (When Ready)

```bash
npx hardhat run scripts/deploy.ts --network base
```

Same verification process with `--network base`.

### Token Management Keys

After deployment, the deployer wallet (`PRIVATE_KEY` owner) has these admin capabilities:

| Action | Contract | Function |
|--------|----------|----------|
| Mint new $BRIX | BrixToken | `mint(address to, uint256 amount)` |
| Pause/unpause token | BrixToken | `pause()` / `unpause()` |
| Burn tokens | BrixToken | `burn(uint256 amount)` |
| Create new deals | BrixFactory | `createDeal(...)` |
| Update platform fee | BrixFactory | `setPlatformFee(uint256)` |
| Approve draw releases | BrixDeal | `approveDraw(uint256 milestone)` |
| Complete deals | BrixDeal | `completeDeal(uint256 totalProfit)` |
| Distribute staking rewards | BrixStaking | `distributeRewards(uint256 amount)` |

**CRITICAL: Keep the deployer private key secure. Consider using a hardware wallet (Ledger) for mainnet deployment.**

---

## Part 3b: Configure Google OAuth (Login with Google)

### Step 1 — Create Google OAuth Client

1. Go to [Google Cloud Console](https://console.cloud.google.com) → APIs & Services → Credentials
2. Click **Create Credentials** → **OAuth client ID**
3. Application type: **Web application**
4. Name: `BrixUp`
5. **Authorized JavaScript origins:**
   - `https://brixups.com`
   - `http://localhost:3000` (for local development)
6. **Authorized redirect URIs:**
   - `https://dxvdnyqnnttofpvjcjzy.supabase.co/auth/v1/callback`
7. Click **Create** and save the **Client ID** and **Client Secret**

### Step 2 — Enable Google Provider in Supabase

1. Go to [Supabase Dashboard](https://supabase.com/dashboard) → your project
2. Navigate to **Authentication** → **Providers** → **Google**
3. Toggle **Enable Google provider** ON
4. Paste your **Client ID** and **Client Secret** from Step 1
5. Click **Save**

### How It Works

```
User clicks "Continue with Google"
  → Supabase redirects to Google
  → Google authenticates the user
  → Google redirects to: https://<project-ref>.supabase.co/auth/v1/callback
  → Supabase exchanges code for session
  → Supabase redirects to: https://brixups.com/api/auth/callback
  → App creates session and redirects to /dashboard
```

---

## Part 4: Set Up Supabase Backend

### Create Supabase Project

1. Go to [supabase.com](https://supabase.com) → New Project
2. Name: `brixup-production`
3. Region: US East (closest to your users)
4. Generate and save the database password

### Get API Keys

1. Go to Settings → API
2. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role key** → `SUPABASE_SERVICE_ROLE_KEY` (server-side only)

### Database Schema

Run this SQL in Supabase SQL Editor:

```sql
-- Users
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  full_name TEXT,
  email TEXT UNIQUE,
  phone TEXT,
  role TEXT CHECK (role IN ('investor', 'builder', 'dealfinder', 'admin')),
  brix_score INTEGER DEFAULT 0,
  wallet_address TEXT,
  kyc_status TEXT DEFAULT 'pending' CHECK (kyc_status IN ('pending', 'verified', 'rejected')),
  language TEXT DEFAULT 'en' CHECK (language IN ('en', 'es')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Deals
CREATE TABLE deals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  zip TEXT,
  property_type TEXT CHECK (property_type IN ('Flip', 'New Build', 'Value-Add', 'Wholesale', 'Land')),
  status TEXT DEFAULT 'Open' CHECK (status IN ('Open', 'Funding', 'Funded', 'Active', 'Completed', 'Cancelled')),
  source TEXT DEFAULT 'BrixUp',
  asking_price NUMERIC,
  rehab_budget NUMERIC,
  arv NUMERIC,
  total_capital_needed NUMERIC,
  funded_amount NUMERIC DEFAULT 0,
  projected_roi NUMERIC,
  projected_timeline TEXT,
  investor_interest_rate NUMERIC,
  beds INTEGER,
  baths NUMERIC,
  sqft INTEGER,
  year_built INTEGER,
  lot_size TEXT,
  description TEXT,
  dealmaker_id UUID REFERENCES profiles(id),
  gc_id UUID REFERENCES profiles(id),
  contract_address TEXT,
  min_investment NUMERIC DEFAULT 500,
  funding_deadline DATE,
  est_completion DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Investments
CREATE TABLE investments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id UUID REFERENCES deals(id),
  investor_id UUID REFERENCES profiles(id),
  amount NUMERIC NOT NULL,
  tx_hash TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'returned')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Draw Schedule
CREATE TABLE draw_schedule (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id UUID REFERENCES deals(id),
  milestone TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  status TEXT DEFAULT 'Pending' CHECK (status IN ('Pending', 'Requested', 'Approved', 'Completed')),
  due_date DATE,
  approved_at TIMESTAMPTZ,
  tx_hash TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Contractor Commitments (Sweat Equity)
CREATE TABLE contractor_commitments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id UUID REFERENCES deals(id),
  contractor_id UUID REFERENCES profiles(id),
  trade TEXT NOT NULL,
  brix_rate NUMERIC NOT NULL,
  timeline TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'completed', 'cancelled')),
  profit_share_pct NUMERIC,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Transactions
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  type TEXT CHECK (type IN ('investment', 'return', 'payment', 'reward', 'conversion', 'stake', 'unstake')),
  amount NUMERIC NOT NULL,
  token TEXT DEFAULT 'BRIX' CHECK (token IN ('BRIX', 'USDC')),
  description TEXT,
  tx_hash TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE investments ENABLE ROW LEVEL SECURITY;
ALTER TABLE draw_schedule ENABLE ROW LEVEL SECURITY;
ALTER TABLE contractor_commitments ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can read own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Anyone can read deals" ON deals FOR SELECT TO authenticated USING (true);
CREATE POLICY "Dealfinders can insert deals" ON deals FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Users can read own investments" ON investments FOR SELECT USING (auth.uid() = investor_id);
CREATE POLICY "Users can read own transactions" ON transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Anyone can read draw schedule" ON draw_schedule FOR SELECT TO authenticated USING (true);
CREATE POLICY "Anyone can read contractor commitments" ON contractor_commitments FOR SELECT TO authenticated USING (true);
```

---

## Part 5: Deployment Checklist

### Pre-Launch

- [ ] Deploy smart contracts to Base Sepolia testnet
- [ ] Verify contracts on Basescan
- [ ] Set up Supabase project and run schema
- [ ] Deploy web app to Vercel
- [ ] Configure GoDaddy DNS → Vercel
- [ ] Verify SSL certificate is active on brixups.com
- [ ] Set all environment variables in Vercel
- [ ] Test all pages load correctly
- [ ] Test wallet connection flow
- [ ] Set up Google Workspace for miguel@brixups.com
- [ ] Set up Persona KYC template
- [ ] Internal QA: test investor, builder, and deal finder flows

### Launch Day

- [ ] Deploy smart contracts to Base mainnet
- [ ] Update contract addresses in Vercel env vars
- [ ] Mint initial $BRIX supply to treasury wallet
- [ ] Seed liquidity pool ($BRIX/USDC)
- [ ] Verify all mainnet contracts on Basescan
- [ ] Announce on social media
- [ ] Send waitlist email blast
- [ ] Monitor for errors in Vercel logs

### Post-Launch

- [ ] Set up Sentry for error tracking
- [ ] Configure Vercel Analytics
- [ ] Set up OpenZeppelin Defender for contract monitoring
- [ ] Schedule weekly backup of Supabase database
- [ ] Begin contractor onboarding campaign

---

## Quick Reference

| Service | URL |
|---------|-----|
| Live Site | https://brixups.com |
| Vercel Dashboard | https://vercel.com/dashboard |
| Supabase Dashboard | https://supabase.com/dashboard |
| Basescan (Mainnet) | https://basescan.org |
| Basescan (Testnet) | https://sepolia.basescan.org |
| GoDaddy DNS | https://dcc.godaddy.com/manage/brixups.com/dns |
| Coinbase Developer | https://www.coinbase.com/developer-platform |
| Persona KYC | https://withpersona.com/dashboard |
