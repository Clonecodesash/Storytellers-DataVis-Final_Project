import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-bar',
  templateUrl: './bar.component.html',
  imports: [CommonModule],
  styleUrls: ['./bar.component.css']
})
export class BarComponent implements AfterViewInit {
  @ViewChild('chart', { static: true }) chartContainer!: ElementRef;
  private width = window.innerWidth * 0.9;
  private height = window.innerHeight * 1.5;
  private margin = { top: 120, right: 100, bottom: 70, left: 100 };
  years: number[] = [2017, 2018, 2019, 2020, 2021, 2022, 2023];
  private selectedYear = 2017;

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

    const tooltip = d3.select(container)
      .append('div')
      .style('position', 'absolute')
      .style('visibility', 'hidden')
      .style('background', 'lightgray')
      .style('padding', '5px')
      .style('border-radius', '5px');

    d3.csv('assets/data/barchart/combined_mean_income_data.csv').then((data: any) => {
      data = data.filter((d: any) => +d.Year === this.selectedYear);
      const subgroups = [...new Set(data.map((d: any) => d['Educational Level']))];
      const groups = [...new Set(data.map((d: any) => d.Country))];

      const y = d3.scaleBand()
        .domain(groups as string[])
        .range([0, this.height - this.margin.top - this.margin.bottom])
        .padding(0.2);

      const ySubgroup = d3.scaleBand()
        .domain(subgroups as string[])
        .range([0, y.bandwidth()])
        .padding(0.05);

      const x = d3.scaleLinear()
        .domain([0, d3.max(data, (d: any) => +d.Income)!])
        .nice()
        .range([0, this.width - this.margin.left - this.margin.right]);

      const color = d3.scaleOrdinal<string>()
        .domain(subgroups as string[])
        .range(d3.schemeCategory10);

      svg.append('g')
        .selectAll('g')
        .data(groups)
        .enter().append('g')
        .attr('transform', (d: any) => `translate(0, ${y(d)!})`)
        .selectAll('rect')
        .data((d: any) => subgroups.map((key) => ({ key, value: data.find((item: any) => item.Country === d && item['Educational Level'] === key)?.Income || 0 })))
        .enter().append('rect')
        .attr('y', (d: any) => ySubgroup(d.key)!)
        .attr('x', 0)
        .attr('height', ySubgroup.bandwidth())
        .attr('width', (d: any) => x(+d.value))
        .attr('fill', (d: any) => color(d.key))
        .on('mouseover', (event, d: any) => {
          tooltip.style('visibility', 'visible').text(`${d.key}: ${d.value}`);
          d3.select(event.target).attr('opacity', 0.7);
        })
        .on('mousemove', (event) => {
          tooltip.style('top', `${event.pageY - 10}px`).style('left', `${event.pageX + 10}px`);
        })
        .on('mouseout', (event) => {
          tooltip.style('visibility', 'hidden');
          d3.select(event.target).attr('opacity', 1);
        });

      svg.append('g')
        .call(d3.axisLeft(y).tickSize(0));

      svg.append('g')
        .attr('transform', `translate(0,0)`)
        .call(d3.axisTop(x));

      const legend = svg.append('g')
        .attr('transform', `translate(${this.width - this.margin.right - 350}, -100)`);

      subgroups.forEach((level, i) => {
        legend.append('rect')
          .attr('x', i * 100)
          .attr('y', 0)
          .attr('width', 15)
          .attr('height', 15)
          .attr('fill', color(level as string));

        legend.append('text')
          .attr('x', i * 100 + 20)
          .attr('y', 12)
          .text(level as string)
          .style('font-size', '12px')
          .attr('alignment-baseline', 'middle');
      });
    });
  }

  updateChart(event: any): void {
    this.selectedYear = +event.target.value;
    this.createBarChart();
  }

  private resizeChart(): void {
    this.width = window.innerWidth * 0.9;
    this.height = window.innerHeight * 1.5;
    this.createBarChart();
  }
}
