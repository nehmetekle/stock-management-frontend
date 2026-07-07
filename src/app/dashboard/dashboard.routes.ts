import { Routes } from '@angular/router';

import { DashboardComponent } from './dashboard.component';

export const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path: '',
        redirectTo: 'categories',
        pathMatch: 'full'
      },
      {
        path: 'categories',
        loadChildren: () =>
          import('../features/categories/categories.routes').then((m) => m.CATEGORIES_ROUTES)
      },
      {
        path: 'products',
        loadChildren: () =>
          import('../features/products/products.routes').then((m) => m.PRODUCTS_ROUTES)
      },
      {
        path: '**',
        redirectTo: 'categories'
      }
    ]
  }
];
