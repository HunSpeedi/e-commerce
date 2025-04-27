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
    mockCartService = jasmine.createSpyObj('CartService', ['getQuantityInCart', 'addToCart', 'removeFromCart']);
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

  it('should initialize quantity to product.minOrderAmount', () => {
    component.ngOnInit();
    expect(component.quantity()).toBe(mockProduct.minOrderAmount);
  });

  it('should call addToCart when "Add to Cart" button is clicked', () => {
    mockCartService.getQuantityInCart.and.returnValue(0);
    fixture.detectChanges();

    const addToCartButton = fixture.debugElement.query(By.css('button.mt-3'));
    addToCartButton.triggerEventHandler('click', null);
    expect(mockCartService.addToCart).toHaveBeenCalledWith(mockProduct, mockProduct.minOrderAmount);  
  });

  it('should adjust quantity when + or − buttons are clicked', () => {
    mockCartService.getQuantityInCart.and.returnValue(mockProduct.minOrderAmount);
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

  it('should remove the item from cart when quantity is decreased below minimum', () => {
    mockCartService.getQuantityInCart.and.returnValue(mockProduct.minOrderAmount);
    fixture.detectChanges();

    const decreaseButton = fixture.debugElement.query(By.css('button:nth-of-type(1)'));
    decreaseButton.triggerEventHandler('click', null);
    expect(mockCartService.removeFromCart).toHaveBeenCalledWith(mockProduct);
  });

  it('should disable the increase button when quantity reaches available amount', () => {
    mockCartService.getQuantityInCart.and.returnValue(mockProduct.availableAmount);
    fixture.detectChanges();
  
    const increaseButton = fixture.debugElement.query(By.css('button:nth-of-type(2)'));
    expect(increaseButton.nativeElement.disabled).toBeTrue();
  });
  
  it('should correctly compute available quantity', () => {
    mockCartService.getQuantityInCart.and.returnValue(3);
    fixture.detectChanges();
  
    expect(component.availableQuantity()).toBe(mockProduct.availableAmount - 3);
  });

  it('should call removeFromCart when adjustQuantity is called with a quantity less than minOrderAmount', () => {
    mockCartService.getQuantityInCart.and.returnValue(mockProduct.minOrderAmount);
    mockCartService.removeFromCart.and.returnValue();
    fixture.detectChanges();

    component.adjustQuantity(mockProduct.minOrderAmount - 3);

    expect(mockCartService.removeFromCart).toHaveBeenCalledWith(mockProduct);
    expect(component.quantity()).toBe(mockProduct.minOrderAmount);
  });

  it('should call addToCart when adjustQuantity is called with a valid quantity', () => {
    mockCartService.getQuantityInCart.and.returnValue(mockProduct.minOrderAmount);
    fixture.detectChanges();

    component.adjustQuantity(1);

    expect(mockCartService.addToCart).toHaveBeenCalled();
    expect(component.quantity()).toBe(mockProduct.minOrderAmount + 1);
  });

  it('should call changeQuantity when onQuantityChange is triggered', () => {
    const mockEvent = {
      target: { value: (mockProduct.minOrderAmount + 5).toString() }
    } as unknown as Event;

    spyOn(component, 'changeQuantity');
    component.onQuantityChange(mockEvent);

    expect(component.changeQuantity).toHaveBeenCalledWith(mockProduct.minOrderAmount + 5);
  });

  it('should not call changeQuantity when adjustQuantity is called with a quantity greater than availableAmount', () => {
    mockCartService.getQuantityInCart.and.returnValue(mockProduct.minOrderAmount);
    fixture.detectChanges();

    component.adjustQuantity(mockProduct.availableAmount + 1);

    expect(mockCartService.addToCart).not.toHaveBeenCalled();
  });

  it('should display the select element when isInCart is true', () => {
    mockCartService.getQuantityInCart.and.returnValue(mockProduct.minOrderAmount);
    fixture.detectChanges();

    const selectElement = fixture.debugElement.query(By.css('select'));
    expect(selectElement).toBeTruthy();

    const addToCartButton = fixture.debugElement.query(By.css('button.mt-3'));
    expect(addToCartButton).toBeFalsy();
  });

  it('should display the add to cart button when isInCart is false', () => {
    mockCartService.getQuantityInCart.and.returnValue(0);
    fixture.detectChanges();

    const addToCartButton = fixture.debugElement.query(By.css('button.mt-3'));
    expect(addToCartButton).toBeTruthy();

    const selectElement = fixture.debugElement.query(By.css('select'));
    expect(selectElement).toBeFalsy();
  });
});