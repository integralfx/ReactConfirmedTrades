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
  MDBIcon,
  MDBBtn,
  MDBCollapse,
  MDBInput,
  MDBRow,
  MDBCol
} from "mdbreact";
import { Link } from "react-router-dom";
import moment from "moment";

import { getRedditorTrades } from "../../actions/trades";
import Pagination from "../layout/Pagination";
import SortableTableHeadings from "../layout/SortableTableHeadings";
import styles from "../../styles";

export class RedditorTrades extends Component {
  /*
  static propTypes = {
    trades: PropTypes.array.isRequired,
  };
  */

  MIN_DATE = "2011-06-21";

  MAX_DATE = moment().format("YYYY-MM-DD");

  constructor(props) {
    super(props);

    this.state = {
      pageSize: 20,
      isLoading: true,
      username: "",
      pageNo: 1,
      col: 0,
      order: "asc",
      form: {
        username: "",
        minDate: this.MIN_DATE,
        maxDate: this.MAX_DATE
      }
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

  colOrderToSort = (col = this.state.col, order = this.state.order) => {
    switch (col) {
      case 0:
        return order === "asc" ? "username2" : "-username2";
      case 1:
      case 2:
        return order === "asc"
          ? "confirmation_datetime"
          : "-confirmation_datetime";
      default:
        return "username2";
    }
  };

  updateTrades = (
    username,
    pageNo = this.state.pageNo,
    col = this.state.col,
    order = this.state.order
  ) => {
    this.setState({
      ...this.state,
      isLoading: true
    });

    const form = this.state.form;

    const queryData = {
      page: pageNo,
      page_size: this.state.pageSize,
      sort: this.colOrderToSort(col, order),
      username: form.username,
      min_date: form.minDate,
      max_date: form.maxDate
    };
    this.props.getRedditorTrades(username, queryData, () => {
      this.setState({
        ...this.state,
        isLoading: false,
        username,
        pageNo,
        col,
        order
      });
    });
  };

  onSortHeading = (index, order) => {
    this.updateTrades(this.state.username, this.state.pageNo, index, order);
  };

  onPageChange = pageNo => {
    this.updateTrades(this.state.username, pageNo);
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

    let rows = [];
    for (const trade of this.props.trades) {
      const date = moment(Date.parse(trade.confirmation_datetime));
      rows.push(
        <tr key={trade.id}>
          <td>
            <Link to={`/redditors/${trade.username2}`} style={styles.link}>
              {trade.username2}
            </Link>
          </td>
          <td>
            <a style={styles.link} href={trade.comment_url}>
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
        <MDBCard style={styles.card} className="mb-4">
          <MDBCardBody>
            <MDBCardTitle>Trades for {this.state.username}</MDBCardTitle>

            <MDBListGroup>
              <MDBListGroupItem>
                <a
                  href={`https://reddit.com/user/${this.state.username}`}
                  style={styles.link}
                >
                  Reddit Profile
                </a>
              </MDBListGroupItem>

              <MDBListGroupItem>
                {this.props.count} confirmed trade
                {this.props.count > 1 ? "s" : ""}
              </MDBListGroupItem>
            </MDBListGroup>
          </MDBCardBody>
        </MDBCard>

        <div className="mb-4">
          <MDBBtn
            color="primary"
            onClick={() =>
              this.setState({
                ...this.state,
                isCollapsed: !this.state.isCollapsed
              })
            }
          >
            Filters
            <MDBIcon icon="filter" className="ml-2" />
          </MDBBtn>

          <MDBCollapse
            className="border rounded"
            isOpen={!this.state.isCollapsed}
          >
            <MDBCard style={styles.card}>
              <MDBCardBody>
                <form
                  onSubmit={() => this.updateTrades(this.state.username, 1)}
                >
                  <MDBRow>
                    <MDBCol sm="6">
                      <MDBInput
                        label="Username"
                        type="text"
                        group
                        value={this.state.form.username}
                        onChange={e =>
                          this.setState({
                            ...this.state,
                            form: {
                              ...this.state.form,
                              username: e.target.value
                            }
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
                              max={moment(
                                this.state.form.maxDate,
                                "YYYY-MM-DD"
                              ).subtract(1, "day")}
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
                              min={moment(
                                this.state.form.minDate,
                                "YYYY-MM-DD"
                              ).add(1, "day")}
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
