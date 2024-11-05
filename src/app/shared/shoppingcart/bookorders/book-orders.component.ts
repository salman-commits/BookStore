import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-book-orders',
  templateUrl: './book-orders.component.html',
  styleUrls: ['./book-orders.component.css']
})
export class BookOrdersComponent {
  @Input() shoppingCartTotal?: number;
  @Input() shippingCharge?: number;
  @Input() shoppingCartGrandTotal?: number;

}
