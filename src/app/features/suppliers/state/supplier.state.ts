import { CommonResponseModel } from '../../../shared/models/common-response.model';
import { ApiErrorModel } from '../../../shared/models/error.model';
import { SupplierModel } from '../models/supplier.model';

export const SUPPLIER_FEATURE_KEY = 'suppliers';

export interface SupplierState {
  suppliers?: SupplierModel[];
  selectedSupplier?: SupplierModel;
  isLoading?: boolean;
  error?: CommonResponseModel | ApiErrorModel;
  successMessage?: string;
}
