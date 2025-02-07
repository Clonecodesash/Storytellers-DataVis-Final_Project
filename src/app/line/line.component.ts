import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-line',
  templateUrl: './line.component.html',
  styleUrls: ['./line.component.css']
})
export class LineComponent implements AfterViewInit {

  @ViewChild('chart', { static: true }) chartContainer!: ElementRef;
  
    private width = window.innerWidth * 0.9;
    private height = window.innerHeight * 0.6;
    private margin = { top: 20, right: 30, bottom: 40, left: 60 };
  
    ngAfterViewInit(): void {
      this.createLineChart();
      window.addEventListener('resize', () => this.resizeChart());
    }
  
    private createLineChart(): void {
      const container = this.chartContainer.nativeElement;
      d3.select(container).selectAll('*').remove();
  
      const svg = d3.select(container)
        .append('svg')
        .attr('width', this.width)
        .attr('height', this.height)
        .append('g')
        .attr('transform', `translate(${this.margin.left},${this.margin.top})`);
  
      d3.csv('assets/line.csv').then((data: any) => {
        const keys = ['Primary', 'Secondary', 'Tertiary'];
        const x = d3.scaleLinear()
          .domain(d3.extent(data, (d: any) => +d.Year) as [number, number])
          .range([0, this.width - this.margin.left - this.margin.right]);
  
        const y = d3.scaleLinear()
          .domain([0, d3.max(data, (d: any) => d3.max(keys, (key) => +d[key]))!])
          .range([this.height - this.margin.top - this.margin.bottom, 0]);
  
        const color = d3.scaleOrdinal(d3.schemeCategory10);
  
        svg.append('g')
          .attr('transform', `translate(0,${this.height - this.margin.top - this.margin.bottom})`)
          .call(d3.axisBottom(x).tickFormat(d3.format('d')));
  
        svg.append('g')
          .call(d3.axisLeft(y));
  
        keys.forEach((key) => {
          const line = d3.line()
            .x((d: any) => x(+d.Year))
            .y((d: any) => y(+d[key]))
            .curve(d3.curveMonotoneX);
  
          svg.append('path')
            .datum(data)
            .attr('fill', 'none')
            .attr('stroke', color(key)!)
            .attr('stroke-width', 2)
            .attr('d', line);
        });
      });
    }
  
    private resizeChart(): void {
      this.width = window.innerWidth * 0.9;
      this.height = window.innerHeight * 0.6;
      this.createLineChart();
    }

}
