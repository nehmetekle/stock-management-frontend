import { createAction, props } from '@ngrx/store';

import { CommonResponseModel } from '../../../shared/models/common-response.model';
import { ApiErrorModel } from '../../../shared/models/error.model';
import { SupplierRequestModel } from '../models/supplier-request.model';
import {
  SupplierDeleteResponse,
  SupplierListResponse,
  SupplierResponse,
  SupplierSummaryResponse,
} from '../models/supplier-response.model';

export abstract class SupplierAction {
  static getListSuppliers = createAction('[Suppliers] Retrieve all suppliers');

  static getListSuppliersResponse = createAction(
    '[Suppliers] Retrieve all suppliers response',
    props<{ response: SupplierListResponse }>()
  );

  static getListSuppliersFailure = createAction(
    '[Suppliers] Retrieve all suppliers failure',
    props<{ error: ApiErrorModel }>()
  );

  static getSupplierDetail = createAction(
    '[Suppliers] Retrieve supplier detail',
    props<{ id: number }>()
  );

  static getSupplierDetailResponse = createAction(
    '[Suppliers] Retrieve supplier detail response',
    props<{ response: SupplierResponse }>()
  );

  static getSupplierSummary = createAction('[Suppliers] Retrieve supplier summary');

  static getSupplierSummaryResponse = createAction(
    '[Suppliers] Retrieve supplier summary response',
    props<{ response: SupplierSummaryResponse }>()
  );

  static createSupplier = createAction(
    '[Suppliers] Create supplier',
    props<{ request: SupplierRequestModel }>()
  );

  static createSupplierResponse = createAction(
    '[Suppliers] Create supplier response',
    props<{ response: SupplierResponse }>()
  );

  static updateSupplier = createAction(
    '[Suppliers] Update supplier',
    props<{ request: SupplierRequestModel }>()
  );

  static updateSupplierResponse = createAction(
    '[Suppliers] Update supplier response',
    props<{ response: SupplierResponse }>()
  );

  static deleteSupplier = createAction(
    '[Suppliers] Delete supplier',
    props<{ id: number }>()
  );

  static deleteSupplierResponse = createAction(
    '[Suppliers] Delete supplier response',
    props<{ id: number; response: SupplierDeleteResponse }>()
  );

  static resetSuppliersState = createAction('[Suppliers] Reset State');

  static setError = createAction(
    '[Suppliers] Set API error',
    props<{ error: CommonResponseModel | ApiErrorModel }>()
  );

  static resetError = createAction('[Suppliers] Reset API error');

  static resetSuccessMessage = createAction('[Suppliers] Reset success message');

  static cancelSuppliersRequest = createAction('[Suppliers] Cancel Suppliers Request');
}
