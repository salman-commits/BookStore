import { ShoppingCart } from "./shoppingcart.model";

export class ShoppingCartBasket {
    ShoppingCartItems: ShoppingCart[] | undefined;
    ShoppingCartTotal: number | undefined;
    ShippingCharge: number | undefined;
    ShoppingCartGrandTotal: number | undefined;
}