require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-etherscan");
require('dotenv').config()
/** @type import('hardhat/config').HardhatUserConfig */

// Reading all the env variable from the .env file
POLYGON_TEST_RPC_URL = process.env.POLYGON_TEST_RPC_URL
PRIVATE_POLYGON_TEST_KEY = process.env.PRIVATE_POLYGON_TEST_KEY
POLYGONSCAN_API_KEY = process.env.POLYGONSCAN_API_KEY
GOERLI_TEST_RPC_URL = process.env.GOERLI_TEST_RPC_URL
GOERLI_TEST_KEY = process.env.GOERLI_TEST_KEY
GOERLI_API_KEY = process.env.GOERLI_API_KEY

module.exports = {
  solidity: "0.8.8",
  networks:{
    hardhat:{
      chainId: 31337 // Declaring the localhost chainId
    },
    polygonMumbai:{
      chainId: 80001,       // Declaring the polygonMumbai Test network
      url: POLYGON_TEST_RPC_URL,
      accounts:[PRIVATE_POLYGON_TEST_KEY]
    },
    goerli:{
      chainI: 5,  // Declaring the Goerli ETH testnet
      url: GOERLI_TEST_RPC_URL,
      accounts:[GOERLI_TEST_KEY]
    }
  },
  etherscan:{
    apiKey: { // Declaring the apikey for the smart contract verification
      polygonMumbai: POLYGONSCAN_API_KEY,
      goerli: GOERLI_API_KEY
    }
  }
};
