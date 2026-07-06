import { Action } from '@ngrx/store';

import { categoryReducer } from '../features/categories/state/category.reducer';
import { StockState } from './stock.state';

export function stockReducer(
  state: StockState | undefined,
  action: Action
): StockState {
  return {
    categories: categoryReducer(state?.categories, action)
  };
}
