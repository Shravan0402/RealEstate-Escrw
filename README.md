# RealEstate Escrow Project

In this repo, you will be able to find the smart contract and all the important unit tests and deployment files related to this project. This project is built using [Hardhat](https://hardhat.org/) which is an Ethereum Development Kit used to develop smart contracts, and test and deploy them into live networks. Hardhat is a library in NodeJS so we need to code it using JS/Typescript.

## Installation

Use the package manager [npm](https://www.npmjs.com/) to install all the important prerequisites. We have package.json and package-lock.json file which stores the name and versions of the prerequisites needed for this project.

```bash
npm install
```

## Structure of the project
```
Contracts -> This folder stores all the smart contracts needed for this project.
```
```
Scripts -> This folder stores all the deployments and functions-related scripts needed for this project.
```
```
Test -> This folder stores all the unit tests we are needed to implement on this project.
```
```
Utils -> This folder stores all the extra functionalities that we need in our project like smart contract verification.
```
```
Hardhat config -> This file stores the important configuration of all the smart contracts and deployment-related stuff.
```
```
helper-hardhat-config -> This file has extra configuration we will be needing for this project.
```

## Enviornment variables
Create a .env file in the parent directory and edit it accordingly
```bash
POLYGON_TEST_RPC_URL = #Your alchemy URL
PRIVATE_POLYGON_TEST_KEY = #Your wallet private key
POLYGONSCAN_API_KEY = #API KEY generated from the block explorer website
GOERLI_TEST_RPC_URL = #Your alchemy URL
GOERLI_TEST_KEY = #Your wallet private key
GOERLI_API_KEY = #API KEY generated from the block explorer website
```

## Commands 

```bash
npx hardhat compile #This command is used to compile the smart contracts

npx hardhat test #This command is used to run the unit tests on the smart contracts on the local network

npx hardhat run .\scripts\deploy.js #This command is used to deploy the smart contract on the local blockchain

npx hardhat run .\scripts\deploy.js --network networkname #This command is used to deploy the smart contract on a network that we have configured in the hardhat config file.

npx hardhat run .\scripts\deploy.js --network goerli
npx hardhat run .\scripts\deploy.js --network polygonMumbai
```

## License
[MIT](https://choosealicense.com/licenses/mit/)