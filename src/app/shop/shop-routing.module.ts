import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, Routes } from '@angular/router';
import { ShopComponent } from './shop.component';
import { BookDetailsComponent } from './book-details/book-details.component';

const routes: Routes = [
  { path: '', title: 'Shop', component: ShopComponent  },
  { path: 'view/:id', title: 'View Book', component: BookDetailsComponent },  
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShopRoutingModule {
  constructor(private router: Router) {
    this.router.errorHandler = (error: any) => {      
      console.log(error);
    }
  }
}
