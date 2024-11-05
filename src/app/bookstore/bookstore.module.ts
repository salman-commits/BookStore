import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { BookListComponent } from './book-list/book-list.component';
import { BookStoreRoutingModule } from './bookstore-routing.module';
import { BookCreateComponent } from './book-create/book-create.component';
import { BookViewComponent } from './book-view/book-view.component';
import { BookCategoryComponent } from './book-category/book-category.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    BookListComponent,
    BookCreateComponent,
    BookViewComponent,
    BookCategoryComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BookStoreRoutingModule,
    SharedModule,
  ]
})
export class BookStoreModule { }
