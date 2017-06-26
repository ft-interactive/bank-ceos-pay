import * as d3 from 'd3';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

const Bars = ({ x, width, height, color }) => (
  <rect
    width={width}
    height={height}
    x={x}
    y="0"
    style={{ fill: color }}
  />
);

class ProportionalStackedBar extends Component {
  constructor(props) {
    super(props);

    this.barWidth = d3.scaleLinear();
    this.barHeight = d3.scaleLinear();
    this.colors = ['#1e558c', '#9ee5f3', '#1e8fcc', '#b3325d', '#ff75a3'];
  }

  componentWillMount() {
    this.updateD3(this.props);
  }

  componentWillUpdate(newProps) {
    this.updateD3(newProps);
  }

  updateD3(props) {
    this.barWidth
      .domain([0, d3.max(props.data, d => d.year.total)])
      .range([0, props.gWidth]);

    this.barValues = [
      props.data[props.rowIndex].year.salary,
      props.data[props.rowIndex].year.bonus,
      props.data[props.rowIndex].year.stock,
      props.data[props.rowIndex].year.other,
    ];

    this.barValues = this.barValues.reduce((acc, cur) => {
      acc.arr.push({
        width: cur,
        x: acc.startX,
      });

      acc.startX += cur;

      return acc;
    }, {
      arr: [],
      startX: 0,
    });

    this.barHeight
      .domain([d3.min(props.data, d => d.year.total), d3.max(props.data, d => d.year.total)])
      .range([10, props.gHeight]);
  }

  render() {
    return (
      <g>
        {this.barValues.arr.map((d, i) => (
          <Bars
            key={`bar${i}`}
            width={this.barWidth(d.width)}
            height={this.props.gHeight}
            x={this.barWidth(d.x)}
            color={this.colors[i]}
          />
        ))}
      </g>
    );
  }
}

ProportionalStackedBar.propTypes = {
  rowIndex: PropTypes.number,
  data: PropTypes.array.isRequired, // eslint-disable-line
  gWidth: PropTypes.number, // eslint-disable-line
  gHeight: PropTypes.number, // eslint-disable-line
};

ProportionalStackedBar.defaultProps = {
  rowIndex: 0,
  gWidth: 0,
  gHeight: 0,
};

Bars.propTypes = {
  x: PropTypes.number,
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};

Bars.defaultProps = {
  x: 0,
  width: 0,
  height: 0,
  color: null,
};

export default ProportionalStackedBar;
