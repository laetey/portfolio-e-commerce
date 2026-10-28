import type { APIRequestContext, APIResponse } from '@playwright/test';

export class ApiClient {
  constructor(private readonly request: APIRequestContext) {}

  get(path: string, params?: Record<string, string>): Promise<APIResponse> {
    return this.request.get(path, { params });
  }

  post(path: string, form?: Record<string, string>): Promise<APIResponse> {
    return this.request.post(path, form ? { form } : {});
  }

  put(path: string, form?: Record<string, string>): Promise<APIResponse> {
    return this.request.put(path, form ? { form } : {});
  }

  delete(path: string, form?: Record<string, string>): Promise<APIResponse> {
    return this.request.delete(path, form ? { form } : {});
  }
}
