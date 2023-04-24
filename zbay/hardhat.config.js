/** @type import('hardhat/config').HardhatUserConfig */
require('dotenv').config()
require('@nomiclabs/hardhat-ethers')
const { PRIVATE_KEY, INFURA_API_KEY } = process.env
module.exports = {
  solidity: '0.8.18',
  networks: {
    goerli: {
      url: `https://goerli.infura.io/v3/${INFURA_API_KEY}`,
      accounts: [`0x` + PRIVATE_KEY],
      gas: 2100000,
    },
    sepolia: {
      url: `https://sepolia.infura.io/v3/${INFURA_API_KEY}`,
      accounts: [`0x` + PRIVATE_KEY],
      gas: 2100000,
    },
    localhost: {
      url: 'http://127.0.0.1:8545',
      accounts: ['0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80'],
      gas: 2100000,
    },
  },
}
