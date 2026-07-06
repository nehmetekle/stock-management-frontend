import { CommonResponseModel } from '../../../shared/models/common-response.model';
import { ApiErrorModel } from '../../../shared/models/error.model';
import { CategoryModel } from '../models/category.model';

export const CATEGORY_FEATURE_KEY = 'categories';

export interface CategoryState {
  categories?: CategoryModel[];
  selectedCategory?: CategoryModel;
  isLoading?: boolean;
  error?: CommonResponseModel | ApiErrorModel;
  successMessage?: string;
}
