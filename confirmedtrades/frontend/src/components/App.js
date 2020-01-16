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
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true
    };
  }

  componentDidMount() {
    store.dispatch(getRedditors(() => {
      store.dispatch(getTrades(() => {
        this.setState({
          ...this.state,
          isLoading: false
        });
      }))
    }));
  }

  render() {
    let content = (
      <Switch>
        <Route exact path="/">
          <Redditors />
        </Route>

        <Route exact path="/redditors/:username" component={RedditorTrades} />

        <Route exact path="/trades">
          <Trades />
        </Route>
      </Switch>
    );

    if (this.state.isLoading) {
      content = (
        <div className="text-center">
          <div className="spinner-border" style={{ width: "5rem", height: "5rem" }} role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      );
    }

    return (
      <Provider store={store}>
        <Router>
          <Fragment>
            <Header />
            <div className="container">
              {content}
            </div>
          </Fragment>
        </Router>
      </Provider>
    );
  }
}

const mapStateToProps = state => ({
  trades: state.trades.trades,
  redditors: state.trades.redditors
});

export default connect(mapStateToProps, { getTrades, getRedditors })(App);

ReactDOM.render(<App />, document.getElementById("app"));
