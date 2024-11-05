import { Book } from "./book.model";

export class OrderDetailVM {
    OrderId: number | undefined;
    OrderItems: OrderItem[] | undefined;
    ShippingCharge: number | undefined;
    Subtotal: number| undefined;
    GrandTotal: number| undefined;
}

export class OrderItem {
    OrderItemId: number | undefined;
    OrderId: number | undefined;
    BookId: number| undefined;
    Book: Book | undefined;
    Quantity: number | undefined;
    Price: number | undefined;
}