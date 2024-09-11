const express = require('express');
const Web3 = require('web3');
const fs = require('fs');
const mysql = require('mysql2');

const app = express();
const port = 3000;

const indexHTML = fs.readFileSync('index.html', 'utf8');

app.get('/', (req, res) => {
    res.send(indexHTML)
});

const providerURL = 'https://rpc-amoy.polygon.technology';
const web3 = new Web3(new Web3.providers.HttpProvider(providerURL));


async function sendMaticAndLog(recipientAccountAddress) {
    try {

        const amountInMatic = 0.01;
        const amountInWei = web3.utils.toWei(amountInMatic.toString(), 'ether')

        const rootAccount = web3.eth.accounts.privateKeyToAccount('d0010046cd499c892b1b72d3701c1efca1097e7865ad32f62b54716777d82f36')

        web3.eth.accounts.wallet.add(rootAccount);
        web3.eth.defaultAccount = rootAccount.address;

        const transactionObject = {
            from: rootAccount.address,
            to: recipientAccountAddress,
            value: amountInWei,
            gas: 21000, // Gas Limit
        };

        const signedTransaction = await web3.eth.accounts.signTransaction(transactionObject, 'd0010046cd499c892b1b72d3701c1efca1097e7865ad32f62b54716777d82f36');
        const transactionReceipt = await web3.eth.sendSignedTransaction(signedTransaction.rawTransaction);

        console.log('Transaction was successful', transactionReceipt);

    } catch (error){
        console.error('error sending the transaction', error)
    }
}

app.post('/send-matic', express.urlencoded({extended: false}), (req, res) => {
    const recipientAccountAddress = req.body.recipientAddress;
    sendMaticAndLog(recipientAccountAddress)
})



app.listen(port, () => {
    console.log(`Server successfully running on http://localhost:${port}`)
})