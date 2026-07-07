import { createReducer, on } from '@ngrx/store';

import { SupplierAction } from './supplier.action';
import { SupplierState } from './supplier.state';

const initialState: SupplierState = {};

export const supplierReducer = createReducer(
  initialState,
  on(
    SupplierAction.getListSuppliers,
    SupplierAction.getSupplierDetail,
    SupplierAction.createSupplier,
    SupplierAction.updateSupplier,
    SupplierAction.deleteSupplier,
    (state) => ({
      ...state,
      isLoading: true,
      error: undefined,
      successMessage: undefined
    })
  ),
  on(SupplierAction.getListSuppliersResponse, (state, { response }) => ({
    ...state,
    suppliers: response.data,
    isLoading: false
  })),
  on(SupplierAction.getSupplierDetailResponse, (state, { response }) => ({
    ...state,
    selectedSupplier: response.data,
    isLoading: false
  })),
  on(SupplierAction.createSupplierResponse, (state, { response }) => ({
    ...state,
    suppliers: response.data
      ? [response.data, ...(state.suppliers ?? [])]
      : state.suppliers,
    selectedSupplier: response.data,
    isLoading: false,
    successMessage: response.message
  })),
  on(SupplierAction.updateSupplierResponse, (state, { response }) => ({
    ...state,
    suppliers: response.data
      ? (state.suppliers ?? []).map((supplier) =>
          supplier.id === response.data.id ? response.data : supplier
        )
      : state.suppliers,
    selectedSupplier: response.data,
    isLoading: false,
    successMessage: response.message
  })),
  on(SupplierAction.deleteSupplierResponse, (state, { id, response }) => ({
    ...state,
    suppliers: (state.suppliers ?? []).filter((supplier) => supplier.id !== id),
    selectedSupplier:
      state.selectedSupplier?.id === id ? undefined : state.selectedSupplier,
    isLoading: false,
    successMessage: response.message
  })),
  on(SupplierAction.setError, (state, { error }) => ({
    ...state,
    error,
    isLoading: false
  })),
  on(SupplierAction.resetError, (state) => ({
    ...state,
    error: undefined
  })),
  on(SupplierAction.resetSuccessMessage, (state) => ({
    ...state,
    successMessage: undefined
  })),
  on(SupplierAction.resetSuppliersState, (_) => initialState)
);
