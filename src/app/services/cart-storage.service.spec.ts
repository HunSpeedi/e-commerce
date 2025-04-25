import { TestBed } from '@angular/core/testing';
import { CartStorageService } from './cart-storage.service';
import { type CartItem } from '../models/cart-item.model';

describe('CartStorageService', () => {
  let service: CartStorageService;

  const mockCart = new Map<string, CartItem>([
    [
      'product-1',
      {
        id: 1,
        name: 'Product 1',
        price: 100,
        quantity: 2,
        img: 'image1.jpg',
      },
    ],
    [
      'product-2',
      {
        id: 2,
        name: 'Product 2',
        price: 200,
        quantity: 1,
        img: 'image2.jpg',
      },
    ],
  ]);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CartStorageService],
    });
    service = TestBed.inject(CartStorageService);

    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should save the cart to localStorage', () => {
    service.saveCart(mockCart);

    const savedCart = localStorage.getItem('cart');
    expect(savedCart).toBeTruthy();

    const parsedCart = new Map<string, CartItem>(JSON.parse(savedCart!));
    expect(parsedCart.size).toBe(2);
    expect(parsedCart.get('product-1')?.name).toBe('Product 1');
    expect(parsedCart.get('product-2')?.quantity).toBe(1);
  });

  it('should load the cart from localStorage', () => {
    localStorage.setItem('cart', JSON.stringify([...mockCart.entries()]));

    const loadedCart = service.loadCart();
    expect(loadedCart.size).toBe(2);
    expect(loadedCart.get('product-1')?.name).toBe('Product 1');
    expect(loadedCart.get('product-2')?.quantity).toBe(1);
  });

  it('should return an empty Map if no cart is in localStorage', () => {
    const loadedCart = service.loadCart();
    expect(loadedCart.size).toBe(0);
  });
});