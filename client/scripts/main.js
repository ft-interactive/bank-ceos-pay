'use strict';

import oHoverable from 'o-hoverable';
import mainTemplate from '../templates/main.hbs';


document.addEventListener('DOMContentLoaded', function () {

  oHoverable.init(); // makes hover effects work on touch devices

  var latestDataYear = d3.max(spreadsheet.data, function(d){
    return d.year.fy;
  });

  var startYear = d3.min(spreadsheet.data, function(d){
    return d.year.fy;
  });

  var chartYear = spreadsheet.options.chartYear = parseInt(spreadsheet.options.chartYear) || latestDataYear;

  document.querySelector('main').innerHTML = mainTemplate(spreadsheet.options);

  var spreadsheetData = spreadsheet.data;
  var ceoData = spreadsheet.ceo;

  //utility functions

  function makeLookup(array, accessor){
    var lookup = {};
    array.forEach(function(d){
      lookup[accessor(d)] = d;
    });
    return lookup;
  }

  var ceoLookup = makeLookup(ceoData, function(d){ return d.ceo.first + ' ' + d.ceo.last; }); //create CEO name list

  // display salaries correctly
  function convertMillion (data) {
    if (!data || data === 'null') {
      return '-';
    }

    var html = '';

    if(data > 1000000) {
      html = '$' + Math.round(data / 100000)/10 + 'm';
    } else {
      html = '$' + d3.format(',')(data);
    }
    return html;
  }

  function stackLayout(object, propertiesArray){
    var start = 0;
    var returnArray = [];
    for(var i = 0; i<propertiesArray.length; i++){
      returnArray.push({
        startPos: start,
        value: (object[propertiesArray[i]] || 0),
        class: propertiesArray[i]
      });
      start += (object[propertiesArray[i]] || 0);
    }
    return returnArray;
  }

  //by person

  // only show the people for the selected year
  // var people = spreadsheetData.sort(sortTotal).reduce(function(o, d) {
  //   if (d.year.fy === chartYear) {
  //     o[d.first + ' ' + d.last] = true;
  //   }
  //   return o;
  // }, {});

  var people = {};
  spreadsheetData.forEach(function(d){
    people[d.first + ' ' + d.last] = true;
  });

  var peopleList = Object.keys(people);

  function sortTotal(a,b){
    return b.total - a.total;
  }

  function drawPersonHistory(person, i){

    var parentNode = d3.select(this);

    var personData = spreadsheetData.filter(function(d){
      var nameElements = person.split(' ');
      return (d.first === nameElements[0] && d.last === nameElements[1]);
    });

    //look up the guys data from the secondary data set
    // var CEOInfo = ceoLookup[person];
    //pusth CEOInfo into the template add it to the page
    var enterSelection = parentNode.select('.bio-chart')
        .selectAll('.year-bar')
      .data(personData.sort(function(a,b) { return a.year.fy - b.year.fy; }))
        .enter()
      .append('div')
        .attr('class', 'year-bar o-grid-row');

    enterSelection.append('div')
        .attr('class', 'ceo-year')
        .attr('data-o-grid-colspan', '2')
        .text(function(d) {
          if (d.asterisk == 'a') {
            return d.year.fy + '*';
          } else if (d.asterisk == 'd') {
            return d.year.fy + '†';
          } else {
            return d.year.fy;
          }
        });

    parentNode.selectAll('.year-bar').each(stackedBar, true); //true make the thing 'simple'
  }

  // //By year stuff
  function key (d) {
    return d.last;
  }

  function drawChart (parent, value) {
    if (!value) value = chartYear;

    parent.selectAll('.ceos')
        .data(spreadsheetData.filter(function(d){
          return d.year.fy === value;
        }).sort(sortTotal), key)
      .enter().append('div')
        .attr('class','ceos o-grid-row')
        .style('width', '100%')
        .style('top', function (d, i) {
          return 6 + (i * 40) + 'px';
        })
        .on('click', function (d) {
          return document.getElementById(d.first + d.last).scrollIntoView();
        });

    d3.selectAll('.ceos').append('div')
        .attr('class', 'ceo')
        .attr('data-o-grid-colspan', '4 M3');

    d3.selectAll('.ceos')
        .each(stackedBar);
  }

// width="400" height="50" viewbox="0 0 400 50" preserveAspectRatio="none"
  function stackedBar(dataRow, simple){
    var parent = d3.select(this); // this refers to the .ceos divs
    var barHolder = parent
                      .append('div')
                      .attr('class','bar');

    if (parent.attr('class') === 'year-bar o-grid-row') {
      barHolder.attr('data-o-grid-colspan', '8 S9');
    } else {
      barHolder.attr('data-o-grid-colspan', '5 S6 M7 L8');
    }

    barHolder
      .append('svg')
      .attr('width', 450)
      .attr('preserveAspectRatio', 'none');

    parent
      .append('div')
      .attr('data-o-grid-colspan', '2 S1')
      .text(function(d) { return convertMillion(d.total); })
      .attr('class', 'ceo-total');

    if(!simple){
      var infoholder = d3.selectAll('.ceo');

      infoholder.append('div')
          .attr('class', 'ceo-name')
        .append('span')
          .attr('class', 'ceo-rank')
          .text(function (d, i) {
            return i + 1 + '. ';
          });

      infoholder.select('.ceo-name')
        .append('span')
          .text(function (d, i) {
            if (d.asterisk == 'a') {
              return d.first + ' ' + d.last + '*';
            } else if (d.asterisk == 'd') {
              return d.first + ' ' + d.last + '†';
            }
            return d.first + ' ' + d.last;
          });

      infoholder.append('div')
          .attr('class', 'small-pic')
        .append('img')
          .attr('src', function (d) {
            return ceoLookup[d.first + ' ' + d.last].ceo.imageurl;
          });
    }

    // var currentYearMax = spreadsheetData.filter(function(d){return d.year.fy == chartYear;})

    var stackData = stackLayout(dataRow, ['base', 'cashbonus', 'other']);

    var maxVal = d3.max(spreadsheetData.filter(function(d){
      return d.year.fy === chartYear;
    }), function(d) {return +d.total; });



    var scale = d3.scale.linear() // set the scale of the charts
      .domain([0, maxVal]);
      // .range([0, 500]);

      // set viewbox for both sets of bars
    if (parent.attr('class') === 'year-bar o-grid-row') {
      parent.select('svg')
        .attr('viewBox', '0 0 500 16');

      scale.range([0, 500]);
    } else {
      parent.select('svg')
        .attr('viewBox', '0 0 ' + parent.select('.bar').node().getBoundingClientRect().width + ' 34');
      scale.range([0, parent.select('.bar').node().getBoundingClientRect().width]);
    }

    parent.select('svg').selectAll('.stack-rectangle').data( stackData )
      .enter()
      .append('rect')
      .attr({
        x: function (d) { return scale(d.startPos); },
        y:function(d) { if(parent.attr('class') === 'year-bar') { return 1; } else { return 3; } },
        height: function(d) { if(parent.attr('class') === 'year-bar') { return 14; } else { return 24; } },
        width:function(d){ return scale(d.value); },
        class:function(d){ return d.class + ' stack-rectangle'; }
      });
  }

  d3.select('.bio-panel').selectAll('.bio')
      .data(peopleList)
    .enter().append('div')
      .attr('class', 'bio')
      .attr('id', function(d) {
        var linkname = d.split(' ');
        return linkname[0] + linkname[1];
      });

  d3.selectAll('.bio').each(drawPersonHistory);

  d3.select('.chart').call(drawChart, chartYear);

  //slider event
  var axis = d3.svg.axis().ticks(5).tickFormat(d3.format('d'));

  function updateChart(parent, value) {
    var rebind = parent.selectAll('.ceos')
        .data(spreadsheetData.filter(function (d) {
          return d.year.fy === value;
        }).sort(sortTotal), key);

    // Transition row positions
    d3.transition()
        .delay(150)
        .duration(3000)
        .each(function () {
          rebind.transition()
              .style('top', function (d, i) {
                console.log(i + d.last);
                return 6 + (i * 40) + 'px';
              })
        });

    // Fade out rankings then fade in updated ones
    d3.transition()
        .duration(150)
        .each(function () {
          rebind.select('.ceo-rank')
            .transition()
              .style('opacity', 0)
            .transition()
              .delay(3000)
              .text(function (d, i) {
                return i + 1 + '. ';
              })
              .style('opacity', 1);
        });
  }

  function updateStackedBar (dataRow) {
    var parent = d3.select(this);
    var stackData = stackLayout(dataRow, ['base', 'cashbonus', 'other']);
    var maxVal = d3.max(spreadsheetData.filter(function (d) {
          return d.year.fy === chartYear;
        }), function (d) { return +d.total; });
    var scale = d3.scale.linear()
        .domain([0, maxVal]);

    parent.select('svg')
        .attr('viewBox', '0 0 ' +
          parent.select('.bar').node().getBoundingClientRect().width + ' 34');

    scale.range([0,
      parent.select('.bar').node().getBoundingClientRect().width]);

    parent.select('svg').selectAll('.stack-rectangle')
        .data(stackData)
      .transition()
        .delay(150)
        .duration(3000)
        .attr({
          x: function (d) {
            return scale(d.startPos);
          },
          width: function (d) {
            return scale(d.value);
          }
        });

    parent.select('.ceo-total')
      .transition()
        .duration(150)
        .style('opacity', 0)
      .transition()
        .delay(3000)
        .duration(150)
        .text(function (d) {
          return convertMillion(d.total);
        })
        .style('opacity', 1);
  }

  function selectYear(year) {
    d3.select('.key-title').text('Breakdown of pay, ' + year);
    d3.select('.chart').call(updateChart, year);
    d3.selectAll('.ceos').each(updateStackedBar, year);
  }

  function createSlider () {
    d3.select('.slider').html('');
    d3.select('.slider').attr('class', 'slider');
    d3.select('.slider').call(d3.slider().axis(axis).min(startYear).max(chartYear).step(1).value(chartYear)
      .on('slide', function(evt, value) {
        selectYear(value);
      }));
  }

  createSlider();

  var timeOut = null;

  window.onresize = function(){
      if (timeOut !== null)
          clearTimeout(timeOut);

      timeOut = setTimeout(function(){
        createSlider();
      }, 200);
  };

  d3.select('title').text(spreadsheet.options.introtitle);

  function writeCredits (options) {
    var dataLength = chartYear - startYear;
    var creditHtml = 'Graphic ' + spreadsheet.options.credits + ': ';

    for(var i = -4; i < dataLength; i++) {
      creditHtml += '<a href="' + spreadsheet.options['v' + Number(startYear + i)]  + '">' + Number(startYear + i) + '</a> | ';
    }

    var creditHtmlTrimmed = creditHtml.substr(0, creditHtml.length -2);
    return creditHtmlTrimmed;
  }

  d3.select('.credits').html(writeCredits(spreadsheet.options))

});
