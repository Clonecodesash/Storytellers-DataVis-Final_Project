import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import * as d3 from 'd3';
import { sankey, sankeyLinkHorizontal, SankeyGraph, SankeyNodeMinimal } from 'd3-sankey';

@Component({
  selector: 'app-network',
  templateUrl: './network.component.html',
  imports: [CommonModule],
  styleUrls: ['./network.component.css']
})
export class NetworkComponent implements AfterViewInit {
  @ViewChild('chart', { static: true }) chartContainer!: ElementRef;
  private width = window.innerWidth * 0.8;
  private height = window.innerHeight * 2;
  private margin = { top: 40, right: 100, bottom: 50, left: -20 };
  availableYears: number[] = [];
  private rawData: any[] = [];
  private selectedYear: number = 2017;

  ngAfterViewInit(): void {
    this.loadData();
    window.addEventListener('resize', () => this.resizeChart());
  }

  private loadData(): void {
    d3.csv('assets/data/network/alluvial/final_combined_bubble_data.csv').then((data) => {
      this.rawData = data;
      this.availableYears = [...new Set(data.map(d => +d['Year']))].sort();
      this.createAlluvialChart();
    });
  }

  updateChart(event: any): void {
    this.selectedYear = +event.target.value;
    this.createAlluvialChart();
  }

  private createAlluvialChart(): void {
    const container = this.chartContainer.nativeElement;
    d3.select(container).selectAll('*').remove();

    const svg = d3.select(container)
      .append('svg')
      .attr('width', this.width + 150)
      .attr('height', this.height)
      .attr('transform', `translate(${this.margin.left},${this.margin.top})`);

    const filteredData = this.rawData.filter(d => +d['Year'] === this.selectedYear);

    const nodes: any[] = [];
    const nodeMap = new Map<string, any>();
    const links: any[] = [];

    filteredData.forEach(d => {
      const country = d['Country'].trim();
      const educationLevel = d['Educational Level'].trim();
      const incomeBracket = this.incomeBracket(parseFloat(d['Income']));

      if (!nodeMap.has(country)) {
        const newNode = { name: country };
        nodes.push(newNode);
        nodeMap.set(country, newNode);
      }
      if (!nodeMap.has(educationLevel)) {
        const newNode = { name: educationLevel };
        nodes.push(newNode);
        nodeMap.set(educationLevel, newNode);
      }
      if (!nodeMap.has(incomeBracket)) {
        const newNode = { name: incomeBracket };
        nodes.push(newNode);
        nodeMap.set(incomeBracket, newNode);
      }
    });


    nodes.forEach(node => {
      if (node.name.includes("<") || node.name.includes("10000") || node.name.includes("20000") || node.name.includes("30000") || node.name.includes("+")) {
        node.type = "income";
      } else if (node.name.includes("Level")) {
        node.type = "education";
      } else {
        node.type = "country";
      }
    });

    filteredData.forEach(d => {
      const country = nodeMap.get(d['Country'].trim());
      const educationLevel = nodeMap.get(d['Educational Level'].trim());
      const incomeBracket = nodeMap.get(this.incomeBracket(parseFloat(d['Income'])));
      const value = parseFloat(d['Population Percent']);

      if (country && educationLevel && !isNaN(value) && value > 0) {
        links.push({ source: country, target: educationLevel, value });
      }

      if (educationLevel && incomeBracket && !isNaN(value) && value > 0) {
        links.push({ source: educationLevel, target: incomeBracket, value, country: country.name });
      }
    });


    const sankeyGraph: SankeyGraph<any, any> = sankey()
      .nodeWidth(20)
      .nodePadding(15)
      .extent([[1, 1], [this.width - 1, this.height - 5]])
      ({ nodes, links });

    const colorScale = d3.scaleOrdinal()
      .domain(['country', 'education', 'income'])
      .range(['#1f77b4', '#ff7f0e', '#2ca02c']);

    const linkPath = sankeyLinkHorizontal();

    svg.append("g")
      .selectAll("path")
      .data(sankeyGraph.links)
      .enter()
      .append("path")
      .attr("d", linkPath)
      .attr("stroke", "#666")
      .attr("stroke-width", d => Math.max(1, d.width))
      .attr("fill", "none")
      .attr("opacity", 0.5)

      .on("mouseover", function (event, d) {
        let flowText = `Flow: ${d.source.name} → ${d.target.name}`;
        let countryName = d.country || null;

        if (!countryName && nodes.some(n => n.name === d.source.name && n.type === "education")) {
          const countryLink = sankeyGraph.links.find(l => l.target.name === d.source.name);
          if (countryLink) {
            countryName = countryLink.source.name;
          }
        }

        if (countryName) {
          flowText = `Flow: ${countryName} → ${d.source.name} → ${d.target.name}`;
        }

        tooltip.style("display", "block")
          .html(`<strong>${flowText}</strong><br>Value: ${d.value}%`)
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 10) + "px");
      })

      .on("mouseout", () => tooltip.style("display", "none"));

    const node = svg.append("g")
      .selectAll("g")
      .data(sankeyGraph.nodes)
      .enter()
      .append("g");

    node.append("rect")
      .attr("x", d => d.x0)
      .attr("y", d => d.y0)
      .attr("height", d => d.y1 - d.y0)
      .attr("width", sankey().nodeWidth())
      .attr("fill", d => colorScale(d.type || "country") as string)
      .attr("opacity", 0.8);

    node.append("text")
      .attr("x", d => d.x1 + 10)
      .attr("y", d => (d.y0 + d.y1) / 2)
      .attr("dy", "0.35em")
      .attr("text-anchor", "start")
      .text(d => d.name)
      .attr("fill", "#000")
      .style("font-size", "12px");

    const tooltip = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("display", "none")
      .style("position", "absolute")
      .style("background", "rgba(0, 0, 0, 0.7)")
      .style("color", "white")
      .style("padding", "5px 10px")
      .style("border-radius", "5px")
      .style("font-size", "12px");
  }

  private resizeChart(): void {
    this.width = window.innerWidth * 0.9;
    this.height = window.innerHeight * 2;
    this.createAlluvialChart();
  }

  private incomeBracket(income: number): string {
    if (income < 5000) return "<5000";
    if (income < 10000) return "5000-10000";
    if (income < 20000) return "10000-20000";
    if (income < 30000) return "20000-30000";
    return "30000+";
  }

}
