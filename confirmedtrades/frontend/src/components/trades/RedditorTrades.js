import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux';
import PropTypes from 'prop-types'
import { 
  MDBTable, MDBTableHead, MDBTableBody, 
  MDBCard, MDBCardBody, MDBCardTitle, MDBCardText,
  MDBListGroup, MDBListGroupItem
} from 'mdbreact';

import { getRedditorTrades } from '../../actions/trades';
import { Link } from 'react-router-dom';
import moment from 'moment';

export class RedditorTrades extends Component {
  static propTypes = {
    trades: PropTypes.array.isRequired,
    getRedditorTrades: PropTypes.func.isRequired
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
      () => this.setState({ 
        ...this.state, 
        isLoading: false,
        username
      })
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
      const date = moment(Date.parse(trade.confirmation_datetime));
      rows.push(
        <tr key={trade.id}>
          <td>{trade.id}</td>
          <td>
            <Link to={`/redditors/${trade.username2}/trades`} style={linkStyle}>
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
              <th style={{ width: "10%" }}>ID</th>
              <th style={{ width: "20%" }}>User</th>
              <th style={{ width: "30%" }}>Confirmation</th>
              <th style={{ width: "40%" }}>Date & Time</th>
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
  trades: state.trades.redditorTrades
});

export default connect(mapStateToProps, { getRedditorTrades })(RedditorTrades);