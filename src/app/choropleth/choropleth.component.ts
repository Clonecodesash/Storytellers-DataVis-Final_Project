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

    d3.json('assets/europe.geojson').then((geoData: any) => {
      const projection = d3.geoMercator();
      const path = d3.geoPath().projection(projection);

      const bounds = d3.geoBounds(geoData);
      const center = d3.geoCentroid(geoData);
      const [[minLon, minLat], [maxLon, maxLat]] = bounds;

      const mapWidth = maxLon - minLon;
      const mapHeight = maxLat - minLat;
      const scale = Math.min(this.width / mapWidth, this.height / mapHeight) * 30;

      projection
        .scale(scale)
        .center(center)
        .translate([this.width / 2, this.height / 2]);

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
              .style('left', Math.min(event.pageX + 10, window.innerWidth - 150) + 'px')
              .style('top', Math.min(event.pageY - 20, window.innerHeight - 100) + 'px');
          })
          .on('mousemove', (event) => {
            tooltip
              .style('left', Math.min(event.pageX + 10, window.innerWidth - 150) + 'px')
              .style('top', Math.min(event.pageY - 20, window.innerHeight - 100) + 'px');
          })
          .on('mouseout', (event) => {
            d3.select(event.target).attr('stroke-width', 1);
            tooltip.style('opacity', 0);
          });

        const legendWidth = 20;
        const legendHeight = this.height * 0.5;
        const legendPadding = 20;
        const legendX = this.width > 600 ? this.width - 150 : legendPadding;
        const legendY = this.height > 500 ? this.height * 0.2 : legendPadding;

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
