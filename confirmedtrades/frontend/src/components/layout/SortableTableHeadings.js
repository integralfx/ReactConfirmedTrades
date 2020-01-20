import React, { Component } from "react";
import { MDBIcon } from "mdbreact";
import PropTypes from "prop-types";

export default class SortableTableHeadings extends Component {
  static propTypes = {
    col: PropTypes.number.isRequired,
    order: PropTypes.string.isRequired,
    headings: PropTypes.array.isRequired,
    onSortHeading: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      col: this.props.col,
      order: this.props.order
    };
  }

  sortHeading(index) {
    let order = "asc";
    if (index === this.state.col) {
      order = this.state.order === "asc" ? "desc" : "asc";
    }

    this.setState(
      {
        ...this.state,
        col: index,
        order
      },
      () => this.props.onSortHeading(index, order)
    );
  }

  render() {
    const { headings } = this.props;
    const { col, order } = this.state;

    let tableHeadings = [];
    for (let i = 0; i < headings.length; i++) {
      const h = headings[i];
      let sortIcon = "";
      if (i === col) {
        sortIcon = <MDBIcon icon={order === "asc" ? "caret-up" : "caret-down"} className="ml-2" />;
      }

      tableHeadings.push(
        <th key={i} style={h.style}>
          <a
            href="#"
            onClick={e => {
              e.preventDefault();
              this.sortHeading(i);
            }}
          >
            {h.text}
            {sortIcon}
          </a>
        </th>
      );
    }

    return <tr>{tableHeadings}</tr>;
  }
}
