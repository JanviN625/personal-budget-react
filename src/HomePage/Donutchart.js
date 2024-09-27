import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import axios from 'axios';

const DonutChart = () => {
  const chartRef = useRef();

  useEffect(() => {
    const width = 400, height = 400, radius = Math.min(width, height) / 2;

    // Clear any existing SVG before creating a new one
    d3.select(chartRef.current).selectAll("*").remove();

    const svg = d3.select(chartRef.current)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);

    const arc = d3.arc()
      .outerRadius(radius * 0.8)
      .innerRadius(radius * 0.4);

    const pie = d3.pie()
      .sort(null)
      .value(d => d.budget);

    const color = d3.scaleOrdinal()
      .range(['#ffcd56', '#ff6384', '#36a2eb', '#fd6b19', '#4bc0c0', '#9966ff', '#ff9f40']);

    axios.get('http://localhost:3001/budget')
      .then((res) => {
        const arcs = svg.selectAll('.arc')
          .data(pie(res.data.myBudget))
          .enter().append('g')
          .attr('class', 'arc');

        arcs.append('path')
          .attr('d', arc)
          .style('fill', d => color(d.data.title));

        arcs.append('text')
          .attr('transform', d => `translate(${arc.centroid(d)})`)
          .attr('dy', '.35em')
          .style('text-anchor', 'middle')
          .text(d => d.data.title);
      })
      .catch(err => console.log(err));
  }, []);

  return (
    <div id="donutChart" ref={chartRef} />
  );
};

export default DonutChart;
