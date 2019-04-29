import React from 'react';
import Script from 'react-load-script'
import {ReactComponent as Logo} from './logo.svg';
import {
    Link,
} from 'react-router-dom';

function refreshPage(){
    window.location.reload();
}

function Header() {
  return (
    <div className="Header">
      <div class="row">
          <div class="col-3">
                <Logo height={150} />
          </div>
          <div class="col-9">
                <nav id="main-nav">
                <div class="col-10">
                <ul class="menu">
                    <li><Link to="/" onClick={refreshPage}>Home</Link></li>
                    <li><Link to="/Team" onClick={refreshPage}>Team</Link></li> 
                </ul>
                </div>
                </nav>
          </div>
       </div>
      <script src="../../public/bundle.js"></script>
   </div>
  );
}

export default Header;
