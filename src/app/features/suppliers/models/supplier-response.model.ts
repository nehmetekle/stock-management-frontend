import { CommonResponseModel } from '../../../shared/models/common-response.model';
import { SupplierModel } from './supplier.model';

export type SupplierListResponse = CommonResponseModel<SupplierModel[]>;
export type SupplierResponse = CommonResponseModel<SupplierModel>;
export type SupplierDeleteResponse = CommonResponseModel<null>;
