import { Component, OnInit, Input, OnChanges } from '@angular/core';
import * as d3 from 'd3';

@Component({
    selector: 'app-colorramp',
    templateUrl: 'colorramp.component.html',
    styleUrls: ['./colorramp.component.scss']
})

export class ColorRampChartComponent implements OnInit, OnChanges {
    // data are all the values that are visible on the map view
    // @Input() public data;
    // layer it the refers to the layerID that the histogram should read data from
    @Input() public layer;
    // public layer = 'ramp';
    public data = [1, 5];
    @Input() public val;

    constructor() {
    }

    public ngOnChanges(): void {
        if (this.val) {
            this.initChart();
        }
    }
    public ngOnInit() {
        // if (this.val) {
        //     this.initChart();
        // }
    }

    public initChart() {
        // this is needed in case the this.val gets updated
        d3.select(`.${this.layer}`).remove();

        let margin = { top: 30, right: 25, bottom: 20, left: 25 };
        let width = 400 - margin.left - margin.right;
        let height = 80 - margin.top - margin.bottom;

        let svg = d3.select(`#${this.layer}`)
            .append('svg')
            .attr('width', width + margin.right + margin.left)
            .attr('height', height + margin.top + margin.bottom)
            .attr('class', this.layer)
            .call(responsivefy);

        svg.append('svg:image')
            .attr('x', -3)
            .attr('y', 28)
            .attr('width', 28)
            .attr('height', 34)
            .attr('xlink:href', 'assets/img/icons/thumbsdown.svg');

        svg.append('svg:image')
            .attr('x', width+24)
            .attr('y', 29)
            .attr('width', 28)
            .attr('height', 34)
            .attr('xlink:href', 'assets/img/icons/thumbsup.svg');

        let x = d3.scaleLinear()
            .domain([d3.max(this.data), d3.min(this.data)])
            .range([0, width - margin.left])
            .clamp(true);
        // #TESTING
        // console.log("in ramp", this.val);

        let test = x(this.val);

        let g = svg.append('g')
            .attr('transform', `translate(${margin.left}, ${margin.top})`);

        let gradient = g.append('defs')
            .append('linearGradient')
            .attr('id', 'gradient')
            .attr('x1', '0%')
            .attr('y1', '0%')
            .attr('x2', '100%')
            .attr('y2', '0%')
            .attr('spreadMethod', 'pad');

        gradient.append('stop')
            .attr('offset', '0%')
            .attr('stop-color', 'rgb(65, 224, 242)')
            .attr('stop-opacity', 1);

        gradient.append('stop')
            .attr('offset', '25%')
            .attr('stop-color', 'rgb(46, 232, 25)')
            .attr('stop-opacity', 1);

        gradient.append('stop')
            .attr('offset', '50%')
            .attr('stop-color', 'rgb(239, 236, 71)')
            .attr('stop-opacity', 1);

        gradient.append('stop')
            .attr('offset', '75%')
            .attr('stop-color', 'rgb(255, 188, 102)')
            .attr('stop-opacity', 1);

        gradient.append('stop')
            .attr('offset', '100%')
            .attr('stop-color', 'rgb(224, 25, 11)')
            .attr('stop-opacity', 1);

        g.append('rect')
            .attr('width', width)
            .attr('height', height)
            .style('fill', 'url(#gradient)')
            .attr('rx', 5);

        let g2 = g.append('g')
            .attr('x', test)
            .attr('height', height + margin.bottom)
            .style('transform', `translate(${test}px, 0)`);

        g2.append('line')
            .attr('x1', '0')
            .attr('y1', '0')
            .attr('x2', '0')
            .attr('y2', height)
            .style('stroke', '#2d2d2d')
            .style('stroke-width', '2')
            .call(blink);

        g2.append('circle')
            .attr('cx', 0)
            .attr('cy', height + 5)
            .attr('r', 5)
            .style('fill', '#731abc')
            .style('opacity', 1)
            .style('stroke', '#2d2d2d')
            .style('stroke-width', '2');

        function blink() {
            d3.select('line')
                .transition()
                .duration(300)
                .style('opacity', 1)
                .transition()
                .duration(900)
                .style('opacity', 0.2)
                .on('end', blink);
        }
        // tslint:disable-next-line:no-shadowed-variable
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
