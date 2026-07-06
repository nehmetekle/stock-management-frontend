import { createReducer, on } from '@ngrx/store';

import { CategoryAction } from './category.action';
import { CategoryState } from './category.state';

const initialState: CategoryState = {};

export const categoryReducer = createReducer(
  initialState,
  on(
    CategoryAction.getListCategories,
    CategoryAction.getCategoryDetail,
    CategoryAction.createCategory,
    CategoryAction.updateCategory,
    CategoryAction.deleteCategory,
    (state) => ({
      ...state,
      isLoading: true,
      error: undefined,
      successMessage: undefined
    })
  ),
  on(CategoryAction.getListCategoriesResponse, (state, { response }) => ({
    ...state,
    categories: response.data,
    isLoading: false
  })),
  on(CategoryAction.getCategoryDetailResponse, (state, { response }) => ({
    ...state,
    selectedCategory: response.data,
    isLoading: false
  })),
  on(CategoryAction.createCategoryResponse, (state, { response }) => ({
    ...state,
    categories: response.data
      ? [response.data, ...(state.categories ?? [])]
      : state.categories,
    selectedCategory: response.data,
    isLoading: false,
    successMessage: response.message
  })),
  on(CategoryAction.updateCategoryResponse, (state, { response }) => ({
    ...state,
    categories: response.data
      ? (state.categories ?? []).map((category) =>
          category.id === response.data.id ? response.data : category
        )
      : state.categories,
    selectedCategory: response.data,
    isLoading: false,
    successMessage: response.message
  })),
  on(CategoryAction.deleteCategoryResponse, (state, { id, response }) => ({
    ...state,
    categories: (state.categories ?? []).filter((category) => category.id !== id),
    selectedCategory:
      state.selectedCategory?.id === id ? undefined : state.selectedCategory,
    isLoading: false,
    successMessage: response.message
  })),
  on(CategoryAction.setError, (state, { error }) => ({
    ...state,
    error,
    isLoading: false
  })),
  on(CategoryAction.resetError, (state) => ({
    ...state,
    error: undefined
  })),
  on(CategoryAction.resetSuccessMessage, (state) => ({
    ...state,
    successMessage: undefined
  })),
  on(CategoryAction.resetCategoriesState, (_) => initialState)
);
