import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BarchartComponent } from "../barchart/barchart.component";
import { StackedbarchartComponent } from "../stackedbarchart/stackedbarchart.component";
import { StackedbarchartmultComponent } from '../stackedbarchartmult/stackedbarchartmult.component';
import { Stackedbarchart100Component } from '../stackedbarchart100/stackedbarchart100.component';
import { HeatmapComponent } from "../heatmap/heatmap.component";
import { ChloroplethComponent } from "../chloropleth/chloropleth.component";
import { BarComponent } from '../bar/bar.component';
import { BubbleComponent } from '../bubble/bubble.component';
import { LineComponent } from '../line/line.component';
import { NetworkComponent } from '../network/network.component';
import { PieComponent } from '../pie/pie.component';
import { ScatterComponent } from '../scatter/scatter.component';
import { StackedbarComponent } from '../stackedbar/stackedbar.component';
import { StackedareaComponent } from '../stackedarea/stackedarea.component';

@Component({
  selector: 'app-compcat',
  standalone: true,
  imports: [RouterModule, BarchartComponent, StackedbarchartComponent, StackedbarchartmultComponent, Stackedbarchart100Component, HeatmapComponent, 
    ChloroplethComponent, BarComponent, BubbleComponent, LineComponent, NetworkComponent, PieComponent, ScatterComponent, StackedbarComponent, StackedareaComponent],
  templateUrl: './compcat.component.html',
  styleUrl: './compcat.component.css'
})
export class CompcatComponent {

}
