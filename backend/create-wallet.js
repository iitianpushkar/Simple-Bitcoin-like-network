const express =require("express")
const bip39=require("bip39")
const bitcoin = require("bitcoinjs-lib")

const { BIP32Factory } = require('bip32');
const ecc = require('tiny-secp256k1');
const bip32 = BIP32Factory(ecc);

const cors=require("cors")

const app=express()

const corsoption={
   origin:"http://localhost:5173"
}
app.use(cors(corsoption))

const network = bitcoin.networks.testnet;

function generatewallet(){
        // Generate a mnemonic (12 words)
        const mnemonic = bip39.generateMnemonic();

        // Derive seed from mnemonic
        const seed = bip39.mnemonicToSeedSync(mnemonic);
        
        // Create a BIP32 root key
        const root = bip32.fromSeed(seed,network);
        
        // Derive the first account based on BIP44 (m/44'/0'/0'/0/0)
        const path = "m/44'/1'/0'/0/0";
        const account = root.derivePath(path);
        
        // Get the private and public keys in WIF 
        const privateKey = account.toWIF();  // Wallet Import Format
        const publicKey = account.publicKey.toString("hex");  // Public key 
        const { address } = bitcoin.payments.p2pkh({ pubkey: account.publicKey });

        return {mnemonic, address,publicKey, privateKey }; 

}
app.get("/create-wallet",(req,res)=>{
    const response=generatewallet();
    console.log(response)
    res.send(response)
})

app.listen(5000,console.log("create-wallet server is running at http://localhost:5000"))
