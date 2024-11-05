import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { transformError } from 'src/app/shared/customvalidators/common-custom.validator';
import { Address, AddressType } from 'src/app/shared/models/address.model';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { OrderService } from 'src/app/shared/services/order.service';
import { ShoppingCartService } from 'src/app/shared/services/shoppingcart.service';

@Component({
  selector: 'app-checkout-address',
  templateUrl: './checkout-address.component.html',
  styleUrls: ['./checkout-address.component.css']
})
export class CheckoutAddressComponent implements OnInit {

  addressType1: AddressType[] = [];
  isPrimary: Boolean = true;
  errorBadRequestList: string[] = [];
  isValidAddress: boolean = false;
  @Output() onAllowed = new EventEmitter<boolean>();
  @Input() checkoutForm?: FormGroup;
  @Input() isAddressAvailable = false;

  constructor(private authenticationService: AuthenticationService,
    private toastrService: ToastrService,
    private orderService: OrderService,
    private shoppingCartService: ShoppingCartService
  ) {
  }
  ngOnInit(): void {
    this.getAddressType();
    this.checkoutForm?.get
    this.isValidAddress = false;

    if (this.isAddressAvailable) {
      this.isValidAddress = true;
      this.setHide(true);
    }
    else {
      this.isValidAddress = false;
      this.setHide(false);
    }
  }

  // This object contains all the validation messages for this form
  validationMessages = {
    'firstName': {
      'required': 'First Name is required.'
    },
    'lastName': {
      'required': 'Last Name is required.'
    },
    'addressLine1': {
      'required': 'Address Line 1 is required.'
    },
    'city': {
      'required': 'City is required.'
    },
    'state': {
      'required': 'State is required.'
    },
    'country': {
      'required': 'Country is required.'
    },
    'zipCode': {
      'required': 'Zip Code is required.',
      'pattern': 'Zip Code should be greater than zero and should not contain alphabet or special characters.'
    },
    'phoneNumber': {
      'required': 'Phone Number is required.',
      'pattern': 'Phone Number should be greater than zero and should not contain alphabet or special characters.'
    },
  };

  formErrors = {
    'addressLine1': '',
    'city': '',
    'state': '',
    'country': '',
    'zipCode': '',
    'phoneNumber': ''
  };

  getAddressType() {
    this.orderService.getAddressType()
      .subscribe({
        next: (response: Array<AddressType>) => {
          this.addressType1 = response;
        },
        error: error => console.log(error),
        complete: () => {
        }
      });
  }
  setHide(allowed: boolean) {
    this.onAllowed.emit(allowed);
  }
  setUserAddress(address: Address) {
    this.errorBadRequestList = [];
    this.isValidAddress = false;
    this.setHide(false);

    address.AddressTypeId = this.checkoutForm!.get(['addressForm', 'addressType1'])?.value;
    this.orderService.setOrder(address, undefined)
      .subscribe({
        next: order => {
          this.isValidAddress = true;
          this.setHide(true);

          this.toastrService.success('Address saved successfully', 'Success!', {
            timeOut: 5000,
          });
          if (order.DeliveryMethodId) {
            this.checkoutForm!.patchValue({
              deliveryForm: {
                deliveryMethod: order.DeliveryMethodId?.toString()
              }
            });
          }
          this.orderService.setUserOrderSubject(order);

          this.shoppingCartService.getShoppingCartDetailsByUser()
            .subscribe({
              next: (basket: any) => {
              },
              error: error => console.log(error),
              complete: () => {
              }
            });
        },
        error: (error: any) => {
          this.isValidAddress = false;
          this.setHide(false);
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
      });
  }

  logValidationErrors(group: FormGroup = this.checkoutForm!): void {
    // Loop through each control key in the FormGroup
    Object.keys(group.controls).forEach((key: string) => {
      // Get the control. The control can be a nested form group
      const abstractControl = group.get(key);
      // If the control is nested form group, recursively call
      // this same method
      if (abstractControl instanceof FormGroup) {
        this.logValidationErrors(abstractControl);
        // If the control is a FormControl
      } else {
        // Clear the existing validation errors
        // @ts-ignore
        this.formErrors[key] = '';
        if (abstractControl && !abstractControl.valid
          && (abstractControl.touched || abstractControl.dirty || abstractControl.value !== '')) {
          // Get all the validation messages of the form control
          // that has failed the validation
          // @ts-ignore
          const messages = this.validationMessages[key];
          // Find which validation has failed. For example required,
          // minlength or maxlength. Store that error message in the
          // formErrors object. The UI will bind to this object to
          // display the validation errors
          for (const errorKey in abstractControl.errors) {
            if (errorKey) {
              // @ts-ignore
              this.formErrors[key] += messages[errorKey] + ' ';

              //console.log(this.formErrors);
            }
          }
        }
      }
    });
  }

  getAddressBasedOnType(addressTypeId: number) {
    this.errorBadRequestList = [];
    this.isValidAddress = false;
    this.setHide(false);

    this.orderService.getAddressBasedOnType(addressTypeId)
      .subscribe({
        next: (response: Address) => {
          if (response) {
            this.checkoutForm!.patchValue({
              addressForm: {
                addressLine1: response.AddressLine1,
                addressLine2: response.AddressLine2,
                country: response.Country,
                city: response.City,
                state: response.State,
                zipCode: response.ZipCode?.toString(),
                phoneNumber: response.PhoneNumber?.toString(),
                addressType1: response.AddressTypeId?.toString()
              }
            });
            if (!this.checkoutForm?.get('addressForm')?.invalid) {
              this.isValidAddress = true;
              this.setHide(true);
            }
          }
          else {
            this.checkoutForm!.patchValue({
              addressForm: {
                addressLine1: '',
                addressLine2: '',
                country: '',
                city: '',
                state: '',
                zipCode: '',
                phoneNumber: '',
              }
            });
          }
        },
        error: error => console.log(error),
        complete: () => {
        }
      });
  }
}
