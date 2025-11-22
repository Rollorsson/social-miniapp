// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title QuizReward
 * @author Your Name
 * @notice A contract to reward users with a "Proof-of-Knowledge" badge (NFT) for correctly answering a quiz.
 */
contract QuizReward is ERC721URIStorage, Ownable {
    uint256 private _tokenIdCounter;

    // The question for our first quiz
    string public constant QUIZ_QUESTION = "What is the best way to prevent phishing attacks?";

    // The hash of the correct answer. We store a hash to prevent the answer from being visible on-chain.
    // The correct answer is "D" for "D. All of the above".
    // keccak256("D") = 0xdf3f619804a92fdb4057192dc43dd74d3ea4c2c384535813abb583b0c0488939
    bytes32 public constant CORRECT_ANSWER_HASH = 0xdf3f619804a92fdb4057192dc43dd74d3ea4c2c384535813abb583b0c0488939;

    // Mapping to track which users have already claimed a badge
    mapping(address => bool) public hasClaimed;

    // The metadata URI for the badge NFT
    string private _tokenURI;

    /**
     * @dev Sets the token name, symbol, and initial owner.
     */
    constructor(address initialOwner, string memory tokenURI) ERC721("Proof of Knowledge", "POK") Ownable(initialOwner) {
        _tokenURI = tokenURI;
    }

    /**
     * @notice Allows a user to submit an answer to the quiz and claim a badge if correct.
     * @param _answer The user's submitted answer (e.g., "A", "B", "C", or "D").
     */
    function submitAnswer(string memory _answer) public {
        require(!hasClaimed[msg.sender], "QuizReward: You have already claimed your badge.");
        require(keccak256(abi.encodePacked(_answer)) == CORRECT_ANSWER_HASH, "QuizReward: Incorrect answer.");

        hasClaimed[msg.sender] = true;
        _mintBadge(msg.sender);
    }

    /**
     * @dev Internal function to mint a new badge to a user.
     * @param _to The address to mint the badge to.
     */
    function _mintBadge(address _to) internal {
        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter++;
        _safeMint(_to, tokenId);
        _setTokenURI(tokenId, _tokenURI);
    }

    /**
     * @notice Allows the owner to update the token URI for the badges.
     * @param newTokenURI The new metadata URI.
     */
    function setTokenURI(string memory newTokenURI) public onlyOwner {
        _tokenURI = newTokenURI;
    }

    // The following functions are overrides required by Solidity.
    function _update(address to, uint256 tokenId, address auth)
        internal
        override
        returns (address)
    {
        return super._update(to, tokenId, auth);
    }

    function _increaseBalance(address account, uint128 value)
        internal
        override
    {
        super._increaseBalance(account, value);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
