import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { MDBTable, MDBTableHead, MDBTableBody } from "mdbreact";

import { getRedditors } from "../../actions/trades";
import Pagination from "../layout/Pagination";

export class Redditors extends Component {
  static propTypes = {
    redditors: PropTypes.array.isRequired,
    getRedditors: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      pageSize: 20,
      redditors: []
    }
  }

  componentDidMount() {
    this.props.getRedditors(() => { 
      this.setState({
        ...this.state,
        redditors: this.props.redditors.slice(0, this.state.pageSize)
      });
    });
  }

  onPageChange = (pageNo) => {
    const start = (pageNo - 1) * this.state.pageSize, 
          end = pageNo * this.state.pageSize;
    this.setState({
      ...this.state,
      redditors: this.props.redditors.slice(start, end)
    });
  };

  render() {
    let rows = [];
    for (const redditor of this.state.redditors) {
      rows.push(
        <tr key={redditor.id}>
          <td>{redditor.id}</td>
          <td>{redditor.username}</td>
        </tr>
      );
    }

    const numPages = Math.ceil(this.props.redditors.length / this.state.pageSize);

    return (
      <Fragment>
        <MDBTable striped bordered hover>
          <MDBTableHead>
            <tr>
              <th style={{ width: "20%" }}>ID</th>
              <th style={{ width: "80%" }}>Username</th>
            </tr>
          </MDBTableHead>
          <MDBTableBody>
            {rows}
          </MDBTableBody>
        </MDBTable>

        <Pagination 
          numPages={numPages}
          onPageChange={this.onPageChange} />
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  redditors: state.trades.redditors,
});

export default connect(mapStateToProps, { getRedditors })(Redditors);
