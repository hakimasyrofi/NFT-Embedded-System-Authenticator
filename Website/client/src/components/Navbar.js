import React from "react";
import { Link } from 'react-router-dom';
import 'bulma/css/bulma.min.css';

function Navbar(props) {
    
    return (
        <nav class="navbar is-black" role="navigation" aria-label="main navigation">
            <div class="navbar-brand">
                <a class="navbar-item">
                    <Link to="/"/>
                    <img src="https://cdn-icons-png.flaticon.com/512/6298/6298900.png" alt="" height="50"/>
                </a>
                <a class="navbar-item">
                    <Link class="title is-4 has-text-white" to="/">Smart NFT</Link>
                </a>
                <a role="button" class="navbar-burger" aria-label="menu" aria-expanded="false" data-target="navbarSmartParking">
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                </a>
            </div>
            {props.isConnected &&
            <div id="navbarSmartParking" class="navbar-menu">
                <div class="navbar-end">
                    <div class="navbar-item">
                        <b>Address:</b>
                        <p>{props.userInfo}</p>
                    </div>
                    <div class="navbar-item">
                        <b>Balance:</b>
                        <p>{props.balance} ETH</p>
                    </div>
                    <div class="navbar-item">
                        <button class="button is-primary" onClick={props.onDisconnect}>Disconnect</button>
                    </div>
                </div>
            </div>}
        </nav>
    );
}

export default Navbar;