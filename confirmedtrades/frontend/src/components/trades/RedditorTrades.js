import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux';
import PropTypes from 'prop-types'
import { 
  MDBTable, MDBTableHead, MDBTableBody, 
  MDBCard, MDBCardBody, MDBCardTitle,
  MDBListGroup, MDBListGroupItem,
  MDBIcon
} from 'mdbreact';
import { Link } from 'react-router-dom';
import moment from 'moment';

import Pagination from '../layout/Pagination';
import SortableTableHeadings from '../layout/SortableTableHeadings';

export class RedditorTrades extends Component {
  static propTypes = {
    redditors: PropTypes.array.isRequired,
    allTrades: PropTypes.array.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      pageSize: 20,
      isLoading: true,
      username: '',
      trades: [],
      sortCol: 0,           // index of column to sort
      sortColOrder: 'asc',
      pageNo: 1
    };
  }

  componentDidMount() {
    this.updateTrades(this.props.match.params.username);
  }

  componentDidUpdate(prevProps) {
    const prevUsername = prevProps.match.params.username,
          currUsername = this.props.match.params.username;
    if (prevUsername !== currUsername) {
      this.updateTrades(currUsername);
    }
  }

  getSortedUserTrades(username = null) {
    if (!username) username = this.state.username;
    const userID = this.props.redditors.find(r => r.username === username).id;
    let trades = this.props.allTrades
      .filter(t => t.user1 === userID)
      .map(t => { 
        return { 
          ...t, 
          username2: this.props.redditors.find(r => r.id === t.user2).username 
        };
      });

    const { sortCol, sortColOrder } = this.state;

    switch (sortCol) {
      // Username
      case 0:
        trades = trades.sort((a, b) => {
          if (a.username2 < b.username2) {
            return sortColOrder === 'asc' ? -1 : 1;
          }
          if (a.username2 > b.username2) {
            return sortColOrder === 'asc' ? 1 : -1;
          }
          return 0;
        });
        break;
      
      // Comment ID
      case 1:
        trades = trades.sort((a, b) => {
          if (a.comment_id < b.comment_id) {
            return sortColOrder === 'asc' ? -1 : 1;
          }
          if (a.comment_id > b.comment_id) {
            return sortColOrder === 'asc' ? 1 : -1;
          }
          return 0;
        });
        break;
      
      // Date & Time
      case 2:
        trades = trades.sort((a, b) => {
          if (this.state.sortColOrder === 'asc') {
            return Date.parse(a.confirmation_datetime) - Date.parse(b.confirmation_datetime);
          }
          return Date.parse(b.confirmation_datetime) - Date.parse(a.confirmation_datetime);
        });
        break;
    }

    return trades;
  }

  updateTrades = (username) => {
    this.setState({
      ...this.state,
      isLoading: false,
      username,
      trades: this.getSortedUserTrades(username).slice(0, this.state.pageSize)
    });
  };

  onPageChange = (pageNo) => {
    const start = (pageNo - 1) * this.state.pageSize,
          end = pageNo * this.state.pageSize;
    this.setState({
      ...this.state,
      trades: this.getSortedUserTrades().slice(start, end),
      pageNo
    });
  };

  onSortHeading = (index, order) => {
    this.setState({
      ...this.state,
      sortCol: index,
      sortColOrder: order
    },
    () => {
      const start = (this.state.pageNo - 1) * this.state.pageSize,
            end = this.state.pageNo * this.state.pageSize,
            trades = this.getSortedUserTrades().slice(start, end);

      this.setState({
        ...this.state,
        trades
      });
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

    const cardStyle = {
      border: "1px solid rgba(0,0,0,.125)",
      boxShadow: 'none'
    };

    let rows = [];
    for (const trade of this.state.trades) {
      const date = moment(Date.parse(trade.confirmation_datetime));
      rows.push(
        <tr key={trade.id}>
          <td>
            <Link to={`/redditors/${trade.username2}`} style={linkStyle}>
              {trade.username2}
            </Link>
          </td>
          <td>
            <a style={linkStyle} href={trade.comment_url}>
              {trade.comment_id}
            </a>
          </td>
          <td>{date.format('YYYY-MM-DD HH:mm:ss')}</td>
        </tr>
      );
    }
    
    const headings = [
      {
        text: 'User',
        style: { width: '33%' }
      },
      {
        text: 'Confirmation',
        style: { width: '33%' }
      },
      {
        text: 'Date & Time',
        style: { width: '33%' }
      },
    ];

    const userTrades = this.getSortedUserTrades();
    const numPages = Math.ceil(userTrades.length / this.state.pageSize);

    return (
      <Fragment>
        <MDBCard style={cardStyle} className="mb-4">
          <MDBCardBody>
            <MDBCardTitle>Trades for {this.state.username}</MDBCardTitle>

            <MDBListGroup>
              <MDBListGroupItem>
                <a href={`https://reddit.com/user/${this.state.username}`} style={linkStyle}>
                  Reddit Profile
                </a>
              </MDBListGroupItem>

              <MDBListGroupItem>
                {userTrades.length} confirmed trade{userTrades.length > 1 ? 's' : ''}
              </MDBListGroupItem>
            </MDBListGroup>
          </MDBCardBody>
        </MDBCard>

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
          pageRange={3}
          onPageChange={this.onPageChange} />
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  allTrades: state.trades.trades,
  redditors: state.trades.redditors
});

export default connect(mapStateToProps)(RedditorTrades);