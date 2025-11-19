import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { WishFlowComponent } from './wish-flow.component';

const routes: Routes = [
  { path: '', component: WishFlowComponent }
];

@NgModule({
  declarations: [WishFlowComponent],
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class WishFlowModule { }
