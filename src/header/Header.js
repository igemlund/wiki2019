import React from 'react';
import {ReactComponent as Logo} from './logo.svg';

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
                    <li><a href="#">Home</a></li>
                    <li><a href="#">Team</a></li>
                    <li><a href="#">Project</a></li>
                    <li><a href="#">Model</a></li>
                    <li><a href="#">Human Practice</a></li>
                </ul>
                </div>
                </nav>
          </div>
       </div>
   </div>
  );
}

export default Header;
