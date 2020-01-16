import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { MDBTable, MDBTableHead, MDBTableBody } from "mdbreact";
import moment from 'moment';

import Pagination from "../layout/Pagination";
import { Link } from "react-router-dom";

export class Redditors extends Component {
  static propTypes = {
    redditors: PropTypes.array.isRequired,
    trades: PropTypes.array.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      pageSize: 20,
      redditors: []
    }
  }

  componentDidMount() {
    this.setState({
      ...this.state,
      redditors: this.props.redditors.slice(0, this.state.pageSize),
      isLoading: false
    });
  }

  onPageChange = (pageNo) => {
    const start = (pageNo - 1) * this.state.pageSize, 
          end = pageNo * this.state.pageSize;
    this.setState({
      ...this.state,
      redditors: this.props.redditors.slice(start, end)
    });
  };

  render() {
    if (this.state.isLoading) {
      return (
        <div className="text-center">
          <div className="spinner-border" style={{ width: "5rem", height: "5rem" }} role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      );
    }

    const linkStyle = {
      color: "#007bff"
    };

    let rows = [];
    for (const redditor of this.state.redditors) {
      const trades = this.props.trades.filter(t => t.user1 === redditor.id),
            lastTrade = trades.sort((a, b) => 
              Date.parse(b.confirmation_datetime) - Date.parse(a.confirmation_datetime)
            )[0],
            date = moment(Date.parse(lastTrade.confirmation_datetime));

      rows.push(
        <tr key={redditor.id}>
          <td>
            <Link to={`/redditors/${redditor.username}`} style={linkStyle}>
              {redditor.username}
            </Link>
          </td>

          <td>{trades.length}</td>

          <td>
            <a href={lastTrade.comment_url}>{date.format('YYYY-MM-DD HH:mm:ss')}</a>
          </td>
        </tr>
      );
    }

    const numPages = Math.ceil(this.props.redditors.length / this.state.pageSize);

    return (
      <Fragment>
        <MDBTable bordered hover>
          <MDBTableHead>
            <tr>
              <th style={{ width: "50%" }}>Username</th>
              <th style={{ width: "10%" }}>Trades</th>
              <th style={{ width: "40%" }}>Last Trade</th>
            </tr>
          </MDBTableHead>
          <MDBTableBody>
            {rows}
          </MDBTableBody>
        </MDBTable>

        <Pagination 
          numPages={numPages}
          pageRange={5}
          onPageChange={this.onPageChange} />
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  redditors: state.trades.redditors,
  trades: state.trades.trades
});

export default connect(mapStateToProps)(Redditors);
