import { computed, effect, inject, Injectable, signal } from '@angular/core';

import { type CartItem } from '../models/cart-item.model';
import { type Product } from '../models/product.model';
import { ProductsService } from './products.service';
import { ProductKeyService } from './product-key.service';
import { CartStorageService } from './cart-storage.service';

@Injectable({ providedIn: 'root' })
export class CartService {
  public productsService = inject(ProductsService);
  private productKeyService = inject(ProductKeyService);
  private cartStorageService = inject(CartStorageService);
  private cart = signal<Map<string, CartItem>>(this.cartStorageService.loadCart());

  getCart = computed(() => [...this.cart().values()]);

  constructor() {
    effect(() => {
      this.cartStorageService.saveCart(this.cart());
    });
  }

  addToCart(product: Product, amount: number): void {
    const cart = new Map(this.cart());
    const cartItem = cart.get(this.productKeyService.generateKeyByIdAndName(product));

    if (!cartItem?.quantity) {
      if (amount < 1) {
        throw new Error('Must add at least 1');
      }
      if (amount < product.minOrderAmount) {
        throw new Error(`Minimum order amount is ${product.minOrderAmount}`);
      }
    }

    if (amount > product.availableAmount) {
      throw new Error('Not enough stock available');
    }

    if (cartItem) {
      cartItem.quantity = amount;
    } else {
      cart.set(
        this.productKeyService.generateKeyByIdAndName(product),
        {
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: amount,
          img: product.img,
        }
      );
    }

    this.cart.set(cart);
  }

  removeFromCart(product: Product | CartItem): void {
    const cart = new Map(this.cart());
    cart.delete(this.productKeyService.generateKeyByIdAndName(product));
    this.cart.set(cart);
  }

  getQuantityInCart(product: Product): number {
    return this.cart().get(this.productKeyService.generateKeyByIdAndName(product))?.quantity || 0;
  }

  totalQuantity = computed(() => 
    [...this.cart().values()].reduce((acc, item) => acc + item.quantity, 0)
  );

  productsAmountInCart = computed(() =>  [...this.cart().values()].length);
  
}
