import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-stackedbar',
  templateUrl: './stackedbar.component.html',
  imports: [CommonModule],
  styleUrls: ['./stackedbar.component.css']
})
export class StackedbarComponent implements AfterViewInit {
  @ViewChild('chart', { static: true }) chartContainer!: ElementRef;

  private width = window.innerWidth * 0.9;
  private height = window.innerHeight * 0.9;
  private margin = { top: 40, right: 150, bottom: 50, left: 100 };
  private svg!: any;
  private color = d3.scaleOrdinal(d3.schemeCategory10);
  private selectedYear = 2023;
  years = [2017, 2018, 2019, 2020, 2021, 2022, 2023];
  private data: any[] = [];

  ngAfterViewInit(): void {
    this.createChart();
    window.addEventListener('resize', () => this.resizeChart());
  }

  private createChart(): void {
    const container = this.chartContainer.nativeElement;
    d3.select(container).selectAll('*').remove();

    this.svg = d3.select(container)
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height)
      .append('g')
      .attr('transform', `translate(${this.margin.left},${this.margin.top})`);

    d3.csv('assets/data/stacked_bar_chart/final_combined_stacked_bar_data_cleaned.csv').then((data) => {
      this.data = data;
      this.updateChart();
    });
  }

  private updateChart(): void {
    if (!this.data.length) return;

    let filteredData = this.data.filter(d => +d.Year === this.selectedYear);

    let nestedData = d3.group(filteredData, d => d.Country);

    let levels = ['Level 0-2', 'Level 3-4', 'Level 5-8'];

    let series = Array.from(nestedData, ([key, values]) => {
      let obj: { [key: string]: number | string } = { Country: key };
      levels.forEach(level => {
        const entry = values.find(d => d['Educational Level'] === level);
        obj[level] = entry ? +entry['Income'] || 0 : 0;
      });
      return obj;
    });

    let y = d3.scaleBand()
      .domain(series.map(d => d['Country'] as string))
      .range([0, this.height - this.margin.top - this.margin.bottom])
      .padding(0.2);

    let x = d3.scaleLinear()
      .domain([0, d3.max(series, d => {
        return levels.reduce((sum, level) => sum + (d[level] as number), 0);
      }) as number])
      .range([0, this.width - this.margin.left - this.margin.right]);

    this.svg.selectAll('*').remove();

    this.svg.append('g')
      .attr('transform', `translate(0,${this.height - this.margin.top - this.margin.bottom})`)
      .call(d3.axisBottom(x).ticks(5).tickFormat(d3.format('~s')));

    this.svg.append('g')
      .call(d3.axisLeft(y));

    this.svg.append('text')
      .attr('text-anchor', 'middle')
      .attr('x', (this.width - this.margin.left - this.margin.right) / 2)
      .attr('y', this.height - this.margin.bottom / 2)
      .text('Income')
      .style('font-size', '14px');

    this.svg.append('text')
      .attr('text-anchor', 'middle')
      .attr('transform', `rotate(-90)`)
      .attr('x', -(this.height - this.margin.top - this.margin.bottom) / 2)
      .attr('y', -this.margin.left + 20)
      .text('Country')
      .style('font-size', '14px');

    let tooltip = d3.select('body').append('div')
      .attr('class', 'tooltip')
      .style('position', 'absolute')
      .style('background', 'white')
      .style('border', '1px solid black')
      .style('padding', '5px')
      .style('display', 'none');

    this.svg.selectAll('.layer')
      .data(series)
      .enter().append('g')
      .selectAll('rect')
      .data((d: { [x: string]: any; Country: any; }) => levels.map(level => ({
        level,
        value: d[level],
        country: d.Country
      })))
      .enter().append('rect')
      .attr('fill', (d: { level: string; }) => this.color(d.level))
      .attr('x', (d: any, i: number, nodes: any[]) => {
        let previous = 0;
        for (let j = 0; j < i; j++) {
          previous += x((nodes[j] as any).__data__.value);
        }
        return previous;
      })
      .attr('y', (d: { country: string; }) => y(d.country)!)
      .attr('width', (d: { value: d3.NumberValue; }) => x(d.value))
      .attr('height', y.bandwidth())
      .on('mouseover', function (event: { pageX: number; pageY: number; }, d: { country: any; level: any; value: any; }) {
        tooltip.style('display', 'block')
          .html(`Country: ${d.country}<br>${d.level}: ${d.value}`)
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 10) + 'px');
      })
      .on('mouseout', function () {
        tooltip.style('display', 'none');
      });

    const legend = this.svg.append('g')
      .attr('transform', `translate(${this.width - this.margin.right - 150}, 0)`);

    levels.forEach((level, i) => {
      legend.append('rect')
        .attr('x', 0)
        .attr('y', i * 20)
        .attr('width', 15)
        .attr('height', 15)
        .attr('fill', this.color(level));

      legend.append('text')
        .attr('x', 20)
        .attr('y', i * 20 + 12)
        .text(level)
        .style('font-size', '12px')
        .attr('alignment-baseline', 'middle');
    });
  }

  updateYear(event: Event): void {
    this.selectedYear = +(event.target as HTMLSelectElement).value;
    this.updateChart();
  }

  private resizeChart(): void {
    this.width = window.innerWidth * 0.9;
    this.height = window.innerHeight * 0.9;
    this.updateChart();
  }
}
