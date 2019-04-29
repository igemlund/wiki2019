import React from 'react';
import {
    Route
} from 'react-router-dom';


import Team from '../team/Team.js';
import Homepage from '../homepage/Homepage.js';

function Body() {
    return (
        <div className="Body">
            <div class="row">
                <div id="toc" class="col-3">
                    <div class="toc-container">
                    <div class="js-toc"></div>
                    </div>
                </div>
                <div id="main-text" class="col-9">
                    <Route exact path='/' component={Homepage} />
                    <Route exact path='/Team' component={Team} />
                </div>
            </div>
        </div>
    );
}

export default Body;
