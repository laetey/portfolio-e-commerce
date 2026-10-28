import { randomUUID } from 'node:crypto';
import { expect, test } from '@playwright/test';
import { ApiClient } from '../../api/clients/api-client';
import { API_MESSAGES, createTestAccount } from '../../api/constants/api.constants';
import type {
  AccountPayload,
  ApiMessageResponse,
  UserDetailsResponse,
} from '../../api/models/account';
import { AuthService } from '../../api/services/auth.service';

test.describe('Authentication and account APIs', () => {
  let authService: AuthService;
  let testAccount: AccountPayload;
  let accountExists = false;

  test.beforeEach(({ request }) => {
    authService = new AuthService(new ApiClient(request));
    testAccount = createTestAccount(`playwright-api-${randomUUID()}@example.com`);
    accountExists = false;
  });

  test.afterEach(async () => {
    if (!accountExists) return;

    await test.step('Delete the temporary test account', async () => {
      const response = await authService.deleteAccount(
        testAccount.email,
        testAccount.password,
      );
      expect(response.status()).toBe(200);

      const responseBody = await response.json() as ApiMessageResponse;
      if (responseBody.responseCode === 200) accountExists = false;
      expect(responseBody).toEqual({
        responseCode: 200,
        message: API_MESSAGES.accountDeleted,
      });
    });
  });

  async function createAccount(): Promise<void> {
    const response = await authService.createAccount(testAccount);
    expect(response.status()).toBe(200);

    const responseBody = await response.json() as ApiMessageResponse;
    accountExists = responseBody.responseCode === 201;
    expect(responseBody).toEqual({
      responseCode: 201,
      message: API_MESSAGES.userCreated,
    });
  }

  test.describe('API 7: POST To Verify Login with valid details', () => {
    test('confirms valid account credentials', async () => {
      await test.step('Create a temporary account for a valid login', createAccount);

      await test.step('Verify login with the temporary account credentials', async () => {
        const response = await authService.verifyLogin(
          testAccount.email,
          testAccount.password,
        );
        expect(response.status()).toBe(200);
        expect(await response.json()).toEqual({
          responseCode: 200,
          message: API_MESSAGES.userExists,
        });
      });
    });
  });

  test.describe('API 8: POST To Verify Login without email parameter', () => {
    test('reports the missing email parameter', async () => {
      await test.step('Verify login with password but no email', async () => {
        const response = await authService.verifyLogin(undefined, testAccount.password);
        expect(response.status()).toBe(200);
        expect(await response.json()).toEqual({
          responseCode: 400,
          message: API_MESSAGES.loginParametersMissing,
        });
      });
    });
  });

  test.describe('API 9: DELETE To Verify Login', () => {
    test('rejects the unsupported DELETE method', async () => {
      await test.step('Send a DELETE request to the login verification endpoint', async () => {
        const response = await authService.deleteLoginVerification();
        expect(response.status()).toBe(200);
        expect(await response.json()).toEqual({
          responseCode: 405,
          message: API_MESSAGES.methodNotSupported,
        });
      });
    });
  });

  test.describe('API 10: POST To Verify Login with invalid details', () => {
    test('reports invalid account credentials', async () => {
      await test.step('Verify login with an unknown email and password', async () => {
        const response = await authService.verifyLogin(
          `unknown-${randomUUID()}@example.com`,
          'Invalid!Password2026',
        );
        expect(response.status()).toBe(200);
        expect(await response.json()).toEqual({
          responseCode: 404,
          message: API_MESSAGES.userNotFound,
        });
      });
    });
  });

  test.describe('API 11: POST To Create/Register User Account', () => {
    test('creates an account', async () => {
      await test.step('Create a temporary account with all required fields', createAccount);
    });
  });

  test.describe('API 12: DELETE METHOD To Delete User Account', () => {
    test('deletes an existing account', async () => {
      await test.step('Create an account to delete', createAccount);

      await test.step('Delete the account and verify the response', async () => {
        const response = await authService.deleteAccount(
          testAccount.email,
          testAccount.password,
        );
        expect(response.status()).toBe(200);
        const responseBody = await response.json() as ApiMessageResponse;
        if (responseBody.responseCode === 200) accountExists = false;
        expect(responseBody).toEqual({
          responseCode: 200,
          message: API_MESSAGES.accountDeleted,
        });
      });
    });
  });

  test.describe('API 13: PUT METHOD To Update User Account', () => {
    test('updates an existing account', async () => {
      await test.step('Create an account to update', createAccount);

      await test.step('Update the account name and verify the response', async () => {
        testAccount.name = `${testAccount.name} Updated`;
        const response = await authService.updateAccount(testAccount);
        expect(response.status()).toBe(200);
        expect(await response.json()).toEqual({
          responseCode: 200,
          message: API_MESSAGES.userUpdated,
        });
      });

      await test.step('Verify the updated name is persisted', async () => {
        const response = await authService.getAccountDetails(testAccount.email);
        expect(response.status()).toBe(200);
        const responseBody = await response.json() as UserDetailsResponse;
        expect(responseBody.responseCode).toBe(200);
        expect(responseBody.user.name).toBe(testAccount.name);
      });
    });
  });

  test.describe('API 14: GET user account detail by email', () => {
    test('returns account details for the requested email', async () => {
      await test.step('Create a temporary account to retrieve', createAccount);

      await test.step('Retrieve the account details by email', async () => {
        const response = await authService.getAccountDetails(testAccount.email);
        expect(response.status()).toBe(200);
        const responseBody = await response.json() as UserDetailsResponse;
        expect(responseBody.responseCode).toBe(200);
        expect(responseBody.user.email).toBe(testAccount.email);
        expect(responseBody.user.name).toBe(testAccount.name);
      });
    });
  });
});
