/**
 * Use this file to configure your truffle project. It's seeded with some
 * common settings for different networks and features like migrations,
 * compilation and testing. Uncomment the ones you need or modify
 * them to suit your project as necessary.
 *
 * More information about configuration can be found at:
 *
 * trufflesuite.com/docs/advanced/configuration
 *
 * To deploy via Infura you'll need a wallet provider (like @truffle/hdwallet-provider)
 * to sign your transactions before they're sent to a remote public node. Infura accounts
 * are available for free at: infura.io/register.
 *
 * You'll also need a mnemonic - the twelve word phrase the wallet uses to generate
 * public/private key pairs. If you're publishing your code to GitHub make sure you load this
 * phrase from a file you've .gitignored so it doesn't accidentally become public.
 *
 */

const Web3 = require('web3');
const web3 = new Web3();
const dotenv = require('dotenv');
const HDWalletProvider = require('@truffle/hdwallet-provider');

dotenv.config();
const {
  INFURA_PROJECT_ID,
  RINKEBY_PRIVATE_KEY,
  MAINNET_PRIVATE_KEY,
  ETHERSCAN_API_KEY,
} = process.env;

const INFURA_RINKEBY_URL =`https://rinkeby.infura.io/v3/${INFURA_PROJECT_ID}`;
const INFURA_ROPSTEN_URL =`https://ropsten.infura.io/v3/${INFURA_PROJECT_ID}`;
const INFURA_MAINNET_URL = `https://mainnet.infura.io/v3/${INFURA_PROJECT_ID}`;

module.exports = {
  /**
   * Networks define how you connect to your ethereum client and let you set the
   * defaults web3 uses to send transactions. If you don't specify one truffle
   * will spin up a development blockchain for you on port 9545 when you
   * run `develop` or `test`. You can ask a truffle command to use a specific
   * network from the command line, e.g
   *
   * $ truffle test --network <network-name>
   */

  networks: {
    development: {
     host: "localhost",                       // Localhost (default: none)
     port: 8545,                              // Standard Ethereum port (default: none)
     network_id: "*",                         // Any network (default: none)
     gasPrice: web3.utils.toWei('50', 'gwei') // 50 gwei (in wei) (default: 100 gwei)
    },
    rinkeby: {
      provider: () => new HDWalletProvider({
        privateKeys: [RINKEBY_PRIVATE_KEY],
        providerOrUrl: INFURA_RINKEBY_URL,
      }),
      network_id: 4,                            // Rinkeby's id
      gas: 5500000,                             // Rinkeby has a lower block limit than mainnet
      gasPrice: web3.utils.toWei('50', 'gwei'), // 50 gwei (in wei) (default: 100 gwei)
      confirmations: 2,                         // # of confirmations to wait between deployments. (default: 0)
      timeoutBlocks: 200,                       // # of blocks before a deployment times out  (minimum/default: 50)
      skipDryRun: true,                         // Skip dry run before migrations? (default: false for public nets )
      networkCheckTimeout: 100000
    },
    mainnet: {
      provider: () => new HDWalletProvider({
        privateKeys: [MAINNET_PRIVATE_KEY],
        providerOrUrl: INFURA_MAINNET_URL,
      }),
      network_id: 1,                            // Mainnet's id
      gas: 8500000,                             // Gas sent with each transaction (default: ~6700000)
      gasPrice: web3.utils.toWei('50', 'gwei'), // 50 gwei (in wei) (default: 100 gwei)
      confirmations: 2,                         // # of confirmations to wait between deployments. (default: 0)
      timeoutBlocks: 200,                       // # of blocks before a deployment times out  (minimum/default: 50)
      networkCheckTimeout: 100000,
    },
  },

  // Set default mocha options here, use special reporters etc.
  mocha: {
    // timeout: 100000
  },

  // Configure your compilers
  compilers: {
    solc: {
      version: "^0.8.0",      // Fetch exact version from solc-bin (default: truffle's version)
      // docker: true,        // Use "0.5.1" you've installed locally with docker (default: false)
      // settings: {          // See the solidity docs for advice about optimization and evmVersion
      //  optimizer: {
      //    enabled: false,
      //    runs: 200
      //  },
      //  evmVersion: "byzantium"
      // }
    }
  },

  // Truffle DB is currently disabled by default; to enable it, change enabled:
  // false to enabled: true. The default storage location can also be
  // overridden by specifying the adapter settings, as shown in the commented code below.
  //
  // NOTE: It is not possible to migrate your contracts to truffle DB and you should
  // make a backup of your artifacts to a safe location before enabling this feature.
  //
  // After you backed up your artifacts you can utilize db by running migrate as follows: 
  // $ truffle migrate --reset --compile-all
  //
  // db: {
    // enabled: false,
    // host: "127.0.0.1",
    // adapter: {
    //   name: "sqlite",
    //   settings: {
    //     directory: ".db"
    //   }
    // }
  // }
  api_keys: {
    etherscan: ETHERSCAN_API_KEY,
  },
  plugins: ['truffle-plugin-verify'],
};
