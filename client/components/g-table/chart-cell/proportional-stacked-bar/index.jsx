import * as d3 from 'd3';
import inView from 'in-view';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

const Bars = ({ width, height, x, color, className }) => (
  <rect
    width={width}
    height={height}
    x={x}
    y="0"
    style={{ fill: color }}
    className={className}
  />
);

class ProportionalStackedBar extends Component {
  constructor(props) {
    super(props);

    this.rendered = false;
    this.barValues = [];
    this.barWidth = d3.scaleLinear()
      .domain([0, d3.max(props.data, (d) => {
        if (props.compensation && !props.shares) {
          return d.year.total;
        } else if (!props.compensation && props.shares) {
          return d.year.shares;
        }

        return d.year.total + d.year.shares;
      })]);
    this.colors = ['#1e558c', '#9ee5f3', '#1e8fcc', '#b3325d', '#d9ccc3'];
    this.classString = '';
    this.svg = {};
    this.renderD3 = this.renderD3.bind(this);
    this.transitionD3 = this.transitionD3.bind(this);
    this.updateD3 = this.updateD3.bind(this);
    this.removeD3 = this.removeD3.bind(this);

    if (props.compensation && !props.shares) {
      this.barValues = [
        props.data[props.rowIndex].year.salary,
        props.data[props.rowIndex].year.bonus,
        props.data[props.rowIndex].year.stock,
        props.data[props.rowIndex].year.other,
      ];
    } else if (!props.compensation && props.shares) {
      this.barValues = [
        props.data[props.rowIndex].year.shares,
      ];
    } else {
      this.barValues = [
        props.data[props.rowIndex].year.salary,
        props.data[props.rowIndex].year.bonus,
        props.data[props.rowIndex].year.stock,
        props.data[props.rowIndex].year.other,
        props.data[props.rowIndex].year.shares,
      ];
    }

    this.barValues = this.barValues.reduce((acc, cur) => {
      acc.arr.push({
        value: cur,
        prevValue: acc.min,
      });

      acc.min += cur;

      return acc;
    }, {
      arr: [],
      min: 0,
    });

    if (props.compensation && !props.shares) {
      this.classString = 'comp-row-';
    } else if (!props.compensation && props.shares) {
      this.classString = 'shares-row-';
    } else if (props.compensation && props.shares) {
      this.classString = 'comp-shares-row-';
    }
  }

  componentDidMount() {
    this.renderD3(this.props);

    this.setupHandlers();
  }

  componentWillReceiveProps(newProps) {
    if (inView.is(document.getElementById(newProps.elementId))) {
      this.updateD3(newProps);
    } else if (this.rendered) {
      this.updateD3(newProps);
    }
  }

  setupHandlers() {
    inView(`#${this.props.elementId}`)
      .once('enter', () => {
        this.transitionD3(this.props);

        this.rendered = true;
      });
  }

  removeD3() {
    this.svg.select('g')
        .remove();
  }

  transitionD3(props) {
    this.barWidth
      .range([0, props.svgWidth]);

    const t = d3.transition()
      .duration(600)
      .ease(d3.easeCubicInOut);

    this.svg.select('g')
      .selectAll('rect')
        .transition(t)
        .delay(() => props.rowIndex * 60)
        .attr('x', d => this.barWidth(d.prevValue))
        .attr('width', d => this.barWidth(d.value));
  }

  updateD3(props) {
    this.barWidth
      .range([0, props.svgWidth]);

    this.svg.select('g')
      .selectAll('rect')
        .attr('x', d => this.barWidth(d.prevValue))
        .attr('width', d => this.barWidth(d.value));
  }

  renderD3(props) {
    this.svg = d3.select(`.${this.classString}${props.rowIndex}`);

    this.svg.append('g')
      .selectAll('rect')
      .data(this.barValues.arr)
      .enter()
      .append('rect')
        .attr('x', 0)
        .attr('y', 0)
        .attr('height', props.svgHeight)
        .attr('width', 0)
        .attr('fill', (d, i, a) => {
          const fill = a.length > 1 ? this.colors[i] : this.colors[4];

          return fill;
        });
  }

  render() {
    return (
      <svg
        width={this.props.svgWidth}
        height={this.props.svgHeight}
        className={`${this.classString}${this.props.rowIndex}`}
        ref={node => this.node === node}
      />
    );
  }
}

ProportionalStackedBar.propTypes = {
  rowIndex: PropTypes.number,
  data: PropTypes.array.isRequired, // eslint-disable-line
  svgWidth: PropTypes.number, // eslint-disable-line
  svgHeight: PropTypes.number, // eslint-disable-line
  compensation: PropTypes.bool.isRequired,
  shares: PropTypes.bool.isRequired,
  elementId: PropTypes.string.isRequired,
};

ProportionalStackedBar.defaultProps = {
  rowIndex: 0,
  svgWidth: 0,
  svgHeight: 0,
};

Bars.propTypes = {
  x: PropTypes.number,
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
  className: PropTypes.string,
};

Bars.defaultProps = {
  x: 0,
  width: 0,
  height: 0,
  color: '',
  className: '',
};

export default ProportionalStackedBar;
