import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiConfigService } from '../../../core/services/api-config.service';
import { ProductFilterModel } from '../models/product-filter.model';
import { ProductRequestModel } from '../models/product-request.model';
import {
  ProductDeleteResponse,
  ProductListResponse,
  ProductResponse
} from '../models/product-response.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly endpoint = this.apiConfig.endpoint('products');

  constructor(
    private readonly http: HttpClient,
    private readonly apiConfig: ApiConfigService
  ) {}

  getListProducts(filters?: ProductFilterModel): Observable<ProductListResponse> {
    const params: Record<string, number> = {};

    if (filters?.category) {
      params['category'] = filters.category;
    }

    if (filters?.supplier) {
      params['supplier'] = filters.supplier;
    }

    if (filters?.maxPrice) {
      params['maxPrice'] = filters.maxPrice;
    }

    return this.http.get<ProductListResponse>(this.endpoint, { params });
  }

  getProductDetail(id: number): Observable<ProductResponse> {
    return this.http.get<ProductResponse>(`${this.endpoint}/detail`, {
      params: { id }
    });
  }

  createProduct(request: ProductRequestModel): Observable<ProductResponse> {
    return this.http.post<ProductResponse>(this.endpoint, request);
  }

  updateProduct(request: ProductRequestModel): Observable<ProductResponse> {
    return this.http.put<ProductResponse>(this.endpoint, request);
  }

  deleteProduct(id: number): Observable<ProductDeleteResponse> {
    return this.http.delete<ProductDeleteResponse>(this.endpoint, {
      body: { id }
    });
  }
}
