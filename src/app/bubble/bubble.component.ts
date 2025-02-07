import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-bubble',
  templateUrl: './bubble.component.html',
  styleUrls: ['./bubble.component.css']
})
export class BubbleComponent implements AfterViewInit {

  @ViewChild('chart', { static: true }) chartContainer!: ElementRef;

  private width = window.innerWidth * 0.9;
  private height = window.innerHeight * 0.6;
  private margin = { top: 20, right: 30, bottom: 40, left: 60 };

  ngAfterViewInit(): void {
    this.createBubbleChart();
    window.addEventListener('resize', () => this.resizeChart());
  }

  private createBubbleChart(): void {
    const container = this.chartContainer.nativeElement;
    d3.select(container).selectAll('*').remove();

    const svg = d3.select(container)
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height)
      .append('g')
      .attr('transform', `translate(${this.margin.left},${this.margin.top})`);

    d3.csv('assets/bubble.csv').then((data: any) => {
      const x = d3.scaleLinear()
        .domain(d3.extent(data, (d: any) => +d.EducationRate) as [number, number] || [0, 100])
        .range([0, this.width - this.margin.left - this.margin.right]);

      const y = d3.scaleLinear()
        .domain(d3.extent(data, (d: any) => +d.EmploymentRate) as [number, number] || [0, 100])
        .range([this.height - this.margin.top - this.margin.bottom, 0]);

      const r = d3.scaleSqrt()
        .domain(d3.extent(data, (d: any) => +d.GDP) as [number, number] || [0, 100])
        .range([5, 40]);

      const color = d3.scaleOrdinal(d3.schemeCategory10);

      svg.append('g')
        .attr('transform', `translate(0,${this.height - this.margin.top - this.margin.bottom})`)
        .call(d3.axisBottom(x));

      svg.append('g')
        .call(d3.axisLeft(y));

      svg.selectAll('circle')
        .data(data)
        .enter()
        .append('circle')
        .attr('cx', (d: any) => x(+d.EducationRate))
        .attr('cy', (d: any) => y(+d.EmploymentRate))
        .attr('r', (d: any) => r(+d.GDP))
        .attr('fill', (d: any) => color(d.Country))
        .attr('opacity', 0.7)
        .on('mouseover', (event, d: any) => {
          d3.select(event.target).attr('opacity', 1);
        })
        .on('mouseout', (event) => {
          d3.select(event.target).attr('opacity', 0.7);
        });
    });
  }

  private resizeChart(): void {
    this.width = window.innerWidth * 0.9;
    this.height = window.innerHeight * 0.6;
    this.createBubbleChart();
  }

}
