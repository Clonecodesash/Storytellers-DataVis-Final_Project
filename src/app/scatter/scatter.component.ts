import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-scatter',
  templateUrl: './scatter.component.html',
  imports: [CommonModule],
  styleUrls: ['./scatter.component.css']
})
export class ScatterComponent implements AfterViewInit {
  @ViewChild('chart', { static: true }) chartContainer!: ElementRef;

  private width = window.innerWidth * 0.8;
  private height = window.innerHeight * 0.6;
  private margin = { top: 20, right: 30, bottom: 70, left: 70 };
  private selectedYear: number = 2023;
  private data: any[] = [];
  uniqueYears: number[] = [];

  ngAfterViewInit(): void {
    this.loadData();
    window.addEventListener('resize', () => this.resizeChart());
  }

  private loadData(): void {
    d3.csv('assets/data/scatter_plot/merged_scatterdata.csv').then((data: any) => {
      this.data = data.map((d: { Country: any; Year: string | number; GDP_PPS: string | number; Percentage: string | number; }) => ({
        Country: d.Country,
        Year: +d.Year,
        GDP_PPS: +d.GDP_PPS,
        Percentage: +d.Percentage
      })).filter((d: { GDP_PPS: number; Percentage: number; }) => !isNaN(d.GDP_PPS) && !isNaN(d.Percentage));

      this.uniqueYears = [...new Set(this.data.map(d => d.Year))].sort((a, b) => b - a);
      this.createScatterPlot();
    });
  }

  private createScatterPlot(): void {
    const container = this.chartContainer.nativeElement;
    d3.select(container).selectAll('*').remove();

    const filteredData = this.data.filter(d => d.Year === this.selectedYear);
    const svg = d3.select(container)
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height)
      .append('g')
      .attr('transform', `translate(${this.margin.left},${this.margin.top})`);

    const x = d3.scaleLinear()
      .domain([d3.min(filteredData, d => d.GDP_PPS)! * 0.9, d3.max(filteredData, d => d.GDP_PPS)! * 1.1])
      .range([0, this.width - this.margin.left - this.margin.right]);

    const y = d3.scaleLinear()
      .domain([d3.min(filteredData, d => d.Percentage)! * 0.9, d3.max(filteredData, d => d.Percentage)! * 1.05])
      .range([this.height - this.margin.top - this.margin.bottom, 0]);

    const colorScale = d3.scaleOrdinal(d3.schemeCategory10)
      .domain(filteredData.map(d => d.Country));

    svg.append('g')
      .attr('transform', `translate(0,${this.height - this.margin.top - this.margin.bottom})`)
      .call(d3.axisBottom(x));

    svg.append('g')
      .call(d3.axisLeft(y));

    // X Axis Label
    svg.append('text')
      .attr('text-anchor', 'middle')
      .attr('x', (this.width - this.margin.left - this.margin.right) / 2)
      .attr('y', this.height - this.margin.bottom + 30)
      .text('GDP per Capita in PPS (EU=100)');

    // Y Axis Label
    svg.append('text')
      .attr('text-anchor', 'middle')
      .attr('transform', 'rotate(-90)')
      .attr('x', -((this.height - this.margin.top - this.margin.bottom) / 2))
      .attr('y', -50)
      .text('Percentage (%)');

    // Tooltip
    const tooltip = d3.select(container)
      .append('div')
      .style('position', 'absolute')
      .style('background', 'white')
      .style('padding', '5px')
      .style('border', '1px solid black')
      .style('border-radius', '5px')
      .style('visibility', 'hidden');

    svg.selectAll('circle')
      .data(filteredData)
      .enter()
      .append('circle')
      .attr('cx', d => x(d.GDP_PPS))
      .attr('cy', d => y(d.Percentage))
      .attr('r', 5)
      .attr('fill', d => colorScale(d.Country))
      .on('mouseover', (event, d) => {
        tooltip.style('visibility', 'visible')
          .text(`${d.Country}: GDP ${d.GDP_PPS}, ${d.Percentage}%`)
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 10) + 'px');
        d3.select(event.target).attr('r', 7);
      })
      .on('mousemove', (event) => {
        tooltip.style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 10) + 'px');
      })
      .on('mouseout', (event) => {
        tooltip.style('visibility', 'hidden');
        d3.select(event.target).attr('r', 5);
      });
  }

  onYearChange(event: any): void {
    this.selectedYear = +event.target.value;
    this.createScatterPlot();
  }

  private resizeChart(): void {
    this.width = window.innerWidth * 0.8;
    this.height = window.innerHeight * 0.6;
    this.createScatterPlot();
  }
}
