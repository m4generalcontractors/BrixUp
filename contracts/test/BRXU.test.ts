import { expect } from "chai";
import { ethers } from "hardhat";
import { loadFixture, time } from "@nomicfoundation/hardhat-network-helpers";

// ─────────────────────────────────────────────────────────────────────────────
//  Shared Fixture — deploys BRXU token with 6 wallets
// ─────────────────────────────────────────────────────────────────────────────

async function deployBRXUFixture() {
  const [owner, treasury, rewards, vesting, liquidity, marketing, presale, alice, bob, charlie] =
    await ethers.getSigners();

  const BRXU = await ethers.getContractFactory("BRXU");
  const brxu = await BRXU.deploy(
    treasury.address,
    rewards.address,
    vesting.address,
    liquidity.address,
    marketing.address,
    presale.address
  );

  const brxuAddress = await brxu.getAddress();

  // Disable anti-bot so fixture transfers > 10M don't revert
  await brxu.connect(owner).disableAntiBot();

  return {
    brxu,
    brxuAddress,
    owner,
    treasury,
    rewards,
    vesting,
    liquidity,
    marketing,
    presale,
    alice,
    bob,
    charlie,
  };
}

// Separate fixture with anti-bot still enabled for anti-bot tests
async function deployBRXUWithAntiBotFixture() {
  const [owner, treasury, rewards, vesting, liquidity, marketing, presale, alice, bob, charlie] =
    await ethers.getSigners();

  const BRXU = await ethers.getContractFactory("BRXU");
  const brxu = await BRXU.deploy(
    treasury.address,
    rewards.address,
    vesting.address,
    liquidity.address,
    marketing.address,
    presale.address
  );

  const brxuAddress = await brxu.getAddress();

  return {
    brxu,
    brxuAddress,
    owner,
    treasury,
    rewards,
    vesting,
    liquidity,
    marketing,
    presale,
    alice,
    bob,
    charlie,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
//  BRXU Token Tests
// ─────────────────────────────────────────────────────────────────────────────

describe("BRXU Token", function () {
  describe("Deployment", function () {
    it("should have correct name and symbol", async function () {
      const { brxu } = await loadFixture(deployBRXUFixture);
      expect(await brxu.name()).to.equal("BrixUp Token");
      expect(await brxu.symbol()).to.equal("BRXU");
    });

    it("should mint 1 billion total supply", async function () {
      const { brxu } = await loadFixture(deployBRXUFixture);
      expect(await brxu.totalSupply()).to.equal(
        ethers.parseEther("1000000000")
      );
    });

    it("should allocate 40% to treasury", async function () {
      const { brxu, treasury } = await loadFixture(deployBRXUFixture);
      expect(await brxu.balanceOf(treasury.address)).to.equal(
        ethers.parseEther("400000000")
      );
    });

    it("should allocate 20% to rewards", async function () {
      const { brxu, rewards } = await loadFixture(deployBRXUFixture);
      expect(await brxu.balanceOf(rewards.address)).to.equal(
        ethers.parseEther("200000000")
      );
    });

    it("should allocate 15% to vesting", async function () {
      const { brxu, vesting } = await loadFixture(deployBRXUFixture);
      expect(await brxu.balanceOf(vesting.address)).to.equal(
        ethers.parseEther("150000000")
      );
    });

    it("should allocate 10% to liquidity", async function () {
      const { brxu, liquidity } = await loadFixture(deployBRXUFixture);
      expect(await brxu.balanceOf(liquidity.address)).to.equal(
        ethers.parseEther("100000000")
      );
    });

    it("should allocate 10% to marketing", async function () {
      const { brxu, marketing } = await loadFixture(deployBRXUFixture);
      expect(await brxu.balanceOf(marketing.address)).to.equal(
        ethers.parseEther("100000000")
      );
    });

    it("should allocate 5% to presale", async function () {
      const { brxu, presale } = await loadFixture(deployBRXUFixture);
      expect(await brxu.balanceOf(presale.address)).to.equal(
        ethers.parseEther("50000000")
      );
    });

    it("should set fee-exempt for deployer, treasury, rewards, vesting, liquidity", async function () {
      const { brxu, owner, treasury, rewards, vesting, liquidity } =
        await loadFixture(deployBRXUFixture);
      expect(await brxu.feeExempt(owner.address)).to.be.true;
      expect(await brxu.feeExempt(treasury.address)).to.be.true;
      expect(await brxu.feeExempt(rewards.address)).to.be.true;
      expect(await brxu.feeExempt(vesting.address)).to.be.true;
      expect(await brxu.feeExempt(liquidity.address)).to.be.true;
    });

    it("should revert on zero address constructor args", async function () {
      const BRXU = await ethers.getContractFactory("BRXU");
      const [, t, r, v, l, m] = await ethers.getSigners();
      await expect(
        BRXU.deploy(ethers.ZeroAddress, r.address, v.address, l.address, m.address, t.address)
      ).to.be.revertedWith("BRXU: zero treasury");
    });

    it("should set default fee to 50 bps (0.5%)", async function () {
      const { brxu } = await loadFixture(deployBRXUFixture);
      expect(await brxu.feeBps()).to.equal(50);
    });

    it("should enable anti-bot by default", async function () {
      const { brxu } = await loadFixture(deployBRXUWithAntiBotFixture);
      expect(await brxu.antiBotEnabled()).to.be.true;
    });
  });

  describe("Transfer Fees", function () {
    it("should charge 0.5% fee on non-exempt transfers", async function () {
      const { brxu, treasury, alice, bob } = await loadFixture(
        deployBRXUFixture
      );

      // Transfer from treasury (exempt) to alice (non-exempt) — no fee
      const amount = ethers.parseEther("10000");
      await brxu.connect(treasury).transfer(alice.address, amount);

      // Transfer from alice (non-exempt) to bob (non-exempt) — 0.5% fee
      const sendAmount = ethers.parseEther("1000");
      const fee = (sendAmount * 50n) / 10000n; // 5 BRXU
      const net = sendAmount - fee;

      const treasuryBefore = await brxu.balanceOf(treasury.address);
      await brxu.connect(alice).transfer(bob.address, sendAmount);

      expect(await brxu.balanceOf(bob.address)).to.equal(net);
      expect(await brxu.balanceOf(treasury.address)).to.equal(
        treasuryBefore + fee
      );
    });

    it("should not charge fee for fee-exempt sender", async function () {
      const { brxu, treasury, alice } = await loadFixture(deployBRXUFixture);
      const amount = ethers.parseEther("1000");
      await brxu.connect(treasury).transfer(alice.address, amount);
      expect(await brxu.balanceOf(alice.address)).to.equal(amount);
    });

    it("should not charge fee for fee-exempt receiver", async function () {
      const { brxu, treasury, alice, owner } = await loadFixture(
        deployBRXUFixture
      );
      // alice is non-exempt, give her tokens
      await brxu.connect(treasury).transfer(alice.address, ethers.parseEther("10000"));

      // Set owner as fee-exempt receiver
      // Transfer from alice (non-exempt) to treasury (exempt) — no fee
      const amount = ethers.parseEther("1000");
      await brxu.connect(alice).transfer(treasury.address, amount);

      // treasury got full amount (fee exempt as receiver)
      const treasuryExpected =
        ethers.parseEther("400000000") -
        ethers.parseEther("10000") +
        amount;
      expect(await brxu.balanceOf(treasury.address)).to.equal(treasuryExpected);
    });
  });

  describe("Anti-Bot", function () {
    it("should enforce 10M token transfer limit in first 24h", async function () {
      const { brxu, treasury, alice, bob } = await loadFixture(
        deployBRXUWithAntiBotFixture
      );

      // Transfer under the limit to fund alice (treasury is fee-exempt but NOT anti-bot exempt)
      await brxu.connect(treasury).transfer(alice.address, ethers.parseEther("5000000"));
      await brxu.connect(treasury).transfer(alice.address, ethers.parseEther("5000000"));
      await brxu.connect(treasury).transfer(alice.address, ethers.parseEther("5000000"));

      // alice tries to send 15M (above 10M limit)
      const overLimit = ethers.parseEther("15000000");
      await expect(
        brxu.connect(alice).transfer(bob.address, overLimit)
      ).to.be.revertedWith("BRXU: exceeds anti-bot limit");
    });

    it("should allow transfers under the limit", async function () {
      const { brxu, treasury, alice, bob } = await loadFixture(
        deployBRXUWithAntiBotFixture
      );
      await brxu
        .connect(treasury)
        .transfer(alice.address, ethers.parseEther("8000000"));

      const underLimit = ethers.parseEther("5000000");
      await brxu.connect(alice).transfer(bob.address, underLimit);
      // Should succeed (fees apply)
    });

    it("should not enforce limit after 24 hours", async function () {
      const { brxu, treasury, alice, bob } = await loadFixture(
        deployBRXUWithAntiBotFixture
      );
      // Transfer in chunks under the limit
      await brxu.connect(treasury).transfer(alice.address, ethers.parseEther("10000000"));
      await brxu.connect(treasury).transfer(alice.address, ethers.parseEther("10000000"));

      // Advance 25 hours
      await time.increase(25 * 60 * 60);

      const overLimit = ethers.parseEther("15000000");
      await brxu.connect(alice).transfer(bob.address, overLimit);
      // Should succeed — past 24h window
    });

    it("should allow owner to permanently disable anti-bot", async function () {
      const { brxu, owner, treasury, alice, bob } = await loadFixture(
        deployBRXUWithAntiBotFixture
      );

      await brxu.connect(owner).disableAntiBot();
      expect(await brxu.antiBotEnabled()).to.be.false;

      // Now can transfer any amount
      await brxu.connect(treasury).transfer(alice.address, ethers.parseEther("20000000"));
      const overLimit = ethers.parseEther("15000000");
      await brxu.connect(alice).transfer(bob.address, overLimit);
      // Should succeed even within 24h
    });

    it("should emit AntiBotDisabled event", async function () {
      const { brxu, owner } = await loadFixture(deployBRXUWithAntiBotFixture);
      await expect(brxu.connect(owner).disableAntiBot())
        .to.emit(brxu, "AntiBotDisabled");
    });
  });

  describe("Owner Functions", function () {
    it("should allow owner to update fee", async function () {
      const { brxu, owner } = await loadFixture(deployBRXUFixture);
      await expect(brxu.connect(owner).setFeeBps(100))
        .to.emit(brxu, "FeeUpdated")
        .withArgs(50, 100);
      expect(await brxu.feeBps()).to.equal(100);
    });

    it("should reject fee above MAX_FEE_BPS (200)", async function () {
      const { brxu, owner } = await loadFixture(deployBRXUFixture);
      await expect(
        brxu.connect(owner).setFeeBps(201)
      ).to.be.revertedWith("BRXU: fee exceeds max");
    });

    it("should allow owner to update treasury", async function () {
      const { brxu, owner, alice } = await loadFixture(deployBRXUFixture);
      await expect(brxu.connect(owner).setTreasury(alice.address))
        .to.emit(brxu, "TreasuryUpdated");
      expect(await brxu.treasury()).to.equal(alice.address);
    });

    it("should reject zero address treasury", async function () {
      const { brxu, owner } = await loadFixture(deployBRXUFixture);
      await expect(
        brxu.connect(owner).setTreasury(ethers.ZeroAddress)
      ).to.be.revertedWith("BRXU: zero address");
    });

    it("should allow owner to set fee-exempt addresses", async function () {
      const { brxu, owner, alice } = await loadFixture(deployBRXUFixture);
      await brxu.connect(owner).setFeeExempt(alice.address, true);
      expect(await brxu.feeExempt(alice.address)).to.be.true;

      await brxu.connect(owner).setFeeExempt(alice.address, false);
      expect(await brxu.feeExempt(alice.address)).to.be.false;
    });

    it("should reject non-owner calls", async function () {
      const { brxu, alice } = await loadFixture(deployBRXUFixture);
      await expect(
        brxu.connect(alice).setFeeBps(100)
      ).to.be.revertedWithCustomError(brxu, "OwnableUnauthorizedAccount");
      await expect(
        brxu.connect(alice).setTreasury(alice.address)
      ).to.be.revertedWithCustomError(brxu, "OwnableUnauthorizedAccount");
      await expect(
        brxu.connect(alice).setFeeExempt(alice.address, true)
      ).to.be.revertedWithCustomError(brxu, "OwnableUnauthorizedAccount");
      await expect(
        brxu.connect(alice).disableAntiBot()
      ).to.be.revertedWithCustomError(brxu, "OwnableUnauthorizedAccount");
    });
  });

  describe("Pausable", function () {
    it("should allow owner to pause and unpause", async function () {
      const { brxu, owner, treasury, alice } = await loadFixture(
        deployBRXUFixture
      );
      await brxu.connect(owner).pause();
      await expect(
        brxu
          .connect(treasury)
          .transfer(alice.address, ethers.parseEther("100"))
      ).to.be.revertedWithCustomError(brxu, "EnforcedPause");

      await brxu.connect(owner).unpause();
      await brxu
        .connect(treasury)
        .transfer(alice.address, ethers.parseEther("100"));
    });

    it("should reject pause from non-owner", async function () {
      const { brxu, alice } = await loadFixture(deployBRXUFixture);
      await expect(
        brxu.connect(alice).pause()
      ).to.be.revertedWithCustomError(brxu, "OwnableUnauthorizedAccount");
    });
  });

  describe("Burn", function () {
    it("should allow anyone to burn their tokens", async function () {
      const { brxu, treasury, alice } = await loadFixture(deployBRXUFixture);
      await brxu
        .connect(treasury)
        .transfer(alice.address, ethers.parseEther("1000"));

      const burnAmount = ethers.parseEther("500");
      await expect(brxu.connect(alice).burn(burnAmount))
        .to.emit(brxu, "TokensBurned")
        .withArgs(alice.address, burnAmount);

      expect(await brxu.balanceOf(alice.address)).to.equal(
        ethers.parseEther("500")
      );
      expect(await brxu.totalSupply()).to.equal(
        ethers.parseEther("1000000000") - burnAmount
      );
    });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
//  BRXUStaking Tests
// ─────────────────────────────────────────────────────────────────────────────

describe("BRXUStaking", function () {
  async function deployStakingFixture() {
    const base = await loadFixture(deployBRXUFixture);
    const { brxu, brxuAddress, owner, treasury, alice, bob } = base;

    const BRXUStaking = await ethers.getContractFactory("BRXUStaking");
    const staking = await BRXUStaking.deploy(brxuAddress);
    const stakingAddress = await staking.getAddress();

    // Set staking as fee-exempt
    await brxu.connect(owner).setFeeExempt(stakingAddress, true);

    // Transfer tokens to test users from treasury (fee-exempt)
    await brxu
      .connect(treasury)
      .transfer(alice.address, ethers.parseEther("100000"));
    await brxu
      .connect(treasury)
      .transfer(bob.address, ethers.parseEther("100000"));

    return { ...base, staking, stakingAddress };
  }

  describe("Staking", function () {
    it("should allow users to stake tokens", async function () {
      const { brxu, staking, stakingAddress, alice } = await loadFixture(
        deployStakingFixture
      );
      const amount = ethers.parseEther("1000");
      await brxu.connect(alice).approve(stakingAddress, amount);
      await expect(staking.connect(alice).stake(amount))
        .to.emit(staking, "Staked")
        .withArgs(alice.address, amount);

      expect(await staking.totalStaked()).to.equal(amount);
      expect(await staking.stakedBalance(alice.address)).to.equal(amount);
      expect(await staking.stakerCount()).to.equal(1);
    });

    it("should reject staking zero amount", async function () {
      const { staking, alice } = await loadFixture(deployStakingFixture);
      await expect(
        staking.connect(alice).stake(0)
      ).to.be.revertedWith("BRXUStaking: zero amount");
    });

    it("should track multiple stakers", async function () {
      const { brxu, staking, stakingAddress, alice, bob } = await loadFixture(
        deployStakingFixture
      );
      const amount = ethers.parseEther("1000");
      await brxu.connect(alice).approve(stakingAddress, amount);
      await staking.connect(alice).stake(amount);

      await brxu.connect(bob).approve(stakingAddress, amount);
      await staking.connect(bob).stake(amount);

      expect(await staking.stakerCount()).to.equal(2);
      expect(await staking.totalStaked()).to.equal(amount * 2n);
    });
  });

  describe("Unstaking (No Lock Period)", function () {
    it("should allow immediate unstaking", async function () {
      const { brxu, staking, stakingAddress, alice } = await loadFixture(
        deployStakingFixture
      );
      const amount = ethers.parseEther("1000");
      await brxu.connect(alice).approve(stakingAddress, amount);
      await staking.connect(alice).stake(amount);

      // Unstake immediately — no lock period
      const balBefore = await brxu.balanceOf(alice.address);
      await expect(staking.connect(alice).unstake(amount))
        .to.emit(staking, "Unstaked")
        .withArgs(alice.address, amount);

      expect(await brxu.balanceOf(alice.address)).to.equal(
        balBefore + amount
      );
      expect(await staking.totalStaked()).to.equal(0);
    });

    it("should reject unstaking more than staked", async function () {
      const { brxu, staking, stakingAddress, alice } = await loadFixture(
        deployStakingFixture
      );
      const amount = ethers.parseEther("1000");
      await brxu.connect(alice).approve(stakingAddress, amount);
      await staking.connect(alice).stake(amount);

      await expect(
        staking.connect(alice).unstake(ethers.parseEther("2000"))
      ).to.be.revertedWith("BRXUStaking: insufficient balance");
    });

    it("should reject unstaking zero", async function () {
      const { staking, alice } = await loadFixture(deployStakingFixture);
      await expect(
        staking.connect(alice).unstake(0)
      ).to.be.revertedWith("BRXUStaking: zero amount");
    });
  });

  describe("Rewards", function () {
    it("should accrue rewards over time after funding", async function () {
      const { brxu, staking, stakingAddress, owner, treasury, alice } =
        await loadFixture(deployStakingFixture);

      // Alice stakes 10,000
      const stakeAmount = ethers.parseEther("10000");
      await brxu.connect(alice).approve(stakingAddress, stakeAmount);
      await staking.connect(alice).stake(stakeAmount);

      // Owner funds rewards: 1250 BRXU over 365 days (12.5% APY on 10k)
      const rewardAmount = ethers.parseEther("1250");
      await brxu.connect(treasury).transfer(owner.address, rewardAmount);
      await brxu.connect(owner).approve(stakingAddress, rewardAmount);
      await staking
        .connect(owner)
        .fundRewards(rewardAmount, 365 * 24 * 60 * 60);

      // Advance 1 year
      await time.increase(365 * 24 * 60 * 60);

      // Check rewards
      const pending = await staking.pendingRewards(alice.address);
      // Should be close to 1250 (minus rounding from integer division)
      expect(pending).to.be.closeTo(rewardAmount, ethers.parseEther("1"));
    });

    it("should distribute rewards proportionally", async function () {
      const { brxu, staking, stakingAddress, owner, treasury, alice, bob } =
        await loadFixture(deployStakingFixture);

      // Alice stakes 3000, Bob stakes 1000
      await brxu
        .connect(alice)
        .approve(stakingAddress, ethers.parseEther("3000"));
      await staking.connect(alice).stake(ethers.parseEther("3000"));

      await brxu
        .connect(bob)
        .approve(stakingAddress, ethers.parseEther("1000"));
      await staking.connect(bob).stake(ethers.parseEther("1000"));

      // Fund 4000 BRXU over 1 day
      const rewardAmount = ethers.parseEther("4000");
      await brxu.connect(treasury).transfer(owner.address, rewardAmount);
      await brxu.connect(owner).approve(stakingAddress, rewardAmount);
      await staking
        .connect(owner)
        .fundRewards(rewardAmount, 24 * 60 * 60);

      // Advance 1 day
      await time.increase(24 * 60 * 60);

      // Alice should get ~75%, Bob ~25%
      const alicePending = await staking.pendingRewards(alice.address);
      const bobPending = await staking.pendingRewards(bob.address);

      expect(alicePending).to.be.closeTo(
        ethers.parseEther("3000"),
        ethers.parseEther("1")
      );
      expect(bobPending).to.be.closeTo(
        ethers.parseEther("1000"),
        ethers.parseEther("1")
      );
    });

    it("should allow claiming rewards", async function () {
      const { brxu, staking, stakingAddress, owner, treasury, alice } =
        await loadFixture(deployStakingFixture);

      await brxu
        .connect(alice)
        .approve(stakingAddress, ethers.parseEther("10000"));
      await staking.connect(alice).stake(ethers.parseEther("10000"));

      const rewardAmount = ethers.parseEther("1000");
      await brxu.connect(treasury).transfer(owner.address, rewardAmount);
      await brxu.connect(owner).approve(stakingAddress, rewardAmount);
      await staking
        .connect(owner)
        .fundRewards(rewardAmount, 24 * 60 * 60);

      await time.increase(24 * 60 * 60);

      const balBefore = await brxu.balanceOf(alice.address);
      await expect(staking.connect(alice).claimRewards()).to.emit(
        staking,
        "RewardsClaimed"
      );
      const balAfter = await brxu.balanceOf(alice.address);

      expect(balAfter - balBefore).to.be.closeTo(
        rewardAmount,
        ethers.parseEther("1")
      );
    });

    it("should reject claiming with no rewards", async function () {
      const { brxu, staking, stakingAddress, alice } = await loadFixture(
        deployStakingFixture
      );
      await brxu
        .connect(alice)
        .approve(stakingAddress, ethers.parseEther("1000"));
      await staking.connect(alice).stake(ethers.parseEther("1000"));

      await expect(
        staking.connect(alice).claimRewards()
      ).to.be.revertedWith("BRXUStaking: no rewards");
    });

    it("should handle rolling over leftover rewards to new period", async function () {
      const { brxu, staking, stakingAddress, owner, treasury, alice } =
        await loadFixture(deployStakingFixture);

      await brxu
        .connect(alice)
        .approve(stakingAddress, ethers.parseEther("10000"));
      await staking.connect(alice).stake(ethers.parseEther("10000"));

      // First funding
      const reward1 = ethers.parseEther("1000");
      await brxu.connect(treasury).transfer(owner.address, reward1);
      await brxu.connect(owner).approve(stakingAddress, reward1);
      await staking
        .connect(owner)
        .fundRewards(reward1, 24 * 60 * 60);

      // After half the period, fund again
      await time.increase(12 * 60 * 60);

      const reward2 = ethers.parseEther("2000");
      await brxu.connect(treasury).transfer(owner.address, reward2);
      await brxu.connect(owner).approve(stakingAddress, reward2);
      await staking
        .connect(owner)
        .fundRewards(reward2, 24 * 60 * 60);

      // Total rewards = 500 (from first half) + leftover 500 + 2000 = 3000 over new period
      // After full new period
      await time.increase(24 * 60 * 60);

      const pending = await staking.pendingRewards(alice.address);
      // Should be close to 2500 (500 accrued + 2000 new period) + leftover
      expect(pending).to.be.closeTo(
        ethers.parseEther("3000"),
        ethers.parseEther("2")
      );
    });
  });

  describe("Access Control", function () {
    it("should reject fundRewards from non-owner", async function () {
      const { staking, alice } = await loadFixture(deployStakingFixture);
      await expect(
        staking.connect(alice).fundRewards(ethers.parseEther("1000"), 86400)
      ).to.be.revertedWithCustomError(staking, "OwnableUnauthorizedAccount");
    });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
//  BRXUVesting Tests
// ─────────────────────────────────────────────────────────────────────────────

describe("BRXUVesting", function () {
  async function deployVestingFixture() {
    const base = await loadFixture(deployBRXUFixture);
    const { brxu, brxuAddress, owner, treasury, alice, bob } = base;

    const BRXUVesting = await ethers.getContractFactory("BRXUVesting");
    const vesting = await BRXUVesting.deploy(brxuAddress);
    const vestingAddress = await vesting.getAddress();

    // Set vesting as fee-exempt
    await brxu.connect(owner).setFeeExempt(vestingAddress, true);

    // Give owner tokens to create vesting schedules
    await brxu
      .connect(treasury)
      .transfer(owner.address, ethers.parseEther("50000000"));

    return { ...base, vesting, vestingAddress };
  }

  describe("Creating Vesting Schedules", function () {
    it("should create a default vesting schedule (6mo cliff, 24mo)", async function () {
      const { brxu, vesting, vestingAddress, owner, alice } = await loadFixture(
        deployVestingFixture
      );
      const amount = ethers.parseEther("1000000");
      await brxu.connect(owner).approve(vestingAddress, amount);

      await expect(
        vesting.connect(owner).createDefaultVesting(alice.address, amount)
      )
        .to.emit(vesting, "VestingCreated")
        .withArgs(alice.address, amount, 180 * 24 * 60 * 60, 730 * 24 * 60 * 60);

      const schedule = await vesting.schedules(alice.address);
      expect(schedule.totalAmount).to.equal(amount);
      expect(schedule.released).to.equal(0);
      expect(schedule.cliffDuration).to.equal(180 * 24 * 60 * 60);
      expect(schedule.vestingDuration).to.equal(730 * 24 * 60 * 60);
      expect(schedule.revoked).to.be.false;
    });

    it("should create a custom vesting schedule", async function () {
      const { brxu, vesting, vestingAddress, owner, alice } = await loadFixture(
        deployVestingFixture
      );
      const amount = ethers.parseEther("500000");
      const cliff = 90 * 24 * 60 * 60; // 3 months
      const duration = 365 * 24 * 60 * 60; // 12 months

      await brxu.connect(owner).approve(vestingAddress, amount);
      await vesting
        .connect(owner)
        .createVesting(alice.address, amount, cliff, duration);

      const schedule = await vesting.schedules(alice.address);
      expect(schedule.totalAmount).to.equal(amount);
      expect(schedule.cliffDuration).to.equal(cliff);
      expect(schedule.vestingDuration).to.equal(duration);
    });

    it("should reject duplicate vesting for same beneficiary", async function () {
      const { brxu, vesting, vestingAddress, owner, alice } = await loadFixture(
        deployVestingFixture
      );
      const amount = ethers.parseEther("100000");
      await brxu
        .connect(owner)
        .approve(vestingAddress, ethers.parseEther("200000"));
      await vesting.connect(owner).createDefaultVesting(alice.address, amount);

      await expect(
        vesting.connect(owner).createDefaultVesting(alice.address, amount)
      ).to.be.revertedWith("BRXUVesting: schedule exists");
    });

    it("should reject vesting with duration <= cliff", async function () {
      const { brxu, vesting, vestingAddress, owner, alice } = await loadFixture(
        deployVestingFixture
      );
      const amount = ethers.parseEther("100000");
      await brxu.connect(owner).approve(vestingAddress, amount);

      await expect(
        vesting
          .connect(owner)
          .createVesting(alice.address, amount, 365 * 86400, 180 * 86400) // cliff > duration
      ).to.be.revertedWith("BRXUVesting: duration <= cliff");
    });

    it("should reject zero amount", async function () {
      const { vesting, owner, alice } = await loadFixture(
        deployVestingFixture
      );
      await expect(
        vesting.connect(owner).createDefaultVesting(alice.address, 0)
      ).to.be.revertedWith("BRXUVesting: zero amount");
    });

    it("should reject non-owner creating vesting", async function () {
      const { vesting, alice, bob } = await loadFixture(deployVestingFixture);
      await expect(
        vesting
          .connect(alice)
          .createDefaultVesting(bob.address, ethers.parseEther("1000"))
      ).to.be.revertedWithCustomError(vesting, "OwnableUnauthorizedAccount");
    });
  });

  describe("Releasing Tokens", function () {
    it("should release nothing before cliff", async function () {
      const { brxu, vesting, vestingAddress, owner, alice } = await loadFixture(
        deployVestingFixture
      );
      const amount = ethers.parseEther("1000000");
      await brxu.connect(owner).approve(vestingAddress, amount);
      await vesting.connect(owner).createDefaultVesting(alice.address, amount);

      // Advance 3 months (before 6-month cliff)
      await time.increase(90 * 24 * 60 * 60);

      expect(await vesting.vestedAmount(alice.address)).to.equal(0);
      expect(await vesting.releasableAmount(alice.address)).to.equal(0);

      await expect(
        vesting.connect(alice).release()
      ).to.be.revertedWith("BRXUVesting: nothing to release");
    });

    it("should vest linearly after cliff", async function () {
      const { brxu, vesting, vestingAddress, owner, alice } = await loadFixture(
        deployVestingFixture
      );
      const amount = ethers.parseEther("730000"); // Easy math: 1000/day
      await brxu.connect(owner).approve(vestingAddress, amount);
      await vesting.connect(owner).createDefaultVesting(alice.address, amount);

      // Advance to just past cliff (180 days)
      await time.increase(180 * 24 * 60 * 60 + 1);

      const vested = await vesting.vestedAmount(alice.address);
      // ~180/730 * 730000 = ~180000
      expect(vested).to.be.closeTo(
        ethers.parseEther("180000"),
        ethers.parseEther("100")
      );
    });

    it("should release vested tokens", async function () {
      const { brxu, vesting, vestingAddress, owner, alice } = await loadFixture(
        deployVestingFixture
      );
      const amount = ethers.parseEther("1000000");
      await brxu.connect(owner).approve(vestingAddress, amount);
      await vesting.connect(owner).createDefaultVesting(alice.address, amount);

      // Advance past cliff (365 days = ~50% vested in 730-day schedule)
      await time.increase(365 * 24 * 60 * 60);

      const balBefore = await brxu.balanceOf(alice.address);
      await expect(vesting.connect(alice).release()).to.emit(
        vesting,
        "TokensReleased"
      );
      const balAfter = await brxu.balanceOf(alice.address);

      const released = balAfter - balBefore;
      expect(released).to.be.closeTo(
        ethers.parseEther("500000"),
        ethers.parseEther("1000")
      );
    });

    it("should vest 100% after full duration", async function () {
      const { brxu, vesting, vestingAddress, owner, alice } = await loadFixture(
        deployVestingFixture
      );
      const amount = ethers.parseEther("1000000");
      await brxu.connect(owner).approve(vestingAddress, amount);
      await vesting.connect(owner).createDefaultVesting(alice.address, amount);

      // Advance past full duration (730 days)
      await time.increase(731 * 24 * 60 * 60);

      expect(await vesting.vestedAmount(alice.address)).to.equal(amount);

      await vesting.connect(alice).release();
      expect(await brxu.balanceOf(alice.address)).to.equal(amount);
    });
  });

  describe("Revocation", function () {
    it("should allow owner to revoke vesting", async function () {
      const { brxu, vesting, vestingAddress, owner, alice } = await loadFixture(
        deployVestingFixture
      );
      const amount = ethers.parseEther("1000000");
      await brxu.connect(owner).approve(vestingAddress, amount);
      await vesting.connect(owner).createDefaultVesting(alice.address, amount);

      // Advance past cliff (365 days)
      await time.increase(365 * 24 * 60 * 60);

      const ownerBalBefore = await brxu.balanceOf(owner.address);
      await expect(vesting.connect(owner).revoke(alice.address))
        .to.emit(vesting, "VestingRevoked");

      // Owner should receive unvested tokens (~50%)
      const ownerBalAfter = await brxu.balanceOf(owner.address);
      const returned = ownerBalAfter - ownerBalBefore;
      expect(returned).to.be.closeTo(
        ethers.parseEther("500000"),
        ethers.parseEther("1000")
      );

      // Schedule should be marked revoked
      const schedule = await vesting.schedules(alice.address);
      expect(schedule.revoked).to.be.true;
    });

    it("should not allow releasing after revocation", async function () {
      const { brxu, vesting, vestingAddress, owner, alice } = await loadFixture(
        deployVestingFixture
      );
      const amount = ethers.parseEther("1000000");
      await brxu.connect(owner).approve(vestingAddress, amount);
      await vesting.connect(owner).createDefaultVesting(alice.address, amount);

      await time.increase(365 * 24 * 60 * 60);
      await vesting.connect(owner).revoke(alice.address);

      await expect(
        vesting.connect(alice).release()
      ).to.be.revertedWith("BRXUVesting: revoked");
    });

    it("should reject revoking non-existent schedule", async function () {
      const { vesting, owner, bob } = await loadFixture(deployVestingFixture);
      await expect(
        vesting.connect(owner).revoke(bob.address)
      ).to.be.revertedWith("BRXUVesting: no schedule");
    });

    it("should reject double revocation", async function () {
      const { brxu, vesting, vestingAddress, owner, alice } = await loadFixture(
        deployVestingFixture
      );
      const amount = ethers.parseEther("1000000");
      await brxu.connect(owner).approve(vestingAddress, amount);
      await vesting.connect(owner).createDefaultVesting(alice.address, amount);

      await vesting.connect(owner).revoke(alice.address);
      await expect(
        vesting.connect(owner).revoke(alice.address)
      ).to.be.revertedWith("BRXUVesting: already revoked");
    });

    it("should reject revoke from non-owner", async function () {
      const { brxu, vesting, vestingAddress, owner, alice, bob } =
        await loadFixture(deployVestingFixture);
      const amount = ethers.parseEther("100000");
      await brxu.connect(owner).approve(vestingAddress, amount);
      await vesting.connect(owner).createDefaultVesting(alice.address, amount);

      await expect(
        vesting.connect(bob).revoke(alice.address)
      ).to.be.revertedWithCustomError(vesting, "OwnableUnauthorizedAccount");
    });
  });

  describe("View Functions", function () {
    it("should report beneficiary count", async function () {
      const { brxu, vesting, vestingAddress, owner, alice, bob } =
        await loadFixture(deployVestingFixture);
      await brxu
        .connect(owner)
        .approve(vestingAddress, ethers.parseEther("2000000"));
      await vesting
        .connect(owner)
        .createDefaultVesting(alice.address, ethers.parseEther("1000000"));
      await vesting
        .connect(owner)
        .createDefaultVesting(bob.address, ethers.parseEther("1000000"));

      expect(await vesting.beneficiaryCount()).to.equal(2);
    });

    it("should return 0 releasable for revoked schedule", async function () {
      const { brxu, vesting, vestingAddress, owner, alice } = await loadFixture(
        deployVestingFixture
      );
      const amount = ethers.parseEther("100000");
      await brxu.connect(owner).approve(vestingAddress, amount);
      await vesting.connect(owner).createDefaultVesting(alice.address, amount);

      await time.increase(365 * 86400);
      await vesting.connect(owner).revoke(alice.address);

      expect(await vesting.releasableAmount(alice.address)).to.equal(0);
    });
  });
});
