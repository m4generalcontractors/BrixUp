import { run, network } from "hardhat";
import * as fs from "fs";
import * as path from "path";

/**
 * BrixUp — Contract Verification Script
 *
 * Reads deployed addresses from deployments/ and verifies them on BaseScan.
 *
 * Usage:
 *   npx hardhat run scripts/verify-brxu.ts --network base
 *   npx hardhat run scripts/verify-brxu.ts --network baseSepolia
 */

interface DeploymentData {
  network: string;
  chainId: number;
  deployer: string;
  deployedAt: string;
  contracts: {
    BRXU: string;
    BRXUStaking: string;
    BRXUVesting: string;
  };
}

async function verifyContract(
  name: string,
  address: string,
  constructorArguments: unknown[]
): Promise<boolean> {
  console.log(`\nVerifying ${name} at ${address}...`);
  try {
    await run("verify:verify", { address, constructorArguments });
    console.log(`  ✅ ${name} verified successfully.`);
    return true;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    if (message.toLowerCase().includes("already verified")) {
      console.log(`  ✅ ${name} already verified.`);
      return true;
    }
    console.warn(`  ❌ ${name} verification failed: ${message}`);
    return false;
  }
}

async function main() {
  const networkName = network.name;

  if (networkName === "hardhat" || networkName === "localhost") {
    console.log("Cannot verify on local network. Use --network base or --network baseSepolia.");
    process.exit(1);
  }

  // Load deployment data
  const latestPath = path.join(
    __dirname,
    "..",
    "deployments",
    `brxu-${networkName}-latest.json`
  );

  if (!fs.existsSync(latestPath)) {
    console.error(
      `No deployment found at ${latestPath}. Run deploy-brxu.ts first.`
    );
    process.exit(1);
  }

  const deployment: DeploymentData = JSON.parse(
    fs.readFileSync(latestPath, "utf-8")
  );

  console.log("=".repeat(60));
  console.log("BrixUp — Contract Verification");
  console.log("=".repeat(60));
  console.log(`Network   : ${deployment.network} (chainId: ${deployment.chainId})`);
  console.log(`Deployer  : ${deployment.deployer}`);
  console.log(`Deployed  : ${deployment.deployedAt}`);
  console.log("-".repeat(60));

  // Reconstruct constructor args from env
  const treasuryAddr = process.env.TREASURY_WALLET || deployment.deployer;
  const rewardsAddr = process.env.REWARDS_WALLET || deployment.deployer;
  const vestingAddr = process.env.TEAM_VESTING_WALLET || deployment.deployer;
  const liquidityAddr = process.env.LIQUIDITY_WALLET || deployment.deployer;
  const marketingAddr = process.env.MARKETING_WALLET || deployment.deployer;
  const presaleAddr = process.env.PRESALE_WALLET || deployment.deployer;

  let success = 0;
  let failed = 0;

  // 1. Verify BRXU
  const brxuOk = await verifyContract("BRXU", deployment.contracts.BRXU, [
    treasuryAddr,
    rewardsAddr,
    vestingAddr,
    liquidityAddr,
    marketingAddr,
    presaleAddr,
  ]);
  brxuOk ? success++ : failed++;

  // 2. Verify BRXUStaking
  const stakingOk = await verifyContract(
    "BRXUStaking",
    deployment.contracts.BRXUStaking,
    [deployment.contracts.BRXU]
  );
  stakingOk ? success++ : failed++;

  // 3. Verify BRXUVesting
  const vestingOk = await verifyContract(
    "BRXUVesting",
    deployment.contracts.BRXUVesting,
    [deployment.contracts.BRXU]
  );
  vestingOk ? success++ : failed++;

  // Summary
  console.log("\n" + "=".repeat(60));
  console.log(`Verification complete: ${success} passed, ${failed} failed`);
  console.log("=".repeat(60));

  if (failed > 0) {
    console.log("\nTo retry failed verifications, run this script again.");
  } else {
    const baseUrl =
      networkName === "base"
        ? "https://basescan.org"
        : "https://sepolia.basescan.org";
    console.log("\nView on BaseScan:");
    console.log(`  BRXU        : ${baseUrl}/address/${deployment.contracts.BRXU}`);
    console.log(`  BRXUStaking : ${baseUrl}/address/${deployment.contracts.BRXUStaking}`);
    console.log(`  BRXUVesting : ${baseUrl}/address/${deployment.contracts.BRXUVesting}`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Verification failed:", error);
    process.exit(1);
  });
