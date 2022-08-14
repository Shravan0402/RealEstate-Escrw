require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config()
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.8",
  networks:{
    mumbai : {
      url:process.env.ALCHEMY_MUMBAI_URL,
      accounts:[process.env.PRIVATE_KEY],
      chainId : 80001
    }
  }
};
