import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { KrishnaHomeComponent } from './krishna-home.component';

const routes: Routes = [
  { path: '', component: KrishnaHomeComponent }
];

@NgModule({
  declarations: [KrishnaHomeComponent],
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class KrishnaHomeModule { }
