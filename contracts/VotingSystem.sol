// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract VotingSystem {
    struct Proposal {
        uint id;
        string description;
        uint expiration;
        uint votesFor;
        uint votesAgainst;
        bool exists;
    }

    // Proposal ID counter
    uint private proposalCount;

    // Mapping to store proposals by their ID
    mapping(uint => Proposal) private proposals;

    // Mapping to track if a user has voted on a specific proposal (proposalId => (user address => hasVoted))
    mapping(uint => mapping(address => bool)) private hasVoted;

    // Event to be emitted when a new proposal is created
    event ProposalCreated(uint proposalId, address creator);

    // Event to be emitted when a vote is cast
    event VoteCast(address voter, uint proposalId, bool inFavor);

    // Modifier to check if a proposal exists
    modifier proposalExists(uint _proposalId) {
        require(proposals[_proposalId].exists, "Proposal does not exist");
        _;
    }

    // Modifier to check if a proposal is active
    modifier proposalIsActive(uint _proposalId) {
        require(
            block.timestamp < proposals[_proposalId].expiration,
            "Voting period has expired"
        );
        _;
    }

    // Modifier to check if the user has not already voted on the proposal
    modifier hasNotVoted(uint _proposalId) {
        require(!hasVoted[_proposalId][msg.sender], "User has already voted");
        _;
    }

    // Function to create a new proposal
    function createProposal(
        string memory _description,
        uint _expiration
    ) public {
        require(
            _expiration > block.timestamp,
            "Expiration must be in the future"
        );

        proposalCount++;

        Proposal memory newProposal = Proposal({
            id: proposalCount,
            description: _description,
            expiration: _expiration,
            votesFor: 0,
            votesAgainst: 0,
            exists: true
        });

        proposals[proposalCount] = newProposal;

        emit ProposalCreated(proposalCount, msg.sender);
    }

    // Function to cast a vote on a proposal (true = for, false = against)
    function vote(
        uint _proposalId,
        bool _inFavor
    )
        public
        proposalExists(_proposalId)
        proposalIsActive(_proposalId)
        hasNotVoted(_proposalId)
    {
        hasVoted[_proposalId][msg.sender] = true;

        if (_inFavor) {
            proposals[_proposalId].votesFor++;
        } else {
            proposals[_proposalId].votesAgainst++;
        }

        emit VoteCast(msg.sender, _proposalId, _inFavor);
    }

    // Function to check if a proposal is active
    function isProposalActive(
        uint _proposalId
    ) public view proposalExists(_proposalId) returns (bool) {
        return block.timestamp < proposals[_proposalId].expiration;
    }

    // Function to get the current vote tally for a proposal
    function getVoteCounts(
        uint _proposalId
    )
        public
        view
        proposalExists(_proposalId)
        returns (uint votesFor, uint votesAgainst)
    {
        votesFor = proposals[_proposalId].votesFor;
        votesAgainst = proposals[_proposalId].votesAgainst;
    }

    // Function to retrieve proposal details by ID
    function getProposalDetails(
        uint _proposalId
    )
        public
        view
        proposalExists(_proposalId)
        returns (
            uint id,
            string memory description,
            uint expiration,
            uint votesFor,
            uint votesAgainst,
            bool isActive
        )
    {
        Proposal memory proposal = proposals[_proposalId];
        id = proposal.id;
        description = proposal.description;
        expiration = proposal.expiration;
        votesFor = proposal.votesFor;
        votesAgainst = proposal.votesAgainst;
        isActive = block.timestamp < proposal.expiration;
    }

    // Function to fetch all proposal IDs
    function getAllProposalIDs() public view returns (uint[] memory) {
        uint[] memory proposalIds = new uint[](proposalCount);
        for (uint i = 1; i <= proposalCount; i++) {
            proposalIds[i - 1] = i;
        }
        return proposalIds;
    }

    // Function to check if a user has voted on a particular proposal
    function hasUserVoted(
        uint _proposalId,
        address _user
    ) public view proposalExists(_proposalId) returns (bool) {
        return hasVoted[_proposalId][_user];
    }
}
