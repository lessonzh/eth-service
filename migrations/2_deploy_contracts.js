var TNCoin = artifacts.require("./TNCoin.sol");

module.exports = function(deployer) {
  deployer.deploy(TNCoin);
};
