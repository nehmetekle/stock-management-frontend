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
        path: '**',
        redirectTo: 'categories'
      }
    ]
  }
];
