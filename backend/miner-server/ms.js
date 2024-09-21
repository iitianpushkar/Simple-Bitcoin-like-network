const express = require("express");
const app = express();
const io = require("socket.io-client");
const cors = require("cors");
const elliptic = require("elliptic");
const bodyparser = require("body-parser");
const portfinder = require("portfinder");
const crypto = require("crypto");
const path=require("path")

const ec = new elliptic.ec('secp256k1');

portfinder.basePort = 3000;

let blockchain = [];  // Array to hold the blockchain

app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());

const corsOption = {
    origin: "http://localhost:5173"
};
app.use(cors(corsOption));

portfinder.getPort((err, port) => {
    if (err) {
        console.log("Error in finding port");
        return;
    }
    const server = app.listen(port,
        console.log(`Miner server is running at: http://localhost:${port}`)
    );
});


app.post("/verify-transaction", (req, res) => {

    const { transaction, signature } = req.body;
    const { from, to, amount, publicKey } = transaction;
    console.log("public-key:", publicKey)
    console.log("server-signature:", signature)
    const message = `${from}${to}${amount}`;
    console.log("Received Message:", message);
    const messageHash = crypto.createHash('sha256').update(message).digest('hex');
    console.log("Message Hash:", messageHash.toString('hex'));
    const messageBuffer = Buffer.from(messageHash, 'hex');
    const keyPair = ec.keyFromPublic(publicKey,'hex');
    //console.log("keypair:",keyPair)
    const signatureBuffer = Buffer.from(signature, 'hex');
    const isValid = keyPair.verify(messageBuffer, signature);
    console.log("Server - Verification Result:", isValid);
    res.send({ isValid });

    if(!isValid){
    // Set EJS as the view engine

    app.set('view engine', 'ejs');
    app.set('views', path.join(__dirname, 'views'));
    
    app.get('/', (req, res) => {
        res.render('index.ejs',
            {cards:transaction});
      });
      isValid==true;
    }
   
});

const socket = io("http://localhost:8000");

socket.on("connect", () => {
    console.log("Connected with central server");
});

