import React, { Component } from "react";
import { Link } from 'react-router-dom';

export default class Header extends Component {
  render() {
    return (
      <nav className="navbar navbar-expand-sm navbar-dark bg-dark mb-2">
        <div className="container">
          <a className="navbar-brand" href="/">
            Confirmed Trades
          </a>

          <div className="collapse navbar-collapse">
            <ul className="navbar-nav mr-auto">
              <li className="nav-item">
                <Link to="/trades" className="nav-link">
                  Trades
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    );
  }
}
