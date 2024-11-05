import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OrderService } from '../shared/services/order.service';
import { ShoppingCartService } from '../shared/services/shoppingcart.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckOutComponent implements OnInit {

  isValidNext: boolean = false;
  isAddressAvailable: boolean = false;
  constructor(public shoppingCartService: ShoppingCartService, public orderService: OrderService, private router: Router, private fb: FormBuilder) {
  }

  changeAction(val: boolean) {
    this.isValidNext = val;
  }

  ngOnInit(): void {
    let userShopItem = this.shoppingCartService.currentUserShoppingItemCountValue;
    if (userShopItem == 0) {
      this.router.navigateByUrl("/shop");
    }
    this.getUserCheckOutDetails();
  }

  checkoutForm = this.fb.group({
    addressForm: this.fb.group({
      addressLine1: ['', Validators.required],
      addressLine2: [''],
      country: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zipCode: ['', [Validators.required, Validators.pattern(/^[1-9]\d*$/)]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^[1-9]\d*$/)]],
      addressType1: ['', Validators.required]
    }),
    deliveryForm: this.fb.group({
      deliveryMethod: ['', Validators.required]
    }),
    paymentForm: this.fb.group({
      nameOnCard: ['', Validators.required]
    })
  })


  getUserCheckOutDetails() {
    this.orderService.getUserCheckOutDetails().subscribe({
      next: order => {
        this.isAddressAvailable = false;
        if (order) {
          this.checkoutForm.patchValue({
            addressForm: {
              addressLine1: order.Address?.AddressLine1,
              addressLine2: order.Address?.AddressLine2,
              country: order.Address?.Country,
              city: order.Address?.City,
              state: order.Address?.State,
              zipCode: order.Address?.ZipCode?.toString(),
              phoneNumber: order.Address?.PhoneNumber?.toString(),
              addressType1: order.Address?.AddressTypeId?.toString()
            }
          });
          this.checkoutForm.patchValue({
            deliveryForm: {
              deliveryMethod: order.DeliveryMethodId?.toString()
            }
          });
          if (order.Address?.AddressId! > 0) {
            this.isAddressAvailable = true;
          }
        }
      }
    })
  }
}
