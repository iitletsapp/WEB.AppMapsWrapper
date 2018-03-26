import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import * as d3 from 'd3';
// import data from '../../../assets/data/mockuplinechart.json';

@Component({
    selector: 'app-linechart',
    templateUrl: 'linechart.component.html',
    styleUrls: ['./linechart.component.scss']
})

export class LineChartComponent implements OnInit, AfterViewInit {
    // data are all the values that are visible on the map view
    @Input() public data;
    @Input() public xText;
    @Input() public yText;
    // containerId it the refers to the layerID that the histogram should read data from
    @Input() public containerId;
    @Input() public yDataFormat: string;

    private isready = false;

    // public data = [
    //     { 'year': "2005", "value": 171900 },
    //     { "year": "2006", 'value': 171500 },
    //     { "year": "2007", "value": 170500 },
    //     { "year": "2008", 'value': 170400 },
    //     { "year": "2009", "value": 171000 },
    //     { "year": "2010", "value": 172400 },
    //     { "year": "2011", "value": 174100 },
    //     { "year": "2012", "value": 176700 },
    //     { "year": "2013", "value": 177100 },
    //     { "year": "2014", "value": 179200 },
    //     { "year": "2015", "value": 182300 }
    // ];

    constructor() {
    }

    public ngAfterViewInit() {
        this.isready = true;
        if (this.containerId && this.data) {
            this.initChart();
        }
    }
    public ngOnInit() {

    }

    public initChart() {
        d3.select(`.${this.containerId}`).remove();
        const margin = { top: 20, right: 40, bottom: 28, left: 40 };
        const width = 460 - margin.left - margin.right;
        const height = 265 - margin.top - margin.bottom;

        const svg = d3.select(`#${this.containerId}`)
            .append('svg')
            .attr('width', width + margin.right + margin.left)
            .attr('height', height + margin.top + margin.bottom)
            .attr('class', this.containerId)
            .call(responsivefy);

        let g = svg.append('g')
            .attr('transform', `translate(${margin.left}, ${margin.top})`);

        let y = d3.scaleLinear().range([height, 0]);
        //let x = d3.scaleLinear().range([0, width]);
        let x = d3.scaleTime().range([0, width]);

        let line = d3.line()
            .x(function (d) { return x(d.year); })
            .y(function (d) { return y(d.value); });

        // parse the date date values
        let parseTime = d3.timeParse('%Y');
        let bisectDate = d3.bisector(function (d) { return d.year; }).left;

        let data = this.data;

        data.forEach(function (d) {
            d.year = parseTime(d.year);
            // d.year = d.year;
            d.value = +d.value;
        });

        x.domain(d3.extent(data, (d) => d.year));
        y.domain([d3.min(data, (d) => { return d.value; }) / 1.005, d3.max(data, (d) => { return d.value; }) * 1.005]);
        
        // add the X gridlines bottomaxis NOT showing now!
        g.append('g')
            .attr('class', 'grid')
            .style('stroke', 'lightgrey')
            .style('stroke-opacity', 0.3)
            .style('display', 'none')
            .attr('transform', `translate(0, ${height})`)
            .call(make_x_gridlines(data.length)
                .tickSize(-height, 0, 0)
                .tickFormat('')
            );

        // add the Y gridlines leftaxis
        g.append('g')
            .attr('class', 'ygrid')
            .style('fill', 'none')
            .style('opacity', 0.8)
            .style('stroke', 'lightgrey')
            .style('stroke-opacity', 0.1)
            .style('height', `${height}`)
            .call(make_y_gridlines(data.length)
                .tickSize(-width, 0, 0)
                .tickFormat('')
            );
        d3.selectAll('.ygrid').select('path').style('stroke', 'transparent');

        // add x axis and append a label to it
        g.append('g')
            .attr('class', 'axis axis--x')
            .attr('transform', 'translate(0,' + height + ')')
            .style('font-size', '8')
            .call(d3.axisBottom(x))
            .append('text')
                .attr('class', 'axis-title')
                .attr('dx', '200')
                .attr('dy', '36')
                .attr('transform', `translate(0, -10)`)
                .style('text-anchor', 'middle')
                .attr('fill', '#5D6971')
                .text(this.yText);
        d3.selectAll('.axis').select('path').style('display', 'none');
        d3.selectAll('.axis').selectAll('.tick').select('line').style('display', 'none');

        // add a y axis and append a label to it
        g.append('g')
            .attr('class', 'axis axis--y')
            .style('font-size', '8')
            .call(d3.axisLeft(y)
                .ticks( data.length / 2)
                .tickSizeOuter(0)
                // .tickFormat(function (d) {
                //     return Math.floor(d) + 'k';
                // })
                .tickFormat(d => Math.floor(d) + this.yDataFormat )
            )
            .append('text')
            .attr('class', 'axis-title')
            .attr('dx', -120)
            .attr('dy', '-4.2em')
            .style('text-anchor', 'middle')
            .style('transform', 'rotate(-90deg)')
            .attr('fill', '#5D6971')
            .text(this.xText);
        d3.selectAll('.axis').select('path').style('display', 'none');
        d3.selectAll('.axis').selectAll('.tick').select('line').style('display', 'none');

        // append the lines based on the data provided
        g.append('path')
            .datum(data)
            .attr('class', 'line')
            .attr('d', line)
            .style('fill', 'none')
            .style('stroke-width', 1)
            .style('stroke', '#F19233 ');

        g.append('g').selectAll('circle')
            .data(data)
            .enter()
            .append('circle')
            .attr('r', 4)
            .attr('cx', (dd) => { return x(dd.year); })
            .attr('cy', (dd) => { return y(dd.value); })
            .attr('fill', 'white')
            .style('stroke-width', 1)
            .style('stroke', '#F19233');

        // call a function while hovering over the chart
        focus(data);

        function focus(data) {
            let focus = g.append('g')
                .attr('class', 'focusg')
                .style('display', 'none');

            focus.append('line')
                .attr('class', 'x-hover-line hover-line')
                .attr('y1', 0)
                .attr('y2', height);

            focus.append('line')
                .attr('class', 'y-hover-line hover-line')
                .attr('x1', width)
                .attr('x2', width);

            focus.append('circle')
                .attr('r', 4.5)
                .style('fill', 'none')
                .style('stroke', '#F19233')
                .style('stroke-width', 2);

            // indicator content
            focus.append('rect')
                .attr('width', 50)
                .attr('height', 20)
                .attr('x', -25)
                .attr('y', -30)
                .attr('rx', 0.9)
                .style('fill', '#485465')
                .style('opacity', 0.7);

            focus.append('circle')
                .attr('cx', '-0.8em')
                .attr('cy', '-1.18em')
                .attr('r', 2.5)
                .style('fill', '#F19233');

            focus.append('text')
                .attr('dx', '-0.81em')
                .attr('dy', '-1.45em')
                .style('font-size', '11px')
                .style('fill', '#FFFFFF');

            focus.append('polygon')
                .attr('class', 'arrow')
                .attr('points', '-5,-10 5,-10 0,-5')
                .style('fill', '#485465')
                .style('opacity', 0.7);

            svg.append('rect')
                .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
                .attr('class', 'overlay')
                .attr('width', width)
                .attr('height', height)
                .style('fill', 'none')
                .style('pointer-events', 'all')
                .on('mouseover', function () { focus.style('display', null); })
                .on('mouseout', function () { focus.style('display', 'none'); })
                .on('mousemove', mousemove);

            function mousemove() {
                let x0 = x.invert(d3.mouse(this)[0]);
                let i = bisectDate(data, x0, 1);
                let d0 = data[i - 1];
                let d1 = data[i];
                let d = x0 - d0.year > d1.year - x0 ? d1 : d0;
                focus.attr('transform', 'translate(' + x(d.year) + ',' + y(d.value) + ')');
                focus.select('text').text(() => `${d.value}k`);
                focus.select('circle')
                    .style('fill', getcolor(d.value))
                    .style('opacity', 0.8)
                    .transition()
                    .duration(300)
                    .style('transform', 'scale(1.5)')
                    .transition()
                    .duration(400)
                    .style('transform', 'scale(1)');

                focus.select('.x-hover-line')
                    .attr('y2', height - y(d.value))
                    .style('stroke', '#2d2d2d')
                    .style('stroke-width', 1);
                focus.select('.y-hover-line')
                    .attr('x2', width)
                    .style('stroke', '#6F257F')
                    .style('stroke-width', 1);

            }
            function getcolor(val) {
                let mean = d3.mean(data.map((el) => el.value));
                if (val <= mean) {
                    return 'rgb(255, 255, 255)';
                } else {
                    return 'rgb(224, 25, 11)';
                }
            }
        }

        function responsivefy(svg) {
            // get container + svg aspect ratio
            const container = d3.select(svg.node().parentNode);
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
        function make_x_gridlines(val) {
            return d3.axisBottom(x)
                .ticks(val);
        }
        function make_y_gridlines(val) {
            return d3.axisLeft(y)
                .ticks(val);
        }
    }
}
