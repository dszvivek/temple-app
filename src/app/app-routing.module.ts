import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TempleSelectorComponent } from './components/temple-selector/temple-selector.component';

const routes: Routes = [
  // Temple Selector - New Home Page (eagerly loaded as it's the landing page)
  { path: '', component: TempleSelectorComponent, pathMatch: 'full', data: { animation: 'TempleSelector' } },
  
  // Hanuman Temple Routes (lazy loaded)
  { 
    path: 'hanuman', 
    loadChildren: () => import('./components/hanuman-home/hanuman-home.module').then(m => m.HanumanHomeModule),
    data: { animation: 'Hanuman' } 
  },
  { 
    path: 'hanuman/wish', 
    loadChildren: () => import('./components/wish-flow/wish-flow.module').then(m => m.WishFlowModule),
    data: { deity: 'hanuman', animation: 'Wish' } 
  },
  
  // Ganesh Temple Routes (lazy loaded)
  { 
    path: 'ganesh', 
    loadChildren: () => import('./components/ganesh-home/ganesh-home.module').then(m => m.GaneshHomeModule),
    data: { animation: 'Ganesh' } 
  },
  { 
    path: 'ganesh/wish', 
    loadChildren: () => import('./components/wish-flow/wish-flow.module').then(m => m.WishFlowModule),
    data: { deity: 'ganesh', animation: 'Wish' } 
  },
  
  // Shared Routes (lazy loaded)
  { 
    path: 'donate', 
    loadChildren: () => import('./components/donate/donate.module').then(m => m.DonateModule),
    data: { animation: 'Donate' } 
  },
  
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
