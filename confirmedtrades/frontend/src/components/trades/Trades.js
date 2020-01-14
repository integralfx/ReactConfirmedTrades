import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types'
import { MDBDataTable } from 'mdbreact';

import { getTrades } from '../../actions/trades';

export class Trades extends Component {
  static propTypes = {
    trades: PropTypes.array.isRequired,
    getTrades: PropTypes.func.isRequired
  };

  componentDidMount() {
    this.props.getTrades();
  }

  render() {
    const columns = [
      {
        label: 'ID',
        field: 'id',
        sort: 'asc'
      },
      {
        label: 'First User',
        field: 'username1'
      },
      {
        label: 'Second User',
        field: 'username2'
      },
      {
        label: 'Comment URL',
        field: 'comment_url'
      },
      {
        label: 'Confirmation Date & Time',
        field: 'confirmation_datetime'
      }
    ];

    return (
      <Fragment>
        <h2>Trades</h2>
        <MDBDataTable
          striped
          bordered
          hover
          data={{ columns, rows: this.props.trades }}
        />
      </Fragment>
    )
  }
}

const mapStateToProps = state => ({
  trades: state.trades.trades
});

export default connect(mapStateToProps, { getTrades })(Trades);