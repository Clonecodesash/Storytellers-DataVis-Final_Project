import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HeatmapComponent } from "../heatmap/heatmap.component";
import { ChoroplethComponent } from "../choropleth/choropleth.component";
import { BarComponent } from '../bar/bar.component';
import { BubbleComponent } from '../bubble/bubble.component';
import { LineComponent } from '../line/line.component';
import { NetworkComponent } from '../network/network.component';
import { PieComponent } from '../pie/pie.component';
import { ScatterComponent } from '../scatter/scatter.component';
import { StackedbarComponent } from '../stackedbar/stackedbar.component';
import { StackedareaComponent } from '../stackedarea/stackedarea.component';

@Component({
  selector: 'app-viz',
  templateUrl: './viz.component.html',
  imports: [RouterModule, HeatmapComponent, ChoroplethComponent, BarComponent, BubbleComponent, LineComponent, NetworkComponent, PieComponent, ScatterComponent, StackedbarComponent, StackedareaComponent],
  styleUrls: ['./viz.component.css']
})
export class VizComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
