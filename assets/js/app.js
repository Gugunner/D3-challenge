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

let dataset = [];
let povertyLabel;
let healthcareLabel;
let ageLabel;
let smokesLabel;
let householdLabel;
let obeseLabel;
let currentLabelX = "poverty";
let currentLabelY = "healthcare";




const createDynamicChartLabels = () => {

    povertyLabel = chart
        .append("text")
        .attr("id","poverty")
        .classed("label inactive",true)
        .attr("transform",`translate(${chartWidth/2-margin.left/5},${(chartHeight+margin.top/3)+margin.bottom/6})`)
        .text("Age Poverty (%)");

    healthcareLabel = chart
        .append("text")
        .attr("id","healthcare")
        .classed("label inactive",true)
        .attr("transform",`translate(${-margin.left/9},${chartHeight/2+margin.top*1.5}) rotate(-90)`)
        .text("Lacks Healthcare (%)");

    ageLabel =  chart
        .append("text")
        .attr("id","age")
        .classed("label inactive",true)
        .attr("transform",`translate(${chartWidth/2-margin.left/5},${(chartHeight+margin.top/2)+margin.bottom/3})`)
        .text("Age (Median)");

    smokesLabel = chart
        .append("text")
        .attr("id","smokes")
        .classed("label inactive",true)
        .attr("transform",`translate(${-margin.left/5},${chartHeight/2+margin.top*1.5}) rotate(-90)`)
        .text("Smokes (%)");

    householdLabel =  chart
        .append("text")
        .attr("id","income")
        .classed("label inactive",true)
        .attr("transform",`translate(${chartWidth/2-margin.left/5},${(chartHeight+margin.top)+margin.bottom/3})`)
        .text("Household Income (Median)");

    obeseLabel = chart
        .append("text")
        .attr("id","obesity")
        .classed("label inactive",true)
        .attr("transform",`translate(${-margin.left/3+margin.right/22},${chartHeight/2+margin.top*1.5}) rotate(-90)`)
        .text("Obese (%)");
};

const addActionsToLabels = () => {
    [povertyLabel, ageLabel, householdLabel].forEach(l => createLabelActions(l,"x"));
    [healthcareLabel, smokesLabel, obeseLabel].forEach(l => createLabelActions(l,"y"));
}

const createLabelActions = (label,axis) => {
    label.on("click",() => {
        if(axis === "x"){
            currentLabelX = label.property("id");
        } else {
            currentLabelY = label.property("id");
        }

        plotChart(dataset,currentLabelX, currentLabelY);
    });
};

const plotChart = (data,currentLabelX,currentLabelY) => {


    console.log(data);

    chart.html("");
    createDynamicChartLabels(dataset);
    addActionsToLabels();

    data.forEach(d => {
        d[currentLabelY] = +d[currentLabelY];
        d[currentLabelX] = +d[currentLabelX];
    });


    const xScale = d3
        .scaleLinear()
        .domain([d3.min(data, d => d[currentLabelX]), d3.max(data, d => d[currentLabelX])+2])
        .range([0,chartWidth])
        .nice();
    const yScale = d3
        .scaleLinear()
        .domain([d3.min(data, d => d[currentLabelY]), d3.max(data, d => d[currentLabelY])+2])
        .range([chartHeight,0])
        .nice();

    const bottomAxis = d3
        .axisBottom(xScale);

    const leftAxis = d3
        .axisLeft(yScale);

    chart
        .selectAll("circle")
        .data(data)
        .enter()
        .append("g")
        .classed("stateCircle",true)
        .append("circle")
        .attr("data-poverty", d => d[currentLabelX])
        .attr("data-healthcare", d => d[currentLabelY])
        .attr("cx", d => xScale(d[currentLabelX]))
        .attr("cy", d => yScale(d[currentLabelY]))
        .attr("r","12")
        .attr("fill","rgb(142,192,213)");

    chart
        .selectAll("g.stateCircle")
        .append("text")
        .classed("abbr",true)
        .attr("fill","#fff")
        .attr("text-anchor","middle")
        .attr("x", d => xScale(d[currentLabelX]))
        .attr("y",d => yScale(d[currentLabelY])+2)
        .attr("dy","0.2em")
        .text(d => d.abbr);

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
}


const init = async() => {
    dataset = await d3.csv(path).then(data => data);
    try{
        plotChart(dataset,currentLabelX,currentLabelY);
    } catch (e) {
        console.log(e);
    }
}

init();


