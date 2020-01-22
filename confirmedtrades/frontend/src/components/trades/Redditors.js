import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
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

  MIN_DATE = "2011-06-21";

  MAX_DATE = moment().format("YYYY-MM-DD");

  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      pageSize: 20,
      pageNo: 1,
      col: 0,
      order: "asc",
      isCollapsed: true,
      form: {
        username: "",
        minTrades: 1,
        maxTrades: 500,
        minDate: this.MIN_DATE,
        maxDate: this.MAX_DATE
      }
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
      sort: this.colOrderToSort(col, order),
      username: this.state.form.username,
      min_trades: this.state.form.minTrades,
      max_trades: this.state.form.maxTrades
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

  onTradesChange = name => e => {
    if (e.target.valueAsNumber) {
      const form = JSON.parse(JSON.stringify(this.state.form));
      form[name] = e.target.valueAsNumber;
      this.setState({
        ...this.state,
        form
      });
    }
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
                <form onSubmit={() => this.updateRedditors()}>
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
                            form: { ...this.state.form, username: e.target.value }
                          })
                        }
                      />
                    </MDBCol>
                  </MDBRow>

                  <MDBRow>
                    <MDBCol sm="6">
                      <div className="form-group">
                        <label htmlFor="inputMinTrades">Trades (inclusive)</label>

                        <MDBRow>
                          <MDBCol sm="5">
                            <input
                              id="inputMinTrades"
                              type="number"
                              className="form-control"
                              min={1}
                              max={this.state.form.maxTrades - 1}
                              value={this.state.form.minTrades}
                              onChange={this.onTradesChange("minTrades")}
                            />
                          </MDBCol>

                          <MDBCol sm="2" className="mt-2 text-center">
                            <span>to</span>
                          </MDBCol>

                          <MDBCol sm="5">
                            <input
                              id="inputMaxTrades"
                              type="number"
                              className="form-control"
                              min={this.state.form.minTrades + 1}
                              max={500}
                              value={this.state.form.maxTrades}
                              onChange={this.onTradesChange("maxTrades")}
                            />
                          </MDBCol>
                        </MDBRow>
                      </div>
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
