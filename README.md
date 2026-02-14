# BrixUp

**Stack Brix. Build Wealth. Together.**

BrixUp is a tokenized real-estate development marketplace powered by the $BRIX utility token on the Base network. It connects investors, builders, and deal-makers through smart-contract-managed escrow deals with milestone-based draw schedules and transparent profit distribution.

---

## Architecture

```
                          brixups.com
                              |
                        +-----+-----+
                        |  Vercel   |
                        |  Next.js  |
                        +-----+-----+
                              |
              +---------------+---------------+
              |                               |
        +-----+-----+                 +-------+-------+
        |  Supabase |                 |  Base Network  |
        |  (Auth,   |                 |  (L2 on ETH)   |
        |   DB,     |                 |                 |
        |   Storage)|                 |  BrixToken      |
        +-----+-----+                 |  BrixFactory    |
              |                       |  BrixDeal(s)    |
              |                       |  BrixStaking    |
        +-----+-----+                 +-------+-------+
        |  Persona  |                         |
        |  (KYC)    |                 +-------+-------+
        +-----------+                 | Coinbase      |
                                      | Smart Wallet  |
        +-----------+                 +---------------+
        |  Circle   |
        |  (USDC)   |
        +-----------+
```

---

## Tech Stack

| Layer          | Technology                                                     |
| -------------- | -------------------------------------------------------------- |
| Frontend       | Next.js 16, React 19, Tailwind CSS 4, TypeScript              |
| Backend / BaaS | Supabase (Auth, PostgreSQL, Storage, Realtime)                 |
| Blockchain     | Base (L2), Solidity 0.8.24, Hardhat, OpenZeppelin 5            |
| Wallet         | Coinbase Smart Wallet                                          |
| Payments       | Circle (USDC on-ramp)                                          |
| KYC            | Persona identity verification                                  |
| CI/CD          | GitHub Actions, Vercel                                         |
| Containerized  | Docker Compose (local dev)                                     |

---

## Quick Start

### Prerequisites

- **Node.js** >= 20
- **npm** >= 10
- **Git**
- **Docker** (optional, for local services)

### 1. Clone the repository

```bash
git clone https://github.com/your-org/BrixUp.git
cd BrixUp
```

### 2. Install dependencies

```bash
# Root workspace install (covers web/ and contracts/)
npm install
```

### 3. Set up environment variables

```bash
# Web app
cp web/.env.example web/.env.local

# Smart contracts
cp contracts/.env.example contracts/.env
```

Edit each file and fill in the required values. See the [Environment Variables](#environment-variables) section for details.

### 4. Run the development server

```bash
# Start the Next.js dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Compile and test smart contracts

```bash
# Compile Solidity contracts
npm run contracts:compile

# Run the test suite
npm run contracts:test
```

### 6. Local services with Docker (optional)

```bash
# Start PostgreSQL and Hardhat node
docker compose up -d

# Start the full stack (includes web app and Redis)
docker compose --profile full up -d
```

---

## Project Structure

```
BrixUp/
├── .github/
│   └── workflows/
│       ├── ci.yml              # Main CI/CD pipeline
│       └── contracts.yml       # Smart contract CI (compile, test, coverage, Slither)
├── brand/
│   └── brand-guidelines.md     # Brand identity, colors, typography, voice
├── contracts/
│   ├── contracts/
│   │   ├── BrixToken.sol       # ERC-20 $BRIX utility token
│   │   ├── BrixFactory.sol     # Factory for deploying BrixDeal instances
│   │   ├── BrixDeal.sol        # Per-deal escrow with milestone draws
│   │   └── BrixStaking.sol     # Stake $BRIX for yield and priority access
│   ├── scripts/
│   │   └── deploy.ts           # Hardhat deployment script
│   ├── test/                   # Contract test suite
│   ├── hardhat.config.ts       # Hardhat configuration
│   └── package.json
├── web/
│   ├── src/
│   │   ├── app/                # Next.js App Router pages and layouts
│   │   ├── components/         # React components
│   │   └── lib/                # Utilities, design tokens, helpers
│   ├── public/                 # Static assets
│   ├── next.config.ts          # Next.js configuration
│   ├── vercel.json             # Vercel deployment settings
│   └── package.json
├── docker-compose.yml          # Local development services
├── package.json                # Root workspace configuration
└── README.md
```

---

## Smart Contracts

All contracts target **Solidity 0.8.24** with the IR optimizer enabled (200 runs). They are built on OpenZeppelin v5 libraries and deploy to the **Base** network (L2).

| Contract        | Description                                                                                 |
| --------------- | ------------------------------------------------------------------------------------------- |
| **BrixToken**   | ERC-20 utility token with 1B initial supply, owner minting, burning, and pausable transfers |
| **BrixFactory** | Deploys and tracks BrixDeal escrow contracts with configurable platform fees                |
| **BrixDeal**    | Per-deal escrow: investor deposits, milestone draws, profit distribution (4-way split)      |
| **BrixStaking** | Share-based staking pool with 7-day lock, reward distribution, and priority deal access     |

### Deployment

```bash
# Deploy to Base Sepolia testnet
npm run contracts:deploy:testnet

# Deploy to Base mainnet
npm run contracts:deploy:mainnet
```

The deployment script deploys all three core contracts in order, verifies them on Basescan, and saves the deployed addresses to `contracts/deployments/`.

---

## Environment Variables

### Web App (`web/.env.local`)

| Variable                              | Required | Description                                  |
| ------------------------------------- | -------- | -------------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`            | Yes      | Supabase project URL                         |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY`       | Yes      | Supabase anonymous key (client-safe)         |
| `SUPABASE_SERVICE_ROLE_KEY`           | Yes      | Supabase service role key (server-only)      |
| `NEXT_PUBLIC_COINBASE_APP_ID`         | Yes      | Coinbase Developer Platform app ID           |
| `NEXT_PUBLIC_CHAIN_ID`                | Yes      | Target chain (8453 = Base, 84532 = Sepolia)  |
| `NEXT_PUBLIC_BRIX_TOKEN_ADDRESS`      | Yes      | Deployed BrixToken contract address          |
| `NEXT_PUBLIC_BRIX_FACTORY_ADDRESS`    | Yes      | Deployed BrixFactory contract address        |
| `NEXT_PUBLIC_BRIX_STAKING_ADDRESS`    | Yes      | Deployed BrixStaking contract address        |
| `CIRCLE_API_KEY`                      | No       | Circle API key for USDC payments             |
| `NEXT_PUBLIC_PERSONA_TEMPLATE_ID`     | No       | Persona KYC template ID                      |
| `NEXT_PUBLIC_APP_URL`                 | Yes      | Public URL (https://brixups.com)             |

### Smart Contracts (`contracts/.env`)

| Variable               | Required | Description                             |
| ---------------------- | -------- | --------------------------------------- |
| `DEPLOYER_PRIVATE_KEY` | Yes      | Deployer wallet private key             |
| `BASE_SEPOLIA_RPC_URL` | No       | Base Sepolia RPC (defaults provided)    |
| `BASE_MAINNET_RPC_URL` | No       | Base Mainnet RPC (defaults provided)    |
| `BASESCAN_API_KEY`     | Yes      | Basescan API key for verification       |
| `INITIAL_OWNER`        | No       | Contract owner (defaults to deployer)   |
| `PLATFORM_WALLET`      | No       | Platform fee recipient                  |
| `PLATFORM_FEE_BPS`     | No       | Platform fee basis points (default 500) |

---

## Deployment

### Web App (Vercel)

The web app deploys automatically via GitHub Actions:

- **Pull requests** trigger a preview deployment.
- **Pushes to `main`** trigger a production deployment to [brixups.com](https://brixups.com).

**Required GitHub Secrets:**

| Secret               | Description              |
| -------------------- | ------------------------ |
| `VERCEL_TOKEN`       | Vercel API token         |
| `VERCEL_ORG_ID`      | Vercel organization ID   |
| `VERCEL_PROJECT_ID`  | Vercel project ID        |

### Smart Contracts (Hardhat)

Contracts are deployed manually using the Hardhat deployment script. See the [Smart Contracts](#smart-contracts) section above.

---

## Contributing

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/your-feature`.
3. Make your changes and ensure all tests pass.
4. Commit with a clear message following [Conventional Commits](https://www.conventionalcommits.org/).
5. Open a pull request against `main`.

### Development Guidelines

- Run `npm run lint` in `web/` before committing frontend changes.
- Run `npx hardhat test` in `contracts/` before committing contract changes.
- Keep PR scope focused -- one feature or fix per PR.
- Write tests for all new smart contract functionality.
- Follow the [brand guidelines](brand/brand-guidelines.md) for any UI changes.

---

## License

Proprietary. Copyright M4 Development Holdings / BrixUp Technologies. All rights reserved.

---

## Links

- **Website:** [https://brixups.com](https://brixups.com)
- **Brand Guidelines:** [brand/brand-guidelines.md](brand/brand-guidelines.md)
