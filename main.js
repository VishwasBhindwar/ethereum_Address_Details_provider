
const bep20 = require('./Tokens/bep20.js');
const erc20 = require('./Tokens/erc20.js');
const eth = require('./Tokens/ether.js');


//test
async function getAllTransactions(address, startBlock, endBlock) {
    try {
        await Promise.all([
            eth.getTx(address, startBlock, endBlock),
            erc20.getERCTokenTransactions(address,startBlock,endBlock),
            bep20.getBEPTokenTransactions(address,startBlock,endBlock)
        ]);
        console.log('All transactions processed successfully.');
    } catch (error) {
        console.error('Error:', error);
    }
}
//change accordingly
const address = '0x3257eFF4bDCb74B6Ebf8F0F4C67F5d15288Cf97C';
let startBlock = new Date(2024, 2, 17, 0, 0, 0);//january is 0 and December is 11 
let endBlock = new Date(2024, 2, 17, 1, 0, 0);
getAllTransactions(address, startBlock, endBlock);



