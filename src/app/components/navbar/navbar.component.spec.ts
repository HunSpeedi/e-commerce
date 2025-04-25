import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { computed, signal } from '@angular/core';

import { CartService } from '../../services/cart.service';
import { NavbarComponent } from './navbar.component';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let mockCartService: jasmine.SpyObj<CartService>;
  let httpTestingController: HttpTestingController;

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
        provideRouter([]),
        { provide: CartService, useValue: mockCartService },
        { provide: ActivatedRoute, useValue: {} }
      ],
    });

    httpTestingController = TestBed.inject(HttpTestingController); 
    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display the total cart count', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const cartCountElement = compiled.querySelector('a[routerLink="/cart"]');
    expect(cartCountElement?.textContent).toContain('3');
  });

  it('should navigate to the cart page when cart button is clicked', () => {
    const router = TestBed.inject(Router);
    spyOn(router, 'navigateByUrl');
    const compiled = fixture.nativeElement as HTMLElement;
    const cartCountElement = compiled.querySelector('a[routerLink="/cart"]') as HTMLElement;
    cartCountElement?.click()
    expect(router.navigateByUrl).toHaveBeenCalledWith(jasmine.stringMatching('/cart'), jasmine.any(Object));
  });

  it('should not display the cart link when on the /cart page', () => {
    const router = TestBed.inject(Router);
    spyOnProperty(router, 'url', 'get').and.returnValue('/cart');
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const cartLink = compiled.querySelector('a[routerLink="/cart"]');
    expect(cartLink).toBeNull();
  });

  it('should navigate to the products page when Products button is clicked', () => {
    const router = TestBed.inject(Router);
    spyOnProperty(router, 'url', 'get').and.returnValue('/cart');
    spyOn(router, 'navigateByUrl');
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const cartCountElement = compiled.querySelector('a[routerLink="/products"]') as HTMLElement;
    cartCountElement?.click()
    expect(router.navigateByUrl).toHaveBeenCalledWith(jasmine.stringMatching('/products'), jasmine.any(Object));
  });
});