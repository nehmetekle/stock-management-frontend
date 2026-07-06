import { createAction, props } from '@ngrx/store';

import { CommonResponseModel } from '../../../shared/models/common-response.model';
import { ApiErrorModel } from '../../../shared/models/error.model';
import { CategoryRequestModel } from '../models/category-request.model';
import {
  CategoryDeleteResponse,
  CategoryListResponse,
  CategoryResponse,
} from '../models/category-response.model';

export abstract class CategoryAction {
  static getListCategories = createAction('[Categories] Retrieve all categories');

  static getListCategoriesResponse = createAction(
    '[Categories] Retrieve all categories response',
    props<{ response: CategoryListResponse }>()
  );

  static getListCategoriesFailure = createAction(
    '[Categories] Retrieve all categories failure',
    props<{ error: ApiErrorModel }>()
  );

  static getCategoryDetail = createAction(
    '[Categories] Retrieve category detail',
    props<{ id: number }>()
  );

  static getCategoryDetailResponse = createAction(
    '[Categories] Retrieve category detail response',
    props<{ response: CategoryResponse }>()
  );

  static createCategory = createAction(
    '[Categories] Create category',
    props<{ request: CategoryRequestModel }>()
  );

  static createCategoryResponse = createAction(
    '[Categories] Create category response',
    props<{ response: CategoryResponse }>()
  );

  static updateCategory = createAction(
    '[Categories] Update category',
    props<{ request: CategoryRequestModel }>()
  );

  static updateCategoryResponse = createAction(
    '[Categories] Update category response',
    props<{ response: CategoryResponse }>()
  );

  static deleteCategory = createAction(
    '[Categories] Delete category',
    props<{ id: number }>()
  );

  static deleteCategoryResponse = createAction(
    '[Categories] Delete category response',
    props<{ id: number; response: CategoryDeleteResponse }>()
  );

  static resetCategoriesState = createAction('[Categories] Reset State');

  static setError = createAction(
    '[Categories] Set API error',
    props<{ error: CommonResponseModel | ApiErrorModel }>()
  );

  static resetError = createAction('[Categories] Reset API error');

  static resetSuccessMessage = createAction('[Categories] Reset success message');

  static cancelCategoriesRequest = createAction('[Categories] Cancel Categories Request');
}
