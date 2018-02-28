import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';

@Component({
    selector: 'app-horizontalbarchart',
    templateUrl: 'horizontalbarchart.component.html',
    styleUrls: ['horizontalbarchart.component.scss']
})

export class HorizontalbarChartComponent implements OnInit {
    layer = 'horizontalbar';
    data = [{ name: '0-30', value: 29 }, { name: '31-50', value: 49 }, { name: '51-70', value: 12 }, { name: '71+', value: 10 }];

    constructor() { }

    public ngOnInit() {
        this.initChart();
    }
    public initChart() {
        // predefine the dimensions for the responsive function
        let margin = { top: 20, right: 20, bottom: 20, left: 20 };
        let width = 400 - margin.left - margin.right;
        let height = 300 - margin.top - margin.bottom;

        // create the chart by adding a svg with the dimensions defined above.
        // Resposivefy will make this chart responsive at any screen size
        let svg = d3.select(`#horizontalbar`)
            .append('svg')
            .attr('class', this.layer)
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .call(responsivefy);

        // we need to add a graphic element to make up for the missing space once the margins get higher than 0
        let g = svg.append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        let y = d3.scaleBand()
            .domain(this.data.map(d => d.name))
            .range([height, margin.top])
            .padding(0.1)

        let yAxis = g => g
            .attr("transform", `translate(${margin.left},0)`)
            .call(d3.axisLeft(y).tickSizeOuter(0))

        let x = d3.scaleLinear()
            .domain([0, d3.max(this.data, d => d.value)])
            .range([margin.left, width])

        let xAxis = g => g
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x).tickFormat((d)=> {return d + '%';}))
            .call(g => g.select(".domain").remove())
        

        g.append("g")
            .selectAll("rect").data(this.data).enter().append("rect")
            .attr("x", d => x(0))
            .attr("y", d => y(d.name))
            .attr("height", y.bandwidth()/2)
            .attr('transform', `translate(0, ${y.bandwidth()/4})`)
            .attr('fill', d => getHighestColor(d))
            .transition()
                .duration(0)
                .attr('width', 0)
                .duration(2500)
                .attr("width", d => x(d.value) - x(0));

        function getHighestColor(val){
            let highest = x.domain();
            if(val.value === highest[1]){
                return '#232855';
            }else {
                return '#5FCC9C';
            }
        }

        g.append("g")
            .call(xAxis);

        g.append("g")
            .call(yAxis);

        // ######## Functions #########
        function responsivefy(svg) {
            // get container + svg aspect ratio
            let container = d3.select(svg.node().parentNode);
            let width = parseInt(svg.style('width'), 10);
            let height = parseInt(svg.style('height'), 10);
            let aspect = width / height;

            // add viewBox and preserveAspectRatio properties,
            // and call resize so that svg resizes on inital page load
            svg.attr('viewBox', '0 0 ' + width + ' ' + height)
                .attr('preserveAspectRatio', 'xMinYMid')
                .call(resize);

            // to register multiple listeners for same event type,
            // you need to add namespace, i.e., 'click.foo'
            // necessary if you call invoke this function for multiple svgs
            // api docs: https://github.com/mbostock/d3/wiki/Selections#on
            d3.select(window).on('resize.' + container.attr('id'), resize);

            // get width of container and resize svg to fit it
            function resize() {
                let targetWidth = parseInt(container.style('width'));
                svg.attr('width', targetWidth);
                svg.attr('height', Math.round(targetWidth / aspect));
            }
        }
    }
}