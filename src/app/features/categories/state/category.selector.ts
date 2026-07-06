import { createSelector } from '@ngrx/store';

import { AppState } from '../../../store/app.state';

const selectCategoriesState = (state: AppState) => state.stock.categories;

export const selectAllCategories = createSelector(
  selectCategoriesState,
  (state) => state?.categories ?? []
);

export const selectSelectedCategory = createSelector(
  selectCategoriesState,
  (state) => state?.selectedCategory
);

export const selectCategoriesLoading = createSelector(
  selectCategoriesState,
  (state) => state?.isLoading ?? false
);

export const selectCategoriesError = createSelector(
  selectCategoriesState,
  (state) => state?.error
);

export const selectCategoriesSuccessMessage = createSelector(
  selectCategoriesState,
  (state) => state?.successMessage
);
