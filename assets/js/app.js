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
        .classed(`label ${currentLabelX === "poverty" ? "active" : "inactive"} aText`,true)
        .attr("transform",`translate(${chartWidth/2-margin.left/5},${(chartHeight+margin.top/3)+margin.bottom/6})`)
        .text("Age Poverty (%)");

    healthcareLabel = chart
        .append("text")
        .attr("id","healthcare")
        .classed(`label ${currentLabelY === "healthcare" ? "active" : "inactive"} aText`,true)
        .attr("transform",`translate(${-margin.left/9},${chartHeight/2+margin.top*1.5}) rotate(-90)`)
        .text("Lacks Healthcare (%)");

    ageLabel =  chart
        .append("text")
        .attr("id","age")
        .classed(`label ${currentLabelX === "age" ? "active" : "inactive"} aText`,true)
        .attr("transform",`translate(${chartWidth/2-margin.left/5},${(chartHeight+margin.top/2)+margin.bottom/3})`)
        .text("Age (Median)");

    smokesLabel = chart
        .append("text")
        .attr("id","smokes")
        .classed(`label ${currentLabelY === "smokes" ? "active" : "inactive"} aText`,true)
        .attr("transform",`translate(${-margin.left/5},${chartHeight/2+margin.top*1.5}) rotate(-90)`)
        .text("Smokes (%)");

    householdLabel =  chart
        .append("text")
        .attr("id","income")
        .classed(`label ${currentLabelX === "income" ? "active" : "inactive"} aText`,true)
        .attr("transform",`translate(${chartWidth/2-margin.left/5},${(chartHeight+margin.top)+margin.bottom/3})`)
        .text("Household Income (Median)");

    obeseLabel = chart
        .append("text")
        .attr("id","obesity")
        .classed(`label ${currentLabelY === "obesity" ? "active" : "inactive"} aText`,true)
        .attr("transform",`translate(${-margin.left/3+margin.right/22},${chartHeight/2+margin.top*1.5}) rotate(-90)`)
        .text("Obese (%)");
};

const addActionsToLabels = () => {
    [povertyLabel, ageLabel, householdLabel].forEach(l => createLabelActions(l,"x"));
    [healthcareLabel, smokesLabel, obeseLabel].forEach(l => createLabelActions(l,"y"));
};

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
    console.log("Data", data);

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

    const tooltip = d3
        .tip()
        .attr("class","d3-tip")
        .offset([-4,0])
        .html(d => `<div>
                    <span><b>${d.state}</b></span>
                    <br>${currentLabelX.charAt(0).toUpperCase()+currentLabelX.slice(1)}: ${d[currentLabelX].toFixed(1)}${currentLabelX === "poverty" ? "%" : ""}
                    <br>${currentLabelY.charAt(0).toUpperCase()+currentLabelY.slice(1)}: ${d[currentLabelY].toFixed(1)}%
                </div>`);

    chart
        .selectAll("circle")
        .data(data)
        .enter()
        .append("g")
        .classed("stateG",true)
        .append("circle")
        .classed("stateCircle",true)
        .attr("data-x", d => d[currentLabelX])
        .attr("data-y", d => d[currentLabelY])
        .attr("cx", d => {
            if(d.lastXPos) {
                const newPos = d.lastXPos;
                d.lastXPos = xScale(d[currentLabelX]);
                return newPos;
            } else {
                d.lastXPos = xScale(d[currentLabelX]);
                return d.lastXPos
            }
        })
        .attr("cy", d => {
            if(d.lastYPos) {
                const newPos = d.lastYPos;
                d.lastYPos = yScale(d[currentLabelY]);
                return newPos;
            } else {
                d.lastYPos = yScale(d[currentLabelY]);
                return d.lastYPos
            }
        })
        .attr("r","12")
        .attr("fill","rgb(142,192,213)");


    chart
        .selectAll(".stateCircle")
        .transition()
        .duration(1000)
        .on("start", function() {
            d3
                .select(this)
                .attr("r", 12)
         })
        .delay(function(d, i) {
            return i / data.length * 300;
        })
        .attr("cx", d => xScale(d[currentLabelX]))
        .attr("cy", d => yScale(d[currentLabelY]))
        .on("end", function() {
            d3.select(this)
                .transition()
                .duration(500)
                .attr("r", 12);
        });

    chart
        .selectAll("g.stateG")
        .append("text")
        .classed("stateText",true)
        .attr("x", d => {
            if(d.lastXTextPos) {
                const newPos = d.lastXTextPos;
                d.lastXTextPos = xScale(d[currentLabelX]);
                return newPos;
            } else {
                d.lastXTextPos = xScale(d[currentLabelX]);
                return d.lastXTextPos
            }
        })
        .attr("y",d => {
            if(d.lastYTextPos) {
                const newPos = d.lastYTextPos;
                d.lastYTextPos = yScale(d[currentLabelY])+3.0;
                return newPos;
            } else {
                d.lastYTextPos = yScale(d[currentLabelY])+3.0;
                return d.lastYTextPos
            }
        })
        .attr("dy","0.2em")
        .attr("fill", "white")
        .text(d => d.abbr)
        .on("mouseover", tooltip.show)
        .on("mouseout",tooltip.hide);

    chart
        .selectAll(".stateText")
        .transition()
        .duration(1000)
        .on("start", function() {
            d3
                .select(this)
        })
        .delay(function(d, i) {
            return i / data.length * 300;
        })
        .attr("x", d => xScale(d[currentLabelX]))
        .attr("y", d => yScale(d[currentLabelY])+3)
        .on("end", function() {
            d3.select(this)
                .transition()
                .duration(500)
                .style("fill", "#fff");
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

    chart.call(tooltip);
};


const init = async() => {
    dataset = await d3.csv(path).then(data => data);
    try{
        plotChart(dataset,currentLabelX,currentLabelY);
    } catch (e) {
        console.log(e);
    }
};

init();


