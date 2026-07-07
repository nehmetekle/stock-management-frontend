import { CommonResponseModel } from '../../../shared/models/common-response.model';
import { ApiErrorModel } from '../../../shared/models/error.model';
import { SupplierModel } from '../models/supplier.model';
import { SupplierSummaryModel } from '../models/supplier-summary.model';

export const SUPPLIER_FEATURE_KEY = 'suppliers';

export interface SupplierState {
  suppliers?: SupplierModel[];
  supplierSummary?: SupplierSummaryModel[];
  selectedSupplier?: SupplierModel;
  isLoading?: boolean;
  error?: CommonResponseModel | ApiErrorModel;
  successMessage?: string;
}
