import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ShoppingCartService } from '../../services/shoppingcart.service';
import { ShoppingCartBasket } from '../../models/shoppingcartbasket.model';

@Component({
  selector: 'app-shoppingcart-summary',
  templateUrl: './shoppingcart-summary.component.html',
  styleUrls: ['./shoppingcart-summary.component.css']
})
export class ShoppingCartSummaryComponent implements OnInit {

  @Output() addItem = new EventEmitter<{ bookId: number }>();
  @Output() removeItem = new EventEmitter<{ bookId: number, deleteBook: boolean, bookQuantity: number }>();
  basketItems?: ShoppingCartBasket;
  @Input() isBasket = true;

  constructor(public shoppingCartService: ShoppingCartService) {     
    this.shoppingCartService.userShoppingItemDetailsSubject$.subscribe(value => {
      this.basketItems = value!;      
    });
  }

  ngOnInit(): void {    
    this.getShoppingCartDetailItems();
  }

  getShoppingCartDetailItems() {
    this.shoppingCartService.getShoppingCartDetailsByUser()
      .subscribe({
        next: (basket: ShoppingCartBasket) => {          
          this.basketItems = basket;
        },
        error: error => console.log(error),
        complete: () => {          
        }
      });
  }

  addBasketItem(bookId: number) {    
    this.addItem.emit({ bookId });    
  }

  removeBasketItem(bookId: number, deleteBook: boolean, bookQuantity: number) {    
    this.removeItem.emit({ bookId, deleteBook, bookQuantity });
  }

}
