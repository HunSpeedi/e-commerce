import { Routes } from '@angular/router';

import { ProductsResolver } from './resolvers/products.resolver';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'products',
    pathMatch: 'full',
  },
  { 
    path: 'products', 
    loadComponent: () => import('./components/product-list/product-list.component').then(m => m.ProductListComponent),
    resolve: { products: ProductsResolver }
  },
  { 
    path: 'cart',
    loadComponent: () => import('./components/cart/cart.component').then(m => m.CartComponent),
   },
];
