import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { HanumanHomeComponent } from './hanuman-home.component';

const routes: Routes = [
  { path: '', component: HanumanHomeComponent }
];

@NgModule({
  declarations: [HanumanHomeComponent],
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class HanumanHomeModule { }
