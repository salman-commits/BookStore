import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { transformError } from 'src/app/shared/customvalidators/common-custom.validator';
import { Book } from 'src/app/shared/models/book.model';
import { BookStoreService } from 'src/app/shared/services/bookstore.service';
import { ShoppingCartService } from 'src/app/shared/services/shoppingcart.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-book-details',
  templateUrl: './book-details.component.html',
  styleUrls: ['./book-details.component.css']
})
export class BookDetailsComponent implements OnInit {
  book?: Book;
  quantity = 0;
  quantityInBasket = 0;
  errorBadRequestList: string[]=[];

  constructor(private bookService: BookStoreService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private shoppingCartService: ShoppingCartService,
    private spinner: NgxSpinnerService,
    private toastrService: ToastrService) { }

  ngOnInit(): void {
    this.loadBook();
  }

  loadBook() {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id) this.bookService.getBookById(+id).subscribe({
      next: book => {
        book.ImageURL = `${environment.apiUrl}/` + book.ImageURL;
        this.book = book;
      },
      error: error => console.log(error),
      complete: () => {        
        this.getBookQuantity();
      }
    })
  }

  getBookQuantity() {

    this.shoppingCartService.getShoppingCartQuantityByBook(this.book?.Id!)
      .subscribe(
        {
          next: (response: any) => {            
            this.quantity = response;
          },
          error: error => console.log(error),
          complete: () => {            
          }
        }
      );

  }
  getShoppingCartCountByUser() {

    this.shoppingCartService.getShoppingCartTotalCountByUser()
      .subscribe(
        {
          next: (response: any) => {            
          },
          error: error => console.log(error),
          complete: () => {            
            this.spinner.hide();
          }
        }
      );
  }

  AddBookToCart() {
    this.shoppingCartService.addBookToShoppingCartBasketByBook(this.book?.Id!)
      .subscribe(
        {
          next: (response: any) => {            
            this.quantity = response;
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
            this.getShoppingCartCountByUser();
          }
        }
      );     
  }

  RemoveBookFromCart() {
    this.shoppingCartService.removeBookFromShoppingCartBasketByBook(this.book?.Id!, false)    
      .subscribe(
        {
          next: (response: any) => {            
            this.quantity = response;
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
            this.getShoppingCartCountByUser();
          }
        }
      );
  }

  incrementQuantity() {  
    this.spinner.show();  
    this.AddBookToCart();    
  }

  decrementQuantity() {
    this.spinner.show();
    this.RemoveBookFromCart();
  }

  updateBasket() {
    if (this.book) {
      if (this.quantity > this.quantityInBasket) {
        const itemsToAdd = this.quantity - this.quantityInBasket;
        this.quantityInBasket += itemsToAdd;
      } else {
        const itemsToRemove = this.quantityInBasket - this.quantity;
        this.quantityInBasket -= itemsToRemove;
      }
    }
  }

  get buttonText() {
    return this.quantityInBasket === 0 ? 'Add to basket' : 'Update basket';
  }

  backToShop() {    
    this.router.navigate(['/shop'], { queryParams: { returnUrl: "shop" } });
  }

}
