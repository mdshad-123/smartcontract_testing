Voting Application Overview

This decentralized voting application allows users to create proposals and vote on them, simulating a basic Decentralized Autonomous Organization (DAO) mechanism.

Smart Contract Functionality

1. Proposal Creation: Users can create proposals with a unique identifier, descriptive text, and expiration timestamp.

2. Voting Mechanism: Users can vote for or against active proposals.

3. Proposal Status: Check if a proposal is active or closed based on its expiration time.

4. Vote Tallying: Keep a running total of votes for and against each proposal.

5. Data Accessibility: Retrieve proposal details, fetch all proposal IDs, and check if a user has voted.

# Decentralized Voting Application

A simple decentralized voting application using smart contracts on the Ethereum blockchain.

## Table of Contents

- [Overview](#overview)
- [Smart Contract Functionality](#smart-contract-functionality)
- [Implementation Details](#implementation-details)
- [Installation](#installation)
- [Usage](#usage)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)

## Overview

This application allows users to create proposals and vote on them, simulating a basic Decentralized Autonomous Organization (DAO) mechanism.

## Smart Contract Functionality

- Proposal creation with unique ID, text, and expiration timestamp
- Voting mechanism for active proposals
- Proposal status checking
- Vote tallying
- Data accessibility

## Implementation Details

- Programming Language: Solidity
- Blockchain Platform: Ethereum
- Development Framework: Truffle
- Testing Framework: Truffle testing

## Installation

1.  Install Node.js and npm.
2.  Install Truffle using npm: `npm install -g truffle`.
3.  Install dependencies: `npm install`.

## Usage

1.  Compile contracts: `truffle compile`.
2.  Deploy contracts to Ganache: `truffle migrate --network development`.

## Testing

1.  Run tests: `truffle test`.

## Contributing

Contributions are welcome. Please submit a pull request.

## License

MIT License
