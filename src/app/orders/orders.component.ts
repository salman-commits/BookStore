import { Component, OnInit } from '@angular/core';
import { OrderService } from '../shared/services/order.service';
import { OrderMasterVM } from '../shared/models/ordermasterVM';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  orders: OrderMasterVM[] = [];

  constructor(private orderService: OrderService) { }

  ngOnInit(): void {
    this.getOrders();
  }
  
  getOrders() {
    this.orderService.getUserOrderedDetails()
    .subscribe({
      next: (response: OrderMasterVM[]) => {        
        this.orders = response;
      },
      error: error => console.log(error),
      complete: () => {        
      }
    });
  }
}
