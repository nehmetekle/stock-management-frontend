import { CommonResponseModel } from '../../../shared/models/common-response.model';
import { ApiErrorModel } from '../../../shared/models/error.model';
import { ProductModel } from '../models/product.model';

export const PRODUCT_FEATURE_KEY = 'products';

export interface ProductState {
  products?: ProductModel[];
  selectedProduct?: ProductModel;
  isLoading?: boolean;
  error?: CommonResponseModel | ApiErrorModel;
  successMessage?: string;
}
