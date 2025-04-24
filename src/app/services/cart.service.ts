import { inject, Injectable, signal } from '@angular/core';

import { type CartItem } from '../models/cart-item.model';
import { type Product } from '../models/product.model';
import { ProductsService } from './products.service';

@Injectable({ providedIn: 'root' })
export class CartService {
  public productsService = inject(ProductsService);
  private cart = signal<CartItem[]>([]);

  getCart()  {
    return this.cart.asReadonly();
  }

  addToCart(product: Product, amount: number): void {
    const cartItems = [...this.cart()];
    const cartItem = cartItems.find(item => item.id === product.id);
    const quantityInCart = cartItem?.quantity || 0;
    const remaining = product.availableAmount - quantityInCart;

    if (quantityInCart === 0) {
      if (amount < 1) {
        throw new Error('Must add at least 1');
      }
      if (amount < product.minOrderAmount) {
        throw new Error(`Minimum order amount is ${product.minOrderAmount}`);
      }
    }

    if (amount > remaining) {
      throw new Error('Not enough stock available');
    }

    if (cartItem) {
      cartItem.quantity += amount;
    } else {
      cartItems.push({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: amount,
        img: product.img,
      });
    }

    this.cart.set(cartItems);
  }

  removeFromCart(productId: number): void{
    this.cart.set(this.cart().filter(item => item.id !== productId));
  }

  getQuantityInCart(productId: number): number {
    return this.cart().find(item => item.id === productId)?.quantity || 0;
  }

  getCartCount(): number {
    return this.cart().reduce((acc, item) => acc + item.quantity, 0);
  }
}
