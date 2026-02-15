# BrixUp Token ($BRXU) — Exchange Listing Guide

## Token Overview

| Field | Value |
|---|---|
| **Name** | BrixUp Token |
| **Symbol** | BRXU |
| **Decimals** | 18 |
| **Total Supply** | 1,000,000,000 |
| **Chain** | Base (Chain ID 8453) |
| **Standard** | ERC-20 |
| **Transfer Fee** | 0.5% (to treasury) |
| **Contract** | _Update after deployment_ |

## Token Allocation

| Allocation | % | Amount | Vesting |
|---|---|---|---|
| Platform Treasury | 40% | 400M | None |
| Community Rewards | 20% | 200M | Distributed via staking |
| Team & Advisors | 15% | 150M | 6-month cliff, 24-month linear |
| Liquidity Pool | 10% | 100M | Paired with USDC on Uniswap v3 |
| Marketing | 10% | 100M | None |
| Pre-sale | 5% | 50M | None |

## Smart Contracts

### 1. BRXU (ERC-20 Token)
- 0.5% transfer fee sent to treasury (configurable, max 2%)
- Anti-bot: 10M token max transfer for first 24h
- Fee-exempt addresses for treasury, staking, vesting
- Burn function available to all holders
- Pausable by owner for emergencies

### 2. BRXUStaking
- 12.5% APY target (funded by community rewards pool)
- No lock period — instant stake/unstake
- Synthetix reward-per-token model
- Owner funds rewards periodically

### 3. BRXUVesting
- Team & advisor token vesting
- 6-month cliff, 24-month linear vesting
- Revocable by owner (unvested tokens returned)

## CoinMarketCap Application Checklist

- [ ] Deploy contracts to Base mainnet
- [ ] Verify all contracts on BaseScan
- [ ] Setup Uniswap v3 BRXU/USDC pool
- [ ] Ensure active trading volume
- [ ] Submit application at https://coinmarketcap.com/request/
- [ ] Provide: contract address, logo, description, social links
- [ ] Supply circulating supply API endpoint

## CoinGecko Application Checklist

- [ ] Verified contract on BaseScan
- [ ] Active DEX trading pair (Uniswap v3)
- [ ] Submit at https://www.coingecko.com/en/request
- [ ] Provide project logo (200x200 PNG minimum)
- [ ] Include documentation and social media links

## Required Assets

1. **Logo**: 200x200 PNG with transparent background
2. **Website**: https://brixup.io
3. **Whitepaper**: https://brixup.io/whitepaper
4. **Source Code**: https://github.com/m4generalcontractors/BrixUp
5. **Social Media**:
   - Twitter: https://twitter.com/BrixUpToken
   - Telegram: https://t.me/BrixUpCommunity
   - Discord: https://discord.gg/brixup

## Circulating Supply API

After deployment, implement an API endpoint at:
```
GET https://brixup.io/api/circulating-supply
```
Returns plain text number of circulating tokens (total supply minus treasury, vesting, and staking contract balances).
