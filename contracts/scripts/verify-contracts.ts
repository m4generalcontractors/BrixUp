import { ethers, run, network } from "hardhat";
import * as fs from "fs";
import * as path from "path";

/**
 * BrixUp — Contract Verification Script
 *
 * Verifies BrixToken, BrixFactory, and BrixStaking on Basescan using the
 * Etherscan V2 unified API.
 *
 * Reads addresses from deployments/<network>-latest.json or from env vars.
 *
 * Prerequisites:
 *   - Set ETHERSCAN_API_KEY in .env (get one at https://etherscan.io/myapikey)
 *
 * Usage:
 *   npx hardhat run scripts/verify-contracts.ts --network base
 *   npx hardhat run scripts/verify-contracts.ts --network baseSepolia
 */

interface DeploymentData {
  network: string;
  chainId: number;
  deployer: string;
  deployedAt: string;
  contracts: {
    BrixToken: string;
    BrixFactory: string;
    BrixStaking: string;
  };
}

async function verifyContract(
  name: string,
  address: string,
  constructorArguments: unknown[],
  contract?: string
): Promise<boolean> {
  console.log(`\nVerifying ${name} at ${address}...`);
  try {
    const args: Record<string, unknown> = { address, constructorArguments };
    if (contract) {
      args.contract = contract;
    }
    await run("verify:verify", args);
    console.log(`  ${name} verified successfully.`);
    return true;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    if (message.toLowerCase().includes("already verified")) {
      console.log(`  ${name} already verified.`);
      return true;
    }
    console.warn(`  ${name} verification failed: ${message}`);
    return false;
  }
}

async function main() {
  const networkName = network.name;

  if (networkName === "hardhat" || networkName === "localhost") {
    console.log(
      "Cannot verify on local network. Use --network base or --network baseSepolia."
    );
    process.exit(1);
  }

  // Load deployment data from JSON or fall back to env vars
  const latestPath = path.join(
    __dirname,
    "..",
    "deployments",
    `${networkName}-latest.json`
  );

  let brixTokenAddr: string;
  let brixFactoryAddr: string;
  let brixStakingAddr: string;
  let platformWallet: string;
  let platformFeeBps: number;

  if (fs.existsSync(latestPath)) {
    const deployment: DeploymentData = JSON.parse(
      fs.readFileSync(latestPath, "utf-8")
    );
    brixTokenAddr = deployment.contracts.BrixToken;
    brixFactoryAddr = deployment.contracts.BrixFactory;
    brixStakingAddr = deployment.contracts.BrixStaking;
    console.log(`Loaded addresses from ${latestPath}`);
  } else {
    // Fall back to env vars / hardcoded addresses from latest mainnet deploy
    brixTokenAddr =
      process.env.BRXU_TOKEN_ADDRESS ||
      "0xFdcb52F990360a098E72B91C5ffBCd6FE2d801e1";
    brixFactoryAddr =
      process.env.BRIX_FACTORY_ADDRESS ||
      "0x3d03C10A4D2e0d3e8e31F31cC76097e00Cd5466d";
    brixStakingAddr =
      process.env.BRIX_STAKING_ADDRESS ||
      "0xadbC294081Da7423f707d00DAffEdE334D6d18c3";
    console.log(
      "No deployment JSON found — using env vars / hardcoded addresses."
    );
  }

  // Constructor arg dependencies
  const [deployer] = await ethers.getSigners();
  platformWallet = process.env.PLATFORM_WALLET || deployer.address;
  platformFeeBps = parseInt(process.env.PLATFORM_FEE_BPS || "500", 10);

  console.log("=".repeat(60));
  console.log("BrixUp — Contract Verification (Etherscan V2)");
  console.log("=".repeat(60));
  console.log(`Network        : ${networkName}`);
  console.log(`BrixToken      : ${brixTokenAddr}`);
  console.log(`BrixFactory    : ${brixFactoryAddr}`);
  console.log(`BrixStaking    : ${brixStakingAddr}`);
  console.log(`Platform Wallet: ${platformWallet}`);
  console.log(`Platform Fee   : ${platformFeeBps} bps`);
  console.log("-".repeat(60));

  let success = 0;
  let failed = 0;

  // 1. Verify BrixToken (no constructor args)
  // BrixToken was deployed with ticker "BRIX" (pre-rename). Use legacy source
  // that matches the deployed bytecode for verification.
  const tokenOk = await verifyContract(
    "BrixToken",
    brixTokenAddr,
    [],
    "contracts/legacy/BrixTokenV1.sol:BrixToken"
  );
  tokenOk ? success++ : failed++;

  // 2. Verify BrixFactory (brixToken, platformWallet, platformFeeBps)
  const factoryOk = await verifyContract("BrixFactory", brixFactoryAddr, [
    ethers.getAddress(brixTokenAddr),
    ethers.getAddress(platformWallet),
    platformFeeBps,
  ]);
  factoryOk ? success++ : failed++;

  // 3. Verify BrixStaking (brixToken)
  const stakingOk = await verifyContract("BrixStaking", brixStakingAddr, [
    ethers.getAddress(brixTokenAddr),
  ]);
  stakingOk ? success++ : failed++;

  // Summary
  console.log("\n" + "=".repeat(60));
  console.log(`Verification complete: ${success} passed, ${failed} failed`);
  console.log("=".repeat(60));

  if (failed > 0) {
    console.log("\nTroubleshooting:");
    console.log(
      "  1. Ensure ETHERSCAN_API_KEY is set (get one at https://etherscan.io/myapikey)"
    );
    console.log(
      "  2. Wait a few minutes after deployment for Basescan to index the contracts"
    );
    console.log("  3. Run this script again to retry failed verifications");
  } else {
    const baseUrl =
      networkName === "base"
        ? "https://basescan.org"
        : "https://sepolia.basescan.org";
    console.log("\nView on BaseScan:");
    console.log(`  BrixToken  : ${baseUrl}/address/${brixTokenAddr}#code`);
    console.log(`  BrixFactory: ${baseUrl}/address/${brixFactoryAddr}#code`);
    console.log(`  BrixStaking: ${baseUrl}/address/${brixStakingAddr}#code`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Verification failed:", error);
    process.exit(1);
  });
