// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

/**
 * @title BrixUp Token ($BRIX)
 * @notice Production ERC-20 token for the BrixUp tokenized real estate marketplace.
 *         Features: 0.5% transfer fee, pausable, anti-bot max transfer limit,
 *         fee-exempt addresses, and burn functionality.
 * @dev Deployed on Base L2 (Chain ID 8453).
 */
contract BRIX is ERC20, Ownable, Pausable {
    // ─── Constants ───────────────────────────────────────────────────────
    uint256 public constant TOTAL_SUPPLY = 1_000_000_000 * 1e18; // 1 billion
    uint256 public constant MAX_FEE_BPS = 200; // 2% max fee
    uint256 public constant ANTI_BOT_LIMIT = 10_000_000 * 1e18; // 1% of supply

    // ─── State ───────────────────────────────────────────────────────────
    uint256 public feeBps = 50; // 0.5% default (basis points)
    address public treasury;
    mapping(address => bool) public feeExempt;

    uint256 public launchTime;
    bool public antiBotEnabled = true;

    // ─── Events ──────────────────────────────────────────────────────────
    event FeeUpdated(uint256 oldFee, uint256 newFee);
    event TreasuryUpdated(address oldTreasury, address newTreasury);
    event FeeExemptUpdated(address account, bool exempt);
    event AntiBotDisabled();
    event TokensBurned(address indexed burner, uint256 amount);

    // ─── Constructor ─────────────────────────────────────────────────────
    /**
     * @param _treasury      Platform treasury wallet (receives transfer fees)
     * @param _rewards       Community rewards wallet (20%)
     * @param _vesting       Team vesting contract address (15%)
     * @param _liquidity     Liquidity pool wallet (10%)
     * @param _marketing     Marketing wallet (10%)
     * @param _presale       Pre-sale wallet (5%)
     */
    constructor(
        address _treasury,
        address _rewards,
        address _vesting,
        address _liquidity,
        address _marketing,
        address _presale
    ) ERC20("BrixUp Token", "BRIX") Ownable(msg.sender) {
        require(_treasury != address(0), "BRIX: zero treasury");
        require(_rewards != address(0), "BRIX: zero rewards");
        require(_vesting != address(0), "BRIX: zero vesting");
        require(_liquidity != address(0), "BRIX: zero liquidity");
        require(_marketing != address(0), "BRIX: zero marketing");
        require(_presale != address(0), "BRIX: zero presale");

        treasury = _treasury;
        launchTime = block.timestamp;

        // Token Allocation
        _mint(_treasury, 400_000_000 * 1e18);  // 40% Platform Treasury
        _mint(_rewards, 200_000_000 * 1e18);   // 20% Community Rewards
        _mint(_vesting, 150_000_000 * 1e18);   // 15% Team & Advisors
        _mint(_liquidity, 100_000_000 * 1e18); // 10% Liquidity Pool
        _mint(_marketing, 100_000_000 * 1e18); // 10% Marketing
        _mint(_presale, 50_000_000 * 1e18);    // 5%  Pre-sale

        // Fee-exempt by default
        feeExempt[msg.sender] = true;
        feeExempt[_treasury] = true;
        feeExempt[_rewards] = true;
        feeExempt[_vesting] = true;
        feeExempt[_liquidity] = true;
    }

    // ─── Overrides ───────────────────────────────────────────────────────

    function _update(
        address from,
        address to,
        uint256 amount
    ) internal override whenNotPaused {
        // Anti-bot: limit max transfer in first 24 hours
        if (antiBotEnabled && block.timestamp < launchTime + 24 hours) {
            if (from != address(0) && to != address(0)) {
                require(amount <= ANTI_BOT_LIMIT, "BRIX: exceeds anti-bot limit");
            }
        }

        // Apply fee on non-exempt transfers (skip mints/burns)
        if (
            feeBps > 0 &&
            from != address(0) &&
            to != address(0) &&
            !feeExempt[from] &&
            !feeExempt[to]
        ) {
            uint256 fee = (amount * feeBps) / 10_000;
            uint256 netAmount = amount - fee;
            super._update(from, treasury, fee);
            super._update(from, to, netAmount);
            return;
        }

        super._update(from, to, amount);
    }

    // ─── Public Functions ────────────────────────────────────────────────

    /// @notice Burn tokens from caller's balance.
    function burn(uint256 amount) external {
        _burn(msg.sender, amount);
        emit TokensBurned(msg.sender, amount);
    }

    // ─── Owner Functions ─────────────────────────────────────────────────

    /// @notice Update the transfer fee (basis points). Max 2%.
    function setFeeBps(uint256 _feeBps) external onlyOwner {
        require(_feeBps <= MAX_FEE_BPS, "BRIX: fee exceeds max");
        emit FeeUpdated(feeBps, _feeBps);
        feeBps = _feeBps;
    }

    /// @notice Update the treasury address.
    function setTreasury(address _treasury) external onlyOwner {
        require(_treasury != address(0), "BRIX: zero address");
        emit TreasuryUpdated(treasury, _treasury);
        treasury = _treasury;
    }

    /// @notice Add or remove a fee-exempt address.
    function setFeeExempt(address account, bool exempt) external onlyOwner {
        feeExempt[account] = exempt;
        emit FeeExemptUpdated(account, exempt);
    }

    /// @notice Permanently disable the anti-bot transfer limit.
    function disableAntiBot() external onlyOwner {
        antiBotEnabled = false;
        emit AntiBotDisabled();
    }

    /// @notice Pause all transfers.
    function pause() external onlyOwner {
        _pause();
    }

    /// @notice Unpause transfers.
    function unpause() external onlyOwner {
        _unpause();
    }
}
