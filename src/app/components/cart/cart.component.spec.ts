import { ComponentFixture, TestBed } from '@angular/core/testing';
import { computed, signal } from '@angular/core';

import { CartComponent } from './cart.component';
import { CartService } from '../../services/cart.service';
import { CartItemComponent } from '../cart-item/cart-item.component';

describe('CartComponent', () => {
  let component: CartComponent;
  let mockCartService: jasmine.SpyObj<CartService>;
  let fixture: ComponentFixture<CartComponent>;

  const mockCartSignal = signal([
    { id: 1, name: 'Product 1', price: 100, quantity: 2, img: '' },
    { id: 2, name: 'Product 2', price: 200, quantity: 1, img: '' },
  ]);

  beforeEach(() => {
    mockCartService = jasmine.createSpyObj('CartService', [], {
      cart: mockCartSignal,
      getCart: computed(() => [...mockCartSignal().values()]),
    });

    TestBed.configureTestingModule({
      imports: [CartComponent, CartItemComponent],
      providers: [{ provide: CartService, useValue: mockCartService }],
    });

    fixture = TestBed.createComponent(CartComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    mockCartSignal.set([
      { id: 1, name: 'Product 1', price: 100, quantity: 2, img: '' },
      { id: 2, name: 'Product 2', price: 200, quantity: 1, img: '' },
    ]);
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should calculate the total quantity correctly', () => {
    fixture.detectChanges();
    expect(component.totalQuantity()).toBe(3);
  });

  it('should calculate the total price correctly', () => {
    fixture.detectChanges();
    expect(component.totalPrice()).toBe(400);
  });

  it('should display the cart items', () => {
    fixture.detectChanges();
    const cartItems = component.cart();
    expect(cartItems.length).toBe(2);
    expect(cartItems[0].name).toBe('Product 1');
    expect(cartItems[1].name).toBe('Product 2');
  });
  
  it('should display fallback message when cart is empty', () => {
    mockCartSignal.set([]);
    fixture.detectChanges();
    const cartItems = component.cart();
    expect(cartItems.length).toBe(0);
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('p')?.textContent).toContain('Your cart is empty.');
  });
});