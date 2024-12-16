// Hint: This is a great place to declare your global variables
let female_data, male_data;
let previousFemaleData = [];
let previousMaleData = [];

// This function is called once the HTML page is fully loaded by the browser
document.addEventListener('DOMContentLoaded', function () {
    // Hint: create or set your svg element inside this function
    //step 1
    const svg = d3.select("#myDataVis")
        .append("svg")
        .attr("width", 1000)
        .attr("height", 600);

    // Load CSV files
    Promise.all([d3.csv('data/females_data.csv'), d3.csv('data/males_data.csv')])
        .then(function (values) {
            female_data = values[0];
            male_data = values[1];

            // Hint: This is a good spot for data wrangling
            //step 3
            const allCountries = Object.keys(female_data[0]).filter(key => key !== 'Year');
            
            female_data.forEach(function (d) {
                //date to object
                d.Year = new Date(+d.Year, 0, 1); 
                allCountries.forEach(country => {
                    //employment rate to number
                    d[country] = +d[country]; }); });

            male_data.forEach(function (d) {
                d.Year = new Date(+d.Year, 0, 1); 
                allCountries.forEach(country => {
                    d[country] = +d[country];  });
            });

            drawLolliPopChart();
        })

    // Event listener for country selection
    document.getElementById('countrySelect').addEventListener('change', function () {
        drawLolliPopChart(); });
});

// Use this function to draw the lollipop chart.
function drawLolliPopChart() {
    // console.log('trace:drawLolliPopChart()');

    const selectedCountry = document.getElementById('countrySelect').value;

    const femaleCountryData = female_data.map(d => ({
        Year: d.Year,
        EmploymentRate: d[selectedCountry] }));
    const maleCountryData = male_data.map(d => ({
        Year: d.Year,
        EmploymentRate: d[selectedCountry]}));
    //step 7
    const svg = d3.select("#myDataVis svg");
    if (svg.empty()) {
        const svgWidth = 1000;
        const svgHeight = 600;
        svg = d3.select("#myDataVis")
            .append("svg")
            .attr("width", svgWidth)
            .attr("height", svgHeight); }

    const margin = { top: 60, right: 60, bottom: 50, left: 70 };
    const width = +svg.attr("width") - margin.left - margin.right;
    const height = +svg.attr("height") - margin.top - margin.bottom;

    const g = svg.selectAll("g.chart-group").data([0]);
    const gEnter = g.enter().append("g").attr("class", "chart-group")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);
    const gUpdate = gEnter.merge(g);
    // step 4 and 5
    const minYear = new Date(1990, 0, 1);
    const maxYear = d3.max(femaleCountryData, d => d.Year);
    const extendedMaxYear = new Date(maxYear.getFullYear() + 1, 0, 1); // add an extra year
   
    const xScale = d3.scaleTime()
        .domain([minYear, extendedMaxYear])
        .range([0, width]);

    const maxRate = d3.max([femaleCountryData, maleCountryData], d => d3.max(d, e => e.EmploymentRate));
    const yScale = d3.scaleLinear()
        .domain([0, maxRate])
        .range([height, 0]);


    const xAxis = gUpdate.selectAll(".x-axis").data([0]);
    xAxis.enter()
        .append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0, ${height})`)
        .merge(xAxis)
        .transition()
        .duration(1000)
        .style("font-size", "15px")
        .call(d3.axisBottom(xScale)
            .tickFormat(d3.timeFormat("%Y"))
            .tickValues(d3.timeYears(minYear, maxYear, 5)));  //5 years gap
    
    // transition x-axis
    xAxis.transition()
        .duration(1000)
        .call(d3.axisBottom(xScale));  

    const yAxis = gUpdate.selectAll(".y-axis").data([0]);
    yAxis.enter()
        .append("g")
        .attr("class", "y-axis")
        .merge(yAxis)
        .transition()
        .duration(1000)
        .style("font-size", "15px")
        .call(d3.axisLeft(yScale));
    
    // transition y-axis
    yAxis.transition()
        .duration(1000)
        .call(d3.axisLeft(yScale));  

    gUpdate.selectAll("text.x-label").remove();
    gUpdate.selectAll("text.y-label").remove();

    gUpdate.append("text")
        .attr("class", "x-label")
        .attr("x", width / 2)
        .attr("y", height + margin.bottom - 10)
        .attr("text-anchor", "middle")
        .text("Year")
        .style("font-size", "20px");

    gUpdate.append("text")
        .attr("class", "y-label")
        .attr("x", -height / 2)
        .attr("y", -margin.left + 20)
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .text("Employment Rate")
        .style("font-size", "20px");

    const genderOffset = 2.5; 


    ['Female', 'Male'].forEach(gender => {
        const data = gender === 'Female' ? femaleCountryData : maleCountryData;
        const offset = gender === 'Female' ? -genderOffset - 1 : genderOffset + 1;

        const lollipops = gUpdate.selectAll(`.lollipop-${gender}`)
            .data(data, d => d.Year);

        //lollipops with transitions 
        //step 8
        lollipops.enter()
            .append("line")
            .attr("class", `lollipop-${gender} lollipop`)
            .attr("x1", d => xScale(d.Year) + offset)
            .attr("x2", d => xScale(d.Year) + offset)
            .attr("y1", d => yScale(0)) 
            .attr("y2", d => yScale(d.EmploymentRate))
            .attr("stroke", gender === 'Female' ? "red" : "green")
            .merge(lollipops)
            .transition()
            .duration(1000)
            .attr("x1", d => xScale(d.Year) + offset)
            .attr("x2", d => xScale(d.Year) + offset)
            .attr("y1", d => yScale(0))
            .attr("y2", d => yScale(d.EmploymentRate));
        lollipops.exit().remove();

        
        const circles = gUpdate.selectAll(`.circle-${gender}`)
            .data(data, d => d.Year);

        circles.enter()
            .append("circle")
            .attr("class", `circle-${gender} circle`)
            .attr("cx", d => xScale(d.Year) + offset)
            .attr("cy", d => yScale(d.EmploymentRate))
            .attr("r", 5)
            .attr("fill", gender === 'Female' ? "red" : "green")
            .merge(circles)
            .transition()
            .duration(1000)
            .attr("cx", d => xScale(d.Year) + offset)
            .attr("cy", d => yScale(d.EmploymentRate))
            .attr("r", 5);

        circles.exit().remove();
    });

    previousFemaleData = femaleCountryData;
    previousMaleData = maleCountryData;
    //legends
    //step 6
    const legend = svg.selectAll(".legend").data([0]);
    const legendEnter = legend.enter()
        .append("g")
        .attr("class", "legend")
        .attr("transform", `translate(${width-100}, ${margin.top-25})`);
    legendEnter.append("rect")
        .attr("x", 10)
        .attr("y", 7)
        .attr("width", 10)
        .attr("height", 10)
        .attr("fill", "red");
    legendEnter.append("text")
        .attr("x", 25)
        .attr("y", 15)
        .text("Female Employment Rate")
        .style("font-size", "15px");

    legendEnter.append("rect")
        .attr("x", 10)
        .attr("y", 30)
        .attr("width", 10)
        .attr("height", 10)
        .attr("fill", "green");
    legendEnter.append("text")
        .attr("x", 25)
        .attr("y", 40)
        .text("Male Employment Rate")
        .style("font-size", "15px");
        legend.merge(legendEnter); }

