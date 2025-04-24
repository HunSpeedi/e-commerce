import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { ProductsResolver } from './products.resolver';
import { ProductsService } from '../services/products.service';
import { type Product } from '../models/product.model';

describe('ProductsResolver', () => {
  let resolver: ProductsResolver;
  let mockProductsService: jasmine.SpyObj<ProductsService>;

  const mockProducts: Product[] = [
    { id: 1, name: 'Product 1', img: 'img1.jpg', availableAmount: 10, minOrderAmount: 1, price: 100 },
    { id: 2, name: 'Product 2', img: 'img2.jpg', availableAmount: 5, minOrderAmount: 1, price: 200 },
  ];

  beforeEach(() => {
    mockProductsService = jasmine.createSpyObj('ProductsService', ['fetchProducts']);
    mockProductsService.fetchProducts.and.returnValue(of(mockProducts));

    TestBed.configureTestingModule({
      providers: [
        ProductsResolver,
        { provide: ProductsService, useValue: mockProductsService },
      ],
    });

    resolver = TestBed.inject(ProductsResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });

  it('should resolve products using ProductsService', (done) => {
    resolver.resolve().subscribe((products) => {
      expect(products).toEqual(mockProducts);
      expect(mockProductsService.fetchProducts).toHaveBeenCalled();
      done();
    });
  });
});