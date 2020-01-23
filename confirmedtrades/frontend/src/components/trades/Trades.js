import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import {
  MDBTable,
  MDBTableHead,
  MDBTableBody,
  MDBBtn,
  MDBCollapse,
  MDBCard,
  MDBCardBody,
  MDBIcon,
  MDBInput,
  MDBRow,
  MDBCol
} from "mdbreact";
import { Link } from "react-router-dom";
import moment from "moment";

import { getTrades } from "../../actions/trades";
import Pagination from "../layout/Pagination";
import SortableTableHeadings from "../layout/SortableTableHeadings";
import styles from "../../styles";

export class Trades extends Component {
  /*
  static propTypes = {
    trades: PropTypes.array.isRequired
  };
  */

  MIN_DATE = "2011-06-21";

  MAX_DATE = moment().format("YYYY-MM-DD");

  constructor(props) {
    super(props);

    this.state = {
      pageSize: 20,
      pageNo: 1,
      isLoading: true,
      col: 0,
      order: "asc",
      isCollapsed: true,
      form: {
        firstUser: "",
        secondUser: "",
        minDate: this.MIN_DATE,
        maxDate: this.MAX_DATE
      }
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

    const { firstUser, secondUser, minDate, maxDate } = this.state.form;
    const queryData = {
      page_size: this.state.pageSize,
      page: pageNo,
      sort: this.colOrderToSort(col, order),
      first_user: firstUser,
      second_user: secondUser,
      min_date: minDate,
      max_date: maxDate
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

  onDateChange = name => e => {
    const date = e.target.value;
    const form = JSON.parse(JSON.stringify(this.state.form));
    form[name] = date;
    this.setState({
      ...this.state,
      form
    });
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
    for (const trade of this.props.trades) {
      const date = moment(Date.parse(trade.confirmation_datetime));
      rows.push(
        <tr key={trade.id}>
          <td>
            <Link to={`/redditors/${trade.username1}`} style={styles.link}>
              {trade.username1}
            </Link>
          </td>

          <td>
            <Link to={`/redditors/${trade.username2}`} style={styles.link}>
              {trade.username2}
            </Link>
          </td>

          <td>
            <a href={trade.comment_url} style={styles.link}>
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

        <div className="mb-4">
          <MDBBtn
            color="primary"
            onClick={() => this.setState({ ...this.state, isCollapsed: !this.state.isCollapsed })}
          >
            Filters
            <MDBIcon icon="filter" className="ml-2" />
          </MDBBtn>

          <MDBCollapse className="border rounded" isOpen={!this.state.isCollapsed}>
            <MDBCard style={styles.card}>
              <MDBCardBody>
                <form onSubmit={() => this.updateTrades(1)}>
                  <MDBRow>
                    <MDBCol sm="6">
                      <MDBInput
                        label="First User"
                        type="text"
                        group
                        value={this.state.form.firstUser}
                        onChange={e =>
                          this.setState({
                            ...this.state,
                            form: { ...this.state.form, firstUser: e.target.value }
                          })
                        }
                      />
                    </MDBCol>
                  </MDBRow>

                  <MDBRow>
                    <MDBCol sm="6">
                      <MDBInput
                        label="Second User"
                        type="text"
                        group
                        value={this.state.form.secondUser}
                        onChange={e =>
                          this.setState({
                            ...this.state,
                            form: { ...this.state.form, secondUser: e.target.value }
                          })
                        }
                      />
                    </MDBCol>
                  </MDBRow>

                  <MDBRow>
                    <MDBCol sm="6">
                      <div className="form-group">
                        <label htmlFor="inputMinDate">Date (inclusive)</label>
                        <MDBRow>
                          <MDBCol sm="5">
                            <input
                              id="inputMinDate"
                              type="date"
                              className="form-control"
                              min={this.MIN_DATE}
                              max={moment(this.state.form.maxDate, "YYYY-MM-DD").subtract(1, "day")}
                              value={this.state.form.minDate}
                              onChange={this.onDateChange("minDate")}
                            />
                          </MDBCol>

                          <MDBCol sm="2" className="mt-2 text-center">
                            <span>to</span>
                          </MDBCol>

                          <MDBCol sm="5">
                            <input
                              id="inputMaxDate"
                              type="date"
                              className="form-control"
                              min={moment(this.state.form.minDate, "YYYY-MM-DD").add(1, "day")}
                              max={this.MAX_DATE}
                              value={this.state.form.maxDate}
                              onChange={this.onDateChange("maxDate")}
                            />
                          </MDBCol>
                        </MDBRow>
                      </div>
                    </MDBCol>
                  </MDBRow>

                  <MDBBtn type="submit" color="primary">
                    Submit
                  </MDBBtn>
                </form>
              </MDBCardBody>
            </MDBCard>
          </MDBCollapse>
        </div>

        <div>
          {this.props.count} Trade{this.props.count > 1 ? "s" : ""}
        </div>

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
