// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title BrixStaking
 * @author BrixUp Team
 * @notice Stake $BRIX tokens to earn yield and gain priority access to new
 *         deals on the BrixUp platform.
 * @dev Implements a share-based reward model. When the owner deposits reward
 *      tokens via `distributeRewards()`, the accumulated reward-per-share
 *      increases proportionally. Each staker can claim their pending rewards
 *      at any time. A 7-day minimum lock period is enforced on unstaking.
 *
 *      Reward math (scaled by 1e18 for precision):
 *        accRewardPerShare += rewardAmount * 1e18 / totalStaked
 *        pending = (staked * accRewardPerShare / 1e18) - rewardDebt
 */
contract BrixStaking is ReentrancyGuard, Ownable {
    using SafeERC20 for IERC20;

    // -------------------------------------------------------------------------
    //  Constants
    // -------------------------------------------------------------------------

    /// @notice Minimum time a stake must be locked before unstaking (7 days).
    uint256 public constant LOCK_PERIOD = 7 days;

    /// @notice Precision multiplier for reward-per-share calculations.
    uint256 private constant ACC_PRECISION = 1e18;

    // -------------------------------------------------------------------------
    //  State variables
    // -------------------------------------------------------------------------

    /// @notice Reference to the $BRIX ERC-20 token contract.
    IERC20 public brixToken;

    /// @notice Total BRIX currently staked across all users.
    uint256 public totalStaked;

    /// @notice Accumulated reward per staked token (scaled by ACC_PRECISION).
    uint256 public accRewardPerShare;

    /// @notice Total rewards that have been distributed into the pool.
    uint256 public totalRewardsDistributed;

    // -------------------------------------------------------------------------
    //  Staker accounting
    // -------------------------------------------------------------------------

    /// @notice Per-staker information.
    struct StakerInfo {
        uint256 amount;       // BRIX staked
        uint256 rewardDebt;   // reward debt for share-based accounting
        uint256 stakedAt;     // timestamp of latest stake action
        uint256 pendingClaim; // rewards ready to claim (buffered on state change)
    }

    /// @notice Staker data keyed by address.
    mapping(address => StakerInfo) public stakers;

    /// @notice Ordered list of unique staker addresses.
    address[] public stakerList;

    /// @notice Quick look-up for duplicate prevention.
    mapping(address => bool) private _isStaker;

    // -------------------------------------------------------------------------
    //  Events
    // -------------------------------------------------------------------------

    /// @notice Emitted when a user stakes BRIX tokens.
    event Staked(address indexed user, uint256 amount, uint256 totalStaked);

    /// @notice Emitted when a user unstakes BRIX tokens.
    event Unstaked(address indexed user, uint256 amount, uint256 totalStaked);

    /// @notice Emitted when a user claims their accumulated rewards.
    event RewardsClaimed(address indexed user, uint256 amount);

    /// @notice Emitted when the owner deposits rewards into the pool.
    event RewardsDistributed(uint256 amount, uint256 newAccRewardPerShare);

    // -------------------------------------------------------------------------
    //  Constructor
    // -------------------------------------------------------------------------

    /**
     * @notice Deploy the BrixStaking contract.
     * @param _brixToken Address of the BrixToken ERC-20 contract.
     */
    constructor(address _brixToken) Ownable(msg.sender) {
        require(_brixToken != address(0), "BrixStaking: token is zero address");
        brixToken = IERC20(_brixToken);
    }

    // -------------------------------------------------------------------------
    //  Staking
    // -------------------------------------------------------------------------

    /**
     * @notice Stake $BRIX tokens into the pool.
     * @dev The caller must have approved this contract to spend at least
     *      `amount` BRIX. Any pending rewards are buffered into `pendingClaim`
     *      before the staker's balance and debt are updated.
     * @param amount Number of BRIX tokens to stake (in wei).
     */
    function stake(uint256 amount) external nonReentrant {
        require(amount > 0, "BrixStaking: amount must be > 0");

        StakerInfo storage info = stakers[msg.sender];

        // Buffer any pending rewards before changing stake.
        if (info.amount > 0) {
            uint256 pending = (info.amount * accRewardPerShare) / ACC_PRECISION - info.rewardDebt;
            if (pending > 0) {
                info.pendingClaim += pending;
            }
        }

        brixToken.safeTransferFrom(msg.sender, address(this), amount);

        if (!_isStaker[msg.sender]) {
            stakerList.push(msg.sender);
            _isStaker[msg.sender] = true;
        }

        info.amount += amount;
        info.stakedAt = block.timestamp;
        info.rewardDebt = (info.amount * accRewardPerShare) / ACC_PRECISION;
        totalStaked += amount;

        emit Staked(msg.sender, amount, totalStaked);
    }

    /**
     * @notice Unstake $BRIX tokens from the pool.
     * @dev Enforces a 7-day minimum lock from the last stake action. Any
     *      pending rewards are buffered before the balance is reduced.
     * @param amount Number of BRIX tokens to unstake (in wei).
     */
    function unstake(uint256 amount) external nonReentrant {
        StakerInfo storage info = stakers[msg.sender];
        require(amount > 0, "BrixStaking: amount must be > 0");
        require(info.amount >= amount, "BrixStaking: insufficient staked balance");
        require(
            block.timestamp >= info.stakedAt + LOCK_PERIOD,
            "BrixStaking: tokens locked for 7 days"
        );

        // Buffer pending rewards.
        uint256 pending = (info.amount * accRewardPerShare) / ACC_PRECISION - info.rewardDebt;
        if (pending > 0) {
            info.pendingClaim += pending;
        }

        info.amount -= amount;
        info.rewardDebt = (info.amount * accRewardPerShare) / ACC_PRECISION;
        totalStaked -= amount;

        brixToken.safeTransfer(msg.sender, amount);

        emit Unstaked(msg.sender, amount, totalStaked);
    }

    // -------------------------------------------------------------------------
    //  Rewards
    // -------------------------------------------------------------------------

    /**
     * @notice Claim all accumulated staking rewards.
     * @dev Combines the buffered `pendingClaim` with any newly accrued
     *      rewards since the last state change.
     */
    function claimRewards() external nonReentrant {
        StakerInfo storage info = stakers[msg.sender];

        uint256 pending = 0;
        if (info.amount > 0) {
            pending = (info.amount * accRewardPerShare) / ACC_PRECISION - info.rewardDebt;
        }
        uint256 totalOwed = pending + info.pendingClaim;
        require(totalOwed > 0, "BrixStaking: no rewards to claim");

        info.pendingClaim = 0;
        info.rewardDebt = (info.amount * accRewardPerShare) / ACC_PRECISION;

        brixToken.safeTransfer(msg.sender, totalOwed);

        emit RewardsClaimed(msg.sender, totalOwed);
    }

    /**
     * @notice Owner deposits reward tokens into the pool for stakers.
     * @dev The owner must have approved this contract to spend at least
     *      `amount` BRIX. The accumulated reward-per-share is updated
     *      proportionally. If there are no stakers, the call reverts to
     *      prevent lost rewards.
     * @param amount Number of BRIX tokens to add to the reward pool.
     */
    function distributeRewards(uint256 amount) external onlyOwner nonReentrant {
        require(amount > 0, "BrixStaking: amount must be > 0");
        require(totalStaked > 0, "BrixStaking: no stakers");

        brixToken.safeTransferFrom(msg.sender, address(this), amount);

        accRewardPerShare += (amount * ACC_PRECISION) / totalStaked;
        totalRewardsDistributed += amount;

        emit RewardsDistributed(amount, accRewardPerShare);
    }

    // -------------------------------------------------------------------------
    //  View helpers
    // -------------------------------------------------------------------------

    /**
     * @notice Calculate pending (unclaimed) rewards for a staker.
     * @param user Address of the staker.
     * @return Total pending rewards (buffered + newly accrued).
     */
    function pendingRewards(address user) external view returns (uint256) {
        StakerInfo storage info = stakers[user];
        uint256 pending = 0;
        if (info.amount > 0) {
            pending = (info.amount * accRewardPerShare) / ACC_PRECISION - info.rewardDebt;
        }
        return pending + info.pendingClaim;
    }

    /**
     * @notice Return the staked balance of a user.
     * @param user Address of the staker.
     * @return BRIX tokens staked.
     */
    function stakedBalance(address user) external view returns (uint256) {
        return stakers[user].amount;
    }

    /**
     * @notice Return the total number of unique stakers.
     * @return Count of stakers.
     */
    function stakerCount() external view returns (uint256) {
        return stakerList.length;
    }
}
