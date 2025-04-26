import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { By } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { CartService } from './services/cart.service';
import { ProductsService } from './services/products.service';
import { NavbarComponent } from './components/navbar/navbar.component';

describe('AppComponent', () => {
  let httpTestingController: HttpTestingController;
  let mockCartService: jasmine.SpyObj<CartService>;
  let mockProductsService: jasmine.SpyObj<ProductsService>;
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;

  beforeEach(async () => {
    mockCartService = jasmine.createSpyObj('CartService', ['getQuantityInCart', 'addToCart', 'totalQuantity', 'productsAmountInCart']);
    mockProductsService = jasmine.createSpyObj('ProductsService', ['fetchProducts', 'getProducts']);

    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        provideHttpClientTesting(),
        { provide: CartService, useValue: mockCartService },
        { provide: ProductsService, useValue: mockProductsService },
        { provide: ActivatedRoute, useValue: {} }
      ],
    }).compileComponents();

    httpTestingController = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should render the NavbarComponent', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();

    const navbar = fixture.debugElement.query(By.directive(NavbarComponent));
    expect(navbar).toBeTruthy();
  });

  it('should contain a RouterOutlet', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const routerOutlet = fixture.debugElement.query(By.directive(RouterOutlet));
    expect(routerOutlet).toBeTruthy();
  });
});
