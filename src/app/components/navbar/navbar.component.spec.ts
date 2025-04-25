import { provideRouter, Router } from '@angular/router';
import { withComponentInputBinding } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { computed, signal } from '@angular/core';

import { CartService } from '../../services/cart.service';
import { NavbarComponent } from './navbar.component';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let mockCartService: jasmine.SpyObj<CartService>;
  let router: Router;

  const mockCartSignal = signal([
    { id: 1, name: 'Product 1', price: 100, quantity: 2, img: '' },
    { id: 2, name: 'Product 2', price: 200, quantity: 1, img: '' },
  ]);

  beforeEach(() => {
    mockCartService = jasmine.createSpyObj('CartService', [], {
      getCart: mockCartSignal,
      getCartCount: computed(() => mockCartSignal().reduce((acc, item) => acc + item.quantity, 0)),
    });

    TestBed.configureTestingModule({
      imports: [NavbarComponent],
      providers: [
        provideHttpClientTesting(),
        provideRouter(
          [
            { path: 'cart', component: NavbarComponent },
            { path: 'products', component: NavbarComponent },
          ],
          withComponentInputBinding()
        ),
        { provide: CartService, useValue: mockCartService },
      ],
    });

    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display the total cart count', async () => {
    await router.navigate(['/products']);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const cartCountElement = compiled.querySelector('a[routerLink="/cart"]');
    expect(cartCountElement?.textContent).toContain('3');
  });

  it('should navigate to the cart page when cart button is clicked', async () => {
    await router.navigate(['/products']);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const cartCountElement = compiled.querySelector('a[routerLink="/cart"]') as HTMLElement;

    cartCountElement?.click();
    await fixture.whenStable();

    expect(router.url).toBe('/cart');
  });

  it('should not display the cart link when on the /cart page', async () => {
    await router.navigate(['/cart']);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const cartLink = compiled.querySelector('a[routerLink="/cart"]');
    expect(cartLink).toBeNull();
  });

  it('should navigate to the products page when Products button is clicked', async () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const productsLink = compiled.querySelector('a[routerLink="/products"]') as HTMLElement;

    productsLink?.click();
    await fixture.whenStable();

    expect(router.url).toBe('/products');
  });
});