// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./BrixDeal.sol";

/**
 * @title BrixFactory
 * @author BrixUp Team
 * @notice Factory contract that deploys and tracks BrixDeal instances.
 * @dev The factory stores a configurable platform fee percentage, the platform
 *      wallet, and the $BRXU token address. When a new deal is created the
 *      factory deploys a BrixDeal clone with the provided parameters and
 *      records the address.
 */
contract BrixFactory is Ownable {
    // -------------------------------------------------------------------------
    //  State variables
    // -------------------------------------------------------------------------

    /// @notice Address of the $BRXU ERC-20 token used across all deals.
    address public brixToken;

    /// @notice Platform wallet that receives the platform share of profits.
    address public platformWallet;

    /// @notice Platform fee in basis points (1 bp = 0.01 %).
    ///         Applied during deal creation as a parameter to the BrixDeal
    ///         constructor via `platformSplitBps`.
    uint256 public platformFeeBps;

    /// @notice Maximum platform fee: 20 % (2 000 bps).
    uint256 public constant MAX_PLATFORM_FEE_BPS = 2_000;

    /// @notice Ordered array of all deployed BrixDeal contract addresses.
    address[] public allDeals;

    /// @notice Quick look-up: is the address a deal deployed by this factory?
    mapping(address => bool) public isDeal;

    // -------------------------------------------------------------------------
    //  Events
    // -------------------------------------------------------------------------

    /// @notice Emitted when a new BrixDeal is deployed.
    event DealCreated(
        address indexed deal,
        bytes32 indexed dealId,
        uint256 totalCapitalNeeded,
        uint256 milestoneCount,
        address creator
    );

    /// @notice Emitted when the platform fee percentage is updated.
    event PlatformFeeUpdated(uint256 oldFeeBps, uint256 newFeeBps);

    /// @notice Emitted when the platform wallet is updated.
    event PlatformWalletUpdated(address indexed oldWallet, address indexed newWallet);

    // -------------------------------------------------------------------------
    //  Constructor
    // -------------------------------------------------------------------------

    /**
     * @notice Deploy the BrixFactory.
     * @param _brixToken      Address of the BrixToken ERC-20 contract.
     * @param _platformWallet Wallet that receives the platform share.
     * @param _platformFeeBps Initial platform fee in basis points.
     */
    constructor(
        address _brixToken,
        address _platformWallet,
        uint256 _platformFeeBps
    ) Ownable(msg.sender) {
        require(_brixToken != address(0), "BrixFactory: token is zero address");
        require(_platformWallet != address(0), "BrixFactory: wallet is zero address");
        require(_platformFeeBps <= MAX_PLATFORM_FEE_BPS, "BrixFactory: fee exceeds max");

        brixToken      = _brixToken;
        platformWallet = _platformWallet;
        platformFeeBps = _platformFeeBps;
    }

    // -------------------------------------------------------------------------
    //  Deal creation
    // -------------------------------------------------------------------------

    /**
     * @notice Deploy a new BrixDeal escrow contract.
     * @dev The caller becomes the initial owner of the newly deployed BrixDeal
     *      (ownership is immediately transferred from the factory to `msg.sender`
     *      so the deal creator can manage the deal).
     * @param _dealId              Unique identifier for the deal.
     * @param _totalCapitalNeeded  Total BRXU tokens required to fund the deal.
     * @param _milestoneCount      Number of draw milestones in the schedule.
     * @param _investorSplitBps    Investor profit share (basis points).
     * @param _builderSplitBps     Builder profit share (basis points).
     * @param _platformSplitBps    Platform profit share (basis points).
     * @param _dealMakerSplitBps   Deal-maker profit share (basis points).
     * @return deal Address of the newly deployed BrixDeal contract.
     */
    function createDeal(
        bytes32 _dealId,
        uint256 _totalCapitalNeeded,
        uint256 _milestoneCount,
        uint256 _investorSplitBps,
        uint256 _builderSplitBps,
        uint256 _platformSplitBps,
        uint256 _dealMakerSplitBps
    ) external returns (address deal) {
        require(_totalCapitalNeeded > 0, "BrixFactory: capital must be > 0");
        require(_milestoneCount > 0, "BrixFactory: milestones must be > 0");
        require(
            _investorSplitBps + _builderSplitBps + _platformSplitBps + _dealMakerSplitBps == 10_000,
            "BrixFactory: splits must sum to 10000"
        );

        BrixDeal newDeal = new BrixDeal(
            _dealId,
            _totalCapitalNeeded,
            brixToken,
            platformWallet,
            _milestoneCount,
            _investorSplitBps,
            _builderSplitBps,
            _platformSplitBps,
            _dealMakerSplitBps
        );

        deal = address(newDeal);

        // Transfer ownership of the deal to the caller so they can manage it.
        newDeal.transferOwnership(msg.sender);

        allDeals.push(deal);
        isDeal[deal] = true;

        emit DealCreated(deal, _dealId, _totalCapitalNeeded, _milestoneCount, msg.sender);
    }

    // -------------------------------------------------------------------------
    //  Owner-only configuration
    // -------------------------------------------------------------------------

    /**
     * @notice Update the platform fee percentage.
     * @param _newFeeBps New fee in basis points (max 2 000 = 20 %).
     */
    function setPlatformFee(uint256 _newFeeBps) external onlyOwner {
        require(_newFeeBps <= MAX_PLATFORM_FEE_BPS, "BrixFactory: fee exceeds max");
        uint256 oldFee = platformFeeBps;
        platformFeeBps = _newFeeBps;
        emit PlatformFeeUpdated(oldFee, _newFeeBps);
    }

    /**
     * @notice Update the platform wallet address.
     * @param _newWallet New wallet address.
     */
    function setPlatformWallet(address _newWallet) external onlyOwner {
        require(_newWallet != address(0), "BrixFactory: wallet is zero address");
        address oldWallet = platformWallet;
        platformWallet = _newWallet;
        emit PlatformWalletUpdated(oldWallet, _newWallet);
    }

    // -------------------------------------------------------------------------
    //  View helpers
    // -------------------------------------------------------------------------

    /**
     * @notice Return the full array of deployed BrixDeal addresses.
     * @return Array of deal contract addresses.
     */
    function getAllDeals() external view returns (address[] memory) {
        return allDeals;
    }

    /**
     * @notice Return the total number of deals deployed through this factory.
     * @return Count of deals.
     */
    function dealCount() external view returns (uint256) {
        return allDeals.length;
    }
}
