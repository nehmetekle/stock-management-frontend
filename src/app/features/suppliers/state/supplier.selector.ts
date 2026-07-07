import { createSelector } from '@ngrx/store';

import { AppState } from '../../../store/app.state';

const selectSuppliersState = (state: AppState) => state.stock.suppliers;

export const selectAllSuppliers = createSelector(
  selectSuppliersState,
  (state) => state?.suppliers ?? []
);

export const selectSelectedSupplier = createSelector(
  selectSuppliersState,
  (state) => state?.selectedSupplier
);

export const selectSuppliersLoading = createSelector(
  selectSuppliersState,
  (state) => state?.isLoading ?? false
);

export const selectSuppliersError = createSelector(
  selectSuppliersState,
  (state) => state?.error
);

export const selectSuppliersSuccessMessage = createSelector(
  selectSuppliersState,
  (state) => state?.successMessage
);
