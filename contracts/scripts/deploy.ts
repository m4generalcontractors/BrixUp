import { ethers, run, network } from "hardhat";
import * as fs from "fs";
import * as path from "path";

/**
 * BrixUp Platform — Deployment Script
 *
 * Deploys the three core contracts in order:
 *   1. BrixToken   — ERC-20 $BRXU token (1 billion initial supply)
 *   2. BrixFactory — Factory for creating BrixDeal escrow contracts
 *   3. BrixStaking  — Staking pool for $BRXU holders
 *
 * After deployment the script:
 *   - Verifies all contracts on Basescan (skipped on local networks)
 *   - Saves deployed addresses to a JSON file in deployments/
 *
 * Usage:
 *   npx hardhat run scripts/deploy.ts --network baseSepolia
 *   npx hardhat run scripts/deploy.ts --network base
 */

// ---------------------------------------------------------------------------
//  Helpers
// ---------------------------------------------------------------------------

/**
 * Verify a contract on Basescan. Silently skips on local/hardhat networks.
 */
async function verifyContract(
  address: string,
  constructorArguments: unknown[]
): Promise<void> {
  if (network.name === "hardhat" || network.name === "localhost") {
    console.log("  (skipping verification on local network)");
    return;
  }

  console.log("  Verifying on Basescan...");
  try {
    await run("verify:verify", {
      address,
      constructorArguments,
    });
    console.log("  Verified successfully.");
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    if (message.toLowerCase().includes("already verified")) {
      console.log("  Contract already verified.");
    } else {
      console.warn("  Verification failed:", message);
    }
  }
}

/**
 * Save deployed addresses to a timestamped JSON file.
 */
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
  const filename = `${networkName}-${timestamp}.json`;
  const filepath = path.join(deploymentsDir, filename);

  // Also write/overwrite a "latest" file for easy reference
  const latestPath = path.join(deploymentsDir, `${networkName}-latest.json`);

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

// ---------------------------------------------------------------------------
//  Main
// ---------------------------------------------------------------------------

async function main() {
  const [deployer] = await ethers.getSigners();
  const networkInfo = await ethers.provider.getNetwork();
  const networkName = network.name;
  const chainId = Number(networkInfo.chainId);

  console.log("=".repeat(60));
  console.log("BrixUp Platform — Contract Deployment");
  console.log("=".repeat(60));
  console.log(`Deployer address : ${deployer.address}`);
  console.log(`Network          : ${networkName} (chainId: ${chainId})`);
  console.log(
    `Balance          : ${ethers.formatEther(await ethers.provider.getBalance(deployer.address))} ETH`
  );
  console.log("-".repeat(60));

  // ---- 1. Deploy BrixToken --------------------------------------------------
  // Support resuming: if BRXU_TOKEN_ADDRESS is set, skip redeployment.
  let brixTokenAddress = process.env.BRXU_TOKEN_ADDRESS || "";

  if (brixTokenAddress && ethers.isAddress(brixTokenAddress)) {
    brixTokenAddress = ethers.getAddress(brixTokenAddress);
    console.log(`\n[1/3] BrixToken already deployed — reusing: ${brixTokenAddress}`);
  } else {
    console.log("\n[1/3] Deploying BrixToken...");
    const BrixToken = await ethers.getContractFactory("BrixToken");
    const brixToken = await BrixToken.deploy();
    await brixToken.waitForDeployment();
    brixTokenAddress = await brixToken.getAddress();
    console.log(`  BrixToken deployed at : ${brixTokenAddress}`);

    // Wait for a few block confirmations before verifying (helps Basescan index)
    if (networkName !== "hardhat" && networkName !== "localhost") {
      console.log("  Waiting for 5 block confirmations...");
      await brixToken.deploymentTransaction()?.wait(5);
    }

    await verifyContract(brixTokenAddress, []);
  }

  // ---- 2. Deploy BrixFactory ------------------------------------------------
  console.log("\n[2/3] Deploying BrixFactory...");
  const platformWallet = ethers.getAddress(
    process.env.PLATFORM_WALLET || deployer.address
  );
  const platformFeeBps = parseInt(process.env.PLATFORM_FEE_BPS || "500", 10);
  const tokenAddr = ethers.getAddress(brixTokenAddress);

  const BrixFactory = await ethers.getContractFactory("BrixFactory");
  const brixFactory = await BrixFactory.deploy(
    tokenAddr,
    platformWallet,
    platformFeeBps
  );
  await brixFactory.waitForDeployment();
  const brixFactoryAddress = await brixFactory.getAddress();
  console.log(`  BrixFactory deployed at : ${brixFactoryAddress}`);
  console.log(`    Platform wallet : ${platformWallet}`);
  console.log(`    Platform fee    : ${platformFeeBps} bps (${platformFeeBps / 100}%)`);

  if (networkName !== "hardhat" && networkName !== "localhost") {
    console.log("  Waiting for 5 block confirmations...");
    await brixFactory.deploymentTransaction()?.wait(5);
  }

  await verifyContract(brixFactoryAddress, [
    tokenAddr,
    platformWallet,
    platformFeeBps,
  ]);

  // ---- 3. Deploy BrixStaking ------------------------------------------------
  console.log("\n[3/3] Deploying BrixStaking...");
  const BrixStaking = await ethers.getContractFactory("BrixStaking");
  const brixStaking = await BrixStaking.deploy(tokenAddr);
  await brixStaking.waitForDeployment();
  const brixStakingAddress = await brixStaking.getAddress();
  console.log(`  BrixStaking deployed at : ${brixStakingAddress}`);

  if (networkName !== "hardhat" && networkName !== "localhost") {
    console.log("  Waiting for 5 block confirmations...");
    await brixStaking.deploymentTransaction()?.wait(5);
  }

  await verifyContract(brixStakingAddress, [tokenAddr]);

  // ---- Save deployment addresses ---------------------------------------------
  const addresses = {
    BrixToken: brixTokenAddress,
    BrixFactory: brixFactoryAddress,
    BrixStaking: brixStakingAddress,
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
  console.log(`  BrixToken   : ${brixTokenAddress}`);
  console.log(`  BrixFactory : ${brixFactoryAddress}`);
  console.log(`  BrixStaking : ${brixStakingAddress}`);
  console.log("-".repeat(60));
  console.log(`  Addresses saved to : ${savedPath}`);
  console.log("=".repeat(60));
  console.log(
    "\nDone. Copy these addresses into web/.env.local for front-end configuration."
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Deployment failed:", error);
    process.exit(1);
  });
