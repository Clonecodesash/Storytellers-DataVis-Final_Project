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
  private width = window.innerWidth * 0.8;
  private height = window.innerHeight * 0.8;
  private margin = window.innerWidth > 600 ? { top: 50, right: 50, bottom: 50, left: 70 } : { top: 30, right: 50, bottom: 40, left: 50 };
  public countries: string[] = [];
  private fullData: any[] = [];
  private selectedCountry: string = '';

  ngAfterViewInit(): void {
    d3.csv('assets/data/stacked_area_chart/combined_employment_data.csv').then((data: any) => {
      this.fullData = data;
      this.countries = Array.from(new Set(data.map((d: any) => d.Country)));
      this.selectedCountry = this.countries[0];
      this.createStackedAreaChart();
      window.addEventListener('resize', () => this.resizeChart());
    });
  }

  private createStackedAreaChart(): void {
    const container = this.chartContainer.nativeElement;
    d3.select(container).selectAll('*').remove();

    const data = this.fullData.filter(d => d.Country === this.selectedCountry);
    const educationLevels = Array.from(new Set(data.map(d => d['Education Level'])));
    const years = Array.from(new Set(data.map(d => +d.Year))).sort((a, b) => a - b);

    const employmentByYear = d3.rollup(
      data,
      v => {
        const employmentRates = Object.fromEntries(
          educationLevels.map(level => [level, +v.find(d => d['Education Level'] === level)?.['Employment Rate (%)'] || 0])
        );

        const unemploymentRates = Object.fromEntries(
          educationLevels.map(level => [level + " Unemployed", 100 - employmentRates[level]])
        );

        const unemployedTotal = Object.values(unemploymentRates).reduce((sum, value) => sum + value, 0);

        return { ...employmentRates, "Unemployed": unemployedTotal };
      },
      d => +d.Year
    );

    const normalizedData: { Year: number;[key: string]: number }[] = Array.from(employmentByYear, ([year, values]) => {
      const total = Object.values(values).reduce((sum: number, value: unknown) => sum + (value as number), 0) || 1; // Avoid division by zero
      return {
        Year: year,
        ...Object.fromEntries(Object.entries(values).map(([key, value]) => [key, (value as number / total) * 100]))
      };
    });

    const stackKeys = [...educationLevels, "Unemployed"];
    const stack = d3.stack().keys(stackKeys);
    const series = stack(normalizedData);

    const x = d3.scaleLinear()
      .domain(d3.extent(years) as [number, number])
      .range([0, this.width - this.margin.left - this.margin.right]);

    const y = d3.scaleLinear()
      .domain([0, 100])
      .range([this.height - this.margin.top - this.margin.bottom, 0]);

    const color = d3.scaleOrdinal()
      .domain(stackKeys)
      .range([...d3.schemeCategory10.slice(0, educationLevels.length), "#888"]);

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
      .attr('fill', d => color(d.key) as unknown as string)
      .attr('d', area as unknown as string)
      .attr('opacity', 0.8)
      .on("mouseover", (event, d) => {
        tooltip.style("display", "block");
      })
      .on("mousemove", (event, d) => {
        const mouseX = event.pageX;
        const mouseY = event.pageY;
        const year = Math.round(x.invert(event.offsetX - this.margin.left));

        const level = d.key;
        const yearData = normalizedData.find(entry => entry.Year === year);
        const employmentRate = yearData ? yearData[level] : null;

        if (employmentRate !== null) {
          tooltip
            .html(`<strong>${level}</strong><br>Year: ${year}<br>Employment Share: ${employmentRate.toFixed(2)}%`)
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
      .text('Employment Rate Share (%)');

    svg.selectAll(".label")
      .data(series)
      .enter()
      .append("text")
      .attr("class", "label")
      .attr("x", this.width / 1.1 - this.margin.left)
      .attr("y", d => y((d[d.length - 1][1] + d[d.length - 1][0]) / 2))
      .text(d => d.key)
      .style("fill", d => (d.key === "Unemployed" ? "black" : "white"))
      .style("font-size", "12px")
      .style("text-anchor", "middle")
      .style("font-weight", "bold");
  }

  public updateChart(event: any): void {
    this.selectedCountry = event.target.value;
    this.createStackedAreaChart();
  }

  private resizeChart(): void {
    this.width = window.innerWidth * 0.9;
    this.height = window.innerHeight * 0.8;
    this.createStackedAreaChart();
  }
}
