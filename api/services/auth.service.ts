import type { APIResponse } from '@playwright/test';
import type { AccountPayload } from '../models/account';
import { ApiClient } from '../clients/api-client';

export class AuthService {
  constructor(private readonly apiClient: ApiClient) {}

  verifyLogin(email?: string, password?: string): Promise<APIResponse> {
    const form: Record<string, string> = {};
    if (email !== undefined) form.email = email;
    if (password !== undefined) form.password = password;
    return this.apiClient.post('/api/verifyLogin', form);
  }

  deleteLoginVerification(): Promise<APIResponse> {
    return this.apiClient.delete('/api/verifyLogin');
  }

  createAccount(account: AccountPayload): Promise<APIResponse> {
    return this.apiClient.post('/api/createAccount', { ...account });
  }

  deleteAccount(email: string, password: string): Promise<APIResponse> {
    return this.apiClient.delete('/api/deleteAccount', { email, password });
  }

  updateAccount(account: AccountPayload): Promise<APIResponse> {
    return this.apiClient.put('/api/updateAccount', { ...account });
  }

  getAccountDetails(email: string): Promise<APIResponse> {
    return this.apiClient.get('/api/getUserDetailByEmail', { email });
  }
}
