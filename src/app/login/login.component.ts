import { Component, OnChanges, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '../shared/services/authentication.service';
import { first } from 'rxjs';
import { emailValidator, transformError } from '../shared/customvalidators/common-custom.validator';
import { ShoppingCartService } from '../shared/services/shoppingcart.service';
import { ToastrService } from 'ngx-toastr';
import { Role } from '../shared/models/user.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnChanges {
  //show hide div variables
  userlogin = true;
  userregister = false;
  errorBadRequestList: string[] = [];
  loginFormGroup!: FormGroup;  
  returnUrl: string | undefined;
  error = ''; 

  // This object contains all the validation messages for this form
  validationMessages = {
    'email': {
      'required': 'Email address is required.',
      'emailValidator': 'Email address is in invalid format.'
    },
    'password': {
      'required': 'Password is required.'
    }
  };
  // This object will hold the messages to be displayed to the user// Notice, each key in this object has the same name as the
  // corresponding form control
  formErrors = {
    'email': '',
    'password': ''
  };

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private shoppingCartService: ShoppingCartService,
    private toastrService: ToastrService
  ) {
    // redirect to home if already logged in
    if (this.authenticationService.currentUserValue) {
      this.router.navigate(['/']);
      // get return url from route parameters or default to '/'
      this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }
  }
  ngOnChanges(): void {
  }

  ngOnInit() {
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    this.loginFormGroup = this.formBuilder.group({
      email: ['', [Validators.required, emailValidator()]],
      password: ['', Validators.required]
    });

    // When any of the form control value in employee form changes
    // our validation function logValidationErrors() is called
    this.loginFormGroup.valueChanges.subscribe((data) => {
      this.logValidationErrors(this.loginFormGroup);
    });
  }


  logValidationErrors(group: FormGroup = this.loginFormGroup): void {
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
  // convenience getter for easy access to form fields
  get f() { return this.loginFormGroup?.controls; }

  onSubmit() {
    //this.submitted = true;
    // stop here if form is invalid
    if (this.loginFormGroup?.invalid) {
      return;
    }

    this.authenticationService.getAccessToken(this.f!['email']?.value, this.f!['password'].value)
      .pipe(first())
      .subscribe(
        {
          next: (response: any) => {
            this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
            this.router.navigate([this.returnUrl]);
          },
          error: (error: any) => {
            console.log(error);
            if (error.error.error) {
              this.error = error.error.error + ', ' + error.error.error_description;
            } else if (error.statusText == 'Unknown Error') {
              this.error = 'please contact your administrator, backend API services are down!';
            }

            if (error.status == 400) {
              this.errorBadRequestList = transformError(error.error.ModelState);
              this.toastrService.error(error.error.error, 'API Error', {
                timeOut: 3000,
              });
            }
          },
          complete: () => {
            this.getShoppingCartQtyByUser();
          }
        }
      );
  }
  getShoppingCartQtyByUser() {
    this.shoppingCartService.getShoppingCartTotalCountByUser()
      .subscribe(
        {
          next: (response: any) => {
          },
          error: error => console.log(error),
          complete: () => {
          }
        }
      );
  }  
}
