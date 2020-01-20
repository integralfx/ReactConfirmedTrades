import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { MDBTable, MDBTableHead, MDBTableBody } from "mdbreact";
import moment from "moment";

import { getRedditors } from "../../actions/trades";
import Pagination from "../layout/Pagination";
import SortableTableHeadings from "../layout/SortableTableHeadings";
import styles from "../../styles";

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
      col: 0,
      order: "asc"
    };
  }

  componentDidMount() {
    this.updateRedditors();
  }

  colOrderToSort = (col = this.state.col, order = this.state.order) => {
    switch (col) {
      case 0:
        return order === "asc" ? "username" : "-username";
      case 1:
        return order === "asc" ? "trades" : "-trades";
      case 2:
        return order === "asc" ? "last_trade" : "-last_trade";
      default:
        return "username";
    }
  };

  updateRedditors = (
    pageNo = this.state.pageNo,
    col = this.state.col,
    order = this.state.order
  ) => {
    this.setState({
      ...this.state,
      isLoading: true
    });

    const queryData = {
      page: pageNo,
      page_size: this.state.pageSize,
      sort: this.colOrderToSort(col, order)
    };
    this.props.getRedditors(queryData, () => {
      this.setState({
        ...this.state,
        isLoading: false,
        pageNo,
        col,
        order
      });
    });
  };

  onSortHeading = (index, order) => {
    this.updateRedditors(this.state.pageNo, index, order);
  };

  onPageChange = pageNo => {
    this.updateRedditors(pageNo);
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
            <Link to={`/redditors/${redditor.username}`} style={styles.link}>
              {redditor.username}
            </Link>
          </td>

          <td>{redditor.trades1.length}</td>

          <td>
            <a href={lastTrade.comment_url}>{date.format("YYYY-MM-DD HH:mm:ss")}</a>
          </td>
        </tr>
      );
    }

    const numPages = Math.ceil(this.props.count / this.state.pageSize);

    const headings = [
      {
        text: "Username",
        style: { width: "20%" }
      },
      {
        text: "Trades",
        style: { width: "10%" }
      },
      {
        text: "Last Trade",
        style: { width: "40%" }
      }
    ];

    return (
      <Fragment>
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
  count: state.trades.redditors.count,
  redditors: state.trades.redditors.redditors
});

export default connect(mapStateToProps, { getRedditors })(Redditors);
