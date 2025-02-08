import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-stackedarea',
  templateUrl: './stackedarea.component.html',
  styleUrls: ['./stackedarea.component.css'],
  imports: [CommonModule]
})
export class StackedareaComponent implements AfterViewInit {
  @ViewChild('chart', { static: true }) chartContainer!: ElementRef;
  private width = window.innerWidth * 0.9;
  private height = window.innerHeight * 0.8;
  private margin = { top: 50, right: 300, bottom: 50, left: 70 };
  public educationLevels: string[] = [];
  private fullData: any[] = [];
  private selectedLevel: string = '';

  ngAfterViewInit(): void {
    d3.csv('assets/data/stacked_area_chart/combined_employment_data.csv').then((data: any) => {
      this.fullData = data;
      this.educationLevels = Array.from(new Set(data.map((d: any) => d['Education Level'])));
      this.selectedLevel = this.educationLevels[0];
      this.createStackedAreaChart();
      window.addEventListener('resize', () => this.resizeChart());
    });
  }

  private createStackedAreaChart(): void {
    const container = this.chartContainer.nativeElement;
    d3.select(container).selectAll('*').remove();

    const data = this.fullData.filter(d => d['Education Level'] === this.selectedLevel);
    const countries = Array.from(new Set(data.map(d => d.Country)));
    const years = Array.from(new Set(data.map(d => +d.Year))).sort((a, b) => a - b);

    const totalEmploymentByYear = d3.rollup(
      data,
      v => d3.sum(v, d => +d['Employment Rate (%)']),
      d => +d.Year
    );

    const normalizedData = d3.rollups(
      data,
      v => {
        const total = totalEmploymentByYear.get(+v[0].Year) || 1;
        return Object.fromEntries(
          countries.map(c => [c, ((+v.find(d => d.Country === c)?.['Employment Rate (%)'] || 0) / total) * 100])
        );
      },
      d => +d.Year
    ).map(([year, values]) => ({ Year: year, ...values }));

    const stack = d3.stack().keys(countries);
    const series = stack(normalizedData);

    const x = d3.scaleLinear()
      .domain(d3.extent(years) as [number, number])
      .range([0, this.width - this.margin.left - this.margin.right]);

    const y = d3.scaleLinear()
      .domain([0, 100])
      .range([this.height - this.margin.top - this.margin.bottom, 0]);

    const color = d3.scaleOrdinal(d3.schemeCategory10).domain(countries);

    const svg = d3.select(container)
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height)
      .append('g')
      .attr('transform', `translate(${this.margin.left},${this.margin.top})`);

    const area = d3.area()
      .x((d: any) => x(d.data.Year))
      .y0(d => y(d[0]))
      .y1(d => y(d[1]));

    const tooltip = d3.select(container)
      .append("div")
      .style("position", "absolute")
      .style("background", "white")
      .style("border", "1px solid black")
      .style("border-radius", "5px")
      .style("padding", "8px")
      .style("font-size", "12px")
      .style("pointer-events", "none")
      .style("box-shadow", "2px 2px 6px rgba(0,0,0,0.3)")
      .style("display", "none");

    svg.selectAll('.layer')
      .data(series)
      .enter()
      .append('path')
      .attr('class', 'layer')
      .attr('fill', d => color(d.key))
      .attr('d', area as unknown as string)
      .attr('opacity', 0.8)
      .on("mouseover", (event, d) => {
        tooltip.style("display", "block");
      })
      .on("mousemove", (event, d) => {
        const mouseX = event.pageX;
        const mouseY = event.pageY;
        const year = Math.round(x.invert(event.offsetX - this.margin.left));

        const country = d.key;
        const yearData = normalizedData.find(entry => entry.Year === year);
        const employmentRate = yearData ? yearData[country] : null;

        if (employmentRate) {
          tooltip
            .html(`<strong>${country}</strong><br>Year: ${year}<br>Employment Share: ${employmentRate.toFixed(2)}%`)
            .style("top", `${mouseY - 30}px`)
            .style("left", `${mouseX + 15}px`);
        }
      })
      .on("mouseout", () => {
        tooltip.style("display", "none");
      });

    svg.append('g')
      .attr('transform', `translate(0,${this.height - this.margin.top - this.margin.bottom})`)
      .call(d3.axisBottom(x).ticks(5).tickFormat(d3.format('d')))
      .append('text')
      .attr('x', this.width / 2 - this.margin.left)
      .attr('y', 40)
      .attr('fill', 'black')
      .attr('text-anchor', 'middle')
      .text('Year');

    svg.append('g')
      .call(d3.axisLeft(y))
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -this.height / 2 + this.margin.top)
      .attr('y', -50)
      .attr('fill', 'black')
      .attr('text-anchor', 'middle')
      .text('Employment Share (%)');

    const legend = svg.append('g')
      .attr('transform', `translate(${this.width - 350}, 0)`)
      .attr('class', 'legend-grid');

    countries.forEach((country, i) => {
      const row = legend.append('g')
        .attr('transform', `translate(${(i % 2) * 120}, ${Math.floor(i / 2) * 20})`);

      row.append('rect')
        .attr('width', 15)
        .attr('height', 15)
        .attr('fill', color(country));

      row.append('text')
        .attr('x', 20)
        .attr('y', 12)
        .text(country)
        .style('font-size', '12px');
    });
  }

  public updateChart(event: any): void {
    this.selectedLevel = event.target.value;
    this.createStackedAreaChart();
  }

  private resizeChart(): void {
    this.width = window.innerWidth * 0.9;
    this.height = window.innerHeight * 0.8;
    this.createStackedAreaChart();
  }
}
