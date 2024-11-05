export class Book {
    Id: number | undefined;
    ISBN: string | undefined;
    Title: string | undefined;
    Description: string | undefined;
    AuthorName: string | undefined;
    Price: number | undefined;
    PublishedDate: Date | undefined;
    Rating: number | undefined;
    ImageURL: string | undefined;
    ImageThumbnailURL: string | undefined;
    Quantity: number | undefined;
    BookCategoryId: number | undefined;
    BookCategory: BookCategory | undefined;
    CreatedBy: string |undefined;
    CreatedDate: Date |undefined;
    UpdatedBy: string |undefined;
    UpdatedDate: Date |undefined;
}

export class BookViewModel {
    Id: number | undefined;
    ISBN: string | undefined;
    Title: string | undefined;
    Description: string | undefined;
    AuthorName: string | undefined;
    Price: number | undefined;
    PublishedDate: Date | undefined;
    Rating: number | undefined;
    ImageURL: string | undefined;
    ImageThumbnailURL: string | undefined;
    Quantity: number | undefined;
    BookCategoryId: number | undefined;
    Categories: BookCategory[] | undefined;
}


export class BookCategory {
    BookCategoryId: number | undefined;
    BookCategoryName: string | undefined;
}