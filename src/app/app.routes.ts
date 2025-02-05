import { Routes } from '@angular/router';
import { AlluvialComponent } from './alluvial/alluvial.component';
import { CompcatComponent } from './compcat/compcat.component';
import { HomepageComponent } from './homepage/homepage.component';
import { MapsComponent } from './maps/maps.component';
import { TimelinesComponent } from './timelines/timelines.component';

export const routes: Routes = [
    { path: '', component: HomepageComponent },
    { path: 'comparing-categories', component: CompcatComponent},
    { path: 'alluvial', component: AlluvialComponent },
    { path: 'maps', component: MapsComponent },
    { path: 'timelines', component: TimelinesComponent}
];
