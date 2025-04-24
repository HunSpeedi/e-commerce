import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { By } from '@angular/platform-browser';

import { ProductComponent } from './product.component';
import { CartService } from '../../services/cart.service';
import { ProductsService } from '../../services/products.service';
import { type Product } from '../../models/product.model';

describe('ProductComponent', () => {
  let component: ProductComponent;
  let fixture: ComponentFixture<ProductComponent>;
  let mockCartService: jasmine.SpyObj<CartService>;
  let mockProductsService: jasmine.SpyObj<ProductsService>;
  let httpTestingController: HttpTestingController;

  const mockProduct: Product = {
    id: 1,
    img: '',
    name: 'Test Product',
    availableAmount: 10,
    minOrderAmount: 2,
    price: 100,
  };

  beforeEach(() => {
    mockCartService = jasmine.createSpyObj('CartService', ['getQuantityInCart', 'addToCart']);
    mockProductsService = jasmine.createSpyObj('ProductsService', ['fetchProducts', 'getProducts']);

    TestBed.configureTestingModule({
      imports: [ProductComponent],
      providers: [
        provideHttpClientTesting(),
        { provide: CartService, useValue: mockCartService },
        { provide: ProductsService, useValue: mockProductsService },
      ],
    });

    httpTestingController = TestBed.inject(HttpTestingController); 
    fixture = TestBed.createComponent(ProductComponent);
    component = fixture.componentInstance;
    component.product = mockProduct;
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should render product details correctly', () => {
    mockCartService.getQuantityInCart.and.returnValue(0);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h2')?.textContent).toContain(mockProduct.name);
    expect(compiled.querySelector('p.text-gray-600')?.textContent).toContain(`$${mockProduct.price}`);
    expect(compiled.querySelector('p.text-gray-500')?.textContent).toContain(`Available: ${mockProduct.availableAmount}`);
  });

  it('should initialize quantity to product.minOrderAmount', () => {
    component.ngOnInit();
    expect(component.quantity()).toBe(mockProduct.minOrderAmount);
  });

  it('should disable the decrease button when quantity is at minimum', () => {
    mockCartService.getQuantityInCart.and.returnValue(0);
    component.ngOnInit();
    fixture.detectChanges();

    const decreaseButton = fixture.debugElement.query(By.css('button:nth-of-type(1)'));

    expect(decreaseButton.nativeElement.disabled).toBeTrue();
  });

  it('should adjust quantity when + or − buttons are clicked', () => {
    component.ngOnInit();
    fixture.detectChanges();

    const increaseButton = fixture.debugElement.query(By.css('button:nth-of-type(2)'));
    const decreaseButton = fixture.debugElement.query(By.css('button:nth-of-type(1)'));

    // Simulate clicking the + button
    increaseButton.triggerEventHandler('click', null);
    fixture.detectChanges();
    expect(component.quantity()).toBe(mockProduct.minOrderAmount + 1);

    // Simulate clicking the − button
    decreaseButton.triggerEventHandler('click', null);
    fixture.detectChanges();
    expect(component.quantity()).toBe(mockProduct.minOrderAmount);
  });

  it('should disable the "Add to Cart" button when quantity exceeds available amount', () => {
    mockCartService.getQuantityInCart.and.returnValue(0);
    fixture.detectChanges();
    component.quantity.set(mockProduct.availableAmount + 1);
    fixture.detectChanges();

    const addToCartButton = fixture.debugElement.query(By.css('button.mt-3'));
    expect(addToCartButton.nativeElement.disabled).toBeTrue();
  });

  it('should call addToCart when "Add to Cart" button is clicked', () => {
    mockCartService.getQuantityInCart.and.returnValue(0);
    fixture.detectChanges();
    component.quantity.set(5);
    fixture.detectChanges();

    const addToCartButton = fixture.debugElement.query(By.css('button.mt-3'));
    addToCartButton.triggerEventHandler('click', null);

    expect(mockCartService.addToCart).toHaveBeenCalledWith(mockProduct, 5);
  });

  it('should set fallback image on image error', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const imgElement = compiled.querySelector('img') as HTMLImageElement;
    imgElement.src = 'invalid-image-url';
    const mockEvent = new Event('error');
    imgElement.dispatchEvent(mockEvent);
  
    fixture.detectChanges();
    expect(imgElement.src.endsWith('fallback.svg')).toBeTrue();
  });

  it('should disable the increase button when quantity reaches available amount', () => {
    mockCartService.getQuantityInCart.and.returnValue(0);
    fixture.detectChanges();
    component.quantity.set(mockProduct.availableAmount);
    fixture.detectChanges();
  
    const increaseButton = fixture.debugElement.query(By.css('button:nth-of-type(2)'));
    expect(increaseButton.nativeElement.disabled).toBeTrue();
  });
  
  it('should correctly compute available quantity', () => {
    mockCartService.getQuantityInCart.and.returnValue(3);
    fixture.detectChanges();
  
    expect(component.availableQuantity()).toBe(mockProduct.availableAmount - 3);
  });
  
  it('should update the UI when quantity changes', () => {
    component.ngOnInit();
    fixture.detectChanges();
  
    const quantityInput = fixture.debugElement.query(By.css('input'));
    expect(quantityInput.nativeElement.value).toBe(String(mockProduct.minOrderAmount));
  
    component.adjustQuantity(2);
    fixture.detectChanges();
    expect(quantityInput.nativeElement.value).toBe(String(mockProduct.minOrderAmount + 2));
  });

  it('should be able to decrease the quantity after product added to the cart', () => {
    mockCartService.getQuantityInCart.and.returnValue(3);
    fixture.detectChanges();
  
    const decreaseButton = fixture.debugElement.query(By.css('button:nth-of-type(1)'));
    expect(decreaseButton.nativeElement.disabled).toBeFalse();
  });
  
});