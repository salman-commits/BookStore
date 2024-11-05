import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { transformError } from 'src/app/shared/customvalidators/common-custom.validator';
import { DeliveryMethod } from 'src/app/shared/models/order.model';
import { OrderService } from 'src/app/shared/services/order.service';
import { ShoppingCartService } from 'src/app/shared/services/shoppingcart.service';

@Component({
  selector: 'app-checkout-delivery',
  templateUrl: './checkout-delivery.component.html',
  styleUrls: ['./checkout-delivery.component.css']
})
export class CheckoutDeliveryComponent {
  deliveryMethods: DeliveryMethod[] = [];
  errorBadRequestList: string[] = [];

  @Input() checkoutForm?: FormGroup;
  constructor(private orderService: OrderService, 
    private shoppingCartService: ShoppingCartService,
    private toastrService: ToastrService,
  ) {
  }
  ngOnInit(): void {
    this.getDeliveryMethod();
  } 

  getDeliveryMethod() {
    this.orderService.getDeliveryMethod()
      .subscribe(
        {
          next: (response: any) => {            
            this.deliveryMethods = response;          
          },
          error: error => console.log(error),
          complete: () => {            
          }
        }
      );
  }

  setShippingPrice(deliveryMethodId: number) {    
    //this.orderService.setShippingPrice(deliveryMethodId);
    this.orderService.setOrder(undefined,deliveryMethodId)
    .subscribe({
      next: (response: any) => {
        this.checkoutForm?.get('deliveryForm')?.reset(this.checkoutForm?.get('deliveryForm')?.value);
        this.toastrService.success('Shipping delivery saved successfully', 'Success', {
          timeOut: 3000,
        });
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
        this.getShoppingCartDetailItems();        
      }
    });    
  }

  getShoppingCartDetailItems() {
    this.shoppingCartService.getShoppingCartDetailsByUser()
      .subscribe({
        next: (basket: any) => {          
        },
        error: error => console.log(error),
        complete: () => {          
        }
      });
  }
}