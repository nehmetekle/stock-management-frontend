import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiConfigService } from '../../../core/services/api-config.service';
import { CategoryRequestModel } from '../models/category-request.model';
import {
  CategoryDeleteResponse,
  CategoryListResponse,
  CategoryResponse
} from '../models/category-response.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private readonly endpoint = this.apiConfig.endpoint('categories');

  constructor(
    private readonly http: HttpClient,
    private readonly apiConfig: ApiConfigService
  ) {}

  getListCategories(): Observable<CategoryListResponse> {
    return this.http.get<CategoryListResponse>(this.endpoint);
  }

  getCategoryDetail(id: number): Observable<CategoryResponse> {
    return this.http.get<CategoryResponse>(`${this.endpoint}/detail`, {
      params: { id }
    });
  }

  createCategory(request: CategoryRequestModel): Observable<CategoryResponse> {
    return this.http.post<CategoryResponse>(this.endpoint, request);
  }

  updateCategory(request: CategoryRequestModel): Observable<CategoryResponse> {
    return this.http.put<CategoryResponse>(this.endpoint, request);
  }

  deleteCategory(id: number): Observable<CategoryDeleteResponse> {
    return this.http.delete<CategoryDeleteResponse>(this.endpoint, {
      body: { id }
    });
  }
}
