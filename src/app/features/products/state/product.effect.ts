import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, of, switchMap, takeUntil } from 'rxjs';

import { ApiErrorModel } from '../../../shared/models/error.model';
import { ProductService } from '../services/product.service';
import { ProductAction } from './product.action';

@Injectable()
export class ProductEffect {
  constructor(
    private readonly actions$: Actions,
    private readonly productService: ProductService
  ) {}

  getListProducts = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductAction.getListProducts),
      exhaustMap(({ filters }) =>
        this.productService.getListProducts(filters).pipe(
          takeUntil(this.actions$.pipe(ofType(ProductAction.cancelProductsRequest))),
          switchMap((response) => [
            ProductAction.getListProductsResponse({ response })
          ]),
          catchError((error: HttpErrorResponse) =>
            of(ProductAction.setError({ error: this.toApiError(error) }))
          )
        )
      )
    )
  );

  getProductDetail = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductAction.getProductDetail),
      exhaustMap(({ id }) =>
        this.productService.getProductDetail(id).pipe(
          takeUntil(this.actions$.pipe(ofType(ProductAction.cancelProductsRequest))),
          switchMap((response) => [
            ProductAction.getProductDetailResponse({ response })
          ]),
          catchError((error: HttpErrorResponse) =>
            of(ProductAction.setError({ error: this.toApiError(error) }))
          )
        )
      )
    )
  );

  createProduct = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductAction.createProduct),
      exhaustMap(({ request }) =>
        this.productService.createProduct(request).pipe(
          takeUntil(this.actions$.pipe(ofType(ProductAction.cancelProductsRequest))),
          switchMap((response) => [
            ProductAction.createProductResponse({ response })
          ]),
          catchError((error: HttpErrorResponse) =>
            of(ProductAction.setError({ error: this.toApiError(error) }))
          )
        )
      )
    )
  );

  updateProduct = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductAction.updateProduct),
      exhaustMap(({ request }) =>
        this.productService.updateProduct(request).pipe(
          takeUntil(this.actions$.pipe(ofType(ProductAction.cancelProductsRequest))),
          switchMap((response) => [
            ProductAction.updateProductResponse({ response })
          ]),
          catchError((error: HttpErrorResponse) =>
            of(ProductAction.setError({ error: this.toApiError(error) }))
          )
        )
      )
    )
  );

  deleteProduct = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductAction.deleteProduct),
      exhaustMap(({ id }) =>
        this.productService.deleteProduct(id).pipe(
          takeUntil(this.actions$.pipe(ofType(ProductAction.cancelProductsRequest))),
          switchMap((response) => [
            ProductAction.deleteProductResponse({ id, response })
          ]),
          catchError((error: HttpErrorResponse) =>
            of(ProductAction.setError({ error: this.toApiError(error) }))
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
