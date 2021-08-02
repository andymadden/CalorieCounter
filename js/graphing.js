
function chartWeight(data, width, height) {
  var svg = d3.select("#container-data-weight")
    .append("svg")
      .attr("width", width)
      .attr("height", height)
      .classed("data-chart-line", true)
    .append("g")
      .attr("transform", "translate(30, 15)");
  
  var x = d3.scaleTime()
    .domain(d3.extent(data, d => d.timestamp))
    .range([15, width-15]);
  svg.append("g")
    .attr("transform", "translate(0,"+(height-15)+")")
    .call(d3.axisBottom(x).ticks(d3.timeDay.every(1)).tickFormat(d => d3.timeFormat("%b %d")(d)));
  
  var y = d3.scaleLinear()
    .domain(d3.extent(data, d => d.weight))
    .range([height-15, 15]);
  svg.append("g")
    .attr("transform", "translate(15,0)")
    .call(d3.axisLeft(y));
  
  svg.append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-width", 1.5)
    .attr("d", d3.line()
      .x(d => x(d.timestamp))
      .y(d => y(d.weight))
    );
}

function chartMeals(data, width, height) {
  var svg = d3.select("#container-data-meal")
    .append("svg")
      .attr("width", width)
      .attr("height", height)
      .classed("data-chart-line", true)
    .append("g")
      .attr("transform", "translate(30, 15)");
  
  var x = d3.scaleTime()
    .domain(d3.extent(data, d => d.timestamp))
    .range([15, width-15]);
  svg.append("g")
    .attr("transform", "translate(0,"+(height-15)+")")
    .call(d3.axisBottom(x).ticks(d3.timeDay.every(1)).tickFormat(d => d3.timeFormat("%b %d")(d)));
  
  var y = d3.scaleLinear()
    .domain(d3.extent(data, d => d.calories))
    .range([height-15, 15]);
  svg.append("g")
    .attr("transform", "translate(15,0)")
    .call(d3.axisLeft(y));
  
  svg.append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-width", 1.5)
    .attr("d", d3.line()
      .x(d => x(d.timestamp))
      .y(d => y(d.calories))
    );
}

fetch("/api/meal").then(d => d.json()).then(x => chartMeals(x, 300, 170));
fetch("/api/weight").then(d => d.json()).then(x => chartWeight(x, 300, 170));