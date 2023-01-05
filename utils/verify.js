const { run } = require("hardhat")

// Declaring the verify function to verify the smart contract on the blockexplorer websites according to the networks

const verify = async (contractAddress, args) => {
  console.log("Verifying contract...")
  try {
    await run("verify:verify", {
      address: contractAddress, // Address of the smart contract
      constructorArguments: args, // Arguments for the constructor
    })
  } catch (e) {
    if (e.message.toLowerCase().includes("already verified")) {
      console.log("Already verified!")
    } else {
      console.log(e)
    }
  }
}

module.exports = { verify }