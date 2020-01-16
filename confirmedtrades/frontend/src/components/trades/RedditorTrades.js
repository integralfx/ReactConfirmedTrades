import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux';
import PropTypes from 'prop-types'
import { 
  MDBTable, MDBTableHead, MDBTableBody, 
  MDBCard, MDBCardBody, MDBCardTitle, MDBCardText,
  MDBListGroup, MDBListGroupItem
} from 'mdbreact';

import { getRedditorTrades, getRedditors } from '../../actions/trades';
import { Link } from 'react-router-dom';
import moment from 'moment';

export class RedditorTrades extends Component {
  static propTypes = {
    trades: PropTypes.array.isRequired,
    getRedditorTrades: PropTypes.func.isRequired,
    getRedditors: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      username: ''
    };
  }

  componentDidMount() {
    const username = this.props.match.params.username;
    this.props.getRedditorTrades(
      username,
      () => {
        this.setState({ 
          ...this.state, 
          isLoading: false,
          username
        });
      }
    );
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
    for (const trade of this.props.trades) {
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
                {this.props.trades.length} confirmed trade{this.props.trades.length > 1 ? 's' : ''}
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
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  trades: state.trades.redditorTrades,
  redditors: state.trades.redditors
});

export default connect(mapStateToProps, { getRedditorTrades, getRedditors })(RedditorTrades);