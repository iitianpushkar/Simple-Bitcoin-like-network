import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import Wallet from './wallet';
import Transaction from './Transaction';


function App() {
  return (
    <>
      <div className="App">
            <h1>Simple Bitcoin-Like System</h1>
            <Wallet />
            <Transaction />
        </div>
    </>
  )
}

export default App
