// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract ChallengeRewards {
    address public owner;

    // Mapping from user address to their verification status
    mapping(address => bool) private _verifiedUsers;
    // Mapping from user address to their reward balance
    mapping(address => uint256) private _rewards;
    // Array to store all verified user addresses
    address[] private _verifiedUserAddresses;

    // Event emitted when a user is verified
    event UserVerified(address indexed user);

    constructor() {
        owner = msg.sender;
        console.log("ChallengeRewards deployed, owner set to:", owner);
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    /**
     * @dev Verifies a user and grants them an initial reward. Only callable by the owner.
     * The user must not already be verified.
     */
    function verifyUser(address user) external onlyOwner {
        require(!_verifiedUsers[user], "User already verified");

        _verifiedUsers[user] = true;
        _rewards[user] = 100; // Initial reward
        _verifiedUserAddresses.push(user);

        emit UserVerified(user);
    }

    /**
     * @dev Returns the reward balance of a specific user.
     * @param user The address of the user.
     * @return The reward balance.
     */
    function getReward(address user) external view returns (uint256) {
        return _rewards[user];
    }

    /**
     * @dev Returns the list of all verified user addresses.
     * @return An array of addresses.
     */
    function getVerifiedUsers() external view returns (address[] memory) {
        return _verifiedUserAddresses;
    }

    /**
     * @dev Returns whether a user is verified.
     * @param user The address of the user.
     * @return True if the user is verified, false otherwise.
     */
    function isVerified(address user) external view returns (bool) {
        return _verifiedUsers[user];
    }
}
