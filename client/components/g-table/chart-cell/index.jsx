import PropTypes from 'prop-types';
import React from 'react';
import ProportionalStackedBar from './proportional-stacked-bar/index.jsx'; // eslint-disable-line
import Bubble from './bubble/index.jsx'; // eslint-disable-line

const marginTop = 8;
const marginRight = 8;
const marginBottom = 8;
const marginLeft = 8;
let chart = null;

const ChartCell = (props) => {
  const width = props.width > 0 ? props.width - marginLeft - marginRight : null;
  const height = props.height - marginTop - marginBottom;

  if (props.chartType === 'proportional-stacked-bar') {
    chart = (
      <ProportionalStackedBar
        {...props}
        svgWidth={width}
        svgHeight={height}
        data={props.data}
      />
    );
  } else if (props.chartType === 'bubble') {
    chart = (
      <Bubble
        {...props}
        svgWidth={width}
        svgHeight={height}
        data={props.data}
      />
    );
  }

  return chart;
};

ChartCell.propTypes = {
  data: PropTypes.array.isRequired, // eslint-disable-line
  chartType: PropTypes.string.isRequired,
  width: PropTypes.number,
  height: PropTypes.number,
};

ChartCell.defaultProps = {
  width: 0,
  height: 0,
};

export default ChartCell;
