import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { MDBTable, MDBTableHead, MDBTableBody } from "mdbreact";
import moment from 'moment';

import Pagination from "../layout/Pagination";
import SortableTableHeadings from '../layout/SortableTableHeadings';

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
      pageNo: 1,
      sortedRedditors: [],
      redditors: []
    };
  }

  componentDidMount() {
    const sortedRedditors = this.getSortedRedditors();
    this.setState({
      ...this.state,
      sortedRedditors,
      redditors: sortedRedditors.slice(0, this.state.pageSize),
      isLoading: false
    });
  }

  getSortedRedditors(index = 0, order = 'asc') {
    let redditors = this.props.redditors.map(r => {
      const trades = this.props.trades.filter(t => t.user1 === r.id),
            lastTrade = trades.sort((a, b) =>
              Date.parse(b.confirmation_datetime) - Date.parse(a.confirmation_datetime)
            )[0];

      return {
        ...r,
        trades,
        lastTrade
      };
    });

    switch (index) {
      // Username
      case 0:
        redditors = redditors.sort((a, b) => {
          return order === 'asc' ? a.username.localeCompare(b.username) : 
                                   b.username.localeCompare(a.username);
        });
        break;

      // Trades
      case 1:
        redditors = redditors.sort((a, b) => a.trades.length - b.trades.length);
        break;

      // Last Trade
      case 2:
        trades = trades.sort((a, b) => {
          if (order === 'asc') {
            return Date.parse(a.lastTrade.confirmation_datetime) - Date.parse(b.lastTrade.confirmation_datetime);
          }
          return Date.parse(b.lastTrade.confirmation_datetime) - Date.parse(a.lastTrade.confirmation_datetime);
        });
        break;
    }

    return redditors;
  }

  onPageChange = (pageNo) => {
    const start = (pageNo - 1) * this.state.pageSize, 
          end = pageNo * this.state.pageSize;

    this.setState({
      ...this.state,
      pageNo,
      redditors: this.state.sortedRedditors.slice(start, end)
    });
  };

  onSortHeading = (index, order) => {
    const start = (this.state.pageNo - 1) * this.state.pageSize, 
          end = this.state.pageNo * this.state.pageSize;

    let sortedRedditors = this.state.sortedRedditors;
    switch (index) {
      // Username
      case 0:
        sortedRedditors = sortedRedditors.sort((a, b) => {
          const u1 = a.username, u2 = b.username;
          return order === 'asc' ? u1.localeCompare(u2) : u2.localeCompare(u1);
        });
        break;

      // Trades
      case 1:
        sortedRedditors = sortedRedditors.sort((a, b) => 
          order === 'asc' ? a.trades.length - b.trades.length
                          : b.trades.length - a.trades.length
        );
        break;

      // Last Trade
      case 2:
        sortedRedditors = sortedRedditors.sort((a, b) => {
          const d1 = Date.parse(a.lastTrade.confirmation_datetime),
                d2 = Date.parse(b.lastTrade.confirmation_datetime);
          return order === 'asc' ? d1 - d2 : d2 - d1;
        });
        break;
    }

    this.setState({
      ...this.state,
      sortedRedditors,
      redditors: sortedRedditors.slice(start, end)
    });
  }

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
      const date = moment(Date.parse(redditor.lastTrade.confirmation_datetime));
      rows.push(
        <tr key={redditor.id}>
          <td>
            <Link to={`/redditors/${redditor.username}`} style={linkStyle}>
              {redditor.username}
            </Link>
          </td>

          <td>{redditor.trades.length}</td>

          <td>
            <a href={redditor.lastTrade.comment_url}>{date.format('YYYY-MM-DD HH:mm:ss')}</a>
          </td>
        </tr>
      );
    }

    const numPages = Math.ceil(this.props.redditors.length / this.state.pageSize);
    const headings = [
      {
        text: 'Username',
        style: { width: '20%' }
      },
      {
        text: 'Trades',
        style: { width: '10%' }
      },
      {
        text: 'Last Trade',
        style: { width: '40%' }
      },
    ];

    return (
      <Fragment>
        <MDBTable bordered hover>
          <MDBTableHead>
            <SortableTableHeadings 
              headings={headings}
              onSortHeading={this.onSortHeading} />
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
