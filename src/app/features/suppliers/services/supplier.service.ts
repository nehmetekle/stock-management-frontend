import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiConfigService } from '../../../core/services/api-config.service';
import { SupplierRequestModel } from '../models/supplier-request.model';
import {
  SupplierDeleteResponse,
  SupplierListResponse,
  SupplierResponse
} from '../models/supplier-response.model';

@Injectable({
  providedIn: 'root'
})
export class SupplierService {
  private readonly endpoint = this.apiConfig.endpoint('suppliers');

  constructor(
    private readonly http: HttpClient,
    private readonly apiConfig: ApiConfigService
  ) {}

  getListSuppliers(): Observable<SupplierListResponse> {
    return this.http.get<SupplierListResponse>(this.endpoint);
  }

  getSupplierDetail(id: number): Observable<SupplierResponse> {
    return this.http.get<SupplierResponse>(`${this.endpoint}/detail`, {
      params: { id }
    });
  }

  createSupplier(request: SupplierRequestModel): Observable<SupplierResponse> {
    return this.http.post<SupplierResponse>(this.endpoint, request);
  }

  updateSupplier(request: SupplierRequestModel): Observable<SupplierResponse> {
    return this.http.put<SupplierResponse>(this.endpoint, request);
  }

  deleteSupplier(id: number): Observable<SupplierDeleteResponse> {
    return this.http.delete<SupplierDeleteResponse>(this.endpoint, {
      body: { id }
    });
  }
}
