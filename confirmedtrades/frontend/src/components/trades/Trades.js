import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { MDBTable, MDBTableHead, MDBTableBody } from "mdbreact";
import { Link } from "react-router-dom";
import moment from "moment";

import { getTrades } from "../../actions/trades";
import Pagination from "../layout/Pagination";
import SortableTableHeadings from "../layout/SortableTableHeadings";

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
    this.setState({
      ...this.state,
      isLoading: true
    });

    const queryData = {
      page_size: this.state.pageSize,
      page: pageNo,
      sort
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

  onSortHeading = (index, order) => {
    switch (index) {
      // First User
      case 0:
        this.updateTrades(this.state.pageNo, order === "asc" ? "username1" : "-username1");
        break;
      // Second User
      case 1:
        this.updateTrades(this.state.pageNo, order === "asc" ? "username2" : "-username2");
        break;
      // Comment ID and Date
      case 2:
      case 3:
        this.updateTrades(
          this.state.pageNo,
          order === "asc" ? "confirmation_datetime" : "-confirmation_datetime"
        );
        break;
    }
  };

  convertSort(sort = this.state.sort) {
    const sorts = [
      "username1",
      "-username1",
      "username2",
      "-username2",
      "confirmation_datetime",
      "-confirmation_datetime"
    ];
    const index = sorts.findIndex(s => s === sort);
    if (index === -1) return { col: 0, order: "asc" };
    return {
      col: Math.floor(index / 2),
      order: index % 2 == 0 ? "asc" : "desc"
    };
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
    for (const trade of this.props.trades) {
      const date = moment(Date.parse(trade.confirmation_datetime));
      rows.push(
        <tr key={trade.id}>
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

    const colOrder = this.convertSort();
    const headings = [
      {
        text: "First User",
        style: { width: "20%" }
      },
      {
        text: "Second User",
        style: { width: "20%" }
      },
      {
        text: "Confirmation",
        style: { width: "25%" }
      },
      {
        text: "Date & Time",
        style: { width: "25%" }
      }
    ];

    const numPages = Math.ceil(this.props.count / this.state.pageSize);

    return (
      <Fragment>
        <h2>Trades</h2>
        <MDBTable bordered hover>
          <MDBTableHead>
            <SortableTableHeadings
              col={colOrder.col}
              order={colOrder.order}
              headings={headings}
              onSortHeading={this.onSortHeading}
            />
          </MDBTableHead>

          <MDBTableBody>{rows}</MDBTableBody>
        </MDBTable>

        <Pagination
          pageNo={this.state.pageNo}
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
