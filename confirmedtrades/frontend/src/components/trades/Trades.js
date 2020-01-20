import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { MDBTable, MDBTableHead, MDBTableBody } from "mdbreact";
import moment from "moment";

import Pagination from "../layout/Pagination";
import { Link } from "react-router-dom";
import { getTrades } from "../../actions/trades";

export class Trades extends Component {
  /*
  static propTypes = {
    trades: PropTypes.array.isRequired
  };
  */

  constructor(props) {
    super(props);

    this.state = {
      pageSize: 20,
      pageNo: 1,
      isLoading: true,
      sort: "username1"
    };
  }

  componentDidMount() {
    this.updateTrades();
  }

  updateTrades = (pageNo = this.state.pageNo, sort = this.state.sort) => {
    const queryData = {
      page_size: this.state.pageSize,
      page: pageNo
    };
    this.props.getTrades(queryData, () => {
      this.setState({
        pageNo,
        isLoading: false,
        sort
      });
    });
  };

  onPageChange = pageNo => {
    this.updateTrades(pageNo);
  };

  render() {
    if (this.state.isLoading) {
      return (
        <div className="text-center">
          <div
            className="spinner-border"
            style={{ width: "5rem", height: "5rem" }}
            role="status"
          >
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      );
    }

    const linkStyle = {
      color: "#007bff"
    };

    let rows = [];
    for (const trade of this.props.trades) {
      const date = moment(Date.parse(trade.confirmation_datetime));
      rows.push(
        <tr key={trade.id}>
          <td>{trade.id}</td>

          <td>
            <Link to={`/redditors/${trade.username1}`} style={linkStyle}>
              {trade.username1}
            </Link>
          </td>

          <td>
            <Link to={`/redditors/${trade.usernam2}`} style={linkStyle}>
              {trade.username2}
            </Link>
          </td>

          <td>
            <a href={trade.comment_url} style={linkStyle}>
              {trade.comment_id}
            </a>
          </td>

          <td>{date.format("YYYY-MM-DD HH:mm:ss")}</td>
        </tr>
      );
    }

    const numPages = Math.ceil(this.props.count / this.state.pageSize);

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

          <MDBTableBody>{rows}</MDBTableBody>
        </MDBTable>

        <Pagination
          numPages={numPages}
          pageRange={5}
          onPageChange={this.onPageChange}
        />
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  count: state.trades.trades.count,
  trades: state.trades.trades.trades
});

export default connect(mapStateToProps, { getTrades })(Trades);
