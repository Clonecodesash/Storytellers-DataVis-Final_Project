import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-bubble',
  templateUrl: './bubble.component.html',
  imports: [CommonModule],
  styleUrls: ['./bubble.component.css']
})
export class BubbleComponent implements AfterViewInit {

  @ViewChild('chart', { static: true }) chartContainer!: ElementRef;
  private width = window.innerWidth * 0.8;
  private height = window.innerHeight * 0.6;
  private margin = { top: 40, right: 60, bottom: 70, left: 80 };
  private svg: any;
  private year = 2017;
  availableYears = [2017, 2018, 2019, 2020, 2021, 2022, 2023];

  ngAfterViewInit(): void {
    this.createSvg();
    this.loadData();
    window.addEventListener('resize', () => this.resizeChart());
  }

  private createSvg(): void {
    const container = this.chartContainer.nativeElement;
    d3.select(container).html('');
    this.svg = d3
      .select(container)
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height)
      .append('g')
      .attr('transform', `translate(${this.margin.left},${this.margin.top})`);
  }

  private loadData(): void {
    d3.csv('assets/data/bubble chart/final_combined_bubble_data.csv').then((data: any[]) => {
      data = data.filter((d) => +d.Year === this.year);

      const x = d3
        .scaleLinear()
        .domain(d3.extent(data, (d: any) => +d['Employment Rate (%)']) as [number, number])
        .range([0, this.width - this.margin.left - this.margin.right]);

      const y = d3
        .scaleLinear()
        .domain(d3.extent(data, (d: any) => +d.Income) as [number, number])
        .range([this.height - this.margin.top - this.margin.bottom, 0]);

      const r = d3
        .scaleSqrt()
        .domain(d3.extent(data, (d: any) => +d['GDP(millions euros)']) as [number, number])
        .range([5, 40]);

      const color = d3.scaleOrdinal(d3.schemeCategory10);

      this.svg.append('g')
        .attr('transform', `translate(0,${this.height - this.margin.top - this.margin.bottom})`)
        .call(d3.axisBottom(x));

      this.svg.append('g').call(d3.axisLeft(y));

      this.svg
        .append('text')
        .attr('x', (this.width - this.margin.left - this.margin.right) / 2)
        .attr('y', this.height - this.margin.bottom + 20)
        .style('text-anchor', 'middle')
        .style('font-size', '14px')
        .text('Employment Rate (%)');

      this.svg
        .append('text')
        .attr('transform', 'rotate(-90)')
        .attr('x', -(this.height - this.margin.top - this.margin.bottom) / 2)
        .attr('y', -this.margin.left + 20)
        .style('text-anchor', 'middle')
        .style('font-size', '14px')
        .text('Income Level (€)');

      const tooltip = d3
        .select(this.chartContainer.nativeElement)
        .append('div')
        .style('position', 'absolute')
        .style('background', 'lightgray')
        .style('padding', '5px')
        .style('border-radius', '5px')
        .style('visibility', 'hidden');

      this.svg
        .selectAll('circle')
        .data(data)
        .enter()
        .append('circle')
        .attr('cx', (d: any) => x(+d['Employment Rate (%)']))
        .attr('cy', (d: any) => y(+d.Income))
        .attr('r', (d: any) => r(+d['GDP(millions euros)']))
        .attr('fill', (d: any) => color(d['Educational Level']))
        .attr('opacity', 0.7)
        .on('mouseover', (event: { target: any; }, d: any) => {
          d3.select(event.target).attr('opacity', 1);
          tooltip
            .style('visibility', 'visible')
            .html(
              `<strong>${d.Country}</strong><br>Income: €${d.Income}<br>Employment Rate: ${d['Employment Rate (%)']}%<br>GDP: €${d['GDP(millions euros)']}M`
            );
        })
        .on('mousemove', (event: { pageY: number; pageX: number; }) => {
          tooltip
            .style('top', event.pageY - 30 + 'px')
            .style('left', event.pageX + 10 + 'px');
        })
        .on('mouseout', (event: { target: any; }) => {
          d3.select(event.target).attr('opacity', 0.7);
          tooltip.style('visibility', 'hidden');
        });
    });
  }

  updateChart(event: Event): void {
    const selectedYear = (event.target as HTMLSelectElement).value;
    this.year = +selectedYear;
    this.createSvg();
    this.loadData();
  }

  private resizeChart(): void {
    this.width = window.innerWidth * 0.8;
    this.height = window.innerHeight * 0.6;
    this.createSvg();
    this.loadData();
  }
}
