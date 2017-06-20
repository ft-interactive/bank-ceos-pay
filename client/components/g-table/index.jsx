import React, { Component } from 'react';
import oGrid from 'o-grid'; // eslint-disable-line
import PropTypes from 'prop-types';
import { Table, Column, Cell } from 'fixed-data-table-2';
import { throttle } from 'lodash';

class GTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: props.data,
      containerWidth: 0,
      rowHeight: 50,
      headerHeight: 50,
    };
    this.handleResize = this.handleResize.bind(this);
  }

  componentDidMount() {
    this.handleResize();

    window.addEventListener('resize', throttle(this.handleResize, 250));
  }

  handleResize() {
    const containerWidth = this.node.parentNode.offsetWidth;

    this.setState({
      containerWidth,
    });
  }

  render() {
    const executiveNameCol = (
      <Column
        header={<Cell className="cell header-cell">Executive name</Cell>}
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
        header={<Cell className="cell header-cell">Institution</Cell>}
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
        header={<Cell className="cell header-cell">Total ($)</Cell>}
        cell={props => (
          <Cell
            {...props}
            className="cell number-cell"
          >
            {`${+(this.state.data[props.rowIndex].y2016.total / 1000000).toFixed(1)}m`}
          </Cell>
        )}
        flexGrow={1}
        width={20}
      />
    );

    return (
      <div ref={node => (this.node = node)}>
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
