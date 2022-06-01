const Manager = artifacts.require("Manager");
const Zetasaurio = artifacts.require("Zetasaurio");

const getTeamAccounts = require("../util/get-team-accounts");

module.exports = function (deployer, network, accounts) {
  deployer.deploy(Manager, getTeamAccounts(network, accounts)).then(function() {
    return deployer.deploy(Zetasaurio, Manager.address);
  });
};
 