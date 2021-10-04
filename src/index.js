import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Switch } from 'react-router-dom';
import { createBrowserHistory } from 'history';

import Splash from './components/Splash';
import Projects from './components/Projects';

const history = createBrowserHistory();

ReactDOM.render(
  <React.StrictMode>

    <Router history={history}>
      <Switch>
          <Route exact path="/">
            <Splash />
          </Route>
          <Route path = "/things">
            <Projects />
          </Route>
        </Switch>
    </Router>

  </React.StrictMode>,
  document.getElementById('root')
);
