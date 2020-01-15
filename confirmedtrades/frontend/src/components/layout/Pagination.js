import React, { Component } from 'react';
import { MDBPagination, MDBPageItem, MDBPageNav, MDBCol, MDBRow } from 'mdbreact';

export default class Pagination extends Component {
  constructor(props) {
    super(props);

    this.state = {
      pageNo: 1
    };
  }

  setPageNo = (pageNo) => {
    pageNo = parseInt(pageNo);
    this.setState({
      ...this.state,
      pageNo
    });
    this.props.onPageChange(pageNo);
  };

  render() {
    let pageItems = [];

    const nums = [this.state.pageNo - 1, this.state.pageNo, this.state.pageNo + 1];
    if (nums[0] < 1) {
      const diff = 1 - nums[0];
      nums.forEach((n, i, a) => a[i] += diff);
    }
    else if (nums[2] > this.props.numPages) {
      const diff = nums[2] - this.props.numPages;
      nums.forEach((n, i, a) => a[i] -= diff);
    }
    
    for (const n of nums) {
      pageItems.push(
        <MDBPageItem 
          key={n} 
          onClick={() => this.setPageNo(n)}
          active={this.state.pageNo === n} 
          disabled={this.props.numPages < n}>
          <MDBPageNav>{n}</MDBPageNav>
        </MDBPageItem>
      );
    }

    return (
      <MDBRow>
        <MDBCol sm="9" lg="10">
          <MDBPagination className="justify-content-center">
            <MDBPageItem 
              disabled={this.state.pageNo === 1} 
              onClick={() => this.setPageNo(1)}>
              <MDBPageNav>
                First
              </MDBPageNav>
            </MDBPageItem>

            <MDBPageItem 
              disabled={this.state.pageNo === 1} 
              onClick={() => this.setPageNo(this.state.pageNo - 1)}>
              <MDBPageNav>
                Previous
              </MDBPageNav>
            </MDBPageItem>

            {pageItems}

            <MDBPageItem 
              disabled={this.state.pageNo >= this.props.numPages} 
              onClick={() => this.setPageNo(this.state.pageNo + 1)}>
              <MDBPageNav>
                Next
              </MDBPageNav>
            </MDBPageItem>

            <MDBPageItem 
              disabled={this.state.pageNo >= this.props.numPages} 
              onClick={() => this.setPageNo(this.props.numPages)}>
              <MDBPageNav>
                Last
              </MDBPageNav>
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
              onChange={e => this.setPageNo(e.target.value)} />
          </form>
        </MDBCol>
      </MDBRow>
    );
  }
}
