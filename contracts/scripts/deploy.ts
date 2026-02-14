import { ethers } from "hardhat";

/**
 * BrixUp Platform — Deployment Script
 *
 * Deploys the three core contracts in order:
 *   1. BrixToken   — ERC-20 $BRIX token (1 billion initial supply)
 *   2. BrixFactory — Factory for creating BrixDeal escrow contracts
 *   3. BrixStaking  — Staking pool for $BRIX holders
 *
 * Usage:
 *   npx hardhat run scripts/deploy.ts --network baseSepolia
 *   npx hardhat run scripts/deploy.ts --network base
 */
async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("=".repeat(60));
  console.log("BrixUp Platform — Contract Deployment");
  console.log("=".repeat(60));
  console.log(`Deployer address : ${deployer.address}`);
  console.log(`Network          : ${(await ethers.provider.getNetwork()).name}`);
  console.log(`Balance          : ${ethers.formatEther(await ethers.provider.getBalance(deployer.address))} ETH`);
  console.log("-".repeat(60));

  // ---- 1. Deploy BrixToken ------------------------------------------------
  console.log("\n[1/3] Deploying BrixToken...");
  const BrixToken = await ethers.getContractFactory("BrixToken");
  const brixToken = await BrixToken.deploy();
  await brixToken.waitForDeployment();
  const brixTokenAddress = await brixToken.getAddress();
  console.log(`  BrixToken deployed at : ${brixTokenAddress}`);

  // ---- 2. Deploy BrixFactory -----------------------------------------------
  console.log("\n[2/3] Deploying BrixFactory...");
  const platformWallet = deployer.address; // deployer acts as platform wallet initially
  const platformFeeBps = 500; // 5 % platform fee
  const BrixFactory = await ethers.getContractFactory("BrixFactory");
  const brixFactory = await BrixFactory.deploy(
    brixTokenAddress,
    platformWallet,
    platformFeeBps
  );
  await brixFactory.waitForDeployment();
  const brixFactoryAddress = await brixFactory.getAddress();
  console.log(`  BrixFactory deployed at : ${brixFactoryAddress}`);

  // ---- 3. Deploy BrixStaking -----------------------------------------------
  console.log("\n[3/3] Deploying BrixStaking...");
  const BrixStaking = await ethers.getContractFactory("BrixStaking");
  const brixStaking = await BrixStaking.deploy(brixTokenAddress);
  await brixStaking.waitForDeployment();
  const brixStakingAddress = await brixStaking.getAddress();
  console.log(`  BrixStaking deployed at : ${brixStakingAddress}`);

  // ---- Summary -------------------------------------------------------------
  console.log("\n" + "=".repeat(60));
  console.log("Deployment Summary");
  console.log("=".repeat(60));
  console.log(`  BrixToken   : ${brixTokenAddress}`);
  console.log(`  BrixFactory : ${brixFactoryAddress}`);
  console.log(`  BrixStaking : ${brixStakingAddress}`);
  console.log("=".repeat(60));
  console.log("\nDone. Save these addresses for front-end configuration.");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Deployment failed:", error);
    process.exit(1);
  });
