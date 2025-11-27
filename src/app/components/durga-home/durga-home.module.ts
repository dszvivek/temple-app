import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { DurgaHomeComponent } from './durga-home.component';

const routes: Routes = [
  { path: '', component: DurgaHomeComponent }
];

@NgModule({
  declarations: [DurgaHomeComponent],
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class DurgaHomeModule { }
