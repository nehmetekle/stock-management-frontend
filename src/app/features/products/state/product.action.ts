import { createAction, props } from '@ngrx/store';

import { CommonResponseModel } from '../../../shared/models/common-response.model';
import { ApiErrorModel } from '../../../shared/models/error.model';
import { ProductRequestModel } from '../models/product-request.model';
import {
  ProductDeleteResponse,
  ProductListResponse,
  ProductResponse,
} from '../models/product-response.model';

export abstract class ProductAction {
  static getListProducts = createAction('[Products] Retrieve all products');

  static getListProductsResponse = createAction(
    '[Products] Retrieve all products response',
    props<{ response: ProductListResponse }>()
  );

  static getListProductsFailure = createAction(
    '[Products] Retrieve all products failure',
    props<{ error: ApiErrorModel }>()
  );

  static getProductDetail = createAction(
    '[Products] Retrieve product detail',
    props<{ id: number }>()
  );

  static getProductDetailResponse = createAction(
    '[Products] Retrieve product detail response',
    props<{ response: ProductResponse }>()
  );

  static createProduct = createAction(
    '[Products] Create product',
    props<{ request: ProductRequestModel }>()
  );

  static createProductResponse = createAction(
    '[Products] Create product response',
    props<{ response: ProductResponse }>()
  );

  static updateProduct = createAction(
    '[Products] Update product',
    props<{ request: ProductRequestModel }>()
  );

  static updateProductResponse = createAction(
    '[Products] Update product response',
    props<{ response: ProductResponse }>()
  );

  static deleteProduct = createAction(
    '[Products] Delete product',
    props<{ id: number }>()
  );

  static deleteProductResponse = createAction(
    '[Products] Delete product response',
    props<{ id: number; response: ProductDeleteResponse }>()
  );

  static resetProductsState = createAction('[Products] Reset State');

  static setError = createAction(
    '[Products] Set API error',
    props<{ error: CommonResponseModel | ApiErrorModel }>()
  );

  static resetError = createAction('[Products] Reset API error');

  static resetSuccessMessage = createAction('[Products] Reset success message');

  static cancelProductsRequest = createAction('[Products] Cancel Products Request');
}
