import { Component } from '@angular/core';
import { ShoppingCartService } from '../shared/services/shoppingcart.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-basket',
  templateUrl: './shoppingcart.component.html',
  styleUrls: ['./shoppingcart.component.css']
})
export class ShoppingCartComponent {

  bookQuantity?:number;

  constructor(public shoppingCartService: ShoppingCartService, private router: Router) {    
  }

  addBookToCart(event: { bookId: number }) {    
    this.shoppingCartService.addBookToShoppingCartBasketByBook(event.bookId)
      .subscribe(
        {
          next: (response: any) => {            
            this.bookQuantity = response;            
          },
          error: error => console.log(error),
          complete: () => {            
            this.getShoppingCartCountByUser();
          }
        }
      );
  }

  removeBookFromCart(event: { bookId: number, deleteBook: boolean, bookQuantity: number }) {

    this.bookQuantity = event.bookQuantity;
    if (event.deleteBook) {
      if (confirm('Do you want to delete this book from your shopping cart?')) {        
        this.removeBookBasedOnUserAction(event);
      }
    }
    else if(this.bookQuantity === 1){
      if (confirm('Do you want to delete this book from your shopping cart?')) {        
        this.removeBookBasedOnUserAction(event);
      }
    }
    else
      this.removeBookBasedOnUserAction(event);
  }

  removeBookBasedOnUserAction(event: any) {
    this.shoppingCartService.removeBookFromShoppingCartBasketByBook(event.bookId, event.deleteBook)
      .subscribe(
        {
          next: (response: any) => {            
            this.bookQuantity = response;            
          },
          error: error => console.log(error),
          complete: () => {            
            this.getShoppingCartCountByUser();
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
            this.getShoppingCartDetailItems();
          }
        }
      );
  }

  getShoppingCartDetailItems() {
    this.shoppingCartService.getShoppingCartDetailsByUser()
      .subscribe({
        next: (basket: any) => {          
        },
        error: error => console.log(error),
        complete: () => {          
        }
      });
  }
}
