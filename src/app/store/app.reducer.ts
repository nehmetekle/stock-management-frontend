import { ActionReducerMap } from '@ngrx/store';

import { AppState } from './app.state';
import { stockReducer } from './stock.reducer';

export const appReducers: ActionReducerMap<AppState> = {
  stock: stockReducer
};
