import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Table, Column, Cell } from 'fixed-data-table-2';
import { throttle } from 'lodash';
import ChartCell from './chart-cell/index.jsx'; // eslint-disable-line

let windowWidth = window.innerWidth;

class GTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: {},
      containerWidth: 0,
      rowHeight: 52,
      executiveNameColWidth: 210,
      totalColWidth: 90,
    };
    this.handleResize = this.handleResize.bind(this);
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
    windowWidth = window.innerWidth;
    const containerWidth = this.node.offsetWidth;
    const rowHeight = 52;
    const executiveNameColWidth = windowWidth >= 1220 ? 222 // eslint-disable-line
      : windowWidth >= 980 ? 204 // eslint-disable-line
      : windowWidth >= 740 ? 204 // eslint-disable-line
      : windowWidth >= 490 ? 204 // eslint-disable-line
      : windowWidth >= 375 ? 186 // eslint-disable-line
      : 186;
    const totalColWidth = windowWidth >= 1220 ? 97 // eslint-disable-line
      : windowWidth >= 980 ? 88 // eslint-disable-line
      : windowWidth >= 740 ? 88 // eslint-disable-line
      : windowWidth >= 490 ? 88 // eslint-disable-line
      : windowWidth >= 375 ? 53 // eslint-disable-line
      : 53;

    this.setState({
      containerWidth,
      rowHeight,
      executiveNameColWidth,
      totalColWidth,
    });
  }

  render() {
    const tableHeight = (this.state.data.length * this.state.rowHeight) +
      this.state.rowHeight + 2;
    const divStyle = { height: tableHeight };

    const executiveNameCol = (
      <Column
        header={<Cell className="cell header-cell">Executive</Cell>}
        cell={props => (
          <a href={`#${this.state.data[props.rowIndex].ceo.id}`}>
            <Cell
              {...props}
              className="cell image-cell"
            >
              <div key={props.rowIndex}>
                <img
                  src={this.state.data[props.rowIndex].ceo.imgurl}
                  alt={this.state.data[props.rowIndex].ceo.name}
                  height={Math.floor(this.state.rowHeight * 0.62)}
                />
                <div className="executive-name">
                  {this.state.data[props.rowIndex].ceo.name}
                  {this.state.data[props.rowIndex].ceo.compasterisk && this.props.compensation && !this.props.shares && '*'}
                  {this.state.data[props.rowIndex].ceo.compcross && this.props.compensation && !this.props.shares && '**'}
                  {this.state.data[props.rowIndex].ceo.sharesasterisk && !this.props.compensation && this.props.shares && '*'}
                  <br />

                  <span className="o-typography-link-topic o-typography-link-topic--small">
                    {this.state.data[props.rowIndex].company.name}
                  </span>
                </div>
              </div>
            </Cell>
          </a>
        )}
        width={this.state.executiveNameColWidth}
      />
    );

    const totalCompensationCol = (
      <Column
        header={<Cell className="cell header-cell">Total ($US)</Cell>}
        cell={props => (
          <a href={`#${this.state.data[props.rowIndex].ceo.id}`} key={props.rowIndex}>
            <Cell
              {...props}
              className="cell number-cell"
            >
              <div>
                {`${+(this.state.data[props.rowIndex].year.total / 1000000).toFixed(1)}m`}
              </div>
            </Cell>
          </a>
        )}
        flexGrow={windowWidth < 375 ? 1 : null}
        width={this.state.totalColWidth}
      />
    );

    const totalSharesCol = (
      <Column
        header={<Cell className="cell header-cell">Total ($US)</Cell>}
        cell={props => (
          <a href={`#${this.state.data[props.rowIndex].ceo.id}`} key={props.rowIndex}>
            <Cell
              {...props}
              className="cell number-cell"
            >
              <div>
                {this.state.data[props.rowIndex].year.shares > 0 ?
                  `${+(this.state.data[props.rowIndex].year.shares / 1000000).toFixed(1)}m`
                  : 0
                }
              </div>
            </Cell>
          </a>
        )}
        width={this.state.totalColWidth}
      />
    );

    const totalCombinedCol = (
      <Column
        header={<Cell className="cell header-cell">Total ($US)</Cell>}
        cell={props => (
          <a href={`#${this.state.data[props.rowIndex].ceo.id}`} key={props.rowIndex}>
            <Cell
              {...props}
              className="cell number-cell"
            >
              <div>
                {`${+(this.state.data[props.rowIndex].year.totalplusshares / 1000000).toFixed(1)}m`}
              </div>
            </Cell>
          </a>
        )}
        width={this.state.totalColWidth}
      />
    );

    const compensationCol = windowWidth >= 375 ? (
      <Column
        header={
          <Cell className="cell header-cell chart-cell-header">
            <div className="legend">
              <div className="legend-item">
                <div className="legend-bar legend-bar-salary" />

                <div className="legend-text">Salary</div>
              </div>

              <div className="legend-item">
                <div className="legend-bar legend-bar-bonus" />

                <div className="legend-text">Bonus</div>
              </div>

              <div className="legend-item">
                <div className="legend-bar legend-bar-stock" />

                <div className="legend-text">Stock</div>
              </div>

              <div className="legend-item">
                <div className="legend-bar legend-bar-other" />

                <div className="legend-text">Other</div>
              </div>
            </div>
          </Cell>
        }
        cell={props => (
          <a href={`#${this.state.data[props.rowIndex].ceo.id}`} key={props.rowIndex}>
            <Cell
              {...props}
              className="cell chart-cell"
            >
              <ChartCell
                {...props}
                data={this.state.data}
                chartType="proportional-stacked-bar"
                compensation
                shares={false}
                elementId={this.props.elementId}
              />
            </Cell>
          </a>
        )}
        flexGrow={1}
        width={20}
      />
    ) : null;

    const sharesCol = windowWidth >= 375 ? (
      <Column
        header={
          <Cell className="cell header-cell chart-cell-header">
            <div className="legend">
              <div className="legend-item">
                <div className="legend-bar legend-bar-shares" />

                <div className="legend-text">Shares</div>
              </div>
            </div>
          </Cell>
        }
        cell={props => (
          <a href={`#${this.state.data[props.rowIndex].ceo.id}`} key={props.rowIndex}>
            <Cell
              {...props}
              className="cell chart-cell"
            >
              <ChartCell
                {...props}
                data={this.state.data}
                chartType="proportional-stacked-bar"
                compensation={false}
                shares
                elementId={this.props.elementId}
              />
            </Cell>
          </a>
        )}
        flexGrow={1}
        width={20}
      />
    ) : null;

    const combinedCol = windowWidth >= 375 ? (
      <Column
        header={
          <Cell className="cell header-cell chart-cell-header">
            <div className="legend">
              <div className="legend-item">
                <div className="legend-bar legend-bar-salary" />

                <div className="legend-text">Salary</div>
              </div>

              <div className="legend-item">
                <div className="legend-bar legend-bar-bonus" />

                <div className="legend-text">Bonus</div>
              </div>

              <div className="legend-item">
                <div className="legend-bar legend-bar-stock" />

                <div className="legend-text">Stock</div>
              </div>

              <div className="legend-item">
                <div className="legend-bar legend-bar-other" />

                <div className="legend-text">Other</div>
              </div>

              <div className="legend-item">
                <div className="legend-bar legend-bar-shares" />

                <div className="legend-text">Shares</div>
              </div>
            </div>
          </Cell>
        }
        cell={props => (
          <a href={`#${this.state.data[props.rowIndex].ceo.id}`} key={props.rowIndex}>
            <Cell
              {...props}
              className="cell chart-cell"
            >
              <ChartCell
                {...props}
                data={this.state.data}
                chartType="proportional-stacked-bar"
                compensation
                shares
                elementId={this.props.elementId}
              />
            </Cell>
          </a>
        )}
        flexGrow={1}
        width={20}
      />
    ) : null;

    const table = (
      <Table
        rowHeight={this.state.rowHeight}
        headerHeight={this.state.rowHeight}
        rowsCount={this.state.data.length}
        width={this.state.containerWidth}
        height={tableHeight}
      >
        {executiveNameCol}
        {this.props.compensation && !this.props.shares &&
          totalCompensationCol
        }
        {!this.props.compensation && this.props.shares &&
          totalSharesCol
        }
        {this.props.compensation && this.props.shares &&
          totalCombinedCol
        }
        {this.props.compensation && !this.props.shares &&
          compensationCol
        }
        {!this.props.compensation && this.props.shares &&
          sharesCol
        }
        {this.props.compensation && this.props.shares &&
          combinedCol
        }
      </Table>
    );

    return (
      <div>
        <div
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
  compensation: PropTypes.bool.isRequired,
  shares: PropTypes.bool.isRequired,
  elementId: PropTypes.string.isRequired,
};

export default GTable;
