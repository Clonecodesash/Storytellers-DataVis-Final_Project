import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-line',
  templateUrl: './line.component.html',
  imports: [CommonModule],
  styleUrls: ['./line.component.css']
})
export class LineComponent implements AfterViewInit {
  @ViewChild('chart', { static: true }) chartContainer!: ElementRef;

  private width = window.innerWidth * 0.8;
  private height = window.innerHeight * 0.6;
  private margin = window.innerWidth > 600 ? { top: 20, right: 200, bottom: 50, left: 60 } : { top: 20, right: 10, bottom: 50, left: 40 };
  private data: any[] = [];
  countries: string[] = [];
  private selectedCountry: string = '';

  ngAfterViewInit(): void {
    this.loadData();
    window.addEventListener('resize', () => this.resizeChart());
  }

  private async loadData() {
    const data: { [key: string]: any }[] = await d3.csv('assets/data/line/filtered_europe_data.csv');

    data.forEach(d => {
      d['Year'] = +d['Year'];
      d['Value'] = +d['Value'];
    });

    this.countries = Array.from(new Set(data.map(d => d['Country Name']))).sort();
    this.selectedCountry = this.countries[0];

    this.data = data;
    this.createLineChart();
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

    const filteredData = this.data.filter(d => d['Country Name'] === this.selectedCountry);

    const disaggregations = Array.from(new Set(filteredData.map(d => d.Disaggregation)));

    const x = d3.scaleLinear()
      .domain(d3.extent(filteredData, d => d.Year) as [number, number])
      .range([0, this.width - this.margin.left - this.margin.right]);

    const y = d3.scaleLinear()
      .domain([0, d3.max(filteredData, d => d.Value)!])
      .range([this.height - this.margin.top - this.margin.bottom, 0]);

    const color = d3.scaleOrdinal<string>()
      .domain(disaggregations)
      .range(d3.schemeCategory10);

    svg.append('g')
      .attr('transform', `translate(0,${this.height - this.margin.top - this.margin.bottom})`)
      .call(d3.axisBottom(x).tickFormat(d3.format('d')));

    svg.append('g').call(d3.axisLeft(y));

    svg.append('text')
      .attr('text-anchor', 'middle')
      .attr('x', (this.width - this.margin.left - this.margin.right) / 2)
      .attr('y', this.height - this.margin.bottom + 30)
      .text('Year');

    svg.append('text')
      .attr('text-anchor', 'middle')
      .attr('transform', `rotate(-90)`)
      .attr('x', -((this.height - this.margin.top - this.margin.bottom) / 2))
      .attr('y', -this.margin.left + 15)
      .text('Employment Rate (%)');

    const tooltip = d3.select(container)
      .append('div')
      .style('position', 'absolute')
      .style('visibility', 'hidden')
      .style('background', 'rgba(0,0,0,0.7)')
      .style('color', 'white')
      .style('padding', '5px')
      .style('border-radius', '5px');

    disaggregations.forEach(disagg => {
      const line = d3.line<{ Year: number, Value: number }>()
        .x(d => x(d.Year))
        .y(d => y(d.Value))
        .curve(d3.curveMonotoneX);

      const dataLine = filteredData.filter(d => d.Disaggregation === disagg);

      svg.append('path')
        .datum(dataLine)
        .attr('fill', 'none')
        .attr('stroke', color(disagg as string)!)
        .attr('stroke-width', 2)
        .attr('d', line);

      svg.selectAll(`.dot-${disagg}`)
        .data(dataLine)
        .enter()
        .append('circle')
        .attr('cx', d => x(d.Year))
        .attr('cy', d => y(d.Value))
        .attr('r', 5)
        .attr('fill', color(disagg as string)!)
        .on('mouseover', (event, d) => {
          tooltip.style('visibility', 'visible')
            .text(`${d.Year}: ${d.Value} (${d.Disaggregation.replace(', total', '')})`);
        })
        .on('mousemove', event => {
          tooltip.style('top', `${event.pageY - 10}px`)
            .style('left', `${event.pageX + 10}px`);
        })
        .on('mouseout', () => tooltip.style('visibility', 'hidden'));
    });

    if (this.width > 600) {
      const legend = svg.append('g')
        .attr('transform', `translate(${this.width - 150}, 10)`);

      disaggregations.forEach((disagg, i) => {
        const legendRow = legend.append('g')
          .attr('transform', `translate(0, ${i * 20})`);

        legendRow.append('rect')
          .attr('width', 10)
          .attr('height', 10)
          .attr('fill', color(disagg)!);

        legendRow.append('text')
          .attr('x', 15)
          .attr('y', 10)
          .text(disagg.split(',')[0])
          .style('font-size', '12px')
          .attr('alignment-baseline', 'middle');
      });
    }
  }

  updateChart(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedCountry = selectElement.value;
    this.createLineChart();
  }

  private resizeChart(): void {
    this.width = window.innerWidth * 0.9;
    this.height = window.innerHeight * 0.6;
    this.createLineChart();
  }
}
