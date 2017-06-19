import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Table, Column, Cell } from 'fixed-data-table-2';
import { throttle } from 'lodash';
import { format as d3Format } from 'd3-format';

class GTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: props.data,
      containerWidth: 625,
      rowHeight: 50,
      headerHeight: 50,
    };
    this.handleResize = this.handleResize.bind(this);
    this.d3Format = d3Format(',');
  }

  componentDidMount() {
    this.handleResize();

    window.addEventListener('resize', throttle(this.handleResize, 250));
  }

  handleResize() {
    this.setState({
      containerWidth: this.node.parentNode.offsetWidth,
    });
  }

  render() {
    const executiveNameCol = (
      <Column
        header={<Cell>Executive name</Cell>}
        cell={props => (
          <Cell
            {...props}
            className="cell"
          >
            {this.state.data[props.rowIndex].ceo.name}
          </Cell>
        )}
        flexGrow={1}
        width={20}
      />
    );

    const companyNameCol = (
      <Column
        header={<Cell>Institution</Cell>}
        cell={props => (
          <Cell
            {...props}
            className="cell"
          >
            {this.state.data[props.rowIndex].company.name}
          </Cell>
        )}
        flexGrow={1}
        width={20}
      />
    );

    const totalCol = (
      <Column
        header={<Cell>Total ($)</Cell>}
        cell={props => (
          <Cell
            {...props}
            className="cell number-cell"
          >
            {this.d3Format(this.state.data[props.rowIndex].y2016.total)}
          </Cell>
        )}
        flexGrow={1}
        width={20}
      />
    );

    return (
      <div
        className="table-container"
        ref={node => (this.node = node)}
      >
        <Table
          rowHeight={this.state.rowHeight}
          headerHeight={this.state.headerHeight}
          rowsCount={this.state.data.length}
          width={this.state.containerWidth}
          height={(this.state.data.length * this.state.rowHeight) + this.state.headerHeight + 2}
        >
          {executiveNameCol}
          {companyNameCol}
          {totalCol}
        </Table>
      </div>
    );
  }
}

GTable.propTypes = {
  data: PropTypes.array.isRequired, // eslint-disable-line
};

export default GTable;
