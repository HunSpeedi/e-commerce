import { ChangeDetectionStrategy, Component, computed, inject, Input, OnInit, Signal, signal } from '@angular/core';

import { type Product } from '../../models/product.model';
import { CartService } from '../../services/cart.service';
import { ProductsService } from '../../services/products.service';

@Component({
  selector: 'app-product',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './product.component.html',
  imports: []
})
export class ProductComponent implements OnInit {
  @Input() product!: Product;

  public cartService = inject(CartService);
  public productsService = inject(ProductsService);

  quantity = signal<number>(0);
  options = signal<number[]>([]);

  ngOnInit(): void {
    this.quantity.set(this.cartService.getQuantityInCart(this.product) || this.product.minOrderAmount);
    this.options.set(Array.from({ length: this.product.availableAmount - this.product.minOrderAmount + 1 }, (_, i) => i + this.product.minOrderAmount));
  }

  availableQuantity: Signal<number> = computed(() => {
    return this.product.availableAmount - this.cartService.getQuantityInCart(this.product);
  });

  isInCart: Signal<boolean> = computed(() => {
    return this.cartService.getQuantityInCart(this.product) > 0;
  });

  onQuantityChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const newQuantity = parseInt(select.value, 10);
    this.changeQuantity(newQuantity);
  }

  changeQuantity(newQuantity: number): void {
    this.cartService.addToCart(this.product, newQuantity);
    this.quantity.set(newQuantity);
  }

  add(): void {
    this.cartService.addToCart(this.product, this.quantity());
  }

  adjustQuantity(amount: number): void {
    const newQuantity = this.quantity() + amount;
    if(this.shouldNotDecreaseMoreThenMinOrderAmount(newQuantity)) {
      this.cartService.removeFromCart(this.product);
      this.quantity.set(this.product.minOrderAmount);
    } else {
      if (!this.shouldNotIncreaseMoreThenAvailableAmount(newQuantity)) {
        this.changeQuantity(newQuantity);
      }
    }
  }

  shouldNotIncreaseMoreThenAvailableAmount(quantity: number): boolean {
    return quantity > this.product.availableAmount;
  }

  shouldNotDecreaseMoreThenMinOrderAmount(quantity: number): boolean {
    return quantity < this.product.minOrderAmount;
  }

  onImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    target.src = 'fallback.svg';
  }

}