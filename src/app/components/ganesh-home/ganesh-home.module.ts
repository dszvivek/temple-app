import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { GaneshHomeComponent } from './ganesh-home.component';

const routes: Routes = [
  { path: '', component: GaneshHomeComponent }
];

@NgModule({
  declarations: [GaneshHomeComponent],
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class GaneshHomeModule { }
