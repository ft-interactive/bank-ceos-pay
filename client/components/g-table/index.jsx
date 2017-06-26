import oGrid from 'o-grid'; // eslint-disable-line
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Table, Column, Cell } from 'fixed-data-table-2';
import { throttle } from 'lodash';
import { CSSTransitionGroup } from 'react-transition-group';
import ChartCell from './chart-cell/index.jsx'; // eslint-disable-line

const windowWidth = window.innerWidth;
const executiveNameColWidth = windowWidth >= 1220 ? 210 // eslint-disable-line
  : windowWidth >= 980 ? 193 // eslint-disable-line
  : windowWidth >= 740 ? 193 // eslint-disable-line
  : windowWidth >= 490 ? 193 // eslint-disable-line
  : windowWidth >= 375 ? 177 // eslint-disable-line
  : 210;
const totalColWidth = windowWidth >= 1220 ? 90 // eslint-disable-line
  : windowWidth >= 980 ? 82 // eslint-disable-line
  : windowWidth >= 740 ? 82 // eslint-disable-line
  : windowWidth >= 490 ? 82 // eslint-disable-line
  : windowWidth >= 375 ? 82 // eslint-disable-line
  : 90;

class GTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: null,
      containerWidth: 0,
      rowHeight: 52,
      headerHeight: 52,
      radioChecked: '2016',
      showCellContent: true,
      showDeferredCol: true,
    };
    this.handleResize = this.handleResize.bind(this);
    this.handleRadioInput = this.handleRadioInput.bind(this);
  }

  componentWillMount() {
    const filteredData = this.props.data.map((d) => {
      const obj = {
        ceo: d.ceo,
        company: d.company,
        year: d.y2016,
      };

      return obj;
    });

    filteredData.sort((a, b) => b.year.total - a.year.total);

    this.setState({ data: filteredData });
  }

  componentDidMount() {
    this.handleResize();

    window.addEventListener('resize', throttle(this.handleResize, 250));
  }

  handleResize() {
    const containerWidth = this.node.offsetWidth;
    const gutterWidth = windowWidth >= 740 ? 20 : 10;

    this.setState({ containerWidth: containerWidth - gutterWidth });
  }

  handleRadioInput(el) {
    const filterTerm = el.target.value;
    const filteredData = this.props.data.map((d) => {
      const year = `y${filterTerm}`;
      const obj = {
        ceo: d.ceo,
        company: d.company,
        year: d[year],
      };

      return obj;
    });
    const showDeferredCol = filterTerm === '2016';

    this.setState({
      radioChecked: filterTerm,
      showCellContent: false,
    });

    filteredData.sort((a, b) => b.year.total - a.year.total);

    setTimeout(() => this.setState({
      data: filteredData,
      showCellContent: true,
      showDeferredCol,
    }), 400);
  }

  render() {
    const tableHeight = (this.state.data.length * this.state.rowHeight) +
      this.state.headerHeight + 2;
    const divStyle = { height: tableHeight };

    const executiveNameCol = (
      <Column
        header={<Cell className="cell header-cell">Executive name</Cell>}
        cell={props => (
          <Cell
            {...props}
            className="cell image-cell"
          >
            <CSSTransitionGroup
              transitionName="cell"
              transitionEnterTimeout={300}
              transitionLeaveTimeout={100}
            >
              {!this.state.showCellContent ? null : (
                <div key={props.rowIndex}>
                  <img
                    src={this.state.data[props.rowIndex].ceo.imgurl}
                    alt={this.state.data[props.rowIndex].ceo.name}
                    height="32"
                  />
                  <div className="executive-name">
                    {this.state.data[props.rowIndex].ceo.name}<br />
                    <a
                      className="o-typography-link-topic o-typography-link-topic--small"
                      target="_blank"
                      rel="noopener noreferrer"
                      href={this.state.data[props.rowIndex].company.fturl}
                    >
                      {this.state.data[props.rowIndex].company.name}
                    </a>
                  </div>
                </div>
              )}
            </CSSTransitionGroup>
          </Cell>
        )}
        width={executiveNameColWidth}
      />
    );

    const totalCol = (
      <Column
        header={<Cell className="cell header-cell">Total ($m)</Cell>}
        cell={props => (
          <Cell
            {...props}
            className="cell number-cell"
          >
            <CSSTransitionGroup
              transitionName="cell"
              transitionEnterTimeout={300}
              transitionLeaveTimeout={100}
            >
              {!this.state.showCellContent ? null : (
                <div key={props.rowIndex}>
                  {+(this.state.data[props.rowIndex].year.total / 1000000).toFixed(1)}
                </div>
              )}
            </CSSTransitionGroup>
          </Cell>
        )}
        width={totalColWidth}
      />
    );

    const compensationCol = (
      <Column
        header={(
          <Cell className="cell header-cell">
            {windowWidth < 398 ? `${this.state.radioChecked} comp.`
              : `${this.state.radioChecked} compensation`
            }
          </Cell>
        )}
        cell={props => (
          <Cell
            {...props}
            className="cell chart-cell"
          >
            <CSSTransitionGroup
              transitionName="cell"
              transitionEnterTimeout={300}
              transitionLeaveTimeout={100}
            >
              {!this.state.showCellContent ? null : (
                <ChartCell
                  {...props}
                  data={this.state.data}
                  chartType="proportional-stacked-bar"
                />
              )}
            </CSSTransitionGroup>
          </Cell>
        )}
        flexGrow={1}
        width={0}
      />
    );

    const table = (
      <Table
        rowHeight={this.state.rowHeight}
        headerHeight={this.state.headerHeight}
        rowsCount={this.state.data.length}
        width={this.state.containerWidth}
        height={tableHeight}
      >
        {executiveNameCol}
        {totalCol}
        {windowWidth < 375 ? null :
          compensationCol
        }
      </Table>
    );

    return (
      <div>
        <div
          data-o-grid-colspan="12 S11 Scenter M9 L8 XL7"
          ref={node => (this.node = node)}
          style={divStyle}
        >
          {table}
        </div>
      </div>
    );
  }
}

GTable.propTypes = {
  data: PropTypes.array.isRequired, // eslint-disable-line
};

export default GTable;
