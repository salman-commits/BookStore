import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BookStoreService } from 'src/app/shared/services/bookstore.service';
import { Book } from '../../shared/models/book.model';
import { convertDateToString } from 'src/app/shared/customvalidators/common-custom.validator';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-book-view',
  templateUrl: './book-view.component.html',
})
export class BookViewComponent {
  panelTitle!: string;
  bookFormGroup!: FormGroup;
  imageBlob: string | undefined;
  bookImageURL!: string;

  constructor(public bookService: BookStoreService, private router: Router,
    public formBuilder: FormBuilder, private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.panelTitle = 'View Book';
    this.route.paramMap.subscribe(params => {
      const bookId = params.get('id');
      if (bookId) {
        this.getBook(bookId);
      }
    });

    this.bookFormGroup = this.formBuilder.group({
      id: [''],
      iSBN: [''],
      title: [''],
      description: [''],
      authorName: [''],
      quantity: [''],
      price: [''],
      publishedDate: [''],
      rating: [''],
      image: [''],
    });

  }

  getBook(id: any) {
    this.bookService.getBookById(id)
      .subscribe(
        (book: Book) => this.viewBook(book),
        (err: any) => console.log(err)
      );
  }

  viewBook(book: Book) {
    this.bookFormGroup.patchValue({
      id: book.Id,
      iSBN: book.ISBN,
      title: book.Title,
      description: book.Description,
      authorName: book.AuthorName,
      quantity: book.Quantity,
      price: book.Price,
      publishedDate: convertDateToString(book.PublishedDate),
      rating: book.Rating,
    });
    this.bookImageURL = `${environment.apiUrl}/` + book.ImageURL;
  }

  getBookImage(id: any) {
    this.bookService.getBookImageById(id)
      .subscribe(
        (imageFile: any) => {
          this.imageBlob = imageFile
        },
        (err: any) => {
          console.log(err)
        }
      );
  }
  Cancel() {
    this.router.navigate(['/booklist'], { queryParams: { returnUrl: "bookstore" } });
  }
}
