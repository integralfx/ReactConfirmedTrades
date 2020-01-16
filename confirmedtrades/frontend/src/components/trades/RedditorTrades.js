import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux';
import PropTypes from 'prop-types'
import { 
  MDBTable, MDBTableHead, MDBTableBody, 
  MDBCard, MDBCardBody, MDBCardTitle,
  MDBListGroup, MDBListGroupItem
} from 'mdbreact';
import { Link } from 'react-router-dom';
import moment from 'moment';

import Pagination from '../layout/Pagination';

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
      trades: []
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

  getUserTrades(username = null) {
    if (!username) username = this.state.username;
    const userID = this.props.redditors.find(r => r.username === username).id;
    return this.props.allTrades.filter(t => t.user1 === userID);
  }

  updateTrades = (username) => {
    this.setState({
      ...this.state,
      isLoading: false,
      username,
      trades: this.getUserTrades(username).slice(0, this.state.pageSize)
    });
  } 

  onPageChange = (pageNo) => {
    const start = (pageNo - 1) * this.state.pageSize,
          end = pageNo * this.state.pageSize;
    this.setState({
      ...this.state,
      trades: this.getUserTrades().slice(start, end)
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
      const user = this.props.redditors.find(r => r.id === trade.user2).username
      const date = moment(Date.parse(trade.confirmation_datetime));
      rows.push(
        <tr key={trade.id}>
          <td>
            <Link to={`/redditors/${user}`} style={linkStyle}>
              {user}
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
    
    const userTrades = this.getUserTrades();
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
            <tr>
              <th style={{ width: "33%" }}>User</th>
              <th style={{ width: "33%" }}>Confirmation</th>
              <th style={{ width: "33%" }}>Date & Time</th>
            </tr>
          </MDBTableHead>
          <MDBTableBody>
            {rows}
          </MDBTableBody>
        </MDBTable>

        <Pagination
          numPages={numPages}
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