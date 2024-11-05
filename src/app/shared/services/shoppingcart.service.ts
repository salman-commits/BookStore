import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { ShoppingCartBasket } from '../models/shoppingcartbasket.model';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthenticationService } from './authentication.service';
@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService {

  userEmailId?: string;
  private userShoppingItemCountSubject = new BehaviorSubject<number | null>(null);
  userShoppingItemCountSubject$ = this.userShoppingItemCountSubject.asObservable();

  private userShoppingItemDetailsSubject = new BehaviorSubject<ShoppingCartBasket | null>(null);
  userShoppingItemDetailsSubject$ = this.userShoppingItemDetailsSubject.asObservable();

  constructor(private http: HttpClient, private authenticationService: AuthenticationService) {
    this.userShoppingItemCountSubject = new BehaviorSubject<number | null>(
      JSON.parse(localStorage.getItem('currentUserItemCount')!)
    );
    this.userShoppingItemCountSubject$ = this.userShoppingItemCountSubject.asObservable();

    this.userShoppingItemDetailsSubject = new BehaviorSubject<ShoppingCartBasket | null>(
      JSON.parse(localStorage.getItem('userShoppingItemDetailsSubject')!)
    );
    this.userShoppingItemDetailsSubject$ = this.userShoppingItemDetailsSubject.asObservable();
  }

  public get currentUserShoppingItemCountValue(): number {
    return this.userShoppingItemCountSubject.value!;
  }

  currentUserShoppingItemDetailsSubject() {
    return this.userShoppingItemDetailsSubject.value!;
  }

  deleteUserShoppingItemCountSubject() {
    this.userShoppingItemCountSubject.next(0);
    localStorage.removeItem('userShoppingItemCountSubject');
  }

  deleteUserShoppingItemDetailsSubject() {
    this.userShoppingItemDetailsSubject.next(null);
    localStorage.removeItem('userShoppingItemDetailsSubject');
    localStorage.removeItem('currentUserItemCount');
  }

  private getCurrentUserEmail(): void {
    const currentUser = this.authenticationService.currentUserValue;
    if (currentUser) {
      this.userEmailId = currentUser.Email;
    }
  }

  getShoppingCartDetailsByUser() {
    this.getCurrentUserEmail();
    return this.http.get<ShoppingCartBasket>
      (`${environment.apiUrl}/api/ShoppingCart/GetShoppingCartDetailsByUser/` + "?userId=" + this.userEmailId!)

      .pipe(map(basket => {
        basket.ShoppingCartItems!.forEach((element) => {
          element.Book!.ImageThumbnailURL! = `${environment.apiUrl}/` + element.Book!.ImageThumbnailURL!;
        });

        localStorage.setItem('userShoppingItemDetailsSubject', JSON.stringify(basket));
        this.userShoppingItemDetailsSubject.next(basket);
        return basket;
      }));
  }

  getShoppingCartTotalCountByUser() {
    this.getCurrentUserEmail();
    return this.http.get<any>(`${environment.apiUrl}/api/ShoppingCart/GetShoppingCartTotalCountByUser/` + "?userId=" + this.userEmailId!)
      .pipe(map(basketCount => {
        localStorage.setItem('currentUserItemCount', JSON.stringify(basketCount));
        this.userShoppingItemCountSubject.next(basketCount);
        return basketCount;
      }));
  }

  getShoppingCartQuantityByBook(bookId: number) {
    this.getCurrentUserEmail();
    return this.http.get<any>(`${environment.apiUrl}/api/ShoppingCart/GetShoppingCartQuantityByBook` + "?userId=" + this.userEmailId! + "&bookId=" + bookId);

  }

  addBookToShoppingCartBasketByBook(bookId: number) {
    this.getCurrentUserEmail();
    let cart = { BookId: bookId, UserId: this.userEmailId! };
    return this.http.post<any>(`${environment.apiUrl}/api/ShoppingCart/AddToShoppingCart`,
      JSON.stringify(cart),
      {
        headers: new HttpHeaders().set('Content-Type', 'application/json')
      }
    );
  }

  removeBookFromShoppingCartBasketByBook(bookId: number, deleteBook: boolean) {
    this.getCurrentUserEmail();
    let cart = { BookId: bookId, UserId: this.userEmailId!, DeleteBook: deleteBook };    
    return this.http.post<any>(`${environment.apiUrl}/api/ShoppingCart/RemoveFromShoppingCart`,
      JSON.stringify(cart),
      {
        headers: new HttpHeaders().set('Content-Type', 'application/json')
      }
    );
  }

  deleteBookFromShoppingCartBasketByBook(bookId: number) {
    this.getCurrentUserEmail();
    let cart = { BookId: bookId, UserId: this.userEmailId! };

    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: {
        cart: JSON.stringify(cart)
      },
    };
    return this.http.delete<any>(`${environment.apiUrl}/api/ShoppingCart/DeleteBookFromCart`,
      options
    );
  }

  deleteShoppingCartByUser(orderId: number) {
    this.getCurrentUserEmail();
    let cart = { OrderId: orderId, UserId: this.userEmailId! };
    return this.http.post<any>(`${environment.apiUrl}/api/ShoppingCart/DeleteShoppingCartPostPayment`,
      JSON.stringify(cart),
      {
        headers: new HttpHeaders().set('Content-Type', 'application/json')
      }
    );
  }
}
