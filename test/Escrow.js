const { expect } = require('chai');
const { ethers } = require('hardhat');

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether')
}

const ether = tokens

describe("Real Estate tests", ()=>{
    let deployer, buyer, lender, inspector;
    let nftID = 2;
    let purchaseAmount = ether(100);
    let loanAmount = ether(80)
    let escrowAmount = ether(25);
    let RealEstateContract, EscrowContract, realestate, escrow

    beforeEach(async()=>{
        let accounts = await ethers.getSigners()
        deployer = accounts[0]
        buyer = accounts[1]
        seller = accounts[2]
        lender = accounts[3]
        inspector = accounts[4]
        RealEstateContract = await ethers.getContractFactory("RealEstate")
        realestate = await RealEstateContract.deploy()
        let transaction = await realestate.connect(seller).mint("Your property data link")
        await transaction.wait()
        EscrowContract = await ethers.getContractFactory("Escrow")
        escrow = await EscrowContract.deploy(realestate.address)
        transaction = await realestate.connect(seller).approve(escrow.address, nftID)
        await transaction.wait()
    })

    describe('Transacting a property', async()=>{

        it("Transaction in progress", async()=>{
            await escrow.connect(seller).new_estate(nftID, buyer.address, inspector.address, lender.address, purchaseAmount)
            

            // Paying the escrow amount to the contract
            console.log("Transacting money from buyers money to smart contract")
            console.log(`Buyer's account balance before transaction is :- ${ether(await buyer.getBalance())}`)
            console.log(`Contract's account balance before transaction is :- ${ether(await escrow.getBalance(nftID))}`)
            transaction = await escrow.connect(buyer).pay_escrow(nftID,{value : escrowAmount})
            await transaction.wait()
            console.log("After buyer paying the escrow amount")
            console.log(`Buyer's account balance after transaction is :- ${ether(await buyer.getBalance())}`)
            console.log(`Contract's account balance after transaction is :- ${ether(await escrow.getBalance(nftID))}`)
        
            // Giving the inspection report as true
            transaction = await escrow.connect(inspector).inspection_update(nftID, 1)
            await transaction.wait()

            //Lender paying money to the smart contract
            console.log("Transacting money from lenders to smart contract")
            console.log(`lender's account balance before transaction is :- ${ether(await lender.getBalance())}`)
            console.log(`Contract's account balance before transaction is :- ${ether(await escrow.getBalance(nftID))}`)
            transaction = await escrow.connect(lender).pay_lender(nftID,{value : loanAmount})
            await transaction.wait()
            console.log("After lender paying the escrow amount")
            console.log(`lender's account balance after transaction is :- ${ether(await lender.getBalance())}`)
            console.log(`Contract's account balance after transaction is :- ${ether(await escrow.getBalance(nftID))}`)

            // Approving the transaction from all parties
            transaction = await escrow.connect(seller).approve(nftID)
            await transaction.wait()
            transaction = await escrow.connect(buyer).approve(nftID)
            await transaction.wait()
            transaction = await escrow.connect(lender).approve(nftID)
            await transaction.wait()

            //Transacting the property
            console.log("Before transacting the property")
            console.log(`inspector's account balance before transaction is :- ${ether(await inspector.getBalance())}`)
            console.log(`seller's account balance before transaction is :- ${ether(await seller.getBalance())}`)
            console.log(`owner's account balance before transaction is :- ${ether(await deployer.getBalance())}`)
            console.log(`Contract's account balance before transaction is :- ${ether(await escrow.getBalance(nftID))}`)
            transaction = await escrow.connect(buyer).transact_property(nftID)
            await transaction.wait()
            console.log("After transacting the property")
            console.log(`inspector's account balance after transaction is :- ${ether(await inspector.getBalance())}`)
            console.log(`seller's account balance after transaction is :- ${ether(await seller.getBalance())}`)
            console.log(`owner's account balance after transaction is :- ${ether(await deployer.getBalance())}`)
            console.log(`Contract's account balance after transaction is :- ${ether(await escrow.getBalance(nftID))}`)
        })

    })

})