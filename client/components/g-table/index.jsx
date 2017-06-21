import React, { Component } from 'react';
import oGrid from 'o-grid'; // eslint-disable-line
// import PropTypes from 'prop-types';
import { Table, Column, Cell } from 'fixed-data-table-2';
import { throttle } from 'lodash';
import { CSSTransitionGroup } from 'react-transition-group';

class GTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: props.data,
      containerWidth: 0,
      rowHeight: 60,
      headerHeight: 50,
      radioChecked: '2016',
      showHello: true,
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

    this.setState({
      radioChecked: filterTerm,
      showHello: false,
    });

    filteredData.sort((a, b) => b.year.total - a.year.total);

    setTimeout(() => this.setState({
      data: filteredData,
      showHello: true,
    }), 400);
  }

  render() {
    const windowWidth = window.innerWidth;
    const executiveNameColWidth = windowWidth < 490 ? 185
      : windowWidth < 1220 ? 201
      : 218;
    const executiveNameCol = (
      <Column
        header={<Cell className="cell header-cell">Executive name</Cell>}
        cell={props => (
          <Cell
            {...props}
            className="cell"
          >
            <img
              src={this.state.data[props.rowIndex].ceo.imgurl}
              alt={this.state.data[props.rowIndex].ceo.name}
              height="40"
            />
            {this.state.data[props.rowIndex].ceo.name}
          </Cell>
        )}
        // flexGrow={1}
        width={executiveNameColWidth}
      />
    );
    const companyNameCol = windowWidth < 740 ? null
      : (
        <Column
          header={<Cell className="cell header-cell">Institution</Cell>}
          cell={props => (
            <Cell
              {...props}
              className="cell"
            >
              <a
                target="_blank"
                rel="noopener noreferrer"
                href={this.state.data[props.rowIndex].company.fturl}
              >
                {this.state.data[props.rowIndex].company.name}
              </a>
            </Cell>
          )}
          flexGrow={1}
          width={20}
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
            {+(this.state.data[props.rowIndex].year.total / 1000000).toFixed(1)}
          </Cell>
        )}
        flexGrow={1}
        width={20}
      />
    );
    const tableHeight = (this.state.data.length * this.state.rowHeight) +
      this.state.headerHeight + 2;
    const divStyle = { height: tableHeight };
    const table = !this.state.showHello ? null : (
      <Table
        rowHeight={this.state.rowHeight}
        headerHeight={this.state.headerHeight}
        rowsCount={this.state.data.length}
        width={this.state.containerWidth}
        height={tableHeight}
      >
        {executiveNameCol}
        {companyNameCol}
        {totalCol}
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
          <CSSTransitionGroup
            transitionName="example"
            transitionEnterTimeout={300}
            transitionLeaveTimeout={100}
          >
            {table}
          </CSSTransitionGroup>
        </div>
      </div>
    );
  }
}

// GTable.propTypes = {
//   data: PropTypes.array.isRequired, // eslint-disable-line
// };

export default GTable;
