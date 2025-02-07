import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-stackedarea',
  templateUrl: './stackedarea.component.html',
  styleUrls: ['./stackedarea.component.css']
})
export class StackedareaComponent implements AfterViewInit {
  @ViewChild('chart', { static: true }) chartContainer!: ElementRef;

  private width = window.innerWidth * 0.9;
  private height = window.innerHeight * 0.6;
  private margin = { top: 20, right: 30, bottom: 40, left: 60 };

  ngAfterViewInit(): void {
    this.createStackedAreaChart();
    window.addEventListener('resize', () => this.resizeChart());
  }

  private createStackedAreaChart(): void {
    const container = this.chartContainer.nativeElement;
    d3.select(container).selectAll('*').remove();

    const svg = d3.select(container)
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height)
      .append('g')
      .attr('transform', `translate(${this.margin.left},${this.margin.top})`);

    d3.csv('assets/stackedarea.csv').then((data: any) => {
      const keys = ['Primary', 'Secondary', 'Tertiary'];
      const stack = d3.stack().keys(keys);
      const series = stack(data);

      const x = d3.scaleLinear()
        .domain(d3.extent(data, (d: any) => +d.Year) as [number, number])
        .range([0, this.width - this.margin.left - this.margin.right]);

      const y = d3.scaleLinear()
        .domain([0, d3.max(series[series.length - 1], (d: any) => d[1])!])
        .range([this.height - this.margin.top - this.margin.bottom, 0]);

      const color = d3.scaleOrdinal(d3.schemeCategory10);

      svg.append('g')
        .attr('transform', `translate(0,${this.height - this.margin.top - this.margin.bottom})`)
        .call(d3.axisBottom(x).tickFormat(d3.format('d')));

      svg.append('g')
        .call(d3.axisLeft(y));

      const area = d3.area()
        .x((d: any) => x(+d.data.Year))
        .y0((d: any) => y(d[0]))
        .y1((d: any) => y(d[1]));

      svg.selectAll('.layer')
        .data(series)
        .enter()
        .append('path')
        .attr('class', 'layer')
        .attr('d', area as any)
        .style('fill', (d, i) => color(i.toString()));
    });
  }

  private resizeChart(): void {
    this.width = window.innerWidth * 0.9;
    this.height = window.innerHeight * 0.6;
    this.createStackedAreaChart();
  }
}
