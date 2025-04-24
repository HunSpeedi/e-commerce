// src/app/services/products.service.spec.ts
import { TestBed } from '@angular/core/testing';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { ProductsService } from './products.service';
import { type Product } from '../models/product.model';

describe('ProductsService', () => {
  let service: ProductsService;
  let httpTestingController: HttpTestingController;

  const mockProducts: Product[] = [
    { id: 1, img: 'img1.jpg', name: 'Product 1', availableAmount: 10, minOrderAmount: 1, price: 100 },
    { id: 2, img: 'img2.jpg', name: 'Product 2', availableAmount: 5, minOrderAmount: 1, price: 200 },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ProductsService,
        provideHttpClient(), 
        provideHttpClientTesting(),
      ]
    });

    service = TestBed.inject(ProductsService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return an empty array initially from getProducts', () => {
    expect(service.getProducts()()).toEqual([]);
  });

  it('should fetch products and update the signal', () => {
    service.fetchProducts().subscribe((products) => {
      expect(products).toEqual(mockProducts);
    });

    const req = httpTestingController.expectOne('https://63c10327716562671870f959.mockapi.io/products');
    expect(req.request.method).toBe('GET');
    req.flush(mockProducts);

    expect(service.getProducts()()).toEqual(mockProducts);
  });

});