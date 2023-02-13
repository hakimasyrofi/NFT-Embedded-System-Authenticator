import './App.css';
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Link, Routes} from "react-router-dom";
import Web3 from 'web3';
import SmartNFT from './contracts/SmartNFT.json'
import Manufacturer from"./components/Manufacturer" 
import Navbar from './components/Navbar';


function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [userInfo, setUserInfo] = useState({});

  let smartNFTContract;
  let contractIsInitialized = false;

  // call safeMint function in smart contract
  const createToken = async (address) => {
    if (!contractIsInitialized){
      await onConnect();
    }
    return smartNFTContract.methods.safeMint(address).send({ from: JSON.parse(window.localStorage.getItem('userAccount'))["account"] })
    .once('receipt', async (receipt) => {
      console.log(receipt);
      window.localStorage.setItem('createToken', JSON.stringify(receipt));
      // window.location.reload();
    })
    .catch((e) => {
      console.log(e);
    });

  }

  useEffect(() => {
    function checkConnectedWallet() {
      const userData = JSON.parse(localStorage.getItem('userAccount'));
      if (userData != null) {
        setUserInfo(userData);
        setIsConnected(true);
      }
    }
    checkConnectedWallet();
  }, []);

  const detectCurrentProvider = () => {
    let provider;
    if (window.ethereum) {
      provider = window.ethereum;
    } else if (window.web3) {
      // eslint-disable-next-line
      provider = window.web3.currentProvider;
    } else {
      console.log(
        'Non-Ethereum browser detected. You should consider trying MetaMask!'
      );
    }
    return provider;
  };

  const onConnect = async () => {
    try {
      const currentProvider = detectCurrentProvider();
      if (currentProvider) {
        if (currentProvider !== window.ethereum) {
          console.log(
            'Non-Ethereum browser detected. You should consider trying MetaMask!'
          );
        }
        await currentProvider.request({ method: 'eth_requestAccounts' });
        const web3 = new Web3(currentProvider);
        const userAccount = await web3.eth.getAccounts();
        
        const networkId = await web3.eth.net.getId()
		    const networkData = SmartNFT.networks[networkId]

        const account = userAccount[0];
        let ethBalance = await web3.eth.getBalance(account); // Get wallet balance
        ethBalance = web3.utils.fromWei(ethBalance, 'ether'); //Convert balance to wei
        
        saveUserInfo(ethBalance, account, networkId);
        if (userAccount.length === 0) {
          console.log('Please connect to meta mask');
        }

        if (networkData){
          smartNFTContract = new web3.eth.Contract(SmartNFT.abi, networkData.address);
          contractIsInitialized = true;
        }
      }
    } catch (err) {
      console.log(
        'There was an error fetching your accounts. Make sure your Ethereum client is configured correctly.'
      );
    }
  };

  const onDisconnect = () => {
    window.localStorage.removeItem('userAccount');
    setUserInfo({});
    setIsConnected(false);
  };

  const saveUserInfo = (ethBalance, account, chainId) => {
    const userAccount = {
      account: account,
      balance: ethBalance,
      connectionid: chainId,
    };
    window.localStorage.setItem('userAccount', JSON.stringify(userAccount)); //user persisted data
    const userData = JSON.parse(localStorage.getItem('userAccount'));
    setUserInfo(userData);
    setIsConnected(true);
  };

  return (
    <div className="app">
      <Router>
      <Navbar isConnected={isConnected} onDisconnect={onDisconnect} userInfo={userInfo.account} balance={userInfo.balance}/>
        <Routes>
          {/* <Route path="/" element={} /> */}
          {/* <Route path="/manufacturer" element={} /> */}
        </Routes>
      </Router>
      <div class="column"> {/*margin: 0; position: absolute; top: 50%; -ms-transform: translateY(-50%); transform: translateY(-50%); // */}
      {!isConnected && (
        <div class="columns is-centered" style={{"padding-top": "200px"}}> 
          <button class="button is-primary" onClick={onConnect}>
            Connect to MetaMask
          </button>
        </div>
      )}
      </div>
      {isConnected && (
      <div className="app-wrapper">
        <Manufacturer createToken={createToken}/>
      </div>
      )}
    </div>
  );
}

export default App;