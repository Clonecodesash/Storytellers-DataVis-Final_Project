import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-pie',
  templateUrl: './pie.component.html',
  imports: [CommonModule],
  styleUrls: ['./pie.component.css']
})
export class PieComponent implements AfterViewInit {

  @ViewChild('chart', { static: true }) chartContainer!: ElementRef;

  private width = window.innerWidth * 0.9;
  private height = window.innerHeight * 0.7;
  private radius = Math.min(this.width, this.height) / 2 - 10;
  private svg: any;
  private tooltip: any;
  private color = d3.scaleOrdinal(d3.schemeCategory10);
  selectedYear: number = 2023;
  selectedCountry: string = 'Austria';
  years: number[] = [];
  countries: string[] = [];
  private data: any[] = [];

  ngAfterViewInit(): void {
    this.createSVG();
    this.loadData();
    window.addEventListener('resize', () => this.resizeChart());
  }

  private createSVG(): void {
    const container = this.chartContainer.nativeElement;
    d3.select(container).selectAll('*').remove();

    this.svg = d3
      .select(container)
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height)
      .append('g')
      .attr('transform', `translate(${this.width / 2},${this.height / 2})`);

    // Tooltip setup
    this.tooltip = d3
      .select(container)
      .append('div')
      .style('position', 'absolute')
      .style('background', 'rgba(0, 0, 0, 0.7)')
      .style('color', '#fff')
      .style('padding', '5px')
      .style('border-radius', '5px')
      .style('display', 'none')
      .style('pointer-events', 'none');
  }

  private loadData(): void {
    d3.csv('assets/data/pie chart/filtered_europe_data.csv').then((data: any[]) => {
      this.data = data.map((d) => ({
        country: d['Country Name'],
        year: +d.Year,
        value: +d.Value,
        disaggregation: d.Disaggregation,
      }));

      // Extract unique years and countries
      this.years = Array.from(new Set(this.data.map((d) => d.year))).sort((a, b) => b - a);
      this.countries = Array.from(new Set(this.data.map((d) => d.country))).sort();

      this.createPieChart();
    });
  }

  updateYear(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.selectedYear = +target.value;
    this.createPieChart();
  }

  updateCountry(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.selectedCountry = target.value;
    this.createPieChart();
  }

  createPieChart(): void {
    const filteredData = this.data.filter(
      (d) => d.year === this.selectedYear && d.country === this.selectedCountry
    );

    if (filteredData.length === 0) {
      this.svg.selectAll('*').remove();
      return;
    }

    const pie = d3.pie<any>().value((d) => d.value);
    const arc = d3.arc<any>().innerRadius(0).outerRadius(this.radius);

    this.svg.selectAll('*').remove();

    const g = this.svg.selectAll('path').data(pie(filteredData)).enter().append('g');

    g.append('path')
      .attr('d', arc)
      .attr('fill', (d: any, i: { toString: () => string; }) => this.color(i.toString()))
      .attr('stroke', 'white')
      .attr('stroke-width', '2px')
      .on('mouseover', (event: { pageX: string; pageY: number; target: any; }, d: { data: { disaggregation: any; value: any; }; }) => {
        this.tooltip
          .style('display', 'block')
          .html(`${d.data.value}`)
          .style('left', event.pageX + 'px')
          .style('top', event.pageY - 20 + 'px');
        d3.select(event.target).attr('opacity', 0.7);
      })
      .on('mousemove', (event: { pageX: string; pageY: number; }) => {
        this.tooltip.style('left', event.pageX + 'px').style('top', event.pageY - 20 + 'px');
      })
      .on('mouseout', (event: { target: any; }) => {
        this.tooltip.style('display', 'none');
        d3.select(event.target).attr('opacity', 1);
      });

    // Add labels
    g.append('text')
      .attr('transform', (d: any) => `translate(${arc.centroid(d)})`)
      .attr('text-anchor', 'middle')
      .attr('font-size', '12px')
      .attr('fill', '#fff')
      .text((d: { data: { disaggregation: any; }; }) => d.data.disaggregation.replace(', total', ''));
  }

  private resizeChart(): void {
    this.width = window.innerWidth * 0.9;
    this.height = window.innerHeight * 0.6;
    this.radius = Math.min(this.width, this.height) / 2 - 10;
    this.createSVG();
    this.createPieChart();
  }
}
