// frontend/src/Wallet.js

import {useState} from "react"
import axios from "axios"

function Wallet() {
const [wallet,setwallet]=useState(null)

const createWallet=async ()=>{
       
    const response=await axios.get("http://localhost:5000/create-wallet")
    console.log(response)
    setwallet(response.data)
    console.log(wallet)

}

    return (
        <div>
            <h2>Create Wallet</h2>
            <button onClick={createWallet}>Create Wallet</button>
            {wallet && (
                <div>
                    <p><strong>Mnemonic:</strong></p>
                    <pre>{wallet.mnemonic}</pre>
                    <p><strong>Address:</strong></p>
                    <pre>{wallet.address}</pre>
                    <p><strong>Public Key:</strong></p>
                    <pre>{wallet.publicKey}</pre>
                    <p><strong>Private Key:</strong></p>
                    <pre>{wallet.privateKey}</pre>
                </div>
            )}
        </div>
    );
}

export default Wallet;
