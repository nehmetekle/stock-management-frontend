import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, of, switchMap, takeUntil } from 'rxjs';

import { ApiErrorModel } from '../../../shared/models/error.model';
import { CategoryService } from '../services/category.service';
import { CategoryAction } from './category.action';

@Injectable()
export class CategoryEffect {
  constructor(
    private readonly actions$: Actions,
    private readonly categoryService: CategoryService
  ) {}

  getListCategories = createEffect(() =>
    this.actions$.pipe(
      ofType(CategoryAction.getListCategories),
      exhaustMap(() =>
        this.categoryService.getListCategories().pipe(
          takeUntil(this.actions$.pipe(ofType(CategoryAction.cancelCategoriesRequest))),
          switchMap((response) => [
            CategoryAction.getListCategoriesResponse({ response })
          ]),
          catchError((error: HttpErrorResponse) =>
            of(CategoryAction.setError({ error: this.toApiError(error) }))
          )
        )
      )
    )
  );

  getCategoryDetail = createEffect(() =>
    this.actions$.pipe(
      ofType(CategoryAction.getCategoryDetail),
      exhaustMap(({ id }) =>
        this.categoryService.getCategoryDetail(id).pipe(
          takeUntil(this.actions$.pipe(ofType(CategoryAction.cancelCategoriesRequest))),
          switchMap((response) => [
            CategoryAction.getCategoryDetailResponse({ response })
          ]),
          catchError((error: HttpErrorResponse) =>
            of(CategoryAction.setError({ error: this.toApiError(error) }))
          )
        )
      )
    )
  );

  createCategory = createEffect(() =>
    this.actions$.pipe(
      ofType(CategoryAction.createCategory),
      exhaustMap(({ request }) =>
        this.categoryService.createCategory(request).pipe(
          takeUntil(this.actions$.pipe(ofType(CategoryAction.cancelCategoriesRequest))),
          switchMap((response) => [
            CategoryAction.createCategoryResponse({ response })
          ]),
          catchError((error: HttpErrorResponse) =>
            of(CategoryAction.setError({ error: this.toApiError(error) }))
          )
        )
      )
    )
  );

  updateCategory = createEffect(() =>
    this.actions$.pipe(
      ofType(CategoryAction.updateCategory),
      exhaustMap(({ request }) =>
        this.categoryService.updateCategory(request).pipe(
          takeUntil(this.actions$.pipe(ofType(CategoryAction.cancelCategoriesRequest))),
          switchMap((response) => [
            CategoryAction.updateCategoryResponse({ response })
          ]),
          catchError((error: HttpErrorResponse) =>
            of(CategoryAction.setError({ error: this.toApiError(error) }))
          )
        )
      )
    )
  );

  deleteCategory = createEffect(() =>
    this.actions$.pipe(
      ofType(CategoryAction.deleteCategory),
      exhaustMap(({ id }) =>
        this.categoryService.deleteCategory(id).pipe(
          takeUntil(this.actions$.pipe(ofType(CategoryAction.cancelCategoriesRequest))),
          switchMap((response) => [
            CategoryAction.deleteCategoryResponse({ id, response })
          ]),
          catchError((error: HttpErrorResponse) =>
            of(CategoryAction.setError({ error: this.toApiError(error) }))
          )
        )
      )
    )
  );

  private toApiError(error: HttpErrorResponse): ApiErrorModel {
    if (error.error && typeof error.error === 'object') {
      return {
        ...error.error,
        status: error.status
      };
    }

    return {
      success: false,
      status: error.status,
      statusCode: error.status,
      message: error.message || 'An unexpected API error occurred',
      errors: null
    };
  }
}
