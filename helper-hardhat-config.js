const networkConfig = {
    31337 : {
        name:"localhost"
    },
    80001:{
        name:"polygonMumbai"
    },
    5:{
        name:"goerli"
    }
} // Declaring the configuration of alll the different networks we are going to use
// decalred the configuration as dict with the chainId as the key and the value is the configuration

const developmentChains = ["hardhat", "localhost"]
const VERIFICATION_BLOCK_CONFIRMATIONS = 6 // Declaring out the time delay to wait for verification of the smart contract as the block explorer website takes a bit tof time to get the blocks

module.exports = {
    networkConfig,
    developmentChains,
    VERIFICATION_BLOCK_CONFIRMATIONS
}