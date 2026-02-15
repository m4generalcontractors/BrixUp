// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title BrixToken
 * @author BrixUp Team
 * @notice ERC-20 utility token for the BrixUp real-estate investment platform.
 * @dev $BRXU has a fixed initial supply of 1 billion tokens (18 decimals).
 *      The owner (platform treasury) may mint additional tokens and pause
 *      transfers in an emergency. Token holders can burn their own tokens
 *      to support deflationary mechanics.
 */
contract BrixToken is ERC20, ERC20Burnable, ERC20Pausable, Ownable {
    /// @notice Total initial supply: 1 billion BRXU (1e9 * 1e18).
    uint256 public constant INITIAL_SUPPLY = 1_000_000_000 * 10 ** 18;

    // -------------------------------------------------------------------------
    //  Events
    // -------------------------------------------------------------------------

    /// @notice Emitted when new tokens are minted by the owner.
    /// @param to       Recipient of the minted tokens.
    /// @param amount   Number of tokens minted (in wei).
    event TokensMinted(address indexed to, uint256 amount);

    /// @notice Emitted when the contract is paused.
    event ContractPaused(address indexed by);

    /// @notice Emitted when the contract is unpaused.
    event ContractUnpaused(address indexed by);

    // -------------------------------------------------------------------------
    //  Constructor
    // -------------------------------------------------------------------------

    /**
     * @notice Deploys the BrixToken and mints the initial supply to the deployer.
     * @dev The deployer becomes both the Ownable owner and the initial holder of
     *      all tokens, acting as the platform treasury.
     */
    constructor() ERC20("BrixUp Token", "BRXU") Ownable(msg.sender) {
        _mint(msg.sender, INITIAL_SUPPLY);
    }

    // -------------------------------------------------------------------------
    //  Owner-only functions
    // -------------------------------------------------------------------------

    /**
     * @notice Mint new $BRXU tokens to a given address.
     * @dev Only callable by the contract owner (platform treasury).
     * @param to     Recipient address.
     * @param amount Number of tokens to mint (in wei).
     */
    function mint(address to, uint256 amount) external onlyOwner {
        require(to != address(0), "BrixToken: mint to zero address");
        require(amount > 0, "BrixToken: mint amount must be > 0");
        _mint(to, amount);
        emit TokensMinted(to, amount);
    }

    /**
     * @notice Pause all token transfers.
     * @dev Only callable by the contract owner. Useful for emergency situations.
     */
    function pause() external onlyOwner {
        _pause();
        emit ContractPaused(msg.sender);
    }

    /**
     * @notice Unpause token transfers.
     * @dev Only callable by the contract owner.
     */
    function unpause() external onlyOwner {
        _unpause();
        emit ContractUnpaused(msg.sender);
    }

    // -------------------------------------------------------------------------
    //  Internal overrides (required by Solidity for multiple inheritance)
    // -------------------------------------------------------------------------

    /**
     * @dev Hook that is called during any token transfer. Combines the logic
     *      from ERC20 and ERC20Pausable so that transfers are blocked while
     *      the contract is paused.
     */
    function _update(
        address from,
        address to,
        uint256 value
    ) internal override(ERC20, ERC20Pausable) {
        super._update(from, to, value);
    }
}
