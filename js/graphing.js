margin = ({ top: 40, right: 40, bottom: 30, left: 40 })

reveal = path => path.transition()
  .duration(1000)
  .ease(d3.easeLinear)
  .attrTween("stroke-dasharray", function () {
    const length = this.getTotalLength();
    return d3.interpolate(`0,${length}`, `${length},${length}`);
  })

function chartWeightMeal(data_weight, data_meal, width, height, margin) {

  var svg = d3.select("#container-data-weight")
    .append("svg")
    .attr("viewBox", [0, 0, width, height])
    .classed("data-chart-line", true)
    .append("g");

  // time axis
  var x = d3.scaleTime()
    .domain([d3.timeDay.offset(d3.max(data_weight, d => d.timestamp), -7), d3.max(data_weight, d => d.timestamp)])
    .range([margin.left, width - margin.right]);

  var zx = x.copy()

  var xAxis = (g, scale = x) => g
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(scale).ticks(width / 80).tickSizeOuter(0))

  var gx = svg.append("g")
    .call(xAxis, zx);

  // weight axis
  var y = d3.scaleLinear()
    .domain([d3.min(data_weight, d => d.weight) - 1, d3.max(data_weight, d => d.weight)])
    .range([height - margin.bottom, margin.top]);

  var yAxis = g => g
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y))

  svg.append("g")
    .call(yAxis);

  // meal axis
  var y2 = d3.scaleLinear()
    .domain([d3.min(data_meal, d => d.calories) - 100, d3.max(data_meal, d => d.calories)])
    .range([height - margin.bottom, margin.top]);

  var y2Axis = g => g
    .attr("transform", `translate(${width - margin.right},0)`)
    .call(d3.axisRight(y2))

  svg.append("g")
    .call(y2Axis);

  // Chart
  const line_weight = d3.line()
    .x(d => zx(d.timestamp))
    .y(d => y(d.weight));

  const line_meal = d3.line()
    .x(d => zx(d.timestamp))
    .y(d => y2(d.calories));


  path_weight = svg.append("path")
    .attr("fill", "None")
    .attr("stroke", "steelblue")
    .attr("stroke-width", 1.5)
    .attr("d", line_weight(data_weight))
    .call(reveal);

  path_meal = svg.append("path")
    .attr("fill", "none")
    .attr("stroke", "red")
    .attr("stroke-width", 1.5)
    .attr("d", line_meal(data_meal))
    .call(reveal);

  svg.append("text")
    .text('Weight')
    .attr("fill", "steelblue")
    .attr("text-anchor", "middle")
    .attr("transform", () => `translate(${margin.left},${margin.top - 10})`)
    .style("font-family", "sans-serif")
    .style("font-weight", "600");

  svg.append("text")
    .text('Calories')
    .attr("fill", "red")
    .attr("text-anchor", "middle")
    .attr("transform", () => `translate(${width - margin.right},${margin.top - 10})`)
    .style("font-family", "sans-serif")
    .style("font-weight", "600");



  form = d3.select("#container-data-weight")
    .select('form')
    .on('change', onchange)

  function onchange() {
    switch (form.property('radio').value) {
      case "month": domain = [d3.timeDay.offset(d3.max(data_weight, d => d.timestamp), -31), d3.max(data_weight, d => d.timestamp)]; break;
      case "all": domain = d3.extent(data_weight, d => d.timestamp); break;
      default: domain = [d3.timeDay.offset(d3.max(data_weight, d => d.timestamp), -7), d3.max(data_weight, d => d.timestamp)]; break;
    }
    console.log()

    t = svg.transition().duration(1000)
    zx.domain(domain);
    gx.transition(t).call(xAxis, zx);
    path_weight.transition(t).attr("d", line_weight(data_weight));
    path_meal.transition(t).attr("d", line_meal(data_meal));

  };

}


fetch("/api/weight").then(d => d.json()).then(weights => {
  fetch("/api/meal").then(d => d.json()).then(meals =>
    chartWeightMeal(weights, meals, 300, 170, margin));
});