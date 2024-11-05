import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { PageNotFoundComponent } from './pagenotfound/pagenotfound.component';
import { LoginComponent } from './login/login.component';
import { ErrorComponent } from './error/error.component';
import { AuthGuardService } from './core/guards/auth-guard.service';
import { AboutComponent } from './about/about.component';
import { SignupComponent } from './signup/signup.component';

const routes: Routes = [
  { path: 'home', title: 'Home Page', component: HomeComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'login', title: "Login", component: LoginComponent },
  { path: 'signup', title: "Sign Up", component: SignupComponent },
  {
    path: 'booklist',
    canActivate: [AuthGuardService],
    loadChildren: () => import('./bookstore/bookstore.module').then(x => x.BookStoreModule)
  },
  {
    path: 'shop',
    canActivate: [AuthGuardService],
    loadChildren: () => import('./shop/shop.module').then(x => x.ShopModule)
  },
  {
    path: 'checkout',
    canActivate: [AuthGuardService],
    loadChildren: () => import('./checkout/checkout.module').then(x => x.CheckOutModule)
  },
  {
    path: 'orders',
    canActivate: [AuthGuardService],
    loadChildren: () => import('./orders/orders.module').then(m => m.OrdersModule)
  },
  {
    path: 'basket',
    canActivate: [AuthGuardService],
    title: 'Basket',
    loadChildren: () => import('./shoppingcart/shoppingcart.module').then(m => m.ShoppingCartModule)
  },
  { path: 'about', title: 'About', component: AboutComponent },
  { path: 'error/:id/:errorMessage', title: 'Error Page', component: ErrorComponent },
  { path: '**', title: 'Page Not Found', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

