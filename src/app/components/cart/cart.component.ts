import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';

import { CartService } from '../../services/cart.service';
import { CartItemComponent } from '../cart-item/cart-item.component';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CartItemComponent],
})
export class CartComponent {
  public cartService = inject(CartService);
  cart = this.cartService.getCart;

  totalQuantity = computed(() =>
    this.cart().reduce((acc, item) => acc + item.quantity, 0)
  );

  totalPrice = computed(() =>
    this.cart().reduce((acc, item) => acc + item.price * item.quantity, 0)
  );
}