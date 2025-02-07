import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-network',
  templateUrl: './network.component.html',
  styleUrls: ['./network.component.css']
})
export class NetworkComponent implements AfterViewInit {
  @ViewChild('chart', { static: true }) chartContainer!: ElementRef;

  private width = window.innerWidth * 0.9;
  private height = window.innerHeight * 0.6;

  ngAfterViewInit(): void {
    this.createNetworkGraph();
    window.addEventListener('resize', () => this.resizeChart());
  }

  private createNetworkGraph(): void {
    const container = this.chartContainer.nativeElement;
    d3.select(container).selectAll('*').remove();

    const svg = d3.select(container)
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height);

    const simulation = d3.forceSimulation()
      .force("link", d3.forceLink().id((d: any) => d.id))
      .force("charge", d3.forceManyBody())
      .force("center", d3.forceCenter(this.width / 2, this.height / 2));

    d3.csv('assets/network.csv').then((data: any) => {
      interface Node {
        id: string;
        x: number;
        y: number;
        fx?: number | null;
        fy?: number | null;
      }

      interface Link {
        source: Node;
        target: Node;
        weight: number;
      }

      const nodes: Node[] = Array.from(new Set(data.flatMap((d: { Source: any; Target: any; }) => [d.Source, d.Target]))).map(id => ({ id: id as string, x: 0, y: 0 }));
      const links: Link[] = data.map((d: { Source: any; Target: any; Weight: string | number; }) => ({ source: nodes.find(n => n.id === d.Source)!, target: nodes.find(n => n.id === d.Target)!, weight: +d.Weight }));

      const link = svg.append("g")
        .attr("stroke", "#999")
        .attr("stroke-opacity", 0.6)
        .selectAll("line")
        .data(links)
        .enter().append("line")
        .attr("stroke-width", d => Math.sqrt(d.weight));

      const node = svg.append("g")
        .attr("stroke", "#fff")
        .attr("stroke-width", 1.5)
        .selectAll("circle")
        .data(nodes)
        .enter().append("circle")
        .attr("r", 10)
        .attr("fill", "steelblue")
        .call(d3.drag<any, any>()
          .on("start", dragStarted)
          .on("drag", dragged)
          .on("end", dragEnded));

      node.append("title")
        .text(d => d.id as string);

      simulation.nodes(nodes).on("tick", () => {
        link.attr("x1", d => d.source.x)
          .attr("y1", d => d.source.y)
          .attr("x2", d => d.target.x)
          .attr("y2", d => d.target.y);

        node.attr("cx", d => d.x)
          .attr("cy", d => d.y);
      });

      const linkForce = simulation.force("link");
      if (linkForce) {
        (linkForce as d3.ForceLink<any, any>).links(links);
      }

      function dragStarted(event: any, d: any) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      }

      function dragged(event: any, d: any) {
        d.fx = event.x;
        d.fy = event.y;
      }

      function dragEnded(event: any, d: any) {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      }
    });
  }

  private resizeChart(): void {
    this.width = window.innerWidth * 0.9;
    this.height = window.innerHeight * 0.6;
    this.createNetworkGraph();
  }
}
