import React from 'react'
import { useState } from 'react';
import Web3 from 'web3';

export default function Manufacturer(props) {

    const [inputAddress, setInputAddress] = useState('');
    const [isInputValid, setInputValid] = useState(true);

    return (
        <div>
            <h2 class="title is-3 has-text-centered pt-2">NFT Token Creator</h2>
            <form class="box">
                <p class="pd">Input the owner address of the token!</p>
                <p class="control mt-2">
                    <input value={inputAddress} onInput={e => setInputAddress(e.target.value)} class={isInputValid? "input is-primary":"input is-danger"} type="text" placeholder="Owner Address"/>
                    <a class="button is-primary mt-5" onClick={()=>submitToken()}>Create Token</a>
                </p>
            </form>
            <h2 class="title is-4 has-text-centered pt-2">Last Transaction Info:</h2>
            {/* <h2 class="title is-5 has-text-centered pt-1">{JSON.parse(window.localStorage.getItem('createToken')).blockHash}</h2> */}
            <h2 class="title is-5 has-text-centered pt-1">{"https://goerli.etherscan.io/tx/"+JSON.parse(window.localStorage.getItem('createToken')).transactionHash}</h2>
            {/* window.localStorage.getItem('createToken')["transactionHash"] */}
        </div>
    )

    function submitToken(){
        if (Web3.utils.isAddress(inputAddress)){
            setInputValid(true)
            console.log(inputAddress)
            props.createToken(inputAddress)

        }
        else{
            setInputValid(false)
            console.log("salah address")
        }
    }
}