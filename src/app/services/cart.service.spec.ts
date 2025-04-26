import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { CartService } from './cart.service';
import { ProductsService } from './products.service';
import { type Product } from '../models/product.model';
import { CartStorageService } from './cart-storage.service';

describe('CartService', () => {
  let service: CartService;
  let httpTestingController: HttpTestingController;
  let mockCartStorageService: jasmine.SpyObj<CartStorageService>;

  const mockProduct: Product = {
    id: 1,
    name: 'Test Product',
    price: 100,
    availableAmount: 10,
    img: '',
    minOrderAmount: 3,
  };

  beforeEach(() => {
    mockCartStorageService = jasmine.createSpyObj('CartStorageService', ['loadCart', 'saveCart']);
    mockCartStorageService.loadCart.and.returnValue(new Map());
    TestBed.configureTestingModule({
      providers: [
        CartService,
        ProductsService,
        { provide: CartStorageService, useValue: mockCartStorageService },
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
    const cart = service.getCart();
    expect(cart.length).toBe(1);
    expect(cart[0].id).toBe(mockProduct.id);
    expect(cart[0].quantity).toBe(3);
  });

  it('should change the quantity of an existing product in the cart', () => {
    service.addToCart(mockProduct, 4);
    const cart = service.getCart();
    expect(cart.length).toBe(1);
    expect(cart[0].quantity).toBe(4);
    service.addToCart(mockProduct, 7);
    const cart2 = service.getCart();
    expect(cart2.length).toBe(1);
    expect(cart2[0].quantity).toBe(7);
  });

  it('should throw an error if adding more than the available stock', () => {    
    expect(() => service.addToCart(mockProduct, 11)).toThrowError('Not enough stock available');
    const cart = service.getCart();
    expect(cart.length).toBe(0);
  });

  it('should throw an error if adding less than 1 when product is not in the cart', () => {
    expect(() => service.addToCart(mockProduct, 0)).toThrowError('Must add at least 1');
    const cart = service.getCart();
    expect(cart.length).toBe(0);
  });

  it('should throw an error if adding less than minOrderAmount when product is not in the cart', () => {
    expect(() => service.addToCart(mockProduct, 2)).toThrowError(`Minimum order amount is ${mockProduct.minOrderAmount}`);
    const cart = service.getCart();
    expect(cart.length).toBe(0);
  });

  it('should remove a product from the cart', () => {
    service.addToCart(mockProduct, 3);
    service.removeFromCart(mockProduct);
    const cart = service.getCart();
    expect(cart.length).toBe(0);
  });

  it('should return the correct quantity of a product in the cart', () => {
    service.addToCart(mockProduct, 3);
    const quantity = service.getQuantityInCart(mockProduct);
    expect(quantity).toBe(3);
  });

  it('should return 0 for a product not in the cart', () => {
    const quantity = service.getQuantityInCart(mockProduct);
    expect(quantity).toBe(0);
  });

  it('should return the correct total cart count', () => {
    service.addToCart(mockProduct, 3);
    const mockProduct2: Product = { ...mockProduct, id: 2, name: 'Another Product' };
    service.addToCart(mockProduct2, 5);
    const count = service.totalQuantity();
    expect(count).toBe(8);
  });

  it('should return the cart state correctly', () => {
    service.addToCart(mockProduct, 3);
    const cart = service.getCart();
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

  it('should load the cart from storage on initialization', () => {
    expect(mockCartStorageService.loadCart).toHaveBeenCalled();
  });

  it('should save the cart to storage when the cart changes', () => {
    service.addToCart(mockProduct, 3);
    TestBed.flushEffects(); 
    expect(mockCartStorageService.saveCart).toHaveBeenCalledWith(
      jasmine.any(Map)
    );
  });

  it('should save the updated cart to storage after removing an item', () => {
    service.addToCart(mockProduct, 3);
    TestBed.flushEffects(); 
    service.removeFromCart(mockProduct);
    TestBed.flushEffects();
    expect(mockCartStorageService.saveCart).toHaveBeenCalledTimes(2);
  });

  it('should save an empty cart to storage after clearing all items', () => {
    service.addToCart(mockProduct, 3);
    TestBed.flushEffects(); 
    service.removeFromCart(mockProduct);
    TestBed.flushEffects(); 
    const lastSavedCart = mockCartStorageService.saveCart.calls.mostRecent().args[0];
    expect(lastSavedCart.size).toBe(0);
  });
});