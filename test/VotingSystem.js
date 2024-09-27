const VotingSystem = artifacts.require("VotingSystem");

contract("VotingSystem", accounts => {
    const [owner, addr1, addr2] = accounts;

    let votingInstance;

    beforeEach(async() => {
        votingInstance = await VotingSystem.new();
    });

    describe("Proposal Creation", () => {
        it("should create a new proposal", async() => {
            const currentTime = Math.floor(Date.now() / 1000); // current time in seconds
            const expiration = currentTime + 3600; // 1 hour in the future

            const receipt = await votingInstance.createProposal("Test Proposal", expiration, { from: owner });

            // Check that the ProposalCreated event was emitted
            assert.equal(receipt.logs[0].event, "ProposalCreated", "ProposalCreated event should be emitted");
            assert.equal(receipt.logs[0].args.proposalId.toNumber(), 1, "Proposal ID should be 1");
            assert.equal(receipt.logs[0].args.creator, owner, "Creator should be the owner");

            // Fetch the proposal details
            const proposal = await votingInstance.getProposalDetails(1);
            assert.equal(proposal.id.toNumber(), 1, "Proposal ID should be 1");
            assert.equal(proposal.description, "Test Proposal", "Proposal description should match");
            assert.equal(proposal.expiration.toNumber(), expiration, "Proposal expiration should match");
        });

        it("should fail if expiration is in the past", async() => {
            const currentTime = Math.floor(Date.now() / 1000);
            const expiration = currentTime - 3600; // 1 hour in the past

            try {
                await votingInstance.createProposal("Expired Proposal", expiration, { from: owner });
                assert.fail("Should revert with expiration in the past");
            } catch (error) {
                assert(error.message.includes("Expiration must be in the future"), "Expected revert for past expiration");
            }
        });
    });

    describe("Voting Mechanism", () => {
        beforeEach(async() => {
            const currentTime = Math.floor(Date.now() / 1000);
            const expiration = currentTime + 3600; // 1 hour in future
            await votingInstance.createProposal("Test Proposal", expiration, { from: owner });
        });

        it("should allow voting for a proposal", async() => {
            await votingInstance.vote(1, true, { from: addr1 });

            // Get the vote counts
            const voteCounts = await votingInstance.getVoteCounts(1);
            assert.equal(voteCounts.votesFor.toNumber(), 1, "Votes for should be 1");
            assert.equal(voteCounts.votesAgainst.toNumber(), 0, "Votes against should be 0");
        });

        it("should allow voting against a proposal", async() => {
            await votingInstance.vote(1, false, { from: addr2 });

            // Get the vote counts
            const voteCounts = await votingInstance.getVoteCounts(1);
            assert.equal(voteCounts.votesFor.toNumber(), 0, "Votes for should be 0");
            assert.equal(voteCounts.votesAgainst.toNumber(), 1, "Votes against should be 1");
        });

        it("should prevent double voting", async() => {
            await votingInstance.vote(1, true, { from: addr1 });

            try {
                await votingInstance.vote(1, false, { from: addr1 });
                assert.fail("Should revert for double voting");
            } catch (error) {
                assert(error.message.includes("User has already voted"), "Expected revert for double voting");
            }
        });

        it("should prevent voting on expired proposals", async() => {
            // Fast forward time by 1 hour and 1 second
            await increaseTime(3601);

            try {
                await votingInstance.vote(1, true, { from: addr1 });
                assert.fail("Should revert for expired proposal");
            } catch (error) {
                assert(error.message.includes("Voting period has expired"), "Expected revert for expired proposal");
            }
        });
    });

    describe("Proposal Status", () => {
        it("should correctly report an active proposal", async() => {
            const isActive = await votingInstance.isProposalActive(1);
            assert.equal(isActive, true, "Proposal should be active");
        });

        it("should correctly report a closed proposal", async() => {
            // Fast forward time by 1 hour and 1 second
            await increaseTime(3601);

            const isActive = await votingInstance.isProposalActive(1);
            assert.equal(isActive, false, "Proposal should be closed");
        });
    });

    describe("Data Accessibility", () => {
        it("should retrieve all proposal IDs", async() => {
            await votingInstance.createProposal("Another Proposal", Math.floor(Date.now() / 1000) + 3600, { from: owner });
            const proposalIDs = await votingInstance.getAllProposalIDs();
            assert.equal(proposalIDs.length, 2, "There should be two proposals");
            assert.equal(proposalIDs[0].toNumber(), 1, "First proposal ID should be 1");
            assert.equal(proposalIDs[1].toNumber(), 2, "Second proposal ID should be 2");
        });

        it("should check if a user has voted", async() => {
            await votingInstance.vote(1, true, { from: addr1 });
            const hasVoted = await votingInstance.hasUserVoted(1, addr1);
            assert.equal(hasVoted, true, "User should have voted");
        });
    });

    // Helper function to increase blockchain time
    async function increaseTime(duration) {
        const id = Date.now();
        return new Promise((resolve, reject) => {
            web3.currentProvider.send({
                    jsonrpc: "2.0",
                    method: "evm_increaseTime",
                    params: [duration],
                    id: id
                },
                (err1) => {
                    if (err1) return reject(err1);
                    web3.currentProvider.send({
                            jsonrpc: "2.0",
                            method: "evm_mine",
                            id: id + 1
                        },
                        (err2, res) => (err2 ? reject(err2) : resolve(res))
                    );
                }
            );
        });
    }
});



// bash
// truffle test


// Make sure to update your truffle-config.js file with the correct network settings.