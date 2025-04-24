import { Component, inject } from '@angular/core';

import { ProductsService } from '../../services/products.service';
import { ProductComponent } from '../products/product.component';

@Component({
  standalone: true,
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  imports: [ProductComponent]
})
export class ProductListComponent {
  public productService = inject(ProductsService);
  products = this.productService.getProducts();
}