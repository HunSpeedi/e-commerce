import { Injectable } from '@angular/core';

import { type CartItem } from '../models/cart-item.model';

@Injectable({ providedIn: 'root' })
export class CartStorageService {
  private readonly CART_KEY = 'cart';

  saveCart(cart: Map<string, CartItem>): void {
    const cartArray = [...cart.entries()];
    localStorage.setItem(this.CART_KEY, JSON.stringify(cartArray));
  }

  loadCart(): Map<string, CartItem> {
    const cartData = localStorage.getItem(this.CART_KEY);
    if (cartData) {
      return new Map<string, CartItem>(JSON.parse(cartData));
    }
    return new Map<string, CartItem>();
  }
}