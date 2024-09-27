const Migrations = artifacts.require("VotingSystem");

module.exports = function(deployer) {
    deployer.deploy(Migrations);
};