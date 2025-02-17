import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrdersComponent } from './orders.component';
import { OrderDetailedComponent } from './order-detailed/order-detailed.component';

const routes: Routes = [
  { path: '', component: OrdersComponent },
  { path: ':OrderId', component: OrderDetailedComponent }
]

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class OrdersRoutingModule { }
