import { ChangeDetectionStrategy, Component, computed, inject, Input, OnInit, Signal, signal } from '@angular/core';

import { type Product } from '../../models/product.model';
import { CartService } from '../../services/cart.service';
import { ProductsService } from '../../services/products.service';

@Component({
  standalone: true,
  selector: 'app-product',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './product.component.html',
  imports: []
})
export class ProductComponent implements OnInit {
  // product = input.required<Product>(); https://github.com/angular/angular/issues/59067
  @Input() product!: Product;

  public cartService = inject(CartService);
  public productsService = inject(ProductsService);

  quantity = signal<number>(0);

  ngOnInit(): void {
    this.quantity.set(this.product.minOrderAmount);
  }

  availableQuantity: Signal<number> = computed(() => {
    return this.product.availableAmount - this.cartService.getQuantityInCart(this.product.id);
  });

  add(): void {
    this.cartService.addToCart(this.product, this.quantity());
  }

  adjustQuantity(amount: number): void {
    this.quantity.update(quantity => quantity + amount);
  }

  isIncreaseDisabled(): boolean {
    return this.quantity() >= this.availableQuantity();
  }

  isDecreaseDisabled(): boolean {
    return (this.product.availableAmount === this.availableQuantity() && this.quantity() === this.product.minOrderAmount)
      || this.quantity() <= 1;
  }

  isAddDisabled(): boolean {
    return this.quantity() > this.availableQuantity();
  }

  onImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    target.src = 'fallback.svg';
  }

}