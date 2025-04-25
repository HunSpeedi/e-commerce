import { Component, inject } from '@angular/core';
import { NgFor } from '@angular/common';

import { ProductsService } from '../../services/products.service';
import { ProductComponent } from '../products/product.component';
import { type Product } from '../../models/product.model';
import { ProductKeyService } from '../../services/product-key.service';

@Component({
  standalone: true,
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  imports: [ProductComponent, NgFor]
})
export class ProductListComponent {
  public productService = inject(ProductsService);
  public productKeyService = inject(ProductKeyService);
  products = this.productService.getProducts();

  trackByIdAndName = (index: number, product: Product): string => {
    return this.productKeyService.generateKeyByIdAndName(product);
  };
}