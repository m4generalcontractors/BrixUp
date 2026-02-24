import { ethers, network } from "hardhat";

/**
 * BrixUp — Token Transfer Script
 *
 * Transfers BRXU tokens from the deployer wallet to a recipient address.
 *
 * Usage:
 *   RECIPIENT=0x... AMOUNT=1000 npx hardhat run scripts/transfer.ts --network base
 *   RECIPIENT=0x... AMOUNT=1000 npx hardhat run scripts/transfer.ts --network baseSepolia
 */

async function main() {
  const recipient = process.env.RECIPIENT;
  const amount = process.env.AMOUNT;

  if (!recipient || !ethers.isAddress(recipient)) {
    console.error(
      "Error: Set RECIPIENT env var to a valid address.\n" +
        "  RECIPIENT=0x... AMOUNT=1000 npx hardhat run scripts/transfer.ts --network base"
    );
    process.exit(1);
  }

  if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
    console.error(
      "Error: Set AMOUNT env var to a positive number of tokens.\n" +
        "  RECIPIENT=0x... AMOUNT=1000 npx hardhat run scripts/transfer.ts --network base"
    );
    process.exit(1);
  }

  const tokenAddress =
    process.env.BRXU_TOKEN_ADDRESS ||
    process.env.TOKEN_ADDRESS ||
    "";

  if (!tokenAddress || !ethers.isAddress(tokenAddress)) {
    console.error(
      "Error: Set BRXU_TOKEN_ADDRESS or TOKEN_ADDRESS in .env to the deployed BrixToken address."
    );
    process.exit(1);
  }

  const [sender] = await ethers.getSigners();
  const token = await ethers.getContractAt("contracts/BrixToken.sol:BrixToken", tokenAddress);

  const decimals = await token.decimals();
  const parsedAmount = ethers.parseUnits(amount, decimals);
  const symbol = await token.symbol();

  console.log("=".repeat(60));
  console.log("BrixUp — Token Transfer");
  console.log("=".repeat(60));
  console.log(`Network   : ${network.name}`);
  console.log(`Token     : ${tokenAddress} (${symbol})`);
  console.log(`From      : ${sender.address}`);
  console.log(`To        : ${recipient}`);
  console.log(`Amount    : ${amount} ${symbol} (${parsedAmount.toString()} wei)`);
  console.log("-".repeat(60));

  const balance = await token.balanceOf(sender.address);
  if (balance < parsedAmount) {
    console.error(
      `Insufficient balance: ${ethers.formatUnits(balance, decimals)} ${symbol}`
    );
    process.exit(1);
  }

  console.log("Sending transaction...");
  const tx = await token.transfer(recipient, parsedAmount);
  console.log(`  TX hash: ${tx.hash}`);
  console.log("  Waiting for confirmation...");
  const receipt = await tx.wait(1);
  console.log(`  Confirmed in block ${receipt?.blockNumber}`);
  console.log("=".repeat(60));
  console.log("Transfer complete.");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Transfer failed:", error);
    process.exit(1);
  });
