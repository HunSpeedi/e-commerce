import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { CartItemComponent } from './cart-item.component';
import { CartService } from '../../services/cart.service';

describe('CartItemComponent', () => {
  let component: CartItemComponent;
  let fixture: ComponentFixture<CartItemComponent>;
  let mockCartService: jasmine.SpyObj<CartService>;

  const mockCartItem = {
    id: 1,
    name: 'Test Product',
    price: 100,
    quantity: 2,
    img: '',
  };

  beforeEach(() => {
    mockCartService = jasmine.createSpyObj('CartService', ['removeFromCart']);

    TestBed.configureTestingModule({
      imports: [CartItemComponent],
      providers: [{ provide: CartService, useValue: mockCartService }],
    });

    fixture = TestBed.createComponent(CartItemComponent);
    component = fixture.componentInstance;
    component.item = mockCartItem;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display the product name and quantity', () => {
    const nameElement = fixture.debugElement.query(By.css('.font-medium')).nativeElement;
    const quantityElement = fixture.debugElement.query(By.css('.text-sm')).nativeElement;

    expect(nameElement.textContent).toContain(mockCartItem.name);
    expect(quantityElement.textContent).toContain(`x ${mockCartItem.quantity}`);
  });

  it('should display the total price', () => {
    const priceElement = fixture.debugElement.query(By.css('div')).nativeElement;
    expect(priceElement.textContent).toContain(`$${mockCartItem.price * mockCartItem.quantity}`);
  });

  it('should call remove() when the remove button is clicked', () => {
    spyOn(component, 'remove').and.callThrough();
    const removeButton = fixture.debugElement.query(By.css('button')).nativeElement;
    removeButton.click();
    expect(component.remove).toHaveBeenCalled();
    expect(mockCartService.removeFromCart).toHaveBeenCalledWith(mockCartItem.id);
  });

  it('should set a fallback image on image error', () => {
    const imgElement = fixture.debugElement.query(By.css('img')).nativeElement;
    imgElement.dispatchEvent(new Event('error'));
    fixture.detectChanges();
    expect(imgElement.src).toContain('fallback.svg');
  });
});