import { inject, Injectable, Signal, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, tap } from 'rxjs';

import { type Product } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductsService {
  private http = inject(HttpClient);
  private products = signal<Product[]>([]);

  fetchProducts(): Observable<Product[]> {
    return this.http.get<Product[]>('https://63c10327716562671870f959.mockapi.io/products').pipe(
      tap((data) => this.products.set(data)),
      catchError((error) => {
        alert(`Error: ${error.message}`);
        throw error;
      })
    );
  }

  getProducts(): Signal<Product[]> {
    return this.products.asReadonly();
  }
}
