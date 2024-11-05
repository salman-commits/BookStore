import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs';
import { BookCategory } from 'src/app/shared/models/book.model';
import { BookStoreService } from 'src/app/shared/services/bookstore.service';

@Component({
  selector: 'app-book-category',
  templateUrl: './book-category.component.html',
  styleUrls: ['./book-category.component.css']
})
export class BookCategoryComponent {
  bookCategories: Array<BookCategory> = new Array<BookCategory>();
  constructor(
    public bookService: BookStoreService) {
    this.getBookCategories();
  }

  getBookCategories() {
    this.bookService.getBookCategories()
      .pipe(first())
      .subscribe(
        (bookCategories: Array<BookCategory>) => {
          console.log('inside getBookCategories!!!!!!!!!!!!!!!!!!');
          console.log(bookCategories);
          this.bookCategories = bookCategories;
        },
        (err: any) => {
          console.log('erorr inside getBookCategories..............');
          console.log(err);
          console.log(err.message, JSON.parse(err.error).error.message);
        }
      );
  }
}
