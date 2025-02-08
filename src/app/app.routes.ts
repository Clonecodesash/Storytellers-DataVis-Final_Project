import { Routes } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';
import { VizComponent } from './viz/viz.component';

export const routes: Routes = [
    { path: '', component: HomepageComponent },
    { path: 'visualizations', component: VizComponent},
];
