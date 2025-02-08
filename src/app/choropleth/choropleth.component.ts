import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-choropleth',
  templateUrl: './choropleth.component.html',
  imports: [CommonModule],
  styleUrls: ['./choropleth.component.css']
})
export class ChoroplethComponent implements AfterViewInit {
  @ViewChild('chart', { static: true }) chartContainer!: ElementRef;
  private width = window.innerWidth * 0.9;
  private height = window.innerHeight * 0.6;
  private selectedYear: number = 2023;
  public years = [2023, 2022, 2021, 2020, 2019, 2018, 2017];

  private countryNameCorrections: { [key: string]: string } = {
    'Czech Republic': 'Czechia',
    'Turkey': 'Türkiye',
    'The former Yugoslav Republic of Macedonia': 'North Macedonia'
  };

  ngAfterViewInit(): void {
    this.createChoroplethMap();
    window.addEventListener('resize', () => this.resizeChart());
  }

  updateYear(event: Event): void {
    this.selectedYear = +(event.target as HTMLSelectElement).value;
    this.createChoroplethMap();
  }

  private createChoroplethMap(): void {
    const container = this.chartContainer.nativeElement;
    d3.select(container).selectAll('*').remove();

    const svg = d3
      .select(container)
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height);

    const projection = d3
      .geoMercator()
      .scale(this.width / 4)
      .translate([this.width / 2.5, this.height / 0.8]);

    const path = d3.geoPath().projection(projection);

    const colorScale = d3.scaleSequential(d3.interpolateBlues).domain([0, 100]);

    const tooltip = d3
      .select(container)
      .append('div')
      .attr('class', 'tooltip')
      .style('position', 'absolute')
      .style('opacity', 0);

    d3.csv('assets/data/map/combined_education_data.csv').then((data: any) => {
      data.forEach((d: any) => {
        d.Percentage = d.Percentage === ':' ? NaN : +d.Percentage;
      });

      const filteredData = data.filter(
        (d: any) => +d.Year === this.selectedYear && d.Type === 'Total'
      );

      d3.json('assets/europe.geojson').then((geoData: any) => {
        geoData.features.forEach((feature: any) => {
          const correctedCountryName = this.countryNameCorrections[feature.properties.NAME] || feature.properties.NAME;
          const countryData = filteredData.find((d: any) => d.Country === correctedCountryName);

          feature.properties.percentage = countryData ? countryData.Percentage : NaN;
        });

        svg
          .selectAll('path')
          .data(geoData.features)
          .enter()
          .append('path')
          .attr('d', path as unknown as string)
          .attr('fill', (d: any) =>
            isNaN(d.properties.percentage) ? '#ccc' : colorScale(d.properties.percentage)
          )
          .attr('stroke', '#ffffff')
          .on('mouseover', (event, d: any) => {
            d3.select(event.target).attr('stroke-width', 2);

            tooltip
              .style('opacity', 1)
              .html(
                `<strong>${d.properties.NAME}</strong><br>
                ${isNaN(d.properties.percentage) ? 'No Data' : `Value: ${d.properties.percentage}%`}`
              )
              .style('left', event.pageX + 10 + 'px')
              .style('top', event.pageY - 20 + 'px');
          })
          .on('mousemove', (event) => {
            tooltip
              .style('left', event.pageX + 10 + 'px')
              .style('top', event.pageY - 20 + 'px');
          })
          .on('mouseout', (event) => {
            d3.select(event.target).attr('stroke-width', 1);
            tooltip.style('opacity', 0);
          });

        const legendWidth = 20;
        const legendHeight = this.height * 0.5;
        const legendX = this.width - 150;
        const legendY = this.height * 0.2;

        const legendScale = d3.scaleLinear().domain([0, 100]).range([legendHeight, 0]);

        const legendAxis = d3.axisRight(legendScale).ticks(5);

        const legend = svg.append('g').attr('transform', `translate(${legendX}, ${legendY})`);

        const gradient = svg.append('defs')
          .append('linearGradient')
          .attr('id', 'color-gradient')
          .attr('x1', '0%')
          .attr('y1', '100%')
          .attr('x2', '0%')
          .attr('y2', '0%');

        gradient.selectAll('stop')
          .data(d3.range(0, 1.01, 0.1))
          .enter()
          .append('stop')
          .attr('offset', d => `${d * 100}%`)
          .attr('stop-color', d => colorScale(d * 100));

        legend.append('rect')
          .attr('width', legendWidth)
          .attr('height', legendHeight)
          .style('fill', 'url(#color-gradient)');

        legend.append('g')
          .attr('transform', `translate(${legendWidth}, 0)`)
          .call(legendAxis);
      });
    });
  }

  private resizeChart(): void {
    this.width = window.innerWidth * 0.9;
    this.height = window.innerHeight * 0.6;
    this.createChoroplethMap();
  }
}
