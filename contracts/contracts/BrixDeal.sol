// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title BrixDeal
 * @author BrixUp Team
 * @notice Per-deal escrow and profit-distribution contract for real-estate
 *         projects on the BrixUp platform.
 * @dev Each BrixDeal instance represents a single property deal. Investors
 *      deposit $BRIX tokens during the Funding phase. Once funded, the deal
 *      moves to Active. The builder requests milestone draws which the admin
 *      approves. On completion, principal is returned and profit is split
 *      according to pre-defined ratios among investors, the builder, the
 *      platform, and the deal-maker.
 *
 *      Profit-split ratios are expressed in basis points (1 bp = 0.01 %).
 *      The four ratios must sum to 10 000 (100 %).
 */
contract BrixDeal is ReentrancyGuard, Ownable {
    using SafeERC20 for IERC20;

    // -------------------------------------------------------------------------
    //  Enums
    // -------------------------------------------------------------------------

    /// @notice Lifecycle states of a deal.
    enum DealState {
        Funding,    // 0 - accepting investor deposits
        Active,     // 1 - fully funded, construction underway
        Completed,  // 2 - profits distributed, deal closed
        Disputed    // 3 - dispute raised, actions frozen
    }

    // -------------------------------------------------------------------------
    //  Structs
    // -------------------------------------------------------------------------

    /// @notice A contractor's sweat-equity commitment.
    struct SweatEquity {
        address contractor;
        string  tradeDescription;
        uint256 brixRate;          // BRIX tokens attributed for contribution
        bool    registered;
    }

    /// @notice Status of a milestone draw.
    struct DrawRequest {
        bool requested;
        bool approved;
        uint256 amount;
    }

    // -------------------------------------------------------------------------
    //  State variables
    // -------------------------------------------------------------------------

    /// @notice Unique identifier for this deal (set at deployment).
    bytes32  public dealId;

    /// @notice Total $BRIX capital required to fully fund the deal.
    uint256  public totalCapitalNeeded;

    /// @notice Amount of $BRIX capital raised so far.
    uint256  public totalCapitalRaised;

    /// @notice Reference to the $BRIX ERC-20 token contract.
    IERC20   public brixToken;

    /// @notice Wallet that receives the platform's share of profits.
    address  public platformWallet;

    /// @notice Current state of the deal.
    DealState public state;

    /// @notice Number of draw-schedule milestones.
    uint256  public milestoneCount;

    // Profit-split ratios in basis points (must sum to 10 000).
    /// @notice Investor share of profit (basis points).
    uint256 public investorSplitBps;
    /// @notice Builder share of profit (basis points).
    uint256 public builderSplitBps;
    /// @notice Platform share of profit (basis points).
    uint256 public platformSplitBps;
    /// @notice Deal-maker share of profit (basis points).
    uint256 public dealMakerSplitBps;

    /// @notice Address of the builder / general contractor.
    address public builder;

    /// @notice Address of the deal-maker who originated the deal.
    address public dealMaker;

    /// @notice Minimum investment amount: 500 BRIX (18 decimals).
    uint256 public constant MIN_INVESTMENT = 500 * 10 ** 18;

    /// @notice Basis-point denominator (100 %).
    uint256 public constant BPS_DENOMINATOR = 10_000;

    // Investor accounting
    /// @notice BRIX deposited by each investor.
    mapping(address => uint256) public investments;
    /// @notice Ordered list of unique investor addresses.
    address[] public investors;
    /// @notice Quick look-up to avoid duplicate entries in the investors array.
    mapping(address => bool) private _isInvestor;

    // Sweat-equity accounting
    /// @notice Registered sweat-equity commitments (indexed by contractor).
    mapping(address => SweatEquity) public sweatEquities;
    /// @notice Ordered list of sweat-equity contractor addresses.
    address[] public contractors;

    // Milestone draw accounting
    /// @notice Draw request data per milestone index.
    mapping(uint256 => DrawRequest) public draws;

    /// @notice Total BRIX already released via approved draws.
    uint256 public totalDrawn;

    // -------------------------------------------------------------------------
    //  Events
    // -------------------------------------------------------------------------

    /// @notice Emitted when an investor deposits $BRIX into the deal.
    event InvestmentMade(address indexed investor, uint256 amount, uint256 totalRaised);

    /// @notice Emitted when the deal transitions from Funding to Active.
    event DealFullyFunded(bytes32 indexed dealId, uint256 totalCapital);

    /// @notice Emitted when a contractor's sweat-equity commitment is recorded.
    event SweatEquityRegistered(address indexed contractor, string tradeDescription, uint256 brixRate);

    /// @notice Emitted when the builder submits a draw request for a milestone.
    event DrawRequested(uint256 indexed milestoneIndex, uint256 amount);

    /// @notice Emitted when the admin approves and releases a draw.
    event DrawApproved(uint256 indexed milestoneIndex, uint256 amount, address indexed builder);

    /// @notice Emitted when the deal is completed and profits distributed.
    event DealCompleted(bytes32 indexed dealId, uint256 totalProfit);

    /// @notice Emitted when the deal enters a Disputed state.
    event DealDisputed(bytes32 indexed dealId, address indexed disputedBy);

    /// @notice Emitted when the deal state changes.
    event StateChanged(DealState indexed oldState, DealState indexed newState);

    /// @notice Emitted when profit is distributed to an investor.
    event ProfitDistributed(address indexed investor, uint256 principal, uint256 profitShare);

    /// @notice Emitted when the builder is assigned to the deal.
    event BuilderSet(address indexed builder);

    /// @notice Emitted when the deal-maker is assigned to the deal.
    event DealMakerSet(address indexed dealMaker);

    // -------------------------------------------------------------------------
    //  Modifiers
    // -------------------------------------------------------------------------

    /// @dev Restricts a function to a specific deal state.
    modifier inState(DealState _state) {
        require(state == _state, "BrixDeal: invalid deal state");
        _;
    }

    // -------------------------------------------------------------------------
    //  Constructor
    // -------------------------------------------------------------------------

    /**
     * @notice Deploy a new BrixDeal escrow.
     * @param _dealId              Unique deal identifier.
     * @param _totalCapitalNeeded  Total $BRIX required to fund the deal.
     * @param _brixToken           Address of the BrixToken ERC-20 contract.
     * @param _platformWallet      Wallet receiving the platform's profit share.
     * @param _milestoneCount      Number of draw-schedule milestones.
     * @param _investorSplitBps    Investor profit share in basis points.
     * @param _builderSplitBps     Builder profit share in basis points.
     * @param _platformSplitBps    Platform profit share in basis points.
     * @param _dealMakerSplitBps   Deal-maker profit share in basis points.
     */
    constructor(
        bytes32  _dealId,
        uint256  _totalCapitalNeeded,
        address  _brixToken,
        address  _platformWallet,
        uint256  _milestoneCount,
        uint256  _investorSplitBps,
        uint256  _builderSplitBps,
        uint256  _platformSplitBps,
        uint256  _dealMakerSplitBps
    ) Ownable(msg.sender) {
        require(_brixToken != address(0), "BrixDeal: token is zero address");
        require(_platformWallet != address(0), "BrixDeal: platform wallet is zero address");
        require(_totalCapitalNeeded > 0, "BrixDeal: capital must be > 0");
        require(_milestoneCount > 0, "BrixDeal: milestones must be > 0");
        require(
            _investorSplitBps + _builderSplitBps + _platformSplitBps + _dealMakerSplitBps == BPS_DENOMINATOR,
            "BrixDeal: splits must sum to 10000"
        );

        dealId             = _dealId;
        totalCapitalNeeded = _totalCapitalNeeded;
        brixToken          = IERC20(_brixToken);
        platformWallet     = _platformWallet;
        milestoneCount     = _milestoneCount;
        investorSplitBps   = _investorSplitBps;
        builderSplitBps    = _builderSplitBps;
        platformSplitBps   = _platformSplitBps;
        dealMakerSplitBps  = _dealMakerSplitBps;
        state              = DealState.Funding;
    }

    // -------------------------------------------------------------------------
    //  Configuration (owner only)
    // -------------------------------------------------------------------------

    /**
     * @notice Assign the builder (general contractor) for this deal.
     * @param _builder Address of the builder.
     */
    function setBuilder(address _builder) external onlyOwner {
        require(_builder != address(0), "BrixDeal: builder is zero address");
        builder = _builder;
        emit BuilderSet(_builder);
    }

    /**
     * @notice Assign the deal-maker who originated this deal.
     * @param _dealMaker Address of the deal-maker.
     */
    function setDealMaker(address _dealMaker) external onlyOwner {
        require(_dealMaker != address(0), "BrixDeal: deal-maker is zero address");
        dealMaker = _dealMaker;
        emit DealMakerSet(_dealMaker);
    }

    // -------------------------------------------------------------------------
    //  Investor functions
    // -------------------------------------------------------------------------

    /**
     * @notice Invest $BRIX into this deal during the Funding phase.
     * @dev The caller must have approved this contract to spend at least
     *      `amount` BRIX tokens. A minimum of 500 BRIX is enforced.
     *      If the investment causes `totalCapitalRaised` to reach
     *      `totalCapitalNeeded`, the deal automatically moves to Active.
     * @param amount Number of BRIX tokens to invest (in wei).
     */
    function investInDeal(uint256 amount) external nonReentrant inState(DealState.Funding) {
        require(amount >= MIN_INVESTMENT, "BrixDeal: below 500 BRIX minimum");
        require(
            totalCapitalRaised + amount <= totalCapitalNeeded,
            "BrixDeal: investment exceeds remaining capacity"
        );

        brixToken.safeTransferFrom(msg.sender, address(this), amount);

        if (!_isInvestor[msg.sender]) {
            investors.push(msg.sender);
            _isInvestor[msg.sender] = true;
        }
        investments[msg.sender] += amount;
        totalCapitalRaised += amount;

        emit InvestmentMade(msg.sender, amount, totalCapitalRaised);

        // Auto-transition to Active when fully funded.
        if (totalCapitalRaised == totalCapitalNeeded) {
            DealState oldState = state;
            state = DealState.Active;
            emit StateChanged(oldState, state);
            emit DealFullyFunded(dealId, totalCapitalRaised);
        }
    }

    // -------------------------------------------------------------------------
    //  Sweat-equity registration
    // -------------------------------------------------------------------------

    /**
     * @notice Register a contractor's sweat-equity commitment.
     * @dev Only the owner (admin) can register sweat-equity entries.
     *      A contractor may only be registered once.
     * @param contractor       Address of the contractor.
     * @param tradeDescription Human-readable description of the trade/skill.
     * @param brixRate         BRIX token value attributed to the contribution.
     */
    function registerSweatEquity(
        address contractor,
        string calldata tradeDescription,
        uint256 brixRate
    ) external onlyOwner {
        require(contractor != address(0), "BrixDeal: contractor is zero address");
        require(brixRate > 0, "BrixDeal: brix rate must be > 0");
        require(!sweatEquities[contractor].registered, "BrixDeal: contractor already registered");

        sweatEquities[contractor] = SweatEquity({
            contractor: contractor,
            tradeDescription: tradeDescription,
            brixRate: brixRate,
            registered: true
        });
        contractors.push(contractor);

        emit SweatEquityRegistered(contractor, tradeDescription, brixRate);
    }

    // -------------------------------------------------------------------------
    //  Draw schedule
    // -------------------------------------------------------------------------

    /**
     * @notice Builder submits a draw request for a specific milestone.
     * @dev Only the assigned builder may call this while the deal is Active.
     * @param milestoneIndex Zero-based index of the milestone.
     * @param amount         BRIX amount requested for this draw.
     */
    function requestDraw(
        uint256 milestoneIndex,
        uint256 amount
    ) external inState(DealState.Active) {
        require(msg.sender == builder, "BrixDeal: caller is not the builder");
        require(milestoneIndex < milestoneCount, "BrixDeal: invalid milestone index");
        require(!draws[milestoneIndex].requested, "BrixDeal: draw already requested");
        require(amount > 0, "BrixDeal: draw amount must be > 0");
        require(
            totalDrawn + amount <= totalCapitalRaised,
            "BrixDeal: draw exceeds available escrow"
        );

        draws[milestoneIndex] = DrawRequest({
            requested: true,
            approved: false,
            amount: amount
        });

        emit DrawRequested(milestoneIndex, amount);
    }

    /**
     * @notice Admin approves a previously requested draw and releases funds
     *         to the builder.
     * @dev Only the owner (admin) may approve draws.
     * @param milestoneIndex Zero-based index of the milestone to approve.
     */
    function approveDraw(
        uint256 milestoneIndex
    ) external onlyOwner nonReentrant inState(DealState.Active) {
        DrawRequest storage draw = draws[milestoneIndex];
        require(draw.requested, "BrixDeal: draw not requested");
        require(!draw.approved, "BrixDeal: draw already approved");
        require(builder != address(0), "BrixDeal: builder not set");

        draw.approved = true;
        totalDrawn += draw.amount;

        brixToken.safeTransfer(builder, draw.amount);

        emit DrawApproved(milestoneIndex, draw.amount, builder);
    }

    // -------------------------------------------------------------------------
    //  Deal completion & profit distribution
    // -------------------------------------------------------------------------

    /**
     * @notice Complete the deal and distribute profits.
     * @dev The owner must first transfer sufficient BRIX into this contract
     *      to cover principal repayment plus profit splits. The function:
     *        1. Returns each investor's principal pro-rata.
     *        2. Splits `totalProfit` according to the configured basis-point
     *           ratios among investors (pro-rata), builder, platform, and
     *           deal-maker.
     *
     *      The contract must hold at least
     *      `(totalCapitalRaised - totalDrawn) + totalProfit` BRIX at the time
     *      of calling (draws already released are excluded from the principal
     *      repayment).
     *
     * @param totalProfit Total profit (in BRIX) to distribute.
     */
    function completeDeal(
        uint256 totalProfit
    ) external onlyOwner nonReentrant inState(DealState.Active) {
        require(builder != address(0), "BrixDeal: builder not set");
        require(dealMaker != address(0), "BrixDeal: deal-maker not set");

        DealState oldState = state;
        state = DealState.Completed;
        emit StateChanged(oldState, state);

        // --- Principal repayment (remaining after draws) ---
        uint256 principalRemaining = totalCapitalRaised - totalDrawn;

        // --- Profit split ---
        uint256 investorProfit  = (totalProfit * investorSplitBps)  / BPS_DENOMINATOR;
        uint256 builderProfit   = (totalProfit * builderSplitBps)   / BPS_DENOMINATOR;
        uint256 platformProfit  = (totalProfit * platformSplitBps)  / BPS_DENOMINATOR;
        uint256 dealMakerProfit = totalProfit - investorProfit - builderProfit - platformProfit;

        // Distribute principal + investor profit share pro-rata.
        for (uint256 i = 0; i < investors.length; i++) {
            address inv = investors[i];
            uint256 share = investments[inv];
            if (share == 0) continue;

            // Pro-rata principal from remaining escrow.
            uint256 principalReturn = (principalRemaining * share) / totalCapitalRaised;
            // Pro-rata investor profit.
            uint256 profitReturn = (investorProfit * share) / totalCapitalRaised;
            uint256 total = principalReturn + profitReturn;

            if (total > 0) {
                brixToken.safeTransfer(inv, total);
            }
            emit ProfitDistributed(inv, principalReturn, profitReturn);
        }

        // Builder profit.
        if (builderProfit > 0) {
            brixToken.safeTransfer(builder, builderProfit);
        }

        // Platform profit.
        if (platformProfit > 0) {
            brixToken.safeTransfer(platformWallet, platformProfit);
        }

        // Deal-maker profit.
        if (dealMakerProfit > 0) {
            brixToken.safeTransfer(dealMaker, dealMakerProfit);
        }

        emit DealCompleted(dealId, totalProfit);
    }

    // -------------------------------------------------------------------------
    //  Dispute
    // -------------------------------------------------------------------------

    /**
     * @notice Move the deal into Disputed state, freezing all actions.
     * @dev Only the owner (admin) may trigger a dispute.
     */
    function disputeDeal() external onlyOwner {
        require(
            state == DealState.Funding || state == DealState.Active,
            "BrixDeal: cannot dispute in current state"
        );
        DealState oldState = state;
        state = DealState.Disputed;
        emit StateChanged(oldState, state);
        emit DealDisputed(dealId, msg.sender);
    }

    // -------------------------------------------------------------------------
    //  View helpers
    // -------------------------------------------------------------------------

    /// @notice Return the number of unique investors.
    function investorCount() external view returns (uint256) {
        return investors.length;
    }

    /// @notice Return the number of registered contractors.
    function contractorCount() external view returns (uint256) {
        return contractors.length;
    }

    /// @notice Return the full list of investor addresses.
    function getInvestors() external view returns (address[] memory) {
        return investors;
    }

    /// @notice Return the full list of contractor addresses.
    function getContractors() external view returns (address[] memory) {
        return contractors;
    }
}
