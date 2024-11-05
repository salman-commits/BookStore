import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { DeliveryMethod, Order } from '../models/order.model';
import { AuthenticationService } from './authentication.service';
import { BehaviorSubject, map } from 'rxjs';
import { Address, AddressType } from '../models/address.model';
import { ShoppingCartService } from './shoppingcart.service';
import { OrderMasterVM } from '../models/ordermasterVM';
import { OrderDetailVM } from '../models/orderdetailVM';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class OrderService implements OnInit {

  userEmailId: string | undefined;

  constructor(private http: HttpClient,
    private authenticationService: AuthenticationService,
    private shoppingCartService: ShoppingCartService,
    private toastrService: ToastrService) {
    this.userOrderSubject = new BehaviorSubject<Order | null>(
      JSON.parse(localStorage.getItem('currentUserOrderSubject')!)
    );
    this.userOrderSubject$ = this.userOrderSubject.asObservable();
  }
  ngOnInit(): void {    
    this.getCurrentUserEmail();
  }

  private userOrderSubject = new BehaviorSubject<Order | null>(null);
  userOrderSubject$ = this.userOrderSubject.asObservable();

  currentUserOrderSubject() {
    if (this.userOrderSubject.value!) {      
      return this.userOrderSubject.value!
    }
    else {      
      return new Order();
    }
  }

  setUserOrderSubject(order: Order) {
    this.userOrderSubject.next(order);
  }

  deletetUserOrderSubject() {
    this.userOrderSubject.next(null);
  }

  private getCurrentUserEmail(): void {
    const currentUser = this.authenticationService.currentUserValue;    
    if (currentUser) {
      this.userEmailId = currentUser.Email;
    }
  }

  getDeliveryMethod() {    
    return this.http.get<DeliveryMethod[]>(`${environment.apiUrl}/api/Order/GetDeliveryMethod`);
  }

  setShippingPrice(deliveryMethodId: number) {
    const order = this.currentUserOrderSubject();    
    if (order) {
      order.DeliveryMethodId = deliveryMethodId;
    }    
  }

  setAddress(address: Address) {    
    const order = this.currentUserOrderSubject();    
    order.Address = address;    
  }

  setOrder(address?: Address, deliveryMethodId?: number) {    
    const currentUserOrder = this.currentUserOrderSubject();
    if (address) {
      currentUserOrder.Address = address;      
    }
    if (deliveryMethodId) {
      currentUserOrder.DeliveryMethodId = deliveryMethodId;
    }   

    this.getCurrentUserEmail();
    let order = {
      OrderId: currentUserOrder.OrderId,
      Address: currentUserOrder.Address,
      DeliveryMethodId: currentUserOrder.DeliveryMethodId,
      OrderStatus: currentUserOrder.OrderStatus
    };    
    return this.http.post<Order>(`${environment.apiUrl}/api/Order/AddUpdateOrderDetailsByUser`
      + "?userEmail=" + this.userEmailId,
      JSON.stringify(order),
      {
        headers: new HttpHeaders().set('Content-Type', 'application/json')
      }
    );
  }

  getUserCheckOutDetails() {
    this.getCurrentUserEmail();    
    return this.http.get<Order>(`${environment.apiUrl}/api/Order/GetOrderDetailsByUser` + "?userEmail=" + this.userEmailId)
      .pipe(map(order => {
        this.userOrderSubject.next(order);
        return order;
      }));
  }

  getAddressBasedOnType(addressTypeId: number) {
    this.getCurrentUserEmail();    
    return this.http.get<Address>(`${environment.apiUrl}/api/Order/GetAddressByType` + "?userEmailId=" + this.userEmailId + "&addressTypeId=" + addressTypeId);
  }

  getUserOrderedDetails() {
    this.getCurrentUserEmail();    
    return this.http.get<OrderMasterVM[]>(`${environment.apiUrl}/api/Order/GetOrderedDetailsByUser` + "?userEmail=" + this.userEmailId)
      .pipe(map(order => {
        return order;
      }));
  }

  getOrderDetailsByOrderId(orderId: number) {    
    return this.http.get<OrderDetailVM>(`${environment.apiUrl}/api/Order/GetOrderDetailsByOrderId` + "?orderId=" + orderId)
      .pipe(map(order => {
        order.OrderItems!.forEach((element) => {
          element.Book!.ImageThumbnailURL! = `${environment.apiUrl}/` + element.Book!.ImageThumbnailURL!;
        });
        return order;
      }));
  }

  getAddressType() {    
    return this.http.get<AddressType[]>(`${environment.apiUrl}/api/Order/GetAddressType`);
  }

}
