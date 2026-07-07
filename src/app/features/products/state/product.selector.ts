import { createSelector } from '@ngrx/store';

import { AppState } from '../../../store/app.state';

const selectProductsState = (state: AppState) => state.stock.products;

export const selectAllProducts = createSelector(
  selectProductsState,
  (state) => state?.products ?? []
);

export const selectSelectedProduct = createSelector(
  selectProductsState,
  (state) => state?.selectedProduct
);

export const selectProductsLoading = createSelector(
  selectProductsState,
  (state) => state?.isLoading ?? false
);

export const selectProductsError = createSelector(
  selectProductsState,
  (state) => state?.error
);

export const selectProductsSuccessMessage = createSelector(
  selectProductsState,
  (state) => state?.successMessage
);
