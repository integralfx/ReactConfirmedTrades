import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { MDBDataTable } from "mdbreact";

import { getRedditors } from "../../actions/trades";

export class Redditors extends Component {
  static propTypes = {
    redditors: PropTypes.array.isRequired,
    getRedditors: PropTypes.func.isRequired
  };

  componentDidMount() {
    this.props.getRedditors();
  }

  render() {
    const columns = [
      {
        label: "ID",
        field: "id",
        sort: "asc",
        width: 250
      },
      {
        label: "Username",
        field: "username",
        sort: "asc",
        width: 250
      }
    ];

    return (
      <Fragment>
        <h2>Redditors</h2>
        <MDBDataTable
          striped
          bordered
          hover
          data={{ columns, rows: this.props.redditors }}
        />
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  redditors: state.trades.redditors
});

export default connect(mapStateToProps, { getRedditors })(Redditors);
