import { createReducer, on } from '@ngrx/store';

import { ProductAction } from './product.action';
import { ProductState } from './product.state';

const initialState: ProductState = {};

export const productReducer = createReducer(
  initialState,
  on(
    ProductAction.getListProducts,
    ProductAction.getProductDetail,
    ProductAction.createProduct,
    ProductAction.updateProduct,
    ProductAction.deleteProduct,
    (state) => ({
      ...state,
      isLoading: true,
      error: undefined,
      successMessage: undefined
    })
  ),
  on(ProductAction.getListProductsResponse, (state, { response }) => ({
    ...state,
    products: response.data,
    isLoading: false
  })),
  on(ProductAction.getProductDetailResponse, (state, { response }) => ({
    ...state,
    selectedProduct: response.data,
    isLoading: false
  })),
  on(ProductAction.createProductResponse, (state, { response }) => ({
    ...state,
    products: response.data
      ? [response.data, ...(state.products ?? [])]
      : state.products,
    selectedProduct: response.data,
    isLoading: false,
    successMessage: response.message
  })),
  on(ProductAction.updateProductResponse, (state, { response }) => ({
    ...state,
    products: response.data
      ? (state.products ?? []).map((product) =>
          product.id === response.data.id ? response.data : product
        )
      : state.products,
    selectedProduct: response.data,
    isLoading: false,
    successMessage: response.message
  })),
  on(ProductAction.deleteProductResponse, (state, { id, response }) => ({
    ...state,
    products: (state.products ?? []).filter((product) => product.id !== id),
    selectedProduct:
      state.selectedProduct?.id === id ? undefined : state.selectedProduct,
    isLoading: false,
    successMessage: response.message
  })),
  on(ProductAction.setError, (state, { error }) => ({
    ...state,
    error,
    isLoading: false
  })),
  on(ProductAction.resetError, (state) => ({
    ...state,
    error: undefined
  })),
  on(ProductAction.resetSuccessMessage, (state) => ({
    ...state,
    successMessage: undefined
  })),
  on(ProductAction.resetProductsState, (_) => initialState)
);
