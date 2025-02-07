import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-heatmap',
  templateUrl: './heatmap.component.html',
  styleUrls: ['./heatmap.component.css']
})
export class HeatmapComponent implements AfterViewInit {
  // private data: any[] = [];
  // private svg: any;
  // private margin = { top: 50, right: 30, bottom: 50, left: 60 };
  // private width: number;
  // private gridSize = 10;
  // private height: number;
  // private availableYears: number[] = [];
  // private selectedYear!: number;
  // private availableRanges = [15, 30, 50, 100, 'All'];
  // private selectedRange: number | 'All' = 15;

  // constructor() {
  //   this.width = 800 - this.margin.left - this.margin.right;
  //   this.height = 500 - this.margin.top - this.margin.bottom;
  // }

  // ngOnInit(): void {
  //   this.createSvg();
  //   d3.csv('assets/cleaned_data2.csv').then(data => {
  //     this.data = data.map(d => ({
  //       country: d['Country'],
  //       year: +d['Year'],
  //       fossil_emissions: +d['Emission_fossil_use'],
  //       land_emissions: +d['Emission_land_use']
  //     }));

  //     this.availableYears = Array.from(new Set(this.data.map(d => d.year))).sort();
  //     this.selectedYear = this.availableYears[0];

  //     this.createYearSelector();
  //     this.createRangeSelector();
  //     this.filterAndDrawChart(this.selectedYear, this.selectedRange);
  //   });
  // }

  // @HostListener('window:resize')
  // onResize(): void {
  //   this.updateChartSize();
  // }

  // private createSvg(): void {
  //   this.svg = d3.select('figure#heatmap-chart')
  //     .append('svg')
  //     .attr('id', 'heatmap-svg')
  //     .attr('viewBox', `0 0 ${this.width + this.margin.left + this.margin.right} ${this.height + this.margin.top + this.margin.bottom}`)
  //     .attr('preserveAspectRatio', 'xMinYMin meet')
  //     .append('g')
  //     .attr('transform', `translate(${this.margin.left},${this.margin.top})`);
  // }

  // private createYearSelector(): void {
  //   const selector = d3.select('#heatmapYearSelector')
  //     .append('select')
  //     .attr('id', 'heatmapYearSelect')
  //     .on('change', () => {
  //       this.selectedYear = +d3.select('#heatmapYearSelect').property('value');
  //       this.filterAndDrawChart(this.selectedYear, this.selectedRange);
  //     });

  //   selector.selectAll('option')
  //     .data(this.availableYears)
  //     .enter()
  //     .append('option')
  //     .text(d => d)
  //     .attr('value', d => d);
  // }

  // private createRangeSelector(): void {
  //   const selector = d3.select('#heatmapRangeSelector')
  //     .append('select')
  //     .attr('id', 'heatmapRangeSelect')
  //     .on('change', () => {
  //       const value = d3.select('#heatmapRangeSelect').property('value');
  //       this.selectedRange = value === 'All' ? 'All' : +value;
  //       this.filterAndDrawChart(this.selectedYear, this.selectedRange);
  //     });

  //   selector.selectAll('option')
  //     .data(this.availableRanges)
  //     .enter()
  //     .append('option')
  //     .text(d => d)
  //     .attr('value', d => d);
  // }

  // private filterAndDrawChart(year: number, range: number | 'All'): void {
  //   const filteredData = this.data.filter(d => d.year === year);
  //   const sortedData = filteredData.sort((a, b) => d3.descending(a.fossil_emissions + a.land_emissions, b.fossil_emissions + b.land_emissions));

  //   const displayedData = range === 'All' ? sortedData : sortedData.slice(0, range);
  //   this.height = this.gridSize * displayedData.length + this.margin.top + this.margin.bottom;
  //   d3.select('#heatmap-svg')
  //     .attr('viewBox', `0 0 ${this.width + this.margin.left + this.margin.right} ${this.height + 70}`);

  //   this.drawChart(displayedData);
  // }

  // private drawChart(data: any[]): void {
  //   this.svg.selectAll('*').remove();

  //   const countries = Array.from(new Set(data.map(d => d.country)));
  //   const emissionTypes = ['fossil_emissions', 'land_emissions'];

  //   const x = d3.scaleBand()
  //     .domain(emissionTypes)
  //     .range([0, this.width])
  //     .padding(0.05);

  //   const y = d3.scaleBand()
  //     .domain(countries)
  //     .range([0, this.height])
  //     .padding(0.05);

  //   const color = d3.scaleSequential()
  //     .interpolator(d3.interpolateReds)
  //     .domain([0, d3.max(data, d => Math.max(d.fossil_emissions, d.land_emissions)) || 1]);

  //   this.svg.append('g')
  //     .attr('transform', `translate(0,${this.height})`)
  //     .call(d3.axisBottom(x).tickSize(0).tickPadding(10));

  //   this.svg.append('g')
  //     .call(d3.axisLeft(y).tickSize(0).tickPadding(10));

  //   const tooltip = d3.select('body').append('div')
  //     .style('position', 'absolute')
  //     .style('padding', '6px')
  //     .style('background', '#f4f4f4')
  //     .style('border', '1px solid #333')
  //     .style('border-radius', '4px')
  //     .style('pointer-events', 'none')
  //     .style('opacity', 0);

  //   this.svg.selectAll()
  //     .data(data.flatMap(d => emissionTypes.map(type => ({ country: d.country, type, value: d[type] }))))
  //     .enter()
  //     .append('rect')
  //     .attr('x', (d: { type: string; }) => x(d.type)!)
  //     .attr('y', (d: { country: string; }) => y(d.country)!)
  //     .attr('width', x.bandwidth())
  //     .attr('height', y.bandwidth())
  //     .style('fill', (d: { value: d3.NumberValue; }) => color(d.value))
  //     .on('mouseover', (event: { pageX: number; pageY: number; currentTarget: any; }, d: { country: any; type: any; value: any; }) => {
  //       tooltip.transition().duration(200).style('opacity', 0.9);
  //       tooltip.html(
  //         `<strong>Country: ${d.country}</strong><br>
  //          Type: ${d.type}<br>
  //          Emission: ${d.value}`
  //       )
  //         .style('left', (event.pageX + 5) + 'px')
  //         .style('top', (event.pageY - 28) + 'px');
  //       d3.select(event.currentTarget).style('stroke', '#000');
  //     })
  //     .on('mousemove', (event: { pageX: number; pageY: number; }) => {
  //       tooltip.style('left', (event.pageX + 5) + 'px')
  //         .style('top', (event.pageY - 28) + 'px');
  //     })
  //     .on('mouseout', (event: { currentTarget: any; }) => {
  //       tooltip.transition().duration(500).style('opacity', 0);
  //       d3.select(event.currentTarget).style('stroke', 'none');
  //     });
  // }

  // private updateChartSize(): void {
  //   const container = d3.select('figure#heatmap-chart').node() as HTMLElement;
  //   if (container) {
  //     const newWidth = container.clientWidth;
  //     this.width = newWidth - this.margin.left - this.margin.right;
  //     this.svg.attr('viewBox', `0 0 ${this.width + this.margin.left + this.margin.right} ${this.height + this.margin.top + this.margin.bottom}`);
  //     this.filterAndDrawChart(this.selectedYear, this.selectedRange);
  //   }
  // }
  @ViewChild('chart', { static: true }) chartContainer!: ElementRef;
  
    private width = window.innerWidth * 0.9;
    private height = window.innerHeight * 0.6;
    private margin = { top: 20, right: 30, bottom: 40, left: 60 };
  
    ngAfterViewInit(): void {
      this.createHeatmap();
      window.addEventListener('resize', () => this.resizeChart());
    }
  
    private createHeatmap(): void {
      const container = this.chartContainer.nativeElement;
      d3.select(container).selectAll('*').remove();
  
      const svg = d3.select(container)
        .append('svg')
        .attr('width', this.width)
        .attr('height', this.height)
        .append('g')
        .attr('transform', `translate(${this.margin.left},${this.margin.top})`);
  
      d3.csv('assets/heatmap.csv').then((data: any) => {
        const xLabels: string[] = Array.from(new Set(data.map((d: any) => d.Country)));
        const yLabels = ['Primary', 'Secondary', 'Tertiary'];
  
        const x = d3.scaleBand()
          .domain(xLabels)
          .range([0, this.width - this.margin.left - this.margin.right])
          .padding(0.05);
  
        const y = d3.scaleBand()
          .domain(yLabels)
          .range([this.height - this.margin.top - this.margin.bottom, 0])
          .padding(0.05);
  
        const color = d3.scaleSequential(d3.interpolateBlues)
          .domain([0, d3.max(data, (d: any) => +d.Value)!]);
  
        svg.append('g')
          .attr('transform', `translate(0,${this.height - this.margin.top - this.margin.bottom})`)
          .call(d3.axisBottom(x));
  
        svg.append('g')
          .call(d3.axisLeft(y));
  
        svg.selectAll()
          .data(data)
          .enter()
          .append('rect')
          .attr('x', (d: any) => x(d.Country)!)
          .attr('y', (d: any) => y(d.Level)!)
          .attr('width', x.bandwidth())
          .attr('height', y.bandwidth())
          .attr('fill', (d: any) => color(+d.Value))
          .on('mouseover', (event, d: any) => {
            d3.select(event.target).attr('stroke', 'black').attr('stroke-width', 2);
          })
          .on('mouseout', (event) => {
            d3.select(event.target).attr('stroke', 'none');
          });
      });
    }
  
    private resizeChart(): void {
      this.width = window.innerWidth * 0.9;
      this.height = window.innerHeight * 0.6;
      this.createHeatmap();
    }
}
