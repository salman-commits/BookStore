import { Book } from "./book.model";

export class ShoppingCart {
    ShoppingCartItemId: number | undefined;
    Quantity: number | undefined;
    UserId: number | undefined;
    Book: Book | undefined;
    BookId: number | undefined;
}