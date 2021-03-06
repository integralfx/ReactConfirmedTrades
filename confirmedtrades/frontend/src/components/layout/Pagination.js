import React, { Component } from "react";
import { MDBPagination, MDBPageItem, MDBPageNav, MDBCol, MDBRow } from "mdbreact";
import PropTypes from "prop-types";

export default class Pagination extends Component {
  static propTypes = {
    pageNo: PropTypes.number.isRequired,
    numPages: PropTypes.number.isRequired,
    pageRange: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      pageNo: this.props.pageNo
    };
  }

  setPageNo = pageNo => {
    pageNo = parseInt(pageNo);
    if (pageNo <= 0) return;
    this.setState(
      {
        ...this.state,
        pageNo
      },
      () => this.props.onPageChange(pageNo)
    );
  };

  render() {
    const { pageNo } = this.state;
    const { numPages, pageRange } = this.props;

    const nums = [...Array(pageRange).keys()].map(n => n + pageNo - Math.floor(pageRange / 2));
    if (nums[0] < 1) {
      const diff = 1 - nums[0];
      nums.forEach((n, i, a) => (a[i] += diff));
    } else if (nums[pageRange - 1] > numPages && pageNo > pageRange) {
      const diff = nums[pageRange - 1] - numPages;
      nums.forEach((n, i, a) => (a[i] -= diff));
    }

    let pageItems = [];
    for (const n of nums) {
      pageItems.push(
        <MDBPageItem
          key={n}
          onClick={() => this.setPageNo(n)}
          active={this.state.pageNo === n}
          disabled={this.props.numPages < n}
        >
          <MDBPageNav>{n}</MDBPageNav>
        </MDBPageItem>
      );
    }

    return (
      <MDBRow>
        <MDBCol sm="9" lg="10">
          <MDBPagination className="justify-content-center">
            <MDBPageItem disabled={this.state.pageNo === 1} onClick={() => this.setPageNo(1)}>
              <MDBPageNav>First</MDBPageNav>
            </MDBPageItem>

            <MDBPageItem
              disabled={this.state.pageNo === 1}
              onClick={() => this.setPageNo(this.state.pageNo - 1)}
            >
              <MDBPageNav>Previous</MDBPageNav>
            </MDBPageItem>

            {pageItems}

            <MDBPageItem
              disabled={this.state.pageNo >= this.props.numPages}
              onClick={() => this.setPageNo(this.state.pageNo + 1)}
            >
              <MDBPageNav>Next</MDBPageNav>
            </MDBPageItem>

            <MDBPageItem
              disabled={this.state.pageNo >= this.props.numPages}
              onClick={() => this.setPageNo(this.props.numPages)}
            >
              <MDBPageNav>Last</MDBPageNav>
            </MDBPageItem>
          </MDBPagination>
        </MDBCol>

        <MDBCol sm="3" lg="2">
          <form className="form-inline justify-content-end">
            <label htmlFor="inputPageNo">Go to:</label>
            <input
              id="inputPageNo"
              className="ml-2 form-control form-control-sm w-50"
              type="number"
              min={1}
              max={this.props.numPages}
              value={this.state.pageNo}
              onChange={e => this.setPageNo(e.target.value)}
            />
          </form>
        </MDBCol>
      </MDBRow>
    );
  }
}
