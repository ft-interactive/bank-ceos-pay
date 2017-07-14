import * as d3 from 'd3';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

const Circle = ({ x, y, r }) => (
  <circle
    cx={x}
    cy={y}
    r={r}
    style={{ fill: '#f34d5b' }}
  />
);

class Bubble extends Component {
  constructor(props) {
    super(props);

    this.scale = d3.scaleLinear();
  }

  componentWillMount() {
    this.updateD3(this.props);
  }

  componentWillUpdate(newProps) {
    this.updateD3(newProps);
  }

  updateD3(props) {
    this.scale
      .domain([0, d3.max(props.data, d => d.year.deferredbalances)])
      .range([5, props.svgHeight / 2]);
  }

  render() {
    return (
      !this.props.data[this.props.rowIndex].year.deferredbalances ? null :
      <g>
        <Circle
          x={this.props.svgWidth / 2}
          y={this.props.svgHeight / 2}
          r={this.scale(this.props.data[this.props.rowIndex].year.deferredbalances)}
        />
      </g>
    );
  }
}

Bubble.propTypes = {
  rowIndex: PropTypes.number,
  data: PropTypes.array.isRequired, // eslint-disable-line
  svgWidth: PropTypes.number,
  svgHeight: PropTypes.number,
};

Bubble.defaultProps = {
  rowIndex: 0,
  svgWidth: 0,
  svgHeight: 0,
};

Circle.propTypes = {
  x: PropTypes.number,
  y: PropTypes.number,
  r: PropTypes.number,
};

Circle.defaultProps = {
  x: 0,
  y: 0,
  r: 0,
};

export default Bubble;
