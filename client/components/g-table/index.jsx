import oGrid from 'o-grid'; // eslint-disable-line
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Table, Column, Cell } from 'fixed-data-table-2';
import { throttle } from 'lodash';
import { CSSTransitionGroup } from 'react-transition-group';
import ChartCell from './chart-cell/index.jsx'; // eslint-disable-line

class GTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: null,
      containerWidth: 0,
      rowHeight: 60,
      headerHeight: 60,
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

    this.setState({ containerWidth });
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
    const windowWidth = window.innerWidth;
    const executiveNameColWidth = windowWidth >= 1220 ? 262 // eslint-disable-line
      : windowWidth >= 980 ? 237 // eslint-disable-line
      : windowWidth >= 740 ? 237 // eslint-disable-line
      : windowWidth >= 490 ? 237 // eslint-disable-line
      : windowWidth >= 375 ? 211 // eslint-disable-line
      : 220;
    const totalColWidth = windowWidth >= 1220 ? 90 // eslint-disable-line
      : windowWidth >= 980 ? 82 // eslint-disable-line
      : windowWidth >= 740 ? 82 // eslint-disable-line
      : windowWidth >= 490 ? 82 // eslint-disable-line
      : windowWidth >= 375 ? 82 // eslint-disable-line
      : 90;
    const tableHeight = (this.state.data.length * this.state.rowHeight) +
      this.state.headerHeight + 2;
    const divStyle = { height: tableHeight };

    const executiveNameCol = (
      <Column
        header={<Cell className="cell header-cell">Executive name</Cell>}
        cell={props => (
          <Cell
            {...props}
            className="cell"
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
                    height="40"
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
            className="cell"
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
        width={72}
      />
    );

    const deferredCol = (
      <Column
        header={
          <Cell className="cell header-cell">
            {this.state.radioChecked} deferred<br />compensation
          </Cell>
        }
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
                  chartType="bubble"
                />
              )}
            </CSSTransitionGroup>
          </Cell>
        )}
        width={127}
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
        <div data-o-grid-colspan="12 S11 Scenter M9 L8 XL7">
          <div className="o-forms o-forms--wide">
            <label
              className="o-forms__label"
              htmlFor="all"
            >
              Select year
            </label>

            <input
              type="radio"
              onChange={this.handleRadioInput}
              checked={this.state.radioChecked === '2016'}
              value="2016"
              className="o-forms__radio"
              id="2016"
            />

            <label
              htmlFor="2016"
              className="o-forms__label"
            >
              2016
            </label>

            <input
              type="radio"
              onChange={this.handleRadioInput}
              checked={this.state.radioChecked === '2015'}
              value="2015"
              className="o-forms__radio"
              id="2015"
            />

            <label
              htmlFor="2015"
              className="o-forms__label"
            >
              2015
            </label>

            <input
              type="radio"
              onChange={this.handleRadioInput}
              checked={this.state.radioChecked === '2014'}
              value="2014"
              className="o-forms__radio"
              id="2014"
            />

            <label
              htmlFor="2014"
              className="o-forms__label"
            >
              2014
            </label>

            <input
              type="radio"
              onChange={this.handleRadioInput}
              checked={this.state.radioChecked === '2013'}
              value="2013"
              className="o-forms__radio"
              id="2013"
            />

            <label
              htmlFor="2013"
              className="o-forms__label"
            >
              2013
            </label>
          </div>
        </div>

        <div
          data-o-grid-colspan="12 S11 Scenter"
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
