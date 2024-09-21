const express=require("express")
const app=express()

const bodyparser=require("body-parser")

app.use(bodyparser.urlencoded({extended:true}))

app.use(bodyparser.json())

const server=app.listen(8000,
    console.log(`central server is running at:http://localhost:8000`)
)

const io = require("socket.io")(server, {
    allowEIO3: true, //False by default
  });

let miners = [];

io.on('connection', (miner) => {
    console.log('New miner connected:', miner.id);
    miners.push(miner);

    miner.on('message-from-miner', (data) => {
        console.log('Message received:', data);

        // Broadcast the message to all miners except the sender
        miners.forEach((e) => {
            if (e !== miner && e.connected) {
                e.emit('message-to-miners', data);
            }
        });
    });

    // Handle miner disconnection
    miner.on('disconnect', () => {
        console.log('Miner disconnected:', miner.id);
        miners = miners.filter(e => e !== miner);
    });
});
