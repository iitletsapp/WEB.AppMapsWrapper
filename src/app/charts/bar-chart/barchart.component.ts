import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import * as d3 from 'd3';

@Component({
    selector: 'app-barchart',
    templateUrl: 'barchart.component.html',
    styleUrls: ['./barchart.component.scss']
})

export class BarChartComponent implements OnInit, AfterViewInit {
    // data are all the values that are visible on the map view
     @Input() public data;
    // containerId it the refers to the layerID that the histogram should read data from
    @Input() public containerId;
    private isready = false;
    // example of the data structure:
    /* public data = [
        { name: 'single 70k', value: 9934 },
        { name: 'single 100k', value: 15045 },
        { name: 'couple 150k', value: 21342 },
        { name: 'family 70k', value: 840 },
        { name: 'family 100k', value: 7340 },
        { name: 'elderly 70k', value: 7345 }];*/

    public layer = 'barchart';

    constructor() {
    }


    public ngOnInit() {

    }

    public ngAfterViewInit() {
        this.isready = true;
        if (this.containerId) {
            this.initChart();
        }
    }

    public initChart() {

        // this is needed in case the this.val gets updated
         d3.select(`.${this.containerId}`).remove();

        const margin = { top: 30, right: 25, bottom: 20, left: 25 };
        const width = 460 - margin.left - margin.right;
        const height = 350 - margin.top - margin.bottom;

        // set the ranges
        let x = d3.scaleBand()
            .range([0, width])
            .domain(this.data.map((d) => d.name))
            .padding(0.2);

        let y = d3.scaleLinear()
            .domain([0, d3.max(this.data, (d) => d.value) + 1000])
            .range([height, 0]);

        let colorScale = d3.scaleOrdinal()
            .range(['#AAFFC7', '#5FCC9C', '#42c4d6', '#8e8d29', '#2b2789', '#79258c']);

        let svg = d3.select(`#${this.containerId}`)
            .append('svg')
            .attr('class', 'barchart')
            .attr('width', width + margin.right + margin.left)
            .attr('height', height + margin.top + margin.bottom)
            .call(responsivefy);

        let g = svg.append('g')
            .attr('transform', `translate(${margin.left}, ${margin.top})`);

        // append the rectangles for the bar chart
        let rect = g.selectAll('g')
            .data(this.data)
            .enter()
            .append('g');

        rect.append('rect')
            .attr('class', 'bar')
            .attr('x', (d) => { return x(d.name); })
            .attr('y', (d) => { return y(d.value); })
            .attr('width', x.bandwidth())
            .attr('height', function (d) { return height - y(d.value); })
            .style('fill', (d, i) => {
                return colorScale(i);
            });

        rect.append('text')
            .attr('x', (d) => { return x(d.name) + 8; })
            .attr('y', (d) => { return y(d.value) - 10; })
            .style('font-size', 14)
            .style('fill', '#2d2d2d')
            .text((d) => d.value);

        // add the x Axis
        g.append('g')
            .attr('transform', 'translate(0,' + height + ')')
            .call(d3.axisBottom(x));

        // add the y Axis
        g.append('g')
            .call(d3.axisLeft(y)
                .tickSizeOuter(0)
                .tickFormat(function (d) {
                    let num = d / 1000;
                    return Math.floor(num) + 'k';
                }));

        // tslint:disable-next-line:no-shadowed-variable
        function responsivefy(svg) {
            // get container + svg aspect ratio
            let container = d3.select(svg.node().parentNode);
            const width = parseInt(svg.style('width'), 10);
            const height = parseInt(svg.style('height'), 10);
            const aspect = width / height;

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
                const targetWidth = parseInt(container.style('width'));
                svg.attr('width', targetWidth);
                svg.attr('height', Math.round(targetWidth / aspect));
            }
        }
    }
}
