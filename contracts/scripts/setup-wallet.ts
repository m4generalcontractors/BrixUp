/**
 * BrixUp Platform — CDP Wallet Setup
 *
 * Creates a platform wallet using Coinbase Developer Platform (CDP) SDK.
 * The wallet is used as the deployer and treasury for all BrixUp contracts.
 *
 * Prerequisites:
 *   1. Create a CDP API key at https://portal.cdp.coinbase.com
 *   2. Set environment variables:
 *        CDP_API_KEY_ID=your_api_key_id
 *        CDP_API_KEY_SECRET=your_api_key_secret
 *        CDP_WALLET_SECRET=your_wallet_secret
 *
 * Usage:
 *   npx tsx scripts/setup-wallet.ts
 */

import { CdpClient } from "@coinbase/cdp-sdk";
import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";

dotenv.config();

// ---------------------------------------------------------------------------
//  Main
// ---------------------------------------------------------------------------

async function main() {
  console.log("=".repeat(60));
  console.log("BrixUp — CDP Wallet Setup");
  console.log("=".repeat(60));

  // Convert raw base64 DER key to PEM format if needed
  let apiKeySecret = process.env.CDP_API_KEY_SECRET || "";
  if (apiKeySecret && !apiKeySecret.includes("-----BEGIN")) {
    apiKeySecret = `-----BEGIN PRIVATE KEY-----\n${apiKeySecret}\n-----END PRIVATE KEY-----`;
  }

  // Initialize CDP client
  const cdp = new CdpClient({
    apiKeyId: process.env.CDP_API_KEY_ID,
    apiKeySecret,
    walletSecret: process.env.CDP_WALLET_SECRET || undefined,
  });

  // ---- Create or retrieve the platform deployer account --------------------
  console.log("\n[1/3] Creating platform deployer account...");
  const deployer = await cdp.evm.getOrCreateAccount({
    name: "brixup-deployer",
  });
  console.log(`  Deployer address: ${deployer.address}`);

  // ---- Create or retrieve the platform fee wallet --------------------------
  console.log("\n[2/3] Creating platform fee wallet...");
  const platformWallet = await cdp.evm.getOrCreateAccount({
    name: "brixup-platform-wallet",
  });
  console.log(`  Platform wallet : ${platformWallet.address}`);

  // ---- Export deployer private key for Hardhat -----------------------------
  console.log("\n[3/3] Exporting deployer private key...");
  const privateKey = await cdp.evm.exportAccount({
    name: "brixup-deployer",
  });
  console.log("  Private key exported successfully.");

  // ---- Save to .env --------------------------------------------------------
  const envPath = path.join(__dirname, "..", ".env");
  let envContent = "";

  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, "utf-8");
  }

  // Helper to set or update an env var
  const setEnvVar = (key: string, value: string) => {
    const regex = new RegExp(`^${key}=.*$`, "m");
    if (regex.test(envContent)) {
      envContent = envContent.replace(regex, `${key}=${value}`);
    } else {
      envContent += `\n${key}=${value}`;
    }
  };

  setEnvVar("DEPLOYER_PRIVATE_KEY", privateKey);
  setEnvVar("PLATFORM_WALLET", platformWallet.address);
  setEnvVar("INITIAL_OWNER", deployer.address);

  fs.writeFileSync(envPath, envContent.trim() + "\n");
  console.log(`\n  Updated ${envPath}`);

  // ---- Request testnet ETH -------------------------------------------------
  console.log("\n[Bonus] Requesting Base Sepolia testnet ETH...");
  try {
    await cdp.evm.requestFaucet({
      address: deployer.address,
      network: "base-sepolia",
      token: "eth",
    });
    console.log("  Faucet request sent! ETH should arrive in ~30 seconds.");
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.log(`  Faucet request failed (you may need to fund manually): ${message}`);
  }

  // ---- Summary -------------------------------------------------------------
  console.log("\n" + "=".repeat(60));
  console.log("Wallet Setup Complete");
  console.log("=".repeat(60));
  console.log(`  Deployer        : ${deployer.address}`);
  console.log(`  Platform Wallet : ${platformWallet.address}`);
  console.log("-".repeat(60));
  console.log("\nNext steps:");
  console.log("  1. Fund the deployer with Base Sepolia ETH (if faucet didn't work)");
  console.log("  2. Run: npm run deploy:testnet");
  console.log("  3. Copy contract addresses to web/.env.local");
  console.log("=".repeat(60));
}

main().catch((error) => {
  console.error("Setup failed:", error);
  process.exit(1);
});
