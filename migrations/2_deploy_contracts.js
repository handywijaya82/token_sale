var NewToken = artifacts.require("./NewToken.sol");

module.exports = function(deployer) {
  deployer.deploy(NewToken,1000000);
};
