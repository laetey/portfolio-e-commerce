import type { APIResponse } from '@playwright/test';
import { ApiClient } from '../clients/api-client';

export class ProductsService {
  constructor(private readonly apiClient: ApiClient) {}

  getAllProducts(): Promise<APIResponse> {
    return this.apiClient.get('/api/productsList');
  }

  postAllProducts(): Promise<APIResponse> {
    return this.apiClient.post('/api/productsList');
  }

  getAllBrands(): Promise<APIResponse> {
    return this.apiClient.get('/api/brandsList');
  }

  putAllBrands(): Promise<APIResponse> {
    return this.apiClient.put('/api/brandsList');
  }

  searchProducts(searchProduct?: string): Promise<APIResponse> {
    return this.apiClient.post(
      '/api/searchProduct',
      searchProduct === undefined ? undefined : { search_product: searchProduct },
    );
  }
}
