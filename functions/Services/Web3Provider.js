const Web3 = require('web3');
const HDWalletProvider = require('truffle-hdwallet-provider');

class Web3Provider {
  constructor() {
    this.privateKey = '';
    this.provider = new HDWalletProvider(this.privateKey, `https://bsc-dataseed.binance.org/`);
    // this.provider = new HDWalletProvider(this.privateKey, `https://data-seed-prebsc-1-s2.binance.org:8545/`);
    this.web3 = new Web3(this.provider);
  }

  getWeb3Provider() {
    return this.web3;
  }

  getAccountAddress() {
    return this.provider.addresses[0];
  }

  async execute(tx) {
    try {
      const signedTx = await this.web3.eth.accounts.signTransaction(tx, this.privateKey);
      try {
        const receipt = await this.web3.eth.sendSignedTransaction(signedTx.raw || signedTx.rawTransaction);
        console.log('success');
      } catch (error) {
        console.log('sending Tx:', error);
      }
    } catch (error) {
      console.log('signing Tx:', error);
    }
  }
}

module.exports = Web3Provider;
