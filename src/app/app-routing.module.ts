import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TempleSelectorComponent } from './components/temple-selector/temple-selector.component';
import { HanumanHomeComponent } from './components/hanuman-home/hanuman-home.component';
import { GaneshHomeComponent } from './components/ganesh-home/ganesh-home.component';
import { HomeComponent } from './components/home/home.component';
import { WishFlowComponent } from './components/wish-flow/wish-flow.component';
import { DonateComponent } from './components/donate/donate.component';

const routes: Routes = [
  // Temple Selector - New Home Page
  { path: '', component: TempleSelectorComponent, pathMatch: 'full' },
  
  // Hanuman Temple Routes
  { path: 'hanuman', component: HanumanHomeComponent },
  { path: 'hanuman/wish', component: WishFlowComponent, data: { deity: 'hanuman' } },
  
  // Ganesh Temple Routes
  { path: 'ganesh', component: GaneshHomeComponent },
  { path: 'ganesh/wish', component: WishFlowComponent, data: { deity: 'ganesh' } },
  
  // Shared Routes
  { path: 'donate', component: DonateComponent },
  
  // Legacy Routes (backward compatibility)
  { path: 'home', redirectTo: 'hanuman', pathMatch: 'full' },
  { path: 'wish', redirectTo: 'hanuman/wish', pathMatch: 'full' },
  
  // Catch-all redirect
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    useHash: false,
    scrollPositionRestoration: 'top'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
