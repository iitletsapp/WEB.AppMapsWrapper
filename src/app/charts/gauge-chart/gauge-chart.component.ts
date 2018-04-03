import { Component, OnInit, Input, OnChanges, AfterViewInit, ElementRef, Renderer2 } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import * as d3 from 'd3';
import * as _ from 'lodash';
import * as d3s from 'd3-scale-chromatic';

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

  constructor(private elRef: ElementRef, private renderer: Renderer2) { }

  public ngOnInit() { }

  public ngOnChanges() {
    if (this.containerId && this.isready) {
      setTimeout(() => {
        this.initChart();
      }, 300);
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
    const pi = Math.PI;
    const margin = { top: 20, right: 10, bottom: 10, left: 10 };
    const width = 1000 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;
    const fullwidth = width + margin.left + margin.right;
    const fullheight = height + margin.top + margin.bottom;
    const iR = 180;
    const oR = 150;

    // check what is the min and the max val of the passed dataset

    const quantizeForArc = d3.scaleLinear()
      .domain([this.extent[0] - this.minThreshold, this.extent[1]]) // make property binding
      .rangeRound([-120, 120]);

    // const sequentialScale = d3.scaleQuantize()
    //   .domain(<any>quantizeForArc.domain())
    //   .range(<any>['#ffbc66']);
    // .range(<any> [
    //   d3.rgb(d3.color('#41e0f2')),
    //   d3.rgb(d3.color('#2ee819')),
    //   d3.rgb(d3.color('#efec47')),
    //   d3.rgb(d3.color('#ffbc66')),
    //   d3.rgb(d3.color('#e0190b'))]);

    const colorinterpolation = d3.scaleSequential(d3s.interpolateRdYlGn);
    const valueQuantize = d3.scaleLinear()
    .domain(this.minMax)
    .range([0, 1]);

    const min = this.minMax[0];
    const max = this.minMax[1];
    // create a property binding
    if (this.classification) {
      const quantizeForUser = d3.scaleQuantize()
        .domain([-120, 120])
        .range(<any>this.classification);

      // tslint:disable-next-line:no-var-keyword
      var current = quantizeForUser(quantizeForArc(this.data));

    } else {
      // tslint:disable-next-line:prefer-const
      var current = this.data;

    }

    // Arc Defaults
    const arc = d3.arc().innerRadius(iR).outerRadius(oR).cornerRadius(20).startAngle(-120 * (pi / 180));

    // Place svg element
    const svg = d3.select(`#${this.containerId}`)
      .append('svg')
      .attr('width', fullwidth)
      .attr('height', fullheight)
      .attr('class', this.containerId)
      .call(responsivefy.bind(this))
      .append('g')
      .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');

    // ######## if we want to add a svg image #########
    // svg.append('svg:image')
    //   .attr('x', -40)
    //   .attr('y', 70)
    //   .attr('width', '90px')
    //   .attr('height', '90px')
    //   .attr('xlink:href', `${this.imgURL}`);
    // ######## if we want to add a svg image ########

    svg.append('path')
      .datum({ endAngle: 120 * (pi / 180) })
      .style('fill', '#ddd')
      .attr('stroke', 'grey')
      .attr('d', arc); // Append background arc to svg

    svg.append('path')
      .datum({ endAngle: quantizeForArc(this.data) * (pi / 180) })
      .attr('d', arc)
      .attr('stroke', '#2d2d2d')
      .transition()
      .duration(1000)
      .ease(d3.easeQuadInOut)
      .style('opacity', 1)
      .attr('stroke-width', .4)
      .style('fill', (d) => {
        return colorinterpolation(valueQuantize(this.data));
      });

    svg.append('text')
      .attr('transform', 'translate(' + 100 + ',' + 60 + ')') // Display Max value
      .attr('text-anchor', 'middle')
      .style('font-size', '40px')
      .style('fill', 'grey')
      .style('font-family', 'Open Sans')
      .text(max); // Set between inner and outer Radius

    // Display Min value
    svg.append('text')
      // tslint:disable-next-line:max-line-length
      .attr('transform', 'translate(' + -90 + ',' + 60 + ')') // Set between inner and outer Radius
      .attr('text-anchor', 'middle')
      .style('font-size', '40px')
      .style('fill', 'grey')
      .style('font-family', 'Open Sans')
      .text(min);

    // Display Current value
    svg.append('text')
      .attr('transform', 'translate(0,' + -(iR / 4) + ')') // Push up from center 1/4 of innerRadius
      .attr('text-anchor', 'middle')
      .style('font-size', '86px')
      .style('font-weight', '600')
      .text(current)
      .transition()
      .duration(1000)
      .ease(d3.easeBounceOut)
      .style('transform', 'scale(1.1)');

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
        .call(resize.bind(this));

      // to register multiple listeners for same event type,
      // you need to add namespace, i.e., 'click.foo'
      // necessary if you call invoke this function for multiple svgs
      // api docs: https://github.com/mbostock/d3/wiki/Selections#on
      d3.select(window).on('resize.' + container.attr('id'), resize);

      // get width of container and resize svg to fit it
      function resize() {
        // function is too fast for the dom to be ready with the width attribute
        const test = container.style('width');
        const targetWidth = (): number => {
          if (test !== 'auto') {
            return parseInt(test, 10);
          } else {
            // const parentContainerWidth = <Element>document.getElementsByClassName('gaugeClass')[0].offsetWidth;
            const parentContainerWidth = this.renderer.selectRootElement('.gaugeClass').offsetWidth;
            return <any>parentContainerWidth - margin.left - margin.right;
          }
        };
        const elWidth = targetWidth();
        svg.attr('width', elWidth);
        svg.attr('height', Math.round(elWidth / aspect));
      }
    }
  }
}
