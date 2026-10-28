import type { AccountPayload } from '../models/account';

export const API_MESSAGES = {
  methodNotSupported: 'This request method is not supported.',
  searchProductParameterMissing:
    'Bad request, search_product parameter is missing in POST request.',
  loginParametersMissing:
    'Bad request, email or password parameter is missing in POST request.',
  userExists: 'User exists!',
  userNotFound: 'User not found!',
  userCreated: 'User created!',
  accountDeleted: 'Account deleted!',
  userUpdated: 'User updated!',
} as const;

export const TEST_ACCOUNT = {
  name: 'Playwright API Tester',
  password: 'Playwright!2026',
  title: 'Mr',
  birth_date: '15',
  birth_month: '5',
  birth_year: '1990',
  firstname: 'Playwright',
  lastname: 'API Tester',
  company: 'Example QA',
  address1: '123 Test Street',
  address2: 'Suite 4',
  country: 'United States',
  zipcode: '90001',
  state: 'California',
  city: 'Los Angeles',
  mobile_number: '5551234567',
} as const;

export function createTestAccount(email: string): AccountPayload {
  return { ...TEST_ACCOUNT, email };
}
