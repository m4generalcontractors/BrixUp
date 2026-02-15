import { ethers, network } from "hardhat";
import * as fs from "fs";
import * as path from "path";

/**
 * BrixUp — Uniswap v3 Liquidity Setup on Base
 *
 * Creates a BRIX/USDC pool on Uniswap v3 (Base) and adds initial liquidity.
 *
 * Uniswap v3 Addresses on Base Mainnet:
 *   Factory       : 0x33128a8fC17869897dcE68Ed026d694621f6FDfD
 *   SwapRouter02  : 0x2626664c2603336E57B271c5C0b26F421741e481
 *   NonfungiblePositionManager: 0x03a520b32C04BF3bEEf7BEb72E919cf822Ed34f1
 *   USDC (Base)   : 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913
 *
 * Usage:
 *   npx hardhat run scripts/setup-liquidity.ts --network base
 *
 * Required env vars:
 *   DEPLOYER_PRIVATE_KEY
 *   INITIAL_BRIX_LIQUIDITY  — Amount of BRIX for LP (default: 50,000,000)
 *   INITIAL_USDC_LIQUIDITY  — Amount of USDC for LP (default: 500,000)
 *   BRIX_PRICE_USDC         — Initial BRIX price in USDC (default: 0.01)
 */

// Uniswap v3 Base Mainnet addresses
const UNISWAP_V3_FACTORY = "0x33128a8fC17869897dcE68Ed026d694621f6FDfD";
const UNISWAP_POSITION_MANAGER =
  "0x03a520b32C04BF3bEEf7BEb72E919cf822Ed34f1";
const USDC_BASE = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";

// Minimal ABIs for Uniswap v3 interaction
const FACTORY_ABI = [
  "function createPool(address tokenA, address tokenB, uint24 fee) external returns (address pool)",
  "function getPool(address tokenA, address tokenB, uint24 fee) external view returns (address pool)",
];

const POOL_ABI = [
  "function initialize(uint160 sqrtPriceX96) external",
  "function slot0() external view returns (uint160 sqrtPriceX96, int24 tick, uint16 observationIndex, uint16 observationCardinality, uint16 observationCardinalityNext, uint8 feeProtocol, bool unlocked)",
];

const POSITION_MANAGER_ABI = [
  "function mint((address token0, address token1, uint24 fee, int24 tickLower, int24 tickUpper, uint256 amount0Desired, uint256 amount1Desired, uint256 amount0Min, uint256 amount1Min, address recipient, uint256 deadline)) external payable returns (uint256 tokenId, uint128 liquidity, uint256 amount0, uint256 amount1)",
];

const ERC20_ABI = [
  "function approve(address spender, uint256 amount) external returns (bool)",
  "function balanceOf(address account) external view returns (uint256)",
  "function decimals() external view returns (uint8)",
];

// Calculate sqrtPriceX96 from price ratio
// price = token1/token0 (USDC per BRIX)
// sqrtPriceX96 = sqrt(price) * 2^96
function encodeSqrtPriceX96(
  price: number,
  token0Decimals: number,
  token1Decimals: number
): bigint {
  // Adjust for decimal difference
  const adjustedPrice =
    price * 10 ** (token1Decimals - token0Decimals);
  const sqrtPrice = Math.sqrt(adjustedPrice);
  const Q96 = 2n ** 96n;
  // Use BigInt math for precision
  return BigInt(Math.floor(sqrtPrice * Number(Q96)));
}

async function main() {
  const networkName = network.name;

  if (networkName === "hardhat" || networkName === "localhost") {
    console.log(
      "This script is designed for Base mainnet/testnet. Use --network base."
    );
    console.log("Simulating setup steps for verification...\n");
  }

  const [deployer] = await ethers.getSigners();

  // Load deployment addresses
  const latestPath = path.join(
    __dirname,
    "..",
    "deployments",
    `brix-${networkName}-latest.json`
  );

  if (!fs.existsSync(latestPath)) {
    console.error(
      `No deployment found at ${latestPath}. Run deploy-brix.ts first.`
    );
    process.exit(1);
  }

  const deployment = JSON.parse(fs.readFileSync(latestPath, "utf-8"));
  const brixAddress: string = deployment.contracts.BRIX;

  // Config
  const brixLiquidity = process.env.INITIAL_BRIX_LIQUIDITY || "50000000"; // 50M BRIX
  const usdcLiquidity = process.env.INITIAL_USDC_LIQUIDITY || "500000"; // 500K USDC
  const brixPrice = parseFloat(process.env.BRIX_PRICE_USDC || "0.01"); // $0.01
  const poolFee = 3000; // 0.3% fee tier

  console.log("=".repeat(60));
  console.log("BrixUp — Uniswap v3 Liquidity Setup");
  console.log("=".repeat(60));
  console.log(`Network    : ${networkName}`);
  console.log(`BRIX Token : ${brixAddress}`);
  console.log(`USDC       : ${USDC_BASE}`);
  console.log(`Pool Fee   : ${poolFee / 10000}%`);
  console.log(`BRIX Price : $${brixPrice} USDC`);
  console.log(`BRIX LP    : ${brixLiquidity} BRIX`);
  console.log(`USDC LP    : ${usdcLiquidity} USDC`);
  console.log("-".repeat(60));

  if (networkName === "hardhat" || networkName === "localhost") {
    console.log("\n[DRY RUN] Steps that would execute on mainnet:");
    console.log("  1. Create BRIX/USDC pool on Uniswap v3 Factory");
    console.log("  2. Initialize pool with sqrtPriceX96");
    console.log("  3. Approve BRIX + USDC to Position Manager");
    console.log("  4. Mint full-range liquidity position");
    console.log("  5. Save pool address to deployments");
    console.log("\nDry run complete. Deploy to mainnet with --network base.");
    return;
  }

  // Connect to contracts
  const factory = new ethers.Contract(
    UNISWAP_V3_FACTORY,
    FACTORY_ABI,
    deployer
  );
  const positionManager = new ethers.Contract(
    UNISWAP_POSITION_MANAGER,
    POSITION_MANAGER_ABI,
    deployer
  );
  const brixToken = new ethers.Contract(brixAddress, ERC20_ABI, deployer);
  const usdcToken = new ethers.Contract(USDC_BASE, ERC20_ABI, deployer);

  // Determine token0/token1 ordering (lower address = token0)
  const brixLower =
    brixAddress.toLowerCase() < USDC_BASE.toLowerCase();
  const token0 = brixLower ? brixAddress : USDC_BASE;
  const token1 = brixLower ? USDC_BASE : brixAddress;

  console.log(`\nToken0: ${token0}`);
  console.log(`Token1: ${token1}`);

  // Step 1: Check if pool exists, create if not
  console.log("\n[1/4] Checking/Creating pool...");
  let poolAddress = await factory.getPool(token0, token1, poolFee);

  if (poolAddress === ethers.ZeroAddress) {
    console.log("  Creating new pool...");
    const tx = await factory.createPool(token0, token1, poolFee);
    await tx.wait();
    poolAddress = await factory.getPool(token0, token1, poolFee);
    console.log(`  Pool created at: ${poolAddress}`);

    // Step 2: Initialize pool price
    console.log("\n[2/4] Initializing pool price...");
    const brixDecimals = Number(await brixToken.decimals());
    const usdcDecimals = Number(await usdcToken.decimals());

    // Calculate price based on token ordering
    const price = brixLower
      ? brixPrice // USDC per BRIX
      : 1 / brixPrice; // BRIX per USDC

    const sqrtPriceX96 = encodeSqrtPriceX96(
      price,
      brixLower ? brixDecimals : usdcDecimals,
      brixLower ? usdcDecimals : brixDecimals
    );

    const pool = new ethers.Contract(poolAddress, POOL_ABI, deployer);
    const initTx = await pool.initialize(sqrtPriceX96);
    await initTx.wait();
    console.log(`  Pool initialized with sqrtPriceX96: ${sqrtPriceX96}`);
  } else {
    console.log(`  Pool already exists at: ${poolAddress}`);
  }

  // Step 3: Approve tokens
  console.log("\n[3/4] Approving tokens...");
  const brixAmount = ethers.parseEther(brixLiquidity);
  const usdcAmount = ethers.parseUnits(usdcLiquidity, 6); // USDC = 6 decimals

  const brixBal = await brixToken.balanceOf(deployer.address);
  const usdcBal = await usdcToken.balanceOf(deployer.address);
  console.log(
    `  BRIX balance: ${ethers.formatEther(brixBal)} (need ${brixLiquidity})`
  );
  console.log(
    `  USDC balance: ${ethers.formatUnits(usdcBal, 6)} (need ${usdcLiquidity})`
  );

  if (brixBal < brixAmount) {
    console.error("  ❌ Insufficient BRIX balance. Aborting.");
    process.exit(1);
  }
  if (usdcBal < usdcAmount) {
    console.error("  ❌ Insufficient USDC balance. Aborting.");
    process.exit(1);
  }

  await (
    await brixToken.approve(UNISWAP_POSITION_MANAGER, brixAmount)
  ).wait();
  await (
    await usdcToken.approve(UNISWAP_POSITION_MANAGER, usdcAmount)
  ).wait();
  console.log("  ✅ Tokens approved.");

  // Step 4: Add liquidity (full-range position)
  console.log("\n[4/4] Adding liquidity...");
  const amount0Desired = brixLower ? brixAmount : usdcAmount;
  const amount1Desired = brixLower ? usdcAmount : brixAmount;

  // Full range ticks for 0.3% fee (tick spacing = 60)
  const MIN_TICK = -887220;
  const MAX_TICK = 887220;

  const mintParams = {
    token0,
    token1,
    fee: poolFee,
    tickLower: MIN_TICK,
    tickUpper: MAX_TICK,
    amount0Desired,
    amount1Desired,
    amount0Min: 0,
    amount1Min: 0,
    recipient: deployer.address,
    deadline: Math.floor(Date.now() / 1000) + 600, // 10 minutes
  };

  const mintTx = await positionManager.mint(mintParams);
  const receipt = await mintTx.wait();
  console.log(`  ✅ Liquidity added! Tx: ${receipt.hash}`);

  // Save pool address
  deployment.contracts.UniswapPool = poolAddress;
  const latestPathUpdate = path.join(
    __dirname,
    "..",
    "deployments",
    `brix-${networkName}-latest.json`
  );
  fs.writeFileSync(latestPathUpdate, JSON.stringify(deployment, null, 2));

  // Summary
  console.log("\n" + "=".repeat(60));
  console.log("Liquidity Setup Complete");
  console.log("=".repeat(60));
  console.log(`  Pool Address : ${poolAddress}`);
  console.log(`  BRIX Added   : ${brixLiquidity}`);
  console.log(`  USDC Added   : ${usdcLiquidity}`);
  console.log(`  Initial Price: $${brixPrice} per BRIX`);
  console.log("=".repeat(60));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Liquidity setup failed:", error);
    process.exit(1);
  });
