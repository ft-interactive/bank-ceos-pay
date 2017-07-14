import oGrid from 'o-grid'; // eslint-disable-line
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
    const gutterWidth = windowWidth >= 740 ? 20 : 10;
    const rowHeight = 52;
    const executiveNameColWidth = windowWidth >= 1220 ? 210 // eslint-disable-line
      : windowWidth >= 980 ? 193 // eslint-disable-line
      : windowWidth >= 740 ? 193 // eslint-disable-line
      : windowWidth >= 490 ? 193 // eslint-disable-line
      : windowWidth >= 375 ? 177 // eslint-disable-line
      : 210;
    const totalColWidth = windowWidth >= 1220 ? 97 // eslint-disable-line
      : windowWidth >= 980 ? 88 // eslint-disable-line
      : windowWidth >= 740 ? 88 // eslint-disable-line
      : windowWidth >= 490 ? 88 // eslint-disable-line
      : windowWidth >= 375 ? 52 // eslint-disable-line
      : 87;

    this.setState({
      containerWidth: containerWidth - gutterWidth,
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
          </Cell>
        )}
        width={this.state.executiveNameColWidth}
      />
    );

    const totalCompensationCol = (
      <Column
        header={<Cell className="cell header-cell">Total ($US)</Cell>}
        cell={props => (
          <Cell
            {...props}
            className="cell number-cell"
          >
            <div key={props.rowIndex}>
              {`${+(this.state.data[props.rowIndex].year.total / 1000000).toFixed(1)}m`}
            </div>
          </Cell>
        )}
        width={this.state.totalColWidth}
      />
    );

    const totalSharesCol = (
      <Column
        header={<Cell className="cell header-cell">Total ($US)</Cell>}
        cell={props => (
          <Cell
            {...props}
            className="cell number-cell"
          >
            <div key={props.rowIndex}>
              {this.state.data[props.rowIndex].year.shares > 0 ?
                `${+(this.state.data[props.rowIndex].year.shares / 1000000).toFixed(1)}m`
                : 0
              }
            </div>
          </Cell>
        )}
        width={this.state.totalColWidth}
      />
    );

    const totalCombinedCol = (
      <Column
        header={<Cell className="cell header-cell">Total ($US)</Cell>}
        cell={props => (
          <Cell
            {...props}
            className="cell number-cell"
          >
            <div key={props.rowIndex}>
              {`${+((this.state.data[props.rowIndex].year.total
                + this.state.data[props.rowIndex].year.shares) / 1000000).toFixed(1)}m`}
            </div>
          </Cell>
        )}
        width={this.state.totalColWidth}
      />
    );

    const compensationCol = windowWidth >= 375 ? (
      <Column
        header={null}
        cell={props => (
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
        )}
        flexGrow={1}
        width={20}
      />
    ) : null;

    const sharesCol = windowWidth >= 375 ? (
      <Column
        header={null}
        cell={props => (
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
        )}
        flexGrow={1}
        width={20}
      />
    ) : null;

    const combinedCol = windowWidth >= 375 ? (
      <Column
        header={null}
        cell={props => (
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
  compensation: PropTypes.bool.isRequired,
  shares: PropTypes.bool.isRequired,
  elementId: PropTypes.string.isRequired,
};

export default GTable;
