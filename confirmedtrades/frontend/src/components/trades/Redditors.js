import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
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
    return (
      <Fragment>
        <h2>Redditors</h2>
        <table className="table table-striped table-bordered">
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
            </tr>
          </thead>
          <tbody>
            {this.props.redditors.map(redditor => (
              <tr key={redditor.id}>
                <td>{redditor.id}</td>
                <td>{redditor.username}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  redditors: state.trades.redditors
});

export default connect(mapStateToProps, { getRedditors })(Redditors);
