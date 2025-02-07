import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-pie',
  templateUrl: './pie.component.html',
  styleUrls: ['./pie.component.css']
})
export class PieComponent implements AfterViewInit {

  @ViewChild('chart', { static: true }) chartContainer!: ElementRef;

  private width = window.innerWidth * 0.9;
  private height = window.innerHeight * 0.6;
  private radius = Math.min(this.width, this.height) / 2 - 10;

  ngAfterViewInit(): void {
    this.createPieChart();
    window.addEventListener('resize', () => this.resizeChart());
  }

  private createPieChart(): void {
    const container = this.chartContainer.nativeElement;
    d3.select(container).selectAll('*').remove();

    const svg = d3.select(container)
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height)
      .append('g')
      .attr('transform', `translate(${this.width / 2},${this.height / 2})`);

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    d3.csv('assets/pie.csv').then((data: any) => {
      const pie = d3.pie<any>().value((d: any) => +d.Value);
      const arc = d3.arc<any>().innerRadius(0).outerRadius(this.radius);

      svg.selectAll('path')
        .data(pie(data))
        .enter()
        .append('path')
        .attr('d', arc)
        .attr('fill', (d: any, i: number) => color(i.toString()))
        .attr('stroke', 'white')
        .attr('stroke-width', '2px')
        .on('mouseover', (event, d: any) => {
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
    this.radius = Math.min(this.width, this.height) / 2 - 10;
    this.createPieChart();
  }
}
