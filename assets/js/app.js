// @TODO: YOUR CODE HERE!
const path = "assets/data/data.csv";
const svgHeight = 720;
const svgWidth = 1200;

const margin = {
    left: svgWidth/4,
    top: 60,
    right: svgWidth/4,
    bottom: 120
};

const chartWidth = svgWidth - margin.left - margin.right;
const chartHeight = svgHeight - margin.top - margin.bottom;

const svg = d3
    .select("body")
    .append("svg")
    .attr("height",svgHeight)
    .attr("width",svgWidth);
const chart = svg
    .append("g")
    .attr("transform",`translate(${margin.left},${margin.top})`);


const plotChart = (data) => {

    console.log(data);

    data.forEach(d => {
        d.healthcare = +d.healthcare;
        d.poverty = +d.poverty;
    });


    const xScale = d3
        .scaleLinear()
        .domain([d3.min(data, d => d.poverty), d3.max(data, d => d.poverty)+2])
        .range([0,chartWidth])
        .nice();
    const yScale = d3
        .scaleLinear()
        .domain([d3.min(data, d => d.healthcare), d3.max(data, d => d.healthcare)+2])
        .range([chartHeight,0])
        .nice();

    const bottomAxis = d3
        .axisBottom(xScale);

    const leftAxis = d3
        .axisLeft(yScale);

    const circles =  chart
        .selectAll("circles")
        .data(data)
        .enter()
        .append("circle")
        .attr("data-poverty", d => d.poverty)
        .attr("data-healthcare", d => d.healthcare)
        .attr("cx", d => xScale(d.poverty))
        .attr("cy", d => yScale(d.healthcare))
        .attr("r","12")
        .attr("fill","rgb(142,192,213)");

    const texts = chart
        .selectAll("text")
        .data(data)
        .enter()
        .append("text")
        .attr("fill","#fff")
        .attr("text-anchor","middle")
        .attr("x", d => xScale(d.poverty))
        .attr("y",d => yScale(d.healthcare)+2)
        .attr("dy","0.2em")
        .text(d => {
            console.log("Abbr", d.abbr);
            return  d.abbr
        });

    chart
        .append("g")
        .attr("id","x-axis")
        .attr("transform",`translate(0,${chartHeight})`)
        .call(bottomAxis);

    chart
        .append("g")
        .attr("id","y-axis")
        .attr("transform",`translate(0,0)`)
        .call(leftAxis);

    d3
        .select("#x-axis")
        .select(".tick")
        .remove();

    d3
        .select("#y-axis")
        .select(".tick")
        .remove();

    d3
        .select("#y-axis")
        .selectAll(".tick:last-child")
        .remove();

    chart
        .append("text")
        .attr("transform",`translate(${chartWidth/2-margin.left/5},${chartHeight+margin.bottom/3})`)
        .attr("stroke","black")
        .attr("stroke-width","1px")
        .attr("font-size","1.3em")
        .text("In Poverty (%)");

    chart
        .append("text")
        .attr("transform",`translate(${-margin.left/9},${chartHeight/2+margin.top*1.5}) rotate(-90)`)
        .attr("stroke","black")
        .attr("stroke-width","1px")
        .attr("font-size","1.3em")
        .text("Lacks Healthcare (%)");
}

let dataset = []
const init = async() => {
    dataset = await d3.csv(path).then(data => data);
    plotChart(dataset);
}

init();


