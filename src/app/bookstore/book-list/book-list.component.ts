import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { Book } from '../../shared/models/book.model';
import { BookStoreService } from 'src/app/shared/services/bookstore.service';
import { first } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { BookFilter } from 'src/app/shared/models/bookfilter.model';

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html'
})
export class BookListComponent implements OnInit {
  @ViewChild('search') searchTerm?: ElementRef;
  bookModel: Book = new Book();
  bookModels: Array<Book> = new Array<Book>();
  imageBlob: string | undefined;
  bookCategoryId!: string;
  isShow!: boolean;
  topPosToStartShowing = 100;
  bookParams!: BookFilter;
  totalCount = 0;
  returnUrl: string | undefined;

  @HostListener('window:scroll')
  checkScroll() {
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;

    if (scrollPosition >= this.topPosToStartShowing) {
      this.isShow = true;
    } else {
      this.isShow = false;
    }
  }

  constructor(private bookService: BookStoreService, private toastrService: ToastrService,
    private route: ActivatedRoute, private router: Router) {
  }

  ngOnInit() {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'];
    if (this.returnUrl != 'bookstore') {
      this.bookParams = new BookFilter();
      this.bookService.setBookFilter(this.bookParams);
    }
    this.route.paramMap.subscribe(params => {
      this.bookCategoryId = params.get('id')!;
      const bookParams = this.bookService.getBookFilter();
      bookParams.SearchString = this.searchTerm?.nativeElement.value;
      bookParams.BookCategoryId = Number(this.bookCategoryId);
      this.bookService.setBookFilter(bookParams);
      this.bookParams = bookParams;
      this.getBooks();
    });
  }

  gotoTop() {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }

  onPageChanged(event: any) {
    const params = this.bookService.getBookFilter();
    if (params.PageNumber !== event) {
      params.PageNumber = event;
      params.BookCategoryId = Number(this.bookCategoryId);
      this.bookService.setBookFilter(params);
      this.bookParams = params;
      this.getBooks();
    }
  }

  onSearch() {
    const params = this.bookService.getBookFilter();
    params.SearchString = this.searchTerm?.nativeElement.value;
    params.BookCategoryId = Number(this.bookCategoryId);
    this.bookService.setBookFilter(params);
    this.bookParams = params;
    this.getBooks();
  }

  onReset() {
    this.bookCategoryId = '0';
    if (this.searchTerm) this.searchTerm.nativeElement.value = '';
    this.bookParams = new BookFilter();
    this.bookService.setBookFilter(this.bookParams);
    this.getBooks();
  }

  getAllBooksFromAPI() {
    this.bookService.getBooksFromAPI()
      .pipe(first())
      .subscribe(
        (books: Array<Book>) => {
          this.bookModels = books;
        },
        (err: any) => {
          this.toastrService.error(err.message, 'API Error', {
            timeOut: 3000,
          });
        }
      );
  }

  getBooks() {
    this.bookService.getBooksFromAPI()
      .subscribe({
        next: (response: any) => {
          this.bookModels = response.Books;
          this.totalCount = response.TotalItems;
        },
        error: error => console.log(error),
        complete: () => {
        }
      });
  }

  deleteBook(id: any) {
    if (confirm('Do you want to delete book?')) {
      this.bookService.deleteBook(id).subscribe(
        (result) => {
          this.toastrService.success('Book Deleted Successfully!', 'Success!');
          this.getAllBooksFromAPI();
        },
        (err: HttpErrorResponse) => {
          this.toastrService.error(err.message, 'API Error', {
            timeOut: 3000,
          });
        }
      );
    }
  }
  createBook() {
    this.router.navigateByUrl('booklist/create');
  }
}
