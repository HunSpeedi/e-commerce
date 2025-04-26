import { Component, inject } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';

import { CartService } from '../../services/cart.service';
import { filter } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  imports: [RouterLink]
})
export class NavbarComponent {
  public cartService = inject(CartService);
  public router = inject(Router);
  public isCartPage = true;

  constructor() {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.isCartPage = event.url.startsWith('/cart');
      });
  }
}