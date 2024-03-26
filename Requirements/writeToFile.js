const fs = require('fs').promises;

async function writeTransactionsToFileForErc(transactions) {
    try {
        const stringifyTransactions = transactions.map(transaction => ({
            ...transaction,
            TransactionValue: transaction.TransactionValue.toString()
        }));

        const jsonData = stringifyTransactions.map(transaction => {
            return `{
            "BlockNumber": ${transaction.BlockNumber},
            "TransactionHash": "${transaction.TransactionHash}",
            "From": "${transaction.From}",
            "To": "${transaction.To}",
            "TransactionValue": "${transaction.TransactionValue}",
            "Type":"${transaction.Type}"
        }`;
        }).join(',\n');

        await fs.writeFile('logs/outputErc.txt', `[${jsonData}]`);
        console.log('');
        console.log('\nAccess Transaction details in outputErc.txt');
        console.log('Written to file successfully');
    } catch (err) {
        console.error('Error writing transactions to file:', err);
    }
}

async function writeTransactionsToFileForBep(transactions) {
    try {
        const stringifyTransactions = transactions.map(transaction => ({
            ...transaction,
            TransactionValue: transaction.TransactionValue.toString()
        }));

        const jsonData = stringifyTransactions.map(transaction => {
            return `{
            "BlockNumber": ${transaction.BlockNumber},
            "TransactionHash": "${transaction.TransactionHash}",
            "From": "${transaction.From}",
            "To": "${transaction.To}",
            "TransactionValue": "${transaction.TransactionValue}",
            "Type":"${transaction.Type}"
        }`;
        }).join(',\n');

        await fs.writeFile('logs/outputBep.txt', `[${jsonData}]`);
        console.log('');
        console.log('Access Transaction details in outputBep.txt');
        console.log('Written to file successfully');
    } catch (err) {
        console.error('Error writing transactions to file:', err);
    }
}

async function writeTransactionsToFileForEth(transactions) {
    try {
        const outputData = transactions.map((transaction) => JSON.stringify(transaction)).join('\n');
        await fs.writeFile('logs/outputEth.txt', outputData);
        console.log('Access Transaction details in outputEth.txt');
        console.log('Written to file successfully');
    } catch (err) {
        console.error('Error writing ETH transactions to file:', err);
    }
}

module.exports = { writeTransactionsToFileForErc,writeTransactionsToFileForBep,writeTransactionsToFileForEth };