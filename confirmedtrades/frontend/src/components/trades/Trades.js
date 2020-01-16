import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types'
import { MDBTable, MDBTableHead, MDBTableBody } from 'mdbreact';
import moment from 'moment';

import Pagination from '../layout/Pagination';
import { Link } from 'react-router-dom';

export class Trades extends Component {
  static propTypes = {
    redditors: PropTypes.array.isRequired,
    trades: PropTypes.array.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      pageSize: 20,
      isLoading: true,
      trades: []
    };
  }

  componentDidMount() {
    this.setState({
      ...this.state,
      isLoading: false,
      trades: this.props.trades.slice(0, this.state.pageSize)
    });
  }

  onPageChange = (pageNo) => {
    const start = (pageNo - 1) * this.state.pageSize, 
          end = pageNo * this.state.pageSize;
    this.setState({
      ...this.state,
      trades: this.props.trades.slice(start, end)
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
    for (const trade of this.state.trades) {
      const date = moment(Date.parse(trade.confirmation_datetime));
      const user1 = this.props.redditors.find(r => r.id === trade.user1).username,
            user2 = this.props.redditors.find(r => r.id === trade.user2).username;
      rows.push(
        <tr key={trade.id}>
          <td>{trade.id}</td>

          <td>
            <Link to={`/redditors/${user1}`} style={linkStyle}>{user1}</Link>
          </td>

          <td>
            <Link to={`/redditors/${user2}`} style={linkStyle}>{user2}</Link>
          </td>

          <td>
            <a href={trade.comment_url} style={linkStyle}>{trade.comment_id}</a>
          </td>

          <td>{date.format('YYYY-MM-DD HH:mm:ss')}</td>
        </tr>
      );
    }

    const numPages = Math.ceil(this.props.trades.length / this.state.pageSize);

    return (
      <Fragment>
        <h2>Trades</h2>
        <MDBTable bordered hover>
          <MDBTableHead>
            <tr>
              <th style={{ width: "10%" }}>ID</th>
              <th style={{ width: "20%" }}>First User</th>
              <th style={{ width: "20%" }}>Second User</th>
              <th style={{ width: "25%" }}>Confirmation</th>
              <th style={{ width: "25%" }}>Date & Time</th>
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
  trades: state.trades.trades,
  redditors: state.trades.redditors
});

export default connect(mapStateToProps)(Trades);