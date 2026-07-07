import { CommonResponseModel } from '../../../shared/models/common-response.model';
import { SupplierModel } from './supplier.model';

export type SupplierListResponse = CommonResponseModel<SupplierModel[]>;
