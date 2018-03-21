import { Component, OnInit, Input, OnChanges, AfterViewInit } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import * as d3 from 'd3';
import * as _ from 'lodash';

@Component({
  selector: 'app-gauge-chart',
  templateUrl: './gauge-chart.component.html',
  styleUrls: ['./gauge-chart.component.scss']
})
export class GaugeChartComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() public data;
  @Input() public extent;
  @Input() public containerId: string;
  @Input() public classification: any[];
  @Input() public minMax: string[];
  @Input() public minThreshold: number;
  @Input() public imgURL;
  private isready = false;

  constructor() {}

  public ngOnInit() {}

  public ngOnChanges() {
    if (this.containerId && this.isready) {
      this.initChart();
    }
  }
  public ngAfterViewInit() {
    this.isready = true;
    this.initChart();
    // if (this.containerId && this.isready) {
    //   this.initChart();
    // }
  }

  public initChart() {
    // check if any chart is around
    d3.select(`.${this.containerId}`).remove();

    // Set Up
    let pi = Math.PI;
    let margin = { top: 20, right: 10, bottom: 10, left: 10 };
    let width = 1000 - margin.left - margin.right;
    let height = 400 - margin.top - margin.bottom;
    let fullwidth = width + margin.left + margin.right;
    let fullheight = height + margin.top + margin.bottom;
    let iR = 180;
    let oR = 150;

    // check what is the min and the max val of the passed dataset

    const quantizeForArc = d3.scaleLinear()
      .domain([this.extent[0] - this.minThreshold, this.extent[1]]) // make property binding
      .rangeRound([-120, 120]);

    const quantizeForUser = d3.scaleQuantize()
      .domain([-120, 120])
      .range(<any> this.classification); // create property binding

    const sequentialScale = d3.scaleQuantize()
      .domain(<any> quantizeForArc.domain())
      .range(<any> ['#ffbc66']);
      // .range(<any> [
      //   d3.rgb(d3.color('#41e0f2')),
      //   d3.rgb(d3.color('#2ee819')),
      //   d3.rgb(d3.color('#efec47')),
      //   d3.rgb(d3.color('#ffbc66')),
      //   d3.rgb(d3.color('#e0190b'))]);
    // .interpolator(d3.interpolateCool);

    // ####################### for testing!
    // console.log("in gauge data", this.data);
    // console.log("in gauge extent", this.extent);
    // console.log("in gauge arc number", quantizeForArc(this.data));

    let min = this.minMax[0];
    let max = this.minMax[1];
    // create a property binding
    let current = quantizeForUser(quantizeForArc(this.data));

    // Arc Defaults
    let arc = d3.arc().innerRadius(iR).outerRadius(oR).cornerRadius(20).startAngle(-120 * (pi / 180));

    // Place svg element
    let svg = d3.select(`#${this.containerId}`)
      .append('svg')
      .attr('width', fullwidth)
      .attr('height', fullheight)
      .attr('class', this.containerId)
      .call(responsivefy)
      .append('g')
        .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');

      svg.append('svg:image')
        .attr('x', -40)
        .attr('y', 70)
        .attr('width', '90px')
        .attr('height', '90px')
        .attr('xlink:href', `${this.imgURL}`);


    let background = svg.append('path')
      .datum({ endAngle: 120 * (pi / 180) })
      .style('fill', '#ddd')
      .attr('stroke', 'grey')
      .attr('d', arc); // Append background arc to svg

    let foreground = svg.append('path')
      .datum({ endAngle: quantizeForArc(this.data) * (pi / 180) })
      .attr('d', arc)
      .attr('stroke', '#2d2d2d')
      .transition()
        .duration(1000)
        .ease(d3.easeQuadInOut)
        .style('opacity', 1)
        .attr('stroke-width', .4)
        .style('fill', (d) => sequentialScale(this.data));

    let maxtext = svg.append('text')
      .attr('transform', 'translate(' + (iR + ((oR - iR) / 2)) + ',' + height / 2 + ')') // Display Max value
      .attr('text-anchor', 'middle')
      .style('font-size', '30')
      .style('font-family', 'Open Sans')
      .text(max); // Set between inner and outer Radius

    // Display Min value
    let minText = svg.append('text')
      .attr('transform', 'translate(' + -(iR + ((oR - iR) / 2)) + ',' + height / 2 + ')') // Set between inner and outer Radius
      .attr('text-anchor', 'middle')
      .style('font-size', '30')
      .style('font-family', 'Open Sans')
      .text(min);

    // Display Current value
    let currentText = svg.append('text')
      .attr('transform', 'translate(0,' + -(iR / 4) + ')') // Push up from center 1/4 of innerRadius
      .attr('text-anchor', 'middle')
      .style('font-size', '66px')
      .style('font-weight', '600')
      .text(current)
      .transition()
        .duration(1000)
        .ease(d3.easeBounceOut)
        .style('transform', 'scale(1.1)');

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
      function resize(selector) {
          // function is too fast for the dom to be ready with the width attribute
          let targetWidth = parseInt(container.style('width'), 10);
          svg.attr('width', targetWidth);
          svg.attr('height', Math.round(targetWidth / aspect));
      }
    }
  }
}
