import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-chloropleth',
  templateUrl: './chloropleth.component.html',
  styleUrls: ['./chloropleth.component.css']
})
export class ChloroplethComponent implements AfterViewInit {

  @ViewChild('chart', { static: true }) chartContainer!: ElementRef;

  private width = window.innerWidth * 0.9;
  private height = window.innerHeight * 0.6;

  ngAfterViewInit(): void {
    this.createChoroplethMap();
    window.addEventListener('resize', () => this.resizeChart());
  }

  private createChoroplethMap(): void {
    const container = this.chartContainer.nativeElement;
    d3.select(container).selectAll('*').remove();

    const svg = d3.select(container)
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height);

    const projection = d3.geoMercator()
      .scale(this.width / 2.5)
      .translate([this.width / 2, this.height / 1.5]);
    
    const path = d3.geoPath().projection(projection);
    
    const colorScale = d3.scaleSequential(d3.interpolateBlues)
      .domain([0, 100]);
    
    d3.csv('assets/chloropleth.csv').then((data: any) => {
      d3.json('assets/europe.geojson').then((geoData: any) => {
        geoData.features.forEach((feature: any) => {
          const countryData = data.find((d: any) => d.Country === feature.properties.name);
          feature.properties.education_rate = countryData ? +countryData.EducationRate : 0;
        });
        
        svg.selectAll('path')
          .data(geoData.features)
          .enter()
          .append('path')
          .attr('d', path as unknown as string)
          .attr('fill', (d: any) => colorScale(d.properties.education_rate))
          .attr('stroke', '#ffffff')
          .on('mouseover', (event, d: any) => {
            d3.select(event.target).attr('stroke-width', 2);
          })
          .on('mouseout', (event) => {
            d3.select(event.target).attr('stroke-width', 1);
          });
      });
    });
  }

  private resizeChart(): void {
    this.width = window.innerWidth * 0.9;
    this.height = window.innerHeight * 0.6;
    this.createChoroplethMap();
  }
}
