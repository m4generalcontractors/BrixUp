# $BRXU Token Launch Checklist

## Pre-Deployment

- [ ] Final code review of BRXU.sol, BRXUStaking.sol, BRXUVesting.sol
- [ ] All 58 Hardhat tests passing (`npm test`)
- [ ] Gas optimization review (enable `REPORT_GAS=true`)
- [ ] Security audit (Slither, Mythril, or professional audit)
- [ ] Confirm wallet addresses for all allocations:
  - [ ] Treasury wallet (receives 40% = 400M BRXU)
  - [ ] Community rewards wallet (20% = 200M BRXU)
  - [ ] Team vesting wallet (15% = 150M BRXU)
  - [ ] Liquidity wallet (10% = 100M BRXU)
  - [ ] Marketing wallet (10% = 100M BRXU)
  - [ ] Pre-sale wallet (5% = 50M BRXU)
- [ ] Fund deployer wallet with ETH on Base (~0.01 ETH should suffice)
- [ ] Set up `.env` file with all required variables:
  ```
  DEPLOYER_PRIVATE_KEY=
  BASE_MAINNET_RPC_URL=https://mainnet.base.org
  BASESCAN_API_KEY=
  TREASURY_WALLET=
  REWARDS_WALLET=
  TEAM_VESTING_WALLET=
  LIQUIDITY_WALLET=
  MARKETING_WALLET=
  PRESALE_WALLET=
  ```

## Deployment (Base Mainnet)

- [ ] Deploy contracts: `npm run deploy:brxu:mainnet`
- [ ] Verify deployment output — check all 3 addresses logged
- [ ] Confirm allocation balances on BaseScan:
  - Treasury: 400,000,000 BRXU
  - Rewards: 200,000,000 BRXU
  - Vesting: 150,000,000 BRXU
  - Liquidity: 100,000,000 BRXU
  - Marketing: 100,000,000 BRXU
  - Pre-sale: 50,000,000 BRXU
- [ ] Verify staking and vesting contracts are fee-exempt

## Contract Verification

- [ ] Verify contracts on BaseScan: `npm run verify:brxu`
- [ ] Confirm all 3 contracts show "Verified" on BaseScan
- [ ] Check contract source code is visible and matches

## Post-Deployment Setup

- [ ] Fund staking rewards from rewards wallet:
  - Transfer 25M BRXU to deployer/owner
  - Approve 25M to BRXUStaking contract
  - Call `fundRewards(25M, 365 days)` for 12.5% APY
- [ ] Create team vesting schedules via BRXUVesting:
  - Approve tokens to vesting contract
  - Call `createDefaultVesting(beneficiary, amount)` for each team member
- [ ] Disable anti-bot after 24 hours (optional): `disableAntiBot()`

## Liquidity Setup

- [ ] Ensure liquidity wallet has BRXU + USDC
- [ ] Run liquidity script: `npm run setup:liquidity`
- [ ] Verify BRXU/USDC pool on Uniswap v3 (Base)
- [ ] Confirm initial price: $0.01 per BRXU
- [ ] Test small swap on Uniswap to verify pool works

## Frontend Integration

- [ ] Update `web/.env.local` with contract addresses:
  ```
  NEXT_PUBLIC_CHAIN_ID=8453
  NEXT_PUBLIC_BRXU_TOKEN_ADDRESS=0x...
  NEXT_PUBLIC_BRXU_STAKING_ADDRESS=0x...
  NEXT_PUBLIC_BRXU_FACTORY_ADDRESS=0x...
  NEXT_PUBLIC_BRXU_VESTING_ADDRESS=0x...
  ```
- [ ] Rebuild and redeploy frontend
- [ ] Test wallet connection on mainnet
- [ ] Test staking flow end-to-end
- [ ] Test investment flow end-to-end

## Exchange Listings

- [ ] Prepare listing materials (see `cmc-listing/`)
- [ ] Create 200x200 PNG logo for listings
- [ ] Submit CoinMarketCap application
- [ ] Submit CoinGecko application
- [ ] Implement circulating supply API endpoint
- [ ] Set up price tracking on DexScreener/DEXTools

## Marketing & Community

- [ ] Announce token launch on social media
- [ ] Update website with contract addresses
- [ ] Publish tokenomics documentation
- [ ] Enable staking dashboard for users
- [ ] Begin community rewards distribution

## Security Monitoring

- [ ] Monitor for unusual transfer patterns (anti-bot active for 24h)
- [ ] Set up alerts for large transfers
- [ ] Monitor staking pool health
- [ ] Verify fee collection in treasury
- [ ] Plan for ownership transfer to multisig (post-launch)

---

**Contract Addresses (update after deployment):**

| Contract | Address |
|---|---|
| BRXU Token | `TBD` |
| BRXUStaking | `TBD` |
| BRXUVesting | `TBD` |
| Uniswap Pool | `TBD` |

**Deployment saved to:** `deployments/brxu-base-latest.json`
