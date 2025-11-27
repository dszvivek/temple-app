import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { ShivaHomeComponent } from './shiva-home.component';

const routes: Routes = [
  { path: '', component: ShivaHomeComponent }
];

@NgModule({
  declarations: [ShivaHomeComponent],
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class ShivaHomeModule { }
