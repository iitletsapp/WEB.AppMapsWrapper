import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import * as d3 from 'd3';

@Component({
    selector: 'app-barchart',
    templateUrl: 'barchart.component.html',
    styleUrls: ['./barchart.component.scss']
})

export class BarChartComponent implements OnInit, AfterViewInit {
    // data are all the values that are visible on the map view
     //@Input() public data;
    // containerId it the refers to the layerID that the histogram should read data from
    //@Input() public containerId;

    @Input() public data;
    @Input() public xText;
    @Input() public yText;
    @Input() public xAxisText;
    @Input() public yAxisText;
    // containerId it the refers to the layerID that the histogram should read data from
    @Input() public containerId;
    //@Input() public displayXAxisText;

    @Input() public xDataFormat: string;
    @Input() public yDataFormat: string;

    private isready = false;

    // example of the data structure:
    // public data = [
    //     { name: 'single 70k', value: 9934 },
    //     { name: 'single 100k', value: 15045 },
    //     { name: 'couple 150k', value: 21342 },
    //     { name: 'family 70k', value: 840 },
    //     { name: 'family 100k', value: 7340 },
    //     { name: 'elderly 70k', value: 7345 }];

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
        const margin = { top: 20, right: 40, bottom: 28, left: 40 };
        const width = 460 - margin.left - margin.right;
        const height = 265 - margin.top - margin.bottom;

        // set the ranges
        let x = d3.scaleBand()
            .range([0, width])
            .domain(this.data.map((d) => d[this.xText]))
            .padding(0.2);

        let y = d3.scaleLinear()
            .domain([0, d3.max(this.data, (d) => d[this.yText])])
            .range([height, 0]);

        let colorScale = d3.scaleOrdinal()
            .range(['#f19b2c', '#f0c330', '#3a99d8', '#239f85', '#e54d42', '#095682']);

        let svg = d3.select(`#${this.containerId}`)
            .append('svg')
            .attr('class', 'barchart' + this.containerId)
            .attr('width', width + margin.right + margin.left)
            .attr('height', height + margin.top + margin.bottom)
            .style('padding-top', '20px')
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
            .attr('x', (d) => { return x(d[this.xText]) ; })
            .attr('y', (d) => { return y(d[this.yText]); })
            .attr('width', x.bandwidth())
            .attr('height', function (d) { return height - y(d['value']); })
            .style('fill', (d, i) => {
                return colorScale(i);
            });

        rect.append('text')
            .attr('x', (d) => { return x(d[this.xText]) + 8; })
            .attr('y', (d) => { return y(d[this.yText]) - 10; })
            .style('font-size', 14)
            .style('fill', '#2d2d2d')
            .text((d) => d[this.yText]);

        // add the X gridlines bottomaxis NOT showing now!
        g.append('g')
        .attr('class', 'grid')
        .style('stroke', 'lightgrey')
        .style('stroke-opacity', 0.3)
        .style('display', 'none')
        .attr('transform', `translate(0, ${height})`);

        // add the Y gridlines leftaxis
        g.append('g')
            .attr('class', 'ygrid')
            .style('fill', 'none')
            .style('opacity', 0.8)
            .style('stroke', 'lightgrey')
            .style('stroke-opacity', 0.1)
            .style('height', `${height}`);

        console.log('' + this.xDataFormat + '');
        console.log('' + this.yDataFormat + '');

        // add the x Axis
        g.append('g')
            .attr('class', 'axis axis--x')
            .style('font-size', '8')
            .attr('transform', 'translate(0,' + height + ')')
            .call(d3.axisBottom(x).tickSizeOuter([0]).tickFormat(function (d) {
                //let num = d / 1000;
                return d ;
            }))
            .append('text')
                .attr('class', 'axis-title')
                .attr('dx', '200')
                .attr('dy', '36')
                .attr('transform', `translate(0, -10)`)
                .style('text-anchor', 'middle')
                .attr('fill', '#5D6971')
                .text(this.xAxisText);
            // labels are outside the chart
            d3.selectAll('.axis').select('path').style('display', 'none');
            d3.selectAll('.axis').selectAll('.tick').select('line').style('display', 'none');
            d3.select('.barcharttaxesbarchart').selectAll('.axis').selectAll('.tick').select('text').style('display', 'none');
            d3.select('.barcharttaxesbarchart').selectAll('.axis').select('.axis-title').style('display', 'none');

        // add the y Axis
        g.append('g')
            .attr('class', 'axis axis--y')
            .style('font-size', '8')
            .call(d3.axisLeft(y)
                .tickSizeOuter(0)
                .tickFormat(function (d) {
                    //let num = d / 1000;
                    return d ;
                }))
                .append('text')
                .attr('class', 'axis-title')
                .attr('dx', -120)
                .attr('dy', '-4.2em')
                .style('text-anchor', 'middle')
                .style('transform', 'rotate(-90deg)')
                .attr('fill', '#5D6971')
                .text(this.yAxisText);
        d3.selectAll('.axis').select('path').style('display', 'none');
        d3.selectAll('.axis').selectAll('.tick').select('line').style('display', 'none');

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
