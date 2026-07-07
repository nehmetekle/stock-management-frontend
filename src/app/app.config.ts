import { provideHttpClient, withFetch } from '@angular/common/http';
import { ApplicationConfig, isDevMode } from '@angular/core';
import {
  provideClientHydration,
  withNoHttpTransferCache
} from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';

import { CategoryEffect } from './features/categories/state/category.effect';
import { ProductEffect } from './features/products/state/product.effect';
import { SupplierEffect } from './features/suppliers/state/supplier.effect';
import { appReducers } from './store/app.reducer';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(withNoHttpTransferCache()),
    provideHttpClient(withFetch()),
    provideStore(appReducers),
    provideEffects([CategoryEffect, ProductEffect, SupplierEffect]),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: !isDevMode()
    })
  ]
};
