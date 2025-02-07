import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-bar',
  templateUrl: './bar.component.html',
  styleUrls: ['./bar.component.css']
})
export class BarComponent implements AfterViewInit {

@ViewChild('chart', { static: true }) chartContainer!: ElementRef;

  private width = window.innerWidth * 0.9;
  private height = window.innerHeight * 0.6;
  private margin = { top: 20, right: 30, bottom: 40, left: 60 };

  ngAfterViewInit(): void {
    this.createBarChart();
    window.addEventListener('resize', () => this.resizeChart());
  }

  private createBarChart(): void {
    const container = this.chartContainer.nativeElement;
    d3.select(container).selectAll('*').remove();

    const svg = d3.select(container)
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height)
      .append('g')
      .attr('transform', `translate(${this.margin.left},${this.margin.top})`);

    d3.csv('assets/bar.csv').then((data: any) => {
      const x = d3.scaleBand()
        .domain(data.map((d: any) => d.Country))
        .range([0, this.width - this.margin.left - this.margin.right])
        .padding(0.2);

      const y = d3.scaleLinear()
        .domain([0, d3.max(data, (d: any) => +d.Tertiary)!])
        .nice()
        .range([this.height - this.margin.top - this.margin.bottom, 0]);

      svg.append('g')
        .selectAll('rect')
        .data(data)
        .enter()
        .append('rect')
        .attr('x', (d: any) => x(d.Country)!)
        .attr('y', (d: any) => y(+d.Tertiary))
        .attr('height', (d: any) => this.height - this.margin.top - this.margin.bottom - y(+d.Tertiary))
        .attr('width', x.bandwidth())
        .attr('fill', 'steelblue')
        .on('mouseover', (event, d: any) => {
          d3.select(event.target).attr('fill', 'darkblue');
        })
        .on('mouseout', (event) => {
          d3.select(event.target).attr('fill', 'steelblue');
        });

      svg.append('g')
        .attr('transform', `translate(0,${this.height - this.margin.top - this.margin.bottom})`)
        .call(d3.axisBottom(x));

      svg.append('g')
        .call(d3.axisLeft(y));
    });
  }

  private resizeChart(): void {
    this.width = window.innerWidth * 0.9;
    this.height = window.innerHeight * 0.6;
    this.createBarChart();
  }

}
