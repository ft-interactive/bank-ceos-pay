'use strict';

import oHoverable from 'o-hoverable';
import d3 from 'd3';
import mainTemplate from '../templates/main.hbs';

document.addEventListener('DOMContentLoaded', function () {
  oHoverable.init(); // makes hover effects work on touch devices

  document.querySelector('main').innerHTML = mainTemplate(spreadsheet.options);

  console.log(spreadsheet.options);

  var spreadsheetData = spreadsheet.data;
  var ceoData = spreadsheet.ceo;
  var chartYear = 2013;


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
  

  //by person

  var people = {};
  spreadsheetData.forEach(function(d){
    people[d.first + ' ' + d.last] = true;
  });
  
  var peopleList = Object.keys(people);


  function drawPersonHistory(person){
    var parentNode = d3.select(this);

    parentNode.append('div')
      .attr('id', 'main-pic')
        .append('img')
        .attr('src', function(d) { return ceoLookup[d].ceo.imageurl; });

    parentNode.append('div')
      .attr('id', 'profile-name')
      .text(function(d) { return d; });


    parentNode.append('div')
      .attr('id', 'profile-txt')
      .text(function(d) { return ceoLookup[d].copy; });

    parentNode
      .append('div')
      .attr('class', 'bio-chart');

    parentNode.append('a')
      .attr('class', 'top-link')
      .attr('href', function(d) { return '#ft-header';})
      .html(' Back to chart');

    var personData = spreadsheetData.filter(function(d){
      var nameElements = person.split(' ');
      return (d.first === nameElements[0] && d.last === nameElements[1]);
    });
    // console.log(personData);
    //look up the guys data from the secondary data set
    // var CEOInfo = ceoLookup[person];
    //pusth CEOInfo into the template add it to the page
    var enterSelection = parentNode.select('.bio-chart').selectAll('.year-bar').data( personData.sort(function(a,b){ return a.year.fy - b.year.fy; }))
      .enter()
      .append('div')
      .attr('class', 'year-bar o-grid-row');

    enterSelection
      .append('div')
      .attr('class', 'ceo-year')
      .attr('data-o-grid-colspan', '2')
      .text(function(d) { return d.year.fy; }); // add the name;        
    
    parentNode.selectAll('.year-bar').each(stackedBar, true); //true make the thing 'simple'
  }

  // //By year stuff


  function drawChart(parent, value){
    if(!value) value = 2014;
    parent
      .selectAll('.ceos')
      .data(spreadsheetData.filter(function(d){
        return d.year.fy === value;
      }).sort(function(a,b){ return b.total - a.total; }))
      .enter()
      .append('div').attr('class','ceos o-grid-row')
      .on('click', function(d) { return document.getElementById(d.first + d.last).scrollIntoView(); });

    d3.selectAll('.ceos')
      .append('div')
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
      barHolder.attr('data-o-grid-colspan', '5 S7 L8');
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
      infoholder.append('div').attr('class', 'ceo-name')
      .text(function(d) { return d.first + ' ' + d.last; }); // add the name
      infoholder.append('div').attr('class', 'small-pic')
                .append('img').attr('src', function(d) { return ceoLookup[d.first + ' ' + d.last].ceo.imageurl; });
    }

    function stackLayout(object, propertiesArray){
      var start = 0;
      var returnArray = [];
      for(var i = 0; i<propertiesArray.length; i++){
        returnArray.push({
          startPos:start,
          value:object[propertiesArray[i]],
          class:propertiesArray[i]
        });
        start += object[propertiesArray[i]];
      }
      return returnArray;
    }

    // var currentYearMax = spreadsheetData.filter(function(d){return d.year.fy == chartYear;})

    var stackData = stackLayout(dataRow, ['base', 'cashbonus', 'other']);

    var maxVal = d3.max(spreadsheetData, function(d) {return +d.total; });
  

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
        x:function(d){ return scale(d.startPos); },
        y:function(d) { if(parent.attr('class') === 'year-bar') { return 1; } else { return 3; } },
        height: function(d) { if(parent.attr('class') === 'year-bar') { return 14; } else { return 24; } },
        width:function(d){ return scale(d.value); },
        class:function(d){ return d.class + ' stack-rectangle'; }
      });
  }

  d3.select('.bio-panel').selectAll('.bio').data(peopleList)
    .enter()
    .append('div')
    .attr('class', 'bio')
    .attr('id', function(d) { 
      var linkname = d.split(' ');
      return linkname[0] + linkname[1]; })
    .each(drawPersonHistory);

  d3.select('.chart').call(drawChart, chartYear);

});
