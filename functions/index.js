const functions = require("firebase-functions");
const lotteryAbi = require('./config/abis/lottery.json')
const addresses = require('./config/constants/contracts')
const Web3Provider = require('./Services/Web3Provider')

const runtimeOpts = {
    timeoutSeconds: 300,
    memory: '1GB'
}

const drawingTime = '0 18 * * 3'
const resetTime = '0 6 * * 3'
exports.drawingWinningNumber = functions.runWith(runtimeOpts).pubsub.schedule(drawingTime).timeZone('UTC').onRun(async (context) => {
    console.log('drawingWinningNumber function ' + drawingTime);
    const lotteryContractAddress = addresses.lotteryForMkat
    const web3Provider = new Web3Provider()
    const web3 = web3Provider.getWeb3Provider()
    const lotteryContract = new web3.eth.Contract(lotteryAbi, lotteryContractAddress)

    const tx1 = {
      from: web3Provider.getAccountAddress(),
      to: lotteryContractAddress,
      gas: 2000000,
      data: lotteryContract.methods.enterDrawingPhase().encodeABI()
    }

    console.log(await web3Provider.execute(tx1))

    const randomNumber = Math.floor(Math.random() * 100);
    const tx2 = {
      from: web3Provider.getAccountAddress(),
      to: lotteryContractAddress,
      gas: 2000000,
      data: lotteryContract.methods.drawing(randomNumber).encodeABI()
    }
    console.log(await web3Provider.execute(tx2))
    return null
});

exports.resetLottery = functions.runWith(runtimeOpts).pubsub.schedule(resetTime).timeZone('UTC').onRun(async (context) => {
    console.log('resetLottery function ' + resetTime);
    const lotteryContractAddress = addresses.lotteryForMkat
    const web3Provider = new Web3Provider()
    const web3 = web3Provider.getWeb3Provider()
    const lotteryContract = new web3.eth.Contract(lotteryAbi, lotteryContractAddress)

    const tx = {
        from: web3Provider.getAccountAddress(),
        to: lotteryContractAddress,
        gas: 2000000,
        data: lotteryContract.methods.reset().encodeABI()
    }
  
    console.log(await web3Provider.execute(tx))
    return null
});
  