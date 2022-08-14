const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Account balance:", (await deployer.getBalance()).toString());
  const RealEstateContract = await hre.ethers.getContractFactory("RealEstate")
  const realestate = await RealEstateContract.deploy()
  await realestate.deployed()
  console.log(`The real estate contract address is :- ${realestate.address}`)
  const EscrowContract = await hre.ethers.getContractFactory("Escrow")
  const escrow = await EscrowContract.deploy(realestate.address)
  await escrow.deployed()
  console.log(`The escrow contract address is :- ${escrow.address}`)
}


main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
