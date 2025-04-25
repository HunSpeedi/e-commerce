import { TestBed } from '@angular/core/testing';
import { ProductKeyService } from './product-key.service';
import { type Product } from '../models/product.model';

describe('ProductKeyService', () => {
  let service: ProductKeyService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProductKeyService],
    });
    service = TestBed.inject(ProductKeyService);
  });

  it('should generate the correct key for a product', () => {
    const product: Product = {
      id: 1,
      name: 'Test Product',
      price: 100,
      availableAmount: 10,
      minOrderAmount: 1,
      img: 'test-product.jpg',
    };

    const key = service.generateKeyByIdAndName(product);
    expect(key).toBe('1-testproduct');
  });

  it('should handle products with spaces in the name', () => {
    const product: Product = {
      id: 2,
      name: 'Another Product Name',
      price: 200,
      availableAmount: 5,
      minOrderAmount: 1,
      img: 'another-product.jpg',
    };

    const key = service.generateKeyByIdAndName(product);
    expect(key).toBe('2-anotherproductname');
  });

  it('should handle products with uppercase letters in the name', () => {
    const product: Product = {
      id: 3,
      name: 'UPPERCASE Product',
      price: 300,
      availableAmount: 8,
      minOrderAmount: 1,
      img: 'uppercase-product.jpg',
    };

    const key = service.generateKeyByIdAndName(product);
    expect(key).toBe('3-uppercaseproduct');
  });

  it('should handle products with special characters in the name', () => {
    const product: Product = {
      id: 4,
      name: 'Special@Product#Name!',
      price: 400,
      availableAmount: 12,
      minOrderAmount: 1,
      img: 'special-product.jpg',
    };

    const key = service.generateKeyByIdAndName(product);
    expect(key).toBe('4-special@product#name!');
  });

  it('should handle products with empty names', () => {
    const product: Product = {
      id: 5,
      name: '',
      price: 500,
      availableAmount: 15,
      minOrderAmount: 1,
      img: 'empty-name-product.jpg',
    };

    const key = service.generateKeyByIdAndName(product);
    expect(key).toBe('5-');
  });
});