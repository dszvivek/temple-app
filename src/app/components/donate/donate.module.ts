import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { DonateComponent } from './donate.component';

const routes: Routes = [
  { path: '', component: DonateComponent }
];

@NgModule({
  declarations: [DonateComponent],
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class DonateModule { }
