import { CommonResponseModel } from '../../../shared/models/common-response.model';
import { ProductModel } from './product.model';

export type ProductListResponse = CommonResponseModel<ProductModel[]>;
export type ProductResponse = CommonResponseModel<ProductModel>;
export type ProductDeleteResponse = CommonResponseModel<null>;
