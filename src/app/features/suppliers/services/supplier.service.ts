import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiConfigService } from '../../../core/services/api-config.service';
import { SupplierListResponse } from '../models/supplier-response.model';

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
}
