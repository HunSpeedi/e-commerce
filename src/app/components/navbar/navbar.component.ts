import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';

import { CartService } from '../../services/cart.service';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink]
})
export class NavbarComponent {
  public cartService = inject(CartService);
  public router = inject(Router);
  public isCartPage = signal<boolean>(true)

  productsAmountInCart = this.cartService.productsAmountInCart;

  constructor() {
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe((event: NavigationEnd) => {
        this.isCartPage.set(event.url.startsWith('/cart'));
      });
  }
}
