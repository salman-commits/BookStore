import { NgModule } from '@angular/core';
import { Router, RouterModule, Routes } from '@angular/router';
import { CheckOutComponent } from './checkout.component';
import { CheckoutSuccessComponent } from './checkout-success/checkout-success.component';

const routes: Routes = [
  { path: '', title: 'CheckOut', component: CheckOutComponent  },
  { path: 'success', title: 'CheckOut Success', component: CheckoutSuccessComponent  }
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CheckOutRoutingModule {
  constructor(private router: Router) {
    this.router.errorHandler = (error: any) => {      
      console.log(error);
    }
  }
}