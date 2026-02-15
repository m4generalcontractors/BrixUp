/**
 * BrixUp Contract ABIs
 *
 * Minimal ABIs for frontend interaction with deployed contracts.
 * Only includes functions/events the UI actually needs.
 */

// ---------------------------------------------------------------------------
//  BrxuToken (ERC-20 + Burnable + Pausable)
// ---------------------------------------------------------------------------

export const BrxuTokenABI = [
  // ERC-20 read
  { type: "function", name: "name", inputs: [], outputs: [{ type: "string" }], stateMutability: "view" },
  { type: "function", name: "symbol", inputs: [], outputs: [{ type: "string" }], stateMutability: "view" },
  { type: "function", name: "decimals", inputs: [], outputs: [{ type: "uint8" }], stateMutability: "view" },
  { type: "function", name: "totalSupply", inputs: [], outputs: [{ type: "uint256" }], stateMutability: "view" },
  {
    type: "function", name: "balanceOf",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function", name: "allowance",
    inputs: [{ name: "owner", type: "address" }, { name: "spender", type: "address" }],
    outputs: [{ type: "uint256" }],
    stateMutability: "view",
  },
  // ERC-20 write
  {
    type: "function", name: "approve",
    inputs: [{ name: "spender", type: "address" }, { name: "amount", type: "uint256" }],
    outputs: [{ type: "bool" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function", name: "transfer",
    inputs: [{ name: "to", type: "address" }, { name: "amount", type: "uint256" }],
    outputs: [{ type: "bool" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function", name: "transferFrom",
    inputs: [{ name: "from", type: "address" }, { name: "to", type: "address" }, { name: "amount", type: "uint256" }],
    outputs: [{ type: "bool" }],
    stateMutability: "nonpayable",
  },
  // Burnable
  {
    type: "function", name: "burn",
    inputs: [{ name: "amount", type: "uint256" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  // Pausable
  { type: "function", name: "paused", inputs: [], outputs: [{ type: "bool" }], stateMutability: "view" },
  // Ownable
  { type: "function", name: "owner", inputs: [], outputs: [{ type: "address" }], stateMutability: "view" },
  // BRXU production — fee & anti-bot
  { type: "function", name: "feeBps", inputs: [], outputs: [{ type: "uint256" }], stateMutability: "view" },
  { type: "function", name: "treasury", inputs: [], outputs: [{ type: "address" }], stateMutability: "view" },
  { type: "function", name: "antiBotEnabled", inputs: [], outputs: [{ type: "bool" }], stateMutability: "view" },
  { type: "function", name: "launchTime", inputs: [], outputs: [{ type: "uint256" }], stateMutability: "view" },
  {
    type: "function", name: "feeExempt",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ type: "bool" }],
    stateMutability: "view",
  },
  // Events
  {
    type: "event", name: "Transfer",
    inputs: [
      { name: "from", type: "address", indexed: true },
      { name: "to", type: "address", indexed: true },
      { name: "value", type: "uint256", indexed: false },
    ],
  },
  {
    type: "event", name: "Approval",
    inputs: [
      { name: "owner", type: "address", indexed: true },
      { name: "spender", type: "address", indexed: true },
      { name: "value", type: "uint256", indexed: false },
    ],
  },
] as const;

// ---------------------------------------------------------------------------
//  BrxuStaking
// ---------------------------------------------------------------------------

export const BrxuStakingABI = [
  // Read
  { type: "function", name: "brxuToken", inputs: [], outputs: [{ type: "address" }], stateMutability: "view" },
  { type: "function", name: "totalStaked", inputs: [], outputs: [{ type: "uint256" }], stateMutability: "view" },
  { type: "function", name: "rewardRate", inputs: [], outputs: [{ type: "uint256" }], stateMutability: "view" },
  { type: "function", name: "rewardsDuration", inputs: [], outputs: [{ type: "uint256" }], stateMutability: "view" },
  { type: "function", name: "periodFinish", inputs: [], outputs: [{ type: "uint256" }], stateMutability: "view" },
  {
    type: "function", name: "earned",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function", name: "pendingRewards",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function", name: "stakedBalance",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ type: "uint256" }],
    stateMutability: "view",
  },
  { type: "function", name: "stakerCount", inputs: [], outputs: [{ type: "uint256" }], stateMutability: "view" },
  // Write — no lock period, instant stake/unstake
  {
    type: "function", name: "stake",
    inputs: [{ name: "amount", type: "uint256" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function", name: "unstake",
    inputs: [{ name: "amount", type: "uint256" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function", name: "claimRewards",
    inputs: [],
    outputs: [],
    stateMutability: "nonpayable",
  },
  // Events
  {
    type: "event", name: "Staked",
    inputs: [
      { name: "user", type: "address", indexed: true },
      { name: "amount", type: "uint256", indexed: false },
    ],
  },
  {
    type: "event", name: "Unstaked",
    inputs: [
      { name: "user", type: "address", indexed: true },
      { name: "amount", type: "uint256", indexed: false },
    ],
  },
  {
    type: "event", name: "RewardsClaimed",
    inputs: [
      { name: "user", type: "address", indexed: true },
      { name: "amount", type: "uint256", indexed: false },
    ],
  },
  {
    type: "event", name: "RewardsFunded",
    inputs: [
      { name: "amount", type: "uint256", indexed: false },
      { name: "duration", type: "uint256", indexed: false },
    ],
  },
] as const;

// ---------------------------------------------------------------------------
//  BrxuDeal (per-deal escrow contract)
// ---------------------------------------------------------------------------

export const BrxuDealABI = [
  // Read
  { type: "function", name: "dealId", inputs: [], outputs: [{ type: "bytes32" }], stateMutability: "view" },
  { type: "function", name: "totalCapitalNeeded", inputs: [], outputs: [{ type: "uint256" }], stateMutability: "view" },
  { type: "function", name: "totalCapitalRaised", inputs: [], outputs: [{ type: "uint256" }], stateMutability: "view" },
  { type: "function", name: "state", inputs: [], outputs: [{ type: "uint8" }], stateMutability: "view" },
  {
    type: "function", name: "investments",
    inputs: [{ name: "investor", type: "address" }],
    outputs: [{ type: "uint256" }],
    stateMutability: "view",
  },
  { type: "function", name: "investorCount", inputs: [], outputs: [{ type: "uint256" }], stateMutability: "view" },
  // Write
  {
    type: "function", name: "investInDeal",
    inputs: [{ name: "amount", type: "uint256" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  // Events
  {
    type: "event", name: "InvestmentMade",
    inputs: [
      { name: "investor", type: "address", indexed: true },
      { name: "amount", type: "uint256", indexed: false },
      { name: "totalRaised", type: "uint256", indexed: false },
    ],
  },
] as const;

// ---------------------------------------------------------------------------
//  BRXUVesting
// ---------------------------------------------------------------------------

export const BrxuVestingABI = [
  // Read
  { type: "function", name: "brxuToken", inputs: [], outputs: [{ type: "address" }], stateMutability: "view" },
  { type: "function", name: "DEFAULT_CLIFF", inputs: [], outputs: [{ type: "uint256" }], stateMutability: "view" },
  { type: "function", name: "DEFAULT_DURATION", inputs: [], outputs: [{ type: "uint256" }], stateMutability: "view" },
  {
    type: "function", name: "schedules",
    inputs: [{ name: "beneficiary", type: "address" }],
    outputs: [
      { name: "totalAmount", type: "uint256" },
      { name: "released", type: "uint256" },
      { name: "startTime", type: "uint256" },
      { name: "cliffDuration", type: "uint256" },
      { name: "vestingDuration", type: "uint256" },
      { name: "revoked", type: "bool" },
    ],
    stateMutability: "view",
  },
  {
    type: "function", name: "vestedAmount",
    inputs: [{ name: "beneficiary", type: "address" }],
    outputs: [{ type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function", name: "releasableAmount",
    inputs: [{ name: "beneficiary", type: "address" }],
    outputs: [{ type: "uint256" }],
    stateMutability: "view",
  },
  { type: "function", name: "beneficiaryCount", inputs: [], outputs: [{ type: "uint256" }], stateMutability: "view" },
  // Write
  { type: "function", name: "release", inputs: [], outputs: [], stateMutability: "nonpayable" },
  // Events
  {
    type: "event", name: "TokensReleased",
    inputs: [
      { name: "beneficiary", type: "address", indexed: true },
      { name: "amount", type: "uint256", indexed: false },
    ],
  },
  {
    type: "event", name: "VestingRevoked",
    inputs: [
      { name: "beneficiary", type: "address", indexed: true },
      { name: "unvested", type: "uint256", indexed: false },
    ],
  },
] as const;

// ---------------------------------------------------------------------------
//  BrxuFactory
// ---------------------------------------------------------------------------

export const BrxuFactoryABI = [
  // Read
  { type: "function", name: "brixToken", inputs: [], outputs: [{ type: "address" }], stateMutability: "view" },
  { type: "function", name: "platformWallet", inputs: [], outputs: [{ type: "address" }], stateMutability: "view" },
  { type: "function", name: "platformFeeBps", inputs: [], outputs: [{ type: "uint256" }], stateMutability: "view" },
  {
    type: "function", name: "getAllDeals",
    inputs: [],
    outputs: [{ type: "address[]" }],
    stateMutability: "view",
  },
  {
    type: "function", name: "dealCount",
    inputs: [],
    outputs: [{ type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function", name: "isDeal",
    inputs: [{ name: "deal", type: "address" }],
    outputs: [{ type: "bool" }],
    stateMutability: "view",
  },
  // Write
  {
    type: "function", name: "createDeal",
    inputs: [
      { name: "_dealId", type: "bytes32" },
      { name: "_totalCapitalNeeded", type: "uint256" },
      { name: "_milestoneCount", type: "uint256" },
      { name: "_investorSplitBps", type: "uint256" },
      { name: "_builderSplitBps", type: "uint256" },
      { name: "_platformSplitBps", type: "uint256" },
      { name: "_dealMakerSplitBps", type: "uint256" },
    ],
    outputs: [{ name: "deal", type: "address" }],
    stateMutability: "nonpayable",
  },
  // Events
  {
    type: "event", name: "DealCreated",
    inputs: [
      { name: "deal", type: "address", indexed: true },
      { name: "dealId", type: "bytes32", indexed: true },
      { name: "totalCapitalNeeded", type: "uint256", indexed: false },
      { name: "milestoneCount", type: "uint256", indexed: false },
      { name: "creator", type: "address", indexed: false },
    ],
  },
] as const;
