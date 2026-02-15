// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title BRIXStaking
 * @notice Stake $BRIX tokens and earn 12.5% APY rewards.
 *         No lock period — stake and unstake at any time.
 * @dev Uses a Synthetix-style reward-per-token accumulator. The owner funds
 *      the reward pool with a fixed amount over a set duration, which defines
 *      a constant rewardRate (tokens/second). Rewards accrue proportionally
 *      to each staker's share of totalStaked.
 *
 *      Target APY: 12.5% (configured off-chain via fundRewards params).
 *      Example: 200M reward pool staked → fund 25M BRIX over 365 days.
 *
 * @dev Deployed on Base L2 (Chain ID 8453).
 */
contract BRIXStaking is ReentrancyGuard, Ownable {
    using SafeERC20 for IERC20;

    // ─── Immutables ─────────────────────────────────────────────────────
    IERC20 public immutable brixToken;

    // ─── Reward State ───────────────────────────────────────────────────
    uint256 public rewardRate;              // BRIX per second
    uint256 public rewardsDuration;         // current period length
    uint256 public periodFinish;            // when current period ends
    uint256 public lastUpdateTime;          // last accrual timestamp
    uint256 public rewardPerTokenStored;    // accumulated reward/token (1e18)

    // ─── Staker State ───────────────────────────────────────────────────
    mapping(address => uint256) public userRewardPerTokenPaid;
    mapping(address => uint256) public rewards;
    mapping(address => uint256) public stakedBalances;
    uint256 public totalStaked;

    // ─── Staker Tracking ────────────────────────────────────────────────
    address[] public stakerList;
    mapping(address => bool) private _isStaker;

    // ─── Events ─────────────────────────────────────────────────────────
    event Staked(address indexed user, uint256 amount);
    event Unstaked(address indexed user, uint256 amount);
    event RewardsClaimed(address indexed user, uint256 amount);
    event RewardsFunded(uint256 amount, uint256 duration);

    // ─── Constructor ────────────────────────────────────────────────────
    constructor(address _brixToken) Ownable(msg.sender) {
        require(_brixToken != address(0), "BRIXStaking: zero token");
        brixToken = IERC20(_brixToken);
    }

    // ─── Modifiers ──────────────────────────────────────────────────────

    modifier updateReward(address account) {
        rewardPerTokenStored = rewardPerToken();
        lastUpdateTime = lastTimeRewardApplicable();
        if (account != address(0)) {
            rewards[account] = earned(account);
            userRewardPerTokenPaid[account] = rewardPerTokenStored;
        }
        _;
    }

    // ─── View Functions ─────────────────────────────────────────────────

    function lastTimeRewardApplicable() public view returns (uint256) {
        return block.timestamp < periodFinish ? block.timestamp : periodFinish;
    }

    function rewardPerToken() public view returns (uint256) {
        if (totalStaked == 0) return rewardPerTokenStored;
        return
            rewardPerTokenStored +
            ((lastTimeRewardApplicable() - lastUpdateTime) *
                rewardRate *
                1e18) /
            totalStaked;
    }

    function earned(address account) public view returns (uint256) {
        return
            (stakedBalances[account] *
                (rewardPerToken() - userRewardPerTokenPaid[account])) /
            1e18 +
            rewards[account];
    }

    /// @notice Returns pending rewards for a user (alias for earned).
    function pendingRewards(address account) external view returns (uint256) {
        return earned(account);
    }

    /// @notice Returns staked balance for a user.
    function stakedBalance(address account) external view returns (uint256) {
        return stakedBalances[account];
    }

    /// @notice Returns number of unique stakers.
    function stakerCount() external view returns (uint256) {
        return stakerList.length;
    }

    // ─── Staking Functions ──────────────────────────────────────────────

    /// @notice Stake BRIX tokens. No lock period.
    function stake(uint256 amount)
        external
        nonReentrant
        updateReward(msg.sender)
    {
        require(amount > 0, "BRIXStaking: zero amount");

        brixToken.safeTransferFrom(msg.sender, address(this), amount);

        if (!_isStaker[msg.sender]) {
            stakerList.push(msg.sender);
            _isStaker[msg.sender] = true;
        }

        stakedBalances[msg.sender] += amount;
        totalStaked += amount;

        emit Staked(msg.sender, amount);
    }

    /// @notice Unstake BRIX tokens. No lock period — withdraw any time.
    function unstake(uint256 amount)
        external
        nonReentrant
        updateReward(msg.sender)
    {
        require(amount > 0, "BRIXStaking: zero amount");
        require(
            stakedBalances[msg.sender] >= amount,
            "BRIXStaking: insufficient balance"
        );

        stakedBalances[msg.sender] -= amount;
        totalStaked -= amount;

        brixToken.safeTransfer(msg.sender, amount);

        emit Unstaked(msg.sender, amount);
    }

    /// @notice Claim all pending staking rewards.
    function claimRewards()
        external
        nonReentrant
        updateReward(msg.sender)
    {
        uint256 reward = rewards[msg.sender];
        require(reward > 0, "BRIXStaking: no rewards");

        rewards[msg.sender] = 0;
        brixToken.safeTransfer(msg.sender, reward);

        emit RewardsClaimed(msg.sender, reward);
    }

    // ─── Owner Functions ────────────────────────────────────────────────

    /**
     * @notice Fund the reward pool with BRIX tokens.
     * @dev    Tokens must be approved before calling. If an existing period
     *         is still active, leftover rewards roll into the new period.
     *
     *         To achieve 12.5% APY on totalStaked:
     *           amount  = totalStaked * 0.125
     *           duration = 365 days
     *
     * @param amount   Total reward tokens to distribute
     * @param duration Duration in seconds over which to distribute
     */
    function fundRewards(uint256 amount, uint256 duration)
        external
        onlyOwner
        updateReward(address(0))
    {
        require(amount > 0, "BRIXStaking: zero amount");
        require(duration > 0, "BRIXStaking: zero duration");

        brixToken.safeTransferFrom(msg.sender, address(this), amount);

        if (block.timestamp >= periodFinish) {
            rewardRate = amount / duration;
        } else {
            uint256 remaining = periodFinish - block.timestamp;
            uint256 leftover = remaining * rewardRate;
            rewardRate = (leftover + amount) / duration;
        }

        lastUpdateTime = block.timestamp;
        periodFinish = block.timestamp + duration;
        rewardsDuration = duration;

        emit RewardsFunded(amount, duration);
    }
}
