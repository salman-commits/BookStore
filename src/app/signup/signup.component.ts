import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../shared/services/authentication.service';
import { emailValidator, transformError } from '../shared/customvalidators/common-custom.validator';
import { Role, User } from '../shared/models/user.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  signupFormGroup!: FormGroup;
  returnUrl: string | undefined;
  error = '';
  userRoles: Role[] = [];
  user!: User;
  errorBadRequestList: string[] = [];

  // This object contains all the validation messages for this form
  validationMessages = {
    'firstName': {
      'required': 'First Name is required.',
      'minlength': 'First Name must be greater than 1 characters.',
      'maxlength': 'First Name must be less than 15 characters.'
    },
    'lastName': {
      'required': 'Last Name is required.',
      'minlength': 'Last Name must be greater than 1 characters.',
      'maxlength': 'Last Name must be less than 15 characters.'
    },
    'email': {
      'required': 'Email address is required.',
      'emailValidator': 'Email address is in invalid format.'
    },
    'password': {
      'required': 'Password is required.',
      'minlength': 'Password must be greater than 5 characters.',
      'maxlength': 'Password must be less than 10 characters.'
    },
    'userRoles': {
      'required': 'User role is required.'
    }
  };
  // This object will hold the messages to be displayed to the user// Notice, each key in this object has the same name as the
  // corresponding form control
  formErrors = {
    'firstName': '',
    'lastName': '',
    'email': '',
    'password': '',
    'userRoles': ''
  };

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private toastrService: ToastrService
  ) {
    // redirect to home if already logged in
    if (this.authenticationService.currentUserValue) {      
      this.router.navigate(['/']);
      // get return url from route parameters or default to '/'
      this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';      
    }
  }

  ngOnInit() {
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';    
    this.signupFormGroup = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(15)]],
      lastName: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(15)]],
      email: ['', [Validators.required, emailValidator()]],
      password: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(15)]],
      userRoles: ['', [Validators.required]]
    });

    // When any of the form control value in employee form changes
    // our validation function logValidationErrors() is called
    this.signupFormGroup.valueChanges.subscribe((data) => {
      this.logValidationErrors(this.signupFormGroup);
    });
    this.getUserRoles();
  }

  logValidationErrors(group: FormGroup = this.signupFormGroup): void {
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
  get f() { return this.signupFormGroup?.controls; }

  getUserRoles() {
    this.authenticationService.getUserRoles()
      .subscribe({
        next: (response: Array<Role>) => {          
          this.userRoles = response;
        },
        error: error => console.log(error),
        complete: () => {          
        }
      });
  }

  onSubmit() {
    // stop here if form is invalid
    if (this.signupFormGroup?.invalid) {
      return;
    }
    this.user = new User();
    this.user = Object.assign(this.user!, this.signupFormGroup.value);
    let roleIdValue = 0;
    if (this.f!['userRoles']?.value != "") {
      roleIdValue = this.f!['userRoles']?.value;
    }
    this.user.RoleId = roleIdValue;    
    this.authenticationService.SignUpUser(this.user).
      subscribe({
        next: (response: any) => {
          this.toastrService.success('User sign up completed successfully', '', {
            timeOut: 5000,
          });
          this.router.navigateByUrl("/login");
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
      });
  }
}