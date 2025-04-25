import { Injectable } from '@angular/core';

import { type Product } from '../models/product.model';
import { type CartItem } from '../models/cart-item.model';

@Injectable({ providedIn: 'root' })
export class ProductKeyService {
  generateKeyByIdAndName(product: Product | CartItem): string {
    return `${product.id}-${product.name.toLowerCase().replace(/\s+/g, '')}`;
  }
}