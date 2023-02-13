const SmartNFT = artifacts.require("SmartNFT");

module.exports = function (deployer) {
  deployer.deploy(SmartNFT);
};
