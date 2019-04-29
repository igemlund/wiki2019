import React from 'react';
import {
    BrowserRouter as Router,
} from 'react-router-dom';

import './css/main.min.css';
import Header from './header/Header.js';
import Body from './body/Body.js';
import Tocbot from '.Tocbot.js';

function App() {
  return (
    <div className="App">
      <Router>
      <Tocbot />
      <Header/>
      <Body />
      </Router>
    </div>
  );
}

export default App;
