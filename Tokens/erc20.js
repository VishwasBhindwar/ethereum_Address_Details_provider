
require('dotenv').config();
const { Web3 } = require('web3');
const cliProgress = require('cli-progress');
const web3 = new Web3(`${process.env.ERC_TOKEN_RPC_URL}`);
const { tokenContractDetailsERC20, ercAbi } = require('../config/config.js');
const bar1 = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);

async function getBlockNumberFromDate(date) {
    try {
        const targetTimestamp = Math.floor(date.getTime() / 1000);
        const latestBlockNumber = Number(await web3.eth.getBlockNumber());

        let left = 0; // Starting block number
        let right = latestBlockNumber; // Latest block number
        let closestBlockNumber = null;
        let closestTimestampDiff = Infinity;

        while (left <= right) {
            const mid = Math.floor((left + right) / 2);
            const block = await web3.eth.getBlock(mid);
            if (!block) {
                // Handle the case where block retrieval fails
                return closestBlockNumber; // Return the closest block number found
            }
            const blockTimestamp = Number(block.timestamp);
            const timestampDiff = Math.abs(blockTimestamp - targetTimestamp);

            if (timestampDiff < closestTimestampDiff) {
                closestTimestampDiff = timestampDiff;
                closestBlockNumber = mid;
            }

            if (blockTimestamp === targetTimestamp) {
                // If exact match found, return the block number
                return mid;
            } else if (blockTimestamp < targetTimestamp) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }

        return closestBlockNumber;
    } catch (error) {
        console.error('Error fetching block number from date:', error);
        return null;
    }
}

async function getERCTokenTransactions(Address, startBlock, endBlock) {
    let transactions = [];
    const tokenCount = Object.keys(tokenContractDetailsERC20).length; // Get total number of tokens
    console.log(`\n${tokenCount} Tokens to process, for Erc20`);
    bar1.start(tokenCount, 0);
    let sBlock = await getBlockNumberFromDate(startBlock);
    let eBlock = await getBlockNumberFromDate(endBlock);
    const blockRangeSize = 2000;
    for (const [tokenName, ContractAddress] of Object.entries(tokenContractDetailsERC20)) {
        const contract = new web3.eth.Contract(ercAbi, ContractAddress);
        
        let givenAddress = Address;
        for (let fromBlock = sBlock; fromBlock <= eBlock; fromBlock += blockRangeSize) {
            const toBlock = Math.min(fromBlock + blockRangeSize, eBlock);
            // Fetch logs for Transfer events for the current block
            const logs = await contract.getPastEvents('Transfer', {
                filter: {},
                fromBlock: fromBlock,
                toBlock: toBlock
            });

            //Print transfer events for the current block
            for (const log of logs) {
                let type;
                if (log.returnValues.from === givenAddress) {
                    type = 'Withdrawal';
                } else if (log.returnValues.to === givenAddress) {
                    type = 'Deposit';
                }
                if (log.returnValues.from === givenAddress || log.returnValues.to === givenAddress) {
                    transactions.push({
                        BlockNumber: log.blockNumber,
                        TransactionHash: log.transactionHash,
                        From: log.returnValues.from,
                        To: log.returnValues.to,
                        TransactionValue: `${log.returnValues.value} ${tokenName}`,
                        Type: type
                    });
                    
                }
            }
        }
        bar1.increment();
    }
    
    return transactions;
    bar1.stop();
}

module.exports = { getERCTokenTransactions };