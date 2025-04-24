import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core';

import { CartService } from '../../services/cart.service';
import { type CartItem } from '../../models/cart-item.model';

@Component({
  selector: 'app-cart-item',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './cart-item.component.html',
  imports: [],
})
export class CartItemComponent {
  @Input() item!: CartItem;
  public cartService = inject(CartService);

  remove(): void {
    this.cartService.removeFromCart(this.item.id)
  }

  onImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    target.src = 'fallback.svg';
  }
}
