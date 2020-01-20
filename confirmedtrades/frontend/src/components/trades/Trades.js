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
      col: 0,
      order: "asc"
    };
  }

  componentDidMount() {
    this.updateTrades();
  }

  colOrderToSort = (col = this.state.col, order = this.state.order) => {
    switch (col) {
      case 0:
        return order === "asc" ? "username1" : "-username1";
      case 1:
        return order === "asc" ? "username2" : "-username2";
      case 2:
      case 3:
        return order === "asc" ? "confirmation_datetime" : "-confirmation_datetime";
      default:
        return "username1";
    }
  };

  updateTrades = (pageNo = this.state.pageNo, col = this.state.col, order = this.state.order) => {
    this.setState({
      ...this.state,
      isLoading: true
    });

    const queryData = {
      page_size: this.state.pageSize,
      page: pageNo,
      sort: this.colOrderToSort(col, order)
    };
    this.props.getTrades(queryData, () => {
      this.setState({
        pageNo,
        isLoading: false,
        col,
        order
      });
    });
  };

  onSortHeading = (index, order) => {
    this.updateTrades(this.state.pageNo, index, order);
  };

  onPageChange = pageNo => {
    this.updateTrades(pageNo);
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
              col={this.state.col}
              order={this.state.order}
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
