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
  const width = props.width - marginLeft - marginRight;
  const height = props.height - marginTop - marginBottom;

  if (props.chartType === 'proportional-stacked-bar') {
    chart = (
      <ProportionalStackedBar
        {...props}
        gWidth={width}
        gHeight={height}
        data={props.data}
      />
    );
  } else if (props.chartType === 'bubble') {
    chart = (
      <Bubble
        {...props}
        gWidth={width}
        gHeight={height}
        data={props.data}
      />
    );
  }

  return (
    <svg
      width={width}
      height={height}
    >
      {chart}
    </svg>
  );
};

ChartCell.propTypes = {
  data: PropTypes.array.isRequired, // eslint-disable-line
  chartType: PropTypes.string.isRequired,
  width: PropTypes.number,
  height: PropTypes.number,
  rowIndex: PropTypes.number,
};

ChartCell.defaultProps = {
  width: null,
  height: null,
  rowIndex: null,
};

export default ChartCell;
