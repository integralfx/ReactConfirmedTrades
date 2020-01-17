import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { MDBTable, MDBTableHead, MDBTableBody } from "mdbreact";
import moment from 'moment';

import { getRedditors } from '../../actions/trades';
import Pagination from "../layout/Pagination";
import SortableTableHeadings from '../layout/SortableTableHeadings';

export class Redditors extends Component {
  /*
  static propTypes = {
    count: PropTypes.number.isRequired,
    redditors: PropTypes.array.isRequired,
    trades: PropTypes.array.isRequired
  };
  */

  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      pageSize: 20,
      pageNo: 1,
      sort: 'username'
    };
  }

  updateRedditors = (pageNo = this.state.pageNo, sort = this.state.sort) => {
    /*
    this.setState({
      ...this.state,
      isLoading: true
    });
    //*/

    const queryData = { 
      page: pageNo, 
      page_size: this.state.pageSize,
      sort
    };
    this.props.getRedditors(queryData, () => {
      this.setState({
        ...this.state,
        isLoading: false,
        pageNo,
        sort
      });
    });
  }

  componentDidMount() {
    this.updateRedditors();
  }

  getSortedRedditors(index = 0, order = 'asc') {
    let redditors = this.props.redditors.map(r => {
      const lastTrade = r.trades1.sort((a, b) => 
        Date.parse(b.confirmation_datetime) - Date.parse(a.confirmation_datetime)
      )[0];

      return {
        ...r,
        lastTrade
      };
    });

    switch (index) {
      // Username
      case 0:
        redditors = redditors.sort((a, b) => {
          const u1 = a.username, u2 = b.username;
          return order === 'asc' ? u1.localeCompare(u2) : u2.localeCompare(u1);
        });
        break;

      // Trades
      case 1:
        redditors = redditors.sort((a, b) => 
          order === 'asc' ? a.trades1.length - b.trades1.length
                          : b.trades1.length - a.trades1.length
        );
        break;

      // Last Trade
      case 2:
        redditors = redditors.sort((a, b) => {
          const d1 = Date.parse(a.lastTrade.confirmation_datetime),
                d2 = Date.parse(b.lastTrade.confirmation_datetime);
          return order === 'asc' ? d1 - d2 : d2 - d1;
        });
        break;
    }

    return redditors;
  }

  onPageChange = (pageNo) => {
    this.updateRedditors(pageNo);
  };

  onSortHeading = (index, order) => {
    switch (index) {
      // Username
      case 0:
        this.updateRedditors(this.state.pageNo, order === 'asc' ? 'username' : '-username');
        break;

      // Trades
      case 1:
        this.updateRedditors(this.state.pageNo, order === 'asc' ? 'trades' : '-trades');
        break;

      // Last Trade
      case 2:
        this.updateRedditors(this.state.pageNo, order === 'asc' ? 'last_trade' : '-last_trade');
        break;
    }
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
    for (const redditor of this.props.redditors) {
      const lastTrade = redditor.trades1.sort((a, b) => {
        const d1 = Date.parse(a.confirmation_datetime),
              d2 = Date.parse(b.confirmation_datetime);
        return d2 - d1;
      })[0];
      const date = moment(Date.parse(lastTrade.confirmation_datetime));

      rows.push(
        <tr key={redditor.id}>
          <td>
            <Link to={`/redditors/${redditor.username}`} style={linkStyle}>
              {redditor.username}
            </Link>
          </td>

          <td>{redditor.trades1.length}</td>

          <td>
            <a href={lastTrade.comment_url}>{date.format('YYYY-MM-DD HH:mm:ss')}</a>
          </td>
        </tr>
      );
    }

    const numPages = Math.ceil(this.props.count / this.state.pageSize);
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
  count: state.trades.redditors.count,
  redditors: state.trades.redditors.redditors,
  trades: state.trades.trades
});

export default connect(mapStateToProps, { getRedditors })(Redditors);
