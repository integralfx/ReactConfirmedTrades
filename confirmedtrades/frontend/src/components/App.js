import React, { Component, Fragment } from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import {
  HashRouter as Router,
  Route,
  Switch
} from 'react-router-dom';
import { connect } from 'react-redux';

import store from "../store";
import Header from "./layout/Header";
import Redditors from "./trades/Redditors";
import Trades from './trades/Trades';
import RedditorTrades from './trades/RedditorTrades';
import { getTrades, getRedditors } from '../actions/trades';

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <Fragment>
            <Header />
            <div className="container">
              <Switch>
                <Route exact path="/">
                  <Redditors />
                </Route>

                <Route exact path="/redditors/:username" component={RedditorTrades} />

                <Route exact path="/trades">
                  <Trades />
                </Route>
              </Switch>
            </div>
          </Fragment>
        </Router>
      </Provider>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("app"));
