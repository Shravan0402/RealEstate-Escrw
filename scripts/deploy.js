const { network } = require("hardhat");
const hre = require("hardhat");
const { networkConfig, developmentChains, VERIFICATION_BLOCK_CONFIRMATIONS } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")
// Importing all the important stuffs for the deployment and verification of the smart contract

async function main(){
    console.log("Started the deployment process .... ")
    const deployer = await hre.ethers.getSigners(); // Getting the accounts to the deploy the smart contract
    const chainId = network.config.chainId // Getting the chainId of the used network
    const waitBlocks = (developmentChains.includes(network.name)) ? 1 : VERIFICATION_BLOCK_CONFIRMATIONS  // Fetching the time delay for the netwirk is it's not a development chain
    let realEstateContract = await hre.ethers.getContractFactory("RealEstate") // Reading out the smart contract from the contract folder
    realEstateContract = await realEstateContract.deploy() // Deploying the smart contract on the network
    await realEstateContract.deployTransaction.wait(waitBlocks) // Waiting for the time delay to be completed so that we can proceed for the smart contract verification
    console.log(`RealEstate coontract is funded at ${realEstateContract.address}`) // Printing out the address on to which the smart contract is deployed
    let escrowContract = await hre.ethers.getContractFactory("Escrow")
    escrowContract = await escrowContract.deploy(realEstateContract.address)
    await escrowContract.deployTransaction.wait(waitBlocks)
    console.log(`Escrow contract is funded at ${escrowContract.address}`)

    if(!developmentChains.includes(network.name)){ // Checking if the network is localhost or not
        await verify(realEstateContract.address, [])
        await verify(escrowContract.address, [realEstateContract.address])
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});