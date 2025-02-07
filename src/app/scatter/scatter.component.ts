import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-scatter',
  templateUrl: './scatter.component.html',
  styleUrls: ['./scatter.component.css']
})
export class ScatterComponent implements AfterViewInit {
  @ViewChild('chart', { static: true }) chartContainer!: ElementRef;

  private width = window.innerWidth * 0.9;
  private height = window.innerHeight * 0.6;
  private margin = { top: 20, right: 30, bottom: 40, left: 60 };

  ngAfterViewInit(): void {
    this.createScatterPlot();
    window.addEventListener('resize', () => this.resizeChart());
  }

  private createScatterPlot(): void {
    const container = this.chartContainer.nativeElement;
    d3.select(container).selectAll('*').remove();

    const svg = d3.select(container)
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height)
      .append('g')
      .attr('transform', `translate(${this.margin.left},${this.margin.top})`);

    d3.csv('assets/scatter.csv').then((data: any) => {
      const x = d3.scaleLinear()
        .domain([d3.min(data, (d: any) => +d.EducationRate)!, d3.max(data, (d: any) => +d.EducationRate)!])
        .range([0, this.width - this.margin.left - this.margin.right]);

      const y = d3.scaleLinear()
        .domain([d3.min(data, (d: any) => +d.GDPperCapita)!, d3.max(data, (d: any) => +d.GDPperCapita)!])
        .range([this.height - this.margin.top - this.margin.bottom, 0]);

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
        .attr('cy', (d: any) => y(+d.GDPperCapita))
        .attr('r', 5)
        .attr('fill', 'steelblue')
        .on('mouseover', (event, d: any) => {
          d3.select(event.target).attr('fill', 'darkblue');
        })
        .on('mouseout', (event) => {
          d3.select(event.target).attr('fill', 'steelblue');
        });
    });
  }

  private resizeChart(): void {
    this.width = window.innerWidth * 0.9;
    this.height = window.innerHeight * 0.6;
    this.createScatterPlot();
  }
}
