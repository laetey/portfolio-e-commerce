import type { Page } from '@playwright/test';
import { LOGIN_USER } from '../constants/login-user.constants';
import { BasePage } from './base.page';

export class LoginPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  get heading() {
    return this.page.getByRole('heading', {
      name: LOGIN_USER.heading,
      exact: true,
    });
  }

  get invalidCredentialsError() {
    return this.page.getByText(LOGIN_USER.invalidCredentialsError, {
      exact: true,
    });
  }

  async login(email: string, password: string): Promise<void> {
    const loginForm = this.page.locator(LOGIN_USER.loginForm);
    await loginForm.locator(LOGIN_USER.emailField).fill(email);
    await loginForm.locator(LOGIN_USER.passwordField).fill(password);
    await loginForm
      .getByRole('button', { name: LOGIN_USER.loginButtonName, exact: true })
      .click();
  }
}
