import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-heatmap',
  templateUrl: './heatmap.component.html',
  imports: [CommonModule],
  styleUrls: ['./heatmap.component.css']
})
export class HeatmapComponent implements AfterViewInit {
  // @ViewChild('chart', { static: true }) chartContainer!: ElementRef;

  // private width = window.innerWidth * 0.9;
  // private height = window.innerHeight * 0.9;
  // private margin = { top: 20, right: 100, bottom: 80, left: 120 };


  // private data: any[] = [];
  // years: string[] = ['2023', '2022', '2021', '2020', '2019', '2018', '2017'];
  // selectedYear: string = '2023';

  // ngAfterViewInit(): void {
  //   d3.csv('assets/data/heatmap/combined_heatmap_employment_data.csv').then((data: any) => {
  //     this.data = data;
  //     this.createHeatmap();
  //   });

  //   window.addEventListener('resize', () => this.resizeChart());
  // }

  // updateYear(event: Event): void {
  //   this.selectedYear = (event.target as HTMLSelectElement).value;
  //   this.createHeatmap();
  // }

  // private createHeatmap(): void {
  //   const container = this.chartContainer.nativeElement;
  //   d3.select(container).selectAll('*').remove();

  //   const svg = d3.select(container)
  //     .append('svg')
  //     .attr('width', this.width)
  //     .attr('height', this.height)
  //     .append('g')
  //     .attr('transform', `translate(${this.margin.left},${this.margin.top})`);

  //   const filteredData = this.data.filter(d => d.Year === this.selectedYear);

  //   const yLabels = Array.from(new Set(filteredData.map(d => d.Country))).sort();
  //   const xLabels = Array.from(new Set(filteredData.map(d => d['Educational Level']))).sort();

  //   const x = d3.scaleBand()
  //     .domain(xLabels)
  //     .range([0, this.width - this.margin.left - this.margin.right])
  //     .padding(0.05);

  //   const y = d3.scaleBand()
  //     .domain(yLabels)
  //     .range([0, this.height - this.margin.top - this.margin.bottom])
  //     .padding(0.05);

  //   const color = d3.scaleSequential(d3.interpolateReds)
  //     .domain([0, d3.max(filteredData, d => +d['Unemployment Rate'])!]);

  //   svg.append('g')
  //     .attr('transform', `translate(0,${this.height - this.margin.top - this.margin.bottom})`)
  //     .call(d3.axisBottom(x))
  //     .selectAll('text')
  //     .attr('transform', 'rotate(45)')
  //     .style('text-anchor', 'start');

  //   svg.append('g')
  //     .call(d3.axisLeft(y));

  //   const tooltip = d3.select(container)
  //     .append('div')
  //     .style('position', 'absolute')
  //     .style('background', 'rgba(0, 0, 0, 0.75)')
  //     .style('color', 'white')
  //     .style('padding', '8px')
  //     .style('border-radius', '5px')
  //     .style('display', 'none')
  //     .style('pointer-events', 'none');

  //   svg.selectAll()
  //     .data(filteredData)
  //     .enter()
  //     .append('rect')
  //     .attr('x', d => x(d['Educational Level'])!)
  //     .attr('y', d => y(d.Country)!)
  //     .attr('width', x.bandwidth())
  //     .attr('height', y.bandwidth())
  //     .attr('fill', d => color(+d['Unemployment Rate']))
  //     .on('mouseover', (event, d) => {
  //       tooltip.style('display', 'block')
  //         .html(`<strong>Country:</strong> ${d.Country}<br>
  //                <strong>Level:</strong> ${d['Educational Level']}<br>
  //                <strong>Rate:</strong> ${d['Unemployment Rate']}%`)
  //         .style('left', `${event.pageX + 10}px`)
  //         .style('top', `${event.pageY - 20}px`);

  //       d3.select(event.target).attr('stroke', 'black').attr('stroke-width', 2);
  //     })
  //     .on('mouseout', event => {
  //       tooltip.style('display', 'none');
  //       d3.select(event.target).attr('stroke', 'none');
  //     });

  //   const legendWidth = 20;
  //   const legendHeight = 500;

  //   const legendSvg = svg.append('g')
  //     .attr('transform', `translate(${this.width - this.margin.left - 100}, 10)`);

  //   const legendScale = d3.scaleLinear()
  //     .domain(color.domain())
  //     .range([legendHeight, 0]);

  //   const legendAxis = d3.axisRight(legendScale)
  //     .ticks(5)
  //     .tickFormat(d3.format('.1f'));

  //   legendSvg.append('g')
  //     .call(legendAxis);

  //   const legendGradient = legendSvg.append('defs')
  //     .append('linearGradient')
  //     .attr('id', 'legend-gradient')
  //     .attr('x1', '0%')
  //     .attr('x2', '0%')
  //     .attr('y1', '100%')
  //     .attr('y2', '0%');

  //   const colorRange = [color(0)!, color(d3.max(filteredData, d => +d['Unemployment Rate'])!)!];

  //   legendGradient.append('stop')
  //     .attr('offset', '0%')
  //     .attr('stop-color', colorRange[0]);

  //   legendGradient.append('stop')
  //     .attr('offset', '100%')
  //     .attr('stop-color', colorRange[1]);

  //   legendSvg.append('rect')
  //     .attr('x', 35)
  //     .attr('y', 0)
  //     .attr('width', legendWidth)
  //     .attr('height', legendHeight)
  //     .style('fill', 'url(#legend-gradient)');
  // }

  // private resizeChart(): void {
  //   this.width = window.innerWidth * 0.9;
  //   this.height = window.innerHeight * 0.9;
  //   this.createHeatmap();
  // }
  @ViewChild('chart', { static: true }) chartContainer!: ElementRef;

  private width = window.innerWidth * 0.9;
  private height = window.innerHeight * 0.9;
  private margin = { top: 20, right: 100, bottom: 80, left: 120 };

  private data: any[] = [];
  private color: any; // Color scale
  years: string[] = ['2023', '2022', '2021', '2020', '2019', '2018', '2017'];
  selectedYear: string = '2023';

  ngAfterViewInit(): void {
    d3.csv('assets/data/heatmap/combined_heatmap_employment_data.csv').then((data: any) => {
      this.data = data;
      
      // **Calculate global color scale domain (fixed for all years)**
      const minRate = d3.min(this.data, d => +d['Unemployment Rate'])!;
      const maxRate = d3.max(this.data, d => +d['Unemployment Rate'])!;
      this.color = d3.scaleSequential(d3.interpolateReds).domain([minRate, maxRate]);

      this.createHeatmap();
    });

    window.addEventListener('resize', () => this.resizeChart());
  }

  updateYear(event: Event): void {
    this.selectedYear = (event.target as HTMLSelectElement).value;
    this.createHeatmap();
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

    const filteredData = this.data.filter(d => d.Year === this.selectedYear);

    const yLabels = Array.from(new Set(filteredData.map(d => d.Country))).sort();
    const xLabels = Array.from(new Set(filteredData.map(d => d['Educational Level']))).sort();

    const x = d3.scaleBand()
      .domain(xLabels)
      .range([0, this.width - this.margin.left - this.margin.right])
      .padding(0.05);

    const y = d3.scaleBand()
      .domain(yLabels)
      .range([0, this.height - this.margin.top - this.margin.bottom])
      .padding(0.05);

    svg.append('g')
      .attr('transform', `translate(0,${this.height - this.margin.top - this.margin.bottom})`)
      .call(d3.axisBottom(x))
      .selectAll('text')
      .attr('transform', 'rotate(45)')
      .style('text-anchor', 'start');

    svg.append('g')
      .call(d3.axisLeft(y));

    const tooltip = d3.select(container)
      .append('div')
      .style('position', 'absolute')
      .style('background', 'rgba(0, 0, 0, 0.75)')
      .style('color', 'white')
      .style('padding', '8px')
      .style('border-radius', '5px')
      .style('display', 'none')
      .style('pointer-events', 'none');

    svg.selectAll()
      .data(filteredData)
      .enter()
      .append('rect')
      .attr('x', d => x(d['Educational Level'])!)
      .attr('y', d => y(d.Country)!)
      .attr('width', x.bandwidth())
      .attr('height', y.bandwidth())
      .attr('fill', d => this.color(+d['Unemployment Rate'])) // Use global color scale
      .on('mouseover', (event, d) => {
        tooltip.style('display', 'block')
          .html(`<strong>Country:</strong> ${d.Country}<br>
                 <strong>Level:</strong> ${d['Educational Level']}<br>
                 <strong>Rate:</strong> ${d['Unemployment Rate']}%`)
          .style('left', `${event.pageX + 10}px`)
          .style('top', `${event.pageY - 20}px`);

        d3.select(event.target).attr('stroke', 'black').attr('stroke-width', 2);
      })
      .on('mouseout', event => {
        tooltip.style('display', 'none');
        d3.select(event.target).attr('stroke', 'none');
      });

    // **Fixed Color Bar Legend**
    const legendWidth = 20;
    const legendHeight = 500;

    const legendSvg = svg.append('g')
      .attr('transform', `translate(${this.width - this.margin.left - 100}, 10)`);

    const legendScale = d3.scaleLinear()
      .domain(this.color.domain()) // Use fixed domain
      .range([legendHeight, 0]);

    const legendAxis = d3.axisRight(legendScale)
      .ticks(5)
      .tickFormat(d3.format('.1f'));

    legendSvg.append('g')
      .call(legendAxis);

    const legendGradient = legendSvg.append('defs')
      .append('linearGradient')
      .attr('id', 'legend-gradient')
      .attr('x1', '0%')
      .attr('x2', '0%')
      .attr('y1', '100%')
      .attr('y2', '0%');

    const colorRange = [this.color(this.color.domain()[0])!, this.color(this.color.domain()[1])!];

    legendGradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', colorRange[0]);

    legendGradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', colorRange[1]);

    legendSvg.append('rect')
      .attr('x', 35)
      .attr('y', 0)
      .attr('width', legendWidth)
      .attr('height', legendHeight)
      .style('fill', 'url(#legend-gradient)');
  }

  private resizeChart(): void {
    this.width = window.innerWidth * 0.9;
    this.height = window.innerHeight * 0.9;
    this.createHeatmap();
  }
}
