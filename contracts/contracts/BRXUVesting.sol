// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title BRXUVesting
 * @notice Linear token vesting for Team & Advisors allocation (150M BRXU).
 *         6-month cliff, 24-month total linear vesting, revocable by owner.
 * @dev Each beneficiary has an independent vesting schedule. After the cliff,
 *      tokens vest linearly until the full duration elapses. The owner can
 *      revoke a beneficiary's unvested tokens at any time.
 *
 * @dev Deployed on Base L2 (Chain ID 8453).
 */
contract BRXUVesting is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    // ─── Immutables ─────────────────────────────────────────────────────
    IERC20 public immutable brxuToken;

    // ─── Constants ──────────────────────────────────────────────────────
    uint256 public constant DEFAULT_CLIFF = 180 days;   // 6 months
    uint256 public constant DEFAULT_DURATION = 730 days; // ~24 months

    // ─── Types ──────────────────────────────────────────────────────────
    struct VestingSchedule {
        uint256 totalAmount;      // total tokens to vest
        uint256 released;         // tokens already released
        uint256 startTime;        // vesting start timestamp
        uint256 cliffDuration;    // cliff in seconds
        uint256 vestingDuration;  // total vesting duration in seconds
        bool revoked;             // whether revoked by owner
    }

    // ─── State ──────────────────────────────────────────────────────────
    mapping(address => VestingSchedule) public schedules;
    address[] public beneficiaries;

    // ─── Events ─────────────────────────────────────────────────────────
    event VestingCreated(
        address indexed beneficiary,
        uint256 amount,
        uint256 cliff,
        uint256 duration
    );
    event TokensReleased(address indexed beneficiary, uint256 amount);
    event VestingRevoked(address indexed beneficiary, uint256 unvested);

    // ─── Constructor ────────────────────────────────────────────────────
    constructor(address _brxuToken) Ownable(msg.sender) {
        require(_brxuToken != address(0), "BRXUVesting: zero token");
        brxuToken = IERC20(_brxuToken);
    }

    // ─── Owner Functions ────────────────────────────────────────────────

    /**
     * @notice Create a vesting schedule with custom cliff and duration.
     * @param beneficiary  Address that will receive vested tokens
     * @param amount       Total BRXU to vest (must be pre-approved)
     * @param cliffDuration  Cliff period in seconds
     * @param vestingDuration Total vesting period in seconds (must exceed cliff)
     */
    function createVesting(
        address beneficiary,
        uint256 amount,
        uint256 cliffDuration,
        uint256 vestingDuration
    ) external onlyOwner {
        require(beneficiary != address(0), "BRXUVesting: zero address");
        require(amount > 0, "BRXUVesting: zero amount");
        require(
            vestingDuration > cliffDuration,
            "BRXUVesting: duration <= cliff"
        );
        require(
            schedules[beneficiary].totalAmount == 0,
            "BRXUVesting: schedule exists"
        );

        brxuToken.safeTransferFrom(msg.sender, address(this), amount);

        schedules[beneficiary] = VestingSchedule({
            totalAmount: amount,
            released: 0,
            startTime: block.timestamp,
            cliffDuration: cliffDuration,
            vestingDuration: vestingDuration,
            revoked: false
        });

        beneficiaries.push(beneficiary);

        emit VestingCreated(beneficiary, amount, cliffDuration, vestingDuration);
    }

    /**
     * @notice Create a vesting schedule with default parameters
     *         (6-month cliff, 24-month total duration).
     * @param beneficiary  Address that will receive vested tokens
     * @param amount       Total BRXU to vest (must be pre-approved)
     */
    function createDefaultVesting(
        address beneficiary,
        uint256 amount
    ) external onlyOwner {
        require(beneficiary != address(0), "BRXUVesting: zero address");
        require(amount > 0, "BRXUVesting: zero amount");
        require(
            schedules[beneficiary].totalAmount == 0,
            "BRXUVesting: schedule exists"
        );

        brxuToken.safeTransferFrom(msg.sender, address(this), amount);

        schedules[beneficiary] = VestingSchedule({
            totalAmount: amount,
            released: 0,
            startTime: block.timestamp,
            cliffDuration: DEFAULT_CLIFF,
            vestingDuration: DEFAULT_DURATION,
            revoked: false
        });

        beneficiaries.push(beneficiary);

        emit VestingCreated(
            beneficiary,
            amount,
            DEFAULT_CLIFF,
            DEFAULT_DURATION
        );
    }

    /**
     * @notice Revoke a beneficiary's vesting schedule.
     * @dev Already-vested tokens remain claimable. Unvested tokens are
     *      returned to the contract owner.
     */
    function revoke(address beneficiary) external onlyOwner {
        VestingSchedule storage schedule = schedules[beneficiary];
        require(schedule.totalAmount > 0, "BRXUVesting: no schedule");
        require(!schedule.revoked, "BRXUVesting: already revoked");

        uint256 vested = _vestedAmount(schedule);
        uint256 unvested = schedule.totalAmount - vested;

        schedule.revoked = true;

        if (unvested > 0) {
            brxuToken.safeTransfer(owner(), unvested);
        }

        emit VestingRevoked(beneficiary, unvested);
    }

    // ─── Beneficiary Functions ──────────────────────────────────────────

    /// @notice Release all vested tokens to the caller.
    function release() external nonReentrant {
        VestingSchedule storage schedule = schedules[msg.sender];
        require(schedule.totalAmount > 0, "BRXUVesting: no schedule");
        require(!schedule.revoked, "BRXUVesting: revoked");

        uint256 vested = _vestedAmount(schedule);
        uint256 releasable = vested - schedule.released;
        require(releasable > 0, "BRXUVesting: nothing to release");

        schedule.released += releasable;
        brxuToken.safeTransfer(msg.sender, releasable);

        emit TokensReleased(msg.sender, releasable);
    }

    // ─── View Functions ─────────────────────────────────────────────────

    /// @notice Total tokens vested to date for a beneficiary.
    function vestedAmount(address beneficiary) external view returns (uint256) {
        return _vestedAmount(schedules[beneficiary]);
    }

    /// @notice Tokens available to release now for a beneficiary.
    function releasableAmount(
        address beneficiary
    ) external view returns (uint256) {
        VestingSchedule storage schedule = schedules[beneficiary];
        if (schedule.revoked) return 0;
        return _vestedAmount(schedule) - schedule.released;
    }

    /// @notice Number of beneficiaries with vesting schedules.
    function beneficiaryCount() external view returns (uint256) {
        return beneficiaries.length;
    }

    // ─── Internal ───────────────────────────────────────────────────────

    function _vestedAmount(
        VestingSchedule storage schedule
    ) internal view returns (uint256) {
        if (schedule.totalAmount == 0) return 0;

        uint256 elapsed = block.timestamp - schedule.startTime;

        // Before cliff: nothing vested
        if (elapsed < schedule.cliffDuration) return 0;

        // After full duration: everything vested
        if (elapsed >= schedule.vestingDuration) return schedule.totalAmount;

        // Linear vesting
        return (schedule.totalAmount * elapsed) / schedule.vestingDuration;
    }
}
