import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../shared/services/authentication.service';
import { User } from '../shared/models/user.model';
import { ShoppingCartService } from '../shared/services/shoppingcart.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit {
  currentUser: User | undefined;
  basketCount: number | undefined;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private shoppingCartService: ShoppingCartService
  ) {
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
    this.shoppingCartService.userShoppingItemCountSubject$.subscribe(value => {
      this.basketCount = value!;
    });

  }
  ngOnInit(): void {    
  }

  LogOut() {    
    if (confirm('Do you want to logout?')) {
      this.authenticationService.logOut();
      this.router.navigate(['/login']);
    }
  }
}
