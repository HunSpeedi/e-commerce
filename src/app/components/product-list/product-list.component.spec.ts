import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';

import { ProductListComponent } from './product-list.component';
import { ProductsService } from '../../services/products.service';
import { type Product } from '../../models/product.model';

describe('ProductListComponent', () => {
  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;
  let mockProductsService: jasmine.SpyObj<ProductsService>;

  const mockProducts: Product[] = [
    { id: 1, img: '', name: 'Product 1', availableAmount: 10, minOrderAmount: 1, price: 100 },
    { id: 2, img: '', name: 'Product 2', availableAmount: 5, minOrderAmount: 1, price: 200 },
  ];

  beforeEach(async () => {
    mockProductsService = jasmine.createSpyObj('ProductsService', ['getProducts']);
    mockProductsService.getProducts.and.returnValue(signal(mockProducts));

    await TestBed.configureTestingModule({
      imports: [ProductListComponent],
      providers: [{ provide: ProductsService, useValue: mockProductsService }],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch products from the ProductsService', () => {
    expect(component.products).toBeTruthy();
    expect(component.products()).toEqual(mockProducts);
    expect(mockProductsService.getProducts).toHaveBeenCalled();
  });

  it('should render a list of products', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const productElements = compiled.querySelectorAll('app-product');
    expect(productElements.length).toBe(mockProducts.length);
  });
});