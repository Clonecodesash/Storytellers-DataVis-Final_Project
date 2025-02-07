import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-stackedbar',
  templateUrl: './stackedbar.component.html',
  styleUrls: ['./stackedbar.component.css']
})
export class StackedbarComponent implements AfterViewInit {
  @ViewChild('chart', { static: true }) chartContainer!: ElementRef;

  private width = window.innerWidth * 0.9;
  private height = window.innerHeight * 0.6;
  private margin = { top: 20, right: 30, bottom: 40, left: 60 };

  ngAfterViewInit(): void {
    this.createStackedBarChart();
    window.addEventListener('resize', () => this.resizeChart());
  }

  private createStackedBarChart(): void {
    const container = this.chartContainer.nativeElement;
    d3.select(container).selectAll('*').remove();

    const svg = d3.select(container)
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height)
      .append('g')
      .attr('transform', `translate(${this.margin.left},${this.margin.top})`);

    d3.csv('assets/stackedbar.csv').then((data: any) => {
      const keys = ['Primary', 'Secondary', 'Tertiary'];
      const stack = d3.stack().keys(keys);
      const series = stack(data);

      const x = d3.scaleBand()
        .domain(data.map((d: any) => d.Region))
        .range([0, this.width - this.margin.left - this.margin.right])
        .padding(0.2);

      const y = d3.scaleLinear()
        .domain([0, d3.max(series[series.length - 1], (d: any) => d[1])!])
        .nice()
        .range([this.height - this.margin.top - this.margin.bottom, 0]);

      const color = d3.scaleOrdinal(d3.schemeCategory10);

      svg.append('g')
        .attr('transform', `translate(0,${this.height - this.margin.top - this.margin.bottom})`)
        .call(d3.axisBottom(x));

      svg.append('g')
        .call(d3.axisLeft(y));

      svg.selectAll('.layer')
        .data(series)
        .enter()
        .append('g')
        .attr('fill', (d, i) => color(i.toString()))
        .selectAll('rect')
        .data(d => d)
        .enter()
        .append('rect')
        .attr('x', d => x(d.data['Region'] as unknown as string)!)
        .attr('y', d => y(d[1]))
        .attr('height', d => y(d[0]) - y(d[1]))
        .attr('width', x.bandwidth())
        .on('mouseover', (event, d) => {
          d3.select(event.target).attr('opacity', 0.7);
        })
        .on('mouseout', (event) => {
          d3.select(event.target).attr('opacity', 1);
        });
    });
  }

  private resizeChart(): void {
    this.width = window.innerWidth * 0.9;
    this.height = window.innerHeight * 0.6;
    this.createStackedBarChart();
  }
}
