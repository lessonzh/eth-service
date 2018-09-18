// Allows us to use ES6 in our migrations and tests.
require('babel-register')

var HDWalletProvider = require("truffle-hdwallet-provider");
var mnemonic = "negative connect arrest will sunset useful typical alley chair second average acid";
module.exports = {
  networks: {
    ganache: {
      host: '192.168.23.193',
      port: 7545,
      network_id: '*'
    },
    development: {
      host: '192.168.2.53',
      port: 8545,
      network_id: 14,
      gas: 3000000
    },
    local: {
      host: '192.168.23.125',
      port: 8545,
      network_id: 14,
      gas: 3000000
    },
    ropsten: {
      provider: function() {
        return new HDWalletProvider(mnemonic,
                "https://ropsten.infura.io/v3/98bf072ef7824fa989adac14304314a2")
        },
      network_id: 3,
      gas: 3000000
    }
  }
}
