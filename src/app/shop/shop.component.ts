import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Book, BookCategory } from '../shared/models/book.model';
import { BookFilter } from '../shared/models/bookfilter.model';
import { BookStoreService } from '../shared/services/bookstore.service';
import { environment } from 'src/environments/environment';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { transformError } from '../shared/customvalidators/common-custom.validator';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})

export class ShopComponent implements OnInit {

  @ViewChild('search') searchTerm?: ElementRef;

  books: Book[] = [];
  categories: BookCategory[] = [];
  bookParams!: BookFilter;
  returnUrl: string | undefined;

  sortOptions = [
    { name: 'Alphabetical', value: 'AuthorName' },
    { name: 'Price: Low to high', value: 'priceAsc' },
    { name: 'Price: High to low', value: 'priceDesc' },
  ];
  totalCount = 0;
  errorBadRequestList: string[]=[];

  constructor(private bookService: BookStoreService, private route: ActivatedRoute, private spinner: NgxSpinnerService
    , private toastrService: ToastrService
  ) {
    this.bookParams = bookService.getBookFilter();
  }

  ngOnInit(): void {

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'];
    console.log('reading this.returnUrl', this.returnUrl);

    if (this.returnUrl != 'shop') {
      console.log('inside this.returnUrl');
      this.bookParams = new BookFilter();
      this.bookService.setBookFilter(this.bookParams);
    }
    this.getBooks();
    this.getCategories();
  }

  getBooks() {
    this.spinner.show();

    this.bookService.getBooksFromAPI()
      .subscribe({
        next: (response: any) => {          
          if (response) {
            let filteredBooks: Book[] = response.Books;

            filteredBooks.forEach((resObject) => {
              resObject.ImageURL = `${environment.apiUrl}` + '/' + resObject.ImageURL;
              resObject.ImageThumbnailURL = `${environment.apiUrl}` + '/' + resObject.ImageThumbnailURL;
            });            
            this.books = filteredBooks;
            this.totalCount = response.TotalItems;
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
          this.spinner.hide();
        }
      });
  }

  getCategories() {
    this.bookService.getBookCategories()
      .subscribe({
        next: (response: Array<BookCategory>) => {          
          this.categories = [{ BookCategoryId: 0, BookCategoryName: 'All' }, ...response];
        },
        error: error => console.log(error),
        complete: () => {          
        }
      });
  }

  onCategoriesSelected(id: any) {
    const params = this.bookService.getBookFilter();
    params.BookCategoryId = id;
    params.PageNumber = 1;
    this.bookService.setBookFilter(params);
    this.bookParams = params;
    this.getBooks();
  }
  
  onPageChanged(event: any) {
    const params = this.bookService.getBookFilter();
    if (params.PageNumber !== event) {
      params.PageNumber = event;
      this.bookService.setBookFilter(params);
      this.bookParams = params;
      this.getBooks();
    }
  }

  onSearch() {
    const params = this.bookService.getBookFilter();
    params.SearchString = this.searchTerm?.nativeElement.value;
    params.PageNumber = 1;
    this.bookService.setBookFilter(params);
    this.bookParams = params;
    this.getBooks();
  }

  onReset() {
    if (this.searchTerm) this.searchTerm.nativeElement.value = '';
    this.bookParams = new BookFilter();
    this.bookService.setBookFilter(this.bookParams);
    this.getBooks();
  }

}
