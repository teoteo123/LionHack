
require('@nomiclabs/hardhat-ethers')
require('dotenv').config()
const fs = require('fs')
const util = require('util')
const ethers = require('ethers')
const fsPromises = fs.promises

const ABI_FILE_PATH = 'artifacts/contracts/Auction.sol/Auction.json'
const DEPLOYED_CONTRACT_ADDRESS = '0x0165878A594ca255338adfa4d48449f69242Eb8F'

// load ABI from build artifacts
async function getAbi() {
	const data = await fsPromises.readFile(ABI_FILE_PATH, 'utf-8');
	const abi = JSON.parse(data)['abi'];
	return abi;
}

async function main() {
	// const { INFURA_API_KEY } = process.env
	// let provider = ethers.getDefaultProvider(`https://goerli.infura.io/${INFURA_API_KEY}`)
	let provider = ethers.getDefaultProvider('http://127.0.0.1:8545')
	const abi = await getAbi();
	let contract = new ethers.Contract(DEPLOYED_CONTRACT_ADDRESS, abi, provider);
	const numBids = await contract.commitment()
	console.log(numBids)
}

main()