import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { CartService } from './cart.service';
import { ProductsService } from './products.service';
import { type Product } from '../models/product.model';

describe('CartService', () => {
  let service: CartService;
  let httpTestingController: HttpTestingController;

  const mockProduct: Product = {
    id: 1,
    name: 'Test Product',
    price: 100,
    availableAmount: 10,
    img: '',
    minOrderAmount: 3,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CartService,
        ProductsService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(CartService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add a product to the cart', () => {
    service.addToCart(mockProduct, 3);
    const cart = service.getCart()();
    expect(cart.length).toBe(1);
    expect(cart[0].id).toBe(mockProduct.id);
    expect(cart[0].quantity).toBe(3);
  });

  it('should increase the quantity of an existing product in the cart', () => {
    service.addToCart(mockProduct, 3);
    service.addToCart(mockProduct, 4);
    const cart = service.getCart()();
    expect(cart.length).toBe(1);
    expect(cart[0].quantity).toBe(7);
  });

  it('should throw an error if adding more than the available stock', () => {    
    expect(() => service.addToCart(mockProduct, 11)).toThrowError('Not enough stock available');
    const cart = service.getCart()();
    expect(cart.length).toBe(0);
  });

  it('should throw an error if adding less than 1 when product is not in the cart', () => {
    expect(() => service.addToCart(mockProduct, 0)).toThrowError('Must add at least 1');
    const cart = service.getCart()();
    expect(cart.length).toBe(0);
  });

  it('should throw an error if adding less than minOrderAmount when product is not in the cart', () => {
    expect(() => service.addToCart(mockProduct, 2)).toThrowError(`Minimum order amount is ${mockProduct.minOrderAmount}`);
    const cart = service.getCart()();
    expect(cart.length).toBe(0);
  });

  it('should remove a product from the cart', () => {
    service.addToCart(mockProduct, 3);
    service.removeFromCart(mockProduct.id);
    const cart = service.getCart()();
    expect(cart.length).toBe(0);
  });

  it('should return the correct quantity of a product in the cart', () => {
    service.addToCart(mockProduct, 3);
    const quantity = service.getQuantityInCart(mockProduct.id);
    expect(quantity).toBe(3);
  });

  it('should return 0 for a product not in the cart', () => {
    const quantity = service.getQuantityInCart(mockProduct.id);
    expect(quantity).toBe(0);
  });

  it('should return the correct total cart count', () => {
    service.addToCart(mockProduct, 3);
    const mockProduct2: Product = { ...mockProduct, id: 2, name: 'Another Product' };
    service.addToCart(mockProduct2, 5);
    const count = service.getCartCount();
    expect(count).toBe(8);
  });

  it('should return the cart state correctly', () => {
    service.addToCart(mockProduct, 3);
    const cart = service.getCart()();
    expect(cart).toEqual([
      {
        id: mockProduct.id,
        name: mockProduct.name,
        price: mockProduct.price,
        quantity: 3,
        img: mockProduct.img,
      },
    ]);
  });
});