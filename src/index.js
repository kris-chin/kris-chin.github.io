import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Switch } from 'react-router-dom';
import { createBrowserHistory } from 'history';

//Engine imports
import Canvas from './engine/Canvas';
import './engine/scss/textLayer.scss';

//Desktop Imports
import { desktop } from './desktop/config';
import './desktop/scss/splashPage.scss';
import './desktop/scss/showcase.scss'

//General config
import config from './config';

const history = createBrowserHistory();

ReactDOM.render(
  <React.StrictMode>

    <Router history={history}>
      <Switch>
          <Route path ="/test"> 
            <Canvas
              page = {history.location.pathname}
              config = {config}
              data = {desktop}
            />
          </Route>
        </Switch>
    </Router>

  </React.StrictMode>,
  document.getElementById('root')
);
