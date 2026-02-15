import { expect } from "chai";
import { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { time } from "@nomicfoundation/hardhat-network-helpers";

// ─────────────────────────────────────────────────────────────────────────────
//  Shared Fixture
// ─────────────────────────────────────────────────────────────────────────────

async function deployFixture() {
  const [owner, investor1, investor2, builder, dealMaker, platform, other] =
    await ethers.getSigners();

  // Deploy BrixToken
  const BrixToken = await ethers.getContractFactory("BrixToken");
  const brixToken = await BrixToken.deploy();
  const tokenAddress = await brixToken.getAddress();

  // Deploy BrixStaking
  const BrixStaking = await ethers.getContractFactory("BrixStaking");
  const brixStaking = await BrixStaking.deploy(tokenAddress);
  const stakingAddress = await brixStaking.getAddress();

  // Deploy BrixFactory
  const platformFeeBps = 500; // 5%
  const BrixFactory = await ethers.getContractFactory("BrixFactory");
  const brixFactory = await BrixFactory.deploy(
    tokenAddress,
    platform.address,
    platformFeeBps
  );
  const factoryAddress = await brixFactory.getAddress();

  // Transfer tokens to test users
  const mintAmount = ethers.parseEther("100000");
  await brixToken.transfer(investor1.address, mintAmount);
  await brixToken.transfer(investor2.address, mintAmount);
  await brixToken.transfer(builder.address, mintAmount);

  return {
    brixToken,
    brixStaking,
    brixFactory,
    tokenAddress,
    stakingAddress,
    factoryAddress,
    owner,
    investor1,
    investor2,
    builder,
    dealMaker,
    platform,
    other,
    platformFeeBps,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
//  BrixToken Tests
// ─────────────────────────────────────────────────────────────────────────────

describe("BrixToken", function () {
  it("should deploy with correct name, symbol, and initial supply", async function () {
    const { brixToken, owner } = await loadFixture(deployFixture);
    expect(await brixToken.name()).to.equal("BrixUp Token");
    expect(await brixToken.symbol()).to.equal("BRXU");
    const initialSupply = ethers.parseEther("1000000000"); // 1 billion
    // Owner distributed some in fixture, so check total supply
    expect(await brixToken.totalSupply()).to.equal(initialSupply);
  });

  it("should allow owner to mint tokens", async function () {
    const { brixToken, other } = await loadFixture(deployFixture);
    const amount = ethers.parseEther("1000");
    await brixToken.mint(other.address, amount);
    expect(await brixToken.balanceOf(other.address)).to.equal(amount);
  });

  it("should reject mint from non-owner", async function () {
    const { brixToken, investor1, other } = await loadFixture(deployFixture);
    const amount = ethers.parseEther("1000");
    await expect(
      brixToken.connect(investor1).mint(other.address, amount)
    ).to.be.revertedWithCustomError(brixToken, "OwnableUnauthorizedAccount");
  });

  it("should reject mint to zero address", async function () {
    const { brixToken } = await loadFixture(deployFixture);
    await expect(
      brixToken.mint(ethers.ZeroAddress, ethers.parseEther("1"))
    ).to.be.revertedWith("BrixToken: mint to zero address");
  });

  it("should reject mint of zero amount", async function () {
    const { brixToken, other } = await loadFixture(deployFixture);
    await expect(brixToken.mint(other.address, 0)).to.be.revertedWith(
      "BrixToken: mint amount must be > 0"
    );
  });

  it("should allow token holders to burn", async function () {
    const { brixToken, investor1 } = await loadFixture(deployFixture);
    const burnAmount = ethers.parseEther("500");
    const balBefore = await brixToken.balanceOf(investor1.address);
    await brixToken.connect(investor1).burn(burnAmount);
    expect(await brixToken.balanceOf(investor1.address)).to.equal(
      balBefore - burnAmount
    );
  });

  it("should allow owner to pause and unpause transfers", async function () {
    const { brixToken, investor1, investor2 } = await loadFixture(
      deployFixture
    );
    await brixToken.pause();
    await expect(
      brixToken
        .connect(investor1)
        .transfer(investor2.address, ethers.parseEther("100"))
    ).to.be.revertedWithCustomError(brixToken, "EnforcedPause");

    await brixToken.unpause();
    await brixToken
      .connect(investor1)
      .transfer(investor2.address, ethers.parseEther("100"));
  });

  it("should reject pause from non-owner", async function () {
    const { brixToken, investor1 } = await loadFixture(deployFixture);
    await expect(
      brixToken.connect(investor1).pause()
    ).to.be.revertedWithCustomError(brixToken, "OwnableUnauthorizedAccount");
  });

  it("should emit TokensMinted event on mint", async function () {
    const { brixToken, other } = await loadFixture(deployFixture);
    const amount = ethers.parseEther("5000");
    await expect(brixToken.mint(other.address, amount))
      .to.emit(brixToken, "TokensMinted")
      .withArgs(other.address, amount);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
//  BrixStaking Tests
// ─────────────────────────────────────────────────────────────────────────────

describe("BrixStaking", function () {
  it("should allow staking BRXU tokens", async function () {
    const { brixToken, brixStaking, investor1, stakingAddress } =
      await loadFixture(deployFixture);
    const amount = ethers.parseEther("1000");
    await brixToken.connect(investor1).approve(stakingAddress, amount);
    await brixStaking.connect(investor1).stake(amount);

    expect(await brixStaking.totalStaked()).to.equal(amount);
    expect(await brixStaking.stakedBalance(investor1.address)).to.equal(amount);
    expect(await brixStaking.stakerCount()).to.equal(1);
  });

  it("should reject staking zero amount", async function () {
    const { brixStaking, investor1 } = await loadFixture(deployFixture);
    await expect(
      brixStaking.connect(investor1).stake(0)
    ).to.be.revertedWith("BrixStaking: amount must be > 0");
  });

  it("should enforce 7-day lock on unstaking", async function () {
    const { brixToken, brixStaking, investor1, stakingAddress } =
      await loadFixture(deployFixture);
    const amount = ethers.parseEther("1000");
    await brixToken.connect(investor1).approve(stakingAddress, amount);
    await brixStaking.connect(investor1).stake(amount);

    // Try to unstake immediately
    await expect(
      brixStaking.connect(investor1).unstake(amount)
    ).to.be.revertedWith("BrixStaking: tokens locked for 7 days");

    // Advance time by 7 days
    await time.increase(7 * 24 * 60 * 60);

    // Now unstaking should work
    await brixStaking.connect(investor1).unstake(amount);
    expect(await brixStaking.totalStaked()).to.equal(0);
  });

  it("should distribute and claim rewards correctly", async function () {
    const { brixToken, brixStaking, owner, investor1, investor2, stakingAddress } =
      await loadFixture(deployFixture);

    // Stake: investor1 = 1000, investor2 = 3000
    const stake1 = ethers.parseEther("1000");
    const stake2 = ethers.parseEther("3000");
    await brixToken.connect(investor1).approve(stakingAddress, stake1);
    await brixStaking.connect(investor1).stake(stake1);
    await brixToken.connect(investor2).approve(stakingAddress, stake2);
    await brixStaking.connect(investor2).stake(stake2);

    // Owner distributes 4000 BRXU as rewards
    const rewardAmount = ethers.parseEther("4000");
    await brixToken.approve(stakingAddress, rewardAmount);
    await brixStaking.distributeRewards(rewardAmount);

    // investor1 should get 25% (1000/4000) = 1000 BRXU reward
    // investor2 should get 75% (3000/4000) = 3000 BRXU reward
    const pending1 = await brixStaking.pendingRewards(investor1.address);
    const pending2 = await brixStaking.pendingRewards(investor2.address);
    expect(pending1).to.equal(ethers.parseEther("1000"));
    expect(pending2).to.equal(ethers.parseEther("3000"));

    // Claim rewards
    const bal1Before = await brixToken.balanceOf(investor1.address);
    await brixStaking.connect(investor1).claimRewards();
    const bal1After = await brixToken.balanceOf(investor1.address);
    expect(bal1After - bal1Before).to.equal(ethers.parseEther("1000"));
  });

  it("should reject distributing rewards with no stakers", async function () {
    const { brixToken, brixStaking, owner, stakingAddress } = await loadFixture(
      deployFixture
    );
    const amount = ethers.parseEther("1000");
    await brixToken.approve(stakingAddress, amount);
    await expect(brixStaking.distributeRewards(amount)).to.be.revertedWith(
      "BrixStaking: no stakers"
    );
  });

  it("should reject claiming with no rewards", async function () {
    const { brixToken, brixStaking, investor1, stakingAddress } =
      await loadFixture(deployFixture);
    const amount = ethers.parseEther("1000");
    await brixToken.connect(investor1).approve(stakingAddress, amount);
    await brixStaking.connect(investor1).stake(amount);

    await expect(
      brixStaking.connect(investor1).claimRewards()
    ).to.be.revertedWith("BrixStaking: no rewards to claim");
  });

  it("should emit Staked and Unstaked events", async function () {
    const { brixToken, brixStaking, investor1, stakingAddress } =
      await loadFixture(deployFixture);
    const amount = ethers.parseEther("1000");
    await brixToken.connect(investor1).approve(stakingAddress, amount);

    await expect(brixStaking.connect(investor1).stake(amount))
      .to.emit(brixStaking, "Staked")
      .withArgs(investor1.address, amount, amount);

    await time.increase(7 * 24 * 60 * 60);

    await expect(brixStaking.connect(investor1).unstake(amount))
      .to.emit(brixStaking, "Unstaked")
      .withArgs(investor1.address, amount, 0);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
//  BrixFactory Tests
// ─────────────────────────────────────────────────────────────────────────────

describe("BrixFactory", function () {
  it("should deploy with correct config", async function () {
    const { brixFactory, tokenAddress, platform, platformFeeBps } =
      await loadFixture(deployFixture);
    expect(await brixFactory.brixToken()).to.equal(tokenAddress);
    expect(await brixFactory.platformWallet()).to.equal(platform.address);
    expect(await brixFactory.platformFeeBps()).to.equal(platformFeeBps);
  });

  it("should create a new deal and track it", async function () {
    const { brixFactory, owner } = await loadFixture(deployFixture);
    const dealId = ethers.encodeBytes32String("DEAL-001");
    const capital = ethers.parseEther("10000");

    const tx = await brixFactory.createDeal(
      dealId,
      capital,
      3, // milestones
      6000, // investor 60%
      2000, // builder 20%
      500,  // platform 5%
      1500  // dealmaker 15%
    );

    const receipt = await tx.wait();
    expect(await brixFactory.dealCount()).to.equal(1);

    const deals = await brixFactory.getAllDeals();
    expect(deals.length).to.equal(1);
    expect(await brixFactory.isDeal(deals[0])).to.be.true;
  });

  it("should reject deal with splits not summing to 10000", async function () {
    const { brixFactory } = await loadFixture(deployFixture);
    const dealId = ethers.encodeBytes32String("BAD-DEAL");
    await expect(
      brixFactory.createDeal(
        dealId,
        ethers.parseEther("10000"),
        3,
        5000,
        2000,
        500,
        1000 // Sums to 8500 not 10000
      )
    ).to.be.revertedWith("BrixFactory: splits must sum to 10000");
  });

  it("should allow owner to update platform fee", async function () {
    const { brixFactory } = await loadFixture(deployFixture);
    await brixFactory.setPlatformFee(1000);
    expect(await brixFactory.platformFeeBps()).to.equal(1000);
  });

  it("should reject platform fee exceeding max", async function () {
    const { brixFactory } = await loadFixture(deployFixture);
    await expect(brixFactory.setPlatformFee(3000)).to.be.revertedWith(
      "BrixFactory: fee exceeds max"
    );
  });

  it("should allow owner to update platform wallet", async function () {
    const { brixFactory, other } = await loadFixture(deployFixture);
    await brixFactory.setPlatformWallet(other.address);
    expect(await brixFactory.platformWallet()).to.equal(other.address);
  });

  it("should emit DealCreated event", async function () {
    const { brixFactory, owner } = await loadFixture(deployFixture);
    const dealId = ethers.encodeBytes32String("DEAL-002");
    const capital = ethers.parseEther("5000");

    await expect(
      brixFactory.createDeal(dealId, capital, 2, 6000, 2000, 500, 1500)
    ).to.emit(brixFactory, "DealCreated");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
//  BrixDeal Tests
// ─────────────────────────────────────────────────────────────────────────────

describe("BrixDeal", function () {
  async function deployDealFixture() {
    const base = await loadFixture(deployFixture);
    const { brixFactory, brixToken, owner, investor1, investor2, builder, dealMaker, platform } = base;

    // Create a deal via factory
    const dealId = ethers.encodeBytes32String("DEAL-TEST");
    const capital = ethers.parseEther("10000");
    const tx = await brixFactory.createDeal(
      dealId,
      capital,
      3, // milestones
      6000, // investor 60%
      2000, // builder 20%
      500,  // platform 5%
      1500  // dealmaker 15%
    );
    await tx.wait();

    const deals = await brixFactory.getAllDeals();
    const dealAddress = deals[0];
    const brixDeal = await ethers.getContractAt("BrixDeal", dealAddress);

    // Set builder and deal maker (owner is the deal creator from factory)
    await brixDeal.setBuilder(builder.address);
    await brixDeal.setDealMaker(dealMaker.address);

    return { ...base, brixDeal, dealAddress, dealId, capital };
  }

  it("should be in Funding state after creation", async function () {
    const { brixDeal } = await loadFixture(deployDealFixture);
    expect(await brixDeal.state()).to.equal(0); // Funding
  });

  it("should accept investments meeting minimum", async function () {
    const { brixToken, brixDeal, investor1, dealAddress } =
      await loadFixture(deployDealFixture);
    const amount = ethers.parseEther("1000");
    await brixToken.connect(investor1).approve(dealAddress, amount);
    await brixDeal.connect(investor1).investInDeal(amount);

    expect(await brixDeal.totalCapitalRaised()).to.equal(amount);
    expect(await brixDeal.investments(investor1.address)).to.equal(amount);
    expect(await brixDeal.investorCount()).to.equal(1);
  });

  it("should reject investments below 500 BRXU minimum", async function () {
    const { brixToken, brixDeal, investor1, dealAddress } =
      await loadFixture(deployDealFixture);
    const amount = ethers.parseEther("100"); // Below 500 minimum
    await brixToken.connect(investor1).approve(dealAddress, amount);
    await expect(
      brixDeal.connect(investor1).investInDeal(amount)
    ).to.be.revertedWith("BrixDeal: below 500 BRXU minimum");
  });

  it("should auto-transition to Active when fully funded", async function () {
    const { brixToken, brixDeal, investor1, investor2, dealAddress, capital } =
      await loadFixture(deployDealFixture);

    // Investor1 invests 6000, Investor2 invests 4000 = 10000 total
    const amount1 = ethers.parseEther("6000");
    const amount2 = ethers.parseEther("4000");
    await brixToken.connect(investor1).approve(dealAddress, amount1);
    await brixDeal.connect(investor1).investInDeal(amount1);
    await brixToken.connect(investor2).approve(dealAddress, amount2);
    await brixDeal.connect(investor2).investInDeal(amount2);

    expect(await brixDeal.state()).to.equal(1); // Active
    expect(await brixDeal.investorCount()).to.equal(2);
  });

  it("should allow builder to request draws in Active state", async function () {
    const { brixToken, brixDeal, investor1, builder, dealAddress } =
      await loadFixture(deployDealFixture);

    // Fully fund the deal
    const amount = ethers.parseEther("10000");
    await brixToken.connect(investor1).approve(dealAddress, amount);
    await brixDeal.connect(investor1).investInDeal(amount);

    // Builder requests draw for milestone 0
    const drawAmount = ethers.parseEther("2000");
    await brixDeal.connect(builder).requestDraw(0, drawAmount);

    const draw = await brixDeal.draws(0);
    expect(draw.requested).to.be.true;
    expect(draw.approved).to.be.false;
    expect(draw.amount).to.equal(drawAmount);
  });

  it("should allow owner to approve draws and release funds to builder", async function () {
    const { brixToken, brixDeal, investor1, builder, dealAddress, owner } =
      await loadFixture(deployDealFixture);

    // Fully fund
    const amount = ethers.parseEther("10000");
    await brixToken.connect(investor1).approve(dealAddress, amount);
    await brixDeal.connect(investor1).investInDeal(amount);

    // Builder requests draw
    const drawAmount = ethers.parseEther("2000");
    await brixDeal.connect(builder).requestDraw(0, drawAmount);

    // Owner approves
    const builderBalBefore = await brixToken.balanceOf(builder.address);
    await brixDeal.approveDraw(0);
    const builderBalAfter = await brixToken.balanceOf(builder.address);

    expect(builderBalAfter - builderBalBefore).to.equal(drawAmount);
    expect(await brixDeal.totalDrawn()).to.equal(drawAmount);
  });

  it("should reject draw requests from non-builder", async function () {
    const { brixToken, brixDeal, investor1, dealAddress } =
      await loadFixture(deployDealFixture);

    // Fully fund
    await brixToken
      .connect(investor1)
      .approve(dealAddress, ethers.parseEther("10000"));
    await brixDeal.connect(investor1).investInDeal(ethers.parseEther("10000"));

    await expect(
      brixDeal.connect(investor1).requestDraw(0, ethers.parseEther("1000"))
    ).to.be.revertedWith("BrixDeal: caller is not the builder");
  });

  it("should allow owner to register sweat equity", async function () {
    const { brixDeal, other } = await loadFixture(deployDealFixture);
    const rate = ethers.parseEther("150");

    await brixDeal.registerSweatEquity(other.address, "Electrical", rate);
    const se = await brixDeal.sweatEquities(other.address);
    expect(se.registered).to.be.true;
    expect(se.brixRate).to.equal(rate);
    expect(await brixDeal.contractorCount()).to.equal(1);
  });

  it("should allow owner to dispute a deal", async function () {
    const { brixDeal } = await loadFixture(deployDealFixture);
    await brixDeal.disputeDeal();
    expect(await brixDeal.state()).to.equal(3); // Disputed
  });

  it("should complete deal and distribute profits correctly", async function () {
    const {
      brixToken,
      brixDeal,
      investor1,
      investor2,
      builder,
      dealMaker,
      platform,
      dealAddress,
      owner,
    } = await loadFixture(deployDealFixture);

    // Fully fund: inv1=6000, inv2=4000
    await brixToken
      .connect(investor1)
      .approve(dealAddress, ethers.parseEther("6000"));
    await brixDeal
      .connect(investor1)
      .investInDeal(ethers.parseEther("6000"));
    await brixToken
      .connect(investor2)
      .approve(dealAddress, ethers.parseEther("4000"));
    await brixDeal
      .connect(investor2)
      .investInDeal(ethers.parseEther("4000"));

    // Deal is now Active. Deposit profit BRXU into the deal contract.
    // Total principal = 10000, let profit = 5000
    const totalProfit = ethers.parseEther("5000");
    // Need to send principal (10000) + profit (5000) = 15000 into the contract
    // Deal already holds 10000 from investments. Send 5000 more for profit.
    await brixToken.transfer(dealAddress, totalProfit);

    // Complete the deal
    const inv1BalBefore = await brixToken.balanceOf(investor1.address);
    const inv2BalBefore = await brixToken.balanceOf(investor2.address);
    const builderBalBefore = await brixToken.balanceOf(builder.address);
    const platformBalBefore = await brixToken.balanceOf(platform.address);
    const dealMakerBalBefore = await brixToken.balanceOf(dealMaker.address);

    await brixDeal.completeDeal(totalProfit);

    expect(await brixDeal.state()).to.equal(2); // Completed

    // Investor1 (60% of capital): principal=6000 + profit share=60%*3000=1800 = 7800
    // (investorSplitBps=6000 => investor profit = 5000*6000/10000=3000)
    // inv1 share of investor profit = 3000 * 6000/10000 = 1800
    const inv1Received =
      (await brixToken.balanceOf(investor1.address)) - inv1BalBefore;
    expect(inv1Received).to.equal(ethers.parseEther("7800"));

    // Investor2 (40% of capital): principal=4000 + profit share=40%*3000=1200 = 5200
    const inv2Received =
      (await brixToken.balanceOf(investor2.address)) - inv2BalBefore;
    expect(inv2Received).to.equal(ethers.parseEther("5200"));

    // Builder: 20% of 5000 = 1000
    const builderReceived =
      (await brixToken.balanceOf(builder.address)) - builderBalBefore;
    expect(builderReceived).to.equal(ethers.parseEther("1000"));

    // Platform: 5% of 5000 = 250
    const platformReceived =
      (await brixToken.balanceOf(platform.address)) - platformBalBefore;
    expect(platformReceived).to.equal(ethers.parseEther("250"));

    // Deal-maker: 15% of 5000 = 750
    const dealMakerReceived =
      (await brixToken.balanceOf(dealMaker.address)) - dealMakerBalBefore;
    expect(dealMakerReceived).to.equal(ethers.parseEther("750"));
  });

  it("should emit InvestmentMade and DealFullyFunded events", async function () {
    const { brixToken, brixDeal, investor1, dealAddress, dealId, capital } =
      await loadFixture(deployDealFixture);

    await brixToken.connect(investor1).approve(dealAddress, capital);
    await expect(brixDeal.connect(investor1).investInDeal(capital))
      .to.emit(brixDeal, "InvestmentMade")
      .and.to.emit(brixDeal, "DealFullyFunded");
  });
});
