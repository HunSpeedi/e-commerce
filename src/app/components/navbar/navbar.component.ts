import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { CartService } from '../../services/cart.service';

@Component({
  standalone: true,
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  imports: [RouterLink]
})
export class NavbarComponent {
  public cartService = inject(CartService);
  public router = inject(Router);
}