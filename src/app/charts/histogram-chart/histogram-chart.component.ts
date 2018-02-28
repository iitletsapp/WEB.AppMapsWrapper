import { Component, OnInit, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import * as d3 from 'd3';

@Component({
    selector: 'app-histogram-chart',
    templateUrl: './histogram-chart.component.html',
    styleUrls: ['./histogram-chart.component.scss']
})
export class HistogramChartComponent implements OnInit, OnChanges {
    // data are all the values that are visible on the map view
    @Input() public data;
    // layer it the refers to the layerID that the histogram should read data from
    @Input() public layer;

    constructor() {}
    public ngOnInit(): void {}

    public ngOnChanges(): void {
        if (this.data) {
            this.initChart();
        }
    }

    public initChart(): void {

        d3.select(`.${this.layer}`).remove();
        // get the min and max values inside of this data array
        let extent = d3.extent(this.data);
        // formating function so we only have have decimals
        let formatCount = d3.format('d');

        // predefine the dimensions for the responsive function
        let margin = { top: 20, right: 15, bottom: 20, left: 70 };
        let width = 500 - margin.left - margin.right;
        let height = 300 - margin.top - margin.bottom;

        // create the chart by adding a svg with the dimensions defined above.
        // Resposivefy will make this chart responsive at any screen size
        let svg = d3.select(`#${this.layer}`)
            .append('svg')
            .attr('class', this.layer)
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .call(responsivefy);

        // we need to add a graphic element to make up for the missing space once the margins get higher than 0
        let g = svg.append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        // create a scale with the min and max values of our data variable
        let x = d3.scaleLinear()
            .domain(extent)
            .rangeRound([0, width])
            .nice();

        // histgram object creates bins according to our data.
        // With ticks we define how granular (amount of bins) we want. This can vary depending on the dataset
        let bins = d3.histogram()
            .domain(<number> x.domain())
            .thresholds(x.ticks(44))
            (this.data);

        // create the y scale to define height of the bars
        let y = d3.scaleLinear()
            .domain(<any> [0, d3.max(bins, (d) => d.length)])
            .range([height, 0]);

        // quantize the data into color
        let colorScale = d3.scaleQuantize()
            .domain(extent)
            .range(<any> [
                d3.rgb(d3.color('#41e0f2')),
                d3.rgb(d3.color('#2ee819')),
                d3.rgb(d3.color('#efec47')),
                d3.rgb(d3.color('#ffbc66')),
                d3.rgb(d3.color('#e0190b'))]);

        // data joining. All available data must be mapped to svg elements so we can show everything.
        let bar = g.selectAll('.bar')
            .data(bins)
            .enter()
            .append('g')
            .attr('transform', function (d) { return 'translate(' + x(d.x0) + ',' + y(d.length) + ')'; });

        // now we are adding rectangle elements that will display the bars in the chart
        bar.append('rect')
            .attr('x', 0)
            // x0 is the lower bound of the bin and x1 is the upper bound
            .attr('width', x(bins[0].x1) - x(bins[0].x0) - 1)
            .attr('height', function (d) { return height - y(d.length); })
            .attr('fill', function (d) { return colorScale(d.x0); })
            .on('mouseover', function (d, i, el) { // d = data, i = index, el = elements
                d3.selectAll(<any> el)
                    .filter(':not(:hover)') // filter the the one element that is being hovered
                    .call(fade, 0.2);

                d3.select(this).style('stroke', 'black');
                d3.select((<any> this).nextSibling).style('display', 'block'); // nextSibling = text element.
                // d3.select(this.nextSibling).style("display", "block"); //nextSibling = text element.
            })
            .on('mouseout', function (d, i, el) {
                d3.selectAll(<any> el)
                    .call(fade, 1);
                d3.selectAll(<any> el).style('stroke', 'none');
                d3.selectAll('.histo-labels').style('display', 'none');
            });

        bar.append('text')
            .attr('class', 'histo-labels')
            .style('font-size', '10px')
            .style('color', 'grey')
            .style('display', 'none')
            .attr('dy', '.75em')
            .attr('y', -10)
            .attr('x', (x(bins[0].x1) - x(bins[0].x0)) / 2)
            .attr('text-anchor', 'middle')
            .text(function (d) { return `${formatCount(d.length)}`; });

        let xAxis = d3.axisBottom(x).tickValues([1, 5]);

        g.append('g')
            .attr('class', 'axis axis--x')
            .attr('transform', 'translate(0,' + height + ')')
            .call(xAxis);


        // ############## all functions here ##########################

        function fade(selection, value) {
            selection.style('fill-opacity', value);
        }

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
