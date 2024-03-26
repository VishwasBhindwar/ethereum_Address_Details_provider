const bep20 = require('./Tokens/bep20.js');
const erc20 = require('./Tokens/erc20.js');
const eth = require('./Tokens/ether.js');
const { writeTransactionsToFileForEth, writeTransactionsToFileForErc, writeTransactionsToFileForBep } = require('./Requirements/writeToFile.js');

async function getAllTransactions(address, startBlock, endBlock) {
    
        const ethTransactions = await eth.getTx(address, startBlock, endBlock);
        const ercTransactions = await erc20.getERCTokenTransactions(address, startBlock, endBlock);
        const bepTransactions = await bep20.getBEPTokenTransactions(address, startBlock, endBlock);

        // Write transactions to files
        await writeTransactionsToFileForEth(ethTransactions);
        await writeTransactionsToFileForErc(ercTransactions);
        await writeTransactionsToFileForBep(bepTransactions);

        console.log('\nAll transactions processed successfully.');
        return;
    
}

//change accordingly
const address = '0xbC9B915D0E54c0d2fc7c3a6376c6FC0eC406c47a';
let startBlock = new Date(2024, 2, 25, 18, 28, 0); //january is 0 and December is 11 
let endBlock = new Date(2024, 2, 25, 19,28, 0);
getAllTransactions(address, startBlock, endBlock);
