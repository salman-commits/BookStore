import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { transformError } from 'src/app/shared/customvalidators/common-custom.validator';
import { OrderService } from 'src/app/shared/services/order.service';
import { ShoppingCartService } from 'src/app/shared/services/shoppingcart.service';

@Component({
  selector: 'app-checkout-payment',
  templateUrl: './checkout-payment.component.html',
  styleUrls: ['./checkout-payment.component.css']
})
export class CheckoutPaymentComponent {
  errorBadRequestList: string[] = [];
  constructor(private orderService: OrderService, private shoppingCartService: ShoppingCartService,
    private toastrService: ToastrService, private router: Router) {
  }

  submitOrder() {
    const order = this.orderService.currentUserOrderSubject();
    if (!order) throw new Error('Cannot get shopping cart basket!');

    this.shoppingCartService.deleteShoppingCartByUser(order.OrderId!)
      .subscribe(
        {
          next: (response: any) => {
            if (response) {
              this.orderService.deletetUserOrderSubject();
              this.shoppingCartService.deleteUserShoppingItemCountSubject();
              this.shoppingCartService.deleteUserShoppingItemDetailsSubject();
              const navigationExtras: NavigationExtras = { state: response };
              this.router.navigate(['checkout/success'], navigationExtras);
            }
            else {
              this.toastrService.error("No books found in shopping cart!");
            }
          },
          error: (error: any) => {
            if (error.status == 400) {
              if (error.error.Message && !error.error.ModelState) {
                this.errorBadRequestList[0] = error.error.Message;
              }
              else {
                this.errorBadRequestList = transformError(error.error.ModelState);
              }
              this.toastrService.error(error.error.Message, 'API Error', {
                timeOut: 3000,
              });
            }
          },
          complete: () => {
          }
        }
      );
  }
}

