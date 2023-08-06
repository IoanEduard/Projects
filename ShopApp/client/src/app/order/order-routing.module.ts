import { NgModule } from '@angular/core';
import { OrderDetailsComponent } from './order-details/order-details.component';
import { OrderComponent } from './order.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', component: OrderComponent },
  { path: ':id', component: OrderDetailsComponent, data: { breadcrumb: { alias: 'OrderDetailed' } } }
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes),
    
  ],
  exports: [
    RouterModule
  ]
})
export class OrderRoutingModule { }
