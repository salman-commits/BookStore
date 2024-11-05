export class Address {
    AddressId: number | undefined;
    IsPrimary: boolean | undefined;
    AddressLine1: string | undefined;
    AddressLine2: string | undefined;
    City: string | undefined;
    State: string | undefined;
    Country: string | undefined;
    ZipCode: number | undefined;
    PhoneNumber: number | undefined;
    AddressTypeId: number | undefined;
    AddressType: AddressType | undefined;
}

export class AddressType {
    AddressTypeId: number | undefined;
    AddressTypeName: string | undefined;
}