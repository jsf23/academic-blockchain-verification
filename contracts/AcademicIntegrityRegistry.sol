// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract AcademicIntegrityRegistry {
    struct Certificate {
        address issuer;
        uint256 timestamp;
        bool isValid;
    }

    event IssuerAuthorized(address indexed issuer);
    event IssuerRevoked(address indexed issuer);
    event NewRegistration(bytes32 indexed hash, address indexed issuer, uint256 date);

    mapping(bytes32 => Certificate) private registry;
    mapping(address => bool) private authorizedIssuers;

    address public owner;

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can perform this action");
        _;
    }

    modifier onlyAuthorizedIssuer() {
        require(authorizedIssuers[msg.sender], "Caller is not an authorized issuer");
        _;
    }

    constructor(address[] memory initialAuthorizedIssuers) {
        owner = msg.sender;

        for (uint256 index = 0; index < initialAuthorizedIssuers.length; index++) {
            address issuer = initialAuthorizedIssuers[index];

            if (issuer != address(0) && !authorizedIssuers[issuer]) {
                authorizedIssuers[issuer] = true;
                emit IssuerAuthorized(issuer);
            }
        }
    }

    function authorizeIssuer(address issuer) external onlyOwner {
        require(issuer != address(0), "Issuer address cannot be zero");
        require(!authorizedIssuers[issuer], "Issuer already authorized");

        authorizedIssuers[issuer] = true;
        emit IssuerAuthorized(issuer);
    }

    function revokeIssuer(address issuer) external onlyOwner {
        require(authorizedIssuers[issuer], "Issuer is not authorized");

        authorizedIssuers[issuer] = false;
        emit IssuerRevoked(issuer);
    }

    function isAuthorizedIssuer(address issuer) external view returns (bool) {
        return authorizedIssuers[issuer];
    }

    function issueCertificate(bytes32 hash) external onlyAuthorizedIssuer {
        require(hash != bytes32(0), "Certificate hash is required");
        require(registry[hash].issuer == address(0), "Certificate already registered");

        registry[hash] = Certificate({
            issuer: msg.sender,
            timestamp: block.timestamp,
            isValid: true
        });

        emit NewRegistration(hash, msg.sender, block.timestamp);
    }

    function verifyCertificate(bytes32 hash)
        external
        view
        returns (bool exists, uint256 date, address institution, bool isValid)
    {
        Certificate memory certificate = registry[hash];

        if (certificate.issuer == address(0)) {
            return (false, 0, address(0), false);
        }

        return (true, certificate.timestamp, certificate.issuer, certificate.isValid);
    }
}