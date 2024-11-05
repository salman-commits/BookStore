import { Address } from "./address.model";

export class Order {
        OrderId: number | undefined;
        Address: Address| undefined;
        AddressId: number| undefined;
        DeliveryMethodId: number | undefined;
        DeliveryMethod: DeliveryMethod | undefined;
        OrderStatus: string | undefined;
        OrderDate: Date | undefined;
}

export class DeliveryMethod {
    DeliveryMethodId: number | undefined;
    Days: number | undefined;
    Price: number | undefined;
}