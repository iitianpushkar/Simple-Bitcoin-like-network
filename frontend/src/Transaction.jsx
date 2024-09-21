import { useState } from 'react';
import axios from 'axios';
import { ec as  EC } from 'elliptic';
import crypto from 'crypto';

const ec = new EC('secp256k1');  // Bitcoin's elliptic curve

function Transaction() {
    const [transaction, setTransaction] = useState({ from: '', to: '', amount: 0 , publicKey:'' });
    const [privateKey, setPrivateKey] = useState('');
    const [signedTransaction, setSignedTransaction] = useState('');

    const signTransaction = async () => {
        const keyPair = ec.keyFromPrivate(privateKey);
       // console.log("keypair:",keyPair)
        const message = `${transaction.from}${transaction.to}${transaction.amount}`;
        const messageHash = crypto.createHash('sha256').update(message).digest('hex');
        const signature = await keyPair.sign(messageHash).toDER('hex');
        await setSignedTransaction(signature);
        console.log("Client - Signed Message Hash:", messageHash.toString('hex'));
        console.log("Client - Signature:", signedTransaction.toString('hex'));
    };

    const sendTransaction = async () => {
        if(!signedTransaction) {
            alert("Please sign the transaction first");
            return;
        }
        try {
            const response = await axios.post('http://localhost:3000/verify-transaction', { transaction, signature: signedTransaction});

            console.log(response.data);
        } catch (error) {
            console.error('Error sending transaction:', error);
        }
    };

    return (
        <div>
            <h2>Create Transaction</h2>
            <input
                type="text"
                placeholder="From Address"
                value={transaction.from}
                onChange={e => setTransaction({ ...transaction, from: e.target.value })}
            />
            <input
                type="text"
                placeholder="To Address"
                value={transaction.to}
                onChange={e => setTransaction({ ...transaction, to: e.target.value })}
            />
            <input
                type="number"
                placeholder="Amount"
                value={transaction.amount}
                onChange={e => setTransaction({ ...transaction, amount: Number(e.target.value) })}
            />
            <input
                type="text"
                placeholder="Your Public Key"
                value={transaction.publicKey}
                onChange={e => setTransaction({ ...transaction, publicKey: e.target.value })}
            />
            <input
                type="text"
                placeholder="Private Key"
                value={privateKey}
                onChange={e => setPrivateKey(e.target.value)}
            /> 
            <button onClick={signTransaction}>Sign Transaction</button>
            {signedTransaction && (<p>Signed Transaction: {signedTransaction}</p>)}
            <button onClick={sendTransaction}>Send Transaction</button>
        </div>
    );
}

export default Transaction;
