import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import {
  MDBTable,
  MDBTableHead,
  MDBTableBody,
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBListGroup,
  MDBListGroupItem,
  MDBIcon
} from "mdbreact";
import { Link } from "react-router-dom";
import moment from "moment";

import { getRedditorTrades } from "../../actions/trades";
import Pagination from "../layout/Pagination";
import SortableTableHeadings from "../layout/SortableTableHeadings";

export class RedditorTrades extends Component {
  /*
  static propTypes = {
    trades: PropTypes.array.isRequired,
  };
  */

  constructor(props) {
    super(props);

    this.state = {
      pageSize: 20,
      isLoading: true,
      username: "",
      pageNo: 1,
      sort: "username2"
    };
  }

  componentDidMount() {
    const { username } = this.props.match.params;
    this.updateTrades(username);
  }

  componentDidUpdate(prevProps) {
    const prevUsername = prevProps.match.params.username,
      currUsername = this.props.match.params.username;
    if (prevUsername !== currUsername) {
      this.updateTrades(currUsername, 1);
    }
  }

  updateTrades = (username, pageNo = this.state.pageNo, sort = this.state.sort) => {
    const queryData = {
      page: pageNo,
      page_size: this.state.pageSize,
      sort
    };
    this.props.getRedditorTrades(username, queryData, () => {
      this.setState({
        ...this.state,
        isLoading: false,
        username,
        pageNo,
        sort
      });
    });
  };

  onPageChange = pageNo => {
    this.updateTrades(this.state.username, pageNo);
  };

  onSortHeading = (index, order) => {
    switch (index) {
      // Username
      case 0:
        this.updateTrades(
          this.state.username,
          this.state.pageNo,
          order === "asc" ? "username2" : "-username2"
        );
        break;

      // Comment ID, Date & Time
      // Comment IDs seem to follow date & time
      case 1:
      case 2:
        this.updateTrades(
          this.state.username,
          this.state.pageNo,
          order === "asc" ? "confirmation_datetime" : "-confirmation_datetime"
        );
        break;
    }
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

    const cardStyle = {
      border: "1px solid rgba(0,0,0,.125)",
      boxShadow: "none"
    };

    let rows = [];
    for (const trade of this.props.trades) {
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
          <td>{date.format("YYYY-MM-DD HH:mm:ss")}</td>
        </tr>
      );
    }

    const headings = [
      {
        text: "User",
        style: { width: "33%" }
      },
      {
        text: "Confirmation",
        style: { width: "33%" }
      },
      {
        text: "Date & Time",
        style: { width: "33%" }
      }
    ];

    const numPages = Math.ceil(this.props.count / this.state.pageSize);

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
                {this.props.count} confirmed trade{this.props.count > 1 ? "s" : ""}
              </MDBListGroupItem>
            </MDBListGroup>
          </MDBCardBody>
        </MDBCard>

        <MDBTable bordered hover>
          <MDBTableHead>
            <SortableTableHeadings headings={headings} onSortHeading={this.onSortHeading} />
          </MDBTableHead>
          <MDBTableBody>{rows}</MDBTableBody>
        </MDBTable>

        <Pagination
          pageNo={this.state.pageNo}
          numPages={numPages}
          pageRange={3}
          onPageChange={this.onPageChange}
        />
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  count: state.trades.redditorTrades.count,
  trades: state.trades.redditorTrades.trades
});

export default connect(mapStateToProps, { getRedditorTrades })(RedditorTrades);
