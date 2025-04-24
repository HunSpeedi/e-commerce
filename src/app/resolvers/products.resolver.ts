import { inject, Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';

import { type Product } from '../models/product.model';
import { ProductsService } from '../services/products.service';

@Injectable({ providedIn: 'root' })
export class ProductsResolver implements Resolve<Product[]> {
  private productsService = inject(ProductsService);

  resolve(): Observable<Product[]> {
    return this.productsService.fetchProducts();
  }
}