import { NgModule } from '@angular/core';
import { Router, RouterModule, Routes } from '@angular/router';
import { BookListComponent } from './book-list/book-list.component';
import { BookCreateComponent } from './book-create/book-create.component';
import { BookViewComponent } from './book-view/book-view.component';

const routes: Routes = [
  { path: '', title: 'Book List', component: BookListComponent  },
  { path: 'create', title: 'Create Book', component: BookCreateComponent },
  { path: 'edit/:id', title: 'Edit Book', component: BookCreateComponent },
  { path: 'view/:id', title: 'View Book', component: BookViewComponent },  
  { path: ':id', title: 'Book List', component: BookListComponent  },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BookStoreRoutingModule {
  constructor(private router: Router) {
    this.router.errorHandler = (error: any) => {
      console.log(error);
    }
  }
}