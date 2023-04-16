// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require('hardhat')

async function deployVerifier() {
  const Verifier = await hre.ethers.getContractFactory('TurboVerifier')
  const verifier = await Verifier.deploy()

  await verifier.deployed()

  console.log(`Verifier deployed to ${verifier.address}`)
  return verifier.address
}

async function deployAuction() {
  const verifierAddress = await deployVerifier()

  const Auction = await hre.ethers.getContractFactory('Auction')
  const auction = await Auction.deploy(verifierAddress)

  await auction.deployed()

  console.log(`Auction deployed to ${auction.address}`)
  return auction.address
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
deployAuction().catch(error => {
  console.error(error)
  process.exitCode = 1
})
