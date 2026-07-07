import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, of, switchMap, takeUntil } from 'rxjs';

import { ApiErrorModel } from '../../../shared/models/error.model';
import { SupplierService } from '../services/supplier.service';
import { SupplierAction } from './supplier.action';

@Injectable()
export class SupplierEffect {
  constructor(
    private readonly actions$: Actions,
    private readonly supplierService: SupplierService
  ) {}

  getListSuppliers = createEffect(() =>
    this.actions$.pipe(
      ofType(SupplierAction.getListSuppliers),
      exhaustMap(() =>
        this.supplierService.getListSuppliers().pipe(
          takeUntil(this.actions$.pipe(ofType(SupplierAction.cancelSuppliersRequest))),
          switchMap((response) => [
            SupplierAction.getListSuppliersResponse({ response })
          ]),
          catchError((error: HttpErrorResponse) =>
            of(SupplierAction.setError({ error: this.toApiError(error) }))
          )
        )
      )
    )
  );

  getSupplierDetail = createEffect(() =>
    this.actions$.pipe(
      ofType(SupplierAction.getSupplierDetail),
      exhaustMap(({ id }) =>
        this.supplierService.getSupplierDetail(id).pipe(
          takeUntil(this.actions$.pipe(ofType(SupplierAction.cancelSuppliersRequest))),
          switchMap((response) => [
            SupplierAction.getSupplierDetailResponse({ response })
          ]),
          catchError((error: HttpErrorResponse) =>
            of(SupplierAction.setError({ error: this.toApiError(error) }))
          )
        )
      )
    )
  );

  getSupplierSummary = createEffect(() =>
    this.actions$.pipe(
      ofType(SupplierAction.getSupplierSummary),
      exhaustMap(() =>
        this.supplierService.getSupplierSummary().pipe(
          takeUntil(this.actions$.pipe(ofType(SupplierAction.cancelSuppliersRequest))),
          switchMap((response) => [
            SupplierAction.getSupplierSummaryResponse({ response })
          ]),
          catchError((error: HttpErrorResponse) =>
            of(SupplierAction.setError({ error: this.toApiError(error) }))
          )
        )
      )
    )
  );

  createSupplier = createEffect(() =>
    this.actions$.pipe(
      ofType(SupplierAction.createSupplier),
      exhaustMap(({ request }) =>
        this.supplierService.createSupplier(request).pipe(
          takeUntil(this.actions$.pipe(ofType(SupplierAction.cancelSuppliersRequest))),
          switchMap((response) => [
            SupplierAction.createSupplierResponse({ response }),
            SupplierAction.getSupplierSummary()
          ]),
          catchError((error: HttpErrorResponse) =>
            of(SupplierAction.setError({ error: this.toApiError(error) }))
          )
        )
      )
    )
  );

  updateSupplier = createEffect(() =>
    this.actions$.pipe(
      ofType(SupplierAction.updateSupplier),
      exhaustMap(({ request }) =>
        this.supplierService.updateSupplier(request).pipe(
          takeUntil(this.actions$.pipe(ofType(SupplierAction.cancelSuppliersRequest))),
          switchMap((response) => [
            SupplierAction.updateSupplierResponse({ response }),
            SupplierAction.getSupplierSummary()
          ]),
          catchError((error: HttpErrorResponse) =>
            of(SupplierAction.setError({ error: this.toApiError(error) }))
          )
        )
      )
    )
  );

  deleteSupplier = createEffect(() =>
    this.actions$.pipe(
      ofType(SupplierAction.deleteSupplier),
      exhaustMap(({ id }) =>
        this.supplierService.deleteSupplier(id).pipe(
          takeUntil(this.actions$.pipe(ofType(SupplierAction.cancelSuppliersRequest))),
          switchMap((response) => [
            SupplierAction.deleteSupplierResponse({ id, response }),
            SupplierAction.getSupplierSummary()
          ]),
          catchError((error: HttpErrorResponse) =>
            of(SupplierAction.setError({ error: this.toApiError(error) }))
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
