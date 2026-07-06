import { CommonResponseModel } from '../../../shared/models/common-response.model';
import { CategoryModel } from './category.model';

export type CategoryListResponse = CommonResponseModel<CategoryModel[]>;
export type CategoryResponse = CommonResponseModel<CategoryModel>;
export type CategoryDeleteResponse = CommonResponseModel<null>;
