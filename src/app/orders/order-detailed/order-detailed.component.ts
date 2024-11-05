import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrderDetailVM } from 'src/app/shared/models/orderdetailVM';
import { OrderService } from 'src/app/shared/services/order.service';

@Component({
  selector: 'app-order-detailed',
  templateUrl: './order-detailed.component.html',
  styleUrls: ['./order-detailed.component.css']
})
export class OrderDetailedComponent implements OnInit {
  order?: OrderDetailVM;
  constructor(private orderService: OrderService, private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    const OrderId = this.route.snapshot.paramMap.get('OrderId');    
    OrderId && this.orderService.getOrderDetailsByOrderId(+OrderId).subscribe({
      next: orderVM => {        
        this.order = orderVM;
      }
    })
  }
}