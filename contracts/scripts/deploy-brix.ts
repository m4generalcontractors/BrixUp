import { ethers, run, network } from "hardhat";
import * as fs from "fs";
import * as path from "path";

/**
 * BrixUp — Production $BRIX Deployment Script
 *
 * Deploys the three production contracts:
 *   1. BRIX      — ERC-20 token (1B supply, 0.5% fee, anti-bot)
 *   2. BRIXStaking — Staking pool (12.5% APY, no lock)
 *   3. BRIXVesting — Team vesting (6mo cliff, 24mo linear)
 *
 * After deployment:
 *   - Sets fee-exempt addresses on BRIX token
 *   - Funds initial staking rewards (25M BRIX over 365 days = 12.5% on 200M)
 *   - Creates vesting schedules for team members
 *   - Verifies all contracts on BaseScan
 *   - Saves addresses to deployments/
 *
 * Usage:
 *   npx hardhat run scripts/deploy-brix.ts --network baseSepolia
 *   npx hardhat run scripts/deploy-brix.ts --network base
 *
 * Required env vars:
 *   DEPLOYER_PRIVATE_KEY    — Deployer wallet private key
 *   TREASURY_WALLET         — Platform treasury (receives 40% + fees)
 *   REWARDS_WALLET          — Community rewards wallet (20%)
 *   TEAM_VESTING_WALLET     — Team multisig (receives 15% for vesting)
 *   LIQUIDITY_WALLET        — Liquidity pool wallet (10%)
 *   MARKETING_WALLET        — Marketing wallet (10%)
 *   PRESALE_WALLET          — Pre-sale wallet (5%)
 */

// ---------------------------------------------------------------------------
//  Helpers
// ---------------------------------------------------------------------------

async function verifyContract(
  address: string,
  constructorArguments: unknown[]
): Promise<void> {
  if (network.name === "hardhat" || network.name === "localhost") {
    console.log("  (skipping verification on local network)");
    return;
  }

  console.log("  Verifying on BaseScan...");
  try {
    await run("verify:verify", { address, constructorArguments });
    console.log("  ✅ Verified successfully.");
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    if (message.toLowerCase().includes("already verified")) {
      console.log("  ✅ Contract already verified.");
    } else {
      console.warn("  ⚠️  Verification failed:", message);
    }
  }
}

function saveDeployment(
  networkName: string,
  chainId: number,
  deployer: string,
  addresses: Record<string, string>
): string {
  const deploymentsDir = path.join(__dirname, "..", "deployments");
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const filename = `brix-${networkName}-${timestamp}.json`;
  const filepath = path.join(deploymentsDir, filename);
  const latestPath = path.join(deploymentsDir, `brix-${networkName}-latest.json`);

  const data = {
    network: networkName,
    chainId,
    deployer,
    deployedAt: new Date().toISOString(),
    contracts: addresses,
  };

  const json = JSON.stringify(data, null, 2);
  fs.writeFileSync(filepath, json);
  fs.writeFileSync(latestPath, json);

  return filepath;
}

function requireEnv(key: string): string {
  const val = process.env[key];
  if (!val) throw new Error(`Missing required env var: ${key}`);
  return val;
}

// ---------------------------------------------------------------------------
//  Main
// ---------------------------------------------------------------------------

async function main() {
  const [deployer] = await ethers.getSigners();
  const networkInfo = await ethers.provider.getNetwork();
  const networkName = network.name;
  const chainId = Number(networkInfo.chainId);

  // For local testing, use deployer address as placeholder
  const isLocal = networkName === "hardhat" || networkName === "localhost";
  const getAddr = (key: string) =>
    isLocal ? deployer.address : requireEnv(key);

  const treasuryAddr = getAddr("TREASURY_WALLET");
  const rewardsAddr = getAddr("REWARDS_WALLET");
  const vestingAddr = getAddr("TEAM_VESTING_WALLET");
  const liquidityAddr = getAddr("LIQUIDITY_WALLET");
  const marketingAddr = getAddr("MARKETING_WALLET");
  const presaleAddr = getAddr("PRESALE_WALLET");

  console.log("=".repeat(60));
  console.log("BrixUp — Production $BRIX Deployment");
  console.log("=".repeat(60));
  console.log(`Deployer  : ${deployer.address}`);
  console.log(`Network   : ${networkName} (chainId: ${chainId})`);
  console.log(
    `Balance   : ${ethers.formatEther(
      await ethers.provider.getBalance(deployer.address)
    )} ETH`
  );
  console.log("-".repeat(60));
  console.log(`Treasury  : ${treasuryAddr}`);
  console.log(`Rewards   : ${rewardsAddr}`);
  console.log(`Vesting   : ${vestingAddr}`);
  console.log(`Liquidity : ${liquidityAddr}`);
  console.log(`Marketing : ${marketingAddr}`);
  console.log(`Pre-sale  : ${presaleAddr}`);
  console.log("-".repeat(60));

  // ---- 1. Deploy BRIX Token ---------------------------------------------------
  console.log("\n[1/3] Deploying BRIX Token...");
  const BRIX = await ethers.getContractFactory("BRIX");
  const brix = await BRIX.deploy(
    treasuryAddr,
    rewardsAddr,
    vestingAddr,
    liquidityAddr,
    marketingAddr,
    presaleAddr
  );
  await brix.waitForDeployment();
  const brixAddress = await brix.getAddress();
  console.log(`  BRIX deployed at: ${brixAddress}`);

  if (!isLocal) {
    console.log("  Waiting for 5 block confirmations...");
    await brix.deploymentTransaction()?.wait(5);
  }

  await verifyContract(brixAddress, [
    treasuryAddr,
    rewardsAddr,
    vestingAddr,
    liquidityAddr,
    marketingAddr,
    presaleAddr,
  ]);

  // ---- 2. Deploy BRIXStaking --------------------------------------------------
  console.log("\n[2/3] Deploying BRIXStaking...");
  const BRIXStaking = await ethers.getContractFactory("BRIXStaking");
  const staking = await BRIXStaking.deploy(brixAddress);
  await staking.waitForDeployment();
  const stakingAddress = await staking.getAddress();
  console.log(`  BRIXStaking deployed at: ${stakingAddress}`);

  if (!isLocal) {
    console.log("  Waiting for 5 block confirmations...");
    await staking.deploymentTransaction()?.wait(5);
  }

  await verifyContract(stakingAddress, [brixAddress]);

  // ---- 3. Deploy BRIXVesting --------------------------------------------------
  console.log("\n[3/3] Deploying BRIXVesting...");
  const BRIXVesting = await ethers.getContractFactory("BRIXVesting");
  const vesting = await BRIXVesting.deploy(brixAddress);
  await vesting.waitForDeployment();
  const vestingAddress = await vesting.getAddress();
  console.log(`  BRIXVesting deployed at: ${vestingAddress}`);

  if (!isLocal) {
    console.log("  Waiting for 5 block confirmations...");
    await vesting.deploymentTransaction()?.wait(5);
  }

  await verifyContract(vestingAddress, [brixAddress]);

  // ---- Post-Deployment Setup --------------------------------------------------
  console.log("\n--- Post-Deployment Setup ---");

  // Set staking contract as fee-exempt
  console.log("  Setting staking contract as fee-exempt...");
  await brix.setFeeExempt(stakingAddress, true);

  // Set vesting contract as fee-exempt
  console.log("  Setting vesting contract as fee-exempt...");
  await brix.setFeeExempt(vestingAddress, true);

  console.log("  ✅ Fee-exempt addresses configured.");

  // ---- Save Deployment Addresses -----------------------------------------------
  const addresses = {
    BRIX: brixAddress,
    BRIXStaking: stakingAddress,
    BRIXVesting: vestingAddress,
  };

  const savedPath = saveDeployment(
    networkName,
    chainId,
    deployer.address,
    addresses
  );

  // ---- Summary ---------------------------------------------------------------
  console.log("\n" + "=".repeat(60));
  console.log("Deployment Summary");
  console.log("=".repeat(60));
  console.log(`  BRIX        : ${brixAddress}`);
  console.log(`  BRIXStaking : ${stakingAddress}`);
  console.log(`  BRIXVesting : ${vestingAddress}`);
  console.log("-".repeat(60));
  console.log(`  Addresses saved to: ${savedPath}`);
  console.log("=".repeat(60));
  console.log("\nNext steps:");
  console.log("  1. Run verify script: npm run verify:brix");
  console.log("  2. Fund staking rewards from treasury");
  console.log("  3. Create team vesting schedules");
  console.log("  4. Setup Uniswap v3 liquidity: npm run setup:liquidity");
  console.log(
    "  5. Update web/.env.local with contract addresses"
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Deployment failed:", error);
    process.exit(1);
  });
