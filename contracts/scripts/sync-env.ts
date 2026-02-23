/**
 * sync-env.ts — Sync deployed contract addresses into web/.env.local
 *
 * Reads the latest deployment JSON from contracts/deployments/
 * and updates the NEXT_PUBLIC_BRXU_* variables in web/.env.local.
 *
 * Usage:
 *   npx tsx scripts/sync-env.ts              # auto-detect latest
 *   npx tsx scripts/sync-env.ts base         # use base-latest.json
 *   npx tsx scripts/sync-env.ts baseSepolia  # use baseSepolia-latest.json
 */

import * as fs from "fs";
import * as path from "path";

const network = process.argv[2] || "base";
const deploymentsDir = path.join(__dirname, "..", "deployments");
const latestFile = path.join(deploymentsDir, `${network}-latest.json`);
const envFile = path.join(__dirname, "..", "..", "web", ".env.local");

if (!fs.existsSync(latestFile)) {
  console.error(`No deployment found: ${latestFile}`);
  console.error(`Run 'npm run deploy:mainnet' or 'npm run deploy:testnet' first.`);
  process.exit(1);
}

if (!fs.existsSync(envFile)) {
  console.error(`web/.env.local not found: ${envFile}`);
  process.exit(1);
}

const deployment = JSON.parse(fs.readFileSync(latestFile, "utf8"));
const contracts = deployment.contracts as Record<string, string>;

const tokenAddr = contracts.BrixToken || contracts.BrxuToken || "";
const factoryAddr = contracts.BrixFactory || contracts.BrxuFactory || "";
const stakingAddr = contracts.BrixStaking || contracts.BrxuStaking || "";

if (!tokenAddr || !factoryAddr || !stakingAddr) {
  console.error("Deployment file missing contract addresses:", contracts);
  process.exit(1);
}

let envContent = fs.readFileSync(envFile, "utf8");

// Replace or set each address
const replacements: [string, string][] = [
  ["NEXT_PUBLIC_BRXU_TOKEN_ADDRESS", tokenAddr],
  ["NEXT_PUBLIC_BRXU_FACTORY_ADDRESS", factoryAddr],
  ["NEXT_PUBLIC_BRXU_STAKING_ADDRESS", stakingAddr],
];

// Also set the correct chain ID
const chainId = String(deployment.chainId || (network === "base" ? "8453" : "84532"));
replacements.push(["NEXT_PUBLIC_CHAIN_ID", chainId]);

for (const [key, value] of replacements) {
  const regex = new RegExp(`^${key}=.*$`, "m");
  if (regex.test(envContent)) {
    envContent = envContent.replace(regex, `${key}=${value}`);
  } else {
    envContent += `\n${key}=${value}`;
  }
}

fs.writeFileSync(envFile, envContent);

console.log("=".repeat(50));
console.log("web/.env.local updated with deployment addresses");
console.log("=".repeat(50));
console.log(`  Network  : ${network} (chainId: ${chainId})`);
console.log(`  Deployer : ${deployment.deployer}`);
console.log(`  Deployed : ${deployment.deployedAt}`);
console.log("");
console.log(`  BRXU Token   : ${tokenAddr}`);
console.log(`  BRXU Factory : ${factoryAddr}`);
console.log(`  BRXU Staking : ${stakingAddr}`);
console.log("=".repeat(50));
console.log("\nRestart your Next.js dev server to pick up the new addresses.");
