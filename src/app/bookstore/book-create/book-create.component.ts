import { Component, OnInit } from '@angular/core';
import { BookViewModel } from '../../shared/models/book.model';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { BookStoreService } from 'src/app/shared/services/bookstore.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { convertDateToString, lessThanTodayDate, requiredFileType, transformError } from 'src/app/shared/customvalidators/common-custom.validator';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-book-create',
  templateUrl: './book-create.component.html'
})
export class BookCreateComponent implements OnInit {

  bookModel: BookViewModel = new BookViewModel();
  bookFormGroup!: FormGroup;
  bookImage!: File;
  allowedFileTypes: string[] = ["jpg", "png"];
  bookAction!: string;
  bookId!: string | null;
  currentUser: any;
  errorBadRequestList: string[] = [];

  constructor(
    private bookService: BookStoreService,
    private router: Router,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private toastrService: ToastrService
  ) {
  }

  ngOnInit() {
    this.bookAction = 'Create';
    this.route.paramMap.subscribe(params => {
      this.bookId = params.get('id');
      if (this.bookId) {
        this.getBook(this.bookId);
      }
    });

    this.bookFormGroup = this.formBuilder.group({
      id: [''],
      isbn: [''],
      title: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(50)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
      authorName: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(50)]],
      quantity: ['', [Validators.required, Validators.pattern(/^[1-9]\d*$/)]],
      price: ['', [Validators.required, Validators.pattern(/^[1-9]\d*$/)]],
      publishedDate: ['',
        [Validators.required, Validators.pattern(/^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/),
        lessThanTodayDate()]],
      rating: ['', [Validators.required, Validators.pattern(/^[1-5]\d*$/)]],
      image: ['', [Validators.required, requiredFileType(this.allowedFileTypes)]],
      categories: ['', [Validators.required]]
    });

    this.bookFormGroup.valueChanges.subscribe((data) => {
      this.logValidationErrors(this.bookFormGroup);
    });

    if (this.bookId == null) {
      this.bookService.getBookForCreate().subscribe
        ((book: BookViewModel) => {
          this.bookModel = book;
          this.bookFormGroup.get('isbn')?.setValue(book.ISBN);
        });
    }
  }
  // This object contains all the validation messages for this form
  validationMessages = {
    'title': {
      'required': 'Title is required.',
      'minlength': 'Title must be greater than 5 characters.',
      'maxlength': 'Title must be less than 50 characters.'
    },
    'description': {
      'required': 'Description is required.',
      'minlength': 'Description must be greater than 10 characters.',
      'maxlength': 'Description must be less than 200 characters.'
    },
    'authorName': {
      'required': 'Author Name is required.',
      'minlength': 'Author Name must be greater than 5 characters.',
      'maxlength': 'Author Name must be less than 50 characters.'
    },
    'quantity': {
      'required': 'Quantity is required.',
      'pattern': 'Quantity should be greater than zero and should not contain special characters.'
    },
    'price': {
      'required': 'Price is required.',
      'pattern': 'Price should be greater than zero and should not contain special characters.'
    },
    'publishedDate': {
      'required': 'Published Date is required.',
      'lessThanTodayDate': 'Published date cannot be greater than todays date.'
    },
    'rating': {
      'required': 'Rating is required.',
      'pattern': 'Rating should be between one and five and should not contain special characters.'
    },
    'image': {
      'required': 'Image is required.',
      'requiredFileType': 'Image can be of type jpg or png only'
    },
    'categories': {
      'required': 'Category is required.'
    }
  };
  formErrors = {
    'title': '',
    'description': '',
    'authorName': '',
    'quantity': '',
    'price': '',
    'publishedDate': '',
    'rating': '',
    'image': '',
    'categories': ''
  };

  getBook(id: any) {
    this.bookService.editBookById(id)
      .subscribe(
        (book: BookViewModel) => this.editBook(book),
        (err: any) => console.log(err)
      );
  }

  editBook(book: BookViewModel) {
    this.bookModel = book;
    this.bookAction = 'Edit';
    this.bookFormGroup.patchValue({
      id: book.Id,
      isbn: book.ISBN,
      title: book.Title,
      description: book.Description,
      authorName: book.AuthorName,
      quantity: book.Quantity,
      price: book.Price,
      publishedDate: convertDateToString(book.PublishedDate),
      rating: book.Rating,
    });
    this.bookFormGroup.get('categories')?.setValue(book.BookCategoryId);
  }

  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      this.bookImage = event.target.files[0];
    }
  }

  logValidationErrors(group: FormGroup = this.bookFormGroup): void {
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
            }
          }
        }
      }
    });
  }

  mapFormBuilderToFormData(): FormData {
    const formData = new FormData();
    formData.append('Id', this.bookFormGroup.get('id')?.value);
    formData.append('ISBN', this.bookFormGroup.get('isbn')?.value);
    formData.append('Title', this.bookFormGroup.get('title')?.value);
    formData.append('AuthorName', this.bookFormGroup.get('authorName')?.value);
    formData.append('Description', this.bookFormGroup.get('description')?.value);
    formData.append('Price', this.bookFormGroup.get('price')?.value);
    formData.append('Rating', this.bookFormGroup.get('rating')?.value);
    formData.append('Quantity', this.bookFormGroup.get('quantity')?.value);
    formData.append('PublishedDate', this.bookFormGroup.get('publishedDate')?.value);
    formData.append('Image', this.bookImage);
    formData.append('BookCategoryId', this.bookFormGroup.get('categories')?.value);
    if (this.currentUser!) {
      formData.append('CreatedBy', this.currentUser.Email.toString());
    }
    return formData;
  }

  public onSubmit() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser')!);
    const formData = this.mapFormBuilderToFormData();
    this.bookService.createUpdateBook(formData).subscribe(
      (result) => {
        let actionMsg = 'Created';
        if (this.bookFormGroup.get('id')?.value) {
          actionMsg = 'Edited';
        }
        this.toastrService.success('Book ' + actionMsg + ' Successfully!', 'Success!', {
          timeOut: 3000,
        });
        this.router.navigate(['/booklist'], { queryParams: { returnUrl: "bookstore" } });
      },
      (error: HttpErrorResponse) => {
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

      }
    );
  }
  Cancel() {
    this.router.navigate(['/booklist'], { queryParams: { returnUrl: "bookstore" } });
  }
}